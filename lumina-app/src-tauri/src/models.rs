use serde::{Serialize, Deserialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum EntryType {
    File,
    Directory,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ScanEntry {
    pub name: String,
    pub size_bytes: u64,
    pub full_path: PathBuf,
    pub entry_type: EntryType,
}