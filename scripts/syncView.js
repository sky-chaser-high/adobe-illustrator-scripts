/* ===============================================================================================================================================
   syncView

   Description
   This script synchronizes all open windows with the zoom factor and the view position of the active window.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Open at least two files.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.1

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 1 && isValidVersion()) main();
})();


function main() {
    var view = app.activeDocument.activeView;
    var documents = app.documents;
    for (var i = 1; i < documents.length; i++) {
        var document = documents[i];
        syncView(document, view);
    }
}


function syncView(document, activeView) {
    var target = {
        zoom: activeView.zoom,
        center: activeView.centerPoint
    };
    var views = document.views;
    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view == activeView) continue;
        view.zoom = target.zoom;
        view.centerPoint = target.center;
    }
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
