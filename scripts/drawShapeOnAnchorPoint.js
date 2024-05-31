/* ===============================================================================================================================================
   drawShapeOnAnchorPoint

   Description
   This script draws shapes on anchor points.

   Usage
   1. Select any path objects, run this script from File > Scripts > Other Script...
   2. Select a shape.
   3. Enter a shape size.
   4. If you select anchor points with the Direct Selection Tool,
      choose whether to draw the shape on all anchor points or only on the selected anchor points.
   5. Check the Draw Handle Position checkbox if you want to draw the shapes on the handle positions.

   Notes
   The units of shape size depend on the ruler units.
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
    var points = getSelectedPoints(shapes);
    if (!points.length) return;

    var dialog = showDialog(points);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) return dialog.close();
        var config = getConfiguration(dialog);
        drawShapes(shapes, config);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var config = getConfiguration(dialog);
            drawShapes(shapes, config);
        }
        else {
            reset(points);
        }
        app.redraw();
    }

    dialog.shapeSize.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
        preview(dialog, points);
    });

    dialog.shapeSize.onChanging = function() {
        preview(dialog, points);
    }

    dialog.rectangle.onClick = function() {
        dialog.shapeSize.active = false;
        dialog.shapeSize.active = true;
        preview(dialog, points);
    }

    dialog.circle.onClick = function() {
        dialog.shapeSize.active = false;
        dialog.shapeSize.active = true;
        preview(dialog, points);
    }

    dialog.cross.onClick = function() {
        dialog.shapeSize.active = false;
        dialog.shapeSize.active = true;
        preview(dialog, points);
    }

    dialog.isAll.onClick = function() {
        preview(dialog, points);
    }

    dialog.handle.onClick = function() {
        preview(dialog, points);
    }

    dialog.show();
}


function getConfiguration(dialog) {
    var size = getValue(dialog.shapeSize.text);
    if (!size) size = 1;
    return {
        rectangle: dialog.rectangle.value,
        circle: dialog.circle.value,
        cross: dialog.cross.value,
        size: size,
        isAll: dialog.isAll.value,
        handle: dialog.handle.value
    };
}


function preview(dialog, points) {
    if (!dialog.preview.value) return;
    reset(points);
    app.redraw();
    var config = getConfiguration(dialog);
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    drawShapes(shapes, config);
    app.redraw();
}


function drawShapes(items, config) {
    var units = getRulerUnits();
    var size = convertUnits(config.size + units, 'pt');

    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == DocumentColorSpace.CMYK)
        ? setCMYKColor(0, 0, 0, 100)
        : setRGBColor(0, 0, 0);

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var points = getAnchorPoints(item, config.handle, config.isAll);
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (config.rectangle) drawRect(point, size, color);
            if (config.circle) drawCircle(point, size, color);
            if (config.cross) drawCross(point, size, color);
        }
    }
}


function drawRect(point, size, color) {
    var top = point.y + (size / 2);
    var left = point.x - (size / 2);
    var layer = getLayer('__Shapes__');
    var rect = layer.pathItems.rectangle(top, left, size, size);
    rect.stroked = false;
    rect.fillColor = color;
}


function drawCircle(point, size, color) {
    var top = point.y + (size / 2);
    var left = point.x - (size / 2);
    var layer = getLayer('__Shapes__');
    var circle = layer.pathItems.ellipse(top, left, size, size);
    circle.stroked = false;
    circle.fillColor = color;
}


function drawCross(point, size, color) {
    var x1 = point.x - (size / 2);
    var y1 = point.y + (size / 2);
    var x2 = point.x + (size / 2);
    var y2 = point.y - (size / 2);

    var layer = getLayer('__Shapes__');
    var group = layer.groupItems.add();
    var count = 2;

    for (var i = 0; i < count; i++) {
        var cross = group.pathItems.add();
        cross.setEntirePath([[x1, y1], [x2, y2]]);
        cross.filled = false;
        cross.strokeColor = color;
        cross.strokeWidth = 1;
        cross.strokeCap = StrokeCap.BUTTENDCAP;
        x1 += size;
        x2 -= size;
    }
}


function getAnchorPoints(item, handle, isAll) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var positions = [];
    var points = item.pathPoints;
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (!isAll && point.selected != ANCHOR) continue;
        var anchor = point.anchor;
        positions.push({
            x: anchor[0],
            y: anchor[1]
        });
        if (handle) positions = positions.concat(getHandlePosition(point));
    }
    return positions;
}


function getHandlePosition(point) {
    var handle = [];
    var anchor = point.anchor;
    var left = point.leftDirection;
    var right = point.rightDirection;
    if (hasHandle(anchor, left)) {
        handle.push({
            x: left[0],
            y: left[1]
        });
    }
    if (hasHandle(anchor, right)) {
        handle.push({
            x: right[0],
            y: right[1]
        });
    }
    return handle;
}


function hasHandle(anchor, handle) {
    var x = 0;
    var y = 1;
    return anchor[x] != handle[x] || anchor[y] != handle[y];
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


function getLayer(name) {
    if (layerExists(name)) {
        var layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
        return layer;
    }
    return createLayer(name);
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function layerExists(name) {
    try {
        app.activeDocument.layers.getByName(name);
        return true;
    }
    catch (err) {
        return false;
    }
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


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
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

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.shape;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 4, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 18;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.type;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.size;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 6, 0, 0];

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var radiobutton1 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.rect;
    radiobutton1.value = true;

    var radiobutton2 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.circle;

    var radiobutton3 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.cross;

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.active = true;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.options;
    panel2.orientation = 'column';
    panel2.alignChildren = ['fill', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group5 = panel2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 10, 0, 0];

    var checkbox1 = group5.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.all;
    checkbox1.value = true;

    var checkbox2 = group5.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.handle;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var checkbox3 = group6.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.preview;

    var group7 = dialog.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group7.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

    var button1 = group7.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group7.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button0.onClick = function() {
        if (checkbox3.value) reset(points);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    dialog.rectangle = radiobutton1,
    dialog.circle = radiobutton2,
    dialog.cross = radiobutton3
    dialog.shapeSize = edittext1;
    dialog.isAll = checkbox1;
    dialog.handle = checkbox2;
    dialog.preview = checkbox3;
    dialog.ok = button2;
    return dialog;
}


function setIncreaseDecrease(event) {
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


function localizeUI() {
    return {
        title: {
            en: 'Draw Shapes on Anchor Points',
            ja: 'アンカーポイントに図形を描く'
        },
        shape: {
            en: 'Shape',
            ja: '図形'
        },
        type: {
            en: 'Type:',
            ja: '種類:'
        },
        rect: {
            en: 'Rectangle',
            ja: '矩形'
        },
        circle: {
            en: 'Circle',
            ja: '円'
        },
        cross: {
            en: 'Cross',
            ja: 'クロス'
        },
        size: {
            en: 'Size:',
            ja: 'サイズ:'
        },
        options: {
            en: 'Options',
            ja: 'オプション'
        },
        all: {
            en: 'All Anchor Points',
            ja: 'すべてのアンカーポイント'
        },
        handle: {
            en: 'Draw Handle Position',
            ja: 'ハンドル位置も描く'
        },
        preview: {
            en: 'Preview',
            ja: 'プレビュー'
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
