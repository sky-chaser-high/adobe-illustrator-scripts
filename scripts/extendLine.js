/* ===============================================================================================================================================
   extendLine

   Description
   This script extends and shrinks path segments.

   Usage
   1. Select any anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter a positive value to extend or a negative value to shrink.

   Notes
   Closed paths and curves are not supported.
   Anchor points for type on a path are also supported.
   The units of distance depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.2.0

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

    var points = getSelectedPoints(shapes);
    if (!points.length) return;

    var dialog = showDialog(points);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) return dialog.close();
        var distance = getValue(dialog.distance.text);
        extendLine(distance, points);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var distance = getValue(dialog.distance.text);
            extendLine(distance, points);
        }
        else {
            reset(points);
        }
        app.redraw();
    }

    dialog.distance.onChanging = function() {
        if (dialog.preview.value) {
            reset(points);
            var distance = getValue(dialog.distance.text);
            extendLine(distance, points);
            app.redraw();
        }
    }

    dialog.distance.addEventListener('keydown', function(event) {
        var value = getValue(this.text);
        var keyboard = ScriptUI.environment.keyboardState;
        var step = keyboard.shiftKey ? 5 : 1;
        var distance;
        if (event.keyName == 'Up') {
            distance = value + step;
            this.text = distance;
            event.preventDefault();
        }
        if (event.keyName == 'Down') {
            distance = value - step;
            this.text = distance;
            event.preventDefault();
        }
        if (dialog.preview.value) {
            reset(points);
            extendLine(distance, points);
            app.redraw();
        }
    });

    dialog.show();
}


function extendLine(value, points) {
    var units = getRulerUnits();
    var distance = convertUnits(value + units, 'pt');

    for (var i = 0; i < points.length; i++) {
        var point = setPoints(points[i]);
        var position = getPosition(distance, point);
        var item = points[i].point1;
        item.anchor = position;
        item.leftDirection = position;
        item.rightDirection = position;
    }
}


function setPoints(item) {
    return {
        x1: item.point1.anchor[0],
        y1: item.point1.anchor[1],
        x2: item.point2.anchor[0],
        y2: item.point2.anchor[1]
    };
}


function getPosition(distance, point) {
    var rad = getAngle(point);
    var x = distance * Math.cos(rad);
    var y = distance * Math.sin(rad);
    return [
        point.x1 + x,
        point.y1 + y
    ];
}


function getAngle(point) {
    var width = point.x1 - point.x2;
    var height = point.y1 - point.y2;
    return Math.atan2(height, width);
}


function getSelectedPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var selection = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        var start = 0;
        var end = points.length - 1;

        var p1 = points[start];
        var p2 = points[start + 1];
        if (p1.selected == ANCHOR) {
            selection.push({ point1: p1, point2: p2 });
        }

        p1 = points[end];
        p2 = points[end - 1];
        if (p1.selected == ANCHOR) {
            selection.push({ point1: p1, point2: p2 });
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


function getTextPathItems() {
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && text.kind == TextType.PATHTEXT) {
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
        var item = items[i].point1;
        var points = item.parent.pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            point.selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        var point = items[i].point1;
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

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group3.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

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
