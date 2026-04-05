import { invoke } from "@tauri-apps/api/core";
import { Activity, CheckCircle2, Eraser, FileCheck, HardDrive, LayoutDashboard, Loader2, Settings, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import "./App.css";

// --- COMPOSANT : Nettoyeur Système (Design Premium) ---
function SystemCleaner() {
  const [loadingBin, setLoadingBin] = useState(false);
  const [loadingCache, setLoadingCache] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearBin = async () => {
    if (!window.confirm("Vider la corbeille définitivement ?")) return;
    setLoadingBin(true);
    try {
      const response = await invoke<string>("clear_recycle_bin");
      showNotification('success', response);
    } catch (err: any) { showNotification('error', err); } 
    finally { setLoadingBin(false); }
  };

  const handleClearCache = async () => {
    if (!window.confirm("Purger les fichiers temporaires ?")) return;
    setLoadingCache(true);
    try {
      const response = await invoke<string>("clear_temp_cache");
      showNotification('success', response);
    } catch (err: any) { showNotification('error', err); } 
    finally { setLoadingCache(false); }
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl p-6 rounded-[2rem] flex flex-col h-full shadow-2xl shadow-black/50 relative overflow-hidden">
      {/* Effet de brillance interne */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <Settings size={18} className="text-slate-400" />
        </div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Outils de Maintenance</h2>
      </div>
      
      {notification && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 text-xs font-medium border backdrop-blur-md animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {notification.msg}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-auto relative z-10">
        <button onClick={handleClearBin} disabled={loadingBin} className="group flex items-center justify-between p-4 bg-[#0B1121] hover:bg-[#111827] rounded-2xl border border-slate-800/80 transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]">
          <div className="flex items-center gap-4">
            <div className="text-rose-500 group-hover:scale-110 transition-transform duration-300">
              {loadingBin ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-bold">Vider la corbeille</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Libérer l'espace supprimé</p>
            </div>
          </div>
        </button>

        <button onClick={handleClearCache} disabled={loadingCache} className="group flex items-center justify-between p-4 bg-[#0B1121] hover:bg-[#111827] rounded-2xl border border-slate-800/80 transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-4">
            <div className="text-amber-500 group-hover:scale-110 transition-transform duration-300">
              {loadingCache ? <Loader2 size={20} className="animate-spin" /> : <Eraser size={20} />}
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-bold">Purger le Cache</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Nettoyer les fichiers temporaires</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// --- APPLICATION PRINCIPALE ---
function App() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function startScan() {
    setLoading(true);
    try {
      const data = await invoke("run_lumina_scan");
      setStats(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  return (
    // h-screen et overflow-hidden garantissent qu'il n'y aura JAMAIS de scroll
    <div className="h-screen w-screen bg-[#030712] text-slate-200 font-sans overflow-hidden flex flex-col relative selection:bg-blue-500/30">
      
      {/* Background Gradients pour un effet "Premium App" */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Conteneur principal avec marges fluides */}
      <div className="flex-1 flex flex-col p-6 md:p-8 max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* Header Premium */}
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                LUMINA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SCAN</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">AUDIT & OPTIMISATION DE STOCKAGE</p>
            </div>
          </div>

          <button 
            onClick={startScan} 
            disabled={loading} 
            className="relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {loading ? <Loader2 size={18} className="animate-spin text-blue-400" /> : <HardDrive size={18} className="text-blue-400" />}
            <span className="text-white relative z-10">{loading ? "Analyse système en cours..." : "Lancer le diagnostic"}</span>
          </button>
        </header>

        {/* Layout Principal en Grille (S'adapte parfaitement à l'écran) */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Colonne Gauche : Statistiques (Prend 8 colonnes sur 12) */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
            {stats ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-6 shrink-0">
                  <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="absolute top-4 right-4 p-2 bg-blue-500/10 rounded-xl text-blue-400"><HardDrive size={20} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Espace Occupé</p>
                    <div className="text-5xl font-black text-white tracking-tighter">
                      {stats.total_size_gb.toFixed(2)} <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">GB</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-4 right-4 p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><Activity size={20} /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Fichiers Indexés</p>
                    <div className="text-5xl font-black text-white tracking-tighter">
                      {stats.file_count.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Graphique de répartition (Flex-1 pour prendre l'espace restant en hauteur) */}
                <div className="flex-1 bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col min-h-0">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 shrink-0">Top Catégories</h3>
                  
                  <div className="flex-1 flex flex-col justify-between gap-2 overflow-hidden">
                    {stats.categories.slice(0, 6).map((cat: any) => (
                      <div key={cat.name} className="flex flex-col justify-center">
                        <div className="flex justify-between text-xs mb-2 font-semibold">
                          <span className="text-slate-200 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                            {cat.name}
                          </span>
                          <span className="text-slate-400">{cat.size_gb.toFixed(2)} GB</span>
                        </div>
                        <div className="h-2 w-full bg-[#0B1121] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${(cat.size_gb / stats.total_size_gb) * 100}%`, backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}80` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Empty State élégant
              <div className="flex-1 bg-white/[0.01] border border-white/[0.02] border-dashed rounded-[3rem] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
                  <Activity size={40} className="text-blue-500/50" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Système en attente</h3>
                <p className="text-slate-500 text-sm max-w-sm">Lancez le diagnostic pour générer les rapports d'analyse de votre espace de stockage.</p>
              </div>
            )}
          </div>

          {/* Colonne Droite : Outils & Logs (Prend 4 colonnes sur 12) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
            <div className="flex-1 min-h-0">
              <SystemCleaner />
            </div>

            {/* Notification de succès statique fixée en bas à droite si les stats sont chargées */}
            {stats && (
              <div className="shrink-0 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[2rem] flex items-center gap-4 backdrop-blur-md">
                <div className="bg-emerald-500/20 p-3 rounded-full">
                  <FileCheck className="text-emerald-400" size={24} />
                </div>
                <div>
                  <p className="text-emerald-50 font-bold text-sm">Exports terminés</p>
                  <p className="text-emerald-500/70 text-xs mt-0.5">CSV et JSON générés avec succès</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;