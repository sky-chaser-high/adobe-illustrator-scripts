/* ===============================================================================================================================================
   alignInCenterOfSpace(Vertical)

   Description
   This script aligns objects in the center of space.

   Usage
   Select objects, run this script from File > Scripts > Other Script...
   The position of alignment depends on the reference point.

   Notes
   The space excludes the stroke width.
   Select at least three objects.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS3 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0 && app.activeDocument.selection.length > 2) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var baseItems = getBaseItems(items);
    var targetItems = getTargetItems(items, baseItems.top, baseItems.bottom);

    var space = getSpace(baseItems.top, baseItems.bottom);
    var center = baseItems.top.visibleBounds[3] - space / 2;

    align(targetItems, center);
}


function align(items, center) {
    for (var i = 0; i < items.length; i++) {
        var distance = getMovingDistance(items[i], center);
        items[i].translate(0, distance);
    }
}


function getMovingDistance(item, center) {
    var referencePoint = getReferencePoint(item);
    var position = item.visibleBounds[1] - referencePoint;
    return center - position;
}


function getReferencePoint(item) {
    var ref = app.preferences.getIntegerPreference("plugin/Transform/AnchorPoint");
    var height = item.visibleBounds[1] - item.visibleBounds[3];
    if (/[012]/.test(ref)) return 0;
    if (/[345]/.test(ref)) return height / 2;
    if (/[678]/.test(ref)) return height;
}


function getSpace(topItem, bottomItem) {
    var top = topItem.visibleBounds[3];
    var bottom = bottomItem.visibleBounds[1];
    return Math.abs(top - bottom);
}


function getBaseItems(selection) {
    var topItem = selection[0];
    var bottomItem = selection[0];

    for (var i = 1; i < selection.length; i++) {
        var top = topItem.geometricBounds[1];
        var bottom = bottomItem.geometricBounds[1];
        var target = selection[i].geometricBounds[1];

        if (target > top) topItem = selection[i];
        if (target < bottom) bottomItem = selection[i];
    }

    return {
        top: topItem,
        bottom: bottomItem
    };
}


function getTargetItems(selection, topItem, bottomItem) {
    var items = [];
    for (var i = 0; i < selection.length; i++) {
        var top = topItem.geometricBounds[1];
        var bottom = bottomItem.geometricBounds[1];
        var target = selection[i].geometricBounds[1];
        if (top > target && target > bottom) items.push(selection[i]);
    }
    return items;
}
