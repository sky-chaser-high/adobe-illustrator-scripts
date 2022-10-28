/* ===============================================================================================================================================
   showArtboardName

   Description
   This script shows the artboard name in the document.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

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
    var layer, name = 'Artboard Name';
    if (layerExists(name)) {
        layer = app.activeDocument.layers[name];
    }
    else {
        layer = createLayer(name);
    }

    var artboards = app.activeDocument.artboards;
    for (var i = 0; i < artboards.length; i++) {
        showArtboardName(artboards[i], layer);
    }

    layer.locked = true;
    layer.printable = false;
}


function showArtboardName(artboard, layer) {
    var x = artboard.artboardRect[0];
    var y = artboard.artboardRect[1]
    var margin = 3;
    var text = layer.textFrames.pointText([x, y + margin]);
    text.contents = artboard.name;
    text.textRange.characterAttributes.size = 10;
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function layerExists(name) {
    try {
        app.activeDocument.layers.getByName(name);
        return true;
    }
    catch (err) {
        return false;
    }
}
