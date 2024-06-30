/* ===============================================================================================================================================
   fitSelectedObjectsInWindow

   Description
   This script changes the zoom factor that the selected object fills the display.

   Usage
   Select any objects, run this script from File > Scripts > Other Script...

   Notes
   If no objects are selected, all objects should fit in the window. Ignore guides.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var document = app.activeDocument;
    var items = document.selection;
    if (!items.length) items = getPageItems();
    if (!items.length) return;

    var bounds = getBounds(items);
    var item = getItemSize(bounds);
    var center = getCenterPosition(item, bounds);

    var view = document.activeView;
    view.centerPoint = [center.x, center.y];

    if (!item.width && !item.height) return;
    view.zoom = 1;

    var screen = getScreenSize(view);
    var zoom = getZoomFactor(item, screen);

    if ((item.height * screen.ratio) <= item.width) {
        view.zoom = zoom.width;
    }
    else {
        view.zoom = zoom.height;
    }
}


function getZoomFactor(item, screen) {
    var correction = 0.90;
    return {
        width: screen.width / item.width * correction,
        height: screen.height / item.height * correction
    };
}


function getScreenSize(view) {
    var bounds = view.bounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    return {
        width: width,
        height: height,
        ratio: width / height
    };
}


function getCenterPosition(item, bounds) {
    return {
        x: bounds.x1 + item.width / 2,
        y: bounds.y1 - item.height / 2
    };
}


function getItemSize(bounds) {
    var width = Math.abs(bounds.x2 - bounds.x1);
    var height = Math.abs(bounds.y2 - bounds.y1);
    return {
        width: width,
        height: height
    };
}


function getBounds(items) {
    var item = items[0];
    var bounds = item.visibleBounds;
    if (isClipped(item)) bounds = item.pageItems[0].visibleBounds;

    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];

    for (var i = 1; i < items.length; i++) {
        item = items[i];
        bounds = item.visibleBounds;
        if (isClipped(item)) bounds = item.pageItems[0].visibleBounds;

        if (bounds[0] < x1) x1 = bounds[0];
        if (bounds[1] > y1) y1 = bounds[1];
        if (bounds[2] > x2) x2 = bounds[2];
        if (bounds[3] < y2) y2 = bounds[3];
    }

    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    };
}


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
}


function getPageItems() {
    var pageItems = [];
    var items = app.activeDocument.pageItems;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && item.guides) continue;
        pageItems.push(item);
    }
    return pageItems;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
