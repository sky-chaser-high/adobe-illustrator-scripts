/* ===============================================================================================================================================
   createColorChart

   Description
   This script creates a color chart.
   Both CMYK and RGB colors are supported.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select either CMYK or RGB, enter the color values.
      If an object is selected, the fill value of the object will be used as the initial value.
   3. Select the color you want to increase or decrease with vertical, or horizontal.
   4. Enter the increase or decrease value.
      Enter the percentage to be increased or decreased.
   5. Set the artboard size, color chip size, and units according to your preference.

   Notes
   Create a color chart in a new document.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    main();
})();


function main() {
    var items = app.activeDocument.selection;
    var item = getTargetItemColor(items);
    var dialog = showDialog(item);

    dialog.ok.onClick = function() {
        var config = getConfiguration(dialog);
        if (validTest(config)) {
            createNewDocument(config.mode, config.unit, config.artboard.width, config.artboard.height);

            // target color
            var points = getCenterPosition(config.chip.width, config.chip.height);
            var chip = createColorChip(config.mode, config.color, points);
            showColorName(config.mode, chip, config.chip.width);

            createColorChart(config, chip);
            dialog.close();
        }
    }

    dialog.center();
    dialog.show();
}


function getConfiguration(dialog) {
    var color1 = isNaN(Number(dialog.color1.text)) ? 0 : Number(dialog.color1.text);
    var color2 = isNaN(Number(dialog.color2.text)) ? 0 : Number(dialog.color2.text);
    var color3 = isNaN(Number(dialog.color3.text)) ? 0 : Number(dialog.color3.text);
    var color4 = isNaN(Number(dialog.color4.text)) ? 0 : Number(dialog.color4.text);

    var vertical = '', horizontal = '';

    if (dialog.vertical.color1.value) {
        vertical = dialog.vertical.color1.text;
    }
    else if (dialog.vertical.color2.value) {
        vertical = dialog.vertical.color2.text;
    }
    else if (dialog.vertical.color3.value) {
        vertical = dialog.vertical.color3.text;
    }
    else if (dialog.vertical.color4.value) {
        vertical = dialog.vertical.color4.text;
    }

    if (dialog.horizontal.color1.value) {
        horizontal = dialog.horizontal.color1.text;
    }
    else if (dialog.horizontal.color2.value) {
        horizontal = dialog.horizontal.color2.text;
    }
    else if (dialog.horizontal.color3.value) {
        horizontal = dialog.horizontal.color3.text;
    }
    else if (dialog.horizontal.color4.value) {
        horizontal = dialog.horizontal.color4.text;
    }

    var step = isNaN(Number(dialog.step.text)) ? 0 : Number(dialog.step.text);

    var artboard = {
        width: isNaN(Number(dialog.artboard.width.text)) ? 0 : Number(dialog.artboard.width.text),
        height: isNaN(Number(dialog.artboard.height.text)) ? 0 : Number(dialog.artboard.height.text)
    };

    var chip = {
        width: isNaN(Number(dialog.chip.width.text)) ? 0 : Number(dialog.chip.width.text),
        height: isNaN(Number(dialog.chip.height.text)) ? 0 : Number(dialog.chip.height.text)
    };

    var unit = dialog.unit.selection.toString();

    return {
        mode: dialog.mode,
        color: {
            color1: color1,
            color2: color2,
            color3: color3,
            color4: color4
        },
        vertical: vertical,
        horizontal: horizontal,
        step: {
            x: step,
            y: step,
        },
        artboard: {
            width: getUnit(artboard.width + unit, 'pt'),
            height: getUnit(artboard.height + unit, 'pt')
        },
        chip: {
            width: getUnit(chip.width + unit, 'pt'),
            height: getUnit(chip.height + unit, 'pt')
        },
        unit: unit
    };
}


function getColorItem(item) {
    var mode = app.activeDocument.documentColorSpace;
    return {
        color: {
            color1: (mode == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.cyan) : Math.round(item.fillColor.red),
            color2: (mode == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.magenta) : Math.round(item.fillColor.green),
            color3: (mode == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.yellow) : Math.round(item.fillColor.blue),
            color4: (mode == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.black) : 0
        },
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height
    };
}


function createColorChart(config, item) {
    var margin = {
        x: getUnit('2mm', 'pt'),
        y: getUnit('4mm', 'pt')
    };

    // Number of chips to create
    var count = {
        x: Math.floor((config.artboard.width / 2 - config.chip.width / 2) / (config.chip.width + margin.x)),
        y: Math.floor((config.artboard.height / 2 - config.chip.height / 2) / (config.chip.height + margin.y))
    };

    var baseItem = getColorItem(item);
    var colorItem, start;

    // 1st quadrant
    colorItem = getColorItem(item);
    start = 0;
    createQuadrant(config, colorItem, baseItem, start, count, margin);

    // 3rd quadrant
    colorItem = getColorItem(item);
    colorItem.width *= -1;
    colorItem.height *= -1;
    config.step.x *= -1;
    config.step.y *= -1;
    margin.x *= -1;
    margin.y *= -1;
    createQuadrant(config, colorItem, baseItem, start, count, margin);

    // 2nd quadrant
    colorItem = getColorItem(item);
    colorItem.width *= -1;
    config.step.y *= -1;
    margin.y *= -1;
    start = 1;
    createQuadrant(config, colorItem, baseItem, start, count, margin);

    // 4th quadrant
    colorItem = getColorItem(item);
    colorItem.height *= -1;
    config.step.x *= -1;
    config.step.y *= -1;
    margin.x *= -1;
    margin.y *= -1;
    createQuadrant(config, colorItem, baseItem, start, count, margin);
}


function createQuadrant(config, item, base, start, count, margin) {
    for (var i = start; i <= count.y; i++) {
        if (i > 0) {
            switch (config.vertical) {
                case 'C':
                    item.color.color1 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'M':
                    item.color.color2 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'Y':
                    item.color.color3 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'K':
                    item.color.color4 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'R':
                    item.color.color1 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'G':
                    item.color.color2 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
                case 'B':
                    item.color.color3 += config.step.y * ((config.vertical == config.horizontal) ? i : 1);
                    break;
            }
            item.top = base.top + ((item.height + margin.y) * i);
        }

        for (var j = start; j <= count.x; j++) {
            if (j > 0) {
                switch (config.horizontal) {
                    case 'C':
                        item.color.color1 += config.step.x;
                        break;
                    case 'M':
                        item.color.color2 += config.step.x;
                        break;
                    case 'Y':
                        item.color.color3 += config.step.x;
                        break;
                    case 'K':
                        item.color.color4 += config.step.x;
                        break;
                    case 'R':
                        item.color.color1 += config.step.x;
                        break;
                    case 'G':
                        item.color.color2 += config.step.x;
                        break;
                    case 'B':
                        item.color.color3 += config.step.x;
                        break;
                }
            }

            if (i == 0 && j == 0) {
                // Do not create the same color as the reference color object.
            }
            else {
                item.left = base.left + ((item.width + margin.x) * j);
                var chip = createColorChip(config.mode, item.color, item);
                showColorName(config.mode, chip, config.chip.width);
            }
        }

        switch (config.horizontal) {
            case 'C':
                item.color.color1 = base.color.color1;
                break;
            case 'M':
                item.color.color2 = base.color.color2;
                break;
            case 'Y':
                item.color.color3 = base.color.color3;
                break;
            case 'K':
                item.color.color4 = base.color.color4;
                break;
            case 'R':
                item.color.color1 = base.color.color1;
                break;
            case 'G':
                item.color.color2 = base.color.color2;
                break;
            case 'B':
                item.color.color3 = base.color.color3;
                break;
        }
    }
}


function createColorChip(mode, color, item) {
    var chip = app.activeDocument.activeLayer.pathItems.rectangle(0, 0, item.width, item.height);
    chip.top = item.top;
    chip.left = item.left;
    chip.filled = true;
    chip.stroked = false;

    if (mode == 'CMYK') {
        chip.fillColor = setCMYK(color.color1, color.color2, color.color3, color.color4);
    }
    else {
        chip.fillColor = setRGB(color.color1, color.color2, color.color3);
    }

    return chip;
}


function showColorName(mode, item, size) {
    var color1 = (mode == 'CMYK') ? Math.round(item.fillColor.cyan) : Math.round(item.fillColor.red);
    var color2 = (mode == 'CMYK') ? Math.round(item.fillColor.magenta) : Math.round(item.fillColor.green);
    var color3 = (mode == 'CMYK') ? Math.round(item.fillColor.yellow) : Math.round(item.fillColor.blue);
    var color4 = (mode == 'CMYK') ? Math.round(item.fillColor.black) : 0;

    var margin = 2;
    var text = app.activeDocument.activeLayer.textFrames.pointText([item.left, item.top + margin]);
    var attributes = text.textRange.characterAttributes;
    attributes.size = 8;
    if (text.width > size) attributes.horizontalScale = 70;

    if (mode == 'CMYK') {
        if (color1 > 0) text.contents += 'C' + color1 + ' ';
        if (color2 > 0) text.contents += 'M' + color2 + ' ';
        if (color3 > 0) text.contents += 'Y' + color3 + ' ';
        if (color4 > 0) text.contents += 'K' + color4 + ' ';
    }
    else {
        if (color1 > 0) text.contents += 'R' + color1 + ' ';
        if (color2 > 0) text.contents += 'G' + color2 + ' ';
        if (color3 > 0) text.contents += 'B' + color3 + ' ';
    }
}


function getCenterPosition(width, height) {
    var rect = app.activeDocument.artboards[0].artboardRect;
    var artboard = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0, center: { x: 0, y: 0 } };
    artboard.x1 = rect[0];
    artboard.y1 = rect[1];
    artboard.x2 = rect[2];
    artboard.y2 = rect[3];
    artboard.width = artboard.x2 - artboard.x1;
    artboard.height = artboard.y1 - artboard.y2;
    artboard.center.x = artboard.x1 + artboard.width / 2;
    artboard.center.y = artboard.y1 - artboard.height / 2;

    return {
        top: artboard.center.y + Math.abs(height / 2),
        left: artboard.center.x - Math.abs(width / 2),
        width: width,
        height: height
    };
}


function getTargetItemColor(items) {
    var value1 = 0, value2 = 0, value3 = 0, value4 = 0;
    if (items.length > 0) {
        try {
            var color;
            if (items[0].typename == 'PathItem') {
                if (items[0].filled) {
                    color = items[0].fillColor;
                }
                else if (items[0].stroked) {
                    color = items[0].strokeColor;
                }
            }
            else if (items[0].typename == 'TextFrame') {
                var attributes = items[0].textRange.characterAttributes;
                if (attributes.fillColor.typename != 'NoColor') {
                    color = attributes.fillColor;
                }
                else if (attributes.strokeColor.typename != 'NoColor') {
                    color = attributes.strokeColor;
                }
            }

            switch (app.activeDocument.documentColorSpace) {
                case DocumentColorSpace.CMYK:
                    value1 = Math.round(color.cyan);
                    value2 = Math.round(color.magenta);
                    value3 = Math.round(color.yellow);
                    value4 = Math.round(color.black);
                    break;
                case DocumentColorSpace.RGB:
                    value1 = Math.round(color.red);
                    value2 = Math.round(color.green);
                    value3 = Math.round(color.blue);
                    break;
            }
        }
        catch (err) { }
    }
    return { color1: value1, color2: value2, color3: value3, color4: value4 };
}


function setCMYK(c, m, y, k) {
    var cyan = c;
    var magenta = m;
    var yellow = y;
    var black = k;

    if (cyan > 100) {
        cyan = 100;
    }
    else if (cyan < 0) {
        cyan = 0;
    }

    if (magenta > 100) {
        magenta = 100;
    }
    else if (magenta < 0) {
        magenta = 0;
    }

    if (yellow > 100) {
        yellow = 100;
    }
    else if (yellow < 0) {
        yellow = 0;
    }

    if (black > 100) {
        black = 100;
    }
    else if (black < 0) {
        black = 0;
    }

    var color = new CMYKColor();
    color.cyan = cyan;
    color.magenta = magenta;
    color.yellow = yellow;
    color.black = black;
    return color;
}


function setRGB(r, g, b) {
    var red = r;
    var green = g;
    var blue = b;

    if (red > 255) {
        red = 255;
    }
    else if (red < 0) {
        red = 0;
    }

    if (green > 255) {
        green = 255;
    }
    else if (green < 0) {
        green = 0;
    }

    if (blue > 255) {
        blue = 255;
    }
    else if (blue < 0) {
        blue = 0;
    }

    var color = new RGBColor();
    color.red = red;
    color.green = green;
    color.blue = blue;
    return color;
}


function createNewDocument(mode, unit, width, height) {
    var preset = new DocumentPreset();
    preset.title = 'Color Chart';
    preset.width = width;
    preset.height = height;
    preset.units = getRulerUnits(unit);
    preset.colorMode = (mode == 'CMYK') ? DocumentColorSpace.CMYK : DocumentColorSpace.RGB;
    return app.documents.addDocument('Color Chart', preset);
}


function getRulerUnits(unit) {
    switch (unit) {
        case 'mm':
            return RulerUnits.Millimeters;
        case 'cm':
            return RulerUnits.Centimeters;
        case 'inch':
            return RulerUnits.Inches;
        case 'pt':
            return RulerUnits.Points;
        case 'px':
            return RulerUnits.Pixels;
        default:
            return RulerUnits.Millimeters;
    }
}


function getInitialValues(unit) {
    switch (unit) {
        case RulerUnits.Millimeters:
            return {
                artboard: { width: 210, height: 297 },
                chip: { width: 20, height: 20 },
                unit: 0
            };
        case RulerUnits.Centimeters:
            return {
                artboard: { width: 21, height: 29.7 },
                chip: { width: 2, height: 2 },
                unit: 1
            };
        case RulerUnits.Inches:
            return {
                artboard: { width: 8.27, height: 11.69 },
                chip: { width: 0.79, height: 0.79 },
                unit: 2
            };
        case RulerUnits.Points:
            return {
                artboard: { width: 595, height: 842 },
                chip: { width: 57, height: 57 },
                unit: 3
            };
        case RulerUnits.Pixels:
            return {
                artboard: { width: 595, height: 842 },
                chip: { width: 57, height: 57 },
                unit: 4
            };
        default:
            return {
                artboard: { width: 210, height: 297 },
                chip: { width: 20, height: 20 },
                unit: 0
            };
    }
}


function getUnit(value, unit) {
    try {
        return Number(UnitValue(value).as(unit));
    }
    catch (err) {
        return Number(UnitValue('1pt').as('pt'));
    }
}


function validTest(config) {
    var message;
    var color = config.color.color1 + config.color.color2 + config.color.color3 + config.color.color4;

    if (color < 1) {
        message = {
            en_US: 'Enter a color value.',
            ja_JP: 'カラー数値を入力してください。'
        };
    }

    if (config.vertical == '') {
        message = {
            en_US: 'Select a vertical direction.',
            ja_JP: '上下方向を選択してください。'
        };
    }

    if (config.horizontal == '') {
        message = {
            en_US: 'Select a horizontal direction.',
            ja_JP: '左右方向を選択してください。'
        };
    }

    if (config.step.x < 1 && config.step.y < 1) {
        message = {
            en_US: 'Enter a step value.',
            ja_JP: '階調を入力してください。'
        };
    }

    if (config.artboard.width < 1 && config.artboard.height < 1) {
        message = {
            en_US: 'Enter a artboard size.',
            ja_JP: 'アートボードサイズを入力してください。'
        };
    }

    if (config.chip.width < 1 && config.chip.height < 1) {
        message = {
            en_US: 'Enter a chip size.',
            ja_JP: 'チップサイズを入力してください。'
        };
    }

    if (message) {
        alert(message[app.locale] || message.en_US);
        return false;
    }
    else {
        return true;
    }
}


function localize() {
    var language = {
        en_US: {
            title: 'Color Chart',
            mode: 'Mode',
            color: 'Target Color',
            orientation: 'Orientation',
            vertical: 'Vertical :',
            horizontal: 'Horizontal :',
            tip: {
                vertical: 'Select a color to increase or decrease \rin the vertical direction.',
                horizontal: 'Select a color to increase or decrease \rin the horizontal direction.'
            },
            step: 'Steps :',
            option: 'Options',
            artboard: 'Artboard :',
            chip: 'Chip :',
            unit: 'Unit :',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'カラーチャート',
            mode: 'カラーモード',
            color: '基準カラー',
            orientation: '方向',
            vertical: '垂直方向 :',
            horizontal: '水平方向 :',
            tip: {
                vertical: '垂直方向に増減させる色を\r選択してください。',
                horizontal: '水平方向に増減させる色を\r選択してください。'
            },
            step: '増減 :',
            option: 'オプション',
            artboard: 'アートボード :',
            chip: 'チップ :',
            unit: '単位 :',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };

    return language[app.locale] || language.en_US;
}


function showDialog(item) {
    var local = localize();
    var initial = getInitialValues(app.activeDocument.rulerUnits);

    var mode = app.activeDocument.documentColorSpace;
    var maxvalue = (mode == DocumentColorSpace.CMYK) ? 100 : 255;

    var dialog = new Window('dialog');
    dialog.text = local.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = local.mode;
    panel1.preferredSize.width = 340;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 6, 0, 0];

    var radiobutton1 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = 'CMYK';
    radiobutton1.value = (mode == DocumentColorSpace.CMYK) ? true : false;

    var radiobutton2 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = 'RGB';
    radiobutton2.value = (mode == DocumentColorSpace.RGB) ? true : false;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var panel2 = group3.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = local.color;
    panel2.preferredSize.width = 340;
    panel2.orientation = 'column';
    panel2.alignChildren = ['right', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group4 = panel2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var group5 = group4.add('group', undefined, { name: 'group5' });
    group5.preferredSize.width = 14;
    group5.orientation = 'row';
    group5.alignChildren = ['center', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var statictext1 = group5.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = 'C';
    statictext1.justify = 'center';
    statictext1.preferredSize.width = 15;

    var slider1 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = maxvalue;
    slider1.value = item.color1;
    slider1.preferredSize.width = 215;

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = item.color1;
    edittext1.preferredSize.width = 45;
    edittext1.preferredSize.height = 20;

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = '%';

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.preferredSize.width = 14;
    group7.orientation = 'row';
    group7.alignChildren = ['center', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext3 = group7.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = 'M';
    statictext3.justify = 'center';
    statictext3.preferredSize.width = 15;

    var slider2 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = maxvalue;
    slider2.value = item.color2;
    slider2.preferredSize.width = 215;

    var edittext2 = group6.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = item.color2;
    edittext2.preferredSize.width = 45;
    edittext2.preferredSize.height = 20;

    var statictext4 = group6.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = '%';

    var group8 = panel2.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var group9 = group8.add('group', undefined, { name: 'group9' });
    group9.preferredSize.width = 14;
    group9.orientation = 'row';
    group9.alignChildren = ['center', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var statictext5 = group9.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = 'Y';
    statictext5.justify = 'center';
    statictext5.preferredSize.width = 15;

    var slider3 = group8.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = maxvalue;
    slider3.value = item.color3;
    slider3.preferredSize.width = 215;

    var edittext3 = group8.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = item.color3;
    edittext3.preferredSize.width = 45;
    edittext3.preferredSize.height = 20;

    var statictext6 = group8.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = '%';

    var group10 = panel2.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var group11 = group10.add('group', undefined, { name: 'group11' });
    group11.preferredSize.width = 14;
    group11.orientation = 'row';
    group11.alignChildren = ['center', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var statictext7 = group11.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = 'K';
    statictext7.justify = 'center';
    statictext7.preferredSize.width = 15;

    var slider4 = group10.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = maxvalue;
    slider4.value = item.color4;
    slider4.preferredSize.width = 215;

    var edittext4 = group10.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = item.color4;
    edittext4.preferredSize.width = 45;
    edittext4.preferredSize.height = 20;

    var statictext8 = group10.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = '%';

    var group12 = dialog.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var panel3 = group12.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = local.orientation;
    panel3.preferredSize.width = 340;
    panel3.orientation = 'row';
    panel3.alignChildren = ['left', 'fill'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group13 = panel3.add('group', undefined, { name: 'group13' });
    group13.orientation = 'column';
    group13.alignChildren = ['right', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var group14 = group13.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = [0, 8, 0, 0];

    var statictext9 = group14.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = local.vertical;
    statictext9.helpTip = local.tip.vertical;

    var group15 = group13.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['left', 'center'];
    group15.spacing = 10;
    group15.margins = [0, 7, 0, 0];

    var statictext10 = group15.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = local.horizontal;
    statictext10.helpTip = local.tip.horizontal;

    var group16 = group13.add('group', undefined, { name: 'group16' });
    group16.orientation = 'row';
    group16.alignChildren = ['left', 'center'];
    group16.spacing = 10;
    group16.margins = [0, 7, 0, 0];

    var statictext11 = group16.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = local.step;

    var group17 = panel3.add('group', undefined, { name: 'group17' });
    group17.orientation = 'column';
    group17.alignChildren = ['left', 'center'];
    group17.spacing = 10;
    group17.margins = [0, 10, 0, 0];

    var group18 = group17.add('group', undefined, { name: 'group18' });
    group18.orientation = 'row';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 10;
    group18.margins = 0;

    var radiobutton3 = group18.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = 'C';
    radiobutton3.preferredSize.width = 40;

    var radiobutton4 = group18.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = 'M';
    radiobutton4.preferredSize.width = 40;

    var radiobutton5 = group18.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = 'Y';
    radiobutton5.preferredSize.width = 40;

    var radiobutton6 = group18.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = 'K';
    radiobutton6.preferredSize.width = 40;

    var group19 = group17.add('group', undefined, { name: 'group19' });
    group19.orientation = 'row';
    group19.alignChildren = ['left', 'center'];
    group19.spacing = 10;
    group19.margins = [0, 3, 0, 0];

    var radiobutton7 = group19.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    radiobutton7.text = 'C';
    radiobutton7.preferredSize.width = 40;

    var radiobutton8 = group19.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    radiobutton8.text = 'M';
    radiobutton8.preferredSize.width = 40;

    var radiobutton9 = group19.add('radiobutton', undefined, undefined, { name: 'radiobutton9' });
    radiobutton9.text = 'Y';
    radiobutton9.preferredSize.width = 40;

    var radiobutton10 = group19.add('radiobutton', undefined, undefined, { name: 'radiobutton10' });
    radiobutton10.text = 'K';
    radiobutton10.preferredSize.width = 40;

    var group20 = group17.add('group', undefined, { name: 'group20' });
    group20.orientation = 'row';
    group20.alignChildren = ['left', 'center'];
    group20.spacing = 10;
    group20.margins = 0;

    var edittext5 = group20.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '5';
    edittext5.preferredSize.width = 45;
    edittext5.preferredSize.height = 20;

    var statictext12 = group20.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = '%';

    var group21 = dialog.add('group', undefined, { name: 'group21' });
    group21.orientation = 'row';
    group21.alignChildren = ['left', 'center'];
    group21.spacing = 10;
    group21.margins = 0;

    var panel4 = group21.add('panel', undefined, undefined, { name: 'panel4' });
    panel4.text = local.option;
    panel4.preferredSize.width = 340;
    panel4.orientation = 'row';
    panel4.alignChildren = ['left', 'fill'];
    panel4.spacing = 10;
    panel4.margins = 10;

    var group22 = panel4.add('group', undefined, { name: 'group22' });
    group22.orientation = 'column';
    group22.alignChildren = ['right', 'center'];
    group22.spacing = 10;
    group22.margins = 0;

    var group23 = group22.add('group', undefined, { name: 'group23' });
    group23.orientation = 'row';
    group23.alignChildren = ['left', 'center'];
    group23.spacing = 10;
    group23.margins = [0, 9, 0, 0];

    var statictext13 = group23.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = local.artboard;

    var group24 = group22.add('group', undefined, { name: 'group24' });
    group24.orientation = 'row';
    group24.alignChildren = ['left', 'center'];
    group24.spacing = 10;
    group24.margins = [0, 6, 0, 0];

    var statictext14 = group24.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = local.chip;

    var group25 = group22.add('group', undefined, { name: 'group25' });
    group25.orientation = 'row';
    group25.alignChildren = ['left', 'center'];
    group25.spacing = 10;
    group25.margins = [0, 10, 0, 0];

    var statictext15 = group25.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = local.unit;

    var group26 = panel4.add('group', undefined, { name: 'group26' });
    group26.orientation = 'column';
    group26.alignChildren = ['left', 'center'];
    group26.spacing = 10;
    group26.margins = [0, 10, 0, 0];

    var group27 = group26.add('group', undefined, { name: 'group27' });
    group27.orientation = 'row';
    group27.alignChildren = ['left', 'center'];
    group27.spacing = 10;
    group27.margins = 0;

    var statictext16 = group27.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = 'W :';

    var edittext6 = group27.add('edittext', undefined, undefined, { name: 'edittext6' });
    edittext6.text = initial.artboard.width;
    edittext6.preferredSize.width = 60;
    edittext6.preferredSize.height = 20;

    var statictext17 = group27.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = 'H :';

    var edittext7 = group27.add('edittext', undefined, undefined, { name: 'edittext7' });
    edittext7.text = initial.artboard.height;
    edittext7.preferredSize.width = 60;
    edittext7.preferredSize.height = 20;

    var group28 = group26.add('group', undefined, { name: 'group28' });
    group28.orientation = 'row';
    group28.alignChildren = ['left', 'center'];
    group28.spacing = 10;
    group28.margins = 0;

    var statictext18 = group28.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = 'W :';

    var edittext8 = group28.add('edittext', undefined, undefined, { name: 'edittext8' });
    edittext8.text = initial.chip.width;
    edittext8.preferredSize.width = 60;
    edittext8.preferredSize.height = 20;

    var statictext19 = group28.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = 'H :';

    var edittext9 = group28.add('edittext', undefined, undefined, { name: 'edittext9' });
    edittext9.text = initial.chip.height;
    edittext9.preferredSize.width = 60;
    edittext9.preferredSize.height = 20;

    var group29 = group26.add('group', undefined, { name: 'group29' });
    group29.orientation = 'row';
    group29.alignChildren = ['left', 'center'];
    group29.spacing = 10;
    group29.margins = 0;

    var units = ['mm', 'cm', 'inch', 'pt', 'px'];
    var dropdown1 = group29.add('dropdownlist', undefined, undefined, { name: 'dropdown1', items: units });
    dropdown1.selection = initial.unit;
    dropdown1.preferredSize.width = 60;
    dropdown1.preferredSize.height = 20;

    var group30 = dialog.add('group', undefined, { name: 'group30' });
    group30.preferredSize.width = 340;
    group30.orientation = 'row';
    group30.alignChildren = ['right', 'center'];
    group30.spacing = 10;
    group30.margins = 0;

    var button1 = group30.add('button', undefined, undefined, { name: 'button1' });
    button1.text = local.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 30;

    var button2 = group30.add('button', undefined, undefined, { name: 'button2' });
    button2.text = local.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 30;



    switch (mode) {
        case DocumentColorSpace.CMYK:
            radiobutton1.value = true;
            statictext1.text = 'C';
            statictext3.text = 'M';
            statictext5.text = 'Y';
            statictext7.text = 'K';
            radiobutton3.text = 'C';
            radiobutton4.text = 'M';
            radiobutton5.text = 'Y';
            radiobutton7.text = 'C';
            radiobutton8.text = 'M';
            radiobutton9.text = 'Y';
            break;
        case DocumentColorSpace.RGB:
            radiobutton2.value = true;
            statictext1.text = 'R';
            statictext3.text = 'G';
            statictext5.text = 'B';
            statictext7.text = 'K';
            radiobutton3.text = 'R';
            radiobutton4.text = 'G';
            radiobutton5.text = 'B';
            radiobutton7.text = 'R';
            radiobutton8.text = 'G';
            radiobutton9.text = 'B';
            group10.visible = false;
            radiobutton6.visible = false;
            radiobutton10.visible = false;
            break;
    }



    radiobutton1.onClick = function() {
        statictext1.text = 'C';
        statictext3.text = 'M';
        statictext5.text = 'Y';
        statictext7.text = 'K';
        radiobutton3.text = 'C';
        radiobutton4.text = 'M';
        radiobutton5.text = 'Y';
        radiobutton7.text = 'C';
        radiobutton8.text = 'M';
        radiobutton9.text = 'Y';
        group10.visible = true;
        radiobutton6.visible = true;
        radiobutton10.visible = true;
        maxvalue = 100;
        slider1.maxvalue = maxvalue;
        slider2.maxvalue = maxvalue;
        slider3.maxvalue = maxvalue;
        slider4.maxvalue = maxvalue;
    }

    radiobutton2.onClick = function() {
        statictext1.text = 'R';
        statictext3.text = 'G';
        statictext5.text = 'B';
        statictext7.text = 'K';
        radiobutton3.text = 'R';
        radiobutton4.text = 'G';
        radiobutton5.text = 'B';
        radiobutton7.text = 'R';
        radiobutton8.text = 'G';
        radiobutton9.text = 'B';
        group10.visible = false;
        radiobutton6.visible = false;
        radiobutton10.visible = false;
        maxvalue = 255;
        slider1.maxvalue = maxvalue;
        slider2.maxvalue = maxvalue;
        slider3.maxvalue = maxvalue;
        slider4.maxvalue = maxvalue;
    }

    dropdown1.onChange = function() {
        var unit = getRulerUnits(dropdown1.selection.toString());
        initial = getInitialValues(unit);
        edittext6.text = initial.artboard.width;
        edittext7.text = initial.artboard.height;
        edittext8.text = initial.chip.width;
        edittext9.text = initial.chip.height;
        dropdown1.selection = initial.unit;
    }


    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext3.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext5.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext7.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    statictext11.addEventListener('click', function() {
        edittext5.active = false;
        edittext5.active = true;
    });

    statictext16.addEventListener('click', function() {
        edittext6.active = false;
        edittext6.active = true;
    });

    statictext17.addEventListener('click', function() {
        edittext7.active = false;
        edittext7.active = true;
    });

    statictext18.addEventListener('click', function() {
        edittext8.active = false;
        edittext8.active = true;
    });

    statictext19.addEventListener('click', function() {
        edittext9.active = false;
        edittext9.active = true;
    });


    edittext1.onChange = function() {
        slider1.value = Number(edittext1.text);
    }

    edittext2.onChange = function() {
        slider2.value = Number(edittext2.text);
    }

    edittext3.onChange = function() {
        slider3.value = Number(edittext3.text);
    }

    edittext4.onChange = function() {
        slider4.value = Number(edittext4.text);
    }


    slider1.onChanging = function() {
        edittext1.text = Math.round(slider1.value);
    }

    slider2.onChanging = function() {
        edittext2.text = Math.round(slider2.value);
    }

    slider3.onChanging = function() {
        edittext3.text = Math.round(slider3.value);
    }

    slider4.onChanging = function() {
        edittext4.text = Math.round(slider4.value);
    }


    button1.onClick = function() {
        dialog.close();
    }


    dialog.mode = (radiobutton1.value) ? 'CMYK' : 'RGB';
    dialog.color1 = edittext1;
    dialog.color2 = edittext2;
    dialog.color3 = edittext3;
    dialog.color4 = edittext4;

    dialog.vertical = {
        color1: radiobutton3,
        color2: radiobutton4,
        color3: radiobutton5,
        color4: radiobutton6
    };
    dialog.horizontal = {
        color1: radiobutton7,
        color2: radiobutton8,
        color3: radiobutton9,
        color4: radiobutton10
    };

    dialog.step = edittext5;

    dialog.artboard = {
        width: edittext6,
        height: edittext7
    };
    dialog.chip = {
        width: edittext8,
        height: edittext9
    };
    dialog.unit = dropdown1;
    dialog.ok = button2;

    return dialog;
}
