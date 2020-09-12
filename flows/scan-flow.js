/* global Tesseract */
var sanitizeHTML = require('sanitize-html');

var noteArea = document.getElementById('note-area');
var scanMessage = document.getElementById('scan-message');

var alphaCharsAroundNewline = /(\w)\n(\w)/g;

function scanFlow({ file }) {
  scanMessage.textContent = 'Scanning…';
  scanMessage.classList.remove('hidden');
  Tesseract.recognize(file, 'eng').then(insertText, handleScanError);

  function insertText(scanResult) {
    scanMessage.classList.add('hidden');
    //console.log(scanResult);
    if (scanResult.text) {
      const scannedText = sanitizeHTML(scanResult.text, {
        allowedTags: []
      })
        .trim()
        .replace(alphaCharsAroundNewline, '$1 $2');
      noteArea.value =
        noteArea.value + `\n<blockquote>${scannedText}</blockquote>\n`;
    }
  }

  function handleScanError(error) {
    scanMessage.textContent = error.message;
    scanMessage.classList.remove('hidden');
  }
}

module.exports = scanFlow;
