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
   1.3.0

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
    var layer = getLayer('Artboard Name');

    var artboards = app.activeDocument.artboards;
    for (var i = 0; i < artboards.length; i++) {
        var artboard = artboards[i];
        var index = i + 1;
        showArtboardInfo(index, artboard, layer);
    }

    layer.locked = true;
    layer.printable = false;
}


function showArtboardInfo(index, artboard, layer) {
    var doc = getArtboardSize(artboard);
    var units = getRulerUnits();

    var width = convertUnits(doc.width + 'pt', units);
    var height = convertUnits(doc.height + 'pt', units);

    var contents = '#' + index + ' ' + artboard.name + ' ' +
        '  W: ' + round(width) + units +
        '  H: ' + round(height) + units;

    var margin = 3;
    var fontsize = 10;
    var scale = 100;

    var text = layer.textFrames.pointText([doc.x, doc.y + margin]);
    text.contents = contents;

    var attributes = text.textRange.characterAttributes;
    attributes.size = fontsize;
    attributes.horizontalScale = scale;
    attributes.verticalScale = scale;
}


function round(value) {
    var digits = 10000;
    return Math.round(value * digits) / digits;
}


function getArtboardSize(artboard) {
    var rect = artboard.artboardRect;
    var x1 = rect[0];
    var y1 = rect[1];
    var x2 = rect[2];
    var y2 = rect[3];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    return {
        x: x1,
        y: y1,
        width: width,
        height: height
    };
}


function getLayer(name) {
    if (!layerExists(name)) return createLayer(name);
    var layer = app.activeDocument.layers[name];
    layer.locked = false;
    layer.visible = true;
    return layer;
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function layerExists(name) {
    try {
        app.activeDocument.layers[name];
        return true;
    }
    catch (err) {
        return false;
    }
}


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function getRulerUnits() {
    var unit = getUnitSymbol();
    if (!app.documents.length) return unit.pt;

    var document = app.activeDocument;
    var src = document.fullName;
    var ruler = document.rulerUnits;
    try {
        switch (ruler) {
            case RulerUnits.Pixels: return unit.px;
            case RulerUnits.Points: return unit.pt;
            case RulerUnits.Picas: return unit.pc;
            case RulerUnits.Inches: return unit.inch;
            case RulerUnits.Millimeters: return unit.mm;
            case RulerUnits.Centimeters: return unit.cm;

            case RulerUnits.Feet: return unit.ft;
            case RulerUnits.Yards: return unit.yd;
            case RulerUnits.Meters: return unit.meter;
        }
    }
    catch (err) {
        switch (xmpRulerUnits(src)) {
            case 'Feet': return unit.ft;
            case 'Yards': return unit.yd;
            case 'Meters': return unit.meter;
        }
    }
    return unit.pt;
}


function xmpRulerUnits(src) {
    if (!ExternalObject.AdobeXMPScript) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var prop = 'xmpTPg:MaxPageSize';
    var unit = prop + '/stDim:unit';

    var ruler = xmp.getProperty(namespace, unit).value;
    return ruler;
}


function getUnitSymbol() {
    return {
        px: 'px',
        pt: 'pt',
        pc: 'pc',
        inch: 'in',
        ft: 'ft',
        yd: 'yd',
        mm: 'mm',
        cm: 'cm',
        meter: 'm'
    };
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}
