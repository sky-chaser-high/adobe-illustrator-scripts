/* ===============================================================================================================================================
   exportColorValuesToCSV

   Description
   This script exports color values of a path object or swatches to a CSV file.

   Usage
   Select path objects or swatches, run this script from File > Scripts > Other Script...
   If you want to export all swatches, deselect path objects and swatches.

   Notes
   If you want to get the swatch name, use a global color.
   Export to the desktop.
   Prioritize the path object over swatches.
   Text object and gradient are not supported.
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
    var items = getPathItems(app.activeDocument.selection);
    var swatches = getSwatches();
    var colors = (items.length) ? getColors(items) : getColors(swatches);
    var list = getColorList(colors);

    $.localize = true;
    var message = getMessage();

    var file = new File('~/Desktop/ColorValues.csv');
    if (!file.open('w')) return;

    try {
        file.encoding = 'utf-8';
        file.lineFeed = 'unix';
        file.write(list);
        file.close();
        alert(message.complete);
    }
    catch (err) {
        alert(message.failed);
    }
}


function getColorList(colors) {
    var mode = app.activeDocument.documentColorSpace;
    var RGB = DocumentColorSpace.RGB;

    var list = (mode == RGB) ? 'Red,Green,Blue,Grayscale' : 'Cyan,Magenta,Yellow,Black';
    list += ',Swatch name\n';

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        if (color[0] == undefined) continue;
        list += color.join(',') + '\n';
    }
    return list;
}


function getColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.filled) colors.push(getColorValues(item.fillColor));
        if (item.stroked) colors.push(getColorValues(item.strokeColor));
        if (/Color$/.test(item.typename)) colors.push(getColorValues(item));
    }
    return colors;
}


function getColorValues(color) {
    switch (color.typename) {
        case 'CMYKColor':
            var c = color.cyan;
            var m = color.magenta;
            var y = color.yellow;
            var k = color.black;
            return [c, m, y, k];
        case 'RGBColor':
            var r = color.red;
            var g = color.green;
            var b = color.blue;
            return [r, g, b, ''];
        case 'GrayColor':
            return ['', '', '', color.gray];
        case 'SpotColor':
            return getSpotColor(color.spot);
        case 'PatternColor':
            return ['', '', '', '', color.pattern.name];
        case 'GradientColor':
            return [undefined];
        case 'NoColor':
            return [undefined];
    }
}


function getSpotColor(spot) {
    if (spot.colorType == ColorModel.REGISTRATION) return [undefined];
    var color = getColorValues(spot.color);
    color.push(spot.name);
    return color;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches;
    var selection = swatches.getSelected();
    if (selection.length) swatches = selection;
    for (var i = 0; i < swatches.length; i++) {
        colors.push(swatches[i].color);
    }
    return colors;
}


function getPathItems(items) {
    var objects = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            objects.push(item);
        }
        if (item.typename == 'CompoundPathItem') {
            var backside = item.pathItems.length - 1;
            objects.push(item.pathItems[backside]);
        }
        if (item.typename == 'GroupItem') {
            objects = objects.concat(getPathItems(item.pageItems));
        }
    }
    return objects;
}


function getMessage() {
    return {
        complete: {
            en: 'Export completed',
            ja: '書き出しが完了しました。'
        },
        failed: {
            en: 'Export failed.',
            ja: '書き出しが失敗しました。'
        }
    };
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
