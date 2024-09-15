/* ===============================================================================================================================================
   showColorValues

   Description
   This script shows color values. Both fill and stroke colors are supported.

   Usage
   Select any path objects, run this script from File > Scripts > Other Script...

   Notes
   CMYK, RGB, HEX, grayscale, spot color, and pattern are supported.
   Text object and gradient are not supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.1

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
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    if (!shapes.length) return;

    var layer = getLayer('Color Values');

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        showColorValue(shape, layer);
    }
}


function showColorValue(item, layer) {
    var font = {
        size: 8,
        leading: 12
    };

    var contents = '';
    if (item.filled) contents += getColorValue(item.fillColor);
    if (contents) contents += '\n';
    if (item.stroked) contents += getColorValue(item.strokeColor);
    if (!contents) return;

    var position = getPosition(item, font);
    var text = layer.textFrames.pointText(position);
    text.contents = contents;

    var attributes = text.textRange.characterAttributes;
    attributes.size = font.size;
    attributes.autoLeading = false;
    attributes.leading = font.leading;
}


function getColorValue(color) {
    var digit = 100;
    switch (color.typename) {
        case 'CMYKColor':
            var c = Math.round(color.cyan * digit) / digit;
            var m = Math.round(color.magenta * digit) / digit;
            var y = Math.round(color.yellow * digit) / digit;
            var k = Math.round(color.black * digit) / digit;
            return 'C' + c + ' M' + m + ' Y' + y + ' K' + k;
        case 'RGBColor':
            var r = Math.round(color.red * digit) / digit;
            var g = Math.round(color.green * digit) / digit;
            var b = Math.round(color.blue * digit) / digit;
            var hex = getHexValue(r, g, b);
            return 'R' + r + ' G' + g + ' B' + b + ' (' + hex + ')';
        case 'GrayColor':
            var k = Math.round(color.gray * digit) / digit;
            return 'K: ' + k;
        case 'SpotColor':
            var tint = Math.round(color.tint * digit) / digit;
            return color.spot.name + ': ' + tint;
        case 'PatternColor':
            return color.pattern.name;
        case 'GradientColor':
            return '';
    }
}


function getHexValue(r, g, b) {
    var red = ('0' + r.toString(16).toUpperCase()).slice(-2);
    var green = ('0' + g.toString(16).toUpperCase()).slice(-2);
    var blue = ('0' + b.toString(16).toUpperCase()).slice(-2);
    return '#' + red + green + blue;
}


function getPosition(item, font) {
    var margin = 3;
    var bounds = item.visibleBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    return [
        x1,
        y2 - font.size - margin
    ];
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'CompoundPathItem') {
            var end = item.pathItems.length - 1;
            shapes.push(item.pathItems[end]);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function getLayer(name) {
    if (layerExists(name)) {
        var layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
        return layer;
    }
    else {
        return createLayer(name);
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


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
