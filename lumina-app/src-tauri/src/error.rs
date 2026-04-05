use thiserror::Error;

#[derive(Error, Debug)]
pub enum ScanError {
    #[error("Erreur d'E/S système: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Erreur de sérialisation JSON: {0}")]
    Json(#[from] serde_json::Error),
    
    #[error("Erreur d'écriture CSV: {0}")]
    Csv(#[from] csv::Error),
    
    #[error("Chemin invalide ou inaccessible: {0}")]
    InvalidPath(String),
}

pub type ScanResult<T> = Result<T, ScanError>;