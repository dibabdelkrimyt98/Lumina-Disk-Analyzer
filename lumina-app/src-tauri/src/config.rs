pub struct Config {
    pub target_path: String,
    pub min_dir_size_threshold: u64,
    pub output_csv: String,
    pub output_json: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            target_path: if cfg!(windows) { "C:\\".to_string() } else { "/".to_string() },
            min_dir_size_threshold: 50 * 1024 * 1024, // 50 Mo
            output_csv: "scan_report.csv".to_string(),
            output_json: "scan_report.json".to_string(),
        }
    }
}