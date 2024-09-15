/* ===============================================================================================================================================
   shuffleGradientColor

   Description
   This script shuffles the gradient color.

   Usage
   Select any path objects, run this script from File > Scripts > Other Script...

   Notes
   Only a fill color. A stroke color is not supported.
   For compound path objects, select them with direct select tool.
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
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    if (!shapes.length) return;

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        var color = shape.fillColor;
        if (color.typename != 'GradientColor') continue;

        var gradient = color.gradient;
        var colors = getColors(gradient);
        shuffle(colors);
        applyColors(gradient, colors);
    }
}


function shuffle(items) {
    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
    return items;
}


function getColors(gradient) {
    var colors = [];
    var stops = gradient.gradientStops;
    for (var i = 0; i < stops.length; i++) {
        colors.push(stops[i].color);
    }
    return colors;
}


function applyColors(gradient, colors) {
    var gradients = gradient.gradientStops;
    for (var i = 0; i < gradients.length; i++) {
        gradients[i].color = colors[i];
    }
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


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
