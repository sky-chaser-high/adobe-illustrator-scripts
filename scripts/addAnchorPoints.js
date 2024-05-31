/* ===============================================================================================================================================
   addAnchorPoints

   Description
   This script adds any number of anchor points evenly spaced.
   It is a slightly more user-friendly improvement to Object > Path > Add Anchor Points.

   Usage
   1. Select two or more anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter the number of anchor points to add.

   Notes
   Anchor points for type on a path and area type are also supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

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
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    shapes = shapes.concat(texts);
    if (!shapes.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var count = parseInt(getValue(dialog.count.text));
        if (!count) return dialog.close();

        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            addAnchorPoints(shape, count);
        }
        dialog.close();
    }

    dialog.show();
}


function addAnchorPoints(shape, count) {
    var points = getEntirePoints(shape, count);
    shape.setEntirePath(points.anchor);
    for (var i = 0; i < points.anchor.length; i++) {
        var handle = shape.pathPoints[i];
        handle.leftDirection = points.left[i];
        handle.rightDirection = points.right[i];
    }
    shape.selected = true;
}


function getEntirePoints(item, count) {
    var points = getCurrentPoints(item);
    var start = 0;
    var last = item.pathPoints.length - 1;
    for (var i = start, index = start; i < item.pathPoints.length; i++) {
        if (!isSelected(item, i)) continue;

        var p1 = item.pathPoints[i];
        var next = (i < last) ? i + 1 : start;
        var p2 = item.pathPoints[next];

        var additionalPoints, insertPoint;
        var steps = index * count;

        if (isCurve(p1, p2)) {
            additionalPoints = getCurvedPositions(p1, p2, count);
            var end = additionalPoints.anchor.length - 1;
            additionalPoints.left[start] = points.left[i + steps];
            additionalPoints.right[end] = points.right[next + steps];
            if (i == last) {
                points.left[start] = additionalPoints.left[end];
                additionalPoints.anchor.pop();
            }
            insertPoint = [i + steps, 2];
        }
        else {
            additionalPoints = getLinearPositions(p1, p2, count);
            insertPoint = [i + steps + 1, 0];
        }

        points.anchor = concatenate(points.anchor, additionalPoints.anchor, insertPoint);
        points.left = concatenate(points.left, additionalPoints.left, insertPoint);
        points.right = concatenate(points.right, additionalPoints.right, insertPoint);
        index++;
    }
    return points;
}


// Insert an array into an array to make a single array.
// https://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
// Array.prototype.splice.apply(array1, [start, deleteCount].concat(array2));
function concatenate(array1, array2, insertPoint) {
    Array.prototype.splice.apply(array1, insertPoint.concat(array2));
    return array1;
}


function getCurrentPoints(item) {
    var points = {
        anchor: [], left: [], right: []
    };
    for (var i = 0; i < item.pathPoints.length; i++) {
        var point = item.pathPoints[i];
        points.anchor.push(point.anchor);
        points.left.push(point.leftDirection);
        points.right.push(point.rightDirection);
    }
    return points;
}


function getLinearPositions(p1, p2, count) {
    var points = count + 1;
    var x1 = p1.anchor[0];
    var y1 = p1.anchor[1];
    var x2 = p2.anchor[0];
    var y2 = p2.anchor[1];
    var dx = (x2 - x1) / points;
    var dy = (y2 - y1) / points;

    var position = {
        anchor: [], left: [], right: []
    };
    for (var i = 1; i < points; i++) {
        position.anchor.push([
            x1 + (dx * i),
            y1 + (dy * i)
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


function hasHandle(anchor, handle) {
    var x = 0;
    var y = 1;
    return anchor[x] != handle[x] || anchor[y] != handle[y];
}


function isCurve(p1, p2) {
    var right = hasHandle(p1.anchor, p1.rightDirection);
    var left = hasHandle(p2.anchor, p2.leftDirection);
    return left || right;
}


function hasSelectedAnchorPoints(item) {
    var points = item.pathPoints;
    for (var i = 0; i < points.length; i++) {
        if (isSelected(item, i)) return true;
    }
    return false;
}


function isSelected(item, index) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var points = item.pathPoints;

    var p1 = points[index];
    if (p1.selected != ANCHOR) return false;

    var last = points.length - 1;
    if (index == last && !item.closed) return false;

    var next = (index < last) ? index + 1 : 0;
    var p2 = points[next];
    if (p2.selected != ANCHOR) return false;
    return true;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && hasSelectedAnchorPoints(item)) {
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


function getTextPathItems() {
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && text.kind != TextType.POINTTEXT) {
            var shape = text.textPath;
            if (!hasSelectedAnchorPoints(shape)) continue;
            items.push(shape);
        }
    }
    return items;
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
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
    edittext1.preferredSize.width = 180;
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.addEventListener('keydown', function(event) {
        var value = getValue(this.text);
        var keyboard = ScriptUI.environment.keyboardState;
        var step = keyboard.shiftKey ? 5 : 1;
        var points;
        if (event.keyName == 'Up') {
            points = value + step;
            this.text = points;
            event.preventDefault();
        }
        if (event.keyName == 'Down') {
            points = value - step;
            if (points < 1) points = 1;
            this.text = points;
            event.preventDefault();
        }
    });

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
