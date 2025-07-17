// scripts/patch-pdf-parse.js
const fs = require('fs');
const path = require('path');

const pdfParsePath = path.join(__dirname, '../node_modules/pdf-parse/index.js');

if (fs.existsSync(pdfParsePath)) {
  let content = fs.readFileSync(pdfParsePath, 'utf8');
  // Regex to match the test/debug block
  const testBlockRegex = /let isDebugMode = !module\.parent;[\s\S]*?if \(isDebugMode\) \{[\s\S]*?\n\}/m;
  if (testBlockRegex.test(content)) {
    content = content.replace(testBlockRegex, '// [pdf-parse patch] test/debug block removed by patch-pdf-parse.js');
    fs.writeFileSync(pdfParsePath, content, 'utf8');
    console.log('Patched pdf-parse: test/debug block removed.');
  } else {
    console.log('No test/debug block found in pdf-parse, or already patched.');
  }
} else {
  console.warn('pdf-parse not found in node_modules. Skipping patch.');
} 