/* ===============================================================================================================================================
   selectEmbeddedLink

   Description
   This script selects embedded link files.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Locked or hidden embedded link files are not selected. The layer also as well.
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
    if (app.documents.length > 0) main();
})();


function main() {
    var items = app.activeDocument.rasterItems;
    if (items.length == 0) return;

    for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
    }
}
