/* ===============================================================================================================================================
   convertToSpotColor

   Description
   This script converts any colors in the Swatches panel to spot colors.

   Usage
   Select colors in the Swatches panel, run this script from File > Scripts > Other Script...
   If not selected, all swatches are converted.

   Notes
   If there is a swatch with the same name, it will not convert.
   When converting a process color to a spot color, the order in which the colors display changes because they reregister in the swatch.
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
    var swatches = getSwatches();
    for (var i = swatches.length - 1; i >= 0; i--) {
        var swatch = swatches[i];
        var color = convertColor(swatch);
        if (color) swatch.remove();
    }
}


function convertColor(swatch) {
    var color = swatch.color;
    switch (color.typename) {
        case 'CMYKColor':
        case 'RGBColor':
        case 'GrayColor':
            return addSpotColor(swatch);
        case 'SpotColor':
            return convertToSpot(color.spot);
    }
}


function convertToSpot(color) {
    var type = color.colorType;
    if (type == ColorModel.PROCESS) {
        try {
            color.colorType = ColorModel.SPOT;
        }
        catch (err) { }
    }
}


function addSpotColor(swatch) {
    var spot = app.activeDocument.spots.add();
    try {
        spot.name = swatch.name;
        spot.color = setColor(swatch.color);
        spot.colorType = ColorModel.SPOT;
        return spot;
    }
    catch (err) {
        spot.remove();
    }
}


function setColor(color) {
    switch (color.typename) {
        case 'CMYKColor':
            return setCMYKColor(color.cyan, color.magenta, color.yellow, color.black);
        case 'RGBColor':
            return setRGBColor(color.red, color.green, color.blue);
        case 'GrayColor':
            var mode = app.activeDocument.documentColorSpace;
            var CMYK = DocumentColorSpace.CMYK;
            var RGB = DocumentColorSpace.RGB;
            var gray = map(color.gray, 0, 100, 0, 255);
            if (mode == CMYK) return setCMYKColor(0, 0, 0, color.gray);
            if (mode == RGB) return setRGBColor(gray, gray, gray);
    }
}


function setCMYKColor(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


function setGrayColor(g) {
    var color = new GrayColor();
    color.gray = g;
    return color;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches;
    var selection = swatches.getSelected();
    if (selection.length) swatches = selection;
    for (var i = swatches.length - 1; i >= 0; i--) {
        colors.push(swatches[i]);
    }
    return colors;
}


function map(value, start1, stop1, start2, stop2) {
    var distance1 = stop1 - start1;
    var value1 = value - start1;

    var ratio = value1 / distance1;

    var distance2 = stop2 - start2;
    var value2 = distance2 * ratio;

    return start2 + value2;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
