var RouteState = require('route-state');
var handleError = require('handle-error-web');
var wireControls = require('./dom/wire-controls');
var saveNoteFlow = require('./flows/save-note-flow');
var scanFlow = require('./flows/scan-flow');

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(async function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function followRoute() {
  wireControls({ addToRoute: routeState.addToRoute, saveNoteFlow, scanFlow });
}
