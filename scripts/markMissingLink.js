/* ===============================================================================================================================================
   markMissingLink

   Description
   This script marks the location of missing links and visually indicates them.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var links = app.activeDocument.placedItems;
    if (!links.length) return;

    markMissingLink(links);
}


function markMissingLink(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        try {
            item.file;
        }
        catch (err) {
            if (isClipped(item.parent)) item = item.parent.pathItems[0];
            createIcon(item);
        }
    }
}


function createIcon(item) {
    var name = setLayerName();
    var layer = getLayer(name);
    var group = layer.groupItems.add();

    var diameter = (item.width < item.height) ? item.width : item.height;
    var top = item.top - item.height / 2 + diameter / 2;
    var left = item.left + item.width / 2 - diameter / 2;

    var margin = 4;
    var fontsize = diameter - margin;
    if (fontsize < 1) fontsize = 1;

    var ellipse = group.pathItems.ellipse(top, left, diameter, diameter);
    ellipse.fillColor = setFillColor();
    ellipse.strokeColor = setStrokeColor();
    ellipse.strokeWidth = 2;

    var text = group.textFrames.pointText(ellipse.position);
    text.contents = '?';

    var attributes = text.textRange.characterAttributes;
    attributes.fillColor = setTextColor();
    attributes.size = fontsize;

    var bounds = ellipse.geometricBounds;
    var outline = text.createOutline();
    outline.top = bounds[1] - ellipse.height / 2 + outline.height / 2;
    outline.left = bounds[0] + ellipse.width / 2 - outline.width / 2;
}


function setFillColor() {
    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == DocumentColorSpace.CMYK)
        ? setCMYKColor(0, 100, 100, 0)
        : setRGBColor(240, 30, 40);
    return color;
}


function setStrokeColor() {
    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == DocumentColorSpace.CMYK)
        ? setCMYKColor(0, 0, 0, 0)
        : setRGBColor(255, 255, 255);
    return color;
}


function setTextColor() {
    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == DocumentColorSpace.CMYK)
        ? setCMYKColor(0, 0, 0, 0)
        : setRGBColor(255, 255, 255);
    return color;
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


function setLayerName() {
    $.localize = true;
    var layer = {
        en: '_Missing Links_',
        ja: '_リンク切れ画像_'
    };
    return layer.toString();
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


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
}


function isValidVersion() {
    var cs = 11;
    var current = parseInt(app.version);
    if (current < cs) return false;
    return true;
}
