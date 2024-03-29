﻿/* ===============================================================================================================================================
   compareScale

   Description
   This script compares the scales of two objects.

   Usage
   Select two objects, run this script from File > Scripts > Other Script...

   Notes
   The dimension units depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.1

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function () {
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    $.localize = true;
    var items = app.activeDocument.selection;
    if (items.length != 2) return alert(localizeUI().caution);

    var unit = getRulerUnits();

    var item1 = {
        width: convertUnits(items[0].width + 'pt', unit),
        height: convertUnits(items[0].height + 'pt', unit)
    };

    var item2 = {
        width: convertUnits(items[1].width + 'pt', unit),
        height: convertUnits(items[1].height + 'pt', unit)
    };

    var compare = compareScale(item1, item2);
    showDialog(compare.width, compare.height, compare.scale, unit);
}


function compareScale(item1, item2) {
    var width = { large: 0, small: 0 };
    var height = { large: 0, small: 0 };
    var scale = {
        horizontal: { expanding: 0, shrinking: 0 },
        vertical: { expanding: 0, shrinking: 0 }
    };

    var isLarge = (item1.width > item2.width || item1.height > item2.height) ? true : false;

    width.large = (isLarge) ? item1.width : item2.width;
    height.large = (isLarge) ? item1.height : item2.height;

    width.small = (isLarge) ? item2.width : item1.width;
    height.small = (isLarge) ? item2.height : item1.height;

    scale.horizontal.expanding = (isLarge) ? getWidthRatio(item1, item2) : getWidthRatio(item2, item1);
    scale.vertical.expanding = (isLarge) ? getHeightRatio(item1, item2) : getHeightRatio(item2, item1);

    scale.horizontal.shrinking = (isLarge) ? getWidthRatio(item2, item1) : getWidthRatio(item1, item2);
    scale.vertical.shrinking = (isLarge) ? getHeightRatio(item2, item1) : getHeightRatio(item1, item2);

    return {
        width: width,
        height: height,
        scale: scale
    };
}


function getWidthRatio(item1, item2) {
    return item1.width / item2.width * 100
}


function getHeightRatio(item1, item2) {
    return item1.height / item2.height * 100
}


function round(value) {
    var digits = 100000;
    return Math.round(value * digits) / digits;
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
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
    }
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(width, height, scale, unit) {
    var aiVersion = parseInt(app.version);

    $.localize = true;
    var local = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = local.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['center', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = local.expanding;
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = (aiVersion > 24) ? 13 : 12;
    if (aiVersion > 24) group2.margins = [0, 1, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = local.width;
    statictext1.preferredSize.height = 20;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = local.height;
    statictext2.preferredSize.height = 20;

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = local.horizontal;
    statictext3.preferredSize.height = 20;

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = local.vertical;
    statictext4.preferredSize.height = 20;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = round(width.small);
    edittext1.preferredSize.width = 85;

    var statictext5 = group4.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = unit;

    var statictext6 = group4.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = '>';

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = round(width.large);
    edittext2.preferredSize.width = 85;

    var statictext7 = group4.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = unit;

    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var edittext3 = group5.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = round(height.small);
    edittext3.preferredSize.width = 85;

    var statictext8 = group5.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = unit;

    var statictext9 = group5.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = '>';

    var edittext4 = group5.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = round(height.large);
    edittext4.preferredSize.width = 85;

    var statictext10 = group5.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = unit;

    var group6 = group3.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var edittext5 = group6.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = round(scale.horizontal.expanding);
    edittext5.preferredSize.width = 85;

    var statictext11 = group6.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = '%';

    var group7 = group3.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var edittext6 = group7.add('edittext', undefined, undefined, { name: 'edittext6' });
    edittext6.text = round(scale.vertical.expanding);
    edittext6.preferredSize.width = 85;

    var statictext12 = group7.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = '%';

    var group8 = dialog.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var panel2 = group8.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = local.shrinking;
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = (aiVersion > 24) ? 13 : 12;
    if (aiVersion > 24) group9.margins = [0, 1, 0, 0];

    var statictext13 = group9.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = local.width;
    statictext13.preferredSize.height = 20;

    var statictext14 = group9.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = local.height;
    statictext14.preferredSize.height = 20;

    var statictext15 = group9.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = local.horizontal;
    statictext15.preferredSize.height = 20;

    var statictext16 = group9.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = local.vertical;
    statictext16.preferredSize.height = 20;

    var group10 = panel2.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var group11 = group10.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var edittext7 = group11.add('edittext', undefined, undefined, { name: 'edittext7' });
    edittext7.text = round(width.large);
    edittext7.preferredSize.width = 85;

    var statictext17 = group11.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = unit;

    var statictext18 = group11.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = '>';

    var edittext8 = group11.add('edittext', undefined, undefined, { name: 'edittext8' });
    edittext8.text = round(width.small);
    edittext8.preferredSize.width = 85;

    var statictext19 = group11.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = unit;

    var group12 = group10.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var edittext9 = group12.add('edittext', undefined, undefined, { name: 'edittext9' });
    edittext9.text = round(height.large);
    edittext9.preferredSize.width = 85;

    var statictext20 = group12.add('statictext', undefined, undefined, { name: 'statictext20' });
    statictext20.text = unit;

    var statictext21 = group12.add('statictext', undefined, undefined, { name: 'statictext21' });
    statictext21.text = '>';

    var edittext10 = group12.add('edittext', undefined, undefined, { name: 'edittext10' });
    edittext10.text = round(height.small);
    edittext10.preferredSize.width = 85;

    var statictext22 = group12.add('statictext', undefined, undefined, { name: 'statictext22' });
    statictext22.text = unit;

    var group13 = group10.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var edittext11 = group13.add('edittext', undefined, undefined, { name: 'edittext11' });
    edittext11.text = round(scale.horizontal.shrinking);
    edittext11.preferredSize.width = 85;

    var statictext23 = group13.add('statictext', undefined, undefined, { name: 'statictext23' });
    statictext23.text = '%';

    var group14 = group10.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var edittext12 = group14.add('edittext', undefined, undefined, { name: 'edittext12' });
    edittext12.text = round(scale.vertical.shrinking);
    edittext12.preferredSize.width = 85;

    var statictext24 = group14.add('statictext', undefined, undefined, { name: 'statictext24' });
    statictext24.text = '%';

    var group15 = dialog.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['left', 'center'];
    group15.spacing = 10;
    group15.margins = 0;
    group15.alignment = ['right', 'top'];

    var button1 = group15.add('button', undefined, undefined, { name: 'button1' });
    button1.text = 'OK';
    button1.preferredSize.width = 90;

    dialog.show();
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
        expanding: {
            en: 'Expanding',
            ja: '拡大'
        },
        shrinking: {
            en: 'Shrinking',
            ja: '縮小'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
        },
        horizontal: {
            en: 'Horizontal:',
            ja: '水平:'
        },
        vertical: {
            en: 'Vertical:',
            ja: '垂直:'
        }
    };
}
