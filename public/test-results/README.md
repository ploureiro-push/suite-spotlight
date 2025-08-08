# Test Results Folder

Place your test result JSON files in this folder. The dashboard will automatically detect and load them.

## File Naming Convention

Name your files with a sequential number to ensure proper ordering:
- `test_run_001.json`
- `test_run_002.json` 
- `test_run_003.json`
- etc.

## Index File

Update the `index.json` file to list all available test result files:

```json
[
  "test_run_001.json",
  "test_run_002.json",
  "test_run_003.json"
]
```

The dashboard automatically refreshes every 30 seconds to check for new files.