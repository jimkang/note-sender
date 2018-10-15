var d3 = require('d3-selection');
var of = require('object-form');
var canvasImageOps = require('./canvas-image-ops');

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
  d3.select('#rotate-button').on('click', canvasImageOps.rotateImage);

  var file = getFile();
  if (file) {
    loadFile(file);
  }

  function onSaveNote() {
    var note = objectFromDOM(document.getElementById('note-form'));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    saveNoteFlow({ note, archive, password, file: getFile });
  }

  function onMediaFileChange() {
    var file = this.files[0];
    loadFile(file);
  }

  function loadFile(file) {
    var maxSideLength = +maxSideLengthField.value;
    if (file && file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      canvasImageOps.loadFileToCanvas({ file, mimeType: file.type, maxSideLength });
    }
  }
}

function InsertIntoTextarea(text) {
  return function insertIntoTextarea() {
    noteArea.value = noteArea.value + text;
  };
}

function getFile() {
  var files = document.getElementById('media-file').files;

  var file;
  if (files.length > 0) {
    file = files[0];
  }
  return file;
}

module.exports = wireControls;
