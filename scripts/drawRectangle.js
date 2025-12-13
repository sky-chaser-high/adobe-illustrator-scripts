/* ===============================================================================================================================================
   drawRectangle

   Description
   This script draws rectangles around selected objects.

   Usage
   1. Select any objects, run this script from File > Scripts > Other Script...
   2. Enter a margin value.
   3. To draw a rectangle on each object in the group, check the Ignore Groups checkbox.
   4. To include stroke width, check the Use Preview Bounds checkbox.
   5. To draw a rectangle around the entire selected object, check the Entire Selected Objects checkbox.

   Notes
   The rectangle is drawn with no fill and stroke width.
   The units of margin value depend on the ruler units.
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
    if (!items.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        if (dialog.preview.value) return dialog.close();
        showRectangle(dialog, items);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            showRectangle(dialog, items);
        }
        else {
            app.undo();
            app.redraw();
        }
    }

    dialog.margin.addEventListener('keydown', function(event) {
        setIncreaseDecrease(event);
        if (!dialog.preview.value) return;
        app.undo();
        showRectangle(dialog, items);
    });

    dialog.margin.onChanging = function() {
        if (!dialog.preview.value) return;
        app.undo();
        showRectangle(dialog, items);
    }

    dialog.ignore.onClick = function() {
        if (!dialog.preview.value) return;
        app.undo();
        showRectangle(dialog, items);
    }

    dialog.stroke.onClick = function() {
        if (!dialog.preview.value) return;
        app.undo();
        showRectangle(dialog, items);
    }

    dialog.entire.onClick = function() {
        if (!dialog.preview.value) return;
        app.undo();
        showRectangle(dialog, items);
    }

    dialog.show();
}


function showRectangle(dialog, items) {
    if (dialog.ignore.value) items = getPageItems(items);
    var margin = getMargin(dialog.margin.text);
    var usePreviewBounds = dialog.stroke.value;

    if (dialog.entire.value) drawRectangleAroundEntireItem(items, margin, usePreviewBounds);
    else drawRectangles(items, margin, usePreviewBounds);

    app.redraw();
}


function drawRectangleAroundEntireItem(items, margin, usePreviewBounds) {
    var size = getEntireItemSize(items, usePreviewBounds);
    createRectangle(size, margin);
    for (var i = items.length - 1; 0 <= i; i--) {
        var item = items[i];
        item.selected = false;
    }
}


function drawRectangles(items, margin, usePreviewBounds) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var size = getItemSize(item, usePreviewBounds);
        createRectangle(size, margin);
        item.selected = false;
    }
}


function createRectangle(item, margin) {
    var top = item.y1 + margin;
    var left = item.x1 - margin;
    var width = item.width + (margin * 2);
    var height = item.height + (margin * 2);
    var layer = app.activeDocument.activeLayer;
    var rect = layer.pathItems.rectangle(top, left, width, height);
    rect.filled = false;
    rect.stroked = false;
    rect.selected = true;
}


function getItemSize(item, usePreviewBounds) {
    var bounds = (usePreviewBounds) ? item.visibleBounds : item.geometricBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var center = {
        x: x1 + width / 2,
        y: y1 - height / 2
    };
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width: width,
        height: height,
        center: center
    };
}


function getEntireItemSize(items, usePreviewBounds) {
    var item = items[0];
    var bounds = (usePreviewBounds) ? item.visibleBounds : item.geometricBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    for (var i = 1; i < items.length; i++) {
        item = items[i];
        bounds = (usePreviewBounds) ? item.visibleBounds : item.geometricBounds;
        if (bounds[0] < x1) x1 = bounds[0];
        if (y1 < bounds[1]) y1 = bounds[1];
        if (x2 < bounds[2]) x2 = bounds[2];
        if (bounds[3] < y2) y2 = bounds[3];
    }
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var center = {
        x: x1 + width / 2,
        y: y1 - height / 2
    };
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width: width,
        height: height,
        center: center
    };
}


function getMargin(value) {
    var margin = getValue(value);
    var units = getRulerUnits();
    return convertUnits(margin + units, 'pt');
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
        return Number(UnitValue('0pt').as('pt'));
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


function getPageItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPageItems(item.pageItems));
        }
        else {
            shapes.push(item);
        }
    }
    return shapes;
}


function isValidVersion() {
    var cs4 = 14;
    var current = parseInt(app.version);
    if (current < cs4) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var units = getRulerUnits();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.margin;
    statictext1.alignment = ['left', 'center'];

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '0';
    edittext1.active = true;

    var statictext2 = group1.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = units;
    statictext2.alignment = ['right', 'center'];

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.options;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 10, 0, 0];

    var checkbox1 = group2.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.ignore;

    var checkbox2 = group2.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.stroke;

    var checkbox3 = group2.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.entire;

    var group4 = dialog.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var checkbox4 = group4.add('checkbox', undefined, undefined, { name: 'checkbox4' });
    checkbox4.text = ui.preview;
    checkbox4.alignment = ['left', 'top'];

    var button1 = group4.add('button', undefined, undefined, { name: 'Cancel' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group4.add('button', undefined, undefined, { name: 'OK' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button1.onClick = function() {
        if (checkbox4.value) app.undo();
        dialog.close();
    }

    dialog.margin = edittext1;
    dialog.ignore = checkbox1;
    dialog.stroke = checkbox2;
    dialog.entire = checkbox3;
    dialog.preview = checkbox4;
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
            en: 'Draw Rectangle',
            ja: '長方形を描く'
        },
        margin: {
            en: 'Margin:',
            ja: 'マージン:'
        },
        options: {
            en: 'Options',
            ja: 'オプション'
        },
        ignore: {
            en: 'Ignore Group',
            ja: 'グループを無視'
        },
        stroke: {
            en: 'Use Preview Bounds',
            ja: 'プレビュー境界を使用'
        },
        entire: {
            en: 'Entire Selected Object',
            ja: '選択オブジェクト全体'
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
