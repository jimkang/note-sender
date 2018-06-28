var request = require('basic-browser-request');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();
var renderMessage = require('../dom/render-message');

const apiServerBaseURL = 'https://smidgeo.com/note-taker/note';
// const apiServerBaseURL = 'http://localhost:5678/note';
var lineBreakRegex = /\n/g;

function saveNoteFlow({ note, archive, password, file }) {
  note.caption = note.caption.replace(lineBreakRegex, '<br>');

  var reqOpts = {
    method: 'POST',
    url: apiServerBaseURL,
    json: true,
    headers: {
      Authorization: `Key ${password}`,
      'X-Note-Archive': archive
    }
  };

  if (file) {
    let formData = new FormData();
    for (let key in note) {
      formData.append(key, note[key]);
    }
    formData.append('mediaFilename', file.name);
    formData.append('altText', note.caption.slice(0, 100));
    formData.append('buffer', file);
    reqOpts.formData = formData;
  } else {
    reqOpts.headers['Content-Type'] = 'application/json';
    reqOpts.body = note;
  }
  request(reqOpts, sb(onSaved, handleError));

  function onSaved(res, body) {
    if (res.statusCode < 300 && res.statusCode > 199) {
      renderMessage({
        message: `Saved note: "${note.caption}".`,
        messageType: 'save-message'
      });
    } else {
      handleError(
        new Error(`Could not save note. ${res.statusCode}: ${body.message}`)
      );
    }
  }
}

module.exports = saveNoteFlow;
