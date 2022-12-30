/* ===============================================================================================================================================
   fitGuideInArtboard

   Description
   This script fits guide objects in an artboard.

   Usage
   Select guide objects, run this script from File > Scripts > Other Script...

   Notes
   Closed paths and curves are not supported.
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
    var artboard = getArtboardRect();
    var items = getGuides(app.activeDocument.selection);
    for (var i = 0; i < items.length; i++) {
        var guide = items[i];
        var points = guide.pathPoints;
        var count = guide.pathPoints.length;
        var intersection = getIntersection(guide, artboard);

        points[0].anchor = [intersection.x1, intersection.y1]
        points[0].leftDirection = [intersection.x1, intersection.y1];
        points[0].rightDirection = [intersection.x1, intersection.y1];

        points[count - 1].anchor = [intersection.x2, intersection.y2]
        points[count - 1].leftDirection = [intersection.x2, intersection.y2];
        points[count - 1].rightDirection = [intersection.x2, intersection.y2];
    }
}


function getIntersection(item, artboard) {
    var points = getEndPoints(item);
    var gSlope = slope(points.x1, points.y1, points.x2, points.y2);
    var gIntercept = yIntercept(points.x1, points.y1, gSlope);
    var x1, y1, x2, y2;

    if (gSlope == undefined) {
        x1 = points.x1;
        x2 = points.x2;
        y1 = (points.y1 > points.y2) ? artboard.y1 : artboard.y2;
        y2 = (points.y1 > points.y2) ? artboard.y2 : artboard.y1;
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    if (gSlope == 0) {
        x1 = (points.x1 < points.x2) ? artboard.x1 : artboard.x2;
        x2 = (points.x1 < points.x2) ? artboard.x2 : artboard.x1;
        y1 = points.y1;
        y2 = points.y2;
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    x1 = (points.x1 < points.x2) ? artboard.x1 : artboard.x2;
    x2 = (points.x1 < points.x2) ? artboard.x2 : artboard.x1;
    y1 = (points.x1 < points.x2) ? linearFunc(artboard.x1, gSlope, gIntercept) : linearFunc(artboard.x2, gSlope, gIntercept);
    y2 = (points.x1 < points.x2) ? linearFunc(artboard.x2, gSlope, gIntercept) : linearFunc(artboard.x1, gSlope, gIntercept);

    if (y1 > artboard.y1 || y1 < artboard.y2) {
        y1 = (points.y1 > points.y2) ? artboard.y1 : artboard.y2;
        x1 = xIntercept(y1, gSlope, gIntercept);
    }

    if (y2 > artboard.y1 || y2 < artboard.y2) {
        y2 = (points.y1 > points.y2) ? artboard.y2 : artboard.y1;
        x2 = xIntercept(y2, gSlope, gIntercept);
    }

    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}


function linearFunc(x, slope, intercept) {
    return (slope * x) + intercept;
}


function slope(x1, y1, x2, y2) {
    if (x1 - x2 == 0) return undefined;
    return (y1 - y2) / (x1 - x2);
}


function yIntercept(x, y, slope) {
    return y - (slope * x);
}


function xIntercept(y, slope, intercept) {
    return (y - intercept) / slope;
}


function getEndPoints(item) {
    var count = item.pathPoints.length;
    var points = item.pathPoints;

    var x1 = points[0].anchor[0];
    var y1 = points[0].anchor[1];
    var x2 = points[count - 1].anchor[0];
    var y2 = points[count - 1].anchor[1];

    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}


function getGuides(items) {
    var paths = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && !item.closed && item.guides) {
            paths.push(item);
        }
        else if (item.typename == 'GroupItem') {
            paths = paths.concat(getPathItems(item.pageItems));
        }
        else if (item.typename == 'CompoundPathItem') {
            paths = paths.concat(getPathItems(item.pathItems));
        }
    }
    return paths;
}


function getArtboardRect() {
    var artboards = app.activeDocument.artboards;
    var index = artboards.getActiveArtboardIndex();
    var artboard = artboards[index];
    var x1 = artboard.artboardRect[0];
    var y1 = artboard.artboardRect[1];
    var x2 = artboard.artboardRect[2];
    var y2 = artboard.artboardRect[3];
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}
