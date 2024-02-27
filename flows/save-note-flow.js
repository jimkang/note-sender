import request from 'basic-browser-request';
import handleError from 'handle-error-web';
import oknok from 'oknok';
import renderMessage from '../dom/render-message';
import resetFields from '../dom/reset-fields';

const apiServerBaseURL = 'https://smidgeo.com/note-taker/note';
// const apiServerBaseURL = 'http://localhost:5678/note';
var lineBreakRegex = /\n/g;

export function saveNoteFlow({
  note,
  archive,
  password,
  mediaObjects,
  rootSel
}) {
  var savingMessage = document.querySelector(`${rootSel} .saving-message`);
  savingMessage.textContent = 'Saving…';
  savingMessage.classList.remove('hidden');

  note.caption = note.caption.replace(lineBreakRegex, '<br>');

  var reqOpts = {
    method: 'POST',
    url: apiServerBaseURL,
    json: true,
    headers: {
      Authorization: `Key ${password}`,
      'X-Note-Archive': archive
    }
  };

  if (mediaObjects && mediaObjects.length > 0) {
    reqOpts.formData = getFormData({ mediaObjects, note });
  } else {
    // This can go out as just a JSON post.
    reqOpts.headers['Content-Type'] = 'application/json';
    reqOpts.body = note;
  }

  request(reqOpts, oknok({ ok: onSaved, nok: handleError }));

  function onSaved(res, body) {
    if (res.statusCode < 300 && res.statusCode > 199) {
      renderMessage({
        message: `Saved note: "${note.caption}".`,
        sel: `${rootSel} .saving-message`
      });
      resetFields();
    } else {
      renderMessage({
        message: `Could not save note. ${res.statusCode}: ${body.message}`,
        sel: `${rootSel} .saving-message`
      });
    }
  }
}

function getFormData({ mediaObjects, note }) {
  let formData = new FormData();
  for (let key in note) {
    formData.append(key, note[key]);
  }

  if (mediaObjects) {
    mediaObjects.forEach((mediaObject, i) => formData.append('buffer' + i, mediaObject.file));
    formData.append('mediaFiles', JSON.stringify(mediaObjects.map(getMediaFileMetadata)));
  }
  return formData;
}

function getMediaFileMetadata(mediaObject) {
  return {
    filename: mediaObject.filename,
    alt: mediaObject.alt,
    isVideo: mediaObject.file.type.startsWith('video/'),
    isAudio: mediaObject.file.type.startsWith('audio/') 
  };
}
