var d3 = require('d3-selection');
var of = require('object-form');

var listenersInit = false;
var objectFromDOM = of.ObjectFromDOM({});

var noteArea = document.getElementById('note-area');

function wireControls({ saveNoteFlow }) {
  if (listenersInit) {
    return;
  }
  listenersInit = true;

  d3.select('#submit-note-button').on('click', onSaveNote);
  d3.select('#insert-link-button').on(
    'click',
    InsertIntoTextarea('<a href="URL"></a>')
  );
  d3.select('#insert-bq-button').on(
    'click',
    InsertIntoTextarea('<blockquote></blockquote>')
  );

  function onSaveNote() {
    var note = objectFromDOM(document.getElementById('note-form'));
    var archive = document.getElementById('archive').value;
    var password = document.getElementById('password').value;
    var files = document.getElementById('media-file').files;
    var maxSideLength = document.getElementById('max-image-side-length').value;

    var file;
    if (files.length > 0) {
      file = files[0];
    }
    saveNoteFlow({ note, archive, password, file, maxSideLength });
  }
}

function InsertIntoTextarea(text) {
  return function insertIntoTextarea() {
    noteArea.value = noteArea.value + text;
  };
}

module.exports = wireControls;
