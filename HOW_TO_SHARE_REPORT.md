# How to Share Playwright Test Report with Videos

## Overview
Your Playwright report contains videos, screenshots, and traces. The entire `playwright-report` folder needs to be shared to preserve all media.

---

## Method 1: Zip and Email (Best for Small Teams)

### Steps:
1. **Create ZIP file:**
   - Right-click the `playwright-report` folder
   - Select "Send to" → "Compressed (zipped) folder"
   - Rename to: `Equivalency-Download-Test-Report.zip`

2. **Check file size:**
   - If < 25 MB: Attach directly to email
   - If > 25 MB: Use Method 2 or 3

3. **Email to client with these instructions:**
   ```
   Subject: Equivalency Download Test Report - All Tests Passed ✓

   Hi [Client Name],

   Please find attached the complete test execution report for the 
   Equivalency Download feature. All 24 tests have passed successfully.

   To view the report:
   1. Extract the ZIP file to a folder
   2. Double-click "index.html" to open in your browser
   3. Click on any test to view its execution video

   The report includes:
   - Video recordings of all 24 test executions
   - Screenshots and traces for detailed analysis
   - Complete test coverage documentation

   Best regards,
   [Your Name]
   ```

---

## Method 2: Cloud Storage (Best for Large Files)

### Option A: Google Drive
1. Upload `playwright-report` folder to Google Drive
2. Right-click folder → "Get link"
3. Set permission: "Anyone with the link can view"
4. Share link via email

### Option B: OneDrive/SharePoint
1. Upload folder to OneDrive
2. Click "Share" → "Anyone with the link"
3. Copy and send link

### Option C: WeTransfer (No login required)
1. Go to wetransfer.com
2. Upload the zipped folder
3. Enter client's email
4. Add message with viewing instructions
5. Send (files auto-delete after 7 days)

---

## Method 3: Network Share (Internal Teams Only)

1. Copy `playwright-report` folder to shared network drive
2. Send network path to client
3. Client opens `index.html` directly from network location

---

## Method 4: Host on Internal Web Server (Advanced)

If you have an internal web server:

1. Copy `playwright-report` to web server directory
2. Share URL: `http://your-server/playwright-report/`
3. Client views directly in browser (no download needed)

**Example with simple HTTP server:**
```bash
cd playwright-report
npx http-server -p 8080
```
Then share: `http://[your-ip]:8080`

---

## What's Included in the Report?

- **24 Test Videos** (WebM format, plays in all modern browsers)
- **Screenshots** (PNG format)
- **Execution Traces** (ZIP files for detailed debugging)
- **Interactive HTML Report** (no internet connection needed)

---

## File Size Information

Typical report size with all videos:
- ~50-150 MB for 24 tests (depends on video length)
- Videos: ~1-3 MB per test
- Each test video is 20-30 seconds (full execution)

---

## Viewing Requirements for Client

✓ Any modern web browser (Chrome, Edge, Firefox, Safari)
✓ No plugins or special software needed
✓ Works offline (all files are self-contained)
✓ Videos play natively in browser (WebM format)

---

## Troubleshooting

**If videos don't play:**
- Try different browser (Chrome recommended)
- Check if WebM codec is supported
- Ensure all files were extracted from ZIP

**If report looks broken:**
- Make sure entire folder structure was extracted
- Don't move/delete any files in the `data` or `trace` folders
- Open `index.html` from local file system (not from ZIP)

---

## Best Practices

1. ✓ Always include `INSTRUCTIONS_FOR_CLIENT.txt` in the ZIP
2. ✓ Name ZIP file with date: `Test-Report_2025-01-29.zip`
3. ✓ Verify ZIP file opens correctly before sending
4. ✓ Keep original report folder as backup
5. ✓ For recurring reports, use consistent naming convention

---

## Quick Commands

**Package report with timestamp:**
```powershell
$date = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path playwright-report\* -DestinationPath "Test-Report_$date.zip"
```

**Check report size:**
```powershell
Get-ChildItem playwright-report -Recurse | Measure-Object -Property Length -Sum
```

---

## Sample Email Template

```
Subject: ✓ Equivalency Download Test Report - 24/24 Tests Passed

Dear [Client Name],

I'm pleased to share the complete test execution report for the 
Equivalency Download feature testing cycle.

**Test Results Summary:**
- Total Tests: 24
- Passed: 24 ✓
- Failed: 0
- Execution Time: 8.1 minutes

**Test Coverage:**
✓ Navigation and Access Tests (2)
✓ Date Range Filter Tests (6)
✓ Source State Filter Tests (2)
✓ Source Institution Filter Tests (2)
✓ Target Subject Filter Tests (3)
✓ Combined Filter Tests (2)
✓ Downloaded File Validation (3)
✓ Error Handling Tests (2)
✓ UI/UX Tests (2)

**How to View:**
1. Download and extract the attached ZIP file
2. Open "index.html" in any browser
3. Click on test names to view execution videos

**What's Included:**
- Complete video recordings of all test executions
- Screenshots at key steps
- Detailed execution traces
- Pass/fail status for each test

All videos play directly in the browser - no special software needed.

Please let me know if you have any questions or need clarification 
on any test results.

Best regards,
[Your Name]
[Your Title]
```
