/* ===============================================================================================================================================
   createColorChart

   Description
   This script creates a color chart. Both CMYK and RGB colors are supported.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select CMYK or RGB mode.
   3. Enter the target color values.
      If select a path or text object, its fill color value is used as the initial value.
   4. Select colors for the vertical and horizontal axis.
   5. Enter the increase or decrease value as a percentage.
   6. Select Addition or Intensity.
      Addition: the value of the steps is added as is.
      Intensity: the percentage of the target color is added. It is equivalent to Edit > Edit Colors > Saturate.
   7. Set the units, artboard size, and color chip size according to your preference.

   Notes
   Spot color, gradient, and pattern are not supported.
   Create a color chart in a new document.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

   Version
   2.2.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (isValidVersion()) main();
})();


function main() {
    var items = (app.documents.length) ? app.activeDocument.selection : [];
    var color = getTargetColor(items);
    var dialog = showDialog(color);

    dialog.ok.onClick = function() {
        var config = getConfiguration(dialog);
        if (!verify(config)) return;

        createNewDocument(config.mode, config.units, config.artboard.width, config.artboard.height);
        app.executeMenuCommand('fitin');

        // target color
        var points = getCenterPosition(config.chip.width, config.chip.height);
        var chip = createColorChip(config.mode, config.color, points);
        showColorValue(config.mode, chip, config.chip.width);

        createColorChart(config, chip);
        dialog.close();
    }
    dialog.show();
}


function createColorChart(config, item) {
    var margin = {
        x: convertUnits('2mm', 'pt'),
        y: convertUnits('4mm', 'pt')
    };
    var artboard = config.artboard;
    var chip = config.chip;

    // Number of chips to create
    var count = {
        x: Math.floor((artboard.width / 2 - chip.width / 2) / (chip.width + margin.x)),
        y: Math.floor((artboard.height / 2 - chip.height / 2) / (chip.height + margin.y))
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


function getColorItem(item) {
    var CMYK = DocumentColorSpace.CMYK;
    var mode = app.activeDocument.documentColorSpace;
    var color = item.fillColor;
    return {
        color: {
            color1: (mode == CMYK) ? Math.round(color.cyan) : Math.round(color.red),
            color2: (mode == CMYK) ? Math.round(color.magenta) : Math.round(color.green),
            color3: (mode == CMYK) ? Math.round(color.yellow) : Math.round(color.blue),
            color4: (mode == CMYK) ? Math.round(color.black) : 0
        },
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height
    };
}


function createQuadrant(config, item, base, start, count, margin) {
    for (var i = start; i <= count.y; i++) {
        if (i > 0) {
            var times = (config.vertical == config.horizontal) ? i : 1;
            item = setColor(item, config.vertical, config.kind, config.step.y, times);
            item.top = base.top + (item.height + margin.y) * i;
        }

        for (var j = start; j <= count.x; j++) {
            if (i == 0 && j == 0) continue;
            if (j > 0) {
                item = setColor(item, config.horizontal, config.kind, config.step.x, 1);
            }
            item.left = base.left + (item.width + margin.x) * j;
            var chip = createColorChip(config.mode, item.color, item);
            showColorValue(config.mode, chip, config.chip.width);
        }

        item = resetColor(item, base.color, config.horizontal);
    }
}


function setColor(item, orientation, kind, step, times) {
    var color = item.color;
    var rate = step / 100;
    switch (orientation) {
        case 'C':
        case 'R':
            var color1 = (kind == 'ADD') ? step * times : color.color1 * rate * times;
            item.color.color1 += color1;
            break;
        case 'M':
        case 'G':
            var color2 = (kind == 'ADD') ? step * times : color.color2 * rate * times;
            item.color.color2 += color2;
            break;
        case 'Y':
        case 'B':
            var color3 = (kind == 'ADD') ? step * times : color.color3 * rate * times;
            item.color.color3 += color3;
            break;
        case 'K':
            var color4 = (kind == 'ADD') ? step * times : color.color4 * rate * times;
            item.color.color4 += color4;
            break;
    }
    return item;
}


function resetColor(item, base, orientation) {
    switch (orientation) {
        case 'C':
        case 'R':
            item.color.color1 = base.color1;
            break;
        case 'M':
        case 'G':
            item.color.color2 = base.color2;
            break;
        case 'Y':
        case 'B':
            item.color.color3 = base.color3;
            break;
        case 'K':
            item.color.color4 = base.color4;
            break;
    }
    return item;
}


function createColorChip(mode, color, item) {
    var layer = app.activeDocument.activeLayer;
    var chip = layer.pathItems.rectangle(0, 0, item.width, item.height);
    chip.stroked = false;
    chip.filled = true;
    chip.fillColor = setFillColor(mode, color);
    chip.top = item.top;
    chip.left = item.left;
    return chip;
}


function showColorValue(mode, item, width) {
    var color = item.fillColor;
    var color1 = (mode == 'CMYK') ? Math.round(color.cyan) : Math.round(color.red);
    var color2 = (mode == 'CMYK') ? Math.round(color.magenta) : Math.round(color.green);
    var color3 = (mode == 'CMYK') ? Math.round(color.yellow) : Math.round(color.blue);
    var color4 = (mode == 'CMYK') ? Math.round(color.black) : 0;

    var margin = 2;
    var layer = app.activeDocument.activeLayer;
    var text = layer.textFrames.pointText([item.left, item.top + margin]);

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

    var attributes = text.textRange.characterAttributes;
    attributes.size = 8;
    if (text.width > width) {
        var scale = width / text.width * 100;
        if (scale < 50) scale = 50;
        attributes.horizontalScale = Math.round(scale);
    }
}


function getCenterPosition(width, height) {
    var document = app.activeDocument;
    var rect = document.artboards[0].artboardRect;
    var x1 = rect[0];
    var y1 = rect[1];
    var center = {
        x: x1 + document.width / 2,
        y: y1 - document.height / 2
    };
    var top = center.y + height / 2;
    var left = center.x - width / 2;
    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
}


function getTargetColor(items) {
    var colors = extractColors(items);
    if (!colors.length) return { color1: 0, color2: 0, color3: 0, color4: 0 };

    var color = colors[0];
    var mode = app.activeDocument.documentColorSpace;
    switch (mode) {
        case DocumentColorSpace.CMYK:
            return {
                color1: Math.round(color.cyan),
                color2: Math.round(color.magenta),
                color3: Math.round(color.yellow),
                color4: Math.round(color.black)
            };
        case DocumentColorSpace.RGB:
            return {
                color1: Math.round(color.red),
                color2: Math.round(color.green),
                color3: Math.round(color.blue),
                color4: 0
            };
    }
}


function extractColors(items) {
    var colors = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        switch (item.typename) {
            case 'PathItem':
                if (isValidColor(item.fillColor.typename)) {
                    colors.push(item.fillColor);
                }
                else if (isValidColor(item.strokeColor.typename)) {
                    colors.push(item.strokeColor);
                }
                break;
            case 'TextFrame':
                var attributes = item.textRange.characterAttributes;
                if (isValidColor(attributes.fillColor.typename)) {
                    colors.push(attributes.fillColor);
                }
                else if (isValidColor(attributes.strokeColor.typename)) {
                    colors.push(attributes.strokeColor);
                }
                break;
            case 'GroupItem':
                colors = colors.concat(extractColors(item.pageItems));
                break;
            case 'CompoundPathItem':
                colors = colors.concat(extractColors(item.pathItems));
                break;
        }
    }
    return colors;
}


function isValidColor(kind) {
    switch (kind) {
        case 'CMYKColor': return true;
        case 'RGBColor': return true;
        default: return false;
    }
}


function setFillColor(mode, color) {
    if (mode == 'CMYK') {
        return setCMYKColor(color.color1, color.color2, color.color3, color.color4);
    }
    else {
        return setRGBColor(color.color1, color.color2, color.color3);
    }
}


function setCMYKColor(c, m, y, k) {
    var cyan = c;
    var magenta = m;
    var yellow = y;
    var black = k;

    if (cyan > 100) cyan = 100;
    else if (cyan < 0) cyan = 0;

    if (magenta > 100) magenta = 100;
    else if (magenta < 0) magenta = 0;

    if (yellow > 100) yellow = 100;
    else if (yellow < 0) yellow = 0;

    if (black > 100) black = 100;
    else if (black < 0) black = 0;

    var color = new CMYKColor();
    color.cyan = cyan;
    color.magenta = magenta;
    color.yellow = yellow;
    color.black = black;
    return color;
}


function setRGBColor(r, g, b) {
    var red = r;
    var green = g;
    var blue = b;

    if (red > 255) red = 255;
    else if (red < 0) red = 0;

    if (green > 255) green = 255;
    else if (green < 0) green = 0;

    if (blue > 255) blue = 255;
    else if (blue < 0) blue = 0;

    var color = new RGBColor();
    color.red = red;
    color.green = green;
    color.blue = blue;
    return color;
}


function createNewDocument(mode, unit, width, height) {
    var title = 'Color Chart';
    var preset = new DocumentPreset();
    preset.title = title;
    preset.width = width;
    preset.height = height;
    preset.colorMode = (mode == 'CMYK') ? DocumentColorSpace.CMYK : DocumentColorSpace.RGB;
    try {
        preset.units = setRulerUnits(unit);
    }
    catch (err) { }

    var document = app.documents.addDocument(title, preset);
    var artboard = document.artboards[0];
    artboard.artboardRect = [0, 0, width, height * -1];
}


function round(value) {
    var digits = 10000;
    return Math.round(value * digits) / digits;
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


function setRulerUnits(units) {
    var unitSymbol = getUnitSymbol();
    switch (units) {
        case unitSymbol.px: return RulerUnits.Pixels;
        case unitSymbol.pt: return RulerUnits.Points;
        case unitSymbol.pc: return RulerUnits.Picas;
        case unitSymbol.inch: return RulerUnits.Inches;
        case unitSymbol.mm: return RulerUnits.Millimeters;
        case unitSymbol.cm: return RulerUnits.Centimeters;

        case unitSymbol.ft: return RulerUnits.Feet;
        case unitSymbol.yd: return RulerUnits.Yards;
        case unitSymbol.meter: return RulerUnits.Meters;
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
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}


function getConfiguration(dialog) {
    var color1 = getValue(dialog.color1.text);
    var color2 = getValue(dialog.color2.text);
    var color3 = getValue(dialog.color3.text);
    var color4 = getValue(dialog.color4.text);

    var vertical, horizontal;

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

    var step = getValue(dialog.step.text);
    var units = dialog.units.selection.toString();

    var artboard = {
        width: getValue(dialog.artboard.width.text),
        height: getValue(dialog.artboard.height.text)
    };

    var chip = {
        width: getValue(dialog.chip.width.text),
        height: getValue(dialog.chip.height.text)
    };

    return {
        mode: (dialog.cmyk.value) ? 'CMYK' : 'RGB',
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
            y: step
        },
        kind: (dialog.addition.value) ? 'ADD' : 'INTENSITY',
        artboard: {
            width: convertUnits(artboard.width + units, 'pt'),
            height: convertUnits(artboard.height + units, 'pt')
        },
        chip: {
            width: convertUnits(chip.width + units, 'pt'),
            height: convertUnits(chip.height + units, 'pt')
        },
        units: units
    };
}


function getInitialValues(units) {
    var width = convertUnits('210mm', units);
    var height = convertUnits('297mm', units);
    var chip = convertUnits('20mm', units);
    return {
        artboard: {
            width: round(width),
            height: round(height)
        },
        chip: {
            width: round(chip),
            height: round(chip)
        },
        selection: setRulerSelection(units)
    };
}


function setRulerSelection(units) {
    try {
        var ruler = setRulerUnits(units);
        switch (ruler) {
            case RulerUnits.Pixels: return 0;
            case RulerUnits.Points: return 1;
            case RulerUnits.Picas: return 2;
            case RulerUnits.Inches: return 3;
            case RulerUnits.Millimeters: return 6;
            case RulerUnits.Centimeters: return 7;

            case RulerUnits.Feet: return 4;
            case RulerUnits.Yards: return 5;
            case RulerUnits.Meters: return 8;
        }
    }
    catch (err) {
        var src = app.activeDocument.fullName;
        switch (xmpRulerUnits(src)) {
            case 'Feet': return 4;
            case 'Yards': return 5;
            case 'Meters': return 8;
        }
    }
}


function verify(config) {
    $.localize = true;
    var error = errorMessage();
    var message;

    var color = config.color;
    var sum = color.color1 + color.color2 + color.color3 + color.color4;

    if (!sum) {
        message = error.color;
    }
    if (!config.vertical) {
        message = error.vertical;
    }
    if (!config.horizontal) {
        message = error.horizontal;
    }
    if (!config.step.x && !config.step.y) {
        message = error.step;
    }
    if (!config.artboard.width || !config.artboard.height) {
        message = error.artboard;
    }
    if (!config.chip.width || !config.chip.height) {
        message = error.chip;
    }

    if (!message) return true;
    alert(message);
    return false;
}


function errorMessage() {
    return {
        color: {
            en: 'Enter a color value.',
            ja: 'カラー数値を入力してください。'
        },
        vertical: {
            en: 'Select a vertical direction.',
            ja: '垂直方向を選択してください。'
        },
        horizontal: {
            en: 'Select a horizontal direction.',
            ja: '水平方向を選択してください。'
        },
        step: {
            en: 'Enter a step value.',
            ja: '階調を入力してください。'
        },
        artboard: {
            en: 'Enter a artboard size.',
            ja: 'アートボードサイズを入力してください。'
        },
        chip: {
            en: 'Enter a color chip size.',
            ja: 'カラーチップサイズを入力してください。'
        }
    };
}


function showDialog(item) {
    $.localize = true;
    var ui = localizeUI();

    var CMYK = DocumentColorSpace.CMYK;
    var RGB = DocumentColorSpace.RGB;

    var docs = app.documents;
    var ruler = (docs.length) ? getRulerUnits() : 'mm';
    var initial = getInitialValues(ruler);

    var mode = (docs.length) ? app.activeDocument.documentColorSpace : CMYK;
    var maxvalue = (mode == CMYK) ? 100 : 255;
    var label = {
        name1: (mode == CMYK) ? 'C' : 'R',
        name2: (mode == CMYK) ? 'M' : 'G',
        name3: (mode == CMYK) ? 'Y' : 'B',
        name4: (mode == CMYK) ? 'K' : ''
    };

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.mode;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var radiobutton1 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = 'CMYK';
    radiobutton1.value = (mode == CMYK) ? true : false;

    var radiobutton2 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = 'RGB';
    radiobutton2.value = (mode == RGB) ? true : false;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.color;
    panel2.orientation = 'column';
    panel2.alignChildren = ['fill', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group2 = panel2.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 6, 0, 0];

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['center', 'center'];
    group3.spacing = 18;
    group3.margins = 0;
    group3.alignment = ['left', 'center'];

    var statictext1 = group3.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = label.name1;
    statictext1.justify = 'center';
    statictext1.preferredSize.width = 14;

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = label.name2;
    statictext2.justify = 'center';
    statictext2.preferredSize.width = 14;

    var statictext3 = group3.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = label.name3;
    statictext3.justify = 'center';
    statictext3.preferredSize.width = 14;

    var statictext4 = group3.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = label.name4;
    statictext4.justify = 'center';
    statictext4.preferredSize.width = 14;
    statictext4.visible = (mode == CMYK) ? true : false;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['fill', 'center'];
    group4.spacing = 16;
    group4.margins = 0;
    group4.alignment = ['fill', 'center'];

    var slider1 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = maxvalue;
    slider1.value = item.color1;

    var slider2 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = maxvalue;
    slider2.value = item.color2;

    var slider3 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = maxvalue;
    slider3.value = item.color3;

    var slider4 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = maxvalue;
    slider4.value = item.color4;
    slider4.visible = (mode == CMYK) ? true : false;

    var group5 = group2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;
    group5.alignment = ['right', 'center'];

    var edittext1 = group5.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = item.color1;
    edittext1.preferredSize.width = 40;

    var edittext2 = group5.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = item.color2;
    edittext2.preferredSize.width = 40;

    var edittext3 = group5.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = item.color3;
    edittext3.preferredSize.width = 40;

    var edittext4 = group5.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = item.color4;
    edittext4.preferredSize.width = 40;
    edittext4.visible = (mode == CMYK) ? true : false;

    var group6 = group2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 18;
    group6.margins = 0;
    group6.alignment = ['right', 'center'];

    var statictext5 = group6.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = '%';

    var statictext6 = group6.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = '%';

    var statictext7 = group6.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = '%';

    var statictext8 = group6.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = '%';
    statictext8.visible = (mode == CMYK) ? true : false;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.orientation;
    panel3.orientation = 'row';
    panel3.alignChildren = ['left', 'fill'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group7 = panel3.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 4, 0, 0];

    var group8 = group7.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 18;
    group8.margins = 0;

    var statictext9 = group8.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = ui.vertical;
    statictext9.helpTip = ui.tip.vertical;

    var statictext10 = group8.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = ui.horizontal;
    statictext10.helpTip = ui.tip.horizontal;

    var statictext11 = group8.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = ui.steps;

    var group9 = group7.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 6, 0, 0];

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var radiobutton3 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = label.name1;
    radiobutton3.preferredSize.width = 40;

    var radiobutton4 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = label.name2;
    radiobutton4.preferredSize.width = 40;

    var radiobutton5 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = label.name3;
    radiobutton5.preferredSize.width = 40;

    var radiobutton6 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = label.name4;
    radiobutton6.preferredSize.width = 40;

    var group11 = group9.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = [0, 4, 0, 0];

    var radiobutton7 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    radiobutton7.text = label.name1;
    radiobutton7.preferredSize.width = 40;

    var radiobutton8 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    radiobutton8.text = label.name2;
    radiobutton8.preferredSize.width = 40;

    var radiobutton9 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton9' });
    radiobutton9.text = label.name3;
    radiobutton9.preferredSize.width = 40;

    var radiobutton10 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton10' });
    radiobutton10.text = label.name4;
    radiobutton10.preferredSize.width = 40;

    var group12 = group9.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var edittext5 = group12.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '5';
    edittext5.preferredSize.width = 40;

    var statictext12 = group12.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = '%';

    var group13 = group12.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = [0, 4, 0, 0];

    var radiobutton11 = group13.add('radiobutton', undefined, undefined, { name: 'radiobutton11' });
    radiobutton11.text = ui.addition;
    radiobutton11.value = true;

    var radiobutton12 = group13.add('radiobutton', undefined, undefined, { name: 'radiobutton12' });
    radiobutton12.text = ui.intensity;

    var panel4 = dialog.add('panel', undefined, undefined, { name: 'panel4' });
    panel4.text = ui.options;
    panel4.orientation = 'row';
    panel4.alignChildren = ['left', 'fill'];
    panel4.spacing = 10;
    panel4.margins = 10;

    var group14 = panel4.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = [0, 4, 0, 0];

    var group15 = group14.add('group', undefined, { name: 'group15' });
    group15.orientation = 'column';
    group15.alignChildren = ['right', 'center'];
    group15.spacing = 18;
    group15.margins = 0;

    var statictext13 = group15.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = ui.units;

    var statictext14 = group15.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = ui.artboard;

    var statictext15 = group15.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = ui.chip;

    var group16 = group14.add('group', undefined, { name: 'group16' });
    group16.orientation = 'column';
    group16.alignChildren = ['left', 'center'];
    group16.spacing = 10;
    group16.margins = [0, 1, 0, 0];

    var group17 = group16.add('group', undefined, { name: 'group17' });
    group17.orientation = 'row';
    group17.alignChildren = ['left', 'center'];
    group17.spacing = 10;
    group17.margins = 0;

    var units = ['px', 'pt', 'pc', 'in', 'ft', 'yd', 'mm', 'cm', 'm'];
    var dropdown1 = group17.add('dropdownlist', undefined, units, { name: 'dropdown1' });
    dropdown1.selection = initial.selection;
    dropdown1.preferredSize.width = 75;

    var group18 = group16.add('group', undefined, { name: 'group18' });
    group18.orientation = 'row';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 10;
    group18.margins = 0;

    var statictext16 = group18.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = 'W:';

    var edittext6 = group18.add('edittext', undefined, undefined, { name: 'edittext6' });
    edittext6.text = initial.artboard.width;
    edittext6.preferredSize.width = 75;

    var statictext17 = group18.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = 'H:';

    var edittext7 = group18.add('edittext', undefined, undefined, { name: 'edittext7' });
    edittext7.text = initial.artboard.height;
    edittext7.preferredSize.width = 75;

    var group19 = group16.add('group', undefined, { name: 'group19' });
    group19.orientation = 'row';
    group19.alignChildren = ['left', 'center'];
    group19.spacing = 10;
    group19.margins = 0;

    var statictext18 = group19.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = 'W:';

    var edittext8 = group19.add('edittext', undefined, undefined, { name: 'edittext8' });
    edittext8.text = initial.chip.width;
    edittext8.preferredSize.width = 75;

    var statictext19 = group19.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = 'H:';

    var edittext9 = group19.add('edittext', undefined, undefined, { name: 'edittext9' });
    edittext9.text = initial.chip.height;
    edittext9.preferredSize.width = 75;

    var group20 = dialog.add('group', undefined, { name: 'group20' });
    group20.orientation = 'row';
    group20.alignChildren = ['right', 'center'];
    group20.spacing = 10;
    group20.margins = 0;

    var button1 = group20.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group20.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    radiobutton1.onClick = function() {
        statictext1.text = radiobutton3.text = radiobutton7.text = 'C';
        statictext2.text = radiobutton4.text = radiobutton8.text = 'M';
        statictext3.text = radiobutton5.text = radiobutton9.text = 'Y';
        statictext4.text = radiobutton6.text = radiobutton10.text = 'K';
        statictext4.visible = true;
        slider4.visible = true;
        edittext4.visible = true;
        statictext8.visible = true;
        radiobutton6.visible = true;
        radiobutton10.visible = true;
        maxvalue = 100;
        slider1.maxvalue = maxvalue;
        slider2.maxvalue = maxvalue;
        slider3.maxvalue = maxvalue;
        slider4.maxvalue = maxvalue;
    }

    radiobutton2.onClick = function() {
        statictext1.text = radiobutton3.text = radiobutton7.text = 'R';
        statictext2.text = radiobutton4.text = radiobutton8.text = 'G';
        statictext3.text = radiobutton5.text = radiobutton9.text = 'B';
        statictext4.text = radiobutton6.text = radiobutton10.text = '';
        statictext4.visible = false;
        slider4.visible = false;
        edittext4.visible = false;
        statictext8.visible = false;
        radiobutton6.visible = false;
        radiobutton10.visible = false;
        maxvalue = 255;
        slider1.maxvalue = maxvalue;
        slider2.maxvalue = maxvalue;
        slider3.maxvalue = maxvalue;
        slider4.maxvalue = maxvalue;
    }

    dropdown1.onChange = function() {
        var units = dropdown1.selection.toString();
        var artboard = {
            width: getValue(edittext6.text),
            height: getValue(edittext7.text)
        };
        var chip = {
            width: getValue(edittext8.text),
            height: getValue(edittext9.text)
        };
        edittext6.text = round(convertUnits(artboard.width + ruler, units));
        edittext7.text = round(convertUnits(artboard.height + ruler, units));
        edittext8.text = round(convertUnits(chip.width + ruler, units));
        edittext9.text = round(convertUnits(chip.height + ruler, units));
        ruler = units;
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

    edittext1.onChanging = function() {
        slider1.value = getValue(edittext1.text);
    }

    edittext2.onChanging = function() {
        slider2.value = getValue(edittext2.text);
    }

    edittext3.onChanging = function() {
        slider3.value = getValue(edittext3.text);
    }

    edittext4.onChanging = function() {
        slider4.value = getValue(edittext4.text);
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

    dialog.cmyk = radiobutton1;
    dialog.rgb = radiobutton2;
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
    dialog.addition = radiobutton11;
    dialog.intensity = radiobutton12;

    dialog.artboard = {
        width: edittext6,
        height: edittext7
    };
    dialog.chip = {
        width: edittext8,
        height: edittext9
    };
    dialog.units = dropdown1;
    dialog.ok = button2;

    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Create Color Chart',
            ja: 'カラーチャート'
        },
        mode: {
            en: 'Mode',
            ja: 'カラーモード'
        },
        color: {
            en: 'Target Color',
            ja: '基準カラー'
        },
        orientation: {
            en: 'Orientation',
            ja: '方向'
        },
        vertical: {
            en: 'Vertical :',
            ja: '垂直方向 :'
        },
        horizontal: {
            en: 'Horizontal :',
            ja: '水平方向 :'
        },
        tip: {
            vertical: {
                en: 'Select a color to increase or decrease \rin the vertical direction.',
                ja: '垂直方向に増減させる色を\r選択してください。'
            },
            horizontal: {
                en: 'Select a color to increase or decrease \rin the horizontal direction.',
                ja: '水平方向に増減させる色を\r選択してください。'
            }
        },
        steps: {
            en: 'Steps :',
            ja: '増減 :'
        },
        addition: {
            en: 'Addition',
            ja: '加算'
        },
        intensity: {
            en: 'Intensity',
            ja: '濃度'
        },
        options: {
            en: 'Options',
            ja: 'オプション'
        },
        units: {
            en: 'Units :',
            ja: '単位 :'
        },
        artboard: {
            en: 'Artboard :',
            ja: 'アートボード :'
        },
        chip: {
            en: 'Color Chip :',
            ja: 'カラーチップ :'
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
