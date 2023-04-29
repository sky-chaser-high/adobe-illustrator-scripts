/* ===============================================================================================================================================
   drawCircumscribedCircle

   Description
   This script draws a circumscribed circle through 3 or 2 anchor points.

   Usage
   Select 3 or 2 anchor points with Direct Selection Tool, run this script from File > Scripts > Other Script...

   Notes
   For two anchor points, it is the diameter.
   Anchor points for type on a path and area types are also supported.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    var points = getAnchorPoints(shapes.concat(texts));
    if (points.length < 2) return;
    drawCircle(points);
}


function drawCircle(points) {
    var radius = getRadius(points);
    if (!radius) return;

    var circumcenter = getCircumcenter(points);
    var top = circumcenter.y + radius;
    var left = circumcenter.x - radius;

    var layer = app.activeDocument.activeLayer;
    var circle = layer.pathItems.ellipse(top, left, radius * 2, radius * 2);
    circle.fillColor = new NoColor();
    circle.strokeWidth = 1;
}


function getCircumcenter(points) {
    if (points.length == 2) {
        var x = points[0].x - (points[0].x - points[1].x) / 2;
        var y = points[0].y - (points[0].y - points[1].y) / 2;
        return { x: x, y: y };
    }

    var x1 = points[0].x;
    var y1 = points[0].y;
    var x2 = points[1].x;
    var y2 = points[1].y;
    var x3 = points[2].x;
    var y3 = points[2].y;

    var xx1 = Math.pow(x1, 2);
    var yy1 = Math.pow(y1, 2);
    var xx2 = Math.pow(x2, 2);
    var yy2 = Math.pow(y2, 2);
    var xx3 = Math.pow(x3, 2);
    var yy3 = Math.pow(y3, 2);

    // (px - x1)^2 + (py - y1)^2 = r^2
    var py = ((x3 - x1) * (xx1 + yy1 - xx2 - yy2) - (x2 - x1) * (xx1 + yy1 - xx3 - yy3)) / (2 * (x3 - x1) * (y1 - y2) - 2 * (x2 - x1) * (y1 - y3));
    var px = (x1 == x2)
    ? (2 * (y1 - y3) * py - xx1 - yy1 + xx3 + yy3) / (2 * (x3 - x1))
    : (2 * (y1 - y2) * py - xx1 - yy1 + xx2 + yy2) / (2 * (x2 - x1));

    return { x: px, y: py };
}


function getRadius(points) {
    if (points.length == 2) return getDistance(points[0], points[1]) / 2;

    var l1 = getDistance(points[0], points[1]);
    var l2 = getDistance(points[1], points[2]);
    var l3 = getDistance(points[2], points[0]);
    var area = getArea(l1, l2, l3);
    if (!area) return;

    var radius = (l1 * l2 * l3) / (4 * area);
    return radius;
}


// Heron's formula
function getArea(line1, line2, line3) {
    var s = (line1 + line2 + line3) / 2;
    var area = Math.sqrt(s * (s - line1) * (s - line2) * (s - line3));
    return area;
}


function getDistance(point1, point2) {
    var adjacent = point2.x - point1.x;
    var opposite = point2.y - point1.y;
    var hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    return hypotenuse;
}


function getAnchorPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var anchors = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;
            anchors.push({ x: point.anchor[0], y: point.anchor[1] });
        }
    }
    return anchors;
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


function getTextPathItems() {
    var AREA = TextType.AREATEXT;
    var PATH = TextType.PATHTEXT;
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && (text.kind == AREA || text.kind == PATH)) {
            items.push(text.textPath);
        }
    }
    return items;
}
