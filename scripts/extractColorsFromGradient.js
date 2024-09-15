/* ===============================================================================================================================================
   extractColorsFromGradient

   Description
   This script extracts colors as swatches from the gradient stops.

   Usage
   Select any path objects or swatches, run this script from File > Scripts > Other Script...

   Notes
   Prioritize the path object over swatches.
   To extract color from swatches, deselect the path objects.
   Text object and stroke color are not supported.
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
    var colors = getGradientColors(items);
    if (!colors.length) colors = getSwatches();
    addSwatches(colors);
}


function addSwatches(colors) {
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var name = getName(color);
        if (colorExists(name)) continue;

        var swatch = app.activeDocument.swatches.add();
        try {
            swatch.name = name;
            swatch.color = color;
        }
        catch (err) {
            swatch.remove();
        }
    }
}


function getGradientColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        switch (item.typename) {
            case 'PathItem':
                if (!item.filled) continue;
                colors = colors.concat(getColors(item.fillColor));
                break;
            case 'CompoundPathItem':
                colors = colors.concat(getGradientColors([item.pathItems[0]]));
                break;
            case 'GroupItem':
                colors = colors.concat(getGradientColors(item.pageItems));
                break;
        }
    }
    return colors;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches.getSelected();
    for (var i = 0; i < swatches.length; i++) {
        var swatch = swatches[i];
        colors = colors.concat(getColors(swatch.color));
    }
    return colors;
}


function getColors(item) {
    var colors = [];
    if (item.typename == 'GradientColor') {
        var gradients = item.gradient.gradientStops;
        for (var i = 0; i < gradients.length; i++) {
            var gradient = gradients[i];
            colors.push(gradient.color);
        }
    }
    return colors;
}


function getName(color) {
    switch (color.typename) {
        case 'CMYKColor':
            var cyan = Math.round(color.cyan);
            var magenta = Math.round(color.magenta);
            var yellow = Math.round(color.yellow);
            var black = Math.round(color.black);
            return 'C=' + cyan + ' M=' + magenta + ' Y=' + yellow + ' K=' + black;
        case 'RGBColor':
            var red = Math.round(color.red);
            var green = Math.round(color.green);
            var blue = Math.round(color.blue);
            return 'R=' + red + ' G=' + green + ' B=' + blue;
        case 'GrayColor':
            return 'Gray=' + Math.round(color.gray);
        case 'SpotColor':
            return color.spot.name;
    }
}


function colorExists(name) {
    var swatches = app.activeDocument.swatches;
    for (var i = 0; i < swatches.length; i++) {
        var swatch = swatches[i];
        if (swatch.name == name) return true;
    }
    return false;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
