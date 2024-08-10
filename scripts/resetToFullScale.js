/* ===============================================================================================================================================
   resetToFullScale

   Description
   This script resets the scale to 100% and the rotation angle to 0 degrees for the linked or embedded files.

   Usage
   Select any linked or embedded files, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    // work around a bug
    try {
        app.executeMenuCommand('Adobe Update Link Shortcut'); // Link Panel > Update Link
        app.redraw();
    }
    catch (err) { }

    var items = app.activeDocument.selection;
    var links = getPlacedItems(items);
    if (!links.length) return;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        resetToFullScale(link);
    }
}


function resetToFullScale(item) {
    var base = {
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height
    };

    var filename = '';
    try {
        if (item.typename == 'PlacedItem') filename = item.file.name;
    }
    catch (err) { }

    // work around a bug
    var deg = getRotationAngle(item);
    item.rotate(deg * -1);
    var scale = getScale(item);
    item.resize(1 / scale.x * 100, 1 / scale.y * 100);

    item.matrix.mValueA = 1;
    item.matrix.mValueB = 0;
    item.matrix.mValueC = 0;
    // invert the sign except for eps file and embedded image
    item.matrix.mValueD = (/\.eps$/i.test(filename) || item.typename == 'RasterItem') ? 1 : -1;

    // workaround for the reflect object
    item.left = 0;
    item.top = 0;

    // reposition the object to the center
    item.left = base.left - (item.width - base.width) / 2;
    item.top = base.top + (item.height - base.height) / 2;
}


function getRotationAngle(item) {
    var matrix = item.matrix;
    var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
    var deg = rad * 180 / Math.PI;
    return (item.typename == 'PlacedItem') ? deg * -1 : deg;
}


function getScale(item) {
    var matrix = item.matrix;
    var sq = 2;
    var x = Math.sqrt(Math.pow(matrix.mValueA, sq) + Math.pow(matrix.mValueB, sq));
    var y = Math.sqrt(Math.pow(matrix.mValueC, sq) + Math.pow(matrix.mValueD, sq));
    return {
        x: x,
        y: y
    };
}


function getPlacedItems(items) {
    var links = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PlacedItem' || item.typename == 'RasterItem') {
            links.push(item);
        }
        if (item.typename == 'GroupItem') {
            links = links.concat(getPlacedItems(item.pageItems));
        }
    }
    return links;
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
