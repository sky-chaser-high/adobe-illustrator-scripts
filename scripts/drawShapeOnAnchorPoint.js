/* ===============================================================================================================================================
   drawShapeOnAnchorPoint

   Description
   This script draws shapes on anchor points.

   Usage
   1. Select the path objects, run this script from File > Scripts > Other Script...
   2. Select a shape.
   3. Enter a shape size.
   4. Check the Draw Handle Position checkbox if you want to draw the shapes on the handle positions.

   Notes
   If you select anchor points with Direct Selection Tool, the shape is drawn only for the selected anchor points.
   The handle position is drawn with a stroke.
   The units of shape size depend on the ruler units.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var size = Number(dialog.shapeSize.text);
        var preview = dialog.preview.value;
        if (!preview) draw(dialog.shape, size, dialog.handle.value);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        var size = Number(dialog.shapeSize.text);
        var preview = dialog.preview.value;
        if (preview) draw(dialog.shape, size, dialog.handle.value);
        else app.undo();
        app.redraw();
    }

    dialog.show();
}


function draw(shape, size, handle) {
    if (!size) return;

    var layer, name = '__Shapes__';
    if (layerExists(name)) {
        layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
    }
    else {
        layer = createLayer(name);
    }

    var mode = app.activeDocument.documentColorSpace;
    var color = (mode == DocumentColorSpace.CMYK) ? setCMYKColor(0, 0, 0, 100) : setRGBColor(0, 0, 0);

    var units = getUnits(app.activeDocument.rulerUnits);
    var dim = convertUnits(size + units, 'pt');

    var items = getPathItems(app.activeDocument.selection);
    for (var i = 0; i < items.length; i++) {
        var points = getAnchorPoints(items[i], handle);
        for (var j = 0; j < points.length; j++) {
            if (shape.rect.value) drawRect(dim, color, points[j], layer);
            if (shape.circle.value) drawCircle(dim, color, points[j], layer);
            if (shape.cross.value) drawCross(dim, color, points[j], layer);
        }
    }
}


function drawRect(size, color, point, layer) {
    var top = point.y + (size / 2);
    var left = point.x - (size / 2);
    var rect = layer.pathItems.rectangle(top, left, size, size);
    if (point.type == 'anchor') {
        rect.stroked = false;
        rect.fillColor = color;
    }
    if (point.type == 'handle') {
        rect.filled = false;
        rect.strokeColor = color;
        rect.strokeWidth = 0.5;
    }
}


function drawCircle(size, color, point, layer) {
    var top = point.y + (size / 2);
    var left = point.x - (size / 2);
    var circle = layer.pathItems.ellipse(top, left, size, size);
    if (point.type == 'anchor') {
        circle.stroked = false;
        circle.fillColor = color;
    }
    if (point.type == 'handle') {
        circle.filled = false;
        circle.strokeColor = color;
        circle.strokeWidth = 0.5;
    }
}


function drawCross(size, color, point, layer) {
    var x1 = point.x - (size / 2);
    var y1 = point.y + (size / 2);
    var x2 = point.x + (size / 2);
    var y2 = point.y - (size / 2);

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


function getAnchorPoints(item, handle) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var coordinates = [];
    var points = item.selectedPathPoints;
    for (var i = 0; i < points.length; i++) {
        var target = points[i];
        if (target.selected == ANCHOR) {
            var x = target.anchor[0];
            var y = target.anchor[1];
            coordinates.push({ x: x, y: y, type: 'anchor' });
            if (handle) coordinates = coordinates.concat(getHandle(target));
        }
    }
    return coordinates;
}


function getHandle(point) {
    var handle = [];

    if (hasLeftHandle(point)) {
        var lx = point.leftDirection[0];
        var ly = point.leftDirection[1];
        handle.push({ x: lx, y: ly, type: 'handle' });
    }

    if (hasRightHandle(point)) {
        var rx = point.rightDirection[0];
        var ry = point.rightDirection[1];
        handle.push({ x: rx, y: ry, type: 'handle' });
    }

    return handle;
}


function hasLeftHandle(point) {
    var ax = point.anchor[0];
    var ay = point.anchor[1];
    var lx = point.leftDirection[0];
    var ly = point.leftDirection[1];
    if (ax == lx && ay == ly) return false;
    return true;
}


function hasRightHandle(point) {
    var ax = point.anchor[0];
    var ay = point.anchor[1];
    var rx = point.rightDirection[0];
    var ry = point.rightDirection[1];
    if (ax == rx && ay == ry) return false;
    return true;
}


function getPathItems(items) {
    var paths = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PathItem') {
            paths.push(items[i]);
        }
        else if (items[i].typename == 'GroupItem') {
            paths = paths.concat(getPathItems(items[i].pageItems));
        }
        else if (items[i].typename == 'CompoundPathItem') {
            paths = paths.concat(getPathItems(items[i].pathItems));
        }
    }
    return paths;
}


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function getUnits(unit) {
    switch (unit) {
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
    }
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


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
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
    group2.spacing = 18;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.shape;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.size;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 4, 0, 0];

    var radiobutton1 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.rect;
    radiobutton1.value = true;

    var radiobutton2 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.circle;

    var radiobutton3 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.cross;

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '2';
    edittext1.active = true;

    var group5 = dialog.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 6, 0, 0];

    var checkbox1 = group5.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.handle;

    var checkbox2 = group5.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.preview;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['right', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 10, 0, 0];
    group6.alignment = ['fill', 'top'];

    var button1 = group6.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group6.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button1.onClick = function() {
        if (checkbox2.value) app.undo();
        dialog.close();
    }

    dialog.shape = {
        rect: radiobutton1,
        circle: radiobutton2,
        cross: radiobutton3
    };
    dialog.shapeSize = edittext1;
    dialog.handle = checkbox1;
    dialog.preview = checkbox2;
    dialog.ok = button2;

    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Draw Shapes on Anchor Points',
            ja: 'アンカーポイントに図形を描く'
        },
        shape: {
            en: 'Shape:',
            ja: '形状:'
        },
        rect: {
            en: 'Rect',
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
