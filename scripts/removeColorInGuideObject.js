/* ===============================================================================================================================================
   removeColorInGuideObject

   Description
   This script removes fill and stroke colors in all guide objects.

   Usage
   Just run this script from File > Scripts > Other Script...
   There is no need to select any guide objects.

   Notes
   If you have added fill or stroke colors in the Appearance panel, they may not work properly.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    var states = getLayerStates();
    showAllLayers();

    var shapes = app.activeDocument.pathItems;
    var count = {
        before: shapes.length,
        after: 0
    };

    app.executeMenuCommand('deselectall');
    app.executeMenuCommand('clearguide');

    count.after = shapes.length;
    if (count.before == count.after) return;

    app.executeMenuCommand('undo');

    // Object > Expand Appearance
    app.executeMenuCommand('expandStyle');

    removeColor();
    app.executeMenuCommand('deselectall');

    restoreLayer(states);
}


function removeColor() {
    var items = app.activeDocument.selection;
    var guides = getPathItems(items);
    for (var i = 0; i < guides.length; i++) {
        var guide = guides[i];
        guide.fillColor = new NoColor();
        guide.strokeColor = new NoColor();
    }
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && item.guides) {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
    }
    return shapes;
}


function showAllLayers() {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.locked = false;
        layer.visible = true;
    }
}


function getLayerStates() {
    var states = [];
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        states.push({
            locked: layer.locked,
            visible: layer.visible
        });
    }
    return states;
}


function restoreLayer(states) {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var state = states[i];
        var layer = layers[i];
        layer.locked = state.locked;
        layer.visible = state.visible;
    }
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
