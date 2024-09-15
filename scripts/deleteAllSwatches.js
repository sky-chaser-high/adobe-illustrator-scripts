/* ===============================================================================================================================================
   deleteAllSwatches

   Description
   This script deletes all swatches except None and Registration.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Delete any swatches in use for the objects as well.
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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var swatchGroups = app.activeDocument.swatchGroups;
    for (var i = swatchGroups.length - 1; i >= 0; i--) {
        var group = swatchGroups[i];
        if (group.name) group.remove();
    }
    var swatches = app.activeDocument.swatches;
    swatches.removeAll();
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
