/* ===============================================================================================================================================
   extendHandle

   Description
   This script extends and shrinks handles.

   Usage
   1. Select one or two anchor points with Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter a positive value to extend or a negative value to shrink.

   Notes
   Handles cannot delete.
   The units of distance depend on the ruler units.
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
    var showHandles = app.preferences.getBooleanPreference('showDirectionHandles');
    app.preferences.setBooleanPreference('showDirectionHandles', true);

    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    var points = getSelectedPoints(shapes.concat(texts));
    if (!points.length || points.length > 2) return;
    if (points.length == 1) points.push(points[0]);

    var dialog = showDialog(points, showHandles);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) reset(points);
        var config = getConfig(dialog);
        extendHandle(points[0], points[1], config);
        if (!showHandles) app.preferences.setBooleanPreference('showDirectionHandles', false);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var config = getConfig(dialog);
            extendHandle(points[0], points[1], config);
        }
        else {
            reset(points);
        }
        app.redraw();
    }

    dialog.show();
}


function extendHandle(p1, p2, config) {
    var point1 = setPosition(p1);
    var point2 = setPosition(p2);
    var angle = {
        left: getAngle(point2.anchor, point2.handle.left),
        right: getAngle(point1.anchor, point1.handle.right)
    };
    var distance = {
        left: config.left,
        right: config.right
    };
    var handle = {
        left: {
            x: distance.left * Math.cos(angle.left),
            y: distance.left * Math.sin(angle.left)
        },
        right: {
            x: distance.right * Math.cos(angle.right),
            y: distance.right * Math.sin(angle.right)
        }
    };
    var lx = point2.handle.left.x;
    var ly = point2.handle.left.y;
    var rx = point1.handle.right.x;
    var ry = point1.handle.right.y;

    if (config.left) p2.leftDirection = [lx + handle.left.x, ly + handle.left.y];
    if (config.right) p1.rightDirection = [rx + handle.right.x, ry + handle.right.y];
}


function getAngle(p1, p2) {
    var adjacent = p2.x - p1.x;
    var opposite = p2.y - p1.y;
    return Math.atan2(opposite, adjacent);
}


function setPosition(item) {
    var anchor = item.anchor;
    var left = item.leftDirection;
    var right = item.rightDirection;
    return {
        anchor: { x: anchor[0], y: anchor[1] },
        handle: {
            left: { x: left[0], y: left[1] },
            right: { x: right[0], y: right[1] }
        }
    };
}


function getSelectedPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var selection = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        var start = false;
        var end = false;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;

            if (j == 0) start = true;
            if (j == points.length - 1) end = true;

            if (start && end && points.length > 2) selection.unshift(point);
            else selection.push(point);

            if (selection.length >= 2) return selection;
        }
        if (selection.length >= 1) return selection;
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
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function getTextPathItems() {
    var AREA = TextType.AREATEXT;
    var PATH = TextType.PATHTEXT;
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && (text.kind == AREA || text.kind == PATH)) {
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
            points[j].selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        items[i].selected = ANCHOR;
    }
}


function round(value) {
    var digits = 100;
    return Math.round(value * digits) / digits;
}


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function getUnits(ruler) {
    switch (ruler) {
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
    }
}


function getConfig(dialog) {
    var units = getUnits(app.activeDocument.rulerUnits);
    var left = Number(dialog.left.text);
    var right = Number(dialog.right.text);
    return {
        left: convertUnits(left + units, 'pt'),
        right: convertUnits(right + units, 'pt')
    };
}


function showDialog(points, showHandles) {
    $.localize = true;
    var ui = localizeUI();
    var units = getUnits(app.activeDocument.rulerUnits);
    var left = {
        x: convertUnits(points[1].leftDirection[0] + 'pt', units),
        y: convertUnits(points[1].leftDirection[1] * -1 + 'pt', units)
    };
    var right = {
        x: convertUnits(points[0].rightDirection[0] + 'pt', units),
        y: convertUnits(points[0].rightDirection[1] * -1 + 'pt', units)
    };

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.distance;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 6, 0, 0];;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.handle + ' #1:';

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 175;
    edittext1.active = true;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.handle + ' #2:';

    var edittext2 = group3.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.preferredSize.width = 175;

    var group4 = dialog.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 6, 0, 0];

    var panel2 = group4.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.handle + ' #1';
    panel2.preferredSize.width = 140;
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group5 = panel2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 6, 0, 0];

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = 'X:';

    var statictext4 = group5.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = 'Y:';

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 6, 0, 0];

    var statictext5 = group6.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = round(right.x) + ' ' + units;

    var statictext6 = group6.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = round(right.y) + ' ' + units;

    var panel3 = group4.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.handle + ' #2';
    panel3.preferredSize.width = 140;
    panel3.orientation = 'row';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group7 = panel3.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 6, 0, 0];

    var statictext7 = group7.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = 'X:';

    var statictext8 = group7.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = 'Y:';

    var group8 = panel3.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 6, 0, 0];

    var statictext9 = group8.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = round(left.x) + ' ' + units;

    var statictext10 = group8.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = round(left.y) + ' ' + units;

    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var checkbox1 = group9.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.preview;

    var group10 = dialog.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['right', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    // Work around the problem of being unable to undo the ESC key during localization.
    var button0 = group10.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.hide();

    var button1 = group10.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group10.add('button', undefined, undefined, { name: 'button2' });
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

    button0.onClick = function() {
        if (checkbox1.value) reset(points);
        if (!showHandles) app.preferences.setBooleanPreference('showDirectionHandles', false);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    dialog.right = edittext1;
    dialog.left = edittext2;
    dialog.preview = checkbox1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Extend Handle',
            ja: 'ハンドルを伸縮'
        },
        distance: {
            en: 'Distance',
            ja: '距離'
        },
        handle: {
            en: 'Handle',
            ja: 'ハンドル'
        },
        preview: {
            en: 'preview',
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
