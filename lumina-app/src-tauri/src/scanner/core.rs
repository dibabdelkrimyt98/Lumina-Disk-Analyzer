use jwalk::WalkDir;
use crate::models::{ScanEntry, EntryType};
use crate::error::ScanResult;

pub fn run_scan(root: &str) -> ScanResult<Vec<ScanEntry>> {
    let entries = WalkDir::new(root)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .map(|entry| {
            let path = entry.path();
            ScanEntry {
                name: path.file_name()
                    .map(|n| n.to_string_lossy().into_owned())
                    .unwrap_or_default(),
                size_bytes: entry.metadata().map(|m| m.len()).unwrap_or(0),
                full_path: path,
                entry_type: EntryType::File,
            }
        })
        .collect();

    Ok(entries)
}