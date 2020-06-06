var RouteState = require('route-state');
var handleError = require('handle-error-web');
var wireControls = require('./dom/wire-controls');
var SaveNoteFlow = require('./flows/save-note-flow');
var scanFlow = require('./flows/scan-flow');
var { version } = require('./package.json');
var ImageCanvasOps = require('image-canvas-ops');

var imageCanvasOps = ImageCanvasOps({
  canvas: document.getElementById('resize-canvas'),
  thumbnailCanvas: document.getElementById('thumbnail-canvas')
});

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(async function go() {
  renderVersion();
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function followRoute() {
  wireControls({
    addToRoute: routeState.addToRoute,
    saveNoteFlow: SaveNoteFlow({ imageCanvasOps }),
    scanFlow,
    imageCanvasOps
  });
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
