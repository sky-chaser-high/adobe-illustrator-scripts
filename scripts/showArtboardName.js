/* ===============================================================================================================================================
   showArtboardName

   Description
   This script shows the artboard name and size in the document.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   The dimensional units depend on the ruler units.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.1.0

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
    var dim = getArtboardSize(artboard);
    var units = getUnits(app.activeDocument.rulerUnits);

    var width = convertUnits(dim.width + 'pt', units);
    var height = convertUnits(dim.height + 'pt', units);

    var margin = 3;
    var text = layer.textFrames.pointText([dim.x, dim.y + margin]);
    text.contents = artboard.name + '   ' + round(width) + units + ' x ' + round(height) + units;
    text.textRange.characterAttributes.size = 10;
}


function round(value) {
    var digit = 100;
    return Math.round(value * digit) / digit;
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


function getUnits(unit) {
    switch (unit) {
        case RulerUnits.Millimeters:
            return 'mm';
        case RulerUnits.Centimeters:
            return 'cm';
        case RulerUnits.Inches:
            return 'in';
        case RulerUnits.Points:
            return 'pt';
        case RulerUnits.Pixels:
            return 'px';
        default:
            return 'mm';
    }
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
