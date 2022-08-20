/* ===============================================================================================================================================
   createGridLines

   Description
   This script creates grid lines on artboards.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Grid spacing is determined by the Guides & Grid in Preferences.
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
    var layer, name = 'Grid';
    if (layerExists(name)) {
        layer = app.activeDocument.layers[name];
    }
    else {
        layer = createLayer(name);
    }

    var artboards = getArtboards();
    var preference = getGridPreference();
    var step = preference.horizontal.spacing / preference.horizontal.ticks;

    for (var i = 0; i < artboards.length; i++) {
        var artboard = artboards[i];
        var width = Math.floor(artboard.width / step) * step + step;
        var height = Math.floor(artboard.height / step) * step + step;

        var group = layer.groupItems.add();

        for (var j = 0; j < artboard.width + step; j += step) {
            var line = group.pathItems.add();
            line.setEntirePath([
                [artboard.x1 + j, artboard.y1],
                // [artboard.x1 + j, artboard.y2],
                [artboard.x1 + j, artboard.y1 - height]
            ]);
            line.filled = false;
            line.stroked = true;
            line.strokeWidth = 0.3;
        }

        for (var j = 0; j < artboard.height + step; j += step) {
            var line = group.pathItems.add();
            line.setEntirePath([
                [artboard.x1, (artboard.y1 + j) * -1],
                // [artboard.x2, (artboard.y1 + j) * -1],
                [artboard.x1 + width, (artboard.y1 + j) * -1]
            ]);
            line.filled = false;
            line.stroked = true;
            line.strokeWidth = 0.3;
        }
    }
}


function getGridPreference() {
    // /Users/user_name/Library/Preferences/Adobe Illustrator version Settings/language_dir/Adobe Illustrator Cloud Prefs
    // or
    // /Users/user_name/Library/Preferences/Adobe Illustrator version Settings/language_dir/Adobe Illustrator Prefs
    return {
        horizontal: {
            spacing: app.preferences.getRealPreference('Grid/Horizontal/Spacing'),
            ticks: app.preferences.getIntegerPreference('Grid/Horizontal/Ticks')
        },
        vertical: {
            spacing: app.preferences.getRealPreference('Grid/Vertical/Spacing'),
            ticks: app.preferences.getIntegerPreference('Grid/Vertical/Ticks')
        }
    };
}


function getUnit(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
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


function getArtboards() {
    var items = [];
    var artboards = app.activeDocument.artboards;
    for (var i = 0; i < artboards.length; i++) {
        var artboard = {
            x1: artboards[i].artboardRect[0],
            y1: artboards[i].artboardRect[1],
            x2: artboards[i].artboardRect[2],
            y2: artboards[i].artboardRect[3],
            width: 0,
            height: 0
        };
        artboard.width = Math.abs(artboard.x2 - artboard.x1);
        artboard.height = Math.abs(artboard.y2 - artboard.y1);
        items.push(artboard);
    }
    return items;
}
