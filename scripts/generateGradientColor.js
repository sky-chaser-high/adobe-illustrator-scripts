/* ===============================================================================================================================================
   generateGradientColor

   Description
   This script generates a gradient color from fill colors or swatches.

   Usage
   Select two or more path objects or swatches, run this script from File > Scripts > Other Script...

   Notes
   Prioritize the path object over swatches.
   To generate gradient color from swatches, deselect the path objects.
   Text object and stroke color are not supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.2

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
    var colors = getColors(items);
    if (!colors.length) colors = getSwatches();
    if (colors.length < 2) return;
    createGradient(colors);
}


function createGradient(colors) {
	var name = getColorName();
    if (!name) return;

    var color = app.activeDocument.gradients.add();
    color.name = name;
    color.type = GradientType.LINEAR;

    var mimColorStops = 2;
    var count = colors.length - mimColorStops;
    for (var i = 0; i < count; i++) {
        color.gradientStops.add();
    }

    var maxRange = 100;
    var steps = colors.length - 1;
    var location = maxRange / steps;

    for (var i = 0; i < colors.length; i++) {
        var gradient = color.gradientStops[i];
        gradient.color = colors[i];
        if (0 < i && i < steps) {
            gradient.rampPoint = location * i;
        }
    }
}


function getColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        switch (item.typename) {
            case 'PathItem':
                if (!item.filled) continue;
                colors = colors.concat(getColorObject(item.fillColor));
                break;
            case 'CompoundPathItem':
                colors = colors.concat(getColors([item.pathItems[0]]));
                break;
            case 'GroupItem':
                colors = colors.concat(getColors(item.pageItems));
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
        colors = colors.concat(getColorObject(swatch.color));
    }
    return colors;
}


function getColorObject(item) {
    switch (item.typename) {
        case 'CMYKColor':
        case 'RGBColor':
        case 'GrayColor':
        case 'SpotColor':
            return [item];
        case 'GradientColor':
            var colors = [];
            var gradients = item.gradient.gradientStops;
            for (var i = 0; i < gradients.length; i++) {
                colors.push(gradients[i].color);
            }
            return colors;
    }
}


function getColorName() {
    $.localize = true;
    var ui = localizeUI();
    var name = 'Gradient';
    name = prompt(ui.title, name);
    try {
        app.activeDocument.swatches[name];
        name = getColorName();
    }
    catch (err) { }
    return name;
}


function localizeUI() {
    return {
        title: {
            en: 'Enter a gradient name.',
            ja: 'グラデーション名を入力してください。'
        }
    };
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}
