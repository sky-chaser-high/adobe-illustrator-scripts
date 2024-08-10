/* ===============================================================================================================================================
   disjoinPath

   Description
   This script breaks apart the path object with anchor points.

   Usage
   Select any path objects, run this script from File > Scripts > Other Script...

   Notes
   The original path object will deleted.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts
   =============================================================================================================================================== */

(function() {
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    if (!shapes.length) return;

    for (var i = shapes.length - 1; 0 <= i; i--) {
        var shape = shapes[i];
        disjoinPath(shape);
        shape.remove();
    }
}


function disjoinPath(shape) {
    var points = shape.pathPoints;
    var start = 0;
    var end = points.length - 1;
    for (var i = start; i < points.length; i++) {
        if (!shape.closed && i == end) continue;
        var next = i + 1;
        var p1 = points[i];
        var p2 = (i < end) ? points[next] : points[start];
        var segment = getPathSegment(shape, p1, p2);
        createPathItem(segment);
    }
}


function getPathSegment(item, p1, p2) {
    var mode = app.activeDocument.documentColorSpace;
    var CMYK = DocumentColorSpace.CMYK;
    var color = item.strokeColor;
    if (color.typename == 'NoColor') {
        color = (mode == CMYK) ? setCMYKColor(0, 0, 0, 100) : setRGBColor(0, 0, 0);
    }
    return {
        attributes: {
            color: color,
            width: item.strokeWidth,
            cap: item.strokeCap,
            join: item.strokeJoin,
            dashes: item.strokeDashes
        },
        anchor: {
            p1: p1.anchor,
            p2: p2.anchor
        },
        handle: {
            left: {
                p1: p1.leftDirection,
                p2: p2.leftDirection
            },
            right: {
                p1: p1.rightDirection,
                p2: p2.rightDirection
            }
        }
    };
}


function createPathItem(segment) {
    var anchor = segment.anchor;
    var handle = segment.handle;
    var attributes = segment.attributes;

    var layer = app.activeDocument.activeLayer;
    var shape = layer.pathItems.add();
    shape.setEntirePath([anchor.p1, anchor.p2]);
    shape.selected = true;

    var points = shape.pathPoints;
    points[0].leftDirection = handle.left.p1;
    points[0].rightDirection = handle.right.p1;
    points[1].leftDirection = handle.left.p2;
    points[1].rightDirection = handle.right.p2;

    shape.filled = false;
    shape.stroked = true;
    shape.strokeColor = attributes.color;
    shape.strokeWidth = attributes.width;
    shape.strokeCap = attributes.cap;
    shape.strokeJoin = attributes.join;
    shape.strokeDashes = attributes.dashes;
}


function setCMYKColor(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && item.pathPoints.length > 2) {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
    }
    return shapes;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
