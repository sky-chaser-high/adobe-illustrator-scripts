/* ===============================================================================================================================================
   extendLine

   Description
   This script extends and shrinks a path object.

   Usage
   1. Select an anchor point with Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter a positive value to extend or a negative value to shrink.

   Notes
   Closed paths and curves are not supported.
   The units of distance depend on the ruler units.
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
    if (app.documents.length > 0) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    var points = getSelectedPoints(shapes);
    if (!points.length) return;

    var dialog = showDialog(points);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) reset(points);
        var distance = Number(dialog.distance.text);
        extendLine(distance, points);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var distance = Number(dialog.distance.text);
            extendLine(distance, points);
        }
        else {
            reset(points);
        }
        app.redraw();
    }

    dialog.show();
}


function extendLine(value, points) {
    var units = getUnits(app.activeDocument.rulerUnits);
    var distance = convertUnits(value + units, 'pt');

    for (var i = 0; i < points.length; i++) {
        var point = setPoints(points[i]);
        if (!point) continue;
        var position = getPosition(distance, point);

        points[i].anchor = [position.x, position.y];
        points[i].leftDirection = [position.x, position.y];
        points[i].rightDirection = [position.x, position.y];
    }
}


function getPosition(distance, point) {
    var rad = getAngle(point);
    var x = distance * Math.cos(rad);
    var y = distance * Math.sin(rad);
    return {
        x: point.x1 + x,
        y: point.y1 + y
    };
}


function getAngle(point) {
    var adjacent = point.x1 - point.x2;
    var opposite = point.y1 - point.y2;
    return Math.atan2(opposite, adjacent);
}


function setPoints(item) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var points = item.parent.pathPoints;
    for (var i = 0; i < points.length; i++) {
        var target = points[i];
        if (target.selected != ANCHOR) continue;

        var x1 = target.anchor[0];
        var y1 = target.anchor[1];

        var p = (i == 0) ? i + 1 : points.length - 2;
        if (p == i) return undefined;

        var point = points[p];
        var x2 = point.anchor[0];
        var y2 = point.anchor[1];

        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }
}


function getSelectedPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var selection = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected == ANCHOR) selection.push(point);
        }
    }
    return selection;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' && !item.closed) {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
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
        items[i].selected = ANCHOR;
    }
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
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.distance;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 180;
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var checkbox1 = group2.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.preview;

    // Work around the problem of being unable to undo the ESC key during localization.
    var button0 = group2.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.hide();

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button0.onClick = function() {
        if (checkbox1.value) reset(points);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    dialog.distance = edittext1;
    dialog.preview = checkbox1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Extend Line',
            ja: 'パスを伸縮'
        },
        distance: {
            en: 'Distance:',
            ja: '距離:'
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
