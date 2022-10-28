/* ===============================================================================================================================================
   syncView

   Description
   This script synchronizes the scale ratio and position that current work area for all documents.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Open at least two files.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 1) main();
})();


function main() {
    var activeView = app.activeDocument.views[0];

    var activeWindow = {
        'zoom': activeView.zoom,
        'center': activeView.centerPoint
    };

    for (var i = 1; i < app.documents.length; i++) {
        var view = app.documents[i].views[0];
        view.zoom = activeWindow.zoom;
        view.centerPoint = activeWindow.center;
    }
}
