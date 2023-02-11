/* ===============================================================================================================================================
   addSelectedGradientsToSwatch

   Description
   This script adds selected gradients to Swatches.

   Usage
   Select path objects, run this script from File > Scripts > Other Script...

   Notes
   Text object and stroke color are not supported.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var colors = getColors(app.activeDocument.selection);

    for (var i = 0; i < colors.length; i++) {
        var name = getGradientName();
        var type = colors[i].gradient.type;
        var stops = getGradientStops(colors[i]);
        createGradient(name, type, stops);
    }
}


function createGradient(name, type, colors) {
    var gradient = app.activeDocument.gradients.add();
    gradient.name = name;
    gradient.type = type;

    var minColorStops = 2;
    for (var i = 0; i < colors.length - minColorStops; i++) {
        gradient.gradientStops.add();
    }

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var gradientStop = gradient.gradientStops[i];
        gradientStop.color = color.color;
        gradientStop.midPoint = color.midPoint;
        gradientStop.rampPoint = color.rampPoint;
        gradientStop.opacity = color.opacity;
    }
}


function getGradientStops(color) {
    var stops = [];
    var gradients = color.gradient.gradientStops;
    for (var i = 0; i < gradients.length; i++) {
        stops.push(gradients[i]);
    }
    return stops;
}


function getColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        colors = colors.concat(getGradients(items[i]));
    }
    return colors;
}


function getGradients(item) {
    var colors = [];
    switch (item.typename) {
        case 'PathItem':
            var color = item.fillColor;
            if (item.filled && isGradient(color)) colors.push(color);
            break;
        case 'CompoundPathItem':
            var compound = item.pathItems[0];
            var color = compound.fillColor;
            if (compound.filled && isGradient(color)) colors.push(color);
            break;
        case 'GroupItem':
            for (var i = 0; i < item.pageItems.length; i++) {
                colors = colors.concat(getGradients(item.pageItems[i]));
            }
    }
    return colors;
}


function isGradient(color) {
    if (color.typename == 'GradientColor') return true;
    return false;
}


function getGradientName(count) {
    if (!count) count = 1;
    var name = 'Gradient ' + count;
    if (gradientExists(name)) name = getGradientName(++count);
    return name;
}


function gradientExists(name) {
    try {
        app.activeDocument.swatches[name];
        return true;
    }
    catch (err) {
        return false;
    }
}
