/* ===============================================================================================================================================
   deleteHiddenLayers

   Description
   This script deletes hidden layers.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   It has been implement in the Layers panel menu since version 2021.
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
    var layers = app.activeDocument.layers;
    for (var i = layers.length - 1; 0 <= i; i--) {
        var layer = layers[i];
        if (layer.visible) continue;
        layer.visible = true;
        layer.locked = false;
        layer.remove();
    }
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
