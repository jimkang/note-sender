/* global Tesseract */
var noteArea = document.getElementById('note-area');
var scanMessage = document.getElementById('scan-message');

function scanFlow({ file }) {
  scanMessage.textContent = 'Scanning…';
  scanMessage.classList.remove('hidden');
  Tesseract.recognize(file, 'eng').then(insertText, handleScanError);

  function insertText(scanResult) {
    scanMessage.classList.add('hidden');
    console.log(scanResult);
    if (scanResult.text) {
      noteArea.value =
        noteArea.value + `\n<blockquote>${scanResult.text}</blockquote>\n`;
    }
  }

  function handleScanError(error) {
    scanMessage.textContent = error.message;
    scanMessage.classList.remove('hidden');
  }
}

module.exports = scanFlow;
