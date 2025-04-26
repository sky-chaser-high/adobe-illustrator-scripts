/* ===============================================================================================================================================
   shuffleObjects

   Description
   This script shuffles the selected objects.

   Usage
   Select some objects, run this script from File > Scripts > Other Script...

   Notes
   Reposition the object based on its center.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.0

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
    if (items.length < 2) return;
    var positions = getItemPositions(items);
    shuffle(positions);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var position = positions[i];
        setItemPosition(item, position);
    }
}


function shuffle(items) {
    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
}


function setItemPosition(item, center) {
    var bounds = item.visibleBounds;
    var x0 = bounds[0];
    var y0 = bounds[1];
    if (isClipped(item)) bounds = item.pageItems[0].visibleBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var dx = x0 - x1;
    var dy = y0 - y1;
    var width = x2 - x1;
    var height = y1 - y2;
    item.left = center.x - (width / 2) + dx;
    item.top = center.y + (height / 2) + dy;
}


function getItemPositions(items) {
    var positions = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var center = getCenterPosition(item);
        positions.push(center);
    }
    return positions;
}


function getCenterPosition(item) {
    var bounds = item.visibleBounds;
    if (isClipped(item)) bounds = item.pageItems[0].visibleBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = x2 - x1;
    var height = y1 - y2;
    return {
        x: x1 + width / 2,
        y: y1 - height / 2
    };
}


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
}


function isValidVersion() {
    var cs = 11;
    var current = parseInt(app.version);
    if (current < cs) return false;
    return true;
}
