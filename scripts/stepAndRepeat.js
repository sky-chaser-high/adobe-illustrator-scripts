/* ===============================================================================================================================================
   stepAndRepeat

   Description
   This script is equivalent to InDesign's "Step and Repeat".

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
   2.0.1

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
        if (!dialog.preview.value) {
            run(dialog);
        }
        dialog.close();
    }

    dialog.preview.onClick = function() {
        if (dialog.preview.value) {
            run(dialog);
        }
        else {
            app.undo();
        }
        app.redraw();
    }

    dialog.show();
}


function run(dialog) {
    var config = getConfig(dialog);
    if (!validate(config)) return;
    stepAndRepeat(config);
}


function preview(dialog) {
    if (dialog.preview.value) {
        app.undo();
        run(dialog);
        app.redraw();
    }
}


function stepAndRepeat(config) {
    var items = app.activeDocument.selection;
    for (var i = 0; i < items.length; i++) {
        if (config.mode.repeat) repeat(items[i], config);
        if (config.mode.grid) grid(items[i], config);
    }
    app.activeDocument.selection = null;
}


function repeat(item, config) {
    for (var i = 0; i < config.rows; i++) {
        item.duplicate();
        item.translate(config.horizontal, config.vertical * -1);
    }
}


function grid(item, config) {
    var base = {
        top: item.top,
        left: item.left,
    };
    for (var i = 0; i < config.rows; i++) {
        for (var j = 0; j < config.columns - 1; j++) {
            item.duplicate();
            item.translate(config.horizontal, 0);
        }
        if (i < config.rows - 1) {
            item.duplicate();
            item.top = base.top - config.vertical * (i + 1);
            item.left = base.left;
        }
    }
}


function getConfig(dialog) {
    var units = getUnits(app.activeDocument.rulerUnits);
    var rows = Number(dialog.rows.text);
    var columns = Number(dialog.columns.text);
    var vertical = Number(dialog.vertical.text);
    var horizontal = Number(dialog.horizontal.text);
    return {
        mode: {
            grid: (dialog.grid.value) ? true : false,
            repeat: (dialog.grid.value) ? false : true
        },
        rows: isNaN(rows) ? 1 : rows,
        columns: isNaN(columns) ? 1 : columns,
        vertical: isNaN(vertical) ? 0 : convertUnits(vertical + units, 'pt'),
        horizontal: isNaN(horizontal) ? 0 : convertUnits(horizontal + units, 'pt')
    };
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


function convertUnits(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function validate(config) {
    if (config.rows < 1 || config.columns < 1) {
        $.localize = true;
        alert(errorMessage(1));
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


function showDialog() {
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

    // Work around the problem of being unable to undo the ESC key during localization.
    var button3 = group9.add('button', undefined, undefined, { name: 'button3' });
    button3.text = 'Cancel';
    button3.hide();

    button3.onClick = function() {
        if (checkbox2.value) {
            app.undo();
            app.redraw();
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
        preview(dialog);
    }

    edittext1.onChanging = function() {
        preview(dialog);
    }

    edittext2.onChanging = function() {
        preview(dialog);
    }

    edittext3.onChanging = function() {
        preview(dialog);
    }

    edittext4.onChanging = function() {
        preview(dialog);
    }

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
