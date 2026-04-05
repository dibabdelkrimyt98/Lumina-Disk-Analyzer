pub fn get_category(ext: &str) -> &str {
    match ext {
        "jpg" | "png" | "svg" | "gif" => "Images",
        "mp4" | "mkv" | "mov" | "avi" => "Vidéos",
        "rs" | "js" | "py" | "cpp" | "html" | "css" => "Code Source",
        "pdf" | "docx" | "xlsx" | "txt" => "Documents",
        "zip" | "tar" | "gz" | "rar" => "Archives",
        "exe" | "msi" | "dll" => "Exécutables",
        _ => "Autres",
    }
}