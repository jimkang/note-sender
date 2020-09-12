import RouteState from 'route-state';
import handleError from 'handle-error-web';
import wireControls from './dom/wire-controls';
import SaveNoteFlow from './flows/save-note-flow';
import scanFlow from './flows/scan-flow';
import { version } from './package.json';
import ImageCanvasOps from 'image-canvas-ops';

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
