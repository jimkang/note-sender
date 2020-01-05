var d3 = require('d3-selection');
var of = require('object-form');
var canvasImageOps = require('./canvas-image-ops');

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});

var noteArea = document.getElementById('note-area');
var maxSideLengthField = document.getElementById('max-image-side-length');
var imageControls = document.getElementById('image-controls');

function wireControls({ saveNoteFlow, scanFlow }) {
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
  d3.select('#scan-button').on('click', onScanClick);
  d3.select('#remove-image-button').on('click', onRemoveImage);

  var file = getFile();
  if (file) {
    loadFile(file);
  }

  function onSaveNote() {
    var note = objectFromDOM(document.getElementById('note-form'));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    saveNoteFlow({
      note,
      archive,
      password,
      file: getFile(),
      sendImageRaw: document.getElementById('send-image-raw-checkbox').checked
    });
  }

  function onScanClick() {
    if (scanFlow) {
      scanFlow({ file: getFile() });
    }
  }

  function onMediaFileChange() {
    var file = this.files[0];
    loadFile(file);
  }

  function onRemoveImage() {
    document.getElementById('media-file').value = '';
    canvasImageOps.clearCanvases();
    imageControls.classList.add('hidden');
  }

  function loadFile(file) {
    imageControls.classList.remove('hidden');

    var maxSideLength = +maxSideLengthField.value;
    if (file && file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      canvasImageOps.loadFileToCanvas({
        file,
        mimeType: file.type,
        maxSideLength
      });
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
