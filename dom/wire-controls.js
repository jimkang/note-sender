import OLPE from 'one-listener-per-element';
import of from 'object-form';

var { on } = OLPE();

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});

var noteArea = document.getElementById('note-area');
var maxSideLengthField = document.getElementById('max-image-side-length');
var imageControls = document.getElementById('image-controls');

export default function wireControls({
  saveNoteFlow,
  scanFlow,
  imageCanvasOps
}) {
  if (listenersInit) {
    return;
  }
  listenersInit = true;

  on('#submit-note-button', 'click', onSaveNote);
  on('#insert-link-button', 'click', InsertIntoTextarea('<a href="URL"></a>'));
  on(
    '#insert-bq-button',
    'click',
    InsertIntoTextarea('<blockquote></blockquote>')
  );
  on('#media-file', 'change', onMediaFileChange);
  on('#rotate-button', 'click', imageCanvasOps.rotateImage);
  on('#scan-button', 'click', onScanClick);

  on('#remove-image-button', 'click', onRemoveImage);

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
    imageCanvasOps.clearCanvases();
    imageControls.classList.add('hidden');
  }

  function loadFile(file) {
    imageControls.classList.remove('hidden');

    var maxSideLength = +maxSideLengthField.value;
    if (file && file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      imageCanvasOps.loadFileToCanvas({
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
