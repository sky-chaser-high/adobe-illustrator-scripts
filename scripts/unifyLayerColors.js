/* ===============================================================================================================================================
   unifyLayerColors

   Description
   This script unifies layer colors.

   Usage
   1. Unlock all layers.
      Keep the layers that colors you do not want to change locked.
   2. Select a layer that will be the reference color, run this script from File > Scripts > Other Script...

   Notes
   Sublayers are also supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.0

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
    var target = app.activeDocument.activeLayer;
    var color = target.color;
    var layers = getLayers(app.activeDocument.layers);
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (layer.locked) continue;
        layer.color = color;
    }
}


function getLayers(items) {
    var layers = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        layers.push(item);
        layers = layers.concat(getLayers(item.layers));
    }
    return layers;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
