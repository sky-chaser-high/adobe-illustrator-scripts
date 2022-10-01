/* ===============================================================================================================================================
   extractColorsFromGradient

   Description
   This script extracts colors as swatches from the gradient stops.

   Usage
   Select the path objects or swatches, run this script from File > Scripts > Other Script...

   Notes
   Prioritize the path object over swatches.
   To extract color from swatches, deselect the path objects.
   Text object and stroke color are not supported.
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
    var colors = [];

    if (items.length > 0) {
        colors = getGradientColors(items);
    }
    else {
        colors = getSwatches();
    }

    addSwatches(colors);
}


function addSwatches(colors) {
    for (var i = 0; i < colors.length; i++) {
        var name = getName(colors[i]);
        if (colorExists(name)) continue;

        var swatch = app.activeDocument.swatches.add();
        try {
            swatch.name = name;
            swatch.color = colors[i];
        }
        catch (err) {
            swatch.remove();
        }
    }
}


function getGradientColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        switch (items[i].typename) {
            case 'PathItem':
                if (items[i].filled) {
                    colors = colors.concat(getColors(items[i].fillColor));
                }
                break;
            case 'CompoundPathItem':
                colors = colors.concat(getGradientColors([items[i].pathItems[0]]));
                break;
            case 'GroupItem':
                colors = colors.concat(getGradientColors(items[i].pageItems));
                break;
        }
    }
    return colors;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches.getSelected();
    for (var i = 0; i < swatches.length; i++) {
        colors = colors.concat(getColors(swatches[i].color));
    }
    return colors;
}


function getColors(item) {
    var colors = [];
    if (item.typename == 'GradientColor') {
        var gradients = item.gradient.gradientStops;
        for (var i = 0; i < gradients.length; i++) {
            colors.push(gradients[i].color);
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
        if (swatches[i].name == name) {
            return true;
        }
    }
    return false;
}
