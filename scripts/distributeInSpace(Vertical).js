/* ===============================================================================================================================================
   distributeInSpace(Vertical)

   Description
   This script distributes vertically objects evenly spaced in space.

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
    var bounds = getBounds(baseItems.top);
    var space = getSpace(baseItems);
    var distribution = space / (targetItems.length + 1);

    for (var i = 0; i < targetItems.length; i++) {
        var item = targetItems[i];
        var position = bounds.bottom - distribution * (i + 1);
        var distance = getDistance(item, position);
        item.translate(0, distance);
    }
}


function getDistance(item, position) {
    var height = getHeight(item);
    var bounds = getBounds(item);
    var distance = bounds.top - height;
    return position - distance;
}


function getHeight(item) {
    var pref = app.preferences;
    var point = pref.getIntegerPreference('plugin/Transform/AnchorPoint');
    var bounds = getBounds(item);
    var height = bounds.top - bounds.bottom;
    if (/[012]/.test(point)) return 0;
    if (/[345]/.test(point)) return height / 2;
    if (/[678]/.test(point)) return height;
}


function getSpace(baseItems) {
    var bounds = getBounds(baseItems.top);
    var top = bounds.bottom;
    bounds = getBounds(baseItems.bottom);
    var bottom = bounds.top;
    return Math.abs(top - bottom);
}


function getBaseItems(selection) {
    var topItem = selection[0];
    var bottomItem = selection[0];

    for (var i = 1; i < selection.length; i++) {
        var item = selection[i];
        var bounds = getBounds(item);
        var target = bounds.top;

        bounds = getBounds(topItem);
        var top = bounds.top;

        bounds = getBounds(bottomItem);
        var bottom = bounds.top;

        if (target > top) topItem = item;
        if (target < bottom) bottomItem = item;
    }

    return {
        top: topItem,
        bottom: bottomItem
    };
}


function getTargetItems(selection, baseItem) {
    var items = [];
    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        var bounds = getBounds(item);
        var target = bounds.top;

        bounds = getBounds(baseItem.top);
        var top = bounds.top;

        bounds = getBounds(baseItem.bottom);
        var bottom = bounds.top;

        if (bottom < target && target < top) items.push(item);
    }

    items.sort(function(a, b) {
        var boundsA = getBounds(a);
        var boundsB = getBounds(b);
        return boundsB.top - boundsA.top;
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
