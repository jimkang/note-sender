import OLPE from 'one-listener-per-element';
import of from 'object-form';
import CanvasImageOps from './canvas-image-ops';
import { renderEntry } from './render-entry';
import SaveNoteFlow from '../flows/save-note-flow';
import scanFlow from '../flows/scan-flow';

var { on } = OLPE();

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});
var entriesRootEl = document.getElementById('entries');

export function wireControlsGlobal() {
  on('#media-file', 'change', onMediaFileChange);
  //function getFile() {
  //var files = document.querySelector(`${rootSel} media-file').files;
  //
  //var file;
  //if (files.length > 0) {
  //file = files[0];
  //}
  //return file;
  //}

  function onMediaFileChange() {
    entriesRootEl.innerHTML = '';
    var files = this.files;
    for (var i = 0; i < files.length; ++i) {
      loadFile(files[i]);
    }
  }

  function loadFile(file, i) {
    // Create an entry for this.
    var id = `media-entry-${i}`;
    renderEntry(entriesRootEl, id);
    wireControls({
      rootSel: `#${id}`,
      file
    });
  }
}

export function wireControls({ rootSel, file }) {
  if (listenersInit) {
    return;
  }
  listenersInit = true;

  var saveNoteFlow = SaveNoteFlow();
  var canvasImageOps = CanvasImageOps({ rootSel });

  var noteArea = document.querySelector(`${rootSel} note-area`);
  var maxSideLengthField = document.querySelector(
    `${rootSel} .max-image-side-length`
  );
  var imageControls = document.querySelector(`${rootSel} image-controls`);
  on('.submit-note-button', 'click', onSaveNote);
  on(
    `${rootSel} .insert-link-button`,
    'click',
    insertIntoTextarea('<a href="URL"></a>')
  );
  on(
    `${rootSel} .insert-bq-button`,
    'click',
    insertIntoTextarea('<blockquote></blockquote>')
  );
  on(`${rootSel} .rotate-button`, 'click', canvasImageOps.rotateImage);
  on(`${rootSel} .scan-button`, 'click', onScanClick);

  on(`${rootSel} .remove-image-button`, 'click', onRemoveImage);

  var maxSideLength = +maxSideLengthField.value;
  if (file && file.type.startsWith('image/') && !isNaN(maxSideLength)) {
    canvasImageOps.loadFileToCanvas({
      file,
      mimeType: file.type,
      maxSideLength
    });
  }

  function onSaveNote() {
    var note = objectFromDOM(document.querySelector(`${rootSel} note-form`));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    saveNoteFlow({
      note,
      archive,
      password,
      file,
      canvasImageOps, // TODO: Just pass image?
      sendImageRaw: document.querySelector('.send-image-raw-checkbox').checked
    });
  }

  function onScanClick() {
    if (scanFlow) {
      scanFlow({ file });
    }
  }

  function onRemoveImage() {
    document.querySelector(`${rootSel} media-file`).value = '';
    canvasImageOps.clearCanvases();
    imageControls.classList.add('hidden');
  }

  function insertIntoTextarea(text) {
    return function insertIntoTextarea() {
      noteArea.value = noteArea.value + text;
    };
  }
}
