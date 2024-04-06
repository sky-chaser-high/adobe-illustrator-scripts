/* ===============================================================================================================================================
   navigateToPreviousArtboard

   Description
   This script navigates to the previous artboard while maintaining the view position and zoom factor of the artboard.
   If it is the first artboard, navigate to the last artboard.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   At least two artboards are required.
   It is more effective if the artboards are the same size.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var document = app.activeDocument;
    var artboards = document.artboards;
    if (artboards.length < 2) return;

    var view = document.activeView;

    var current = artboards.getActiveArtboardIndex();
    var distance = getDistance(view, artboards[current]);

    var previous = (current) ? current - 1 : artboards.length - 1;
    artboards.setActiveArtboardIndex(previous);

    setViewPosition(view, artboards[previous], distance);
}


function setViewPosition(view, artboard, distance) {
    var rect = artboard.artboardRect;
    var position = {
        x: rect[0] + distance.x,
        y: rect[1] + distance.y
    };
    view.centerPoint = [
        position.x,
        position.y
    ];
}


function getDistance(view, artboard) {
    var center = view.centerPoint;
    var rect = artboard.artboardRect;
    return {
        x: center[0] - rect[0],
        y: center[1] - rect[1]
    };
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}
