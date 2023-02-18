/* ===============================================================================================================================================
   distributeInSpace(Vertical)

   Description
   This script distributes objects evenly spaced in space.

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
    targetItems.sort(topToBottom);

    var space = getSpace(baseItems.top, baseItems.bottom);
    var distribution = space / (targetItems.length + 1);
    var baseItem = baseItems.top.visibleBounds[3];

    distribute(targetItems, baseItem, distribution);
}


function distribute(items, baseItem, distribution) {
    for (var i = 0; i < items.length; i++) {
        var target = baseItem - distribution * (i + 1);
        var distance = getMovingDistance(items[i], target);
        items[i].translate(0, distance);
    }
}


function getMovingDistance(item, target) {
    var referencePoint = getReferencePoint(item);
    var position = item.visibleBounds[1] - referencePoint;
    return target - position;
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


function topToBottom(a, b) {
    var item1 = a.geometricBounds[1];
    var item2 = b.geometricBounds[1];
    return item2 - item1;
}
