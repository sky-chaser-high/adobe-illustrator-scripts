/* ===============================================================================================================================================
   createColorChart

   Description
   This script create a color chart.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select either CMYK or RGB, enter the color values.
      If an object is selected, the fill value of the object will be used as the initial value.
   3. Select the color you want to increase or decrease with vertical, or horizontal.
   4. Enter the increase or decrease value.
      Enter the percentage to be increased or decreased.
   5. Set the artboard size, chip size, and units according to your preference.

   Notes
   For CMYK, K cannot be increased or decreased.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0
   =============================================================================================================================================== */

(function() {
    main();
})();


function main() {
    var dialog = showDialog();
    dialog.buttons.ok.onClick = function() {

        var config = getConfiguration(dialog);

        if (validTest(config)) {
            createNewDocument(config.mode, config.unit, config.artboard.width, config.artboard.height);

            // var layer;
            // var name = 'Color Chart';

            // if (existLayer(name)) {
            //     layer = app.activeDocument.layers[name];
            //     layer.locked = false;
            //     layer.visible = true;
            // }
            // else {
            //     layer = createLayer(name);
            // }

            var points = getCenterPosition(config.chip.width, config.chip.height);

            // target color
            var chip = createColorChip(config.mode, config.color, points);
            showColorName(config.mode, chip, config.chip.width);

            createColorChart(config, chip);

            dialog.close();
        }
    }

    dialog.buttons.cancel.onClick = function() {
        dialog.close();
    }

    dialog.center();
    dialog.show();
}


function getConfiguration(dialog) {
    var cyan, magenta, yellow, black, red, green, blue;
    var mode, vertical = '', horizontal = '', step;
    var artboard = { width: 0, height: 0 };
    var chip = { width: 0, height: 0 };

    var unit = getUnit(dialog.option.input.group.unit.list.selection.toString());

    if (dialog.color.mode.radios.cmyk.value) {
        mode = 'cmyk';
    }
    else if (dialog.color.mode.radios.rgb.value) {
        mode = 'rgb';
    }

    cyan = isNaN(Number(dialog.color.cmyk.cyan.input.text)) ? 0 : Number(dialog.color.cmyk.cyan.input.text);
    magenta = isNaN(Number(dialog.color.cmyk.magenta.input.text)) ? 0 : Number(dialog.color.cmyk.magenta.input.text);
    yellow = isNaN(Number(dialog.color.cmyk.yellow.input.text)) ? 0 : Number(dialog.color.cmyk.yellow.input.text);
    black = isNaN(Number(dialog.color.cmyk.black.input.text)) ? 0 : Number(dialog.color.cmyk.black.input.text);
    red = isNaN(Number(dialog.color.rgb.red.input.text)) ? 0 : Number(dialog.color.rgb.red.input.text);
    green = isNaN(Number(dialog.color.rgb.green.input.text)) ? 0 : Number(dialog.color.rgb.green.input.text);
    blue = isNaN(Number(dialog.color.rgb.blue.input.text)) ? 0 : Number(dialog.color.rgb.blue.input.text);

    if (dialog.config.content.title.vertical.cmyk.cyan.value) {
        vertical = 'cyan';
    }
    else if (dialog.config.content.title.vertical.cmyk.magenta.value) {
        vertical = 'magenta';
    }
    else if (dialog.config.content.title.vertical.cmyk.yellow.value) {
        vertical = 'yellow';
    }
    else if (dialog.config.content.title.vertical.rgb.red.value) {
        vertical = 'red';
    }
    else if (dialog.config.content.title.vertical.rgb.green.value) {
        vertical = 'green';
    }
    else if (dialog.config.content.title.vertical.rgb.blue.value) {
        vertical = 'blue';
    }

    if (dialog.config.content.title.horizontal.cmyk.cyan.value) {
        horizontal = 'cyan';
    }
    else if (dialog.config.content.title.horizontal.cmyk.magenta.value) {
        horizontal = 'magenta';
    }
    else if (dialog.config.content.title.horizontal.cmyk.yellow.value) {
        horizontal = 'yellow';
    }
    else if (dialog.config.content.title.horizontal.rgb.red.value) {
        horizontal = 'red';
    }
    else if (dialog.config.content.title.horizontal.rgb.green.value) {
        horizontal = 'green';
    }
    else if (dialog.config.content.title.horizontal.rgb.blue.value) {
        horizontal = 'blue';
    }

    step = isNaN(Number(dialog.config.content.title.step.input.text)) ? 0 : Number(dialog.config.content.title.step.input.text);

    artboard.width = isNaN(Number(dialog.option.input.group.artboard.width.text)) ? 0 : Number(dialog.option.input.group.artboard.width.text);
    artboard.height = isNaN(Number(dialog.option.input.group.artboard.height.text)) ? 0 : Number(dialog.option.input.group.artboard.height.text);

    chip.width = isNaN(Number(dialog.option.input.group.chip.width.text)) ? 0 : Number(dialog.option.input.group.chip.width.text);
    chip.height = isNaN(Number(dialog.option.input.group.chip.height.text)) ? 0 : Number(dialog.option.input.group.chip.height.text);

    return {
        mode: mode,
        color: {
            cmyk: {
                cyan: cyan,
                magenta: magenta,
                yellow: yellow,
                black: black
            },
            rgb: {
                red: red,
                green: green,
                blue: blue
            }
        },
        vertical: vertical,
        horizontal: horizontal,
        step: {
            x: step,
            y: step,
        },
        artboard: {
            width: artboard.width * unit,
            height: artboard.height * unit
        },
        chip: {
            width: chip.width * unit,
            height: chip.height * unit
        },
        unit: dialog.option.input.group.unit.list.selection.toString()
    };
}


function getColorItem(item) {
    var colorSpace = app.activeDocument.documentColorSpace;
    return {
        color: {
            cmyk: {
                cyan: (colorSpace == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.cyan) : 0,
                magenta: (colorSpace == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.magenta) : 0,
                yellow: (colorSpace == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.yellow) : 0,
                black: (colorSpace == DocumentColorSpace.CMYK) ? Math.round(item.fillColor.black) : 0
            },
            rgb: {
                red: (colorSpace == DocumentColorSpace.RGB) ? Math.round(item.fillColor.red) : 0,
                green: (colorSpace == DocumentColorSpace.RGB) ? Math.round(item.fillColor.green) : 0,
                blue: (colorSpace == DocumentColorSpace.RGB) ? Math.round(item.fillColor.blue) : 0
            }
        },
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height
    };
}


function createColorChart(config, item) {
    var margin = {
        x: 2 * getUnit('mm'),
        y: 4 * getUnit('mm')
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
    colorItem.width = -(colorItem.width);
    colorItem.height = -(colorItem.height);
    config.step.x = -(config.step.x);
    config.step.y = -(config.step.y);
    margin.x = -(margin.x);
    margin.y = -(margin.y);
    createQuadrant(config, colorItem, baseItem, start, count, margin);

    // 2nd quadrant
    colorItem = getColorItem(item);
    colorItem.width = -(colorItem.width);
    config.step.y = -(config.step.y);
    margin.y = -(margin.y);
    start = 1;
    createQuadrant(config, colorItem, baseItem, start, count, margin);

    // 4th quadrant
    colorItem = getColorItem(item);
    colorItem.height = -(colorItem.height);
    config.step.x = -(config.step.x);
    config.step.y = -(config.step.y);
    margin.x = -(margin.x);
    margin.y = -(margin.y);
    createQuadrant(config, colorItem, baseItem, start, count, margin);
}


function createQuadrant(config, item, base, start, count, margin) {
    for (var i = start; i <= count.y; i++) {
        if (i > 0) {
            switch (config.vertical) {
                case 'cyan':
                    item.color.cmyk.cyan += config.step.y;
                    break;
                case 'magenta':
                    item.color.cmyk.magenta += config.step.y;
                    break;
                case 'yellow':
                    item.color.cmyk.yellow += config.step.y;
                    break;
                case 'red':
                    item.color.rgb.red += config.step.y;
                    break;
                case 'green':
                    item.color.rgb.green += config.step.y;
                    break;
                case 'blue':
                    item.color.rgb.blue += config.step.y;
                    break;
            }

            item.top = base.top + ((item.height + margin.y) * i);
        }

        for (var j = start; j <= count.x; j++) {
            if (j > 0) {
                switch (config.horizontal) {
                    case 'cyan':
                        item.color.cmyk.cyan += config.step.x;
                        break;
                    case 'magenta':
                        item.color.cmyk.magenta += config.step.x;
                        break;
                    case 'yellow':
                        item.color.cmyk.yellow += config.step.x;
                        break;
                    case 'red':
                        item.color.rgb.red += config.step.x;
                        break;
                    case 'green':
                        item.color.rgb.green += config.step.x;
                        break;
                    case 'blue':
                        item.color.rgb.blue += config.step.x;
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
            case 'cyan':
                item.color.cmyk.cyan = base.color.cmyk.cyan;
                break;
            case 'magenta':
                item.color.cmyk.magenta = base.color.cmyk.magenta;
                break;
            case 'yellow':
                item.color.cmyk.yellow = base.color.cmyk.yellow;
                break;
            case 'red':
                item.color.rgb.red = base.color.rgb.red;
                break;
            case 'green':
                item.color.rgb.green = base.color.rgb.green;
                break;
            case 'blue':
                item.color.rgb.blue = base.color.rgb.blue;
                break;
        }
    }
}


function createColorChip(mode, color, path) {
    var chip = app.activeDocument.activeLayer.pathItems.rectangle(path.top, path.left, path.width, path.height);
    chip.closed = true;
    chip.filled = true;
    chip.stroked = false;

    chip.top = path.top;
    chip.left = path.left;

    if (mode == 'cmyk') {
        chip.fillColor = setCMYK(color.cmyk.cyan, color.cmyk.magenta, color.cmyk.yellow, color.cmyk.black);
    }
    else {
        chip.fillColor = setRGB(color.rgb.red, color.rgb.green, color.rgb.blue);
    }

    return chip;
}


function showColorName(mode, item, size) {
    var color = {
        cmyk: {
            cyan: (mode == 'cmyk') ? Math.round(item.fillColor.cyan) : 0,
            magenta: (mode == 'cmyk') ? Math.round(item.fillColor.magenta) : 0,
            yellow: (mode == 'cmyk') ? Math.round(item.fillColor.yellow) : 0,
            black: (mode == 'cmyk') ? Math.round(item.fillColor.black) : 0
        },
        rgb: {
            red: (mode == 'rgb') ? Math.round(item.fillColor.red) : 0,
            green: (mode == 'rgb') ? Math.round(item.fillColor.green) : 0,
            blue: (mode == 'rgb') ? Math.round(item.fillColor.blue) : 0
        }
    };

    var fontsize = 8;
    var margin = 2;

    var text = app.activeDocument.activeLayer.textFrames.pointText([item.left, item.top + margin]);
    text.textRange.characterAttributes.size = fontsize;

    if (text.width > size) {
        text.textRange.characterAttributes.horizontalScale = 70;
    }

    if (mode == 'cmyk') {
        if (color.cmyk.cyan > 0) {
            text.contents += 'C' + color.cmyk.cyan + ' ';
        }
        if (color.cmyk.magenta > 0) {
            text.contents += 'M' + color.cmyk.magenta + ' ';
        }
        if (color.cmyk.yellow > 0) {
            text.contents += 'Y' + color.cmyk.yellow + ' ';
        }
        if (color.cmyk.black > 0) {
            text.contents += 'K' + color.cmyk.black + ' ';
        }
    }
    else {
        if (color.rgb.red > 0) {
            text.contents += 'R' + color.rgb.red + ' ';
        }
        if (color.rgb.green > 0) {
            text.contents += 'G' + color.rgb.green + ' ';
        }
        if (color.rgb.blue > 0) {
            text.contents += 'B' + color.rgb.blue + ' ';
        }
    }
}


function getCenterPosition(width, height) {
    var artboard = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0, center: { x: 0, y: 0 } };

    artboard.x1 = app.activeDocument.artboards[0].artboardRect[0];
    artboard.y1 = app.activeDocument.artboards[0].artboardRect[1];
    artboard.x2 = app.activeDocument.artboards[0].artboardRect[2];
    artboard.y2 = app.activeDocument.artboards[0].artboardRect[3];
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


function getTargetColor() {
    var color;
    var cyan = 0, magenta = 0, yellow = 0, black = 0, red = 0, green = 0, blue = 0;
    var items = app.activeDocument.selection;

    if (items.length > 0) {
        try {
            if (items[0].typename == 'PathItem') {
                if (items[0].filled) {
                    color = items[0].fillColor;
                }
                else if (items[0].stroked) {
                    color = items[0].strokeColor;
                }
            }
            else if (items[0].typename == 'TextFrame') {
                if (items[0].textRange.characterAttributes.fillColor.typename != 'NoColor') {
                    color = items[0].textRange.characterAttributes.fillColor;
                }
                else if (items[0].textRange.characterAttributes.strokeColor.typename != 'NoColor') {
                    color = items[0].textRange.characterAttributes.strokeColor;
                }
            }

            switch (app.activeDocument.documentColorSpace) {
                case DocumentColorSpace.CMYK:
                    cyan = Math.round(color.cyan);
                    magenta = Math.round(color.magenta);
                    yellow = Math.round(color.yellow);
                    black = Math.round(color.black);
                    break;
                case DocumentColorSpace.RGB:
                    red = Math.round(color.red);
                    green = Math.round(color.green);
                    blue = Math.round(color.blue);
                    break;
            }
        }
        catch (e) { }
    }

    return { cyan: cyan, magenta: magenta, yellow: yellow, black: black, red: red, green: green, blue: blue };
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


function setLabColor(l, a, b) {
    var L = l;
    var A = a;
    var B = b;

    if (L > 100) {
        L = 100;
    }
    else if (L < 0) {
        L = 0;
    }

    if (A > 127) {
        A = 127;
    }
    else if (A < -128) {
        A = -128;
    }

    if (B > 127) {
        B = 127;
    }
    else if (B < -128) {
        B = -128;
    }

    var lab = new LabColor();
    lab.l = L;
    lab.a = A;
    lab.b = B;
    return lab;
}


function addLabColor(color) {
    var lab = app.activeDocument.spots.add();
    lab.name = 'L=' + color.lab.l + ' A=' + color.lab.a + ' B=' + color.lab.b;
    lab.colorType = ColorModel.SPOT;
    lab.color = setLabColor(color.lab.l, color.lab.a, color.lab.b);
    return lab.color;
}


function addSwatches() {
    var color, spot;
    var cyan = 0, magenta = 0, yellow = 0, black = 0, red = 0, green = 0, blue = 0;
    var items = app.activeDocument.selection;

    for (var i = 0; i < items.length; i++) {
        try {
            if (items[i].typename == 'PathItem') {
                if (items[i].filled) {
                    color = items[i].fillColor;
                }
                else if (items[i].stroked) {
                    color = items[i].strokeColor;
                }
            }
            else if (items[i].typename == 'TextFrame') {
                if (items[i].textRange.characterAttributes.fillColor.typename != 'NoColor') {
                    color = items[i].textRange.characterAttributes.fillColor;
                }
                else if (items[i].textRange.characterAttributes.strokeColor.typename != 'NoColor') {
                    color = items[i].textRange.characterAttributes.strokeColor;
                }
            }

            spot = app.activeDocument.spots.add();
            spot.colorType = ColorModel.PROCESS;

            switch (app.activeDocument.documentColorSpace) {
                case DocumentColorSpace.CMYK:
                    cyan = Math.round(color.cyan);
                    magenta = Math.round(color.magenta);
                    yellow = Math.round(color.yellow);
                    black = Math.round(color.black);

                    spot.color = setCMYK(cyan, magenta, yellow, black);
                    spot.name = 'C=' + cyan + ' M=' + magenta + ' Y=' + yellow + ' K=' + black;
                    break;

                case DocumentColorSpace.RGB:
                    red = Math.round(color.red);
                    green = Math.round(color.green);
                    blue = Math.round(color.blue);

                    spot.color = setRGB(red, green, blue);
                    spot.name = 'R=' + red + ' G=' + green + ' B=' + blue;
                    break;
            }
        }
        catch (e) {
            spot.remove();
        }
    }
}


function removeAllSwatches() {
    try {
        app.activeDocument.swatches.removeAll();
        var swatchGroups = app.activeDocument.swatchGroups;
        for (var i = swatchGroups.length - 1; i >= 0 ; i--) {
            swatchGroups[i].remove();
        }
    }
    catch (e) { }
}


function createNewDocument(mode, unit, width, height) {
    var preset = new DocumentPreset();
    preset.title = 'Color Chart';
    preset.width = width;
    preset.height = height;
    preset.units = getRulerUnits(unit);

    if (mode == 'cmyk') {
        preset.colorMode = DocumentColorSpace.CMYK;
    }
    else {
        preset.colorMode = DocumentColorSpace.RGB;
    }

    return app.documents.addDocument('Color Chart', preset);
}


function resizeArtboard(width, height) {
    var base = app.activeDocument.pathItems[0];
    var chip = {
        left: base.left,
        top: base.top,
        width: base.width,
        height: base.height
    };

    var artboard = {
        width: width,
        height: height
    };

    var artboards = app.activeDocument.artboards;

    for (var i = 0; i < artboards.length; i++) {
        var x = chip.left + chip.width / 2 - artboard.width / 2;
        var y = chip.top - chip.height / 2 + artboard.height / 2;

        artboards[i].artboardRect = [x, y, x + artboard.width, y - artboard.height];
    }
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


function getInitialValues() {
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Millimeters :
            return {
                artboard: { width: 210, height: 297 },
                chip: { width: 20, height: 20 },
                unit: 0
            };
        case RulerUnits.Inches:
            return {
                artboard: { width: 8.27, height: 11.69 },
                chip: { width: 0.79, height: 0.79 },
                unit: 1
            };
        case RulerUnits.Points:
            return {
                artboard: { width: 595, height: 842 },
                chip: { width: 57, height: 57 },
                unit: 2
            };
        case RulerUnits.Pixels:
            return {
                artboard: { width: 595, height: 842 },
                chip: { width: 57, height: 57 },
                unit: 3
            };
        default:
            return {
                artboard: { width: 210, height: 297 },
                chip: { width: 20, height: 20 },
                unit: 0
            };
    }
}


function validTest(config) {
    var message;

    var cmyk = config.color.cmyk.cyan + config.color.cmyk.magenta + config.color.cmyk.yellow + config.color.cmyk.black;
    var rgb = config.color.rgb.red + config.color.rgb.green + config.color.rgb.blue;

    if ((config.mode == 'cmyk' && cmyk < 1) || (config.mode == 'rgb' && rgb < 1)) {
        message = {
            en_US: 'Enter a color value.',
            ja_JP: 'カラー数値を入力してください。'
        }
    }

    if (config.vertical == '') {
        message = {
            en_US: 'Select a vertical direction.',
            ja_JP: '上下方向を選択してください。'
        }
    }

    if (config.horizontal == '') {
        message = {
            en_US: 'Select a horizontal direction.',
            ja_JP: '左右方向を選択してください。'
        }
    }

    if (config.step.x < 1 && config.step.y < 1) {
        message = {
            en_US: 'Enter a step value.',
            ja_JP: '階調を入力してください。'
        }
    }

    if (config.artboard.width < 1 && config.artboard.height < 1) {
        message = {
            en_US: 'Enter a artboard size.',
            ja_JP: 'アートボードサイズを入力してください。'
        }
    }

    if (config.chip.width < 1 && config.chip.height < 1) {
        message = {
            en_US: 'Enter a chip size.',
            ja_JP: 'チップサイズを入力してください。'
        }
    }

    if (message) {
        alert(message[app.locale] || message.en_US);
        return false;
    }
    else {
        return true;
    }
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
    catch (e) {
        return false;
    }
}


function getUnit(unit) {
    if (/pt/i.test(unit)) {
        return UnitValue(1, unit);
    }
    else {
        return UnitValue(1, unit).as('pt');
    }
}


function getFont(name) {
    try {
        return app.textFonts[name];
    }
    catch (e) {
        return app.textFonts[0];
    }
}


function getLanguage() {
    var language = {
        en_US: {
            title: 'Color Chart',
            mode: 'Mode',
            vertical: 'Vertical',
            horizontal: 'Horizontal',
            tip: {
                vertical: 'Select a color to increase or decrease \rin the vertical direction.',
                horizontal: 'Select a color to increase or decrease \rin the horizontal direction.'
            },
            step: 'Step',
            option: 'Option',
            artboard: 'Artboard',
            chip: 'Chip',
            unit: 'Unit',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'カラーチャート',
            mode: 'カラーモード',
            vertical: '上下',
            horizontal: '左右',
            tip: {
                vertical: '縦方向に増減させる色を\r選択してください。',
                horizontal: '横方向に増減させる色を\r選択してください。'
            },
            step: '増減',
            option: 'オプション',
            artboard: 'アートボード',
            chip: 'チップ',
            unit: '単位',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };

    return language[app.locale] || language.en_US;
}


function showDialog() {
    var language = getLanguage();
    var target = getTargetColor();
    var initial = getInitialValues();

    var dialog = new Window('dialog', language.title, undefined);
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'fill'];

    dialog.color = dialog.add('group');
    dialog.color.orientation = 'column';
    dialog.color.alignChildren = ['right', 'fill'];


    dialog.color.mode = dialog.color.add('group');
    dialog.color.mode.orientation = 'row';
    dialog.color.mode.alignment = ['left', 'fill'];
    dialog.color.mode.margins = [0, 0, 0, 5];

    dialog.color.mode.add('statictext', undefined, language.mode + ' :');
    dialog.color.mode.radios = dialog.color.mode.add('group', undefined);
    dialog.color.mode.radios.margins = [0, 4, 0, 0];

    dialog.color.mode.radios.cmyk = dialog.color.mode.radios.add('radiobutton', undefined, 'CMYK');
    dialog.color.mode.radios.rgb = dialog.color.mode.radios.add('radiobutton', undefined, 'RGB');


    dialog.color.cmyk = dialog.color.add('group');
    dialog.color.cmyk.orientation = 'column';
    dialog.color.cmyk.alignChildren = ['right', 'fill'];

    dialog.color.cmyk.cyan = dialog.color.cmyk.add('group');
    dialog.color.cmyk.cyan.orientation = 'row';

    dialog.color.cmyk.cyan.title = dialog.color.cmyk.cyan.add('statictext', undefined, 'C');
    dialog.color.cmyk.cyan.slider = dialog.color.cmyk.cyan.add('slider', undefined, target.cyan, 0, 100);
    dialog.color.cmyk.cyan.slider.size = { width: 190, height: 20 };
    dialog.color.cmyk.cyan.input = dialog.color.cmyk.cyan.add('edittext', undefined, target.cyan);
    dialog.color.cmyk.cyan.input.size = { width: 60, height: 20 };
    dialog.color.cmyk.cyan.add('statictext', undefined, '%');

    dialog.color.cmyk.magenta = dialog.color.cmyk.add('group');
    dialog.color.cmyk.magenta.orientation = 'row';

    dialog.color.cmyk.magenta.title = dialog.color.cmyk.magenta.add('statictext', undefined, 'M');
    dialog.color.cmyk.magenta.slider = dialog.color.cmyk.magenta.add('slider', undefined, target.magenta, 0, 100);
    dialog.color.cmyk.magenta.slider.size = { width: 190, height: 20 };
    dialog.color.cmyk.magenta.input = dialog.color.cmyk.magenta.add('edittext', undefined, target.magenta);
    dialog.color.cmyk.magenta.input.size = { width: 60, height: 20 };
    dialog.color.cmyk.magenta.add('statictext', undefined, '%');

    dialog.color.cmyk.yellow = dialog.color.cmyk.add('group');
    dialog.color.cmyk.yellow.orientation = 'row';

    dialog.color.cmyk.yellow.title = dialog.color.cmyk.yellow.add('statictext', undefined, 'Y');
    dialog.color.cmyk.yellow.slider = dialog.color.cmyk.yellow.add('slider', undefined, target.yellow, 0, 100);
    dialog.color.cmyk.yellow.slider.size = { width: 190, height: 20 };
    dialog.color.cmyk.yellow.input = dialog.color.cmyk.yellow.add('edittext', undefined, target.yellow);
    dialog.color.cmyk.yellow.input.size = { width: 60, height: 20 };
    dialog.color.cmyk.yellow.add('statictext', undefined, '%');

    dialog.color.cmyk.black = dialog.color.cmyk.add('group');
    dialog.color.cmyk.black.orientation = 'row';

    dialog.color.cmyk.black.title = dialog.color.cmyk.black.add('statictext', undefined, 'K');
    dialog.color.cmyk.black.slider = dialog.color.cmyk.black.add('slider', undefined, target.black, 0, 100);
    dialog.color.cmyk.black.slider.size = { width: 190, height: 20 };
    dialog.color.cmyk.black.input = dialog.color.cmyk.black.add('edittext', undefined, target.black);
    dialog.color.cmyk.black.input.size = { width: 60, height: 20 };
    dialog.color.cmyk.black.add('statictext', undefined, '%');


    dialog.color.rgb = dialog.color.add('group');
    dialog.color.rgb.orientation = 'column';
    dialog.color.rgb.alignChildren = ['right', 'fill'];

    dialog.color.rgb.red = dialog.color.rgb.add('group');
    dialog.color.rgb.red.orientation = 'row';

    dialog.color.rgb.red.title = dialog.color.rgb.red.add('statictext', undefined, 'R');
    dialog.color.rgb.red.slider = dialog.color.rgb.red.add('slider', undefined, target.red, 0, 255);
    dialog.color.rgb.red.slider.size = { width: 190, height: 20 };
    dialog.color.rgb.red.input = dialog.color.rgb.red.add('edittext', undefined, target.red);
    dialog.color.rgb.red.input.size = { width: 60, height: 20 };
    dialog.color.rgb.red.add('statictext', undefined, '%');

    dialog.color.rgb.green = dialog.color.rgb.add('group');
    dialog.color.rgb.green.orientation = 'row';

    dialog.color.rgb.green.title = dialog.color.rgb.green.add('statictext', undefined, 'G');
    dialog.color.rgb.green.slider = dialog.color.rgb.green.add('slider', undefined, target.green, 0, 255);
    dialog.color.rgb.green.slider.size = { width: 190, height: 20 };
    dialog.color.rgb.green.input = dialog.color.rgb.green.add('edittext', undefined, target.green);
    dialog.color.rgb.green.input.size = { width: 60, height: 20 };
    dialog.color.rgb.green.add('statictext', undefined, '%');

    dialog.color.rgb.blue = dialog.color.rgb.add('group');
    dialog.color.rgb.blue.orientation = 'row';

    dialog.color.rgb.blue.title = dialog.color.rgb.blue.add('statictext', undefined, 'B');
    dialog.color.rgb.blue.slider = dialog.color.rgb.blue.add('slider', undefined, target.blue, 0, 255);
    dialog.color.rgb.blue.slider.size = { width: 190, height: 20 };
    dialog.color.rgb.blue.input = dialog.color.rgb.blue.add('edittext', undefined, target.blue);
    dialog.color.rgb.blue.input.size = { width: 60, height: 20 };
    dialog.color.rgb.blue.add('statictext', undefined, '%');


    dialog.config = dialog.add('group');
    dialog.config.orientation = 'row';
    dialog.config.alignChildren = ['fill', 'fill'];
    dialog.config.margins = [0, 15, 0, 0];

    dialog.config.axis = dialog.config.add('group');
    dialog.config.axis.orientation = 'column';
    dialog.config.axis.alignment = ['left', 'fill'];

    dialog.config.axis.title = dialog.config.axis.add('group');
    dialog.config.axis.title.orientation = 'column';
    dialog.config.axis.title.alignChildren = ['right', 'fill'];
    dialog.config.axis.title.spacing = 14;

    dialog.config.axis.title.vertical = dialog.config.axis.title.add('statictext', undefined, language.vertical + ' :');
    dialog.config.axis.title.vertical.helpTip = language.tip.vertical;
    dialog.config.axis.title.horizontal = dialog.config.axis.title.add('statictext', undefined, language.horizontal + ' :');
    dialog.config.axis.title.horizontal.helpTip = language.tip.horizontal;

    dialog.config.axis.title.step = dialog.config.axis.title.add('group');
    dialog.config.axis.title.step.margins = [0, 3, 0, 0];
    dialog.config.axis.title.step.str = dialog.config.axis.title.step.add('statictext', undefined, language.step + ' :');

    dialog.config.content = dialog.config.add('group');
    dialog.config.content.orientation = 'column';
    dialog.config.content.alignChildren = ['left', 'fill'];

    dialog.config.content.title = dialog.config.content.add('group');
    dialog.config.content.title.orientation = 'column';
    dialog.config.content.title.alignChildren = ['left', 'fill'];
    dialog.config.content.title.spacing = 11;

    dialog.config.content.title.vertical = dialog.config.content.title.add('group');
    dialog.config.content.title.vertical.orientation = 'row';

    dialog.config.content.title.vertical.cmyk = dialog.config.content.title.vertical.add('group', undefined);
    dialog.config.content.title.vertical.cmyk.cyan = dialog.config.content.title.vertical.cmyk.add('radiobutton', undefined, 'C');
    dialog.config.content.title.vertical.cmyk.magenta = dialog.config.content.title.vertical.cmyk.add('radiobutton', undefined, 'M');
    dialog.config.content.title.vertical.cmyk.yellow = dialog.config.content.title.vertical.cmyk.add('radiobutton', undefined, 'Y');

    dialog.config.content.title.vertical.rgb = dialog.config.content.title.vertical.add('group', undefined);
    dialog.config.content.title.vertical.rgb.red = dialog.config.content.title.vertical.rgb.add('radiobutton', undefined, 'R');
    dialog.config.content.title.vertical.rgb.green = dialog.config.content.title.vertical.rgb.add('radiobutton', undefined, 'G');
    dialog.config.content.title.vertical.rgb.blue = dialog.config.content.title.vertical.rgb.add('radiobutton', undefined, 'B');


    dialog.config.content.title.horizontal = dialog.config.content.title.add('group');
    dialog.config.content.title.horizontal.orientation = 'row';

    dialog.config.content.title.horizontal.cmyk = dialog.config.content.title.horizontal.add('group', undefined);
    dialog.config.content.title.horizontal.cmyk.cyan = dialog.config.content.title.horizontal.cmyk.add('radiobutton', undefined, 'C');
    dialog.config.content.title.horizontal.cmyk.magenta = dialog.config.content.title.horizontal.cmyk.add('radiobutton', undefined, 'M');
    dialog.config.content.title.horizontal.cmyk.yellow = dialog.config.content.title.horizontal.cmyk.add('radiobutton', undefined, 'Y');

    dialog.config.content.title.horizontal.rgb = dialog.config.content.title.horizontal.add('group', undefined);
    dialog.config.content.title.horizontal.rgb.red = dialog.config.content.title.horizontal.rgb.add('radiobutton', undefined, 'R');
    dialog.config.content.title.horizontal.rgb.green = dialog.config.content.title.horizontal.rgb.add('radiobutton', undefined, 'G');
    dialog.config.content.title.horizontal.rgb.blue = dialog.config.content.title.horizontal.rgb.add('radiobutton', undefined, 'B');


    if (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK) {
        dialog.color.mode.radios.cmyk.value = true;
        dialog.color.rgb.enabled = false;
        dialog.config.content.title.vertical.rgb.enabled = false;
        dialog.config.content.title.horizontal.rgb.enabled = false;
    }
    else {
        dialog.color.mode.radios.rgb.value = true;
        dialog.color.cmyk.enabled = false;
        dialog.config.content.title.vertical.cmyk.enabled = false;
        dialog.config.content.title.horizontal.cmyk.enabled = false;
    }


    dialog.config.content.title.step = dialog.config.content.title.add('group');
    dialog.config.content.title.step.orientation = 'row';
    dialog.config.content.title.step.alignment = ['left', 'fill'];
    dialog.config.content.title.step.margins = [0, 0, 0, 10];

    dialog.config.content.title.step.input = dialog.config.content.title.step.add('edittext', undefined, '5');
    dialog.config.content.title.step.input.size = { width: 40, height: 20 };
    dialog.config.content.title.step.add('statictext', undefined, '%');


    dialog.option = dialog.add('panel', undefined, language.option);
    dialog.option.orientation = 'row';
    dialog.option.alignChildren = ['fill', 'fill'];

    dialog.option.title = dialog.option.add('group');
    dialog.option.title.orientation = 'column';
    dialog.option.title.alignment = ['left', 'fill'];
    dialog.option.title.margins = [0, 10, 0, 0];

    dialog.option.title.list = dialog.option.title.add('group');
    dialog.option.title.list.orientation = 'column';
    dialog.option.title.list.alignChildren = ['right', 'fill'];
    dialog.option.title.list.spacing = (app.locale == 'ja_JP') ? 16 : 14;

    dialog.option.title.list.artboard = dialog.option.title.list.add('statictext', undefined, language.artboard + ' :');
    dialog.option.title.list.chip = dialog.option.title.list.add('statictext', undefined, language.chip + ' :');
    dialog.option.title.list.unit = dialog.option.title.list.add('statictext', undefined, language.unit + ' :');

    dialog.option.input = dialog.option.add('group');
    dialog.option.input.orientation = 'column';
    dialog.option.input.alignChildren = ['right', 'fill'];
    dialog.option.input.margins = [0, 8, 0, 0];

    dialog.option.input.group = dialog.option.input.add('group');
    dialog.option.input.group.orientation = 'column';
    dialog.option.input.group.alignChildren = ['left', 'fill'];
    dialog.option.input.group.spacing = 9;

    dialog.option.input.group.artboard = dialog.option.input.group.add('group');
    dialog.option.input.group.artboard.orientation = 'row';

    dialog.option.input.group.artboard.w = dialog.option.input.group.artboard.add('statictext', undefined, 'W :');
    dialog.option.input.group.artboard.width = dialog.option.input.group.artboard.add('edittext', undefined, initial.artboard.width);
    dialog.option.input.group.artboard.width.size = { width: 60, height: 20 };
    dialog.option.input.group.artboard.h = dialog.option.input.group.artboard.add('statictext', undefined, 'H :');
    dialog.option.input.group.artboard.height = dialog.option.input.group.artboard.add('edittext', undefined, initial.artboard.height);
    dialog.option.input.group.artboard.height.size = { width: 60, height: 20 };

    dialog.option.input.group.chip = dialog.option.input.group.add('group');
    dialog.option.input.group.chip.orientation = 'row';

    dialog.option.input.group.chip.w = dialog.option.input.group.chip.add('statictext', undefined, 'W :');
    dialog.option.input.group.chip.width = dialog.option.input.group.chip.add('edittext', undefined, initial.chip.width);
    dialog.option.input.group.chip.width.size = { width: 60, height: 20 };
    dialog.option.input.group.chip.h = dialog.option.input.group.chip.add('statictext', undefined, 'H :');
    dialog.option.input.group.chip.height = dialog.option.input.group.chip.add('edittext', undefined, initial.chip.height);
    dialog.option.input.group.chip.height.size = { width: 60, height: 20 };

    dialog.option.input.group.unit = dialog.option.input.group.add('group');
    dialog.option.input.group.unit.orientation = 'row';

    dialog.option.input.group.unit.list = dialog.option.input.group.unit.add('dropdownlist', undefined, ['mm', 'inch', 'pt', 'px']);
    dialog.option.input.group.unit.list.size = { width: 60, height: 20 };
    dialog.option.input.group.unit.list.selection = initial.unit;


    dialog.buttons = dialog.add('group');
    dialog.buttons.alignChildren = ['right', 'fill'];
    dialog.buttons.margins = [0, 10, 0, 0];

    dialog.buttons.cancel = dialog.buttons.add('button', undefined, language.cancel);
    dialog.buttons.ok = dialog.buttons.add('button', undefined, language.ok);


    dialog.color.cmyk.cyan.title.addEventListener('click', function() {
        dialog.color.cmyk.cyan.input.active = false;
        dialog.color.cmyk.cyan.input.active = true;
    });

    dialog.color.cmyk.magenta.title.addEventListener('click', function() {
        dialog.color.cmyk.magenta.input.active = false;
        dialog.color.cmyk.magenta.input.active = true;
    });

    dialog.color.cmyk.yellow.title.addEventListener('click', function() {
        dialog.color.cmyk.yellow.input.active = false;
        dialog.color.cmyk.yellow.input.active = true;
    });

    dialog.color.cmyk.black.title.addEventListener('click', function() {
        dialog.color.cmyk.black.input.active = false;
        dialog.color.cmyk.black.input.active = true;
    });

    dialog.color.rgb.red.title.addEventListener('click', function() {
        dialog.color.rgb.red.input.active = false;
        dialog.color.rgb.red.input.active = true;
    });

    dialog.color.rgb.green.title.addEventListener('click', function() {
        dialog.color.rgb.green.input.active = false;
        dialog.color.rgb.green.input.active = true;
    });

    dialog.color.rgb.blue.title.addEventListener('click', function() {
        dialog.color.rgb.blue.input.active = false;
        dialog.color.rgb.blue.input.active = true;
    });

    dialog.config.axis.title.step.str.addEventListener('click', function() {
        dialog.config.content.title.step.input.active = false;
        dialog.config.content.title.step.input.active = true;
    });

    dialog.option.input.group.artboard.w.addEventListener('click', function() {
        dialog.option.input.group.artboard.width.active = false;
        dialog.option.input.group.artboard.width.active = true;
    });

    dialog.option.input.group.artboard.h.addEventListener('click', function() {
        dialog.option.input.group.artboard.height.active = false;
        dialog.option.input.group.artboard.height.active = true;
    });

    dialog.option.input.group.chip.w.addEventListener('click', function() {
        dialog.option.input.group.chip.width.active = false;
        dialog.option.input.group.chip.width.active = true;
    });

    dialog.option.input.group.chip.h.addEventListener('click', function() {
        dialog.option.input.group.chip.height.active = false;
        dialog.option.input.group.chip.height.active = true;
    });

    dialog.color.mode.radios.cmyk.onClick = function () {
        if (dialog.color.mode.radios.cmyk.value) {
            dialog.color.cmyk.enabled = true;
            dialog.color.rgb.enabled = false;
            dialog.config.content.title.vertical.cmyk.enabled = true;
            dialog.config.content.title.vertical.rgb.enabled = false;
            dialog.config.content.title.horizontal.cmyk.enabled = true;
            dialog.config.content.title.horizontal.rgb.enabled = false;
        }
    }

    dialog.color.mode.radios.rgb.onClick = function() {
        if (dialog.color.mode.radios.rgb.value) {
            dialog.color.cmyk.enabled = false;
            dialog.color.rgb.enabled = true;
            dialog.config.content.title.vertical.cmyk.enabled = false;
            dialog.config.content.title.vertical.rgb.enabled = true;
            dialog.config.content.title.horizontal.cmyk.enabled = false;
            dialog.config.content.title.horizontal.rgb.enabled = true;
        }
    }

    dialog.color.cmyk.cyan.input.onChange = function () {
        dialog.color.cmyk.cyan.slider.value = dialog.color.cmyk.cyan.input.text;
    }

    dialog.color.cmyk.magenta.input.onChange = function () {
        dialog.color.cmyk.magenta.slider.value = dialog.color.cmyk.magenta.input.text;
    }

    dialog.color.cmyk.yellow.input.onChange = function () {
        dialog.color.cmyk.yellow.slider.value = dialog.color.cmyk.yellow.input.text;
    }

    dialog.color.cmyk.black.input.onChange = function () {
        dialog.color.cmyk.black.slider.value = dialog.color.cmyk.black.input.text;
    }

    dialog.color.rgb.red.input.onChange = function () {
        dialog.color.rgb.red.slider.value = dialog.color.rgb.red.input.text;
    }

    dialog.color.rgb.green.input.onChange = function () {
        dialog.color.rgb.green.slider.value = dialog.color.rgb.green.input.text;
    }

    dialog.color.rgb.blue.input.onChange = function () {
        dialog.color.rgb.blue.slider.value = dialog.color.rgb.blue.input.text;
    }

    dialog.color.cmyk.cyan.slider.onChanging = function() {
        dialog.color.cmyk.cyan.input.text = Math.round(dialog.color.cmyk.cyan.slider.value);
    }

    dialog.color.cmyk.magenta.slider.onChanging = function () {
        dialog.color.cmyk.magenta.input.text = Math.round(dialog.color.cmyk.magenta.slider.value);
    }

    dialog.color.cmyk.yellow.slider.onChanging = function () {
        dialog.color.cmyk.yellow.input.text = Math.round(dialog.color.cmyk.yellow.slider.value);
    }

    dialog.color.cmyk.black.slider.onChanging = function () {
        dialog.color.cmyk.black.input.text = Math.round(dialog.color.cmyk.black.slider.value);
    }

    dialog.color.rgb.red.slider.onChanging = function () {
        dialog.color.rgb.red.input.text = Math.round(dialog.color.rgb.red.slider.value);
    }

    dialog.color.rgb.green.slider.onChanging = function () {
        dialog.color.rgb.green.input.text = Math.round(dialog.color.rgb.green.slider.value);
    }

    dialog.color.rgb.blue.slider.onChanging = function () {
        dialog.color.rgb.blue.input.text = Math.round(dialog.color.rgb.blue.slider.value);
    }

    return dialog;
}
