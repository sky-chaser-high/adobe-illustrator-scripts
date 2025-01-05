/* ===============================================================================================================================================
   rotateTextToMatchPathSegmentAngle

   Description
   This script rotates the text to match the angle of the path segment or a line connecting two anchor points.

   Usage
   Select any text objects and two anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...

   Notes
   Curves are not supported.
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
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    var shapes = getPathItems(items);
    if (!texts.length || !shapes.length) return;

    rotateText(texts, shapes);
}


function rotateText(texts, shapes) {
    var points = getSelectedAnchorPoints(shapes);
    if (points.length != 2) return;

    var segmentAngle = getSegmentAngle(points);

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var textAngle = getTextAngle(text);

        var rad = segmentAngle - textAngle;
        if (isObtuseAngle(segmentAngle)) {
            rad -= Math.PI;
        }
        var deg = convertToDegree(rad);
        text.rotate(deg);
    }
}


function convertToDegree(rad) {
    return rad * 180 / Math.PI;
}


function isObtuseAngle(rad) {
    var rightAngle = Math.PI / 2;
    return rightAngle <= rad || rad <= rightAngle * -1;
}


function getTextAngle(item) {
    var matrix = item.matrix;
    var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
    return rad;
}


function getSegmentAngle(points) {
    var p1 = setPoint(points[0]);
    var p2 = setPoint(points[1]);
    var width = p2.x - p1.x;
    var height = p2.y - p1.y;
    return Math.atan2(height, width);
}


function setPoint(item) {
    return {
        x: item.anchor[0],
        y: item.anchor[1]
    };
}


function getSelectedAnchorPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var anchors = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;
            anchors.push(point);
        }
    }
    return anchors;
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame') {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' || item.typename == 'CompoundPathItem') {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function isValidVersion() {
    var cs = 11;
    var current = parseInt(app.version);
    if (current < cs) return false;
    return true;
}
