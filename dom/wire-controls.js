var d3 = require('d3-selection');
var of = require('object-form');
var loadFileToCanvas = require('./canvas-image-ops').loadFileToCanvas;

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});

var noteArea = document.getElementById('note-area');
var maxSideLengthField = document.getElementById('max-image-side-length');

function wireControls({ saveNoteFlow }) {
  if (listenersInit) {
    return;
  }
  listenersInit = true;

  d3.select('#submit-note-button').on('click', onSaveNote);
  d3.select('#insert-link-button').on(
    'click',
    InsertIntoTextarea('<a href="URL"></a>')
  );
  d3.select('#insert-bq-button').on(
    'click',
    InsertIntoTextarea('<blockquote></blockquote>')
  );
  d3.select('#media-file').on('change', onMediaFileChange);

  function onSaveNote() {
    var note = objectFromDOM(document.getElementById('note-form'));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    var files = document.getElementById('media-file').files;

    var file;
    if (files.length > 0) {
      file = files[0];
    }
    saveNoteFlow({ note, archive, password, file });
  }

  function onMediaFileChange() {
    var file = this.files[0];
    var maxSideLength = +maxSideLengthField.value;
    if (file && file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      loadFileToCanvas({ file, mimeType: file.type, maxSideLength });
    }
  }
}

function InsertIntoTextarea(text) {
  return function insertIntoTextarea() {
    noteArea.value = noteArea.value + text;
  };
}

module.exports = wireControls;
