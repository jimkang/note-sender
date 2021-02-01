import RouteState from 'route-state';
import handleError from 'handle-error-web';
import { wireControlsGlobal } from './dom/wire-controls';
import { version } from './package.json';
import { renderEntry } from './dom/render-entry';

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
  renderEntry(document.getElementById('entries'), 'base-entry');
  wireControlsGlobal({
    rootSel: '#base-entry'
  });
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
