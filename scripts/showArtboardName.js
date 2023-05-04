/* ===============================================================================================================================================
   showArtboardName

   Description
   This script shows the artboard name and size in the document.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   The dimension units depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.2.0

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
    var layer = getLayer('Artboard Name');

    var artboards = app.activeDocument.artboards;
    for (var i = 0; i < artboards.length; i++) {
        showArtboardInfo(i + 1, artboards[i], layer);
    }

    layer.locked = true;
    layer.printable = false;
}


function showArtboardInfo(num, artboard, layer) {
    var doc = getArtboardSize(artboard);
    var units = getUnits(app.activeDocument.rulerUnits);

    var width = convertUnits(doc.width + 'pt', units);
    var height = convertUnits(doc.height + 'pt', units);

    var contents = '#' + num + ' ' + artboard.name + '  ' + round(width) + units + ' x ' + round(height) + units;
    var margin = 3;

    var text = layer.textFrames.pointText([doc.x, doc.y + margin]);
    text.contents = contents;

    var attributes = text.textRange.characterAttributes;
    attributes.size = 10;
    attributes.horizontalScale = 100;
    attributes.verticalScale = 100;
}


function round(value) {
    var digits = 100;
    return Math.round(value * digits) / digits;
}


function getArtboardSize(artboard) {
    var x1 = artboard.artboardRect[0];
    var y1 = artboard.artboardRect[1];
    var x2 = artboard.artboardRect[2];
    var y2 = artboard.artboardRect[3];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    return {
        x: x1,
        y: y1,
        width: width,
        height: height
    };
}


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function getUnits(ruler) {
    switch (ruler) {
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
    }
}


function getLayer(name) {
    if (layerExists(name)) {
        var layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
        return layer;
    }
    return createLayer(name);
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
