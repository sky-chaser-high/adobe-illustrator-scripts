/* ===============================================================================================================================================
   createPageNumbers.js

   Description
   This script is equivalent to InDesign's Type menu > Insert Special Character > Markers > Current Page Number.
   Places a page number at a specified location on the artboards.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Set up each parameter in the dialog that appears.
      Position: Position of the page number.
      Facing Pages: If true, the facing page.
      Start Page Numbering at: a Start page number.
      Section Prefix: Add a Section Prefix in front of the page number. If facing page, in back of the page number.
      Font Size: Font size of the page number.
      Margin: Distance from the artboard. Switch the units according to the ruler units.

   Notes
   The page numbering style is numeric only.
   Assign page numbers in artboard order.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function () {
    if (app.documents.length > 0) main();
})();


function main() {
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var config = getConfiguration(dialog);
        createPageNumbers(config);
        dialog.close();
    }

    dialog.center();
    dialog.show();
}


function createPageNumbers(config) {
    var font = {
        name: getFont('helvetica'),
        size: config.fontsize,
        color: setColor()
    };

    var ruler = getRulerUnits();
    var unit = getUnit(ruler);
    var margin = {
        x: config.margin * unit,
        y: config.margin * unit
    };

    var layer, name = 'Page Numbers';

    if (existLayer(name)) {
        layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
    }
    else {
        layer = createLayer(name);
    }

    var artboards = getArtboards();

    for (var i = 0; i < artboards.length; i++) {
        var anchor = getPosition(i, artboards[i], margin, config);
        showPageNumber(i, font, layer, anchor, config);
    }
}


function showPageNumber(artboard, font, layer, anchor, config) {
    var contents, justification;
    var page = config.start + artboard;

    if (/LEFT/.test(config.position)) {
        contents = (config.facing) ? page + ' ' + config.prefix : config.prefix + ' ' + page;
        justification = Justification.LEFT;
        if (artboard % 2 == 1 && config.facing) {
            contents = config.prefix + ' ' + page;
            justification = Justification.RIGHT;
        }
    }
    else if (/RIGHT/.test(config.position)) {
        contents = config.prefix + ' ' + page;
        justification = Justification.RIGHT;
        if (artboard % 2 == 1 && config.facing) {
            contents = page + ' ' + config.prefix;
            justification = Justification.LEFT;
        }
    }
    else {
        contents = config.prefix + ' ' + page;
        justification = Justification.CENTER;
    }

    if (!config.prefix) {
        contents = page;
    }

    var text = layer.textFrames.pointText([anchor.x, anchor.y]);
    text.contents = contents;
    text.textRange.paragraphAttributes.justification = justification;

    var attributes = text.textRange.characterAttributes;
    attributes.textFont = font.name;
    attributes.size = font.size;
    attributes.horizontalScale = 100;
    attributes.verticalScale = 100;
    attributes.fillColor = font.color;
    attributes.strokeColor = new NoColor();
}


function getPosition(page, artboard, margin, config) {
    var anchor = { x: 0, y: 0 };

    switch (config.position) {
        case 'TOP_LEFT':
            anchor.x = artboard.x1 + margin.x;
            anchor.y = artboard.y1 - margin.y - config.fontsize;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x2 - margin.x;
            }
            break;
        case 'TOP_CENTER':
            anchor.x = artboard.center.x;
            anchor.y = artboard.y1 - margin.y - config.fontsize;
            break;
        case 'TOP_RIGHT':
            anchor.x = artboard.x2 - margin.x;
            anchor.y = artboard.y1 - margin.y - config.fontsize;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x1 + margin.x;
            }
            break;

        case 'MIDDLE_LEFT':
            anchor.x = artboard.x1 + margin.x;
            anchor.y = artboard.center.y - config.fontsize / 2;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x2 - margin.x;
            }
            break;
        case 'MIDDLE_CENTER':
            anchor.x = artboard.center.x;
            anchor.y = artboard.center.y - config.fontsize / 2;
            break;
        case 'MIDDLE_RIGHT':
            anchor.x = artboard.x2 - margin.x;
            anchor.y = artboard.center.y - config.fontsize / 2;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x1 + margin.x;
            }
            break;

        case 'BOTTOM_LEFT':
            anchor.x = artboard.x1 + margin.x;
            anchor.y = artboard.y2 + margin.y;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x2 - margin.x;
            }
            break;
        case 'BOTTOM_CENTER':
            anchor.x = artboard.center.x;
            anchor.y = artboard.y2 + margin.y;
            break;
        case 'BOTTOM_RIGHT':
            anchor.x = artboard.x2 - margin.x;
            anchor.y = artboard.y2 + margin.y;
            if (page % 2 == 1 && config.facing) {
                anchor.x = artboard.x1 + margin.x;
            }
            break;
    }

    return anchor;
}


function getArtboards() {
    var items = [];
    var artboards = app.activeDocument.artboards;

    for (var i = 0; i < artboards.length; i++) {
        var artboard = {
            x1: artboards[i].artboardRect[0],
            y1: artboards[i].artboardRect[1],
            x2: artboards[i].artboardRect[2],
            y2: artboards[i].artboardRect[3],
            width: 0,
            height: 0,
            center: {
                x: 0,
                y: 0
            }
        };
        artboard.width = Math.abs(artboard.x2 - artboard.x1);
        artboard.height = Math.abs(artboard.y2 - artboard.y1);
        artboard.center.x = artboard.x1 + (artboard.width / 2);
        artboard.center.y = artboard.y1 - (artboard.height / 2);

        items.push(artboard);
    }

    return items;
}


function setColor() {
    switch (app.activeDocument.documentColorSpace) {
        case DocumentColorSpace.CMYK:
            return setCMYK(0, 0, 0, 100);
        case DocumentColorSpace.RGB:
            return setRGB(0, 0, 0);
    }
}


function setCMYK(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGB(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function existLayer(name) {
    try {
        app.activeDocument.layers[name];
        return true;
    }
    catch (err) {
        return false;
    }
}


function getFont(name) {
    try {
        return app.textFonts[name];
    }
    catch (err) {
        return app.textFonts[0];
    }
}


function getUnit(kind) {
    if (/pt/i.test(kind)) {
        return Number(UnitValue(1, kind));
    }
    else {
        return UnitValue(1, kind).as('pt');
    }
}


function getRulerUnits() {
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Millimeters:
            return 'mm';
        case RulerUnits.Centimeters:
            return 'cm';
        case RulerUnits.Inches:
            return 'inch';
        case RulerUnits.Points:
            return 'pt';
        case RulerUnits.Pixels:
            return 'px';
        default:
            return 'pt';
    }
}


function getConfiguration(dialog) {
    var start = Number(dialog.start.text);
    if (start < 1 || isNaN(start)) start = 1;

    var fontsize = Number(dialog.fontsize.text);
    if (fontsize < 1 || isNaN(fontsize)) fontsize = 1;

    var margin = Number(dialog.margin.text);
    if (isNaN(margin)) margin = 0;

    return {
        position: dialog.dropdown.selection.toString(),
        facing: dialog.facing.value,
        start: start,
        prefix: dialog.prefix.text,
        fontsize: fontsize,
        margin: margin
        // binding: (dialog.left.value) ? 'LEFT' : 'RIGHT'
    };
}


function showDialog() {
    var language = getLanguage();
    var units = getRulerUnits();

    var dialog = new Window('dialog');
    dialog.text = language.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['right', 'top'];
    dialog.spacing = 10;
    dialog.margins = 10;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 20;
    group2.margins = [0, 2, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = language.position;
    statictext1.preferredSize.height = 20;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.preferredSize.height = 4;

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = language.start;
    statictext3.preferredSize.height = 20;

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = language.prefix;
    statictext4.preferredSize.height = 20;

    var statictext5 = group2.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = language.font;
    statictext5.preferredSize.height = 20;

    var statictext6 = group2.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = language.margin;
    statictext6.preferredSize.height = 20;

    // var statictext7 = group2.add('statictext', undefined, undefined, { name: 'statictext7' });
    // statictext7.text = language.binding;
    // statictext7.preferredSize.height = 20;


    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 12;
    group3.margins = [0, 2, 0, 0];

    var dropdown1_items = [
        'TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT',
        '-',
        'MIDDLE_LEFT', 'MIDDLE_CENTER', 'MIDDLE_RIGHT',
        '-',
        'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'
    ];
    var dropdown1 = group3.add('dropdownlist', undefined, undefined, { name: 'dropdown1', items: dropdown1_items });
    dropdown1.selection = 10;
    dropdown1.preferredSize.width = 200;

    var checkbox1 = group3.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = language.facing;


    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 5;
    group4.margins = [0, 0, 0, 0];

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 50;


    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 5;
    group5.margins = [0, 5, 0, 0];

    var edittext2 = group5.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.preferredSize.width = 200;


    var group6 = group3.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 5;
    group6.margins = [0, 6, 0, 0];

    var edittext3 = group6.add('edittext', undefined, undefined, {name: 'edittext3'});
    edittext3.text = '10';
    edittext3.preferredSize.width = 50;

    var statictext8 = group6.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = 'pt';


    var group7 = group3.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 5;
    group7.margins = [0, 6, 0, 0];

    var edittext4 = group7.add('edittext', undefined, undefined, {name: 'edittext4'});
    edittext4.text = '5';
    edittext4.preferredSize.width = 50;

    var statictext9 = group7.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = units;


    // var group8 = group3.add('group', undefined, { name: 'group8' });
    // group8.orientation = 'row';
    // group8.alignChildren = ['left', 'center'];
    // group8.spacing = 20;
    // group8.margins = [0, 0, 0, 0];

    // var radiobutton1 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    // radiobutton1.text = 'Left';
    // radiobutton1.value = true;

    // var radiobutton2 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    // radiobutton2.text = 'Right';


    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 10, 0, 0];

    var button1 = group9.add('button', undefined, undefined, { name: 'button1' });
    button1.text = language.cancel;
    button1.preferredSize.width = 90;

    var button2 = group9.add('button', undefined, undefined, { name: 'button2' });
    button2.text = language.ok;
    button2.preferredSize.width = 90;


    statictext3.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext5.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext6.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });


    dropdown1.onChange = function() {
        var position = dropdown1.selection;
        if (!position) {
            dropdown1.selection = 10;
        }
    }


    button1.onClick = function() {
        dialog.close();
    }


    dialog.dropdown = dropdown1;
    dialog.facing = checkbox1;
    dialog.start = edittext1;
    dialog.prefix = edittext2;
    dialog.fontsize = edittext3;
    dialog.margin = edittext4;
    // dialog.left = radiobutton1;
    // dialog.right = radiobutton2;
    dialog.ok = button2;
    dialog.cancel = button1;

    return dialog;
}


function getLanguage() {
    var language = {
        en_US: {
            title: 'Create Page Numbers',
            position: 'Position:',
            facing: 'Facing Pages',
            start: 'Start Page Numbering at:',
            prefix: 'Section Prefix:',
            font: 'Font Size:',
            margin: 'Margin:',
            binding: 'Page Binding:',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'ノンブル作成',
            position: '位置:',
            facing: '見開き',
            start: '開始ページ番号:',
            prefix: 'セクションプレフィックス:',
            font: 'フォントサイズ:',
            margin: 'マージン:',
            binding: '綴じ方向:',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };
    return language[app.locale] || language.en_US;
}
