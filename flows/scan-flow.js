/* global Tesseract */
var handleError = require('handle-error-web');
var noteArea = document.getElementById('note-area');

function scanFlow({ file }) {
  Tesseract.recognize(file, 'eng').then(insertText, handleError);

  function insertText(scanResult) {
    console.log(scanResult);
    if (scanResult.text) {
      noteArea.value =
        noteArea.value + `\n<blockquote>${scanResult.text}</blockquote>\n`;
    }
  }
}

module.exports = scanFlow;
