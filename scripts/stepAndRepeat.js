/* ===============================================================================================================================================
   stepAndRepeat

   Description
   This script repeatedly duplicates selected objects. It is equivalent to InDesign's Edit > Step and Repeat.

   Usage
   1. Select any objects, run this script from File > Scripts > Other Script...
   2. If you want to create as a grid, check the create as a grid.
   3. Enter the number of times to repeat.
   4. Enter the offset values.

   Notes
   The units of the offset value depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   2.1.0

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

    var dialog = showDialog(items);

    dialog.ok.onClick = function() {
        if (dialog.preview.value) return dialog.close();
        var config = getConfiguration(dialog);
        if (!validate(config)) return;
        stepAndRepeat(config);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            var config = getConfiguration(dialog);
            if (!validate(config)) return;
            stepAndRepeat(config);
        }
        else {
            restore(items);
        }
        app.redraw();
    }

    dialog.show();
}


function getConfiguration(dialog) {
    var ruler = getRulerUnits();
    var rows = getValue(dialog.rows.text);
    var columns = getValue(dialog.columns.text);
    var vertical = getValue(dialog.vertical.text);
    var horizontal = getValue(dialog.horizontal.text);
    return {
        mode: {
            repeat: dialog.grid.value ? false : true,
            grid: dialog.grid.value ? true : false
        },
        rows: parseInt(rows),
        columns: parseInt(columns),
        vertical: convertUnits(vertical + ruler, 'pt'),
        horizontal: convertUnits(horizontal + ruler, 'pt')
    };
}


function preview(dialog, items) {
    if (!dialog.preview.value) return;
    restore(items);
    var config = getConfiguration(dialog);
    if (!validate(config)) return;
    stepAndRepeat(config);
    app.redraw();
}


function restore(items) {
    var current = app.activeDocument.selection;
    if (items.length == current.length) return;
    app.undo();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.selected = true;
    }
    app.redraw();
}


function stepAndRepeat(config) {
    var items = app.activeDocument.selection;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (config.mode.repeat) repeat(item, config);
        if (config.mode.grid) grid(item, config);
    }
}


function repeat(item, config) {
    var x = config.horizontal;
    var y = config.vertical * -1;
    for (var i = 0; i < config.rows; i++) {
        item.duplicate();
        item.translate(x, y);
    }
}


function grid(item, config) {
    var top = item.top;
    var left = item.left;
    for (var i = 0; i < config.rows; i++) {
        for (var j = 0; j < config.columns - 1; j++) {
            item.duplicate();
            item.translate(config.horizontal, 0);
        }
        if (i < config.rows - 1) {
            item.duplicate();
            item.top = top - config.vertical * (i + 1);
            item.left = left;
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


function validate(config) {
    if (config.rows < 1 || config.columns < 1) {
        $.localize = true;
        var value = 1;
        alert(errorMessage(value));
        return false;
    }
    return true;
}


function errorMessage(value) {
    return {
        en: 'The value must be greater than ' + value + '.',
        ja: '値は ' + value + ' 以上でなければなりません。'
    };
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(items) {
    $.localize = true;
    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'row';
    dialog.alignChildren = ['center', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.repeat;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'center'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'fill'];
    group2.spacing = 10;
    group2.margins = 4;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.preferredSize.width = 60;
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext1 = group3.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.count;
    statictext1.justify = 'right';

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 90;
    edittext1.preferredSize.height = 20;
    edittext1.active = true;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = 80;
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.columns;
    statictext2.justify = 'right';
    statictext2.visible = false;

    var edittext2 = group2.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '1';
    edittext2.preferredSize.width = 90;
    edittext2.preferredSize.height = 20;
    edittext2.visible = false;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'fill'];
    group5.spacing = 10;
    group5.margins = 0;

    var checkbox1 = group5.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.isGrid;

    var panel2 = group1.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.offset;
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'center'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'fill'];
    group6.spacing = 10;
    group6.margins = 4;

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.preferredSize.width = 60;
    group7.orientation = 'row';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext3 = group7.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.vertical;
    statictext3.justify = 'right';

    var edittext3 = group6.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '10';
    edittext3.preferredSize.width = 90;
    edittext3.preferredSize.height = 20;

    var group8 = group6.add('group', undefined, { name: 'group8' });
    group8.preferredSize.width = 80;
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var statictext4 = group8.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.horizontal;
    statictext4.justify = 'right';

    var edittext4 = group6.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '10';
    edittext4.preferredSize.width = 90;
    edittext4.preferredSize.height = 20;

    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['center', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var button1 = group9.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 30;

    var button2 = group9.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.cancel;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 30;

    var checkbox2 = group9.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.preview;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button3 = group9.add('button', undefined, undefined, { name: 'button3' });
    button3.text = 'Cancel';
    button3.preferredSize.height = 18;
    button3.hide();

    button3.onClick = function() {
        if (checkbox2.value) {
            restore(items);
        }
        dialog.close();
    }

    button2.onClick = function() {
        button3.notify('onClick');
    }

    checkbox1.onClick = function() {
        statictext2.visible = !statictext2.visible;
        edittext2.visible = !edittext2.visible;
        panel1.text = checkbox1.value ? ui.grid : ui.repeat;
        statictext1.text = checkbox1.value ? ui.rows : ui.count;
        edittext1.active = false;
        edittext1.active = true;
        preview(dialog, items);
    }

    edittext1.onChanging = function() {
        preview(dialog, items);
    }

    edittext2.onChanging = function() {
        preview(dialog, items);
    }

    edittext3.onChanging = function() {
        preview(dialog, items);
    }

    edittext4.onChanging = function() {
        preview(dialog, items);
    }

    edittext1.addEventListener('keydown', function(event) {
        setRepeatValue(event);
        preview(dialog, items);
    });

    edittext2.addEventListener('keydown', function(event) {
        setRepeatValue(event);
        preview(dialog, items);
    });

    edittext3.addEventListener('keydown', function(event) {
        setOffsetValue(event);
        preview(dialog, items);
    });

    edittext4.addEventListener('keydown', function(event) {
        setOffsetValue(event);
        preview(dialog, items);
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

    dialog.rows = edittext1;
    dialog.columns = edittext2;
    dialog.vertical = edittext3;
    dialog.horizontal = edittext4;
    dialog.grid = checkbox1;
    dialog.preview = checkbox2;
    dialog.ok = button1;
    return dialog;
}


function setRepeatValue(event) {
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


function setOffsetValue(event) {
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
            en: 'Step and Repeat',
            ja: '繰り返し複製'
        },
        repeat: {
            en: 'Repeat',
            ja: '繰り返し'
        },
        grid: {
            en: 'Grid',
            ja: 'グリッド'
        },
        count: {
            en: 'Count:',
            ja: 'カウント：'
        },
        rows: {
            en: 'Rows:',
            ja: '行：'
        },
        columns: {
            en: 'Columns:',
            ja: '段数：'
        },
        isGrid: {
            en: 'Create as a grid',
            ja: 'グリッドとして作成'
        },
        offset: {
            en: 'Offset',
            ja: 'オフセット'
        },
        vertical: {
            en: 'Vertical:',
            ja: '垂直方向：'
        },
        horizontal: {
            en: 'Horizontal:',
            ja: '水平方向：'
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
