/* ===============================================================================================================================================
   distributeInSpace(Horizontal)

   Description
   This script distributes horizontally objects evenly spaced in space.

   Usage
   Select three or more objects, run this script from File > Scripts > Other Script...
   The position of alignment depends on the reference point.

   Notes
   Include or exclude the stroke width depends on the Align panel menu > Use Preview Bounds.
   Select at least three objects.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS3 or higher

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
    if (items.length < 3) return;

    var baseItems = getBaseItems(items);
    var targetItems = getTargetItems(items, baseItems);

    distribute(targetItems, baseItems);
}


function distribute(targetItems, baseItems) {
    var bounds = getBounds(baseItems.left);
    var space = getSpace(baseItems);
    var distribution = space / (targetItems.length + 1);

    for (var i = 0; i < targetItems.length; i++) {
        var item = targetItems[i];
        var position = bounds.right + distribution * (i + 1);
        var distance = getDistance(item, position);
        item.translate(distance);
    }
}


function getDistance(item, position) {
    var width = getWidth(item);
    var bounds = getBounds(item);
    var distance = bounds.left + width;
    return position - distance;
}


function getWidth(item) {
    var pref = app.preferences;
    var point = pref.getIntegerPreference('plugin/Transform/AnchorPoint');
    var bounds = getBounds(item);
    var width = bounds.right - bounds.left;
    if (/[036]/.test(point)) return 0;
    if (/[147]/.test(point)) return width / 2;
    if (/[258]/.test(point)) return width;
}


function getSpace(baseItems) {
    var bounds = getBounds(baseItems.left);
    var left = bounds.right;
    bounds = getBounds(baseItems.right);
    var right = bounds.left;
    return Math.abs(right - left);
}


function getBaseItems(selection) {
    var leftItem = selection[0];
    var rightItem = selection[0];

    for (var i = 1; i < selection.length; i++) {
        var item = selection[i];
        var bounds = getBounds(item);
        var target = bounds.left;

        bounds = getBounds(leftItem);
        var left = bounds.left;

        bounds = getBounds(rightItem);
        var right = bounds.left;

        if (target < left) leftItem = item;
        if (target > right) rightItem = item;
    }

    return {
        left: leftItem,
        right: rightItem
    };
}


function getTargetItems(selection, baseItem) {
    var items = [];
    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        var bounds = getBounds(item);
        var target = bounds.left;

        bounds = getBounds(baseItem.left);
        var left = bounds.left;

        bounds = getBounds(baseItem.right);
        var right = bounds.left;

        if (left < target && target < right) items.push(item);
    }

    items.sort(function(a, b) {
        var boundsA = getBounds(a);
        var boundsB = getBounds(b);
        return boundsA.left - boundsB.left;
    });
    return items;
}


function getBounds(item) {
    var pref = app.preferences;
    var usePreviewBounds = pref.getBooleanPreference('includeStrokeInBounds');
    var bounds = usePreviewBounds ? item.visibleBounds : item.geometricBounds;
    return {
        top: bounds[1],
        left: bounds[0],
        bottom: bounds[3],
        right: bounds[2]
    };
}


function isValidVersion() {
    var cs3 = 13;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs3) return false;
    return true;
}
