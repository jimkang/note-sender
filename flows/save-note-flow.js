var request = require('basic-browser-request');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();
var renderMessage = require('../dom/render-message');
var resetFields = require('../dom/reset-fields');
var resizeImage = require('../resize-image');
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');

const apiServerBaseURL = 'https://smidgeo.com/note-taker/note';
// const apiServerBaseURL = 'http://localhost:5678/note';
var lineBreakRegex = /\n/g;

function saveNoteFlow({ note, archive, password, file, maxSideLength }) {
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
    postFormData(reqOpts);
  } else {
    reqOpts.headers['Content-Type'] = 'application/json';
    reqOpts.body = note;
    request(reqOpts, sb(onSaved, handleError));
  }

  function postFormData(reqOpts) {
    let formData = new FormData();
    for (let key in note) {
      formData.append(key, note[key]);
    }
    formData.append('mediaFilename', file.name);
    formData.append('altText', note.caption.slice(0, 100));
    if (file.type.startsWith('video/')) {
      formData.append('isVideo', true);
    }

    if (file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      waterfall(
        [
          curry(getBufferFromFile)(file),
          curry(resizeImage)(file.type, maxSideLength),
          appendAndSend
        ],
        handleError
      );
    } else {
      appendAndSend(file, sb(onSaved, handleError));
    }

    function appendAndSend(buffer, done) {
      formData.append('buffer', buffer);
      reqOpts.formData = formData;
      request(reqOpts, done);
    }
  }

  function onSaved(res, body) {
    if (res.statusCode < 300 && res.statusCode > 199) {
      renderMessage({
        message: `Saved note: "${note.caption}".`,
        messageType: 'save-message'
      });
      resetFields();
    } else {
      handleError(
        new Error(`Could not save note. ${res.statusCode}: ${body.message}`)
      );
    }
  }
}

function getBufferFromFile(file, done) {
  var reader = new FileReader();
  reader.onload = passBuffer;
  reader.onerror = done;
  reader.readAsArrayBuffer(file);

  function passBuffer(e) {
    done(null, e.target.result);
  }
}

module.exports = saveNoteFlow;
