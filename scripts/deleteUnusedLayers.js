/* ===============================================================================================================================================
   deleteUnusedLayers

   Description
   This script deletes unused layers.

   Usage
   Just run this script from File > Scripts > Other Script...
   It is not necessary to select any layers.

   Notes
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
    deleteUnusedLayers(layers);
}


function deleteUnusedLayers(layers) {
    for (var i = layers.length - 1; 0 <= i; i--) {
        var layer = layers[i];

        var sublayers = layer.layers.length;
        if (sublayers) {
            deleteUnusedLayers(layer.layers);
        }

        var items = layer.pageItems.length;
        if (!items && !sublayerItemExists(layer.layers)) {
            layer.locked = false;
            layer.visible = true;
            layer.remove();
        }
    }
}


function sublayerItemExists(layers) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        var sublayers = layer.layers.length;
        if (sublayers) {
            var exists = sublayerItemExists(layer.layers);
            if (exists) return true;
        }

        var items = layer.pageItems.length;
        if (items) return true;
    }
    return false;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
