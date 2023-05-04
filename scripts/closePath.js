/* ===============================================================================================================================================
   closePath

   Description
   This script closes the path objects.

   Usage
   Select the path objects, run this script from File > Scripts > Other Script...

   Notes
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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    for (var i = 0; i < shapes.length; i++) {
        closePath(shapes[i]);
    }
}


function closePath(item) {
    if (item.closed) return;

    var points = item.pathPoints;
    var point = {
        start: points[0],
        end: points[points.length - 1]
    };

    if (!hasLeftHandle(point.start) && hasRightHandle(point.start)) {
        setLeftHandlePosition(point.start);
    }

    if (hasLeftHandle(point.end) && !hasRightHandle(point.end)) {
        setRightHandlePosition(point.end);
    }

    item.closed = true;
}


function setLeftHandlePosition(point) {
    var p1 = {
        x: point.anchor[0],
        y: point.anchor[1]
    };
    var p2 = {
        x: point.rightDirection[0],
        y: point.rightDirection[1]
    };
    var position = getHandlePosition(p1, p2);
    point.leftDirection = [position.x, position.y];
}


function setRightHandlePosition(point) {
    var p1 = {
        x: point.anchor[0],
        y: point.anchor[1]
    };
    var p2 = {
        x: point.leftDirection[0],
        y: point.leftDirection[1]
    };
    var position = getHandlePosition(p1, p2);
    point.rightDirection = [position.x, position.y];
}


function getHandlePosition(p1, p2) {
    var distance = getDistance(p1, p2);
    var rad = getAngle(p1, p2);
    var angle = Math.PI;
    var x = distance * Math.cos(rad + angle);
    var y = distance * Math.sin(rad + angle);
    return {
        x: p1.x + x,
        y: p1.y + y
    };
}


function getDistance(p1, p2) {
    var adjacent = p2.x - p1.x;
    var opposite = p2.y - p1.y;
    var hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    return hypotenuse;
}


function getAngle(p1, p2) {
    var adjacent = p2.x - p1.x;
    var opposite = p2.y - p1.y;
    return Math.atan2(opposite, adjacent);
}


function hasLeftHandle(point) {
    var anchor = {
        x: point.anchor[0],
        y: point.anchor[1]
    };
    var handle = {
        x: point.leftDirection[0],
        y: point.leftDirection[1]
    };
    if (anchor.x == handle.x && anchor.y == handle.y) return false;
    return true;
}


function hasRightHandle(point) {
    var anchor = {
        x: point.anchor[0],
        y: point.anchor[1]
    };
    var handle = {
        x: point.rightDirection[0],
        y: point.rightDirection[1]
    };
    if (anchor.x == handle.x && anchor.y == handle.y) return false;
    return true;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}
