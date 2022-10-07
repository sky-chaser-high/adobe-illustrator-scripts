/* ===============================================================================================================================================
   convertAllAnchorPointsToCorner

   Description
   This script converts all anchor points to the corner.
   The anchor point conversion options in the Control panel requires the anchor point to be selected,
   but this script selects the entire object.

   Usage
   Select the entire path with selection tool, run this script from File > Scripts > Other Script...

   Notes
   It is not necessary to select anchor points with direct selection tool.
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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var items = getPathItems(app.activeDocument.selection);
    for (var i = 0; i < items.length; i++) {
        convertToCorner(items[i]);
    }
}


function convertToCorner(item) {
    var points = item.pathPoints;
    for (var i = 0; i < points.length; i++) {
        var anchor = points[i].anchor;
        points[i].leftDirection = anchor;
        points[i].rightDirection = anchor;
    }
}


function getPathItems(selection) {
    var items = [];
    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        switch (item.typename) {
            case 'PathItem':
                items.push(item);
                break;
            case 'CompoundPathItem':
                items = items.concat(getPathItems(item.pathItems));
                break;
            case 'GroupItem':
                items = items.concat(getPathItems(item.pageItems));
                break;
        }
    }
    return items;
}
