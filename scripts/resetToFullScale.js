/* ===============================================================================================================================================
   resetToFullScale

   Description
   This script resets the scale to 100% and the rotation angle to 0 degrees for the linked files.
   Embedded images is also supported.

   Usage
   Select the linked files or the embedded images, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    // work around a bug
    try {
        app.executeMenuCommand('Adobe Update Link Shortcut'); // Link Panel > Update Link
        app.redraw();
    }
    catch (err) { }

    var items = app.activeDocument.selection;
    var images = getImageItems(items);

    for (var i = 0; i < images.length; i++) {
        resetToFullScale(images[i]);
    }
}


function resetToFullScale(item) {
    var basis = {
        'left': item.left,
        'top': item.top,
        'width': item.width,
        'height': item.height
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
    item.matrix.mValueD = (/\.eps$/i.test(filename) || item.typename == 'RasterItem') ? 1 : -1; // invert the sign except for eps file and embedded image

    // workaround for the reflect object
    item.left = 0;
    item.top = 0;

    // reposition the object to the center
    item.left = basis.left - (item.width - basis.width) / 2;
    item.top = basis.top + (item.height - basis.height) / 2;
}


function getRotationAngle(item) {
    var matrix = item.matrix;
    var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
    var deg = rad * 180 / Math.PI;
    return (item.typename == 'PlacedItem') ? deg * -1 : deg;
}


function getScale(item) {
    var matrix = item.matrix;
    var x = Math.sqrt(Math.pow(matrix.mValueA, 2) + Math.pow(matrix.mValueB, 2));
    var y = Math.sqrt(Math.pow(matrix.mValueC, 2) + Math.pow(matrix.mValueD, 2));
    return {
        x: x,
        y: y
    };
}


function getImageItems(items) {
    var images = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PlacedItem' || item.typename == 'RasterItem') {
            images.push(item);
        }
        if (item.typename == 'GroupItem') {
            images = images.concat(getImageItems(item.pageItems));
        }
    }
    return images;
}
