var request = require('basic-browser-request');
var handleError = require('handle-error-web');
var oknok = require('oknok');
var renderMessage = require('../dom/render-message');
var resetFields = require('../dom/reset-fields');
var waterfall = require('async-waterfall');
var canvasImageOps = require('../dom/canvas-image-ops');

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
    postFormData(reqOpts);
  } else {
    reqOpts.headers['Content-Type'] = 'application/json';
    reqOpts.body = note;
    request(reqOpts, oknok({ ok: onSaved, nok: handleError }));
  }

  // This function assumes we have a file.
  function postFormData(reqOpts) {
    let formData = new FormData();
    for (let key in note) {
      formData.append(key, note[key]);
    }
    formData.append('mediaFilename', file.name);
    formData.append('altText', note.caption.slice(0, 100));
    if (file.type.startsWith('video/')) {
      formData.append('isVideo', true);
      appendAndSend(file, oknok({ ok: onSaved, nok: handleError }));
    } else if (canvasImageOps.canvasHasImage()) {
      waterfall(
        [
          canvasImageOps.getImageFromCanvas,
          // writeToDebugImage,
          appendAndSend,
          onSaved
        ],
        handleError
      );
    } else {
      throw new Error(
        'Unknown file: No image is loaded to canvas, nor is the file a video.'
      );
    }

    function appendAndSend(fileBlob, done) {
      formData.append('buffer', fileBlob);
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

/*

function getBufferFromFile(file, done) {
  var reader = new FileReader();
  reader.onload = passBuffer;
  reader.onerror = done;
  reader.readAsArrayBuffer(file);

  function passBuffer(e) {
    done(null, e.target.result);
  }
}

function getFileBlobFromBuffer(name, type, buffer, done) {
  callNextTick(done, null, new File(buffer, name, { type }));
}

function writeToDebugImage(fileBlob) {
  var img = new Image(300, 300);
  img.src = URL.createObjectURL(fileBlob);
  document.body.appendChild(img);
}

*/

module.exports = saveNoteFlow;
