/* ===============================================================================================================================================
   deleteAllSwatches

   Description
   This script deletes all swatches except None and Registration.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Delete any swatches in use for the objects as well.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0) main();
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
