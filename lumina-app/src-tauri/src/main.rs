// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod scanner;
mod models;
mod error;
mod config;
mod exporter;
mod categorizer;

use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

// --- STRUCTURES POUR LES STATISTIQUES ---

#[derive(Serialize)]
pub struct CategoryStat {
    pub name: String,
    pub size_gb: f64,
    pub color: String,
}

#[derive(Serialize)]
pub struct FinalStats {
    pub total_size_gb: f64,
    pub file_count: usize,
    pub categories: Vec<CategoryStat>,
    pub report_path: String,
}

// --- COMMANDE 1 : AUDIT DU DISQUE ---

#[tauri::command]
async fn run_lumina_scan() -> Result<FinalStats, String> {
    // On récupère la configuration et le chemin cible
    let config = config::Config::default();
    let target_path = config.target_path.clone();

    // On déplace le travail lourd dans un thread dédié (évite de bloquer l'UI et les crashs Windows)
    let stats = tauri::async_runtime::spawn_blocking(move || {
        
        // 1. Scan complet via le module scanner
        let entries = scanner::run_scan(&target_path).map_err(|e| e.to_string())?;
        let file_count = entries.len();
        
        // 2. Définition d'un chemin d'exportation sécurisé (Dossier Documents de l'utilisateur)
        let docs_path = std::env::var("USERPROFILE")
            .map(|p| format!(r"{}\Documents\LuminaScan", p))
            .unwrap_or_else(|_| ".".to_string());

        // Créer le dossier s'il n'existe pas (évite les erreurs de dossier manquant)
        let _ = std::fs::create_dir_all(&docs_path);

        let csv_path = format!(r"{}\audit_report.csv", docs_path);
        let json_path = format!(r"{}\audit_report.json", docs_path);

        // 3. Exportation des rapports (on utilise les nouveaux chemins sécurisés)
        let _ = exporter::to_csv(&entries, &csv_path);
        let _ = exporter::to_json(&entries, &json_path);

        // 4. Calcul des statistiques par catégorie
        let mut total_bytes: u64 = 0;
        let mut cat_map: HashMap<String, u64> = HashMap::new();

        for e in &entries {
            total_bytes += e.size_bytes;
            let ext = e.full_path.extension()
                .map(|ext| ext.to_string_lossy().to_string())
                .unwrap_or_default();
                
            let cat = categorizer::get_category(&ext).to_string();
            *cat_map.entry(cat).or_insert(0) += e.size_bytes;
        }

        let colors = HashMap::from([
            ("Images".to_string(), "#3b82f6"), 
            ("Vidéos".to_string(), "#ef4444"),
            ("Documents".to_string(), "#10b981"), 
            ("Archives".to_string(), "#f59e0b"),
        ]);

        let categories: Vec<CategoryStat> = cat_map.into_iter().map(|(name, bytes)| {
            let color = colors.get(&name).unwrap_or(&"#64748b").to_string();
            CategoryStat {
                name,
                size_gb: bytes as f64 / 1_073_741_824.0,
                color,
            }
        }).collect();

        // On retourne le résultat avec le chemin vers le dossier de rapport
        Ok::<FinalStats, String>(FinalStats {
            total_size_gb: total_bytes as f64 / 1_073_741_824.0,
            file_count,
            categories,
            report_path: docs_path,
        })
    })
    .await
    .map_err(|e| format!("Erreur fatale du thread d'analyse : {}", e))??; 

    Ok(stats)
}

// --- COMMANDE 2 : VIDER LA CORBEILLE (WINDOWS) ---

#[tauri::command]
async fn clear_recycle_bin() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::UI::Shell::{
            SHEmptyRecycleBinW, SHERB_NOCONFIRMATION, SHERB_NOPROGRESSUI, SHERB_NOSOUND,
        };

        let flags = SHERB_NOCONFIRMATION | SHERB_NOPROGRESSUI | SHERB_NOSOUND;
        let result = unsafe { SHEmptyRecycleBinW(std::ptr::null_mut(), std::ptr::null(), flags) };

        match result {
            0 => Ok("La corbeille a été vidée avec succès.".into()),
            -2147418113 => Ok("La corbeille est déjà vide.".into()),
            _ => Err(format!("Erreur Windows API : {}", result))
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    Err("Fonctionnalité non supportée sur ce système.".into())
}

// --- COMMANDE 3 : NETTOYER LE CACHE TEMP ---

#[tauri::command]
async fn clear_temp_cache() -> Result<String, String> {
    let mut freed_bytes: u64 = 0;
    let mut deleted_files: u32 = 0;

    let temp_dirs = vec![
        std::env::temp_dir(), 
        PathBuf::from(r"C:\Windows\Temp"),
    ];

    for dir in temp_dirs {
        if let Ok(entries) = fs::read_dir(&dir) {
            for entry_result in entries {
                if let Ok(entry) = entry_result {
                    let path = entry.path();
                    let size = entry.metadata().map(|m| m.len()).unwrap_or(0);

                    if path.is_file() {
                        if fs::remove_file(&path).is_ok() {
                            freed_bytes += size;
                            deleted_files += 1;
                        }
                    } else if path.is_dir() {
                        if fs::remove_dir_all(&path).is_ok() {
                            deleted_files += 1;
                        }
                    }
                }
            }
        }
    }

    let freed_mb = freed_bytes as f64 / 1_048_576.0;
    Ok(format!("Nettoyage terminé : {} fichiers supprimés ({:.2} Mo libérés).", deleted_files, freed_mb))
}

// --- POINT D'ENTRÉE PRINCIPAL ---

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            run_lumina_scan, 
            clear_recycle_bin, 
            clear_temp_cache
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}