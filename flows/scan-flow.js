/* global Tesseract */
var alphaCharsAroundNewline = /(\w)\n(\w)/g;

export default function scanFlow({ rootSel, file }) {
  var noteArea = document.querySelector(`${rootSel} .note-area`);
  var scanMessage = document.querySelector(`${rootSel} .scan-message`);

  scanMessage.textContent = 'Scanning…';
  scanMessage.classList.remove('hidden');
  Tesseract.recognize(file, 'eng').then(insertText, handleScanError);

  function insertText(scanResult) {
    scanMessage.classList.add('hidden');
    //console.log(scanResult);
    if (scanResult.text) {
      const scannedText = scanResult.text
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
