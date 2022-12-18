/* ===============================================================================================================================================
   drawRectangle

   Description
   This script draws a rectangle on a selected object.

   Usage
   1. Select the path objects, run this script from File > Scripts > Other Script...
   2. Enter a margin value.
      To include stroke width, check the Include stroke width checkbox.

   Notes
   The rectangle is drawn with no fill and stroke width.
   The units of margin value depend on the ruler units.
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
        var margin = getMargin(Number(dialog.margin.text));
        var items = app.activeDocument.selection;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var bounds = dialog.stroke.value ? item.visibleBounds : item.geometricBounds;
            drawRect(bounds, margin);
            item.selected = false;
        }
        dialog.close();
    }

    dialog.show();
}


function drawRect(bounds, margin) {
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);

    var rect = app.activeDocument.activeLayer.pathItems.rectangle(
        y1 + margin,
        x1 - margin,
        width + (margin * 2),
        height + (margin * 2)
    );
    rect.filled = false;
    rect.stroked = false;
    rect.selected = true;
}


function getMargin(value) {
    if (isNaN(value)) return 0;
    var units = getUnits(app.activeDocument.rulerUnits);
    return convertUnits(value + units, 'pt');
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
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.margin;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '0';
    edittext1.preferredSize.width = 180;
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 5, 0, 0];

    var checkbox1 = group2.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.stroke;
    checkbox1.value = true;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 10, 0, 0];
    group3.alignment = ['fill', 'top'];

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
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

    dialog.margin = edittext1;
    dialog.stroke = checkbox1;
    dialog.ok = button2;

    return dialog;
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
        stroke: {
            en: 'Include stroke width',
            ja: '線幅を含む'
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
