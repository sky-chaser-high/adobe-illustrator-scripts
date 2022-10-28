/* ===============================================================================================================================================
   resetToFullScale

   Description
   This script resets the scale to 100% and the rotation angle to 0 degrees for the linked files.
   Embedded images is also supported.

   Usage
   Select the linked files or the embedded images, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS6 or higher

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
    // work around a bug
    try {
        app.executeMenuCommand('Adobe Update Link Shortcut'); // Link Panel > Update Link
        app.redraw();
    }
    catch (e) { }

    var items = app.activeDocument.selection;

    for (var i = 0; i < items.length; i++) {
        resetToFullScale(items[i]);
    }
}


function resetToFullScale(item) {
    if (item.typename == 'PlacedItem' || item.typename == 'RasterItem') {
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
        catch (e) { }

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
    else if (item.typename == 'GroupItem') {
        for (var i = 0; i < item.pageItems.length; i++) {
            resetToFullScale(item.pageItems[i]);
        }
    }
}
