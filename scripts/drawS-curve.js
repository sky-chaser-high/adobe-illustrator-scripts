/* ===============================================================================================================================================
   drawS-curve

   Description
   This script draws an S-curve between two objects or converts an open path to an S-curve.

   Usage
   1. Select two objects or one open path object, run this script from File > Scripts > Other Script...
   2. To change the curvature, enter the bend in the text field or use the slider to set the value.
      The slider allows only up to 200%, but you can enter higher values in the text field.
   3. To angle the S-curve, enter the angle in the text field or use the slider to set the value.
      The angle is specified in degrees.
   4. Check the Opposite checkbox to draw the curve at the opposite side.

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
    var shapes = getSelectedItems(items);
    if (!shapes.length) return;

    var config = {
        bend: 100,
        angle: 0,
        opposite: false
    };
    var done = drawSCurve(shapes, config.bend, config.angle, config.opposite);
    if (!done) return;
    app.redraw();

    var dialog = showDialog();

    dialog.bend.onChanging = function() {
        dialog.slider1.value = getValue(this.text);
        preview(dialog, shapes);
    }

    dialog.angle.onChanging = function() {
        dialog.slider2.value = getValue(this.text);
        preview(dialog, shapes);
    }

    dialog.slider1.onChanging = function() {
        dialog.bend.text = Math.round(this.value);
        preview(dialog, shapes);
    }

    dialog.slider2.onChanging = function() {
        dialog.angle.text = Math.round(this.value);
        preview(dialog, shapes);
    }

    dialog.opposite.onClick = function() {
        preview(dialog, shapes);
    }

    dialog.show();
}


function preview(dialog, shapes) {
    app.undo();
    var config = getConfiguration(dialog);
    drawSCurve(shapes, config.bend, config.angle, config.opposite);
    app.redraw();
}


function drawSCurve(shapes, bend, angle, isOpposite) {
    var items = getSortedItem(shapes);
    if (!items) return false;

    var order = { top: true, end: false };
    var isClosedPath = !isOpenPath(shapes);

    var p1 = setAnchorPoint(items[0], order.top, isClosedPath, isOpposite);
    var p2 = setAnchorPoint(items[1], order.end, isClosedPath, isOpposite);
    var points = [
        [p1.x, p1.y],
        [p2.x, p2.y]
    ];

    var distance = p1.x - p2.x;
    if (!distance) distance = p1.y - p2.y;
    var length = Math.abs(distance) * (bend / 100);

    var rad = convertToRadian(angle);
    if (isOpposite) rad -= Math.PI;

    // Make the Angle slider operation intuitive
    if (p2.x < p1.x) rad *= -1;

    var color = setColor();
    if (isClosedPath) drawCurve(points, length, rad, color);
    else convertToCurve(shapes[0], points, length, rad, color);
    return true;
}


function drawCurve(points, length, angle, color) {
    var layer = app.activeDocument.activeLayer;
    var curve = layer.pathItems.add();
    curve.setEntirePath(points);
    curve.filled = false;
    curve.stroked = true;
    curve.strokeColor = color;
    curve.strokeWidth = 0.5;
    curve.strokeCap = StrokeCap.BUTTENDCAP;
    curve.strokeJoin = StrokeJoin.MITERENDJOIN;
    curve.strokeDashes = [];
    setHandle(curve.pathPoints, length, angle);
}


function convertToCurve(shape, points, length, angle) {
    shape.setEntirePath(points);
    setHandle(shape.pathPoints, length, angle);
}


function setHandle(points, length, angle) {
    var x = length * Math.cos(angle);
    var y = length * Math.sin(angle);

    var p1 = points[0];
    p1.rightDirection = [
        p1.anchor[0] - x,
        p1.anchor[1] - y
    ];

    var p2 = points[1];
    p2.leftDirection = [
        p2.anchor[0] + x,
        p2.anchor[1] + y
    ];
}


function setAnchorPoint(item, isTop, isClosedPath, isOpposite) {
    var bounds = item.geometricBounds;
    var x = (isTop) ? bounds[0] : bounds[2];
    if (isOpposite) x = (isTop) ? bounds[2] : bounds[0];
    var y = bounds[1];
    if (isClosedPath) y -= (item.height / 2);
    return {
        x: x,
        y: y
    };
}


function getSortedItem(shapes) {
    var items;
    if (isOpenPath(shapes)) {
        items = sortAnchorPoints(shapes[0]);
    }
    else {
        items = sortRow(shapes);
        if (items.length < 2) return;
    }
    return items;
}


function sortAnchorPoints(shape) {
    var points = shape.pathPoints;
    var start = 0;
    var end = points.length - 1;
    var p1 = points[start];
    var p2 = points[end];
    var x1 = p1.anchor[0];
    var y1 = p1.anchor[1];
    var x2 = p2.anchor[0];
    var y2 = p2.anchor[1];
    var width = Math.abs(x1 - x2);
    var height = Math.abs(y1 - y2);
    var items = [
        { left: x1, top: y1, width: width, height: height, geometricBounds: [x1, y1, x1, y1] },
        { left: x2, top: y2, width: width, height: height, geometricBounds: [x2, y2, x2, y2] }
    ];
    return sortRow(items);
}


function sortRow(items) {
    var tolerance = 0;
    return items.sort(function(a, b) {
        var distance = Math.abs(b.top - a.top);
        if (distance <= tolerance) {
            return a.left - b.left;
        }
        return b.top - a.top;
    });
}


function sortColumn(items) {
    var tolerance = 0;
    return items.sort(function(a, b) {
        var distance = Math.abs(b.left - a.left);
        if (distance <= tolerance) {
            return a.top - b.top;
        }
        return b.left - a.left;
    });
}


function isOpenPath(shapes) {
    if (shapes.length != 1) return false;
    var shape = shapes[0];
    if (shape.typename != 'PathItem') return false;
    if (shape.closed) return false;
    return true;
}


function setColor() {
    var CMYK = DocumentColorSpace.CMYK;
    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == CMYK) ? setCMYKColor(0, 0, 0, 100) : setRGBColor(0, 0, 0);
    return color;
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


function getSelectedItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (isClipped(item)) {
            shapes.push(item.pageItems[0]);
        }
        else if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getSelectedItems(item.pageItems));
        }
        else {
            shapes.push(item);
        }
    }
    return shapes;
}


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
}


function convertToRadian(deg) {
    return deg / 180 * Math.PI;
}


function isValidVersion() {
    var cs4 = 14;
    var current = parseInt(app.version);
    if (current < cs4) return false;
    return true;
}


function getConfiguration(dialog) {
    var bend = getValue(dialog.bend.text);
    var angle = getValue(dialog.angle.text);
    return {
        bend: bend,
        angle: angle,
        opposite: dialog.opposite.value
    };
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

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 17;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.bend;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.angle;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.preferredSize.width = 200;
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 15;
    group3.margins = 0;

    var slider1 = group3.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = 200;
    slider1.value = 100;

    var slider2 = group3.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = -180;
    slider2.maxvalue = 180;
    slider2.value = 0;

    var group4 = group1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '100';
    edittext1.preferredSize.width = 40;
    edittext1.active = true;

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '0';
    edittext2.preferredSize.width = 40;

    var group5 = group1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 18;
    group5.margins = 0;

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = '%';

    var statictext4 = group5.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = '°';

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 4, 0, 0];

    var checkbox1 = group6.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.opposite;

    var group7 = dialog.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var button1 = group7.add('button', undefined, undefined, { name: 'Cancel' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group7.add('button', undefined, undefined, { name: 'OK' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    button1.onClick = function() {
        app.undo();
        dialog.close();
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.bend = edittext1;
    dialog.angle = edittext2;
    dialog.slider1 = slider1;
    dialog.slider2 = slider2;
    dialog.opposite = checkbox1;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Draw S-curve',
            ja: 'S字カーブを描く'
        },
        bend: {
            en: 'Bend:',
            ja: 'カーブ:'
        },
        angle: {
            en: 'Angle:',
            ja: '角度:'
        },
        opposite: {
            en: 'Opposite',
            ja: '反対側'
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
