/* ===============================================================================================================================================
   shuffleGradientColor

   Description
   This script shuffles the gradient color.

   Usage
   Select the path objects, run this script from File > Scripts > Other Script...

   Notes
   Only a fill color. A stroke color is not supported.
   For compound path objects, select them with direct select tool.
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
    var items = app.activeDocument.selection;
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PathItem' && items[i].fillColor.typename == 'GradientColor') {
            var gradient = items[i].fillColor.gradient;
            var colors = getColors(gradient);
            shuffle(colors);
            applyColors(gradient, colors);
        }
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
