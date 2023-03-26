/* ===============================================================================================================================================
   createPageNumbers.js

   Description
   This script is equivalent to InDesign's Type menu > Insert Special Character > Markers > Current Page Number.
   Places a page number at a specified location on the artboards.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Set up each parameter in the dialog that appears.
      Position: Position of the page number relative to the artboard.
      Facing Pages: If true, the facing page.
      Start Page Number: A start page number.
      Section Prefix: Add a Section Prefix in front of the page number. If facing page, in back of the page number.
      Font Size: Font size of the page number.
      Margin: Distance from the artboard. Switch the units according to the ruler units.

   Notes
   The page numbering style is numeric only.
   Assign page numbers in artboard order.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   2.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0) main();
})();


function main() {
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var config = getConfiguration(dialog);
        createPageNumbers(config);
        dialog.close();
    }

    dialog.show();
}


function createPageNumbers(config) {
    var font = {
        name: getFont('helvetica'),
        size: config.fontsize,
        color: setColor()
    };

    var unit = getRulerUnits();
    var margin = {
        x: convertUnits(config.margin + unit, 'pt'),
        y: convertUnits(config.margin + unit, 'pt')
    };

    var layer = getLayer('Page Numbers');
    var artboards = app.activeDocument.artboards;

    for (var i = 0; i < artboards.length; i++) {
        var artboard = getArtboard(artboards[i]);
        var position = getPosition(i, artboard, margin, config);
        var contents = getPageContents(i, config);
        showPageNumber(contents, font, layer, position);
    }
}


function showPageNumber(contents, font, layer, position) {
    var text = layer.textFrames.pointText([position.x, position.y]);
    text.contents = contents.contents;
    text.textRange.paragraphAttributes.justification = contents.justification;

    var attributes = text.textRange.characterAttributes;
    attributes.textFont = font.name;
    attributes.size = font.size;
    attributes.horizontalScale = 100;
    attributes.verticalScale = 100;
    attributes.fillColor = font.color;
    attributes.strokeColor = new NoColor();
}


function getPageContents(artboard, config) {
    var position = config.position;
    var page = config.start + artboard;
    var prefix = (config.prefix) ? config.prefix + ' ' : '';
    var contents = prefix + page;
    var justification = Justification.CENTER;

    if (position.TOP_LEFT.value || position.MIDDLE_LEFT.value || position.BOTTOM_LEFT.value) {
        justification = Justification.LEFT;
        if (config.facing && config.prefix) contents = page + ' ' + config.prefix;
        if (artboard % 2 == 1 && config.facing) {
            contents = prefix + page;
            justification = Justification.RIGHT;
        }
    }

    if (position.TOP_RIGHT.value || position.MIDDLE_RIGHT.value || position.BOTTOM_RIGHT.value) {
        justification = Justification.RIGHT;
        if (artboard % 2 == 1 && config.facing) {
            if (config.prefix) contents = page + ' ' + config.prefix;
            justification = Justification.LEFT;
        }
    }

    return {
        contents: contents,
        justification: justification
    };
}


function getPosition(page, artboard, margin, config) {
    var position = config.position;
    var fontsize = config.fontsize;
    var facing = config.facing;
    var anchor = { x: 0, y: 0 };

    if (position.TOP_LEFT.value) {
        anchor.x = artboard.x1 + margin.x;
        anchor.y = artboard.y1 - margin.y - fontsize;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x2 - margin.x;
        }
        return anchor;
    }

    if (position.TOP_CENTER.value) {
        anchor.x = artboard.center.x;
        anchor.y = artboard.y1 - margin.y - fontsize;
        return anchor;
    }

    if (position.TOP_RIGHT.value) {
        anchor.x = artboard.x2 - margin.x;
        anchor.y = artboard.y1 - margin.y - fontsize;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x1 + margin.x;
        }
        return anchor;
    }

    if (position.MIDDLE_LEFT.value) {
        anchor.x = artboard.x1 + margin.x;
        anchor.y = artboard.center.y - fontsize / 2;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x2 - margin.x;
        }
        return anchor;
    }

    if (position.MIDDLE_CENTER.value) {
        anchor.x = artboard.center.x;
        anchor.y = artboard.center.y - fontsize / 2;
        return anchor;
    }

    if (position.MIDDLE_RIGHT.value) {
        anchor.x = artboard.x2 - margin.x;
        anchor.y = artboard.center.y - fontsize / 2;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x1 + margin.x;
        }
        return anchor;
    }

    if (position.BOTTOM_LEFT.value) {
        anchor.x = artboard.x1 + margin.x;
        anchor.y = artboard.y2 + margin.y;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x2 - margin.x;
        }
        return anchor;
    }

    if (position.BOTTOM_CENTER.value) {
        anchor.x = artboard.center.x;
        anchor.y = artboard.y2 + margin.y;
        return anchor;
    }

    if (position.BOTTOM_RIGHT.value) {
        anchor.x = artboard.x2 - margin.x;
        anchor.y = artboard.y2 + margin.y;
        if (page % 2 == 1 && facing) {
            anchor.x = artboard.x1 + margin.x;
        }
        return anchor;
    }
}


function getArtboard(item) {
    var artboard = {
        x1: item.artboardRect[0],
        y1: item.artboardRect[1],
        x2: item.artboardRect[2],
        y2: item.artboardRect[3],
    };
    artboard.width = Math.abs(artboard.x2 - artboard.x1);
    artboard.height = Math.abs(artboard.y2 - artboard.y1);
    artboard.center = {
        x: artboard.x1 + (artboard.width / 2),
        y: artboard.y1 - (artboard.height / 2)
    };
    return artboard;
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


function getLayer(name) {
    if (layerExists(name)) {
        var layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
        return layer;
    }
    else {
        return createLayer(name);
    }
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function layerExists(name) {
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
        case RulerUnits.Inches: return 'inch';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
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
        position: dialog.position,
        facing: dialog.facing.value,
        start: start,
        prefix: dialog.prefix.text,
        fontsize: fontsize,
        margin: margin
    };
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
    dialog.margins = 10;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'top'];
    group2.spacing = 10;
    group2.margins = 0;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext1 = group3.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.position;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 93, 0, 0];

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.start;

    var group5 = group2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 8, 0, 0];

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.prefix;

    var group6 = group2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 8, 0, 0];

    var statictext4 = group6.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.font;

    var group7 = group2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 8, 0, 0];

    var statictext5 = group7.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.margin;

    var group9 = group1.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var group11 = group10.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var radiobutton1 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    var radiobutton2 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    var radiobutton3 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });

    var group12 = group10.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var radiobutton4 = group12.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    var radiobutton5 = group12.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    var radiobutton6 = group12.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });

    var group13 = group10.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var radiobutton7 = group13.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    var radiobutton8 = group13.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    var radiobutton9 = group13.add('radiobutton', undefined, undefined, { name: 'radiobutton9' });
    radiobutton9.value = true;

    var group14 = group9.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var checkbox1 = group14.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.facing;

    var group15 = group9.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['left', 'center'];
    group15.spacing = 10;
    group15.margins = 0;

    var edittext1 = group15.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 100;

    var group16 = group9.add('group', undefined, { name: 'group16' });
    group16.orientation = 'row';
    group16.alignChildren = ['left', 'center'];
    group16.spacing = 10;
    group16.margins = 0;

    var edittext2 = group16.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.preferredSize.width = 100;

    var group17 = group9.add('group', undefined, { name: 'group17' });
    group17.orientation = 'row';
    group17.alignChildren = ['left', 'center'];
    group17.spacing = 5;
    group17.margins = 0;

    var edittext3 = group17.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '10';
    edittext3.preferredSize.width = 100;

    var statictext7 = group17.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = 'pt';

    var group18 = group9.add('group', undefined, { name: 'group18' });
    group18.orientation = 'row';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 5;
    group18.margins = 0;

    var edittext4 = group18.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '5';
    edittext4.preferredSize.width = 100;

    var statictext8 = group18.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = units;

    var group19 = dialog.add('group', undefined, { name: 'group19' });
    group19.orientation = 'row';
    group19.alignChildren = ['right', 'center'];
    group19.spacing = 10;
    group19.margins = [0, 10, 0, 0];

    var button1 = group19.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group19.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;

    radiobutton1.onClick = function() {
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton2.onClick = function() {
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton3.onClick = function() {
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton4.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton5.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton6.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton7.value = radiobutton8.value = radiobutton9.value = false;
    }

    radiobutton7.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
    }

    radiobutton8.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
    }

    radiobutton9.onClick = function() {
        radiobutton1.value = radiobutton2.value = radiobutton3.value = false;
        radiobutton4.value = radiobutton5.value = radiobutton6.value = false;
    }

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext3.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext5.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    button1.onClick = function() {
        dialog.close();
    }

    dialog.position = {
        TOP_LEFT: radiobutton1,
        TOP_CENTER: radiobutton2,
        TOP_RIGHT: radiobutton3,
        MIDDLE_LEFT: radiobutton4,
        MIDDLE_CENTER: radiobutton5,
        MIDDLE_RIGHT: radiobutton6,
        BOTTOM_LEFT: radiobutton7,
        BOTTOM_CENTER: radiobutton8,
        BOTTOM_RIGHT: radiobutton9
    };
    dialog.facing = checkbox1;
    dialog.start = edittext1;
    dialog.prefix = edittext2;
    dialog.fontsize = edittext3;
    dialog.margin = edittext4;
    dialog.ok = button2;
    dialog.cancel = button1;

    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Create Page Numbers',
            ja: 'ノンブル作成'
        },
        position: {
            en: 'Position:',
            ja: '位置:'
        },
        facing: {
            en: 'Facing Pages',
            ja: '見開き'
        },
        start: {
            en: 'Start Page Number:',
            ja: '開始ページ番号:'
        },
        prefix: {
            en: 'Section Prefix:',
            ja: 'セクションプレフィックス:'
        },
        font: {
            en: 'Font Size:',
            ja: 'フォントサイズ:'
        },
        margin: {
            en: 'Margin:',
            ja: '余白:'
        },
        binding: {
            en: 'Page Binding:',
            ja: '綴じ方向:'
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
