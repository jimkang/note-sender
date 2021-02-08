import OLPE from 'one-listener-per-element';
import of from 'object-form';
import CanvasImageOps from './canvas-image-ops';
import { renderEntry } from './render-entry';
import SaveNoteFlow from '../flows/save-note-flow';
import scanFlow from '../flows/scan-flow';

var { on } = OLPE();

var objectFromDOM = of.ObjectFromDOM({});
var entriesRootEl = document.getElementById('entries');

export function wireControlsGlobal() {
  on(
    '#clear-entries-button',
    'click',
    () => clearEntries() && renderEntry(entriesRootEl, 'base-entry')
  );
  on('#media-file', 'change', onMediaFileChange);

  wireControls({ rootSel: '#base-entry' });
  // If there are files already selected from a
  // previous load of this page, load them into
  // the entries.
  onMediaFileChange.bind(document.getElementById('media-file'))();

  function onMediaFileChange() {
    var files = this.files;
    if (files.length < 1) {
      return;
    }
    clearEntries();
    for (var i = 0; i < files.length; ++i) {
      loadFile(files[i], i);
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

  function clearEntries() {
    entriesRootEl.innerHTML = '';
    return true;
  }
}

export function wireControls({ rootSel, file }) {
  var saveNoteFlow = SaveNoteFlow({ rootSel });
  var canvasImageOps = CanvasImageOps({ rootSel });

  var noteArea = document.querySelector(`${rootSel} .note-area`);
  var maxSideLengthField = document.querySelector(
    `${rootSel} .max-image-side-length`
  );
  var imageControls = document.querySelector(`${rootSel} .image-controls`);
  var videoPreviewEl = document.querySelector(`${rootSel} .video-preview`);
  var audioPreviewEl = document.querySelector(`${rootSel} .audio-preview`);
  var thumbnailEl = document.querySelector(`${rootSel} .thumbnail-canvas`);

  on(`${rootSel} .submit-note-button`, 'click', onSaveNote);
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
  if (file) {
    imageControls.classList.remove('hidden');

    if (file.type.startsWith('image/') && !isNaN(maxSideLength)) {
      canvasImageOps.loadFileToCanvas({
        file,
        mimeType: file.type,
        maxSideLength
      });
      thumbnailEl.classList.remove('hidden');
    } else if (file.type.startsWith('video/')) {
      videoPreviewEl.setAttribute('src', URL.createObjectURL(file));
      videoPreviewEl.classList.remove('hidden');
    } else if (file.type.startsWith('audio/')) {
      audioPreviewEl.setAttribute('src', URL.createObjectURL(file));
      audioPreviewEl.classList.remove('hidden');
    }
  }

  function onSaveNote() {
    var note = objectFromDOM(document.querySelector(`${rootSel} .note-form`));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    saveNoteFlow({
      note,
      archive,
      password,
      file,
      canvasImageOps, // TODO: Just pass image?
      sendImageRaw: document.querySelector(
        `${rootSel} .send-image-raw-checkbox`
      ).checked
    });
  }

  function onScanClick() {
    if (scanFlow) {
      scanFlow({ rootSel, file });
    }
  }

  function onRemoveImage() {
    canvasImageOps.clearCanvases();
    imageControls.classList.add('hidden');
  }

  function insertIntoTextarea(text) {
    return function insertIntoTextarea() {
      noteArea.value = noteArea.value + text;
    };
  }
}
