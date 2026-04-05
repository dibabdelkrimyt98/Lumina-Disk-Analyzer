use std::collections::HashMap;
use std::path::PathBuf;
use crate::models::{ScanEntry, EntryType};

pub fn process_directory_sizes(
    entries: &[ScanEntry], 
    threshold: u64
) -> Vec<ScanEntry> {
    let mut dir_map: HashMap<PathBuf, u64> = HashMap::new();

    // Calculer la taille cumulée pour chaque dossier parent
    for entry in entries {
        if let Some(parent) = entry.full_path.parent() {
            for ancestor in parent.ancestors() {
                let count = dir_map.entry(ancestor.to_path_buf()).or_insert(0);
                *count += entry.size_bytes;
            }
        }
    }

    // Filtrer les dossiers dépassant le seuil
    dir_map.into_iter()
        .filter(|(_, size)| *size >= threshold)
        .map(|(path, size)| ScanEntry {
            name: path.file_name()
                .map(|n| n.to_string_lossy().into_owned())
                .unwrap_or_else(|| "/".to_string()),
            size_bytes: size,
            full_path: path,
            entry_type: EntryType::Directory,
        })
        .collect()
}