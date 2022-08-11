/* ===============================================================================================================================================
   invertLockedLayer

   Description
   This script inverts locked layers.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
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

(function () {
    if (app.documents.length > 0) main();
})();


function main() {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        layers[i].locked = !layers[i].locked;
    }
}
