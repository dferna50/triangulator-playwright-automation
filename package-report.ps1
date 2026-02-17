# PowerShell script to package Playwright report for sharing
# Usage: .\package-report.ps1

$reportPath = "playwright-report"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$zipName = "Equivalency-Download-Test-Report_$timestamp.zip"

Write-Host "Packaging test report..." -ForegroundColor Cyan

# Remove old zip if exists
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

# Create zip with all report files including videos
Compress-Archive -Path $reportPath\* -DestinationPath $zipName -CompressionLevel Optimal

if (Test-Path $zipName) {
    $size = [math]::Round((Get-Item $zipName).Length / 1MB, 2)
    Write-Host "Report packaged successfully!" -ForegroundColor Green
    Write-Host "File: $zipName" -ForegroundColor Yellow
    Write-Host "Size: $size MB" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Instructions for client:" -ForegroundColor Cyan
    Write-Host "  1. Send $zipName via email or file sharing service"
    Write-Host "  2. Client extracts the zip file to a folder"
    Write-Host "  3. Client double-clicks 'index.html' to open in browser"
    Write-Host "  4. Videos play automatically within the report"
    Write-Host ""
    Write-Host "Tip: For large files (>25MB), use Google Drive, OneDrive, or WeTransfer" -ForegroundColor Gray
} else {
    Write-Host "Failed to create zip file" -ForegroundColor Red
}
