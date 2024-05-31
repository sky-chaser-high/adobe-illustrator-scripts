/* ===============================================================================================================================================
   drawShapeParallelToPathSegment

   Description
   This script draws a shape parallel to a straight segment or a line connecting two anchor points.

   Usage
   1. Select two anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Select a Square, Rectangle or Ellipse.
   3. If you select the Rectangle or Ellipse, enter width and height values.
   4. Check the Flip checkbox reverses the drawing position.
   5. Check the Middle checkbox to draw in the middle of the path segment.
   6. Enter a value of the margin will space them from the path segment.

   Notes
   Curves are not supported.
   Anchor points for type on a path and area type are also supported.
   The units of the Width, Height and Margin value depend on the ruler units.
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
    var points = getSelectedAnchorPoints(shapes.concat(texts));
    if (points.length != 2) return;

    var p1 = setPoint(points[0]);
    var p2 = setPoint(points[1]);
    var length = getLength(p1, p2);
    var shape = {
        ellipse: false,
        width: length,
        height: length
    }
    var margin = 0;
    var flip = false;
    var middle = false;

    drawShape(points, shape, margin, flip, middle);
    app.redraw();

    var dialog = showDialog(points);
    dialog.show();
}


function getConfiguration(dialog) {
    var width = getValue(dialog.shape.width.text);
    var height = getValue(dialog.shape.height.text);
    var flip = (dialog.flip.value) ? true : false;
    var middle = (dialog.middle.value) ? true : false;
    var margin = getValue(dialog.margin.text);
    var units = dialog.units;
    return {
        shape: {
            ellipse: dialog.shape.ellipse.value,
            width: convertUnits(width + units, 'pt'),
            height: convertUnits(height + units, 'pt')
        },
        flip: flip,
        middle: middle,
        margin: convertUnits(margin + units, 'pt')
    };
}


function preview(dialog, points) {
    reset(points);
    var config = getConfiguration(dialog);
    drawShape(points, config.shape, config.margin, config.flip, config.middle);
    app.redraw();
}


function drawShape(points, shape, margin, isFlip, isMiddle) {
    var p1 = isFlip ? setPoint(points[1]) : setPoint(points[0]);
    var p2 = isFlip ? setPoint(points[0]) : setPoint(points[1]);

    var position = getPosition(p1, p2, shape.width);
    var rad = getAngle(p1, p2);
    var deg = rad * 180 / Math.PI;

    var layer = app.activeDocument.activeLayer;
    var rectangle = shape.ellipse
        ? layer.pathItems.ellipse(position.top, position.left, shape.width, shape.height)
        : layer.pathItems.rectangle(position.top, position.left, shape.width, shape.height);
    rectangle.filled = false;
    rectangle.stroked = true;
    rectangle.strokeWidth = 1;

    rectangle.rotate(deg, true, true, true, true, Transformation.TOPLEFT);
    if (isMiddle) {
        var pathPoints = rectangle.pathPoints;
        var a1 = shape.ellipse ? pathPoints[3] : pathPoints[0];
        var a2 = shape.ellipse ? pathPoints[1] : pathPoints[1];
        var center = getCenter(a1.anchor, a2.anchor);
        rectangle.translate(center.x, center.y);
    }
    if (margin) {
        var angle = rad - Math.PI / 2;
        var distance = getDistance(margin, angle);
        rectangle.translate(distance.x, distance.y);
    }
}


function getPosition(point1, point2, length) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
    var rad = getAngle(point1, point2);
    var distance = getDistance(length, rad);
    return {
        left: point1.x + (width / 2) - (distance.x / 2),
        top: point1.y + (height / 2) - (distance.y / 2)
    };
}


function getCenter(point1, point2) {
    var p1 = {
        x: point1[0],
        y: point1[1]
    };
    var p2 = {
        x: point2[0],
        y: point2[1]
    };
    var x = (p2.x - p1.x) / 2;
    var y = (p2.y - p1.y) / 2;
    return {
        x: x,
        y: y
    };
}


function getDistance(value, angle) {
    var x = value * Math.cos(angle);
    var y = value * Math.sin(angle);
    return {
        x: x,
        y: y
    };
}


function getLength(point1, point2) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
    var sq = 2;
    var length = Math.sqrt(Math.pow(width, sq) + Math.pow(height, sq));
    return length;
}


function getAngle(point1, point2) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
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
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && text.kind != TextType.POINTTEXT) {
            items.push(text.textPath);
        }
    }
    return items;
}


function reset(items) {
    app.undo();
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var NOSELECTION = PathPointSelection.NOSELECTION;
    for (var i = 0; i < items.length; i++) {
        var points = items[i].parent.pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            point.selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.selected = ANCHOR;
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
    var p1 = setPoint(points[0]);
    var p2 = setPoint(points[1]);
    var length = getLength(p1, p2);
    length = convertUnits(length + 'pt', ruler);

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.shape;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 8, 0, 0];

    var radiobutton1 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.square;
    radiobutton1.value = true;

    var radiobutton2 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.rectangle;

    var radiobutton3 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.ellipse;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;
    group2.enabled = false;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 18;
    group3.margins = 0;

    var statictext1 = group3.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.width;

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.height;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = length;
    edittext1.preferredSize.width = 150;

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = length;
    edittext2.preferredSize.width = 150;

    var group5 = group2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 18;
    group5.margins = 0;

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ruler;

    var statictext4 = group5.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ruler;

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

    var checkbox1 = group6.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.flip;

    var checkbox2 = group6.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.middle;

    var group7 = panel2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext5 = group7.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.margin;

    var edittext3 = group7.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '0';
    edittext3.preferredSize.width = 60;

    var statictext6 = group7.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ruler;

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

    radiobutton1.onClick = function() {
        group2.enabled = false;
        edittext1.text = length;
        edittext2.text = length;
        preview(dialog, points);
    }

    radiobutton2.onClick = function() {
        group2.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
        preview(dialog, points);
    }

    radiobutton3.onClick = function() {
        group2.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
        preview(dialog, points);
    }

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

    edittext3.onChanging = function() {
        preview(dialog, points);
    }

    edittext1.addEventListener('keydown', function(event) {
        setSizeValue(event);
        preview(dialog, points);
    });

    edittext2.addEventListener('keydown', function(event) {
        setSizeValue(event);
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

    statictext5.addEventListener('click', function() {
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

    dialog.shape = {
        square: radiobutton1,
        rectangle: radiobutton2,
        ellipse: radiobutton3,
        size: group2,
        width: edittext1,
        height: edittext2
    };
    dialog.flip = checkbox1;
    dialog.middle = checkbox2;
    dialog.margin = edittext3;
    dialog.units = ruler;
    return dialog;
}


function setSizeValue(event) {
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
            en: 'Draw Shape Parallel to Path Segment',
            ja: '直線に並行な図形を描く'
        },
        shape: {
            en: 'Shape',
            ja: '図形'
        },
        square: {
            en: 'Square',
            ja: '正方形'
        },
        rectangle: {
            en: 'Rectangle',
            ja: '長方形'
        },
        ellipse: {
            en: 'Ellipse',
            ja: '楕円'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
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
            ja: '間隔:'
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
