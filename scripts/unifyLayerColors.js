/* ===============================================================================================================================================
   unifyLayerColors

   Description
   This script unifies layer colors.

   Usage
   Select a target layer, run this script from File > Scripts > Other Script...

   Notes
   Sublayers are also supported.
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
    var target = app.activeDocument.activeLayer;
    var color = target.color;
    var layers = getLayers(app.activeDocument.layers);
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.color = color;
    }
}


function getLayers(items) {
    var layers = [];
    for (var i = 0; i < items.length; i++) {
        layers.push(items[i]);
        layers = layers.concat(getLayers(items[i].layers));
    }
    return layers;
}
