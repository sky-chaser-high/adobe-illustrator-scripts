/* ===============================================================================================================================================
   extendLine

   Description
   This script extends a path object.

   Usage
   1. Select an anchor point with Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter a positive value to extend or a negative value to shrink.

   Notes
   Closed paths and curves are not supported.
   The units of extension value depend on the ruler units.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

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
        extendLine(Number(dialog.distance.text));
        dialog.close();
    }

    dialog.show();
}


function extendLine(value) {
    if (!value) return;

    var units = getUnits(app.activeDocument.rulerUnits);
    var len = convertUnits(value + units, 'pt');

    var items = getPathItems(app.activeDocument.selection);
    for (var i = 0; i < items.length; i++) {
        var points = getAnchorPoints(items[i]);
        if (!points) continue;

        var distance = getDistance(len, points);
        var px = points.x1 + distance.x;
        var py = points.y1 + distance.y;

        var target = items[i].selectedPathPoints[points.id];
        target.anchor = [px, py];
        target.leftDirection = [px, py];
        target.rightDirection = [px, py];
    }
}


function getAnchorPoints(item) {
    var points = item.selectedPathPoints;
    for (var i = 0; i < points.length; i++) {
        var target = points[i];
        if (target.selected == PathPointSelection.ANCHORPOINT) {
            var x1 = target.anchor[0];
            var y1 = target.anchor[1];

            var p = (i == 0) ? i + 1 : points.length - 2;
            if (p == i) return undefined;

            var point = points[p];
            var x2 = point.anchor[0];
            var y2 = point.anchor[1];

            return { id: i, x1: x1, y1: y1, x2: x2, y2: y2 };
        }
    }
}


function getDistance(len, point) {
    var width = point.x1 - point.x2;
    var height = point.y1 - point.y2;
    var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    var sin = height / hypotenuse;
    var cos = width / hypotenuse;

    var x = len * cos;
    var y = len * sin;

    return { x: x, y: y };
}


function getPathItems(items) {
    var paths = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PathItem' && !items[i].closed) {
            paths.push(items[i]);
        }
        else if (items[i].typename == 'GroupItem') {
            paths = paths.concat(getPathItems(items[i].pageItems));
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
        case RulerUnits.Millimeters:
            return 'mm';
        case RulerUnits.Centimeters:
            return 'cm';
        case RulerUnits.Inches:
            return 'in';
        case RulerUnits.Points:
            return 'pt';
        case RulerUnits.Pixels:
            return 'px';
        default:
            return 'pt';
    }
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill','top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left','center'];
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
    group2.alignChildren = ['right','center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button1.onClick = function() {
        dialog.close();
    }

    dialog.distance = edittext1;
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
