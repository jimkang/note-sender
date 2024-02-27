import CanvasImageOps from './canvas-image-ops';
import scanFlow from '../flows/scan-flow';
import OLPE from 'one-listener-per-element';

const entryMediaControlsBase = `
  <h5>Media file</h5>

  <canvas class="resize-canvas hidden"></canvas>
  <div class="image-controls hidden">
    <canvas class="thumbnail-canvas hidden"></canvas>
    <button class="rotate-button">Rotate image</button>
    <h5>Resize to this maximum length for image side</h5>
    (Set it to "unlimited" to not resize at all)
    <input type="text" class="max-image-side-length" value="2016" />
    <video class="video-preview hidden" controls></video>
    <audio class="audio-preview hidden" controls></audio>
    <button class="remove-image-button">Remove media </button>
    <button class="scan-button">Scan text into note body</button>
    <input class="alt-text" type="text" />
    <input class="send-image-raw-checkbox" type="checkbox" />
    <label for="send-image-raw-checkbox"
      >Send the image raw without resizing</label
    >
`;

var { on } = OLPE();

export function renderEntryMedia({ rootSel, file, idLabel }) {
  var mediaRoot = appendMediaHTML(rootSel, idLabel);

  var canvasImageOps = CanvasImageOps({ rootSel: '#' + mediaRoot.getAttribute('id') });

  var maxSideLengthField = mediaRoot.querySelector(
    '.max-image-side-length'
  );
  var imageControls = mediaRoot.querySelector('.image-controls');
  var videoPreviewEl = mediaRoot.querySelector('.video-preview');
  var audioPreviewEl = mediaRoot.querySelector('.audio-preview');
  var thumbnailEl = mediaRoot.querySelector('.thumbnail-canvas');

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
      videoPreviewEl.setAttribute('type', file.type);
      videoPreviewEl.classList.remove('hidden');
    } else if (file.type.startsWith('audio/')) {
      audioPreviewEl.setAttribute('src', URL.createObjectURL(file));
      audioPreviewEl.classList.remove('hidden');
    }
  }

  on(`${rootSel} .scan-button`, 'click', scanFlow);
  on(`${rootSel} .rotate-button`, 'click', canvasImageOps.rotate);
  on(`${rootSel} .remove-image-button`, 'click', onRemoveImage);

  return getMediaObject;

  function onRemoveImage() {
    // TODO: Remove file, too.
    canvasImageOps.clearCanvases();
    imageControls.classList.add('hidden');
  }

  async function getMediaObject() {
    let mediaFile = file;
    if (file.type.startsWith('image/')) {

  
      if (document.querySelector(
        `${rootSel} .send-image-raw-checkbox`
      ).checked
      ) {
        mediaFile = file;
      } else {
        mediaFile = await canvasImageOps.getImageFromCanvas();
      }
    }
    var altInputEl = document.querySelector(rootSel + ' .alt-text');
    return { file: mediaFile, filename: file.name, alt:  altInputEl.value };
  }
}

function appendMediaHTML(rootSel, idLabel) {
  var parentEl = document.querySelector(rootSel);
  var div = document.createElement('div');
  div.setAttribute('id', 'entry-media-' + idLabel);
  div.setAttribute('class', 'entry-media-controls');
  parentEl.append(div);
  div.innerHTML = entryMediaControlsBase;
  return div;
}
