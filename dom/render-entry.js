const entryBase = `<h4>Note</h4>
  <textarea class="note-area" data-of="caption"></textarea>
  <span>
    <button class="insert-link-button">Insert link</button>
    <button class="insert-bq-button">Insert blockquote</button>
  </span>
  <h5>Media controls</h5>
  <canvas class="resize-canvas hidden"></canvas>
  <div class="image-controls" class="hidden">
    <canvas class="thumbnail-canvas"></canvas>
    <button class="rotate-button">Rotate image</button>
    <h5>Resize to this maximum length for image side</h5>
    (Set it to "unlimited" to not resize at all)
    <input type="text" class="max-image-side-length" value="2016" />
    <button class="remove-image-button">Remove image</button>
    <button class="scan-button">Scan text into note body</button>
    <input class="send-image-raw-checkbox" type="checkbox" />
    <label for="send-image-raw-checkbox"
      >Send the image raw without resizing</label
    >
    <div class="scan-message progress-message hidden">Scanning…</div>
  </div>

  <button class="submit-note-button">Note!</button>
  <div class="saving-message progress-message hidden">Saving…</div>
`;

export function renderEntry(parentEl, id) {
  var li = document.createElement('li');
  li.setAttribute('id', id);
  li.setAttribute('class', 'entry-container');
  parentEl.append(li);
  li.innerHTML = entryBase;
}
