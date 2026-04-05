use crate::models::ScanEntry;
use crate::error::ScanResult;
use std::fs::File;
use std::io::BufWriter;

pub fn to_json(entries: &[ScanEntry], path: &str) -> ScanResult<()> {
    let file = File::create(path)?;
    let writer = BufWriter::new(file);
    serde_json::to_writer_pretty(writer, entries)?;
    Ok(())
}