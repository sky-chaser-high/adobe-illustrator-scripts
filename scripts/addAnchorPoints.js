/* ===============================================================================================================================================
   addAnchorPoints

   Description
   This script adds any number of anchor points evenly spaced.
   It is a slightly more user-friendly improvement to Object > Path > Add Anchor Points.

   Usage
   1. Select two or more anchor points with Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter the number of anchor points to add.

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0

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
    if (!shapes.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var count = parseInt(dialog.count.text);
        if (count < 1 || isNaN(count)) return dialog.close();

        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (!hasSelectedAnchorPoints(shape)) continue;
            addAnchorPoints(shape, count);
        }
        dialog.close();
    }

    dialog.show();
}


function addAnchorPoints(shape, count) {
    var points = getAllAnchorPoints(shape);
    var entirePoints = getEntirePoints(shape, points, count);

    shape.setEntirePath(entirePoints.anchor);
    for (var i = 0; i < entirePoints.anchor.length; i++) {
        var handle = shape.pathPoints[i];
        handle.leftDirection = entirePoints.left[i];
        handle.rightDirection = entirePoints.right[i];
    }
    shape.selected = true;
}


function getAllAnchorPoints(item) {
    var points = {
        anchor: [],
        left: [],
        right: []
    };
    for (var i = 0; i < item.pathPoints.length; i++) {
        var point = item.pathPoints[i];
        points.anchor.push([
            point.anchor[0],
            point.anchor[1]
        ]);
        points.left.push([
            point.leftDirection[0],
            point.leftDirection[1]
        ]);
        points.right.push([
            point.rightDirection[0],
            point.rightDirection[1]
        ]);
    }
    return points;
}


function getEntirePoints(item, points, count) {
    for (var i = 0, index = 0; i < item.pathPoints.length; i++) {
        if (!isSelected(item, i)) continue;

        var p1 = item.pathPoints[i];
        var last = item.pathPoints.length - 1;
        var next = (i < last) ? i + 1 : 0;
        var p2 = item.pathPoints[next];

        var position, insertPoint;
        var times = count * index;

        if (hasCurve(p1, p2)) {
            position = getCurvedPositions(p1, p2, count);
            var start = 0;
            var end = position.anchor.length - 1;
            position.left[start] = points.left[i + times];
            position.right[end] = points.right[next + times];
            if (i == last) {
                points.left[start] = position.left[end];
                position.anchor.pop();
            }
            insertPoint = [i + times, 2];
        }
        else {
            position = getLinearPositions(p1, p2, count);
            insertPoint = [i + 1 + times, 0];
        }

        points = concatenate(points, position, insertPoint);
        index++;
    }
    return points;
}


// Insert an array into an array to make a single array.
// https://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
// Array.prototype.splice.apply(array1, [start, deleteCount].concat(array2));
function concatenate(points, position, insertPoint) {
    Array.prototype.splice.apply(points.anchor, insertPoint.concat(position.anchor));
    Array.prototype.splice.apply(points.left, insertPoint.concat(position.left));
    Array.prototype.splice.apply(points.right, insertPoint.concat(position.right));
    return points;
}


function isSelected(item, index) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;

    var p1 = item.pathPoints[index];
    if (p1.selected != ANCHOR) return false;

    var last = item.pathPoints.length - 1;
    if (index == last && !item.closed) return false;

    var next = (index < last) ? index + 1 : 0;
    var p2 = item.pathPoints[next];
    if (p2.selected != ANCHOR) return false;
    return true;
}


function getLinearPositions(p1, p2, count) {
    var position = {
        anchor: [],
        left: [],
        right: []
    };
    var x1 = p1.anchor[0];
    var y1 = p1.anchor[1];
    var x2 = p2.anchor[0];
    var y2 = p2.anchor[1];
    var width = x2 - x1;
    var height = y2 - y1;
    var points = count + 1;
    var x = width / points;
    var y = height / points;
    for (var i = 1; i < points; i++) {
        position.anchor.push([
            x1 + (x * i),
            y1 + (y * i)
        ]);
    }
    position.left = position.anchor;
    position.right = position.anchor;
    return position;
}


function getCurvedPositions(p1, p2, count) {
    var positions = [];
    var points = count + 1;
    var bezier = setBezier(p1, p2);
    for (var i = 0; i < points; i++) {
        var t1 = i / points;
        var t2 = (i + 1) / points;
        var curves = splitCurve(t1, t2, bezier);
        positions.push(curves);
    }
    return formatPosition(positions);
}


function formatPosition(bezier) {
    var start = 0;
    var end = bezier.length - 1;

    var position = {
        anchor: [[bezier[start][0].x, bezier[start][0].y]],
        left: [[undefined, undefined]],
        right: [[bezier[start][1].x, bezier[start][1].y]]
    };

    for (var i = 0; i < end; i++) {
        position.anchor.push([bezier[i][3].x, bezier[i][3].y]);
        position.left.push([bezier[i][2].x, bezier[i][2].y]);
        position.right.push([bezier[i + 1][1].x, bezier[i + 1][1].y]);
    }

    position.anchor.push([bezier[end][3].x, bezier[end][3].y]);
    position.left.push([bezier[end][2].x, bezier[end][2].y]);
    position.right.push([undefined, undefined]);
    return position;
}


function setBezier(p1, p2) {
    var anchor1 = {
        x: p1.anchor[0],
        y: p1.anchor[1]
    };
    var anchor2 = {
        x: p2.anchor[0],
        y: p2.anchor[1]
    };
    var handle1 = {
        x: p1.rightDirection[0],
        y: p1.rightDirection[1]
    };
    var handle2 = {
        x: p2.leftDirection[0],
        y: p2.leftDirection[1]
    };
    return [anchor1, handle1, handle2, anchor2];
}


function splitCurve(t1, t2, bezier) {
    var anchor1 = getEndPoint(t1, bezier);
    var handle1 = getControlPoint(t1, t2, bezier);
    var handle2 = getControlPoint(t2, t1, bezier);
    var anchor2 = getEndPoint(t2, bezier);
    return [
        { x: anchor1.x, y: anchor1.y },
        { x: handle1.x, y: handle1.y },
        { x: handle2.x, y: handle2.y },
        { x: anchor2.x, y: anchor2.y }
    ];
}


// B(t) = (1−t)^3 * P0 + 3 * (1−t)^2 * t * P1 + 3 * (1−t) * t^2 * P2 + t^3 * P3
function getEndPoint(t, bezier) {
    var _t = 1 - t;
    return add(
        add(
            add(
                mult(bezier[0], _t * _t * _t),
                mult(bezier[1], 3 * _t * _t * t)
            ),
            mult(bezier[2], 3 * _t * t * t)
        ),
        mult(bezier[3], t * t * t)
    );
}


// B(t1, t2) = (1−t1)^2 * ((1−t2) * P0 + t2 * P1) + 2 * (1−t1) * t1 * ((1−t2) * P1 + t2 * P2) + t1^2 * ((1−t2) * P2 + t2 * P3)
function getControlPoint(t1, t2, bezier) {
    var _t1 = 1 - t1;
    var _t2 = 1 - t2;
    return add(
        add(
            mult(
                add(mult(bezier[0], _t2), mult(bezier[1], t2)),
                _t1 * _t1
            ),
            mult(
                add(mult(bezier[1], _t2), mult(bezier[2], t2)),
                2 * _t1 * t1
            )
        ),
        mult(
            add(mult(bezier[2], _t2), mult(bezier[3], t2)),
            t1 * t1
        )
    );
}


function vector(v) {
    return {
        x: v.x,
        y: v.y
    };
}


function add(a, b) {
    var v = vector(a);
    v.x += b.x;
    v.y += b.y;
    return v;
}


function mult(a, t) {
    var v = vector(a);
    v.x *= t;
    v.y *= t;
    return v;
}


function hasCurve(p1, p2) {
    var right = hasHandle(p1.anchor, p1.rightDirection);
    var left = hasHandle(p2.anchor, p2.leftDirection);
    if (left || right) return true;
    return false;
}


function hasHandle(anchor, handle) {
    var a = {
        x: anchor[0],
        y: anchor[1]
    };
    var h = {
        x: handle[0],
        y: handle[1]
    };
    if (a.x == h.x && a.y == h.y) return false;
    return true;
}


function hasSelectedAnchorPoints(item) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    for (var i = 0; i < item.pathPoints.length; i++) {
        var p1 = item.pathPoints[i];
        if (p1.selected != ANCHOR) continue;

        var last = item.pathPoints.length - 1;
        if (i == last && !item.closed) continue;

        var index = (i < last) ? i + 1 : 0;
        var p2 = item.pathPoints[index];
        if (p2.selected != ANCHOR) continue;

        return true;
    }
    return false;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
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


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['right', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.count;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 200;
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button1.onClick = function() {
        dialog.close();
    }

    dialog.count = edittext1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Add Anchor Points',
            ja: 'アンカーポイントの追加'
        },
        count: {
            en: 'Add:',
            ja: '個数:'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
