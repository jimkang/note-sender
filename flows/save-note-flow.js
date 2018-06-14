var request = require('basic-browser-request');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();
var config = require('../config');
var renderMessage = require('../dom/render-message');

const apiServerBaseURL = 'https://smidgeo.com/note-taker/note';
var lineBreakRegex = /\n/g;

function saveNoteFlow({ note, archive }) {
  note.caption = note.caption.replace(lineBreakRegex, '<br>');
  var reqOpts = {
    method: 'POST',
    url: apiServerBaseURL,
    json: true,
    body: note,
    headers: {
      Authorization: `Key ${config.secret}`,
      'X-Note-Archive': archive,
      'Content-Type': 'application/json'
    }
  };
  request(reqOpts, sb(onSaved, handleError));

  function onSaved(res, body) {
    if (res.statusCode < 300 && res.statusCode > 199) {
      renderMessage({
        message: `Saved note: "${note.caption}".`,
        messageType: 'save-message'
      });
    } else {
      handleError(new Error(`Could not save note. ${res.statusCode}: ${body.message}`));
    }
  }
}

module.exports = saveNoteFlow;
