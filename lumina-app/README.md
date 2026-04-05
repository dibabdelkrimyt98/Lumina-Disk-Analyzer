# 🌌 LuminaScan

**LuminaScan** est un outil de diagnostic et d'optimisation de stockage haute performance conçu pour Windows. Alliant la puissance brute de **Rust** à la flexibilité de **Tauri** et **React**, il offre une analyse ultra-rapide de millions de fichiers avec une interface moderne et intuitive.

---

## ✨ Fonctionnalités Clés

* 🚀 **Scan Haute Performance :** Analyse de millions de fichiers en quelques secondes grâce à un moteur multithreadé en Rust.
* 📊 **Visualisation Intelligente :** Répartition automatique par catégories (Exécutables, Code Source, Médias, etc.).
* 🧹 **Outils de Maintenance :**
    * Vidage sécurisé de la corbeille via l'API système Windows.
    * Purge du cache temporaire et des fichiers système inutiles.
* 📄 **Rapports d'Audit :** Exportation automatique des résultats aux formats **CSV** et **JSON**.
* 🎨 **Interface Moderne :** Design Dark-Mode avec esthétique Glassmorphism.

---

## 📸 Aperçu de l'interface

### Tableau de bord principal
Visualisez instantanément l'occupation de votre disque et la répartition des fichiers.
![Tableau de bord](./screenshots/dashboard.png)

### Analyse en temps réel
Suivi précis de la progression et retour visuel sur l'état du système.
![Analyse en cours](./screenshots/scanning.png)

---

## 🛠 Stack Technique

* **Core :** [Rust](https://www.rust-lang.org/) (Performance & Sécurité mémoire)
* **Framework Desktop :** [Tauri](https://tauri.app/)
* **Frontend :** [React](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/)
* **Moteur de scan :** `jwalk` (Parcours de fichiers parallèle)

---

## 🚀 Installation & Développement

### Prérequis
* Node.js (LTS)
* Rust (dernière version stable)

### Setup rapide
1.  **Cloner le projet :**
    ```bash
    git clone [https://github.com/[votre-pseudo]/LuminaScan.git](https://github.com/[votre-pseudo]/LuminaScan.git)
    ```
2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
3.  **Lancer en mode développement :**
    ```bash
    npm run tauri dev
    ```

---

## 🗺️ Roadmap

- [ ] **Mode Expert Développeur :** Nettoyage ciblé des `node_modules`, `target`, et `.venv`.
- [ ] **Historique & Snapshots :** Comparaison de deux analyses pour voir l'évolution du stockage.
- [ ] **Détecteur de Doublons :** Identification de fichiers identiques par Hash.

---

## ⚖️ Licence

Ce projet est sous licence **MIT**.