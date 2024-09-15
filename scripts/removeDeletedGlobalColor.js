/* ===============================================================================================================================================
   removeDeletedGlobalColor

   Description
   This script deletes the Deleted Global Colors displayed in the Separations Preview panel.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to delete it.
   In this case, restart Illustrator and try again.
   If you save the file and reopen it, it may be restored.
   In this case, there is no way to delete it.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var regex = /Deleted Global Color/i;
    var colors = app.activeDocument.spots;
    for (var i = colors.length - 1; i >= 0; i--) {
        var color = colors[i];
        if (regex.test(color.name)) {
            color.remove();
        }
    }
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
