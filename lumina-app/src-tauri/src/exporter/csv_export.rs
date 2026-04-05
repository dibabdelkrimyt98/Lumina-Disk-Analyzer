use crate::models::ScanEntry;
use crate::error::ScanResult;
use std::fs::File;

pub fn to_csv(entries: &[ScanEntry], path: &str) -> ScanResult<()> {
    let file = File::create(path)?;
    let mut wtr = csv::Writer::from_writer(file);

    wtr.write_record(&["name", "size_bytes", "full_path", "type"])?;

    // On utilise un buffer réutilisable pour la taille afin d'éviter les allocations
    let mut size_buf = itoa::Buffer::new(); 

    for entry in entries {
        let type_str = match entry.entry_type {
            crate::models::EntryType::File => "file",
            crate::models::EntryType::Directory => "directory",
        };

        wtr.write_record(&[
            &entry.name,
            size_buf.format(entry.size_bytes), // Plus rapide que .to_string()
            &entry.full_path.to_string_lossy(),
            type_str,
        ])?;
    }

    wtr.flush()?;
    Ok(())
}