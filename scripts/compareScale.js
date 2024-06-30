/* ===============================================================================================================================================
   compareScale

   Description
   This script compares the scales of two objects.

   Usage
   1. Select two objects, run this script from File > Scripts > Other Script...
   2. To include stroke width, check the Use Preview Bounds checkbox.

   Notes
   The dimension units depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CC or higher

   Version
   1.1.0

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
    if (items.length != 2) {
        $.localize = true;
        var ui = localizeUI();
        return alert(ui.caution);
    }

    var item1 = items[0];
    var item2 = items[1];
    var usePreviewBounds = isUsePreviewBounds();
    var compare = compareScale(item1, item2, usePreviewBounds);

    var dialog = showDialog(compare.item1, compare.item2);

    dialog.usePreviewBounds.onClick = function() {
        usePreviewBounds = dialog.usePreviewBounds.value;
        compare = compareScale(item1, item2, usePreviewBounds);
        setCompareValueTo(dialog, compare.item1, compare.item2);
    }

    dialog.show();
}


function setCompareValueTo(dialog, item1, item2) {
    var unit = getRulerUnits();

    dialog.item1.horizontal.text = round(item1.horizontal);
    dialog.item1.vertical.text = round(item1.vertical);

    dialog.item1.width.text = round(item1.width) + ' ' + unit;
    dialog.item1.height.text = round(item1.height) + ' ' + unit;

    dialog.item2.horizontal.text = round(item2.horizontal);
    dialog.item2.vertical.text = round(item2.vertical);

    dialog.item2.width.text = round(item2.width) + ' ' + unit;
    dialog.item2.height.text = round(item2.height) + ' ' + unit;
}


function compareScale(item1, item2, usePreviewBounds) {
    var width1 = getWidth(item1, usePreviewBounds);
    var height1 = getHeight(item1, usePreviewBounds);
    var width2 = getWidth(item2, usePreviewBounds);
    var height2 = getHeight(item2, usePreviewBounds);
    var unit = getRulerUnits();
    return {
        item1: {
            horizontal: getWidthRatio(width2, width1),
            vertical: getHeightRatio(height2, height1),
            width: convertUnits(width1 + 'pt', unit),
            height: convertUnits(height1 + 'pt', unit)
        },
        item2: {
            horizontal: getWidthRatio(width1, width2),
            vertical: getHeightRatio(height1, height2),
            width: convertUnits(width2 + 'pt', unit),
            height: convertUnits(height2 + 'pt', unit)
        }
    };
}


function getWidth(item, usePreviewBounds) {
    var bounds = (usePreviewBounds) ? item.visibleBounds : item.geometricBounds;
    var x1 = bounds[0];
    var x2 = bounds[2];
    return Math.abs(x1 - x2);
}


function getHeight(item, usePreviewBounds) {
    var bounds = (usePreviewBounds) ? item.visibleBounds : item.geometricBounds;
    var y1 = bounds[1];
    var y2 = bounds[3];
    return Math.abs(y1 - y2);
}


function getWidthRatio(item1, item2) {
    return item1 / item2 * 100;
}


function getHeightRatio(item1, item2) {
    return item1 / item2 * 100;
}


function round(value) {
    var digits = 100000;
    return Math.round(value * digits) / digits;
}


function isUsePreviewBounds() {
    var key = 'includeStrokeInBounds';
    var pref = app.preferences;
    return pref.getBooleanPreference(key);
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
    var cc = 17;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc) return false;
    return true;
}


function showDialog(item1, item2) {
    $.localize = true;
    var ui = localizeUI();
    var unit = getRulerUnits();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.item + ' #1';
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 5, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 18;
    group2.margins = [0, 4, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.horizontal;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.vertical;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 1, 0, 0];

    var statictext3 = group3.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.width;

    var statictext4 = group3.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.height;

    var group4 = group1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['fill', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var group5 = group4.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var edittext1 = group5.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = round(item1.horizontal);
    edittext1.preferredSize.width = 140;

    var statictext5 = group5.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = '%';

    var group6 = group4.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var edittext2 = group6.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = round(item1.vertical);
    edittext2.preferredSize.width = 140;

    var statictext6 = group6.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = '%';

    var group7 = group4.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['fill', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 5, 0, 0];

    var statictext7 = group7.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = round(item1.width) + ' ' + unit;

    var group8 = group4.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['fill', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var statictext8 = group8.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = round(item1.height) + ' ' + unit;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.item + ' #2';
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 5, 0, 0];

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['right', 'center'];
    group10.spacing = 18;
    group10.margins = [0, 4, 0, 0];

    var statictext9 = group10.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = ui.horizontal;

    var statictext10 = group10.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = ui.vertical;

    var group11 = group10.add('group', undefined, { name: 'group11' });
    group11.orientation = 'column';
    group11.alignChildren = ['right', 'center'];
    group11.spacing = 10;
    group11.margins = [0, 1, 0, 0];

    var statictext11 = group11.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = ui.width;

    var statictext12 = group11.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = ui.height;

    var group12 = group9.add('group', undefined, { name: 'group12' });
    group12.orientation = 'column';
    group12.alignChildren = ['fill', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var group13 = group12.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var edittext3 = group13.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = round(item2.horizontal);
    edittext3.preferredSize.width = 140;

    var statictext13 = group13.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = '%';

    var group14 = group12.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var edittext4 = group14.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = round(item2.vertical);
    edittext4.preferredSize.width = 140;

    var statictext14 = group14.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = '%';

    var group15 = group12.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['fill', 'center'];
    group15.spacing = 10;
    group15.margins = [0, 5, 0, 0];

    var statictext15 = group15.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = round(item2.width) + ' ' + unit;

    var group16 = group12.add('group', undefined, { name: 'group16' });
    group16.orientation = 'row';
    group16.alignChildren = ['fill', 'center'];
    group16.spacing = 10;
    group16.margins = 0;

    var statictext16 = group16.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = round(item2.height) + ' ' + unit;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.option;
    panel3.orientation = 'column';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group17 = panel3.add('group', undefined, { name: 'group17' });
    group17.orientation = 'row';
    group17.alignChildren = ['left', 'center'];
    group17.spacing = 10;
    group17.margins = [0, 8, 0, 0];

    var checkbox1 = group17.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.bounds;

    var group18 = dialog.add('group', undefined, { name: 'group18' });
    group18.orientation = 'row';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 10;
    group18.margins = 0;
    group18.alignment = ['right', 'top'];

    var button1 = group18.add('button', undefined, undefined, { name: 'button1' });
    button1.text = 'OK';
    button1.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext9.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext10.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    dialog.item1 = {
        horizontal: edittext1,
        vertical: edittext2,
        width: statictext7,
        height: statictext8
    };
    dialog.item2 = {
        horizontal: edittext3,
        vertical: edittext4,
        width: statictext15,
        height: statictext16
    };
    dialog.usePreviewBounds = checkbox1;
    return dialog;
}


function localizeUI() {
    return {
        caution: {
            en: 'Select two objects.',
            ja: 'オブジェクトを2つ選択してください。'
        },
        title: {
            en: 'Compare Scale',
            ja: '拡大・縮小率'
        },
        item: {
            en: 'Item',
            ja: 'アイテム'
        },
        horizontal: {
            en: 'Horizontal:',
            ja: '水平方向:'
        },
        vertical: {
            en: 'Vertical:',
            ja: '垂直方向:'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
        },
        option: {
            en: 'Option',
            ja: 'オプション'
        },
        bounds: {
            en: 'Use Preview Bounds',
            ja: 'プレビュー境界を使用'
        }
    };
}
