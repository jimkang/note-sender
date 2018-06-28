var d3 = require('d3-selection');
var of = require('object-form');

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});

function initListeners({ saveNoteFlow }) {
  if (listenersInit) {
    return;
  }
  listenersInit = true;

  d3.select('#submit-note-button').on('click', onSaveNote);

  function onSaveNote() {
    var note = objectFromDOM(window.document.getElementById('note-form'));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    var files = document.getElementById('media-file').files;
    var file;
    if (files.length > 0) {
      file = files[0];
    }
    saveNoteFlow({ note, archive, password, file });
  }
}

module.exports = initListeners;
