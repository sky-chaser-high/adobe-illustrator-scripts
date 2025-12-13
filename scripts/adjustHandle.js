/* ===============================================================================================================================================
   adjustHandle

   Description
   This script adjusts selected handle lengths and angles.

   Usage
   1. Select two or more anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Select a length and an angle.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    shapes = shapes.concat(texts);
    if (!shapes.length) return;

    var points = getSelectedPoints(shapes);

    var dialog = showDialog(points);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) return dialog.close();

        var config = getConfiguration(dialog);
        adjustHandles(shapes, config.length, config.angle);

        dialog.close();
    }

    dialog.length.long.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.length.short.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.length.swap.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.length.none.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.angle.long.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.angle.short.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.angle.swap.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.angle.none.onClick = function() {
        preview(dialog, shapes, points);
    }

    dialog.preview.onClick = function() {
        if (this.value) {
            var config = getConfiguration(dialog);
            adjustHandles(shapes, config.length, config.angle);
        }
        else {
            reset(points);
            app.redraw();
        }
    }

    dialog.show();
}


function preview(dialog, shapes, points) {
    if (!dialog.preview.value) return;
    reset(points);
    var config = getConfiguration(dialog);
    adjustHandles(shapes, config.length, config.angle);
}


function adjustHandles(items, length, angle) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var points = item.pathPoints;
        var count = points.length;
        if (!item.closed) count--;
        for (var j = 0; j < count; j++) {
            if (!isAdjacent(points, j)) continue;
            adjustHandle(j, points, length, angle);
        }
    }
    app.redraw();
}


function adjustHandle(index, points, length, angle) {
    var end = points.length - 1;
    var next = (index < end) ? index + 1 : 0;

    var p1 = points[index];
    var p2 = points[next];

    var adjustedLength = setAdjustedLength(p1, p2, length);
    var adjustedAngle = setAdjustedAngle(p1, p2, angle);

    var ax1 = p1.anchor[0];
    var ay1 = p1.anchor[1];
    var hx1 = adjustedLength.length1 * Math.cos(adjustedAngle.angle1);
    var hy1 = adjustedLength.length1 * Math.sin(adjustedAngle.angle1);
    p1.rightDirection = [ax1 + hx1, ay1 + hy1];

    var ax2 = p2.anchor[0];
    var ay2 = p2.anchor[1];
    var hx2 = adjustedLength.length2 * Math.cos(adjustedAngle.angle2);
    var hy2 = adjustedLength.length2 * Math.sin(adjustedAngle.angle2);
    p2.leftDirection = [ax2 + hx2, ay2 + hy2];
}


function setAdjustedLength(p1, p2, length) {
    var length1 = getLength(p1.anchor, p1.rightDirection);
    var length2 = getLength(p2.anchor, p2.leftDirection);

    if (length.isLong) {
        if (length1 < length2) length1 = length2;
        else length2 = length1;
    }
    if (length.isShort) {
        if (length1 < length2) length2 = length1;
        else length1 = length2;
    }
    if (length.isSwap) {
        length1 = getLength(p2.anchor, p2.leftDirection);
        length2 = getLength(p1.anchor, p1.rightDirection);
    }

    return {
        length1: length1,
        length2: length2
    };
}


function setAdjustedAngle(p1, p2, angle) {
    var angle1 = getAngle(p1.anchor, p1.rightDirection);
    var length1 = getLength(p1.anchor, p1.rightDirection);

    var angle2 = getAngle(p2.anchor, p2.leftDirection);
    var length2 = getLength(p2.anchor, p2.leftDirection);

    var gradient = getAngle(p1.anchor, p2.anchor);
    if (angle.isLong) {
        if (length1 < length2) angle1 = Math.PI - angle2 + gradient * 2;
        else angle2 = Math.PI - angle1 + gradient * 2;
    }
    if (angle.isShort) {
        if (length1 < length2) angle2 = Math.PI - angle1 + gradient * 2;
        else angle1 = Math.PI - angle2 + gradient * 2;
    }
    if (angle.isSwap) {
        angle1 = Math.PI - getAngle(p2.anchor, p2.leftDirection) + gradient * 2;
        angle2 = Math.PI - getAngle(p1.anchor, p1.rightDirection) + gradient * 2;
    }

    return {
        angle1: angle1,
        angle2: angle2
    };
}


function getLength(point1, point2) {
    var x = 0;
    var y = 1;
    var width = point2[x] - point1[x];
    var height = point2[y] - point1[y];
    var length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    return length;
}


function getAngle(point1, point2) {
    var x = 0;
    var y = 1;
    var width = point2[x] - point1[x];
    var height = point2[y] - point1[y];
    return Math.atan2(height, width);
}


function isAdjacent(points, index) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var end = points.length - 1;
    var next = (index < end) ? index + 1 : 0;
    var point = points[next];
    var current = points[index];

    return current.selected == ANCHOR && point.selected == ANCHOR;
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


function reset(items) {
    app.undo();
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var NOSELECTION = PathPointSelection.NOSELECTION;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var points = item.parent.pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            point.selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        var point = items[i];
        point.selected = ANCHOR;
    }
}


function getSelectedPoints(items) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var selection = [];
    for (var i = 0; i < items.length; i++) {
        var points = items[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;
            selection.push(point);
        }
    }
    return selection;
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


function isValidVersion() {
    var cs4 = 14;
    var current = parseInt(app.version);
    if (current < cs4) return false;
    return true;
}


function getConfiguration(dialog) {
    return {
        length: {
            isLong: dialog.length.long.value,
            isShort: dialog.length.short.value,
            isSwap: dialog.length.swap.value,
            isNone: dialog.length.none.value
        },
        angle: {
            isLong: dialog.angle.long.value,
            isShort: dialog.angle.short.value,
            isSwap: dialog.angle.swap.value,
            isNone: dialog.angle.none.value
        }
    };
}


function showDialog(points) {
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
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.length;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 8, 0, 0];

    var radiobutton1 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.long;
    radiobutton1.value = true;

    var radiobutton2 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.short;

    var radiobutton3 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.swap;

    var radiobutton4 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.none;

    var panel2 = group1.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.angle;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group3 = panel2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 8, 0, 0];

    var radiobutton5 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = ui.long;
    radiobutton5.value = true;

    var radiobutton6 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = ui.short;

    var radiobutton7 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    radiobutton7.text = ui.swap;

    var radiobutton8 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    radiobutton8.text = ui.none;

    var group4 = dialog.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var checkbox1 = group4.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.preview;
    checkbox1.alignment = ['left', 'top'];

    var button1 = group4.add('button', undefined, undefined, { name: 'Cancel' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group4.add('button', undefined, undefined, { name: 'OK' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    button1.onClick = function() {
        if (checkbox1.value) reset(points);
        dialog.close();
    }

    dialog.length = {
        'long': radiobutton1,
        'short': radiobutton2,
        'swap': radiobutton3,
        'none': radiobutton4
    };
    dialog.angle = {
        'long': radiobutton5,
        'short': radiobutton6,
        'swap': radiobutton7,
        'none': radiobutton8
    };
    dialog.preview = checkbox1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        'title': {
            en: 'Adjust Handle',
            ja: 'ハンドルを調整'
        },
        'length': {
            en: 'Length',
            ja: '長さ'
        },
        'angle': {
            en: 'Angle',
            ja: '角度'
        },
        'long': {
            en: 'Long',
            ja: '長いハンドル'
        },
        'short': {
            en: 'Short',
            ja: '短いハンドル'
        },
        'swap': {
            en: 'Swap',
            ja: '交換'
        },
        'none': {
            en: 'No Adjustment',
            ja: '調整なし'
        },
        'preview': {
            en: 'Preview',
            ja: 'プレビュー'
        },
        'cancel': {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        'ok': {
            en: 'OK',
            ja: 'OK'
        }
    };
}
