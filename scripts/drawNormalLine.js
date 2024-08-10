/* ===============================================================================================================================================
   drawNormalLine

   Description
   This script draws normal lines (line perpendicular to a tangent) to a curve or line between two anchor points.

   Usage
   1. Select two or more anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter the number of normal lines to draw.
   3. Enter the length of normal line to draw.
   4. Check the Draw on Selected Anchor Points checkbox if you want to draw on the selected anchor points.
   5. Check the Flip checkbox reverses the drawing position.
   6. Check the Middle checkbox to draw in the middle of the path segment.
   7. Enter a value of the margin will space them from the path segment.

   Notes
   Anchor points for type on a path and area type are not supported.
   The units of the Length and Margin value depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.1

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
    var points = getSelectedAnchorPoints(shapes);
    if (!shapes.length || !points.length) return;

    var ruler = getRulerUnits();
    var length = convertUnits('10' + ruler, 'pt');
    showNormalLines(points, {
        count: 1, length: length, include: false, margin: 0, flip: false, middle: false
    });
    app.redraw();

    var dialog = showDialog(points);
    dialog.show();
}


function getConfiguration(dialog) {
    var count = getValue(dialog.lines.text);
    if (count < 1) count = 1;
    var length = getValue(dialog.length.text);
    var include = dialog.include.value;
    var flip = dialog.flip.value;
    var middle = dialog.middle.value;
    var margin = getValue(dialog.margin.text);
    var units = dialog.units;
    return {
        count: parseInt(count),
        length: convertUnits(length + units, 'pt'),
        include: include,
        flip: flip,
        middle: middle,
        margin: convertUnits(margin + units, 'pt')
    };
}


function preview(dialog, points) {
    reset(points);
    var config = getConfiguration(dialog);
    showNormalLines(points, config);
    app.redraw();
}


function showNormalLines(points, config) {
    for (var i = 0; i < points.length; i++) {
        var positions = points[i];
        if (!positions.length) continue;
        drawNormalLines(
            positions,
            config.count,
            config.length,
            config.include,
            config.margin,
            config.flip,
            config.middle
        );
    }
}


function drawNormalLines(positions, count, length, isInclude, margin, isFlip, isMiddle) {
    var points = getNormalLinePositions(positions, count, length, isInclude);
    for (var i = 0; i < points.anchor.length; i++) {
        var anchor = points.anchor[i];
        var handle = {
            left: points.left[i],
            right: points.right[i]
        };
        createLine(anchor, handle, length, margin, isFlip, isMiddle);
    }
}


function createLine(anchor, handle, length, margin, isFlip, isMiddle) {
    var point = (handle.left[0]) ? handle.left : handle.right;
    var sign = (handle.left[0]) ? 1 : -1;
    if (isFlip) sign *= -1;

    var angle = getAngle(anchor, point);
    var rad = angle - (Math.PI / 2) * sign;
    var width = length * Math.cos(rad);
    var height = length * Math.sin(rad);
    var x1 = anchor[0];
    var y1 = anchor[1];
    var x2 = x1 + width;
    var y2 = y1 + height;

    var line = app.activeDocument.activeLayer.pathItems.add();
    line.filled = false;
    line.stroked = true;
    line.strokeWidth = 1;
    line.setEntirePath([[x1, y1], [x2, y2]]);

    if (isMiddle) {
        var center = getCenter([x1, y1], [x2, y2]);
        line.translate(center.x, center.y);
    }

    if (margin) {
        var distance = getDistance(margin, rad);
        line.translate(distance.x, distance.y);
    }
}


function getDistance(value, angle) {
    var x = value * Math.cos(angle);
    var y = value * Math.sin(angle);
    return {
        x: x,
        y: y
    };
}


function getAngle(point1, point2) {
    var x = 0;
    var y = 1;
    var width = point2[x] - point1[x];
    var height = point2[y] - point1[y];
    return Math.atan2(height, width);
}


function getCenter(point1, point2) {
    var x = 0;
    var y = 1;
    return {
        x: (point1[x] - point2[x]) / 2,
        y: (point1[y] - point2[y]) / 2
    };
}


function getNormalLinePositions(positions, count, length, isInclude) {
    var lines = {
        anchor: [], left: [], right: []
    };
    var points;
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];

        if (isCurve(pos.point1, pos.point2)) {
            points = getCurvedPoints(pos.point1, pos.point2, count);
        }
        else {
            points = getLinearPoints(pos.point1, pos.point2, count, length);
        }
        if (!isInclude) removeSelectedAnchorPositions(points);
        removeDupe(points, lines);

        var insertPoint = [lines.anchor.length, 0];

        lines.anchor = concatenate(lines.anchor, points.anchor, insertPoint);
        lines.left = concatenate(lines.left, points.left, insertPoint);
        lines.right = concatenate(lines.right, points.right, insertPoint);
    }
    return lines;
}


// Insert an array into an array to make a single array.
// https://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
// Array.prototype.splice.apply(array1, [start, deleteCount].concat(array2));
function concatenate(array1, array2, insertPoint) {
    Array.prototype.splice.apply(array1, insertPoint.concat(array2));
    return array1;
}


function removeSelectedAnchorPositions(points) {
    points.anchor.pop();
    points.left.pop();
    points.right.pop();
    points.anchor.shift();
    points.left.shift();
    points.right.shift();
}


function removeDupe(p1, p2) {
    if (!p2.anchor.length) return;
    var start = 0;
    var end = p2.anchor.length - 1;
    if (isSameCoordinates(p1.anchor[start], p2.anchor[end]) &&
        isFlat(p1.anchor[start], p1.right[start], p2.anchor[end], p2.left[end])) {
        p1.anchor.shift();
        p1.left.shift();
        p1.right.shift();
    }
    end = p1.anchor.length - 1;
    if (isSameCoordinates(p1.anchor[end], p2.anchor[start]) &&
        isFlat(p1.anchor[end], p1.left[end], p2.anchor[start], p2.right[start])) {
        p1.anchor.pop();
        p1.left.pop();
        p1.right.pop();
    }
}


function isFlat(anchor1, handle1, anchor2, handle2) {
    var x = 0;
    var y = 1;
    var sq = 2;
    var x1 = anchor1[x] - handle1[x];
    var y1 = anchor1[y] - handle1[y];
    var x2 = anchor2[x] - handle2[x];
    var y2 = anchor2[y] - handle2[y];
    var l1 = Math.sqrt(Math.pow(x1, sq) + Math.pow(y1, sq));
    var l2 = Math.sqrt(Math.pow(x2, sq) + Math.pow(y2, sq));
    // dot product
    var cos = ((x1 * x2) + (y1 * y2)) / (l1 * l2);
    return cos == 1 || cos == -1;
}


function isSameCoordinates(point1, point2) {
    var x = 0;
    var y = 1;
    return point1[x] == point2[x] && point1[y] == point2[y];
}


function getLinearPoints(p1, p2, count, length) {
    var points = count + 1;
    var x1 = p1.anchor[0];
    var y1 = p1.anchor[1];
    var x2 = p2.anchor[0];
    var y2 = p2.anchor[1];
    var dx = (x2 - x1) / points;
    var dy = (y2 - y1) / points;
    var rad = getAngle(p1.anchor, p2.anchor);
    var w = length * Math.cos(rad);
    var h = length * Math.sin(rad);

    var position = {
        anchor: [[x1, y1]],
        left: [[x1 - w, y1 - h]],
        right: [[x1 - w, y1 - h]]
    };

    for (var i = 1; i < points; i++) {
        var px = x1 + (dx * i);
        var py = y1 + (dy * i);
        position.anchor.push([px, py]);
        position.left.push([px - w, py - h]);
        position.right.push([px - w, py - h]);
    }

    position.anchor.push([x2, y2]);
    position.left.push([x2 - w, y2 - h]);
    position.right.push([x2 - w, y2 - h]);
    return position;
}


function getCurvedPoints(p1, p2, count) {
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


function isSelected(shape, index) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var points = shape.pathPoints;

    var p1 = points[index];
    if (p1.selected != ANCHOR) return false;

    var last = points.length - 1;
    if (index == last && !shape.closed) return false;

    var next = (index < last) ? index + 1 : 0;
    var p2 = points[next];
    if (p2.selected != ANCHOR) return false;
    return true;
}


function getSelectedAnchorPoints(shapes) {
    var anchors = [];
    for (var i = 0, count = 0; i < shapes.length; i++) {
        anchors.push([]);
        var shape = shapes[i];
        var points = shape.pathPoints;
        for (var j = 0; j < points.length; j++) {
            if (!isSelected(shape, j)) continue;
            var p1 = points[j];
            var last = points.length - 1;
            var next = (j < last) ? j + 1 : 0;
            var p2 = points[next];
            anchors[count].push({
                point1: p1,
                point2: p2
            });
        }
        if (!anchors[count].length) anchors.pop();
        else count++;
    }
    return anchors;
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


function reset(items) {
    app.undo();
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var NOSELECTION = PathPointSelection.NOSELECTION;
    var item, point, points;
    for (var i = 0; i < items.length; i++) {
        item = items[i][0].point1;
        points = item.parent.pathPoints;
        for (var j = 0; j < points.length; j++) {
            point = points[j];
            point.selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        points = items[i];
        for (var j = 0; j < points.length; j++) {
            point = points[j];
            var point1 = point.point1;
            point1.selected = ANCHOR;
            var point2 = point.point2;
            point2.selected = ANCHOR;
        }
    }
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
}


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function getRulerUnits() {
    var unit = getUnitSymbol();
    if (!app.documents.length) return unit.pt;

    var document = app.activeDocument;
    var src = document.fullName;
    var ruler = document.rulerUnits;
    try {
        switch (ruler) {
            case RulerUnits.Pixels: return unit.px;
            case RulerUnits.Points: return unit.pt;
            case RulerUnits.Picas: return unit.pc;
            case RulerUnits.Inches: return unit.inch;
            case RulerUnits.Millimeters: return unit.mm;
            case RulerUnits.Centimeters: return unit.cm;

            case RulerUnits.Feet: return unit.ft;
            case RulerUnits.Yards: return unit.yd;
            case RulerUnits.Meters: return unit.meter;
        }
    }
    catch (err) {
        switch (xmpRulerUnits(src)) {
            case 'Feet': return unit.ft;
            case 'Yards': return unit.yd;
            case 'Meters': return unit.meter;
        }
    }
    return unit.pt;
}


function xmpRulerUnits(src) {
    if (!ExternalObject.AdobeXMPScript) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var prop = 'xmpTPg:MaxPageSize';
    var unit = prop + '/stDim:unit';

    var ruler = xmp.getProperty(namespace, unit).value;
    return ruler;
}


function getUnitSymbol() {
    return {
        px: 'px',
        pt: 'pt',
        pc: 'pc',
        inch: 'in',
        ft: 'ft',
        yd: 'yd',
        mm: 'mm',
        cm: 'cm',
        meter: 'm'
    };
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(points) {
    $.localize = true;
    var ui = localizeUI();
    var ruler = getRulerUnits();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.normal;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 8, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 18;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.lines;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.length;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 150;
    edittext1.active = true;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '10';
    edittext2.preferredSize.width = 150;

    var statictext3 = group4.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ruler;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 4, 0, 0];

    var checkbox1 = group5.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.include;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.position;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 10, 0, 0];

    var checkbox2 = group6.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.flip;

    var checkbox3 = group6.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.middle;

    var group7 = panel2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext4 = group7.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.margin;

    var edittext3 = group7.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '0';
    edittext3.preferredSize.width = 60;

    var statictext5 = group7.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ruler;

    var group8 = dialog.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group8.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

    var button1 = group8.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group8.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.onChanging = function() {
        preview(dialog, points);
    }

    edittext2.onChanging = function() {
        preview(dialog, points);
    }

    checkbox1.onClick = function() {
        preview(dialog, points);
    }

    checkbox2.onClick = function() {
        preview(dialog, points);
    }

    checkbox3.onClick = function() {
        preview(dialog, points);
    }

    edittext3.onChanging = function() {
        preview(dialog, points);
    }

    edittext1.addEventListener('keydown', function(event) {
        setLineValue(event);
        preview(dialog, points);
    });

    edittext2.addEventListener('keydown', function(event) {
        setLineValue(event);
        preview(dialog, points);
    });

    edittext3.addEventListener('keydown', function(event) {
        setMarginValue(event);
        preview(dialog, points);
    });

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    button0.onClick = function() {
        reset(points);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.lines = edittext1;
    dialog.length = edittext2;
    dialog.include = checkbox1;
    dialog.flip = checkbox2;
    dialog.middle = checkbox3;
    dialog.margin = edittext3;
    dialog.units = ruler;
    dialog.ok = button2;
    return dialog;
}


function setLineValue(event) {
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 5 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.target.text = value;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        if (value < 1) value = 1;
        event.target.text = value;
        event.preventDefault();
    }
}


function setMarginValue(event) {
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 5 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.target.text = value;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        event.target.text = value;
        event.preventDefault();
    }
}


function localizeUI() {
    return {
        title: {
            en: 'Draw Normal Line',
            ja: '法線を描く'
        },
        normal: {
            en: 'Normal Line',
            ja: '法線'
        },
        lines: {
            en: 'Lines:',
            ja: '本数:'
        },
        length: {
            en: 'Length:',
            ja: '長さ:'
        },
        include: {
            en: 'Draw on Selected Anchor Points',
            ja: '選択アンカーポイントにも描く'
        },
        position: {
            en: 'Position',
            ja: '位置'
        },
        flip: {
            en: 'Flip',
            ja: '反転'
        },
        middle: {
            en: 'Middle',
            ja: '中間'
        },
        margin: {
            en: 'Margin:',
            ja: '距離:'
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
