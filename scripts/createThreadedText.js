/* ===============================================================================================================================================
   createThreadedText

   Description
   This script creates a threaded text. It can also be made from a mixture of point types and path objects.
   Vertical text is also supported.

   Usage
   1. Select two or more text and/or path objects, run this script from File > Scripts > Other Script...
      There is no need to convert to the area types in advance.
   2. Select an order of concatenation.
   3. Enter a value of the alignment position tolerance. (0 or higher number)
   4. To convert the paths to the texts, check the Convert Path to Type checkbox and select either the Area Type or Type on a Path.

   Notes
   The stacking order of objects and layers has no bearing on the order of concatenation.
   When converting the path to the area type, ignore anchor points with fewer than two anchor points.
   The units of the alignment position tolerance depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CC or higher

   Version
   1.0.0

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
    var texts = getTextFrames(items);
    var shapes = getPathItems(items);
    if (texts.length + shapes.length < 2) return;

    var ruler = app.activeDocument.rulerUnits;
    var units = getUnits(ruler);

    var dialog = showDialog(texts, shapes, units);

    dialog.ok.onClick = function() {
        if (!dialog.shape.value && texts.length < 2) return dialog.close();
        var config = getConfiguration(dialog);
        app.executeMenuCommand('deselectall');
        convertPointTypeToAreaType(texts);
        if (dialog.shape.value) {
            if (dialog.area.value) convertPathToAreaType(shapes);
            if (dialog.path.value) convertPathToTypeOnAPath(shapes);
        }
        createThreadedText(config);
        dialog.close();
    }

    dialog.show();
}


function getConfiguration(dialog) {
    var ruler = app.activeDocument.rulerUnits;
    var units = getUnits(ruler);
    var value = Number(dialog.tolerance.text);
    if (isNaN(value)) value = 0;
    var tolerance = convertUnits(Math.abs(value) + units, 'pt');
    return {
        tolerance: round(tolerance),
        order: {
            row: dialog.row.value,
            column: dialog.column.value,
            rowRtoL: dialog.rowRtoL.value,
            columnRtoL: dialog.columnRtoL.value,
            left: dialog.left.value,
            right: dialog.right.value,
            top: dialog.top.value,
            bottom: dialog.bottom.value
        }
    };
}


function convertPointTypeToAreaType(texts) {
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        text.convertPointObjectToAreaObject();
        text.selected = true;
    }
}


function convertPathToAreaType(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        var points = item.pathPoints;
        if (points.length <= 2) continue;
        var layer = app.activeDocument.activeLayer;
        var text = layer.textFrames.areaText(item);
        // work around a bug
        text.selected = false;
        text.selected = true;
    }
}


function convertPathToTypeOnAPath(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        var layer = app.activeDocument.activeLayer;
        var text = layer.textFrames.pathText(item);
        // work around a bug
        text.selected = false;
        text.selected = true;
    }
}


function createThreadedText(config) {
    var texts = sortTexts(config);

    for (var i = 0; i < texts.length - 1; i++) {
        var text = texts[i];
        var next = texts[i + 1];

        if (!hasLinefeed(text.contents)) {
            insertLinefeed(text);
        }

        text.nextFrame = next;
    }
}


function insertLinefeed(text) {
    var ranges = text.textRanges;
    var last = text.insertionPoints[ranges.length];
    last.characters.add('\n');
}


function hasLinefeed(text) {
    var linefeed = /\n$|\r$|\r\n$|\u0003$/;
    if (linefeed.test(text)) return true;
    return false;
}


function sortTexts(config) {
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    if (texts.length < 2) return [];

    var order = config.order;
    var tolerance = config.tolerance;

    if (order.row) return sortRow(texts, tolerance);
    if (order.column) return sortColumn(texts, tolerance);
    if (order.rowRtoL) return sortRowRtoL(texts, tolerance);
    if (order.columnRtoL) return sortColumnRtoL(texts, tolerance);
    if (order.left) return texts.sort(orderLeftToRight);
    if (order.right) return texts.sort(orderRightToLeft);
    if (order.top) return texts.sort(orderTopToBottom);
    if (order.bottom) return texts.sort(orderBottomToTop);
}


function sortRow(texts, tolerance) {
    return texts.sort(function(a, b) {
        var distance = Math.abs(b.top - a.top);
        if (distance <= tolerance) {
            return a.left - b.left;
        }
        return b.top - a.top;
    });
}


function sortRowRtoL(texts, tolerance) {
    return texts.sort(function(a, b) {
        var distance = Math.abs(b.top - a.top);
        if (distance <= tolerance) {
            return b.left - a.left;
        }
        return b.top - a.top;
    });
}


function sortColumn(texts, tolerance) {
    return texts.sort(function(a, b) {
        var distance = Math.abs(a.left - b.left);
        if (distance <= tolerance) {
            return b.top - a.top;
        }
        return a.left - b.left;
    });
}


function sortColumnRtoL(texts, tolerance) {
    return texts.sort(function(a, b) {
        var distance = Math.abs(a.left - b.left);
        if (distance <= tolerance) {
            return b.top - a.top;
        }
        return b.left - a.left;
    });
}


function orderRow(a, b) {
    if (b.top - a.top == 0) {
        return a.left - b.left;
    }
    return b.top - a.top;
}


function orderRowRtoL(a, b) {
    if (b.top - a.top == 0) {
        return b.left - a.left;
    }
    return b.top - a.top;
}


function orderColumn(a, b) {
    if (a.left - b.left == 0) {
        return b.top - a.top;
    }
    return a.left - b.left;
}


function orderColumnRtoL(a, b) {
    if (a.left - b.left == 0) {
        return b.top - a.top;
    }
    return b.left - a.left;
}


function orderLeftToRight(a, b) {
    return a.left - b.left;
}


function orderRightToLeft(a, b) {
    return b.left - a.left;
}


function orderTopToBottom(a, b) {
    return b.top - a.top;
}


function orderBottomToTop(a, b) {
    return a.top - b.top;
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame') {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
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
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
    }
}


function round(value) {
    var digits = 1000;
    return Math.round(value * digits) / digits;
}


function isValidVersion() {
    var cc = 17;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc) return false;
    return true;
}


function showDialog(texts, shapes, units) {
    $.localize = true;
    var ui = localizeUI();
    var icon = getUIIcon();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.order;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var image1 = group2.add('image', undefined, File.decode(icon.row), { name: 'image1' });
    var image2 = group2.add('image', undefined, File.decode(icon.column), { name: 'image2' });
    var image3 = group2.add('image', undefined, File.decode(icon.left), { name: 'image3' });
    var image4 = group2.add('image', undefined, File.decode(icon.top), { name: 'image4' });

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 4, 0, 0];

    var radiobutton1 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.row;
    radiobutton1.value = true;

    var radiobutton2 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.column;

    var radiobutton3 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.left;

    var radiobutton4 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.top;

    var group4 = group1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var image5 = group4.add('image', undefined, File.decode(icon.rowRtoL), { name: 'image5' });
    var image6 = group4.add('image', undefined, File.decode(icon.columnRtoL), { name: 'image6' });
    var image7 = group4.add('image', undefined, File.decode(icon.right), { name: 'image7' });
    var image8 = group4.add('image', undefined, File.decode(icon.bottom), { name: 'image8' });

    var group5 = group1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 4, 0, 0];

    var radiobutton5 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = ui.rowRtoL;

    var radiobutton6 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = ui.columnRtoL;

    var radiobutton7 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    radiobutton7.text = ui.right;

    var radiobutton8 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    radiobutton8.text = ui.bottom;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.option;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 8, 0, 0];

    var statictext1 = group6.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.tolerance;
    statictext1.preferredSize.height = 20;

    var edittext1 = group6.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 60;
    edittext1.active = true;

    var statictext2 = group6.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = units;

    var divider1 = panel2.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group7 = panel2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 4, 0, 0];
    if (!shapes.length) group7.enabled = false;

    var checkbox1 = group7.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.shape;
    if (!texts.length) checkbox1.value = true;

    var group8 = panel2.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [18, 0, 0, 0];
    group8.enabled = false;
    if (!texts.length) group8.enabled = true;

    var radiobutton9 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton9' });
    radiobutton9.text = ui.area;
    radiobutton9.value = true;

    var radiobutton10 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton10' });
    radiobutton10.text = ui.path;

    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var button1 = group9.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group9.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    radiobutton1.onClick = function() {
        radiobutton5.value = false;
        radiobutton6.value = false;
        radiobutton7.value = false;
        radiobutton8.value = false;
        group6.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton2.onClick = function() {
        radiobutton5.value = false;
        radiobutton6.value = false;
        radiobutton7.value = false;
        radiobutton8.value = false;
        group6.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton3.onClick = function() {
        radiobutton5.value = false;
        radiobutton6.value = false;
        radiobutton7.value = false;
        radiobutton8.value = false;
        group6.enabled = false;
    }

    radiobutton4.onClick = function() {
        radiobutton5.value = false;
        radiobutton6.value = false;
        radiobutton7.value = false;
        radiobutton8.value = false;
        group6.enabled = false;
    }

    radiobutton5.onClick = function() {
        radiobutton1.value = false;
        radiobutton2.value = false;
        radiobutton3.value = false;
        radiobutton4.value = false;
        group6.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton6.onClick = function() {
        radiobutton1.value = false;
        radiobutton2.value = false;
        radiobutton3.value = false;
        radiobutton4.value = false;
        group6.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton7.onClick = function() {
        radiobutton1.value = false;
        radiobutton2.value = false;
        radiobutton3.value = false;
        radiobutton4.value = false;
        group6.enabled = false;
    }

    radiobutton8.onClick = function() {
        radiobutton1.value = false;
        radiobutton2.value = false;
        radiobutton3.value = false;
        radiobutton4.value = false;
        group6.enabled = false;
    }

    image1.addEventListener('click', function() {
        radiobutton1.notify('onClick');
    });

    image2.addEventListener('click', function() {
        radiobutton2.notify('onClick');
    });

    image3.addEventListener('click', function() {
        radiobutton3.notify('onClick');
    });

    image4.addEventListener('click', function() {
        radiobutton4.notify('onClick');
    });

    image5.addEventListener('click', function() {
        radiobutton5.notify('onClick');
    });

    image6.addEventListener('click', function() {
        radiobutton6.notify('onClick');
    });

    image7.addEventListener('click', function() {
        radiobutton7.notify('onClick');
    });

    image8.addEventListener('click', function() {
        radiobutton8.notify('onClick');
    });

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    edittext1.addEventListener('keydown', function(event) {
        var value = Number(edittext1.text);
        if (isNaN(value)) value = 0;
        var keyboard = ScriptUI.environment.keyboardState;
        var step = keyboard.shiftKey ? 5 : 1;
        var tolerance;
        if (event.keyName == 'Up') {
            tolerance = value + step;
            edittext1.text = tolerance;
            event.preventDefault();
        }
        if (event.keyName == 'Down') {
            tolerance = value - step;
            if (tolerance < 0) tolerance = 0;
            edittext1.text = tolerance;
            event.preventDefault();
        }
    });

    checkbox1.onClick = function() {
        group8.enabled = (checkbox1.value) ? true : false;
    }

    button1.onClick = function() {
        dialog.close();
    }

    dialog.row = radiobutton1;
    dialog.column = radiobutton2;
    dialog.rowRtoL = radiobutton5;
    dialog.columnRtoL = radiobutton6;
    dialog.left = radiobutton3;
    dialog.top = radiobutton4;
    dialog.right = radiobutton7;
    dialog.bottom = radiobutton8;
    dialog.tolerance = edittext1;
    dialog.shape = checkbox1;
    dialog.area = radiobutton9;
    dialog.path = radiobutton10;
    dialog.ok = button2;
    return dialog;
}


function getUIIcon() {
    var lightestRow = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01dIDAT8%C2%8D%C2%A5T%C2%B1%C2%8E%C2%82%40%10%1D%08n%22%C2%851Hir%1D%25Z%C3%B2%0F%C3%96%C2%B4%C3%9A%C3%B3%09b%C3%A9%07X%19Zjj%C3%BF%C2%81%C3%B2h%C2%81%C3%82%C3%82X%C2%89g(%24!%26%5C%C3%9E%C3%A64%C2%91UO%C3%A4%25%C2%9Blfg%C3%9E%C2%BEa%C2%96\'%C3%AD%C3%B7%C3%BB%C2%AF%C2%B2%2C%C2%BF%2F%C2%97K%C2%9F%3E%C2%84%C2%A2(\'%C3%86%C3%98X%C3%9An%C2%B7%3FD%C3%94WU%C2%95%18c%C2%8D%C3%99%C3%8A%C2%B2%C2%A4%C3%B3%C3%B9%C2%8C%C3%ADI%C2%86%C2%A2O%C2%89%00%C3%94%C2%A1%1E%3C%C3%B25%C3%90%06%C2%9DN%C2%87W%C3%8B%C2%ADX%C3%BE%20I%12%C3%9F(%C3%B5%03%C3%87q%C2%84%C3%A4gX%C2%AF%C3%97w\'%02Y%3D%C2%A1%C2%8E0%0C)%08%02%C2%B2%2CK8%13%C3%88%C2%9E%C2%A1(%0A%C3%B2%7D%C2%9F%C2%92%24%C2%A1%C3%A9tJ%C2%A3%C3%91H%C3%88%7C%C2%8Bl%C2%B7%C3%9B%C2%91%C3%A7y4%18%0Ch%C2%B9%5CR%C2%B7%C3%9B%15r%C3%9E%22%C3%9Bl6%7CM%26%13%C2%BE%5E%C3%A1)%19%C3%9A%C2%82%C2%9A%2C%C3%8Bh%3E%C2%9F%C3%93p8%14r%C3%AAx%C3%B84%C2%A2(%C2%A2%C3%85b%C3%81%C3%9Bq%5D%C3%B7%C2%8E%08%C3%B18%C2%8E%C2%85%C2%9A%C2%87mbR%C2%98%C2%98m%C3%9B%0F\'v%3C%1Ei%C2%B5Z%C2%91i%C2%9A4%C2%9B%C3%8D%C3%AE%C2%BE%C2%9F%C2%94%C2%A6i%C2%A5%C3%AB%C3%BA-%C3%90%C3%A4%C2%9Di%C2%9A%C3%86%C2%95%C2%83%C3%B0p8%C2%88d%C3%BF%C3%A1z%19TC%C3%BDU%19%C3%88%C2%846_%01C%C2%81%1A%C2%BC3%C3%830%C2%84L%C2%AE%C2%AC%C3%97%C3%AB%C2%B5%C3%BA%C3%99aCy%C2%9E%C2%93%0Cc%C2%83%1F!%C3%90%14UU%C3%9D%C3%BC%0C%3C%0A%1C%12N%C2%9B%C3%A7y%3B%C2%A7el%C3%BC%0BS%1B%C2%94%C2%8B%C3%A6%C2%85%5Bm%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestColumn = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01LIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C2%AE%C2%820%14%C2%86O%096%C2%91%C2%81%18XI%C3%AE%C2%A4%2B%C2%8E%C2%BE%033%C2%AB%C2%AC%C2%84g%60%C3%A4%19%08%C2%AB%C2%AE%C3%8E%C2%BE%03%C2%A3%C2%AC%C3%80%C3%A0%60%C3%98%C3%B0%C2%9A%0E%C2%92%10%12n%0E%C2%89Dnmb%C3%B5_%C3%9A%C2%9E%C2%9F~i%C2%9B%C2%9FC%C2%AA%C2%AA%C3%BAi%C3%9B%C3%B6%C3%94u%C3%9D%02%3E%C2%94%C2%AA%C2%AA7J%C3%A9%C2%9A%C2%9C%C3%8F%C3%A7_%00Xh%C2%9A%06%C2%94RiZ%C3%9B%C2%B6p%C2%BF%C3%9FqzS%C3%B0D%C2%9F%C2%82P%C2%B8%0F%C3%B7%23Gy%14%C2%BE%C3%91l6%1Bv%2B%C2%AF%18A%10p%C2%B5%C2%87%0E%C2%87%03%C3%A7%13B%C3%840%C2%91%C2%B2%2C%C2%834M%05%C2%AE%04%C2%ACi%1A%C3%98%C3%AF%C3%B7%C3%A0%C2%BA.%C3%A7I%C3%83%C2%92%24%C2%81%C3%A5r%09%C2%9B%C3%8D%C2%86%C3%B3%C2%A4%60%C3%87%C3%A3%11%C3%AA%C2%BA%06%C3%8F%C3%B38O%0Av%C2%B9%5C%06%C2%98%C3%AF%C3%BB0%C2%9F%C3%8F9%C3%BFm%18%C2%BE%13%5E%C3%8Fq%1C%C2%B0%2C%C2%8B%C3%B3%C2%A5%60%C2%BB%C3%9D%0EL%C3%93%1C%60%C3%AFH%15%7D%C2%83%11(%C2%8A%02%C2%A2(%1Aka%18%C3%82%C3%B5z%1D%C3%A6%C2%985%C3%830%26%C2%BE%C3%B0d%18%C3%8E%C3%ADv%3By\'%5C%3F%C3%AB%C3%BFZ%08%C3%83%08%C3%98%C2%B6%3D%C2%A9%C2%ADV%C2%AB1%1A8%C3%A2%C3%BAY%2F%C2%AF%19%C3%871W%7B%08C%C2%9B%C3%A7%C3%B9%C3%8B%C3%B0%C2%92%C2%B2%2C%7B%5D%C3%97%C2%BF%C3%BA%C3%99%C2%B1%0D1%C3%86%40%C3%81%C3%86%C2%86%C3%BD%08%0B%C2%B2%C3%AA%C3%BB~%C3%ACg%C3%88Q%C2%B1Cb%C2%A7e%C2%8C%7D%C3%97i)%5D%C3%BF%01%C3%89%C2%A0%C2%82\'%04%C2%B0%C3%91%C3%BD%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestLeft = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%ACIDAT8%C2%8D%C3%9D%C2%94%3B%0A%C2%83%40%14E%C3%9F%C3%888%C2%A0%C2%95%C2%88%7D%3AkK7b%C3%AB%02%C3%9C%C2%82.%C3%82%C3%92e%C2%A5%16%0B%2B%2B1%C3%81Ba%10%0CW2%01%C2%91%7C%1C%03%C2%81%C2%9Cj%3E%C2%BC3W%C2%90%C3%8B%C2%9A%C2%A69I)%C3%8F%C3%9349%C2%A4%09%C3%A7%C3%BC*%C2%84%08X%5D%C3%97%17%22rl%C3%9B%26!%C3%84n%C2%9B%C2%94%C2%92%C2%86a%C3%80%C3%B2j%20%C2%91%C2%AE%08%60%0E%C3%B3%C3%B0%18%C3%AA%C3%A0%08%C2%A6i.%C3%93%C3%86!%C3%8B%1D%C3%86%C3%98%C3%B7d%C2%8A%C3%9F%C3%8A%C2%B2%2C%C2%A3%C2%B2%2C7%C3%A7Z%C2%B2%C2%AE%C3%AB(%C3%8Fs*%C2%8A%C2%82%C3%86q%5C%C3%9D%C2%B1%C2%AA%C2%AAf%C3%8F%C3%B3%C2%96M%C2%92%24%C2%9B%C3%A1W%C2%B8%C2%AEKi%C2%9A%C2%92eY%C3%94%C2%B6%C3%ADZ%C3%B6%09%C3%AA%C3%810%0C)%C2%8A%C2%A2E%04%20%C3%A3%7B%C2%92%C3%A0%C2%B3%C2%90%26%C2%8Ec%C3%B2%7D%7Fs%C2%BF%3B%C3%993%C2%90%C3%AC%C2%8F%C3%BE%C2%B3%C2%B72%C3%94%C3%88%11%C3%94%C2%BC%C2%81bC%1F%C3%A9%08%C3%A7y~%C3%B4%19%3C%1C%0D%C2%89%C2%A6%C3%AD%C3%BB%C3%BEX%C3%93%0A%11%C3%9C%00%0E%C2%BBf0%C3%A3%C3%96%18%C2%BD%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestTop = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9AIDAT8%C2%8D%C3%AD%C2%94%C2%A1%0E%C2%830%10%C2%86%C2%AFM9%C2%81%20%C2%84%C3%A0%C3%A7%C3%90H%5E%04%C3%8B%03%C3%B0%0CH%1Ep%0F%C2%80%40%C2%A1%08%23%15%C2%88%C2%86%C2%A4%C3%8B%C3%9F%04%C3%84H%C2%BA%C3%80%C2%A6%C2%96%7D%C3%A6z%3D%C3%BA%C2%A5E%C3%BCb%18%C2%86%C2%9B1%C3%A6%C2%BE%C2%AEkL%17QJ%C3%8D%C3%8C%C2%9C%C2%8B%C2%BE%C3%AF%1FD%14%C2%87aH%C3%8C%7C%C3%9Af%C2%8C%C2%A1eY%C2%B0%C2%9C%25ntU%04p%0E%C3%A7%C3%A1%C2%91%C3%9B%C2%86%C2%8F%C2%BA%C2%AE%3DS%C2%A2%20%08%5C%C2%95%C2%87%C3%89%05%C2%84%10%C3%9F%C2%93m%C3%BCe%C2%BF%24%13%5D%C3%97%C3%994M%0F%03%C3%904%0DM%C3%93%C2%B4%C3%B7I%C2%92P%C3%9B%C2%B6%C2%87%C3%AF%C3%808%C2%8E%C3%BE%C2%9BUU%C3%A5%C3%AD_%C3%B1%C3%8A%C2%B2%2C%C2%A3%C2%A2(%C3%9C%1A%15%C2%BD%0F%C2%AF%0C%C2%94e%C3%A9%C2%9E%C2%87%C3%BA%0E%C3%B7%C3%8F%C2%A2(%C2%BA%C2%9C%1A%001%C2%A4%C2%B5%26%C2%89%60C%1Ea%C3%A3%2C%C3%96%C3%9A%3D%C3%8F%C3%A0QHH%24%C2%AD%C3%96%C3%BA%C2%B3%C2%A4e%C3%8E%C2%9F%07%C2%95R%C3%8A%C2%91b%C3%84%C3%B7%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestRowRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01uIDAT8%C2%8D%C2%A5%C2%94%C2%BD%C2%8A%C3%82%40%14%C2%85OB%1C%C3%90B%C3%84X%0A%5B%C2%A5%C3%962%C2%96%3E%C2%84%C2%AD%C2%B6%C3%81Jk-%C3%95G%08%C2%B6%C3%9AZ%C3%A7%1D%2CWK%C2%B1%C2%B0%10%2Bq%25E%02A%C3%88r%C3%82*%C3%86%C2%99%2Ch%C2%BEj2s%C3%AF%C2%99%C3%BB3%C2%B9%C3%9A%C3%A9t%C3%BA%C2%8A%C2%A2%C3%A8%C3%BBv%C2%BBU%C3%B0!%C2%86a%5C%C2%85%10M%C3%ADp8%C3%BC%00%C2%A8%C2%94J%25%08!%C3%9EV%C2%8B%C2%A2%08A%10py%C3%95%19%C3%91%C2%A7B%C2%84~%C3%B4%C2%A7%C2%8E~%C3%9F%C3%88C%C2%A1PH%C2%BC%C3%B5%5C*%7Fh%C2%9A%C2%96%2C%C2%8C%C3%97%C2%83~%C2%BF%2F%19g%C3%A1%C2%BAn%C3%AAD%12k%C2%B7%C3%9BX%C2%AF%C3%97%C3%A8t%3A%C2%B0m%3BCF%C2%8D%C2%B6%C3%9F%C3%AF%C3%A3Z%C2%AD%C2%96%3A%C3%9Cl6X.%C2%97%C2%B0%2C%0B%C2%BD%5E%0F%C3%85bQ%C3%A9%C3%BC%C3%8C%C3%B9%7CV%C3%97%C2%AC%C3%91h%602%C2%99%20%0CCL%C2%A7S%1C%C2%8FG%C3%89F%C2%85R%C2%8C0%C2%9A%C3%A1p%C2%88V%C2%AB%C2%85%C3%99l%06%C3%8F%C3%B3%24%C2%9BW%C2%94i%C2%BE%C3%82%C3%88%C3%A6%C3%B39L%C3%93%C2%84%C3%A38%C3%8A%C2%B43%C3%93%C3%9C%C3%ADv%18%C2%8F%C3%87%C2%8F%C3%AFz%C2%BD%C2%8E%C3%91h%C2%94%C2%88p%C2%9F5U%C2%91%C3%AA%26k%C2%B4X%2C%C2%B0%C3%9Dn%25S%0A1*v%C2%9A%C3%8Da%C2%A7%C3%99%C3%B1g%1Ei%C3%9E%C2%8B%7D%C2%B9%5C%24%C2%A1%2C%C2%9E%C3%9F%19%C3%93L%C3%95%C2%8C%C2%82%C2%AB%C3%95*%C2%B9%1D%C2%8AG%C3%B9%1FR%C3%8D%C2%98J%C2%B7%C3%9B%C3%85%600%40%C2%B5ZM%C3%84%C3%9F!%C2%89%C2%AC%5C.%C3%A7%C3%BA%C3%999%C2%86%7C%C3%9F%C2%87%C3%8E%C3%81%C3%86y%C3%84%C2%8Dw%C2%89%C3%A3%C3%B81%C3%8F%C2%A8cpBr%C3%92%C3%BA%C2%BE%C2%9Fo%C3%92%0A%C3%91%C3%BC%05%0FT%C2%ABP%7C%C2%8B%16b%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestColumnRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01QIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C2%8E%C2%82%40%14E%C3%9F%10%C2%9C%04%0Ac%C2%A2%25%C3%89V%C3%98b%C3%A9%3FX%C3%9BjK%C3%B8%05i%C3%BD%07%5Bh%C2%A9%C3%B9%07%C3%8B%C2%B5%C3%96%C3%82%C2%82Xi%C3%96PH2!as%C3%99%C2%95%C3%A0%0E%C2%83%C2%AB%C2%9C%06%C3%9E%C3%9C%C3%8C%C3%890y%3Cv%3A%C2%9D%3E%C2%84%10%C2%9Fy%C2%9E%0F%C3%A8Mt%5D%C2%BFr%C3%8E\'%C3%ACx%3C~%11%C3%91%C3%804M%C3%A2%C2%9C%C2%BFl%13B%C3%90%C3%ADv%C3%83%C3%ABU%C3%83%C2%89%C3%9E%15%01%C3%AC%C3%83~x%C2%B4%C3%BBB%17z%C2%BD%5E%C2%B9%5Bkrx%C2%9EGQ%14I%C3%AB%C3%B5%C2%BC%0EcL-%03%C3%9B%C3%AD%C2%96v%C2%BB%C2%9D%C2%B4%C3%9E%C2%86R6%C2%9F%C3%8F)%0CC%C3%8A%C2%B2L%C3%8AT(e%C3%93%C3%A9%C2%94l%C3%9B%C2%A6%C3%8Df%23e*%C2%942%C2%B0%5C.%C3%A9r%C2%B9P%1C%C3%87R%C3%96D%C2%AB%C3%8C0%0Cr%5D%C2%B7%C2%94%25I%22%C3%A5%7Fi%C2%95%01%C3%8B%C2%B2h6%C2%9B%C2%95%C2%9F%C3%BB%C3%AC%C3%BE%C2%9E%C3%8A%00d%C3%83%C3%A1%C2%90%C2%82%20%C2%902%C2%A5%C3%8C%C3%B7%C3%BD%C2%AA%C2%87%C3%B0D%7D%07%C2%9F%C2%BB%C3%9F%C3%AF%C3%8B%C2%96Q%C3%B1%20%5B%2C%16%C2%A4%C2%AAq%7F%C2%A8%C3%9B%C2%9A%C3%B9A6%1E%C2%8F%C3%8B%C2%96%C2%A0%C3%9F%C3%96%40%5D%C3%87q%C2%9C*o%C2%82%1D%0E%C2%87b4%1AU%11.y%C2%BD%5E%C3%93j%C2%B5*O%C3%B3_%C3%8E%C3%A7%C3%B3%C2%8F%C2%AC%C3%9F%C3%AFw%C3%BA%C3%991%C2%86%C3%924%25%0D%C2%83%0D%C3%B3%08%0B%C2%AFR%14E5%C3%8F%C3%A0%C3%911!1i%C3%934%C3%AD6i9%C2%9F%7C%03\'7%C2%869IV%06q%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestRight = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%ADIDAT8%C2%8D%C3%8D%C2%94%3D%0A%C2%830%18%C2%86%C2%BFH%0C%C3%A8%24%C3%A2%C3%9E%2Bx%22%C3%8F%C3%A0%01%5C%C2%BD%C2%82%C2%BB%C2%B3%17q%2C%C2%8E%C3%A2%C3%A0%C3%A4%24%C2%B68(%04!%C3%A5%0BM%7F%C3%90b%C2%9B%C2%B4%C3%90g%C3%8A%C3%9F%C3%BB%C3%B0%C3%A9%C3%B0%C2%92%C2%AE%C3%AB%0E%C2%9C%C3%B3%C3%A3%C2%B2%2C%1EhB)%3D3%C3%86B%C3%92%C2%B6%C3%AD%09%00%3C%C3%97u%C2%811%C3%B6%C2%B1%C2%8Ds%0E%C3%934%C3%A1%C3%B2l%C3%A1D%C2%BA%22%04s%C2%98G%C2%8F%C2%A5%0EL%C2%B0m%5B%C2%A6-%23%C3%8B%15B%C3%88%C3%B7d%C2%8A%C3%9F%C3%8B%C3%AA%C2%BA%C2%86%24IV%C3%A7%7B%C3%90%C3%87%C3%BBy%C2%9E!%C3%8Fs%C2%A8%C2%AAj\'%C2%B6%0Di%C2%9AF%04A%20Ei%C2%9A%C3%820%0C%C2%9B%0F_%C2%91e%C2%99%C2%BC%C3%A9%C3%BB%C3%BE.S%C2%93%15E%01eY%C3%8A%C2%BDz%C3%B8%0E(%7B%C3%BAg%C2%8E%C3%A3%40%14E%10%C3%871%C3%B8%C2%BE%2F%C3%A5Z%C2%9Fi%C3%8Aj2S%C3%BE%5C%C2%865b%C2%82%C3%8A%5BXl%C3%98G%3AB!%C3%84%C2%AD%C3%8F%C3%90C%C2%B1!%C2%B1i%C3%87q4kZ%C3%86%C3%82%0BM%C2%86q%40%C3%B0X%C2%BB%C3%85%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightestBottom = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDAT8%C2%8D%C3%AD%C2%941%0A%C2%840%10E\'!%C2%A6%C2%B0%10%0B%C3%BB%C2%BD%C2%82%C3%A7%C3%B2%0C%C2%9E%C3%83%03%C3%98z%11%C3%8B%C2%AD%C3%85%C3%82%C3%8AJ%5CI%C2%A1%10%C2%84%2C%3F%C2%B0%22%2B%C3%89%C2%A2%C3%9B%C3%BA%C2%9AIf%C3%88g%C2%8A%C3%B0X%C3%9F%C3%B7%0F%C2%AD%C3%B5s%5D%C3%97%C2%98.%22%C2%84%C2%98%C2%A4%C2%94)%C3%AB%C2%BA%C3%AEEDq%18%C2%86%24%C2%A5%3C%C2%9D%C2%A6%C2%B5%C2%A6y%C2%9Eq%C2%9C86%C2%BA%1A%04%C3%B0%0E%C3%AF%C2%91%C3%83%3F%0D%17%C3%8B%C2%B2P%C2%9E%C3%A7%C2%B6%C2%BA%08%C2%82%C3%80N%C2%B8c%C2%BEQU%15%C2%8D%C3%A3h%C2%AB%0B%C3%86%C3%98%C3%AF%C2%B0%C2%A6i%C2%A8%C2%AEk%7BF%C3%85%C3%9D%C2%877%C2%AC%2CK%C3%AF%C3%BD%1B%C3%96%C2%B6%C2%ADI%C2%92%C3%A40%C3%98%C2%93e%19%15Eq%C3%A8%C3%AF%19%C2%86%C3%81%C2%BF%C3%99Y%C3%AE%C2%B0%3B%C3%8C%C2%81%C3%BD%C2%B4Q%14%5D%C2%B6%06%C2%80%C2%86%C2%94R%C3%84!6%C3%B8%08%C2%8D%C2%B3%18c6%C2%9F!G%C3%80%C2%900%C2%ADR%C3%AA%3F%C3%93J%C2%99%C2%BE%01M%C3%A4c%C2%92%C2%A5rE%C3%93%00%00%00%00IEND%C2%AEB%60%C2%82';

    var lightRow = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01cIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C2%8E%C2%82%40%10%C2%86%7Fp7%C2%91%C2%84%02J%C2%ABK%2C%C2%AD%0C%3E%02%C2%96Z%C3%BA%1AP%12%C2%9E%C3%80%C3%B8%0CvV%244%14%C2%94%C3%B0%08%26V%C2%96%C2%B6%C2%96Rl%C2%82%09!%5Cfs%24\'%C2%ABw%22%7FEvf%3Ffg%26%C2%BF%C2%96%24%C3%89WUU%C2%A7%C2%BA%C2%AE-%7C%C2%A8%C3%91hTp%C3%8E%C3%A7%C2%8C%40%00%2C%C3%934%C3%819%C3%AFM%C2%AB%C2%AA%0AeYZ%C3%84%C3%91%C2%A9%22%C3%830%3E%02%C2%91%C3%A8%1E%C3%9D\'%C2%8E%C3%9E%1E%0C%11cL%C3%9E%C3%96%07Q~%C2%A4i%C2%9A%C3%BC%60%C3%9D%40%18%C2%86J%C3%B2%2Bm%C2%B7%C3%9B%C2%87%C2%88%02%C3%AB%26tu%3C%1E%C2%91%C2%A6)%16%C2%8B%C2%85%12S%60%C2%AFt%C2%BF%C3%9F%11%C3%871.%C2%97%0B6%C2%9B%0Df%C2%B3%C2%99%C2%92%C3%B9%16%C3%ACz%C2%BD%C3%A2p8%C3%80%C2%B6m%04A%C2%80%C3%B1x%C2%AC%C3%A4%C2%BC%05%C3%8B%C2%B2%0Cy%C2%9E%C3%83u%5D%2C%C2%97K%25%C3%BE%16%C2%8C%C2%9EE%C3%95%C3%9Cn7x%C2%9E%C2%87%C3%89d%C2%A2%C3%A4t%C3%B5t5%C3%8E%C3%A73v%C2%BB%C2%9D%5CF%C3%9F%C3%B7%1F%40tN%7D%7B%26%C2%A52%C2%9A%14Ml%C2%B5Z%3D%C2%9DXQ%14%C3%98%C3%AF%C3%B7r%004%C2%88%C3%9F%C3%BD%C3%93%C2%A2(j%C2%A8%C2%B1%C2%AD%C3%BA%C3%AC%C2%99eY%C2%B2r%02R%3B%C2%94%C3%8A%C3%BE%C3%9B%C2%B3%C3%B6g%C2%8E%C3%A3%60%C2%BD%5E%3FT%C2%A6%C3%80%C3%BE%12%0D%C2%85%C2%AA%C2%A1%C3%A7M%C2%A7S%25S%3E%C3%B3S%C3%BBiE6%24%C2%84%C2%80N%C3%86V%C2%96%C2%A5%3C%C3%A8%C2%AB%C2%A6iZ%3F%C2%93%06%C3%89%C3%88!%C3%89%C3%98%C2%84%10%C3%83%C2%9C%C2%96%C3%B3%C3%B97%1F%3F%C2%90%C2%BA%C2%B8%C2%A6%C3%A0%26%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightColumn = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01NIDAT8%C2%8D%C2%A5%C2%94%C2%BD%C2%AA%C2%83%40%10%C2%85%C3%87%C2%9F%05%C2%85%14Z%C2%A6%C2%BA%60i%15%C3%8C%23%C2%982%C2%96%C2%B6%C2%BEF%C3%88%13%04_%C3%83J%C2%B0%C2%B1%C2%B0%C3%94G%10RY%C3%9AZj!(%2C%C3%A2e%16%C2%BC%24%C2%AE%C3%82%C3%9D%C3%A44%C3%AB%C3%8Ea%3Fv%C3%87%C3%A1Hi%C2%9A%C3%BEPJ%C2%9F%C3%934%19%C3%B0%C2%A1%14E%C3%A9%08!\'%15A%00%60%1C%0E%07%20%C2%84%08%C3%93(%C2%A50%0C%C2%83%C2%81%1C%19o%C2%A4%C3%AB%C3%BAG%20%14%C2%9E%C3%83%C3%B3%C3%88%C2%91%C2%97%C3%827RU%C2%95%C2%9D%C2%96%C2%B7%18%C3%B7%C3%BB%C2%9D%C2%AB-%C3%8A%C2%B2%C2%8C%C3%B3%25I%C3%9A%C2%87%C3%AD%C2%A9%C2%AA*(%C3%8Br%C3%87%15%C2%80%C2%8D%C3%A3%08I%C2%92%C3%80%C3%B5z%C3%A5%3CaX%14E%60Y%16%C2%9C%C3%8Fg%C3%8E%13%C2%82%C3%A5y%0Em%C3%9B%C2%82%C3%AF%C3%BB%C2%9C\'%04k%C2%9A%06%C2%8A%C2%A2%C2%80%20%08%40%C3%934%C3%8E%C3%BF7%0C%C3%BB%C2%84%C3%8Fs%5D%17%C2%8E%C3%87%23%C3%A7%0B%C3%81%C2%B0%C3%A1%C2%A6i%C3%82%C3%A5r%C3%A1%C2%BC-%C2%A9%1B5%26%1C%C2%81%C2%BA%C2%AE%C3%A1v%C2%BB%C3%BD%C3%95%C3%820%C2%84%C2%AE%C3%AB%C3%987%C3%8E%C2%9Aa%18o%C3%BE%C3%AE%C3%8Dp8%C2%B1%C3%A1%C2%AF%7DZ%C3%BF%C2%80%C3%B5~%17%C2%86%23%60%C3%9B%C3%B6%5B%0DG%C3%83q%1C%C3%B6%C2%8D%2B%C3%AE_%C2%B5%C3%B9%C3%8C%C3%87%C3%A3%C3%81%C3%95%16y%C2%9E%C3%87%C2%9E%C2%8F%C3%ABZR%1C%C3%87%C3%B3%C2%A7%C3%B1%C2%B3%08c%C2%A8%C3%AF%7B%C2%901%C3%98%C2%86a%60%05Q%C3%8D%C3%B3%C2%BC%C3%A4%19%0BH%15%13%12%C2%83%C2%AD%C3%AF%C3%BB%C3%AF%C2%92%C2%96%C2%90%C3%93%2F%25a%C2%83%C3%98%3A%C2%8B%C2%92K%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightLeft = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B0IDAT8%C2%8D%C3%9D%C2%94%C3%81%09%C2%830%14%C2%86%C3%BFh%02%0A%1E%C3%A2%04%05\'%10%C3%B7%C3%B0%C3%A8%1C%C2%9E%C2%9D%40%C2%9C%C3%81%C2%A3%17%C2%8F%C2%8E%C3%92%09%5CA%0FB%C2%84%20%C2%96\'%0DT%04KM%C2%A1%C3%90%C3%AFf%7C%C3%BFg%1E%C3%88%C3%8F%C2%BA%C2%AE%C2%BBi%C2%AD%C3%AF%C3%8B%C2%B2H%5C%C3%84u%C3%9DQ%08%11s%12%01%C2%90A%10%40%08%C3%B1%C2%B1Mk%0D%C2%A5%C2%94%24%C2%8FC7%C3%B2%7D%C3%BF%C2%92%C2%88%C2%A0%1C%C3%A5%C3%89%C3%A3%C2%98%03%1B8%C3%A7%5B%C3%9A%C2%B1%C2%B2%3Ca%C2%8C%7DOf%C3%B8%C2%AD%C2%AC%C2%AA*%C3%B4%7D%7F8%C2%BF%24%1B%C3%87%11u%5D%C2%A3i%1A%C3%8C%C3%B3%C2%BC%7B%C3%87%C3%9A%C2%B6%5D%C3%830%C3%9C%1E%C2%8A%C2%A28%C2%84%C3%8F%C2%90R%22%C3%8Fsx%C2%9E%C2%87a%18%C3%80_g%C3%8B%C2%B2%3C%C2%89b%C3%B7%C3%81%24I%C2%90%C2%A6%C3%A9%262%C3%B0%C3%83%C3%B4%09%C2%B4%16%C3%9D%26%C3%8B2DQt%18%C3%9C%C2%ADi%03%C2%AD%C3%B9G%C3%BF%C3%99%5B%19%C3%95%C2%88%0D%26%C3%AFP%C2%B1)%C2%A5.%09%C3%97u5%7D%C2%B6%15%24%C2%A7%C2%86%C2%A4b%C2%9B%C2%A6%C3%89%C2%AEi%C2%85%C2%88%1F%C2%BC%04b%C3%8E%C2%B9%C2%A3%C3%A0%C2%9F%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightTop = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%90IDAT8%C2%8D%C3%AD%C2%94%C3%81%09%C3%84%20%10EG%C3%A3%1C%029%C3%98%C3%81B*%08%C3%A9%23%C3%87%C3%94%12RB%3A%C3%B1%C2%98R%C2%B6%14%0F%C2%82%07%09._%10%02%01%C2%97%C2%B8%7BZ%C3%B6%5DFG%7D(%C3%88%17%C3%BB%C2%BE%3FB%08%C3%8F%C3%A384U%C3%924%C2%8De%C3%A6AADD%C2%BA%C3%AB%3Ab%C3%A6%C3%9B%C2%B6%10%02y%C3%AF5%3C%127j%C3%9B%C2%B6J%04p%0E%C3%A7%C3%A1%C2%91%C2%B9Qb%5D%C3%97%C3%82*%C2%91R*UyY%C2%A9%40%08%C3%B1%3DY%C3%A6%2F%C3%BB%25%C2%99%C2%BAtNl%C3%9BF%C3%96%C3%9A%C3%94%C3%80%C3%87%C3%95Z%C3%93%C2%B2%2C%C2%97%7D%C2%99%C3%A2%C3%8D%C3%A6y.%C3%8Eo%C3%89%C3%BA%C2%BE%C2%A7q%1C%C3%93%18%15%C3%B3%12E%19%C2%98%C2%A6)%3D%0F%C3%B5%1D%C3%82%18%13k%C3%A3\'%C2%83%18r%C3%8E%C2%91D%C2%B0y%C3%AFS%C3%A3.1%C3%86%C2%9Cg)%20%15%12%12%C3%81%C3%A6%C2%9C%C3%BB%2Ci%C2%99%C2%87%17p%C2%B5O%05%C3%94%C2%BBb%C3%91%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightRowRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01tIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C2%8E%C2%82%40%10%C2%86%07%C3%98M4%C2%B1%C3%80%C2%92%C3%AA%12J%2B%13J%5BKK%2C-m%C2%B1%24t%C3%97%11J%5B%C2%9F%C2%80%C2%84%C3%86%C3%84%C3%A7%C3%90%5CEIK)%05%C2%89%26%1B%C3%83%C3%A5%C3%9F%1Cw%08%C2%8B%17%C3%B5%C2%AB%60v%C3%A6%C3%9F%C3%99%C2%99%C3%89h%C3%BB%C3%BD%C3%BEC%08%C3%B1u%C2%BB%C3%9DLz%11%C3%830%0A%C3%8E%C3%B9%C2%94A%C2%88%C2%88%C3%8C%C3%91hD%C2%9C%C3%B3%C2%A7%C3%95%C2%84%10t%C2%B9%5CL%C3%A8%C3%A8%C3%88h8%1C%C2%BE%24%04%10%C2%87x%C3%A8%C3%A8%C2%B5%C3%A1%1D%18c2Z%7FK%C3%A5%07M%C3%93%C3%A4%07k%1F%04A%C3%90q%C3%AE%23%0C%C3%83%C2%BB%C2%93%C2%8E%C3%98l6%C2%A3%C3%A3%C3%B1H%C2%8B%C3%85%C2%82%1C%C3%87%C3%A9%C2%91Q%C3%93%11%C2%83%C2%88m%C3%9B%C2%94%24%09%C2%A5iJ%C3%8B%C3%A5%C2%92%06%C2%83%C2%812%C2%B8%C2%8D%C2%B2f%C2%93%C3%89%C2%84%7C%C3%9FG%C3%8Bi%C2%BB%C3%9DR%C2%9E%C3%A7%1D%1F%15%C2%86%C3%AB%C2%BA%C2%9Fhm%1Bt%08%C3%8F%C2%BC%5E%C2%AF%14%C3%87%C2%B1%3CE%C3%86%7D%C3%80O%C2%99Y%C2%93%C3%B9%7CN%C2%9E%C3%A7%C3%89%3A%C3%AEv%3B%19%C3%94%C2%87R%2C%C3%8B2%C2%8A%C2%A2%C3%A8%C3%B7%C3%9F%C2%B2%2C%C3%9Al6r8aG-U%C3%9C5%00%C2%B7%C3%96%C2%85o%C2%83%26%C2%ACV%2B%C2%99!%7CP%024%C2%AB%C2%89%16%C3%87q5%1E%C2%8F%C2%A5%10%C2%8A%5D%14EG%C2%A8%C2%8F%C3%A6%C2%9C%C2%9D%C3%8F%C3%A7%C2%BF%C3%8Cp3%C2%9Er8%1C%C3%A8t%3AI%5B%7B(%C3%BF%C3%A3%C2%AEf%10%C3%84%5C%C2%AD%C3%97k2M%C3%B3a%C2%B1U%C3%88g%C2%BE%C2%BA~j%C2%B0%C2%86%C3%8A%C2%B2%24%1D%C2%8B%0D%C3%83%09%C3%83%C2%B3TUU%C3%AF3%C2%B9%20%196%24%16%5BY%C2%96%C3%AFmZ%C3%8E%C2%A7%C3%9Fz%C3%8A%C2%9F%C3%9Fb-EK%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightColumnRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01QIDAT8%C2%8D%C2%A5%C2%941%C3%8A%C2%83%40%10%C2%85G%C2%B3%0B%0A%16%C2%A6%C2%B4%C3%BA%C3%81%C3%92*%24GH%C3%8AX%C2%A6%C3%B5%1A%C3%A2%11%C2%BC%C2%86U%C3%80%26%C2%85%C2%A59B%20%C2%95%C2%A5%C2%ADe%2C%04%03%22%C3%BE%C2%BC%05%C3%81D%C3%97%10%C3%B3%C2%81%C3%AC%C3%8E%0C%C3%B3%C3%98%5D%C2%87%C2%A7%5C.%C2%97%C2%BF%C2%A6i%C3%AEm%C3%9B%C2%9A%C2%B4%C2%90%C3%95jUr%C3%8E7%0CBDd%1A%C2%86A%C2%9C%C3%B3%C2%AF%C3%95%C2%9A%C2%A6%C2%A1%C2%BA%C2%AEM%C3%A8%C2%A88%C2%91%C2%AE%C3%AB%C2%8B%C2%84%00%C3%BA%C3%90%0F%1D%C2%B5O%C3%BC%02cLt%C2%ABS%1AA%10P%C2%92%24%C2%A3%C3%BC%C2%B0%3EDQ%14%C2%B9%18%C2%B8%C3%9Dn%C2%94e%C3%99(%3F%C2%87T%C3%ACx%3CR%1C%C3%87%C3%B4%7C%3EG5%19R%C2%B1%C3%9DnG%C2%B6mS%14E%C2%A3%C2%9A%0C%C2%A9%188%C2%9DN%C3%B4x%3C(M%C3%93Qm%C2%8AY1M%C3%93%C3%88%C3%B3%3C%C2%BA%5E%C2%AFT%14%C3%85%C2%A8%C3%BE%C3%8E%C2%AC%18%C2%B0%2C%C2%8B%C3%B6%C3%BB%C2%BD%C2%B8%C3%AE%C2%A7%C3%B7%C3%BB(%06%0E%C2%87%03%C2%AD%C3%97k%C3%B1C%C3%A6%60%C3%83Z%18%C2%86T%C2%96%C2%A5%C3%98c%C2%96L%C3%93%24%C3%9F%C3%B7E%C2%8C%C3%AB%C2%A2%C2%8E%C2%91%C2%91%C3%B1r2%3C%C2%B8%2C%C3%86%C3%BB!%C2%9E%1B%C3%A6%171%C2%8C%C3%82v%C2%BB%15%7B%C2%AC%C2%88%C2%878%C2%8E%23FF%06%7B%C3%8F%C2%BB%C2%AEKy%C2%9E%C2%8Bu%0A%0C3%C2%BE)%C2%94%C3%B3%C3%B9%C3%9C-%C2%B5%C2%9F%1E%C3%98PUU%C2%A4%C3%82%C3%98%C3%AA%C2%BA%16%C2%89o%C3%A9%C2%BA%C2%AE%C3%B73a%C2%90%0C%0E%09c%C2%AB%C2%AA%C3%AA7%C2%A7%C3%A5%7C%C3%B3%0F%C2%A0V%C2%82%C3%81%C2%98%C2%A8l%24%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightRight = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B6IDAT8%C2%8D%C3%8D%C2%941%0A%C2%830%14%C2%86_4%01%05%C2%87x%C2%82%5E%C3%81%C3%8Bx%04ggO%20%C2%8E%C3%9EBp%11%C2%BC%C2%87tr%C3%B4%0A%3A%08%11%C2%82X%C2%9E4%C2%92R%C3%81%1A%5B%C3%A8%C2%B7%C3%A5%25%C3%BFGH%C3%A0\'UU%C3%9D%C2%A4%C2%94%C3%B7y%C2%9E9%18b%C3%9B%C3%B6%C3%80%18%0B(%C2%8A%00%C2%80%7B%C2%9E%07%C2%8C%C2%B1%C3%936)%25%08!8z%2C%C2%BC%C2%91%C3%AB%C2%BAF%22%04s%C2%98G%C2%8F%C2%A5%06W%C2%A0%C2%94%C2%AEi%C3%AB%C2%92%C3%A5%09!%C3%A4%7B2%C3%85%C3%AFe%5D%C3%97A%C2%96eo%C3%B3%23%C2%A8%C2%BE%3FM%13%C2%94e%09m%C3%9B%1E%C3%84%C3%B6%C3%99d(%C3%8A%C3%B3%1C%C2%86a%C3%98%0E%26I%C2%B2%1B%C3%92I%C3%93t%5Bm2%C3%87q%20%C2%8Ec%C2%A8%C3%AB%1A%C2%9A%C2%A6Yg%C3%BA%C3%81Oxy3%14%C2%86a%08Q%14%01%C3%A7%7C%C2%BD%C3%AD%19HQ%14%C2%8B%C3%AF%C3%BBFo%C2%A4%C3%93%C3%B7%C3%BD%C3%BEo%C2%9A%C3%B2%C3%A72%C2%AC%C2%91%2B%C2%A8%C2%BC%C2%85%C3%85%26%C2%840%12.%C3%8B%C2%A2%C3%BAl-H%C2%8A%0D%C2%89%C3%856%C2%8E%C3%A3%C2%B5%C2%A6e%2Cx%00%40Zf%07%16U%C2%BC%C3%8C%00%00%00%00IEND%C2%AEB%60%C2%82';
    var lightBottom = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8EIDAT8%C2%8D%C3%AD%C2%94A%0A%C2%840%0CE%C3%93%C3%9A%2C%04%17%C3%9E%60%C2%AE%C3%A0%C3%AD%C3%84%13%C2%887)%C2%B8%11%C2%BC%C2%87%C3%8C%09%3CC%17%C2%85%0AE%3A%24%C2%A0%0CJ%3B%C3%A8l%7D%C2%9B4%09%7Dd%C3%B5%C3%850%0C%2F%C3%AF%C3%BD%7B%5D%C3%97%12n%C2%92e%C2%99A%C3%84J%C2%91%08%00%C3%8A%C2%A2(%00%11%2F%C3%9B%C2%BC%C3%B7%C3%A0%C2%9C%2B%C3%89%23%C3%A9%C2%A2%3C%C3%8Fo%C2%89%08%C3%BAG%C3%BF%C3%89%23%C2%B7A%C2%8CeY%C2%A0%C3%AB%3A%C2%AE1%C2%94R%C2%BC%C2%91%C2%91%C3%BD%C3%8E8%C2%8E%60%C2%8C%C3%A1%1AC%08%C3%B1%5B6%C3%8F3L%C3%93%C3%84o%C2%AA%C3%94%C2%A7H%C3%8A%C3%BA%C2%BEO%C3%B6G%C3%94i%C3%B2E%5D%C3%97%C3%9C4M%03m%C3%9B%C2%9E%C3%B6G%C2%92%C2%97%5D%C3%A5%C2%91%3D%C2%B2%08Bk%1D%C3%AE%C3%86%C3%8F%06%C3%85%C2%90%C2%B5%16%24%05%C2%9Bs%C2%8E%07W%09!ly%C3%86%01%C2%A9(!)%C3%98%C2%AC%C2%B5%C3%BF%25-b%C3%B5%01%C2%81%C3%8Ba%17%C3%AD%C2%8DO%1F%00%00%00%00IEND%C2%AEB%60%C2%82';

    var darkRow = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%5DIDAT8%C2%8D%C2%A5T%3D%C3%8E%C2%82%40%10%1D6%C2%9B%C3%8D%16%26li%C2%87%C2%9D%25%C2%9E%00J%3AK%12%1A%C2%B8%C2%817%C2%B0%C3%B2%06%C2%96z%0A%C3%AD%C2%A4%C2%83%13hiig%09%09%C2%85!%C2%8B%C2%98%C3%99OL%60%C3%B1%C3%B3%C3%AF%C2%95%C3%B3%C3%B3%C3%B6%C3%8D%C3%8E%C3%A4%19A%10X%C2%94%C3%92%3D!D%C3%80%C2%97%C2%B8%5E%C2%AF%C2%99%C2%94rB%C2%91%08%00%C3%84%C3%A5r%01)%C3%A5%C3%87l%C2%94R%60%C2%8C%C2%89%C2%BB%20%22%C3%8A%C2%B2%C3%BC%C2%8A%08%C2%81%7D%C3%98%C2%8F%3C%C2%A4%09%C3%BC%C2%82%C2%AA%C2%AAT7%C3%B9%C2%89%C3%A5%C2%8E%C2%BA%C2%AE%C3%BFF%C3%AE%26%C3%A6%C3%B3%C2%B9V%C3%BC%0C%C2%8B%C3%85%C2%A2%C2%95%C3%91%C3%88%C2%BA%05%5D%C3%98%C2%B6%0D%C2%9E%C3%A7%C3%81%C3%A1p%C3%90r%1A%C3%993p%C3%8Ea%3A%C2%9D%C3%82h4%C2%82%C3%8Df%03%C3%87%C3%A3Q%C2%AB%7C%C2%8Bl8%1C%C2%82%C3%AF%C3%BB%C2%90e%19%2C%C2%97K%C3%803%C3%AA%C3%83K2%C3%97u%C3%81q%1CH%C3%93%14%C2%92%24%C3%91%C3%B2o)%C3%83%C2%B1P%C2%8D%10%02%C3%96%C3%AB5%C2%9C%C3%8Fg%C2%AD%C2%A6%C2%8B%C3%9E%C3%93%18%C2%8F%C3%870%C2%9B%C3%8D%C3%948%C2%AB%C3%95%C2%AAE%C2%84q%C3%8B%C2%B2%C2%B4%C2%9E%5Ee%C2%B8)%C3%9C%C3%98n%C2%B7%C3%AB%C3%9D%C2%98i%C2%9A%10%C2%86%C2%A1Z%C3%80v%C2%BBm%C3%BD%C2%9F%11EQ%5D%14%C3%85%23%C3%B0%C3%89%C2%9D%C3%A5y%C2%AE%C2%94%23%C3%A1%600%C3%90%C3%89%5E%C2%A1y%0CU%C3%87q%C3%BCP%C2%86d%C3%9A%C2%98%C3%BF%01%C2%97%C2%82j%C3%B0%C3%8EN%C2%A7%C2%93V%C2%A9%C2%94%7Dk%3F%0D%C3%90%C2%86%C3%B0!%C2%82%C3%86%C3%86%18S%C2%81Oa%18F%C3%A3g%C3%8A%20%C3%A9%C3%9D!%C3%B7%C2%9C%C3%B3%C3%9F%C2%9CV%C3%8A%C3%89%0D%08i%C2%A1%C3%96%C3%8D3%C2%81%C3%8C%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkColumn = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01JIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C3%8E%C2%820%14%C2%85%2FM%C3%93t%C2%A3%C2%A3%C3%9B%C3%8F%C3%86%C2%A8O%C2%A0%23%1Bl%26N%C2%BE%01o%C3%80%C3%84%1B%C3%B0%18l%C2%BA%C3%89%C2%86O%20%23%1Bl%C2%8C%C2%B8%19S%C3%A1%C3%8Fm%C3%84%C2%A8%05%C2%93%C3%AA%C2%B7%C2%94%C2%9E%C2%93%C2%9E%C3%9C%C2%96%C2%9Bkm6%C2%9B%3FJ%C3%A9%C2%89%10%22%C3%A0K%C2%BA%C2%AEk%C2%A5%C2%94%0B%C2%8AA%00%20.%C2%97%0BH)%C2%8D%C3%93(%C2%A5%C3%80%18%13%C3%B7%C2%82%C2%88%C2%B8%5E%C2%AF_%05!x%0E%C3%8Fc%0E%19%C2%84_%C2%B8%C3%9Dn%C3%AA4%19%C3%8B%C2%88%C2%A2H%C3%93%06%3C%C3%8F%C3%93%C3%BC%C2%BE%C3%AF%C2%A7%C3%83%C2%A6p%5D%17%C3%A6%C3%B3%C3%B9%C2%84k%10%C3%869%C2%87%20%08%C3%A0p8h%C2%9Eq%C3%98z%C2%BD%C2%86%C2%AA%C2%AA%C2%A0(%0A%C3%8D3%0A%5B%C2%ADV%20%C2%84%C2%80%C3%BD~%C2%AFyFa%C2%B3%C3%99%0C%C2%96%C3%8B%25%C2%A4i%0A%C3%98%C2%8B%C2%9F%C3%B8%18%C2%86%C3%AF%C2%84%C3%97%3B%1E%C2%8F%C3%904%C2%8D%C3%A6%1BU%C3%A6%C3%BB%3E%C2%B4m%0By%C2%9Ek%C3%9E%18tDS%60%0B8%C2%8E%03I%C2%92%3C%C2%B40%0C%C3%81%C2%B6m%C3%B5%C2%8D%C2%BDv%3E%C2%9F_%C3%BC%C3%89%C3%8A%C2%B09w%C2%BB%C3%9D%C3%8B%3B%C3%A1%C3%BE%C2%99%C3%B7%C3%BDd%18%C2%B6%40Y%C2%96%2FZ%5D%C3%97%C2%8F%C3%96%C3%80%15%C3%B7%C3%8F%C2%8C%5E3%C2%8EcM%1B%C3%88%C2%B2L%5D%1F%C3%97w%C2%AC%C3%ADv%C3%9B%7F%3B~%06p%0C%C3%A1%C2%9F\'8%C3%98%18cJ0%C3%85%C2%B2%C2%ACa%C2%9E%C2%A9%01I%C3%AF%13%C3%B2%C3%849%C3%BFm%C3%92J%C2%B9%C3%B8%07%C3%A5n%C2%8D%C3%AF%C3%B1%0B%C2%BB%C2%82%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkLeft = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%AAIDAT8%C2%8D%C3%9D%C2%94%C3%81%09%C2%840%10E\'a%089%08%C3%9A%C2%81-X%C2%8D%C3%A0E%3B%C2%B0%03%C2%9B%C3%B0h%17%5E%C2%ADBK%C2%B0%C2%83%15%3C%C2%88%C2%8Cf%191%07%11v%C3%97%C2%B8%C2%B0%C2%B0%C3%AF%C3%A6%C2%84%C3%BF%C2%9C%40%C3%B8%22I%C2%92%10%11%5B)e%00%C2%8E%C2%AC%C3%AB%C3%BA%20%C2%A2%08Y%04%00%C3%814M%40D%C2%97m%C2%88%08J%C2%A9%60_H%06%C3%B3%3C%3B%C2%89%18%C3%8Eq%C2%9E%3D%C3%92%0E%C3%AE%C2%B0%2C%C3%8B%C2%96%C2%96%C2%B7%2C%3B%C3%86%C2%98%C3%AF%C3%89%2C%C2%BF%C2%95%C3%A5y%0Ea%18%C2%9E%C3%A6N2%C3%9F%C3%B7!MS%C2%88%C3%A3%18%C2%B4%C3%96%C2%873%C2%91e%C2%99%19%C3%87q%C3%BB(%C2%8A%C3%A2%14~%C3%850%0CPU%15%C3%B0%1B%C3%B5%3C%C3%AF(%C3%BB%04%C3%BB%C3%83%C2%AE%C3%AB%C2%A0i%C2%9AM%C3%84%C2%B0%0C%C2%AFl%C3%82%C3%97%C3%A2m%C3%AA%C2%BA%C2%86%C2%BE%C3%AFO%C3%A7%C2%97d%C2%BCEY%C2%96%C2%A7%C2%B9%C3%A5%C2%8F%C3%9E%C3%99%5B%19%C3%97%C3%88%1Dl%5Er%C2%B1)%C2%A5%C2%9C%C2%84B%08%C3%9Bg%5BA%C3%A2%C3%9E%C2%90%C2%AD%C3%96%C3%BA%5E%C3%93%12EO%12Ie%C3%A0%1C%C2%89%3EX%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkTop = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDAT8%C2%8D%C3%AD%C2%94%C2%B1%0D%C2%830%10E%C3%8F%C3%96%C3%89r%C2%81%C2%847%C3%88%0A%C2%ACC%C3%85%06l%C3%80%12%C3%9E%C2%84%C2%96)%60%046%08%12%05B%07%C2%8E%C3%8E%C3%82)%C2%82%C3%A4%08\'U%C2%94%C3%97%1C%C3%A7%C3%83O%C2%B6%C2%8B%2F%C3%8A%C2%B2%C2%BC!b%2F%C2%A54%C2%90%C3%88%C2%BE%C3%AFw%22*%C2%90E%00%60%C2%96e%01%22%C2%BAlCDPJ%C2%99%C3%A3%40%C3%92%C2%AC%C3%AB%C2%9A%24bx%1F%C3%AFg%C2%8F%0C%0B1%C2%9A%C2%A6%C2%89L%01%C2%B6m%C3%B3U%C2%9E%26%098%C3%A7%C2%BE\'%0B%C3%BCe%C2%BF%24%13UU%C2%B9y%C2%9EO%03%C2%A6%C2%AEk%C3%88%C3%B3%C3%BC%C3%99O%C3%93%04%C3%96%C3%9A%C3%93%7FL%C2%96e%C3%B1%C2%93%C2%B5m%1B%C3%AD_%C2%89%C3%8A%C3%86q%C2%84a%18%C3%BC7W%C3%AEcDeL%C3%97u%C3%BEz%5C%C3%9F%C3%A1%C3%9F%2C5~%02%1CCZk%C2%90%1ClJ)%C2%BFp%15!D%C3%883%1F%C2%90x%24d%C2%AF%C2%B5%C3%BE%2Ci%C2%89%C2%8A%07%C2%82xcu%00%C3%A6%0D%C3%94%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkRowRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01xIDAT8%C2%8D%C2%A5%C2%94%C2%AF%C2%8E%C3%82%40%10%C3%86%C2%BF%C3%AEm%C2%9A%15%24T%C2%92TT%22%C3%A9S%60H%20%C2%A9%C3%83%C2%80C%C3%B6%0DH.%C3%A1%0D%C2%90%C3%A0%C2%90H%1C%12%C2%8B%02%C2%89%40%C3%A0*%10G%C2%82%20d%C3%9B%5Ef%C2%AF%C3%A5%C2%80%C3%9D%1E%07%C3%BC%C3%9C%C3%AE%C3%8E%7C%C3%B3%C2%A7%C3%93%C2%B1%C3%9A%C3%AD%C2%B6%C3%879_1%C3%86%1C%C2%BCH%C2%92%24_RJ%C2%9F%C2%93%10%00%C3%A7t%3AAJ%C3%B9%C2%B4%1A%C3%A7%1C%C2%B6m%3BYB%C3%8C9%C2%9F%C3%8F%2F%09%11%C3%A4G%C3%BE%C2%A4%C3%83%C3%B2%C2%8Bw%C2%88%C3%A3Xy%C2%B3%C2%B7T2%C3%924%C3%BD)%C3%B9%C3%BE%C2%A1%C3%9F%C3%AFk%C3%86E%0C%06%C2%83%C2%9B%17Ml%C2%B9%5C%C2%A2V%C2%ABa%3E%C2%9Fc%C2%BD%5E%17%C3%88%C2%98%C3%B9%C3%B0%7D%C3%BF%C2%93%1A%C2%98%C2%B3%C3%9Dn%C2%B1%C3%9F%C3%AF%C3%91h4%C3%A0%C2%BA%C2%AE%3A%C3%BF%C2%A7%C2%A7%C2%B6m%C2%9B%7B%C2%B6%C3%99l0%1C%0E!%C2%84%40%C2%AF%C3%97C%C2%A5R%C3%91lLh%C2%99%C3%A5P6T%26%09%06A%00%C3%8B%C2%B2%C2%B0%C3%9B%C3%AD4%C2%BB%C2%87%C2%99%5D%C2%B3X%2C0%1E%C2%8FU%1F%3B%C2%9D%C2%8E%12%2F%C3%82(%C3%A6y%1E%C3%820%C2%BC%C2%9C%C2%A3(%C3%82h4%02%C3%BD%25t_%C2%ADV5%1F%C3%9C%7FM%C2%8A%C3%9Al6%C2%8D%C3%86%244%C2%9DNU%C2%86%C2%ADVK%C2%B5%C2%80%C2%BE%C3%B85V%C2%B7%C3%9BM%C2%8F%C3%87%C3%A3%C2%A5%C3%99%C3%A5rY%13*%C3%A2z%C3%8EJ%C2%A5%C3%92of%14%C2%99J%C2%A9%C3%97%C3%AB*%3A%0CC%C3%B9%C2%88%C2%9B%C2%9E%C2%91%C3%A0l6%C3%83d2%C3%81%C3%A1p%C3%B8%C2%B3%C3%99%26T%C2%99%C2%AF%C2%AE%C2%9F%1CZC%14%C2%98%C3%91b%C2%A3%19%C2%A1%C2%8Bg%C2%A1%C3%99%C3%8B%C3%B6%C2%99Z%C2%90%3C%C3%9B%C2%90%2B!%C3%84%7B%C2%9BVJ%C3%BF%1BB%C2%84%C2%A5%C2%BF%09m%C3%87%C3%BC%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkColumnRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01OIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C3%8E%C2%820%14%C2%85%2FM%C3%93t%C2%A3%C2%A3%C2%9Bl%C2%8C%C3%B8%04%3A%C2%B2%C3%A1F%C3%A2%C3%84%1B%C3%B0%06%C2%BE%04%C2%8F%C3%81%C2%86%C2%9Bn%C3%B2%04%3A%C2%B2%C3%81%C3%86%C2%88%C2%9B!%15%C3%BE%C3%9CF%C3%BF%C2%A0%C2%A5%18%C3%B5K%08%C3%9C%7B%C3%92%C2%93%C2%B6%C2%9C%5Ck%C2%B3%C3%99%C3%8C)%C2%A5\'B%C2%88%C2%80%2F%C3%A9%C2%BA%C2%AE%C2%91R.(%1A%01%C2%80%C2%B8%5E%C2%AF%20%C2%A5%C3%BC%C3%98%C2%8DR%0A%C2%8C1q%C3%9F%10%11m%C3%9B~e%C2%84%C3%A0%3A%5C%C2%8F%3E%C3%A4%C3%91%C3%B8%C2%85%C3%9B%C3%AD%C2%A6V%C2%931%C2%8F%C3%ADv%0B%C2%BE%C3%AFk%C3%BD%C2%A1%3E%C2%A4%C3%AF%7B%C2%B3%19%C3%A2y%1E%C2%B8%C2%AE%C2%AB%C3%B5%C2%A70%C2%9A%C3%AD%C3%B7%7BX%C2%AF%C3%97%C3%809%C3%974%13F%C2%B3%C3%B3%C3%B9%0CeYB%18%C2%86%C2%9Af%C3%82h%C2%86%C3%ACv%3B%10B%C3%80j%C2%B5%C3%92%C2%B41%26%C3%8D0%7Bi%C2%9A%C3%82r%C2%B9%C2%84%C3%99l%C2%A6%C3%A9%C2%AFL%C2%9A!u%5DC%C2%9E%C3%A7%C3%AA%C2%B8%C3%AF%C3%AE%C3%AF%C2%AD%19r%3C%1E%C2%A1i%1A%08%C2%82%40%C3%93%C2%86%C3%90a%11%C3%871%C3%98%C2%B6%C2%AD%C2%BE1K%C2%97%C3%8B%05%C2%92%24Q5%1E%17u%C2%8C%C2%8C%C2%89%C2%A7%C2%9DeY%06%C2%A6%1A%C3%AF%0F%C3%AB%C2%A90%3F%C2%99UU%C2%A5%22%01%C3%B7h%60%3D%C2%A4(%C2%8A%7F%7D%0C%C3%BA%C3%9A%3B%1C%0E%C3%A08%C2%8Ez%C2%8F%C2%81a%C3%86g%0C%2B%C2%8A%C2%A2%C3%BE%C3%9B%C3%B1%C3%B3%00%C3%87%10%C3%BEi%C2%82%C2%83%C2%8D1%C2%A6%1A%C2%9FbY%C3%96c%C2%9E%C2%A9%01I%C3%AF%13%C3%B2%C3%849%C3%BFm%C3%92J%C2%B9%C3%B8%03r9%C2%91%C3%AE%C2%90%C2%B2%20G%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkRight = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%ACIDAT8%C2%8D%C3%8D%C2%94%3F%0A%C2%830%14%C2%87_%C3%82%23d%10%C3%B4%06%C2%8E%C2%8Ez%0AGw\'7G%2F%C3%A1-%1C%3D%C2%82\'%C3%B1(%15%1CD%C2%A2%C2%96%17%0Cm%C2%A9%C3%856i%C2%A1%C3%9F%C3%B8%C2%92%C3%B7%C3%B1%C3%B2%C2%87%1F%C3%8B%C3%B3%3CD%C3%84%C2%9Es%1E%C2%80%25%C3%AB%C2%BA%5E%C2%94R%09%C2%92%08%00%C2%82i%C2%9A%40)%C3%B5%C2%B1%0D%11A%08%11%C3%AC%03%C3%B1%60%C2%9Eg%2B%11A%7D%C3%94O%1En%0A.%2C%C3%8B%C2%A2%C2%BB%C2%B9%C2%93eg%C3%9B%C2%B6%C3%AF%C3%89%0C%C2%BF%C2%97%C2%85a%08UU%3D%C3%95%C3%8F%C3%80%C3%BBu)%25dY%06Q%14%C2%9D%C2%B4%1D%C3%83%C2%8A%C2%A2%C3%98%C3%86q%C3%94%C2%A2%C2%B2%2C%C3%81%C3%B7%C3%BD%C3%83%C2%8D%C2%AF%C2%A8%C3%ABZ%C2%AFx%C2%9Ew%C2%9B%C2%8C%3Em%C3%934%C2%90%C2%A6)%C3%84q%C2%ACkf%C3%A3%C2%BB%3C%C3%9C%19%09%C2%BB%C2%AE%C2%83%C2%B6ma%18%06%3D%C2%AD%C3%951%5D%C2%A1c%1E%C2%BE%C2%A6-%7F.%C2%A3%18q%C3%81%C3%B4s%0A6!%C2%84%C2%95%C2%901f%C3%B2L%07%24%C3%AE%09%C3%99K)%C3%9D%C2%92V%C2%A9%C3%A4%0A%26%C2%B6%5B%24%C3%A8%C3%BE)n%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkBottom = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%89IDAT8%C2%8D%C3%AD%C2%94%C2%B1%0D%C2%840%0CE%C2%9D%C3%88%C2%8A%C3%92%C2%91%0D2%02LAKM%C3%85%06l%40%C3%85%06L%C3%86(W%22d%C3%88%C3%89%16%C2%9CN%C2%A0%C3%A4%04%C3%97%C3%B2%1A%C3%87%C2%B6%C3%B2%C3%A4%C3%AA%C2%AB%C2%BA%C2%AE%3D%22%C2%8EZk%077Y%C3%97%C3%B5ED%05%C2%B2%08%00%C3%9C4M%40D%C2%97m%C2%88%08%C3%86%18%C2%B7%1D%C2%A4%C3%9D%3C%C3%8F%C2%B7D%0C%C3%BF%C3%A3%C3%BF%C3%AC%C3%91%C3%BB%20%C2%86%C2%B5%16%C3%9A%C2%B6%C2%95%1AcY%16%C3%99%C3%A8%C3%88%C3%BECY%C2%96%C2%90e%C2%99%C3%94%18!%C2%84%C3%9F2%C3%AF%3D%C3%A4y.o%C2%AE%C3%9C%C2%A7H%C3%8A%C2%AA%C2%AAJ%C3%B6G%C3%B04%C3%B9b%18%06i%C2%BA%C2%AE%C2%83%C2%BE%C3%AFO%C3%BB%23%C3%89%C3%8B%C2%AE%C3%B2%C3%88%1EY%04%C3%954M%C2%B8%1B%3F%3B%1CC%1C%04%C2%9A%C2%83%C3%8D%18%23%C2%83%C3%8B%C2%97(%C2%B5%C3%A7%C2%99%04%24n%099Zk%C3%BFKZ%C2%A2%C3%A2%0D%C3%85%C2%88M%13%5D%C3%88T%C2%91%00%00%00%00IEND%C2%AEB%60%C2%82';

    var darkestRow = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01XIDAT8%C2%8D%C2%A5%C2%94%C2%B1%C2%8E%C2%82%40%10%C2%86%C2%87%C3%8DfCA%22%1D%C2%9D%C3%97%C3%99%C2%99XR%18%2B%3B%3BK%C3%9F%C3%807%C3%A0%11%7C%03J%C2%9F%C3%82%0E%3A%1E%C3%80%C2%84N%3B%3A%3AI(%C3%90%2Cr%C3%B9%C3%B7%C3%80%C3%9C%C2%B1%C2%A8%07~%C3%896%C2%B3%C2%B3%C3%BF%C3%BE%C2%B3%C2%B3%19%C3%83u%C3%9D%2F%C3%8E%C3%B9%C2%911f%C3%93%40%C3%AE%C3%B7%C3%BBEJ9%C3%A3%10%22%22%C2%BB(%0A%C2%92R%C3%B6V%C3%A3%C2%9C%C2%93%10%C3%82%C2%AE%0D1%C3%BBv%C2%BB%0D%12%028%C2%87%C3%B3%C3%90aM%C3%A0%13%C3%8A%C2%B2T%C2%A7%C3%99G*5UU%C3%BD%C2%94%C3%9C%C3%9E%C3%B0%3COK~%C3%86n%C2%B7%C3%BB%C2%B3%C2%A3%C2%89%C2%B5%13%C3%9AL%C2%A7SZ.%C2%97%14%C3%87%C2%B1%C2%B6%C2%A7%C2%89%3D%C3%834MZ%C2%ADV4%1E%C2%8F%C3%A9p8%C3%90%C3%A9t%C3%922%C3%BF%25%C3%A68%0E%C2%AD%C3%97k%C3%8A%C2%B2%C2%8C%7C%C3%9F\'%7C%C2%A3.%C3%9E%C2%8A%C3%8D%C3%A7s%C2%B5%C2%A2(R%C3%AB%15O%C3%85P%16%C3%9C%C2%8CF%23%C3%9A%C3%AF%C3%B7%C2%94%C2%A6%C2%A9%C2%96%C3%93%C2%A6%C3%B3kL%26%13%C3%9An%C2%B7t%C2%BD%5E5!%C3%84%C3%B1n%5Dh%C3%8E%C3%90)t%2C%08%C2%82%C3%8E%C2%8E%C3%81%C3%A9f%C2%B3%C2%A1%C3%B3%C3%B9%C2%AC%1A%C3%B1%C3%BB%C3%BD%C2%8C%C3%85bQ%C3%A5y%C3%BE%08%C3%B4%C3%B9gh%08%C2%9CC%C3%90%C2%B2%2C%5D%C3%AC%1D%C3%8Dep%1D%C2%86%C3%A1%C3%83%19%C3%84%C2%B42_%C2%81%C2%A6%C3%80%0D%C3%8AK%C2%92D%C3%8BT%C3%8E%C2%86%C2%8E%C2%9F%06%C2%8C!%5C%C3%840%C3%98%C2%84%10*%C3%90%17%C3%830%C2%9Ay%C2%A6%06%24%C2%AF\'%C3%A4%C3%914%C3%8D%C3%8F%26%C2%AD%C2%94%C2%B3o%40V%C2%A0V%C2%A0%C2%8C%C3%BE%C2%A0%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestColumn = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%3AIDAT8%C2%8D%C2%A5%C2%94!%C2%8E%C2%850%10%C2%86%C2%87%C2%A6!8p8%C3%96%C3%A1H%C2%9ED%10%14%0E%C3%87-%C2%B8%01G%C3%A0%06%C3%9C%02%C2%87%03%C3%87%01%5E%C2%82C%C3%A2p%C2%8B%23%C2%A4%C3%80f%1A%C3%98%C2%B0%C3%B4%C3%B1%C2%B2%C3%A5%C3%BD%C2%A6%C3%A9%0C%C3%BD%C2%98N\'%C2%BF%C3%A2%C2%BA%C3%AE%17%C2%A5%C3%B4I%081%C3%A0%C2%A6%C2%96e%C3%B9f%C2%8C%3D(%C2%82%00%C3%80%18%C3%87%11%18c%C3%924J)%C2%A8%C2%AAjl%05%11c%C2%9A%C2%A6%5B%20%14%C2%9E%C3%83%C3%B3%C3%88!%7B%C3%A0%13%C3%8D%C3%B3%C3%8CO%C2%93W%C2%8C%24I%C2%84%C3%98%C2%AE%20%08%C2%84%C3%BC%C2%BA%C2%AE%C3%97%C2%B0%2B%C3%99%C2%B6%0D%C2%8E%C3%A3%5Cd%25%60%C2%9A%C2%A6A%18%C2%86P%C2%96%C2%A5%C2%90%C2%93%C2%86EQ%04%5D%C3%97A%C3%934BN%0A%C3%A6y%1E%C3%A8%C2%BA%0EEQ%089)%C2%98i%C2%9A%1C%C2%96%C3%A79%C3%A0%2C%C2%BE%C3%93%5B%18%C3%B6%09%C2%AFW%C3%975%C3%B4%7D%2F%C3%A4%C2%A5*%C3%83%C2%86%0F%C3%83%C3%80a%C3%BF%11%C2%BD%C3%BA%06G%C3%80%C2%B2%2C%C3%88%C2%B2%C3%AC7%16%C3%871%C3%AF%1Dl%C2%B3%C2%88%3F%3A%C3%A6%2F%2B%C3%83%C3%A1%C3%84%C2%86%1F%C3%BBt~%C2%80%C3%B3%C3%BE%12%C2%86%23%C3%90%C2%B6%C3%AD%C2%9F%C3%98q4p%C3%85%C3%BDQ%2F%C2%AF%C2%99%C2%A6%C2%A9%10%C3%9BUU%15%C2%BF%3E%C2%AEg)%C2%BE%C3%AF%C2%AFw%C3%ADg%17%C3%9A%10%C2%BE%3CAcSU%C2%95%07d%C2%A5(%C3%8A%C3%AEg%C3%9C%20%C3%A9%C3%A6%C2%90OM%C3%93%3EsZ%C3%86%1E%3F%C3%8F%60%C2%8D%3B%C2%A9%C3%A3C%06%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestLeft = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A9IDAT8%C2%8D%C3%9D%C2%94%C3%8D%09%C2%840%10F\'a%089%08%C2%A6%02%C2%B7%05%C2%8F%C2%9El%C3%82%C2%9B%1D%C3%98%C2%81%C3%9DX%C2%85G%7B%10%C3%AC%C3%80%0AV%C3%B0%20%12%C3%8D2%C3%81%1CD%C3%B6%C3%87%C2%B8%C2%B0%C2%B0%C3%AF%C2%96%C2%84y%C3%B9%02%C3%A1cI%C2%92%C3%9C%10%C2%B1%C3%A5%C2%9C%2B%C3%B0d%5D%C3%97%C2%BB%C3%96%3AF%12%01%C2%80%C2%9A%C2%A6%09%C2%B4%C3%96%C2%A7m%C2%88%08B%08%C2%B5%05%C3%A2j%C2%9Eg%2F%11As4O%1E%C3%AE6%C2%AE%C2%B0%2C%C2%8B%C2%9D%C3%A6%C2%97%2C%1B%C3%86%C2%98%C3%AF%C3%89%1C%C2%BF%C2%95%15E%01Q%14%1D%C3%B6%C2%BDda%18B%C2%9E%C3%A7%C2%90e%19H)wg%2CMS3%C2%8E%C2%A3%5D%C2%94ey%18~%C3%850%0CPU%15%C3%90%1F%0D%C2%82%60%2F%C3%BB%04wa%C3%97u%C3%904%C2%8D%15%11%24%C3%833I%C3%A8Y%C2%94%C2%A6%C2%AEk%C3%A8%C3%BB%C3%BEp~%3A%C3%993(%C3%99%1F%C3%BD%C2%B3%C2%B72%C2%AA%C2%91%2B%C2%B8yN%C3%85%26%C2%84%C3%B0%122%C3%86%5C%C2%9F%C3%99%C2%82%C3%84%C2%AD!%5B)%C3%A5%C2%B5%C2%A6%C3%95%3A~%004%C2%82d%C2%B7%C3%B8N%5CU%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestTop = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDAT8%C2%8D%C3%AD%C2%94%C2%B1%0D%C2%830%10E%C3%8F%C3%96%C3%89r%C2%81%C2%847%C3%88%0A%C2%94T%C3%AC%C3%83%06l%C3%A2I(%C3%99%01%C2%89%0D%C2%98%20H%14%08%1D8%3A%0B%C2%A7%08%C2%92%23%C2%9CTQ%5Es%C2%9C%0F%3F%C3%99.%C2%BE(%C3%8B%C3%B2%C2%86%C2%88%C2%BD%C2%94%C3%92%40%22%C3%BB%C2%BE%C3%9F%C2%89%C2%A8%40%16%01%C2%80Y%C2%96%05%C2%88%C3%A8%C2%B2%0D%11A)e%C2%8E%03I%C2%B3%C2%AEk%C2%92%C2%88%C3%A1%7D%C2%BC%C2%9F%3D2%2C%C3%84h%C2%9A%262%05%C3%98%C2%B6%C3%8DWy%C2%9A%24%C3%A0%C2%9C%C3%BB%C2%9E%2C%C3%B0%C2%97%C3%BD%C2%92LTU%C3%A5%C3%A6y%3E%0D%C2%98%C2%BA%C2%AE!%C3%8F%C3%B3g%3FM%13XkO%C3%BF1Y%C2%96%C3%85O%C3%96%C2%B6m%C2%B4%7F%25*%1B%C3%87%11%C2%86a%C3%B0%C3%9F%5C%C2%B9%C2%8F%11%C2%951%5D%C3%97%C3%B9%C3%ABq%7D%C2%87%7F%C2%B3%C3%94%C3%B8%09p%0Ci%C2%ADAr%C2%B0)%C2%A5%C3%BC%C3%82U%C2%84%10!%C3%8F%7C%40%C3%A2%C2%91%C2%90%C2%BD%C3%96%C3%BA%C2%B3%C2%A4%25*%1E1%12by%C2%BE%C2%8B%C2%BB%5D%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestRowRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%C2%82IDAT8%C2%8D%C2%A5%C2%94%C2%BF%C2%8A%C3%82%40%10%C3%86%C2%BF%C3%AC-1E%C3%80t%16%C2%82%C2%A9%C2%B4%13%2CS%C2%89%60%23X%C3%B8%0C%C2%96y%C2%83%C2%94W%C3%BA%06%C2%96%C3%A9%C3%ACR%C2%A6%C3%B3%11%2C%04%3B%03%0Av6r%C2%82%C2%85%C3%8Aj%C2%8E%C3%99s%C3%AF%C3%B469.%C3%BA%C2%AB6%C2%B3%C2%B3%C3%9F%C3%8E%C2%9F%C3%8D%18%C2%9E%C3%A7%C2%B9%C2%9C%C3%B39c%C3%8C%C3%81%C2%93%5C%C2%AF%C3%97%0F!D%C2%8B%C2%93%10%00%C3%A7x%3CB%08QX%C2%8Ds%0E%C3%934%C2%9D%5B%40%C3%8C9%C2%9F%C3%8FO%09%11t%C2%8E%C3%8E%C2%93%0ES%C2%86W%C2%B8%5C.%C3%B24%7BI%C3%A5F%C2%9A%C2%A6_)%C3%BF%C3%9E%08%C2%82%40s%C3%8Ec4%1A%3D%C3%AChb%C2%B3%C3%99%0C%C3%8Df%13%C3%93%C3%A9%14%C2%8B%C3%85%22G%26%C2%9B7%C3%97u%C3%9F%C2%A9%C2%80%C2%8A%C3%95j%C2%85%C3%9Dn%C2%87%5E%C2%AF%C2%87j%C2%B5%C2%8A%C3%B5z%C3%BD%C2%AF%C2%9A%C2%9A%C2%A6%C2%99%5D%C2%B3%C3%A5r%C2%89%C3%B1x%C2%8CR%C2%A9%C2%84%C3%A1p%C2%88J%C2%A5%C2%A2%C3%B9d%C2%A1E%C2%A6%C2%A0h(M%C3%8B%C2%B20%18%0C%C2%A4u%C2%B3%C3%99h~%C3%B7%C2%91%C3%A5%C2%8A)H%20I%12t%3A%1D4%1A%0D%C2%B9%C3%8EJ%3B7%C3%8DZ%C2%AD%06%C3%9F%C3%B7%C2%BF%C2%BF%C2%B7%C3%9B-%C3%820%C3%84%C3%A9t%C2%92v%12%C3%8D%C3%A2%C2%A1%C2%9B%C2%94R%C2%BF%C3%9FG%C2%BD%5E%C3%97%5C%C3%A9w%C2%8B%C2%A2Hv%C2%9A%7C%C3%A8B%C3%AA%C3%B8%3DF%C2%BB%C3%9DN%0F%C2%87%C2%83%14%C2%A2b%C2%97%C3%8BeM(%C2%8F%C3%BBwf%C3%9B%C3%B6%C2%8F%C2%98%C2%8A%C2%AC%C3%9B%C3%AD%C3%8A%C3%9B%C2%91%C3%B1(%C3%BF%C2%82%C3%84%1EjF%C2%A9%C3%84q%C2%8C%C3%89d%C2%82%C3%BD~%2F%C3%85%C2%8B%20%23%7Bv%C3%BC(h%0C%C3%91%C3%85%C2%8C%06%1B%C2%B5%C2%95%0CE1%0CC%C3%8D39%20%C3%B9mB%C3%8E-%C3%8Bzm%C3%92%0A%C3%91%C3%BA%04%C2%BE%C3%96%C2%AC.%C3%84%C3%B2*%C3%85%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestColumnRtoL = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01GIDAT8%C2%8D%C2%A5%C2%94%C2%A1%C2%8E%C2%83%40%10%C2%86%C2%87%C3%8Df%C2%B3%C2%82%C2%A48%C3%A49%1CI%25%C2%82T%C3%95%C3%A1x%C2%83J%C3%9E%C2%807A%C3%B2%068%1C%C2%92%07h%C2%82C%C3%A2pG%C2%82h%C3%88R.%C2%B3%C3%976%C3%B4%C2%96%C2%A5W%C3%BA%C2%B9%C3%9D%3F%C3%BBe%18%26cx%C2%9E%C3%B7E)%3D%13B%2C%C3%98%C3%88%C3%B5z%C3%BD%16B%C3%AC)%C2%8A%00%C3%80%C2%BA%5C.%20%C2%84x%C3%9BF)%05%C3%86%C2%98u%2B%C2%88X%C3%830l%12!%C3%B8%0E%C3%9F%C2%A3%C2%87%C3%9C%2F%3Ea%1CG%C3%B9%C2%9A%2C9%C3%A28%C2%86%C3%A3%C3%B1%C2%A8%C3%9C%C3%8F%C3%B39%C3%934%C3%A9e%C2%88%C3%AB%C2%BA%C3%A08%C2%8Er%C2%BF%C2%86VV%14%05%04A%00%C2%9Cs%25%C3%93%C2%A1%C2%95UU%05M%C3%93%40%18%C2%86J%C2%A6C%2BC%C3%B2%3C%C2%87%C3%9Dn%07%C2%BE%C3%AF%2B%C3%99%12%C2%AB2%C2%9C%C2%BD%2C%C3%8B%C2%A4%C3%8C%C2%B6m%25%C3%BF%C3%8B%C2%AA%0Ci%C3%9B%16%C3%8A%C2%B2%C2%94%C2%9F%C3%BB%C2%AA%7F%2Fe%08%C3%8A%C2%BA%C2%AE%C2%93%3Fd%0D%3A%C3%8F%C2%A2(%C2%92%3D%C2%82%C3%9B%2C%C2%A1%20I%12y%C3%86%C3%8F%C3%85%1CGF%C3%87Se%C3%98p%C3%9D%19%C3%BB%C2%87%C3%A7%C2%B5a~%C2%92%C3%A1(%C3%A0H%C3%80l4%C3%A6%C3%94u%C3%BD%C3%88%C2%970%0E%C2%87%C3%83%C3%94%C3%B7%C3%BD%23%C3%82%26%C2%9FN\'H%C3%93TV%C3%B3_L%C3%93%C3%BC%C2%95m%5D%3Fwp%0Da%11%04%17%1BcL%5E%C2%BC%C2%8Ba%18%C3%B7%7D%26%17%24%C2%BDm%C3%883%C3%A7%C3%BC%C2%B3M%2B%C3%84%C3%BE%07%C2%AC3%C2%92%C2%B7%00%13%C3%AA%C2%A4%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestRight = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A8IDAT8%C2%8D%C3%8D%C2%94%3F%0A%C2%830%14%C2%87_%C3%82%23d%10%C3%B4%04vr%14%1C%C2%9D%5C%1C%3D%C2%85%C2%A37%C3%B1%24%C3%9E%C3%80%7Bx%C2%94%0A%0E%22%C3%91%C2%94%17%0Cm%C3%91bkZ%C3%A8%C2%B7%C3%A5%C3%8F%C3%AF%C3%A3)%C3%A4%C3%87%C3%924%C2%BD%20b%C3%879%0F%C3%A0%24%C3%8B%C2%B2%5C%C2%95R%09%C2%92%08%00%C2%82q%1CA)%C3%B5%C2%B1%0D%11A%08%11%C2%AC%03%C3%B1%60%C2%9A%C2%A6S%22%C2%82r%C2%94\'%0F%C2%B7%1B.%C3%8C%C3%B3l%C3%92%C3%9C%C3%89%C2%B2%C2%A2%C2%B5%C3%BE%C2%9E%C3%8C%C3%B2%7BY%18%C2%86PU%C3%95f%C3%BF%08%7C%3C%C2%97RBQ%14%10E%C3%91Al%1F%C2%96e%C2%99%1E%C2%86%C3%81%C2%88%C3%8A%C2%B2%04%C3%9F%C3%B7w%2F%C2%BE%C2%A2%C2%AEks%C3%A2y%C3%9E%5Df\'%C3%8B%C3%B3%1C%C3%A286k%7B%C3%B1%1DH%C3%B6%C3%B4%C3%8F%C3%A8%15%C2%B4m%0BM%C3%93%40%C3%9F%C3%B7F~%C3%AA3%5D%C3%99L%C3%A6%C3%8A%C2%9F%C3%8B%C2%A8F%5C%C2%B0yN%C3%85%26%C2%848%25d%C2%8C%C3%99%3E3%05%C2%89kCvRJ%C2%B7%C2%A6U*%C2%B9%01%0BWZ%07%C3%91%C3%86%C2%9EJ%00%00%00%00IEND%C2%AEB%60%C2%82';
    var darkestBottom = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%13%00%00%00%13%08%06%00%00%00rP6%C3%8C%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8FIDAT8%C2%8D%C3%AD%C2%941%0A%C2%840%10E\'%C3%83%10R%08%C3%A6%04%C3%AE%09%C2%84-%C2%ADl%2C%3D%C2%897%C3%B0%08%1E%C3%8F%C2%A3la!2%C2%9Ae%C2%82.%C2%B2%C2%92%2C%C2%BA%C2%AD%C2%AF%C2%99d%C2%86%3C%C2%A6%08_%15E%C3%B1%20%C2%A2%1E%11-%5CdY%C2%96%173%3FID%00%60%C3%87q%04f%3Em%23%22%C3%90Z%C3%9Bu!%C2%B4%C3%934%5D%12%09%C3%B2N%C3%9E%C2%8B%07%C2%B7F%08c%0C4M%C3%A3k%C2%88y%C2%9E%C3%BD%04%03%C3%B3%0FUUA%C2%9A%C2%A6%C2%BE%C2%86p%C3%8E%C3%BD%C2%96eY%06y%C2%9E%C3%BB%C2%B3T%C2%B9%C3%87%C2%88%C3%8A%C3%AA%C2%BA%C2%8E%C3%9E%C2%BFQeY%C2%BAa%18%0E%C2%83%3Dm%C3%9BB%C3%97u%C2%87%C3%BE%C2%9E%24I%C3%A2%C2%9B%C2%9D%C3%A5%C2%96%C3%9D%C2%B2%00%C3%BE%C3%93%5E%C2%8D%C2%9F%0D%C2%89!%09%02%C2%94%60%C3%93Z%C3%BB%C3%86%C3%A9M%C2%94%C3%9A%C3%B2%C3%8C%07%24%C2%AD%09%C3%99%1Bc%C3%BEKZ%C3%A6%C3%A7%1B%C3%A6%C2%93O%02p%027%3C%00%00%00%00IEND%C2%AEB%60%C2%82';

    var icon = {
        lightest: {
            row: lightestRow,
            column: lightestColumn,
            left: lightestLeft,
            top: lightestTop,
            rowRtoL: lightestRowRtoL,
            columnRtoL: lightestColumnRtoL,
            right: lightestRight,
            bottom: lightestBottom
        },
        light: {
            row: lightRow,
            column: lightColumn,
            left: lightLeft,
            top: lightTop,
            rowRtoL: lightRowRtoL,
            columnRtoL: lightColumnRtoL,
            right: lightRight,
            bottom: lightBottom
        },
        dark: {
            row: darkRow,
            column: darkColumn,
            left: darkLeft,
            top: darkTop,
            rowRtoL: darkRowRtoL,
            columnRtoL: darkColumnRtoL,
            right: darkRight,
            bottom: darkBottom
        },
        darkest: {
            row: darkestRow,
            column: darkestColumn,
            left: darkestLeft,
            top: darkestTop,
            rowRtoL: darkestRowRtoL,
            columnRtoL: darkestColumnRtoL,
            right: darkestRight,
            bottom: darkestBottom
        }
    };

    var pref = app.preferences;
    var brightness = pref.getRealPreference('uiBrightness');

    if (brightness == 1) return icon.lightest;
    if (0.5 < brightness && brightness < 1) return icon.light;
    if (0 < brightness && brightness <= 0.5) return icon.dark;
    if (brightness == 0) return icon.darkest;
}


function localizeUI() {
    return {
        title: {
            en: 'Create Threaded Text',
            ja: 'スレッドテキストを作成'
        },
        order: {
            en: 'Order of Concatenation',
            ja: '連結する順番'
        },
        row: {
            en: 'Grid by Row (L → R)',
            ja: '横に配列（左 → 右）'
        },
        column: {
            en: 'Grid by Column (L → R)',
            ja: '縦に配列（左 → 右）'
        },
        rowRtoL: {
            en: 'Grid by Row (R → L)',
            ja: '横に配列（右 → 左）'
        },
        columnRtoL: {
            en: 'Grid by Column (R → L)',
            ja: '縦に配列（右 → 左）'
        },
        left: {
            en: 'Arrange by Row (L → R)',
            ja: '横一列（左 → 右）'
        },
        right: {
            en: 'Arrange by Row (R → L)',
            ja: '横一列（右 → 左）'
        },
        top: {
            en: 'Arrange by Column (T → B)',
            ja: '縦一列（上 → 下）'
        },
        bottom: {
            en: 'Arrange by Column (B → T)',
            ja: '縦一列（下 → 上）'
        },
        option: {
            en: 'Options',
            ja: 'オプション'
        },
        tolerance: {
            en: 'Alignment Position Tolerance:',
            ja: '整列位置の許容誤差:'
        },
        shape: {
            en: 'Convert Path to Type',
            ja: 'パスをテキストに変換'
        },
        area: {
            en: 'Area Type',
            ja: 'エリア内文字'
        },
        path: {
            en: 'Type on a Path',
            ja: 'パス上文字'
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
