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
    saveNoteFlow({
      note: objectFromDOM(window.document.getElementById('note-form')),
      archive: document.getElementById('archive').value,
      password: document.getElementById('password').value
    });
  }
}

module.exports = initListeners;
