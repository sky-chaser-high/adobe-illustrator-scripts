/* ===============================================================================================================================================
   extendHandle

   Description
   This script extends and shrinks handles. It also changes the angle.

   Usage
   1. Select one or two anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter a positive value in the Distance fields to extend or a negative value to shrink.
   3. Enter a positive value in the Angle fields will rotate counterclockwise. Enter a negative value clockwise.

   Notes
   Handles cannot delete.
   The angle increases or decreases based on the current value.
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
        if (dialog.preview.value) return dialog.close();
        var config = getConfiguration(dialog);
        var p1 = points[0];
        var p2 = points[1];
        extendHandle(p1, p2, config.distance, config.angle);
        if (!showHandles) app.preferences.setBooleanPreference('showDirectionHandles', false);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var config = getConfiguration(dialog);
            var p1 = points[0];
            var p2 = points[1];
            extendHandle(p1, p2, config.distance, config.angle);
        }
        else {
            reset(points);
        }
        app.redraw();
    }

    dialog.show();
}


function extendHandle(p1, p2, distance, rotation) {
    var point1 = setPosition(p1);
    var point2 = setPosition(p2);
    var length = {
        left: getDistance(point2.anchor, point2.handle.left),
        right: getDistance(point1.anchor, point1.handle.right)
    };
    var angle = {
        left: getAngle(point2.anchor, point2.handle.left),
        right: getAngle(point1.anchor, point1.handle.right)
    };
    var handle = {
        left: {
            x: (length.left + distance.left) * Math.cos(angle.left + rotation.left),
            y: (length.left + distance.left) * Math.sin(angle.left + rotation.left)
        },
        right: {
            x: (length.right + distance.right) * Math.cos(angle.right + rotation.right),
            y: (length.right + distance.right) * Math.sin(angle.right + rotation.right)
        }
    };

    if (distance.left || rotation.left) {
        var lx = point2.anchor.x + handle.left.x;
        var ly = point2.anchor.y + handle.left.y;
        p2.leftDirection = [lx, ly];
    }
    if (distance.right || rotation.right) {
        var rx = point1.anchor.x + handle.right.x;
        var ry = point1.anchor.y + handle.right.y;
        p1.rightDirection = [rx, ry];
    }
}


function getAngle(p1, p2) {
    var width = p2.x - p1.x;
    var height = p2.y - p1.y;
    return Math.atan2(height, width);
}


function getDistance(p1, p2) {
    var width = p2.x - p1.x;
    var height = p2.y - p1.y;
    var sq = 2;
    return Math.sqrt(Math.pow(width, sq) + Math.pow(height, sq));
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


function round(value) {
    var digits = 10000;
    return Math.round(value * digits) / digits;
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


function getDimension(points) {
    var units = getRulerUnits();
    var deg = 180 / Math.PI;
    var p1 = setPosition(points[0]);
    var p2 = setPosition(points[1]);
    var length = {
        left: convertUnits(getDistance(p2.anchor, p2.handle.left) + 'pt', units),
        right: convertUnits(getDistance(p1.anchor, p1.handle.right) + 'pt', units)
    };
    var angle = {
        left: getAngle(p2.anchor, p2.handle.left) * deg,
        right: getAngle(p1.anchor, p1.handle.right) * deg
    };
    var left = {
        x: convertUnits(p2.handle.left.x + 'pt', units),
        y: convertUnits(p2.handle.left.y * -1 + 'pt', units)
    };
    var right = {
        x: convertUnits(p1.handle.right.x + 'pt', units),
        y: convertUnits(p1.handle.right.y * -1 + 'pt', units)
    };
    return {
        length: length,
        angle: angle,
        left: left,
        right: right
    };
}


function preview(dialog, points) {
    if (!dialog.preview.value) return;
    reset(points);
    var config = getConfiguration(dialog);
    var p1 = points[0];
    var p2 = points[1];
    extendHandle(p1, p2, config.distance, config.angle);
    app.redraw();
}


function getConfiguration(dialog) {
    var units = getRulerUnits();
    var distance = {
        left: getValue(dialog.distance.left.text),
        right: getValue(dialog.distance.right.text)
    };
    var angle = {
        left: getValue(dialog.angle.left.text),
        right: getValue(dialog.angle.right.text)
    };
    return {
        distance: {
            left: convertUnits(distance.left + units, 'pt'),
            right: convertUnits(distance.right + units, 'pt')
        },
        angle: {
            left: angle.left / 180 * Math.PI,
            right: angle.right / 180 * Math.PI
        }
    };
}


function showDialog(points, showHandles) {
    $.localize = true;
    var ui = localizeUI();
    var dimension = getDimension(points);
    var units = getRulerUnits();

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

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.handle + ' #1';
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    if (!/^ja/i.test($.locale)) group2.preferredSize.width = 55;
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 12;
    group2.margins = [0, 6, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.distance;
    statictext1.preferredSize.height = 20;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.angle;
    statictext2.preferredSize.height = 20;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.preferredSize.width = 100;
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 6, 0, 0];

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.alignment = ['fill', 'center'];
    edittext1.active = true;

    var edittext2 = group3.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.alignment = ['fill', 'center'];

    var panel2 = group1.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.handle + ' #2';
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group4 = panel2.add('group', undefined, { name: 'group4' });
    if (!/^ja/i.test($.locale)) group4.preferredSize.width = 55;
    group4.orientation = 'column';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 12;
    group4.margins = [0, 6, 0, 0];

    var statictext3 = group4.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.distance;
    statictext3.preferredSize.height = 20;

    var statictext4 = group4.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.angle;
    statictext4.preferredSize.height = 20;

    var group5 = panel2.add('group', undefined, { name: 'group5' });
    group5.preferredSize.width = 100;
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 6, 0, 0];

    var edittext3 = group5.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '';
    edittext3.alignment = ['fill', 'center'];

    var edittext4 = group5.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '';
    edittext4.alignment = ['fill', 'center'];

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 6, 0, 0];

    var panel3 = group6.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.handle + ' #1';
    panel3.orientation = 'row';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group7 = panel3.add('group', undefined, { name: 'group7' });
    if (!/^ja/i.test($.locale)) group7.preferredSize.width = 55;
    group7.orientation = 'column';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 4;
    group7.margins = [0, 6, 0, 0];

    var statictext5 = group7.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.length;
    statictext5.preferredSize.height = 20;

    var statictext6 = group7.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ui.angle;
    statictext6.preferredSize.height = 20;

    var statictext7 = group7.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = 'X:';
    statictext7.preferredSize.height = 20;

    var statictext8 = group7.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = 'Y:';
    statictext8.preferredSize.height = 20;

    var group8 = panel3.add('group', undefined, { name: 'group8' });
    group8.preferredSize.width = 100;
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 4;
    group8.margins = [0, 6, 0, 0];

    var statictext9 = group8.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = round(dimension.length.right) + ' ' + units;
    statictext9.alignment = ['fill', 'center'];
    statictext9.preferredSize.height = 20;

    var statictext10 = group8.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = round(dimension.angle.right) + ' ' + ui.deg;
    statictext10.alignment = ['fill', 'center'];
    statictext10.preferredSize.height = 20;

    var statictext11 = group8.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = round(dimension.right.x) + ' ' + units;
    statictext11.alignment = ['fill', 'center'];
    statictext11.preferredSize.height = 20;

    var statictext12 = group8.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = round(dimension.right.y) + ' ' + units;
    statictext12.alignment = ['fill', 'center'];
    statictext12.preferredSize.height = 20;

    var panel4 = group6.add('panel', undefined, undefined, { name: 'panel4' });
    panel4.text = ui.handle + ' #2';
    panel4.orientation = 'row';
    panel4.alignChildren = ['left', 'top'];
    panel4.spacing = 10;
    panel4.margins = 10;

    var group9 = panel4.add('group', undefined, { name: 'group9' });
    if (!/^ja/i.test($.locale)) group9.preferredSize.width = 55;
    group9.orientation = 'column';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 4;
    group9.margins = [0, 6, 0, 0];

    var statictext13 = group9.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = ui.length;
    statictext13.preferredSize.height = 20;

    var statictext14 = group9.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = ui.angle;
    statictext14.preferredSize.height = 20;

    var statictext15 = group9.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = 'X:';
    statictext15.preferredSize.height = 20;

    var statictext16 = group9.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = 'Y:';
    statictext16.preferredSize.height = 20;

    var group10 = panel4.add('group', undefined, { name: 'group10' });
    group10.preferredSize.width = 100;
    group10.orientation = 'column';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 4;
    group10.margins = [0, 6, 0, 0];

    var statictext17 = group10.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = round(dimension.length.left) + ' ' + units;
    statictext17.alignment = ['fill', 'center'];
    statictext17.preferredSize.height = 20;

    var statictext18 = group10.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = round(dimension.angle.left) + ' ' + ui.deg;
    statictext18.alignment = ['fill', 'center'];
    statictext18.preferredSize.height = 20;

    var statictext19 = group10.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = round(dimension.left.x) + ' ' + units;
    statictext19.alignment = ['fill', 'center'];
    statictext19.preferredSize.height = 20;

    var statictext20 = group10.add('statictext', undefined, undefined, { name: 'statictext20' });
    statictext20.text = round(dimension.left.y) + ' ' + units;
    statictext20.alignment = ['fill', 'center'];
    statictext20.preferredSize.height = 20;

    var group11 = dialog.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var checkbox1 = group11.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.preview;

    var group12 = dialog.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['right', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group12.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

    var button1 = group12.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group12.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.onChanging = function() {
        preview(dialog, points);
    }

    edittext2.onChanging = function() {
        preview(dialog, points);
    }

    edittext3.onChanging = function() {
        preview(dialog, points);
    }

    edittext4.onChanging = function() {
        preview(dialog, points);
    }

    edittext1.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
        preview(dialog, points);
    });

    edittext2.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
        preview(dialog, points);
    });

    edittext3.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
        preview(dialog, points);
    });

    edittext4.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
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

    statictext3.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    button0.onClick = function() {
        if (checkbox1.value) reset(points);
        if (!showHandles) app.preferences.setBooleanPreference('showDirectionHandles', false);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    dialog.distance = {
        right: edittext1,
        left: edittext3
    };
    dialog.angle = {
        right: edittext2,
        left: edittext4
    };
    dialog.preview = checkbox1;
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
        event.target.text = value;
        event.preventDefault();
    }
}


function localizeUI() {
    return {
        title: {
            en: 'Extend Handle',
            ja: 'ハンドルを伸縮'
        },
        handle: {
            en: 'Handle',
            ja: 'ハンドル'
        },
        distance: {
            en: 'Distance:',
            ja: '距離:'
        },
        length: {
            en: 'Length:',
            ja: '長さ:'
        },
        angle: {
            en: 'Angle:',
            ja: '角度:'
        },
        deg: {
            en: 'deg',
            ja: '度'
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
