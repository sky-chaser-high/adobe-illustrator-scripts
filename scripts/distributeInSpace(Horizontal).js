/* ===============================================================================================================================================
   distributeInSpace(Horizontal)

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
    var targetItems = getTargetItems(items, baseItems.left, baseItems.right);
    targetItems.sort(leftToRight);

    var space = getSpace(baseItems.left, baseItems.right);
    var distribution = space / (targetItems.length + 1);
    var baseItem = baseItems.left.visibleBounds[2];

    distribute(targetItems, baseItem, distribution);
}


function distribute(items, baseItem, distribution) {
    for (var i = 0; i < items.length; i++) {
        var target = baseItem + distribution * (i + 1);
        var distance = getMovingDistance(items[i], target);
        items[i].translate(distance);
    }
}


function getMovingDistance(item, target) {
    var referencePoint = getReferencePoint(item);
    var position = item.visibleBounds[0] + referencePoint;
    return target - position;
}


function getReferencePoint(item) {
    var ref = app.preferences.getIntegerPreference("plugin/Transform/AnchorPoint");
    var width = item.visibleBounds[2] - item.visibleBounds[0];
    if (/[036]/.test(ref)) return 0;
    if (/[147]/.test(ref)) return width / 2;
    if (/[258]/.test(ref)) return width;
}


function getSpace(leftItem, rightItem) {
    var left = leftItem.visibleBounds[2];
    var right = rightItem.visibleBounds[0];
    return Math.abs(right - left);
}


function getBaseItems(selection) {
    var leftItem = selection[0];
    var rightItem = selection[0];

    for (var i = 1; i < selection.length; i++) {
        var left = leftItem.geometricBounds[0];
        var right = rightItem.geometricBounds[0];
        var target = selection[i].geometricBounds[0];

        if (target < left) leftItem = selection[i];
        if (target > right) rightItem = selection[i];
    }

    return {
        left: leftItem,
        right: rightItem
    };
}


function getTargetItems(selection, leftItem, rightItem) {
    var items = [];
    for (var i = 0; i < selection.length; i++) {
        var left = leftItem.geometricBounds[0];
        var right = rightItem.geometricBounds[0];
        var target = selection[i].geometricBounds[0];
        if (left < target && target < right) items.push(selection[i]);
    }
    return items;
}


function leftToRight(a, b) {
    var item1 = a.geometricBounds[0];
    var item2 = b.geometricBounds[0];
    return item1 - item2;
}
