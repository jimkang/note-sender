import OLPE from 'one-listener-per-element';

var { on } = OLPE();

var entriesRootEl = document.getElementById('entries');

export function wireMediaFileControl({ controlId, onFilesChange }) {
  on('#' + controlId, 'change', onMediaFileChange);

  // If there are files already selected from a
  // previous load of this page, pass them to the callback.

  onMediaFileChange.bind(document.getElementById(controlId))();

  function onMediaFileChange() {
    var files = this.files;
    if (files.length < 1) {
      return;
    }
    for (var i = 0; i < files.length; ++i) {
      loadFile(files[i], i);
    }
  }

  function loadFile(file, i) {
    // Create an entry for this.
    var id = `media-entry-${i}`;
    entryFlow({ entriesRootEl, id, files: [file] });
  }

  function clearEntries() {
    entriesRootEl.innerHTML = '';
    return true;
  }
}
