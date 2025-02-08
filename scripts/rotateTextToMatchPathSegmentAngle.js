/* ===============================================================================================================================================
   rotateTextToMatchPathSegmentAngle

   Description
   This script rotates the text to match the angle of the path segment or a line connecting two anchor points.

   Usage
   Select two anchor points or a path segment with the Direct Selection Tool and some text objects, run this script from File > Scripts > Other Script...

   Notes
   Curves are not supported.
   For point types, rotate around the anchor point.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

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
        var rad = getRotateAngle(segmentAngle, textAngle, isVerticalText(text));
        var deg = convertToDegree(rad);
        var position = getPivotPoint(text);
        text.rotate(deg);
        if (position) moveToPivotPoint(text, position);
    }
}


function getRotateAngle(segmentAngle, textAngle, isVertical) {
    var rad = segmentAngle - textAngle;
    if (isObtuseAngle(segmentAngle)) rad -= Math.PI;

    if (isVertical) {
        rad -= Math.PI / 2;
        if (is2ndQuadrant(segmentAngle)) rad -= Math.PI;
        if (is4thQuadrant(segmentAngle)) rad -= Math.PI;
    }
    return rad;
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


function getPivotPoint(item) {
    if (item.kind != TextType.POINTTEXT) return;
    return item.anchor;
}


function moveToPivotPoint(item, point) {
    var x = point[0] - item.anchor[0];
    var y = point[1] - item.anchor[1];
    item.translate(x, y);
}


function convertToDegree(rad) {
    return rad * 180 / Math.PI;
}


function isObtuseAngle(rad) {
    var rightAngle = Math.PI / 2;
    return rightAngle <= rad || rad <= rightAngle * -1;
}


function is2ndQuadrant(rad) {
    var horizontalAngle = 0;
    return isObtuseAngle(rad) && horizontalAngle < rad;
}


function is4thQuadrant(rad) {
    var horizontalAngle = 0;
    return !isObtuseAngle(rad) && rad < horizontalAngle;
}


function isVerticalText(item) {
    return item.orientation == TextOrientation.VERTICAL;
}


function getSelectedAnchorPoints(shapes) {
    var isSingleShape = (shapes.length == 1) ? true : false;
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var anchors = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (isSingleShape && isSelected(j, points)) anchors.push(point);
            if (!isSingleShape && point.selected == ANCHOR) anchors.push(point);
        }
    }
    return anchors;
}


function isSelected(index, points) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var LEFT = PathPointSelection.LEFTDIRECTION;
    var RIGHT = PathPointSelection.RIGHTDIRECTION;

    var start = 0;
    var end = points.length - 1;
    var next = (index < end) ? index + 1 : start;
    var previous = (index > start) ? index - 1 : end;

    var point = points[index];
    var nextPoint = points[next];
    var previousPoint = points[previous];

    if (point.selected == ANCHOR || points.length == 2) return true;
    if (point.selected == RIGHT && nextPoint.selected == LEFT) return true;
    if (point.selected == LEFT && previousPoint.selected == RIGHT) return true;
    return false;
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
