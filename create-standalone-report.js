// Script to create a standalone HTML report with embedded videos
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const reportDir = 'playwright-report';
const outputZip = 'equivalency-download-test-report.zip';

// Create a zip file
const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', function() {
  const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Report packaged successfully!`);
  console.log(`📦 File: ${outputZip}`);
  console.log(`📊 Size: ${sizeMB} MB`);
  console.log(`\nInstructions to share with client:`);
  console.log(`1. Send ${outputZip} via email or file sharing service`);
  console.log(`2. Client extracts the zip file`);
  console.log(`3. Client opens 'index.html' in a browser`);
  console.log(`4. Videos will play inline in the report`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory(reportDir, false);
archive.finalize();
