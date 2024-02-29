import { saveNoteFlow } from '../flows/save-note-flow';
import OLPE from 'one-listener-per-element';
import of from 'object-form';
import { renderEntryMedia } from './render-entry-media';

var objectFromDOM = of.ObjectFromDOM({});

var { on } = OLPE();

const entryBase = `<h4>Note</h4>
<section class="note-form ccol">
  <textarea class="note-area" data-of="caption"></textarea>
  <span>
    <button class="insert-link-button">Insert link</button>
    <button class="insert-bq-button">Insert blockquote</button>
  </span>
  <h5>Media for this entry</h5>
  <input type="file" class="entry-media-file" accept="image/*, video/*, audio/*, .m4a,.ogg,.mp3,.wav" multiple />

  <ul class="entry-media-list">
  </ul>
    <div class="scan-message progress-message hidden">Scanning…</div>
  </div>

  <button class="submit-note-button">Note!</button>
  <div class="saving-message progress-message hidden">Saving…</div>
</section>`;

export function renderEntry({ parentEl, id, files }) {
  var mediaGetters = [];

  const rootSel = '#' + id;
  var li = document.createElement('li');
  li.setAttribute('id', id);
  li.setAttribute('class', 'entry-container');
  parentEl.append(li);
  li.innerHTML = entryBase;

  var noteArea = document.querySelector(`${rootSel} .note-area`);

  if (files) {
    mediaGetters = files.map((file, i) =>
      renderEntryMedia({
        parentSel: rootSel + ' .entry-media-list',
        file,
        idLabel: i,
      }),
    );
  }

  on(`${rootSel} .submit-note-button`, 'click', onSaveNote);
  on(
    `${rootSel} .insert-link-button`,
    'click',
    insertIntoTextarea('<a href="URL"></a>'),
  );
  on(
    `${rootSel} .insert-bq-button`,
    'click',
    insertIntoTextarea('<blockquote></blockquote>'),
  );
  on(`${rootSel} .entry-media-file`, 'change', onMediaFileChange);

  async function onSaveNote() {
    var note = objectFromDOM(document.querySelector(`${rootSel} .note-form`));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;

    var mediaObjects = [];
    if (mediaGetters) {
      for (let getMediaObject of mediaGetters) {
        let mediaObject = await getMediaObject();
        if (mediaObject) {
          mediaObjects.push(mediaObject);
        }
      }
    }

    saveNoteFlow({
      note,
      archive,
      password,
      mediaObjects,
      rootSel,
    });
  }

  function insertIntoTextarea(text) {
    return function insertIntoTextarea() {
      noteArea.value = noteArea.value + text;
    };
  }

  function onMediaFileChange() {
    files = this.files;
    mediaGetters = [];
    for (let i = 0; i < files.length; ++i) {
      mediaGetters.push(
        renderEntryMedia({ parentSel: rootSel, file: files[i], idLabel: i }),
      );
    }
  }
}
