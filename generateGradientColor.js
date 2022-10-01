/* ===============================================================================================================================================
   generateGradientColor

   Description
   This script generates the gradient color from fill colors or swatches.

   Usage
   Select the path objects or swatches, run this script from File > Scripts > Other Script...

   Notes
   Prioritize the path object over swatches.
   To generate gradient color from swatches, deselect the path objects.
   Text object and stroke color are not supported.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

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
        colors = getColors(items);
    }
    else {
        colors = getSwatches();
    }

    if (colors.length > 1) {
        createGradient(colors);
    }
}


function createGradient(colors) {
	var name = getColorName();
    if (!name) return;

    var color = app.activeDocument.gradients.add();
    color.name = name;
    color.type = GradientType.LINEAR;

    var mimColorStops = 2;
    for (var i = 0; i < colors.length - mimColorStops; i++) {
        color.gradientStops.add();
    }

    var maxRange = 100;
    var steps = colors.length - 1;
    var location = maxRange / steps;

    for (var i = 0; i < colors.length; i++) {
        color.gradientStops[i].color = colors[i];
        if (0 < i && i < steps) {
            color.gradientStops[i].rampPoint = location * i;
        }
    }
}


function getColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        switch (items[i].typename) {
            case 'PathItem':
                if (items[i].filled) {
                    colors = colors.concat(getColorObject(items[i].fillColor));
                }
                break;
            case 'CompoundPathItem':
                colors = colors.concat(getColors([items[i].pathItems[0]]));
                break;
            case 'GroupItem':
                colors = colors.concat(getColors(items[i].pageItems));
                break;
        }
    }
    return colors;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches.getSelected();
    for (var i = 0; i < swatches.length; i++) {
        colors = colors.concat(getColorObject(swatches[i].color));
    }
    return colors;
}


function getColorObject(item) {
    switch (item.typename) {
        case 'CMYKColor':
            return [item];
        case 'RGBColor':
            return [item];
        case 'GrayColor':
            return [item];
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
    var name = 'Gradient';
    name = prompt(localize().title, name);
    try {
        app.activeDocument.swatches[name];
        name = getColorName();
    }
    catch (err) { }
    return name;
}


function localize() {
    var language = {
        en_US: {
            title: 'Enter a gradient color name.'
        },
        ja_JP: {
            title: 'グラデーション名を入力してください。'
        }
    };
    return language[app.locale] || language.en_US;
}
