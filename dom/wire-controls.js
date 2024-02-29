import { renderEntry } from '../dom/render-entry';
import OLPE from 'one-listener-per-element';

var { on } = OLPE();

var entriesRootEl = document.getElementById('entries');

export function wireControlsGlobal() {
  on(
    '#clear-entries-button',
    'click',
    () =>
      clearEntries() &&
      renderEntry({ parentEl: entriesRootEl, id: 'base-entry', files: [] }),
  );
  on('#media-file', 'change', onMediaFileChange);

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
    renderEntry({ parentEl: entriesRootEl, id, files: [file] });
  }

  function clearEntries() {
    entriesRootEl.innerHTML = '';
    return true;
  }
}
