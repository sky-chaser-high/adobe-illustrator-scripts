/* ===============================================================================================================================================
   moveSublayerToMainLayer

   Description
   This script moves sublayers to the main layer above.

   Usage
   Just run this script from File > Scripts > Other Script...
   It is not necessary to select any sublayers.

   Notes
   Force all layers to show and unlock.
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
    var document = app.activeDocument;
    var layers = getSublayers(document.layers);
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.move(document, ElementPlacement.INSIDE);
    }
}


function getSublayers(items) {
    var layers = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.locked = false;
        item.visible = true;
        if (item.parent.typename == 'Layer') {
            layers.push(item);
        }
        layers = layers.concat(getSublayers(item.layers));
    }
    return layers;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
