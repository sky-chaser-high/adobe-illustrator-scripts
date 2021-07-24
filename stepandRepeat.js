/* ===============================================================================================================================================
   stepandRepeat

   Description
   This script is equivalent to InDesign's "Step and Repeat".

   Usage
   1. Select the objects, run this script from File > Scripts > Other Script...
   2. Select Repeat or Grid.
   3. Enter the number of copies to be duplicated.
   4. Enter the offset values.

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var dialog = showDialog();

    dialog.buttons.ok.onClick = function() {
        if (!dialog.preview.value) {
            stepandRepeat(dialog);
        }
        dialog.close();
    }

    dialog.buttons.cancel.onClick = function() {
        if (dialog.preview.value) {
            app.undo();
            app.redraw();
        }
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            stepandRepeat(dialog);
        }
        else {
            app.undo();
            app.redraw();
        }
    }

    dialog.mode.radios.repeat.onClick = function() {
        if (dialog.mode.radios.repeat.value) {
            dialog.repeat.enabled = true;
            dialog.grid.enabled = false;
            dialog.repeat.group.count.active = false;
            dialog.repeat.group.count.active = true;
        }
        preview(dialog);
    }

    dialog.mode.radios.grid.onClick = function() {
        if (dialog.mode.radios.grid.value) {
            dialog.repeat.enabled = false;
            dialog.grid.enabled = true;
            dialog.grid.group.row.active = false;
            dialog.grid.group.row.active = true;
        }
        preview(dialog);
    }

    dialog.repeat.group.count.onChanging = function() {
        preview(dialog);
    }

    dialog.grid.group.row.onChanging = function() {
        preview(dialog);
    }

    dialog.grid.group.column.onChanging = function() {
        preview(dialog);
    }

    dialog.offset.group.vertical.onChanging = function() {
        preview(dialog);
    }

    dialog.offset.group.horizontal.onChanging = function() {
        preview(dialog);
    }

    dialog.offset.group.list.onChange = function() {
        dialog.offset.group.vertical.active = false;
        dialog.offset.group.vertical.active = true;
        preview(dialog);
    }

    dialog.center();
    dialog.show();
}


function preview(dialog) {
    if (dialog.preview.value) {
        app.undo();
        app.redraw();
        stepandRepeat(dialog);
    }
}


function stepandRepeat(dialog) {
    var items = app.activeDocument.selection;
    var config = getConfiguration(dialog);

    if (config.mode == 'repeat') {
        repeat(items, config);
    }
    else {
        grid(items, config);
    }

    app.activeDocument.selection = null;
    app.redraw();
}


function repeat(items, config) {
    for (var i = 0, len = items.length; i < len; i++) {
        for (var j = 0; j < config.count; j++) {
            items[i].duplicate();
            items[i].translate(config.horizontal * getUnit(config.unit), -config.vertical * getUnit(config.unit));
        }
    }
}


function grid(items, config) {
    for (var i = 0, len = items.length; i < len; i++) {
        item = {
            top: items[i].top,
            left: items[i].left,
        };

        for (var j = 0; j < config.row; j++) {
            for (var k = 0; k < config.column - 1; k++) {
                items[i].duplicate();
                items[i].translate(config.horizontal * getUnit(config.unit), 0);
            }

            if (j < config.row - 1) {
                items[i].duplicate();
                items[i].top = item.top - config.vertical * getUnit(config.unit) * (j + 1);
                items[i].left = item.left;
            }
        }
    }
}


function getConfiguration(dialog) {
    var mode;
    if (dialog.mode.radios.repeat.value) {
        mode = 'repeat';
    }
    else if (dialog.mode.radios.grid.value) {
        mode = 'grid';
    }

    var count = isNaN(Number(dialog.repeat.group.count.text)) ? 0 : Number(dialog.repeat.group.count.text);
    var row = isNaN(Number(dialog.grid.group.row.text)) ? 1 : Number(dialog.grid.group.row.text);
    var column = isNaN(Number(dialog.grid.group.column.text)) ? 1 : Number(dialog.grid.group.column.text);

    validate(count, row, column);

    return {
        mode: mode,
        count: count,
        row: row,
        column: column,
        vertical: isNaN(Number(dialog.offset.group.vertical.text)) ? 0 : Number(dialog.offset.group.vertical.text),
        horizontal: isNaN(Number(dialog.offset.group.horizontal.text)) ? 0 : Number(dialog.offset.group.horizontal.text),
        unit: dialog.offset.group.list.selection.toString()
    };
}


function getRulerUnits(unit) {
    switch (unit) {
        case 'mm':
            return RulerUnits.Millimeters;
        case 'inch':
            return RulerUnits.Inches;
        case 'pt':
            return RulerUnits.Points;
        case 'px':
            return RulerUnits.Pixels;
    }
}


function setRulerUnits() {
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Millimeters:
            return 0;
        case RulerUnits.Inches:
            return 1;
        case RulerUnits.Points:
            return 2;
        case RulerUnits.Pixels:
            return 3;
        default:
            return 0;
    }
}


function getUnit(unit) {
    if (/pt/i.test(unit)) {
        return Number(UnitValue(1, unit));
    }
    else {
        return UnitValue(1, unit).as('pt');
    }
}


function validate(count, row, column) {
    if (count < 0) {
        alert(getErrorMessage(0));
        return false;
    }
    if (row < 1 || column < 1) {
        alert(getErrorMessage(1));
        return false;
    }
    return true;
}


function getErrorMessage(value) {
    var error = {
        en_US: {
            message: 'The value must be greater than ' + value
        },
        ja_JP: {
            message: '値は ' + value + ' 以上でなければなりません。'
        }
    };
    return error[app.locale].message || error.en_US.message;
}


function getLanguage() {
    var language = {
        en_US: {
            title: 'Step and Repeat',
            mode: 'Mode',
            repeat: 'Repeat',
            count: 'Count',
            grid: 'Grid',
            row: 'Rows',
            column: 'Columns',
            offset: 'Offset',
            vertical: 'Vertical',
            horizontal: 'Horizontal',
            unit: 'Unit',
            preview: 'Preview',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: '繰り返し複製',
            mode: 'モード',
            repeat: '繰り返し',
            count: 'カウント',
            grid: 'グリッド',
            row: '行',
            column: '段数',
            offset: 'オフセット',
            vertical: '垂直方向',
            horizontal: '水平方向',
            unit: '単位',
            preview: 'プレビュー',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };

    return language[app.locale] || language.en_US;
}


function showDialog() {
    var language = getLanguage();

    var dialog = new Window('dialog', language.title, undefined);
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'fill'];

    dialog.mode = dialog.add('group', undefined);
    dialog.mode.title = dialog.mode.add('statictext', undefined, language.mode + ' :');
    dialog.mode.radios = dialog.mode.add('group', undefined);
    dialog.mode.radios.margins = [0, 4, 0, 0];

    dialog.mode.radios.repeat = dialog.mode.radios.add('radiobutton', undefined, language.repeat);
    dialog.mode.radios.repeat.value = true;
    dialog.mode.radios.grid = dialog.mode.radios.add('radiobutton', undefined, language.grid);


    dialog.repeat = dialog.add('panel', undefined, language.repeat);
    dialog.repeat.orientation = 'row';
    dialog.repeat.alignChildren = ['left', 'fill'];

    dialog.repeat.group = dialog.repeat.add('group');
    dialog.repeat.group.orientation = 'row';
    dialog.repeat.group.alignment = ['left', 'fill'];
    dialog.repeat.group.margins = [0, 5, 0, 5];

    dialog.repeat.group.titleCount = dialog.repeat.group.add('statictext', undefined, language.count + ' :');
    dialog.repeat.group.count = dialog.repeat.group.add('edittext', undefined, 1);
    dialog.repeat.group.count.size = { width: 60, height: 20 };


    dialog.grid = dialog.add('panel', undefined, language.grid);
    dialog.grid.orientation = 'row';
    dialog.grid.alignChildren = ['left', 'fill'];
    dialog.grid.enabled = false;

    dialog.grid.group = dialog.grid.add('group');
    dialog.grid.group.orientation = 'row';
    dialog.grid.group.alignment = ['left', 'fill'];
    dialog.grid.group.margins = [0, 5, 0, 5];

    dialog.grid.group.titleRow = dialog.grid.group.add('statictext', undefined, language.row + ' :');
    dialog.grid.group.row = dialog.grid.group.add('edittext', undefined, 2);
    dialog.grid.group.row.size = { width: 60, height: 20 };

    dialog.grid.group.titleColumn = dialog.grid.group.add('statictext', undefined, language.column + ' :');
    dialog.grid.group.column = dialog.grid.group.add('edittext', undefined, 2);
    dialog.grid.group.column.size = { width: 60, height: 20 };


    dialog.offset = dialog.add('panel', undefined, language.offset);
    dialog.offset.orientation = 'row';
    dialog.offset.alignChildren = ['left', 'fill'];

    dialog.offset.group = dialog.offset.add('group');
    dialog.offset.group.orientation = 'row';
    dialog.offset.group.alignment = ['left', 'fill'];
    dialog.offset.group.margins = [0, 5, 0, 5];

    dialog.offset.group.titleVertical = dialog.offset.group.add('statictext', undefined, language.vertical + ' :');
    dialog.offset.group.vertical = dialog.offset.group.add('edittext', undefined, 10);
    dialog.offset.group.vertical.size = { width: 60, height: 20 };

    dialog.offset.group.titleHorizontal = dialog.offset.group.add('statictext', undefined, language.horizontal + ' :');
    dialog.offset.group.horizontal = dialog.offset.group.add('edittext', undefined, 10);
    dialog.offset.group.horizontal.size = { width: 60, height: 20 };

    dialog.offset.group.unit = dialog.offset.group.add('statictext', undefined, language.unit + ' :');
    dialog.offset.group.list = dialog.offset.group.add('dropdownlist', undefined, ['mm', 'inch', 'pt', 'px']);
    dialog.offset.group.list.size = { width: 60, height: 20 };
    dialog.offset.group.list.selection = setRulerUnits();

    dialog.preview = dialog.add('checkbox', undefined, language.preview);


    dialog.buttons = dialog.add('group');
    dialog.buttons.alignChildren = ['right', 'fill'];
    dialog.buttons.margins = [0, 5, 0, 0];

    dialog.buttons.cancel = dialog.buttons.add('button', undefined, language.cancel);
    dialog.buttons.ok = dialog.buttons.add('button', undefined, language.ok);


    dialog.repeat.group.titleCount.addEventListener('click', function() {
        dialog.repeat.group.count.active = false;
        dialog.repeat.group.count.active = true;
    });

    dialog.grid.group.titleRow.addEventListener('click', function() {
        dialog.grid.group.row.active = false;
        dialog.grid.group.row.active = true;
    });

    dialog.grid.group.titleColumn.addEventListener('click', function() {
        dialog.grid.group.column.active = false;
        dialog.grid.group.column.active = true;
    });

    dialog.offset.group.titleVertical.addEventListener('click', function() {
        dialog.offset.group.vertical.active = false;
        dialog.offset.group.vertical.active = true;
    });

    dialog.offset.group.titleHorizontal.addEventListener('click', function() {
        dialog.offset.group.horizontal.active = false;
        dialog.offset.group.horizontal.active = true;
    });

    return dialog;
}
