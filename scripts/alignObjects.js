/* ===============================================================================================================================================
   alignObjects

   Description
   This script aligns objects horizontally and vertically at the same time.

   Usage
   1. Select any objects, run this script from File > Scripts > Other Script...
   2. Select the Distribute Objects or the Distribute Spacing.
      If you don't want evenly spaced distribution, uncheck both checkboxes.
   3. To include stroke width, check the Use Preview Bounds checkbox.
   4. Enter a value of the Alignment Position Tolerance. (0 or higher number)
   5. Click the Align icon button.

   Notes
   The top row and the left-most column are the basis for alignment.
   Compound paths, texts, linked files, and embedded link files are also supported.
   The units of the Distribute Spacing and the Alignment Position Tolerance depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator 2021 or higher

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
    var shapes = getPageItems(items);
    if (shapes.length < 2) return;

    var undoCount = 0;

    var dialog = showDialog();

    dialog.align.topLeft.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.TOP,
            vertical: Transformation.LEFT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.topCenter.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.TOP,
            vertical: Transformation.CENTER
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.topRight.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.TOP,
            vertical: Transformation.RIGHT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.centerLeft.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.CENTER,
            vertical: Transformation.LEFT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.center.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.CENTER,
            vertical: Transformation.CENTER
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.centerRight.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.CENTER,
            vertical: Transformation.RIGHT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.bottomLeft.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.BOTTOM,
            vertical: Transformation.LEFT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.bottomCenter.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.BOTTOM,
            vertical: Transformation.CENTER
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.bottomRight.addEventListener('click', function() {
        var align = {
            horizontal: Transformation.BOTTOM,
            vertical: Transformation.RIGHT
        };
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignHorizontally(align.vertical, grid, config.stroke);
        alignVertically(align.horizontal, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.left.addEventListener('click', function() {
        var align = Transformation.LEFT;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
        }
        alignHorizontally(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.vertical.addEventListener('click', function() {
        var align = Transformation.CENTER;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
        }
        alignHorizontally(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.right.addEventListener('click', function() {
        var align = Transformation.RIGHT;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeHorizontally(grid, config.margin.x, config.stroke);
        }
        alignHorizontally(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.top.addEventListener('click', function() {
        var align = Transformation.TOP;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignVertically(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.horizontal.addEventListener('click', function() {
        var align = Transformation.CENTER;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignVertically(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.align.bottom.addEventListener('click', function() {
        var align = Transformation.BOTTOM;
        var config = getConfiguration(dialog, shapes);
        var grid = getSortedItems(shapes, config.tolerance);
        if (config.distribute || config.spacing) {
            distributeVertically(grid, config.margin.y, config.stroke);
        }
        alignVertically(align, grid, config.stroke);
        app.redraw();

        undoCount++;
        dialog.undo.enabled = true;
    });

    dialog.undo.onClick = function() {
        app.undo();
        app.redraw();
        undoCount--;
        dialog.undo.active = true;
        dialog.undo.active = false;
        if (!undoCount) dialog.undo.enabled = false;
    }

    dialog.show();
}


function getConfiguration(dialog, items) {
    var units = dialog.units;
    var distribute = dialog.distribute.value;
    var spacing = dialog.distance.value;
    var stroke = dialog.stroke.value;

    var tolerance = getValue(dialog.tolerance.text);
    tolerance = convertUnits(tolerance + units, 'pt');

    var margin = getMargin(items, tolerance, stroke);
    if (spacing) {
        var x = getValue(dialog.margin.text);
        var y = getValue(dialog.margin.text);
        margin = {
            x: convertUnits(x + units, 'pt'),
            y: convertUnits(y + units, 'pt')
        };
    }

    return {
        distribute: distribute,
        spacing: spacing,
        margin: margin,
        tolerance: tolerance,
        stroke: stroke
    };
}


function alignHorizontally(align, items, hasStroke) {
    var columns = items.columns;
    for (var i = 0; i < columns.length; i++) {
        var rows = columns[i];
        var target = rows[0];
        for (var j = 1; j < rows.length; j++) {
            var row = rows[j];
            moveHorizontally(align, row, target, hasStroke);
        }
    }
}


function alignVertically(align, items, hasStroke) {
    var rows = items.rows;
    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i];
        var target = columns[0];
        for (var j = 1; j < columns.length; j++) {
            var column = columns[j];
            moveVertically(align, column, target, hasStroke);
        }
    }
}


function moveHorizontally(align, item, target, hasStroke) {
    var position = getPosition(target, hasStroke);
    var stroke = getStrokeWidth(item);
    if (hasStroke) stroke = { width: 0, height: 0 };
    var size = getSize(item, hasStroke);
    var clip, mask, diff;
    if (isClipped(item)) {
        stroke = { width: 0, height: 0 };
        mask = item.pageItems[0];
        diff = getDifference(mask, item, hasStroke);
    }
    switch (align) {
        case Transformation.LEFT:
            clip = (diff) ? diff.left : 0;
            item.left = position.left - stroke.width + clip;
            break;
        case Transformation.CENTER:
            clip = (diff) ? diff.center.x : 0;
            item.left = position.center.x - stroke.width - size.width / 2 + clip;
            break;
        case Transformation.RIGHT:
            clip = (diff) ? diff.right : 0;
            item.left = position.right - stroke.width - size.width + clip;
            break;
    }
}


function moveVertically(align, item, target, hasStroke) {
    var position = getPosition(target, hasStroke);
    var stroke = getStrokeWidth(item);
    if (hasStroke) stroke = { width: 0, height: 0 };
    var size = getSize(item, hasStroke);
    var clip, mask, diff;
    if (isClipped(item)) {
        stroke = { width: 0, height: 0 };
        mask = item.pageItems[0];
        diff = getDifference(mask, item, hasStroke);
    }
    switch (align) {
        case Transformation.TOP:
            clip = (diff) ? diff.top : 0;
            item.top = position.top + stroke.height + clip;
            break;
        case Transformation.CENTER:
            clip = (diff) ? diff.center.y : 0;
            item.top = position.center.y + stroke.height + size.height / 2 + clip;
            break;
        case Transformation.BOTTOM:
            clip = (diff) ? diff.bottom : 0;
            item.top = position.bottom + stroke.height + size.height + clip;
            break;
    }
}


function distributeHorizontally(items, margin, hasStroke) {
    var columns = items.rows[0];
    for (var i = 1; i < columns.length; i++) {
        var previous = columns[i - 1];
        if (isClipped(previous)) previous = previous.pageItems[0];

        var column = columns[i];
        var position = getPosition(previous, hasStroke);
        var stroke = getStrokeWidth(column);
        if (hasStroke) stroke = { width: 0, height: 0 };

        var clip = 0, mask, diff;
        if (isClipped(column)) {
            stroke = { width: 0, height: 0 };
            mask = column.pageItems[0];
            diff = getDifference(mask, column, hasStroke);
            clip = diff.left;
        }

        var left = position.right - stroke.width + margin + clip;
        column.left = left;
    }
}


function distributeVertically(items, margin, hasStroke) {
    var rows = items.columns[0];
    for (var i = 1; i < rows.length; i++) {
        var previous = rows[i - 1];
        if (isClipped(previous)) previous = previous.pageItems[0];

        var row = rows[i];
        var position = getPosition(previous, hasStroke);
        var stroke = getStrokeWidth(row);
        if (hasStroke) stroke = { width: 0, height: 0 };

        var clip = 0, mask, diff;
        if (isClipped(row)) {
            stroke = { width: 0, height: 0 };
            mask = row.pageItems[0];
            diff = getDifference(mask, row, hasStroke);
            clip = diff.top;
        }

        var top = position.bottom + stroke.height - margin + clip;
        row.top = top;
    }
}


function getDifference(item, target, hasStroke) {
    var bounds = {
        item: item.geometricBounds,
        target: target.geometricBounds
    };
    var stroke = getStrokeWidth(target);
    if (hasStroke) {
        bounds.item = item.visibleBounds;
        bounds.target = target.visibleBounds;
        stroke = { width: 0, height: 0 };
    }
    var position = {
        item: getBounds(bounds.item),
        target: getBounds(bounds.target)
    };
    return {
        left: position.target.x1 - position.item.x1 - stroke.width,
        right: position.target.x2 - position.item.x2 - stroke.width,
        top: position.target.y1 - position.item.y1 + stroke.height,
        bottom: position.target.y2 - position.item.y2 + stroke.height,
        center: {
            x: position.target.center.x - position.item.center.x - stroke.width,
            y: position.target.center.y - position.item.center.y + stroke.height
        }
    };
}


function getPosition(item, hasStroke) {
    var bounds = (hasStroke) ? item.visibleBounds : item.geometricBounds;
    if (isClipped(item)) {
        var mask = item.pageItems[0];
        bounds = (hasStroke) ? mask.visibleBounds : mask.geometricBounds;
    }
    var position = getBounds(bounds);
    return {
        left: position.x1,
        right: position.x2,
        top: position.y1,
        bottom: position.y2,
        center: {
            x: position.center.x,
            y: position.center.y
        }
    };
}


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
}


function getSize(item, hasStroke) {
    var bounds = (hasStroke) ? item.visibleBounds : item.geometricBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = x2 - x1;
    var height = y1 - y2;
    return {
        width: width,
        height: height
    };
}


function getBounds(bounds) {
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = x2 - x1;
    var height = y1 - y2;
    var center = {
        x: x1 + width / 2,
        y: y1 - height / 2
    };
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        center: center
    };
}


function getStrokeWidth(item) {
    var bounds = item.geometricBounds;
    var width = bounds[0] - item.left;
    var height = item.top - bounds[1];
    return {
        width: width,
        height: height
    };
}


function getMargin(items, tolerance, hasStroke) {
    var grid = getSortedItems(items, tolerance);
    var margin = {
        x: getDistance(grid.rows[0], hasStroke),
        y: getDistance(grid.columns[0], hasStroke)
    }
    return {
        x: margin.x.width,
        y: margin.y.height
    };
}


function getDistance(items, hasStroke) {
    var index = {
        start: 0,
        end: items.length - 1
    };
    var shape = {
        start: items[index.start],
        end: items[index.end]
    };
    var position = {
        start: getPosition(shape.start, hasStroke),
        end: getPosition(shape.end, hasStroke)
    };
    var width = position.end.right - position.start.left;
    var height = position.start.top - position.end.bottom;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (isClipped(item)) item = item.pageItems[0];
        var size = getSize(item, hasStroke);
        width -= size.width;
        height -= size.height;
    }
    var count = items.length - 1;
    return {
        width: (count) ? width / count : 0,
        height: (count) ? height / count : 0
    };
}


function splitRows(items, tolerance) {
    var base = items[0];
    var rows = [[base]];
    for (var i = 1, row = 0; i < items.length; i++) {
        var item = items[i];
        var position = {
            base: isClipped(base) ? base.pageItems[0].top : base.top,
            item: isClipped(item) ? item.pageItems[0].top : item.top
        };
        var height = Math.abs(position.base - position.item);
        if (height <= tolerance) {
            rows[row].push(item);
        }
        else {
            rows.push([item]);
            base = item;
            row++;
        }
    }
    return rows;
}


function splitColumns(items, tolerance) {
    var base = items[0];
    var columns = [[base]];
    for (var i = 1, column = 0; i < items.length; i++) {
        var item = items[i];
        var position = {
            base: isClipped(base) ? base.pageItems[0].left : base.left,
            item: isClipped(item) ? item.pageItems[0].left : item.left
        };
        var width = Math.abs(position.base - position.item);
        if (width <= tolerance) {
            columns[column].push(item);
        }
        else {
            columns.push([item]);
            base = item;
            column++;
        }
    }
    return columns;
}


function sortRow(items, tolerance) {
    return items.sort(function(a, b) {
        var item = { a: a, b: b };
        if (isClipped(item.a)) item.a = item.a.pageItems[0];
        if (isClipped(item.b)) item.b = item.b.pageItems[0];
        var distance = Math.abs(item.b.top - item.a.top);
        if (distance <= tolerance) {
            return item.a.left - item.b.left;
        }
        return item.b.top - item.a.top;
    });
}


function sortColumn(items, tolerance) {
    return items.sort(function(a, b) {
        var item = { a: a, b: b };
        if (isClipped(item.a)) item.a = item.a.pageItems[0];
        if (isClipped(item.b)) item.b = item.b.pageItems[0];
        var distance = Math.abs(item.a.left - item.b.left);
        if (distance <= tolerance) {
            return item.b.top - item.a.top;
        }
        return item.a.left - item.b.left;
    });
}


function getSortedItems(items, tolerance) {
    var shapes, rows, columns;
    shapes = sortRow(items, tolerance);
    rows = splitRows(shapes, tolerance);
    shapes = sortColumn(items, tolerance);
    columns = splitColumns(shapes, tolerance);
    return {
        rows: rows,
        columns: columns
    };
}


function getPageItems(items) {
    var selection = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        selection.push(item);
    }
    return selection;
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


function getTolerance(unit) {
    switch (unit) {
        case 'px': return 30;
        case 'pt': return 30;
        case 'pc': return 1;
        case 'in': return 0.5;
        case 'ft': return 0.03;
        case 'yd': return 0.01;
        case 'mm': return 10;
        case 'cm': return 1;
        case 'm': return 0.01;
    }
}


function isValidVersion() {
    var ai2021 = 25;
    var aiVersion = parseFloat(app.version);
    if (aiVersion < ai2021) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var icon = getUIIcon();

    var units = getRulerUnits();
    var tolerance = getTolerance(units);

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.align;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'top'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var image1 = group3.add('image', undefined, File.decode(icon.normal.topLeft), { name: 'image1' });
    var image2 = group3.add('image', undefined, File.decode(icon.normal.topCenter), { name: 'image2' });
    var image3 = group3.add('image', undefined, File.decode(icon.normal.topRight), { name: 'image3' });

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var image4 = group4.add('image', undefined, File.decode(icon.normal.centerLeft), { name: 'image4' });
    var image5 = group4.add('image', undefined, File.decode(icon.normal.center), { name: 'image5' });
    var image6 = group4.add('image', undefined, File.decode(icon.normal.centerRight), { name: 'image6' });

    var group5 = group2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var image7 = group5.add('image', undefined, File.decode(icon.normal.bottomLeft), { name: 'image7' });
    var image8 = group5.add('image', undefined, File.decode(icon.normal.bottomCenter), { name: 'image8' });
    var image9 = group5.add('image', undefined, File.decode(icon.normal.bottomRight), { name: 'image9' });

    var group6 = group1.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['right', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var image10 = group7.add('image', undefined, File.decode(icon.normal.left), { name: 'image10' });
    var image11 = group7.add('image', undefined, File.decode(icon.normal.vertical), { name: 'image11' });
    var image12 = group7.add('image', undefined, File.decode(icon.normal.right), { name: 'image12' });

    var group8 = group6.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var image13 = group8.add('image', undefined, File.decode(icon.normal.top), { name: 'image13' });
    var image14 = group8.add('image', undefined, File.decode(icon.normal.horizontal), { name: 'image14' });
    var image15 = group8.add('image', undefined, File.decode(icon.normal.bottom), { name: 'image15' });

    var divider1 = panel1.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group9 = panel1.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 4, 0, 0];

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var checkbox1 = group10.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.distribute;
    checkbox1.value = true;

    var group11 = group9.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var group12 = group11.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = [0, 4, 0, 0];

    var checkbox2 = group12.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.spacing;

    var group13 = group11.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = 0;
    group13.enabled = false;

    var edittext1 = group13.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '0';
    edittext1.preferredSize.width = 60;

    var statictext1 = group13.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = units;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.options;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group14 = panel2.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = [0, 8, 0, 0];

    var checkbox3 = group14.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.stroke;

    var divider2 = panel2.add('panel', undefined, undefined, {name: 'divider2'});
    divider2.alignment = 'fill';

    var group15 = panel2.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['left', 'center'];
    group15.spacing = 10;
    group15.margins = 0;

    var statictext2 = group15.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.tolerance;

    var edittext2 = group15.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = tolerance;
    edittext2.preferredSize.width = 60;

    var statictext3 = group15.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = units;

    var group16 = dialog.add('group', undefined, { name: 'group16' });
    group16.orientation = 'row';
    group16.alignChildren = ['right', 'center'];
    group16.spacing = 10;
    group16.margins = 0;

    var button1 = group16.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.undo;
    button1.preferredSize.width = 90;
    button1.enabled = false;

    var button2 = group16.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.close;
    button2.preferredSize.width = 90;

    image1.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.topLeft));
    });
    image1.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.topLeft));
    });
    image1.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topLeft));
    });
    image1.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topLeft));
    });

    image2.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.topCenter));
    });
    image2.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.topCenter));
    });
    image2.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topCenter));
    });
    image2.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topCenter));
    });

    image3.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.topRight));
    });
    image3.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.topRight));
    });
    image3.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topRight));
    });
    image3.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.topRight));
    });

    image4.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.centerLeft));
    });
    image4.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.centerLeft));
    });
    image4.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.centerLeft));
    });
    image4.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.centerLeft));
    });

    image5.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.center));
    });
    image5.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.center));
    });
    image5.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.center));
    });
    image5.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.center));
    });

    image6.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.centerRight));
    });
    image6.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.centerRight));
    });
    image6.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.centerRight));
    });
    image6.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.centerRight));
    });

    image7.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.bottomLeft));
    });
    image7.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.bottomLeft));
    });
    image7.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomLeft));
    });
    image7.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomLeft));
    });

    image8.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.bottomCenter));
    });
    image8.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.bottomCenter));
    });
    image8.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomCenter));
    });
    image8.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomCenter));
    });

    image9.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.bottomRight));
    });
    image9.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.bottomRight));
    });
    image9.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomRight));
    });
    image9.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottomRight));
    });

    image10.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.left));
    });
    image10.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.left));
    });
    image10.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.left));
    });
    image10.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.left));
    });

    image11.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.vertical));
    });
    image11.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.vertical));
    });
    image11.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.vertical));
    });
    image11.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.vertical));
    });

    image12.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.right));
    });
    image12.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.right));
    });
    image12.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.right));
    });
    image12.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.right));
    });

    image13.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.top));
    });
    image13.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.top));
    });
    image13.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.top));
    });
    image13.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.top));
    });

    image14.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.horizontal));
    });
    image14.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.horizontal));
    });
    image14.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.horizontal));
    });
    image14.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.horizontal));
    });

    image15.addEventListener('mouseover', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.rollover.bottom));
    });
    image15.addEventListener('mousedown', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.pressed.bottom));
    });
    image15.addEventListener('mouseup', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottom));
    });
    image15.addEventListener('mouseout', function() {
        this.image = ScriptUI.newImage(this.image);
        this.image = ScriptUI.newImage(File.decode(icon.normal.bottom));
    });

    edittext1.addEventListener('keydown', setIncreaseDecrease);
    edittext2.addEventListener('keydown', setIncreaseDecrease);

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    checkbox1.onClick = function() {
        if (checkbox1.value) {
            checkbox2.value = false;
            group13.enabled = false;
        }
    }

    checkbox2.onClick = function() {
        if (checkbox2.value) {
            checkbox1.value = false;
            group13.enabled = true;
            edittext1.active = false;
            edittext1.active = true;
        }
        else {
            group13.enabled = false;
        }
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.align = {
        topLeft: image1,
        topCenter: image2,
        topRight: image3,
        centerLeft: image4,
        center: image5,
        centerRight: image6,
        bottomLeft: image7,
        bottomCenter: image8,
        bottomRight: image9,
        left: image10,
        vertical: image11,
        right: image12,
        top: image13,
        horizontal: image14,
        bottom: image15
    };
    dialog.distribute = checkbox1;
    dialog.distance = checkbox2;
    dialog.margin = edittext1;
    dialog.tolerance = edittext2;
    dialog.stroke = checkbox3;
    dialog.units = units;
    dialog.undo = button1;
    return dialog;
}


function setIncreaseDecrease(event) {
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 5 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.target.text = value;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        if (value < 0) value = 0;
        event.target.text = value;
        event.preventDefault();
    }
}


function getUIIcon() {
    var lightest = {
        normal: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9AIDATH%C2%89%C3%AD%C2%96%C3%91%09%C3%830%0CD%C2%9FC%06%C3%A8HY%C3%81kx%20%C2%AF%C3%91%11%C3%AA%C2%91n%C2%83%C3%A4%2B%C2%A5%C2%84%C2%A66%05G%06%C3%A5%3E%C2%8D%C3%A0Ig%C3%ABp%C2%90%C3%B4%00%C2%9E%C3%80%C3%82u*%40%0C%C2%92%5E%17%C2%83%C3%9F%0D%04I%C2%AB%01%18%C2%80%C3%89%0A%0C0%1F%0FRJ%5D%409%C3%A7%3A%C3%BC%C2%AC%C2%B0%C2%87%C3%86%C2%B2%C3%BDS%C2%B5%2B%C3%98%1D%3A%C2%AB%C2%AB9h%3A%C3%B9%0D%C3%B7%07%C3%BF%C3%B9%C3%9A%5B%C3%B5o.%C2%8C%3By%C3%AF%C2%A4%1Bw%C3%B2%C3%96%C3%A4%C3%BAV%C3%97%C3%A2%C2%9A%C3%9FU%C3%B3%0B7%0D%19%C2%BF%7Bn%0A%C3%B7%C3%BBo7%C2%87%17%23v%C2%99%C2%80h%C3%90%40%01%C3%A2%06%5C%1A%2C%C3%84%0B%C3%B0%C3%977%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A5IDATH%C2%89%C3%AD%C2%96%C3%81%0D%C2%830%0CE_%10%030RW%C3%88%1A%1E(kt%042%C2%927hO%20A!%C2%AAK%C2%89%C2%91%C3%82%C2%BF%25%C2%B2%C3%B2%C3%AC%C2%9F%C3%98JP%C3%95%01x%02%0F%C3%AA)%031%C2%A8%C3%AAX%19%3C\'%10T%C3%B5%C3%A5%00%06%C2%A0%C3%B3%02%03%C3%B4%C3%AB%0D%119%0D%C2%96RZ%C2%AC%0F%C3%99.%22%1F%07Zt-%C3%9B\'%C2%95%C3%AC%C3%9F%C2%AA%C3%96%1A%0F%C3%8E%C2%95%C3%9F%C3%B0%1B%5EU%C2%BB%C2%ADf%C3%95%2F%C3%83f%17~dr%7D%C2%AB%C3%AB%C3%9A%C2%BE5%C2%B5J%C2%8EX%C3%A3%C3%9B%7D%C3%AD%C3%AD%C3%82%C3%BF%C3%96%C3%A7%60o%C3%8F%22%C3%BC%C3%AC%5Eo%C3%B7%C3%8E%C3%9B%C3%BD%C2%B7%C2%BB%C3%83%C2%B3%13%3Bw%40tH%20%03%C3%B1%0D%C2%B1%C3%B41%C3%8E%0A%0FeB%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A6IDATH%C2%89%C3%AD%C2%96%C3%91%0D%C3%83%20%0CD%1FQ%07%C3%88H%5D%C2%815%18%C2%885%3AB%18%C3%89%1B%C2%B4_DQD%C3%AB%C2%AA)1%C2%92s%C2%9F%08%C3%A9%C3%B9%C3%8E%C3%98%22%C2%88%C3%88%0C%3C%C2%80%3B%C3%A7%C2%A9%001%C2%88%C3%88r2x-%20%C2%88%C3%88%C3%93%00%0C%C3%80d%05%06%C2%B8%C2%B5%0ESJ%5D%609g%1D%C2%BE%C2%BF%C3%B4%0F%C2%B5%0C%C2%8D%17%C3%BBV%C3%AFZP%C3%93%C3%91Z%C3%B4)ES%C3%A7%17%C3%9C%1F%5C%7D%C3%AD%3Df%C2%BEjl%C3%A7%C2%9A%C2%8E%243%C2%BE%C3%B3%C3%96%16%C3%9B%3B%C3%966aK~G%C3%8D%2F%C3%BC%C2%AB%07%C3%97k%C3%91%1C%C2%9E%C3%B3%C2%AA_%0A%C3%B4%C3%9Bs%C2%BF%C3%BFvsx1b%C2%97%09%C2%88%06%05%14%20%C2%BE%00YS.%02%C3%8E%C3%A9%C2%88_%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%97%C3%81%0D%C3%83%20%10%04%07%2B%05%C2%A4%C2%A4%C2%B4%40%1B%14D%1B.!%C2%94%C2%B4%1D%24%2F%C3%BBE%C3%80r%0C%C2%87%C2%84%C3%A7%C3%AB%C3%87%C2%ACV%C3%A7%C2%95p%C2%92%C2%9E%C3%80%0A%C2%BC%C3%A8G%02%C2%BC%C2%93%C3%B4%C3%AE%2C%C3%9E%038I%1F%031%00%C2%8B%C2%958%2B%0F!%C3%98%C3%89%7B%C3%B2(%7D%C2%AC%C2%B5%10cl\'%3F%C3%8A%C2%AF%C2%90%C2%B5pc%1D%C3%9C-%C3%AF%C3%81%25%07w%C3%B6%C3%AA%C2%8B%C3%B2%7F%7F%C2%A5%1A%C3%A3%C3%95%C3%9Ebbs-f%C3%A5%C2%AD%C3%AB%C3%9E%18%C2%AF%C3%B6%C2%8DR%C3%BDW%C2%B4%C3%93l%C3%9B%C2%8F%C2%84%C2%9Bw%C3%A1%C3%A6%C2%95%C3%9F%C3%9Bn%C3%82%C3%9C%C2%8F%C2%86d%C3%A4N%0B%C3%A0%0D%02%24%C3%80%7F%01r%C2%A3.%06GN%C2%99%C3%AD%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%95IDATH%C2%89%C3%AD%C2%95%C3%81%0D%C3%83%20%0CE%1FQ%07%C3%88HY%C2%815%3C%10kt%C2%840%C2%927hO%C3%A4%C3%90%C2%AA%1Cj%C2%89%1F%25%C2%BC%2B%C2%96%C2%9E%C3%B9%C2%B2%C3%AC%C3%A4%C3%AE%2B%C3%B0%046%C3%86Q%C2%81%C2%9C%C3%9C%7D%1F%2C%3E%1AH%C3%AE%C3%BE%12%C2%88%01XT%C3%A2%C2%B0%C3%9C%C3%8Ct%C3%B2(R%C3%B9%C2%A3%C3%B7%C3%B8%2B%C3%96RJ%C2%A8%C2%B6q%C3%9F%C3%98%C2%A7%5CBw%C3%9A%7B%C2%93%1A%C2%A9mH%7F%C3%BEuX%C2%A2%2B%C2%B3%C3%87g%3A%C2%A1%C2%ABff%7F%C3%85%C3%9D8%C3%AF%C3%80%C3%8D%C3%B5%3A%C3%A5%C2%97%C2%92%C3%9Fw%C2%BD%C2%9Ek%C2%B7%C2%8FD%1E%7B%15%C2%B9%C3%AB%02dA%03%15%C3%88o%C3%8D%C2%986%C3%94%C3%91%06%C2%88%C3%8A%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A1IDATH%C2%89%C3%AD%C2%97%C3%91%0D%C3%83%20%10C%1FQ%07%C3%A8H%5D%C2%815%18%C2%8852B%18%C3%89%1B%C2%B4%7FU%3E%C2%92%10A%C3%A0%C2%AA%06%0F%C3%A0g%C2%8E%C3%83%12N%C3%92%13%C2%98%C2%81%17%C3%BD%C2%94%00%C3%AF%24-%C2%9D%C3%81%C3%9F%00N%C3%92%C3%9B%00%0C%C3%80d%05%C3%AE%0A%0F!%C3%98%C3%81%C2%B7%C3%B4%C2%A85%C3%98%3A%C3%91Z1%C3%86r%C3%B8%C2%9E%C3%B9%C2%91%C3%A9Y%C3%9Dc%C3%A1%06%7C%C2%AD%C3%AC%C3%82%5D%C2%B1X%C3%85%C3%B0%C2%9Cj%C3%82%C3%BD%C3%9E%C3%98s%C3%85%C3%91%14%C3%9E%C3%A2%C2%9E%C3%BF%C2%AF%C3%9B%C3%A1%C3%B8%C2%9A%C2%AA%C2%BA%7D%C3%8F%7Ct%C3%BB%C2%80%C2%97%C3%A8%C3%94%C3%82%C2%B5%C3%AA%C3%B7K%C2%9EZi8%C3%93%C2%B1%C3%9F%C3%BB%C3%93%C2%90%C2%8C%C3%98i%02%C2%BCA%C2%80%04%C3%B8%0Fs%1A-%C2%82j%10%1F%C2%BB%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%94IDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C2%80%20%10D%1F%C3%86%02%2C%C3%89%16h%C2%83%C2%82h%C3%83%12%C2%A4%C2%A4%C3%A9%40o%26%26~%C2%88F%C2%96%04%C3%A7%C3%8A%C3%A1%C3%8D%C2%B2%C2%B3%1Bp%C2%92%06%60%02F%C3%8A)%01%C3%9EI%C2%9A%0B%C2%837%03N%C3%92b%00%06%C2%A0%C2%B3%02%C3%97%07%0F!%C3%98%C3%81K%C3%8A%14%C3%9E_%1D%C2%9E%C2%B5%20%C3%86%C3%B8%3D%3CWG%26s%0C%C2%B6%C3%9B%C3%B3v%C3%A1%C2%97%C2%81%C3%8BM%C3%B5%C3%93%C3%B4%C3%97%5B%C3%B9%C3%9D%C2%AA%7D%3B%C3%AF%C3%B5V%C2%9E%C2%AB%C2%A7%C2%9B%C2%B0%C3%9DQ%C3%BB%C3%A1%26%C3%BA7%C3%9CN_%3C%22%C2%8Fn%C2%A7%C3%ADOC2b%C2%A7%0E%C3%B0%06%06%12%C3%A0W%C2%A4%06%2C%3E.Q%130%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9BIDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%830%0CE_%10%03t%24V%C3%88%1A%19(k0B3%C3%92%C3%9F%C2%A0%C3%9C8%C2%B4%10)%C2%85%C3%86T%C3%A6_%13%C3%A9%7D%3B%C2%B6%C3%A5%04I%0F%60%06%26%C3%BA%C2%A9%001Hzv%06%C2%AF%06%C2%82%C2%A4%C2%97%01%18%C2%80%C3%81%0A%C3%BC%C3%9F%C3%B0%C2%94%C2%92%1D%C3%BC%C2%A8L%C3%A1c%C3%ADp%2B%C2%AD9%C3%A7%3E%C3%B0V%C2%B5%C2%9A%C3%B5%C3%BB%C3%A6~%C3%A1%C3%95%C2%82k%C2%AD%C3%AC%C3%96%C3%BB%C3%97%C2%8C%C2%BC6%3A%C3%8F%C3%AA%C3%B5%C3%93%C3%BA%C3%BC%1B%C2%B3~%C2%AB%C3%BD%C2%86%C3%BB%C2%83%C3%AF%C2%B6%C3%9A%C2%AF%C2%A7%1B%18G%C3%BE%C2%B1%C2%B7%1F%5D%0Akz%C3%8F%C2%8E%C3%AFOC1b%C2%97%01%C2%88%06%06%0A%10%17%00U0%0A%C2%BDo%C2%B5%C3%8A%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9CIDATH%C2%89%C3%AD%C2%97%C3%91%0D%C3%83%20%0C%05%C2%8F(%03t%C2%A4%C2%AE%C3%80%1A%0C%C3%84%1A%19%C2%A1%C2%8C%C3%B46h%C2%BF%C3%92%2F%0A(%C2%89b%24%C3%B7%06%C3%B0a%C3%B3%C2%B0D%C2%90%C3%B4%006%C3%A0%C3%89%7D%14%20%06I%C2%AF%C2%9B%C3%85%C3%9F%03%04Io%031%00%C2%8B%C2%95%C3%98%C2%8F%3C%C2%A5d\'%C2%AFa*_%C2%AF*T%1B%2B%40%C3%8E%C3%B9%C2%9C%C2%BCV%C2%B8Ut%14%C2%BFw%C3%AEW%3E%14%C2%B8%C2%91p%1D%09%C3%A0%C3%BC%C2%9D%C2%B7%C3%B8%C3%B5%C2%BEwZ%13%C2%99%C2%BB%C3%B3%23%C2%9Bk%14%C2%BFO%C3%AD%2F7%C2%A1%C2%9B%C3%B6%5E%C2%AA%C3%8F%C2%A4~%C2%BE%C3%8E%7B%5B%C3%AB*%7C%7F%1A%C2%8A%C2%91%C2%BB%2C%4048%40%01%C3%A2%07m%14*%7C%3D%C2%A3k%C2%86%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%95IDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C3%83%20%10%05%07%2B%05%C2%A4%C2%A4%C2%B4%40%1B%14D%1B)!%C2%94%C3%B4%3A%C2%B0O%C3%B6%C3%81%C2%92%03%C2%B1%C2%80%C2%8D%04sF%C3%8CC%C3%BB%C2%91p%C2%92%C2%9E%C3%80%1Bx%C3%91%C2%8F%04x\'%C3%A9%C3%93Y%7C%04p%C2%92V%031%00%C2%8B%C2%958%2B%0F!%14%5DRz%C3%AE\'yk%1E%C2%B9%03%C3%A7W%C3%85%18%C3%BB%C3%89K%C2%B9%13%C3%B2%7F%1Bn%C3%8A%5BQ%C2%AD%C3%A1%C3%AELAV%5Es%C2%B4%C3%8E%C3%8C%C2%9A_r%C2%B5%C2%B7k%C2%94%C2%A3%C3%99%C2%86%C3%9B%C3%B9%16r%C3%9C%C2%9AO%C3%B9x%C3%B2%C2%B9%C3%9BM%18%C3%BB%C3%93%C2%90%C2%8C%C3%9Ci%01%C2%BCA%C2%80%04%C3%B8%0D%C2%B8w*~%C3%AE%C3%B5%C2%B5%18%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A5IDATH%C2%89%C3%AD%C2%97%C3%81%0D%C3%83%20%0CE%1FQ%07%C3%88H%5D%C2%815%3C%10kt%C2%842%C2%927HN%C2%A9PU)%049X%15%C3%BC%13H%C2%96%C2%9F%C3%81%C3%9FH%04U%5D%C2%81%17%C3%B0%C2%A4%C2%9F2%10%C2%83%C2%AA%C2%BE%3B%C2%83%3F%05%04U%C3%9D%1C%C3%80%00%2C%5E%C3%A0Kp%111%C2%8D%C2%BB%04%C2%BFC%C2%8F%C2%B3%C2%80%C3%B2%24%C3%87%3A%C2%A5%C3%94%07%5E%C2%AB%C2%96%22%C3%BF%C3%83p%13n)3%C3%83%1D%C3%A6%12%C2%91%C3%AAi8%C2%85%C2%B7%24%C2%AD%C3%95%C3%AC%C3%B9O%7D%C2%BF%C3%93%C3%A5%C3%9E%C2%A2%05%26%C2%86k-r%C3%9C%C2%9EO%C3%B8xp%C2%93Q%2B%C3%87%C3%89%C3%ACmoMZ%2B%C3%97k%1F%C3%BB%C3%93%C2%90%C2%9D%C3%98y%01%C2%A2C%01%19%C2%88%3B%C3%AC%C2%A7%3Bv%C3%A5%07)0%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%97%C3%91%0D%C3%83%20%0CD%1FQ%07%C3%A8HY%C2%815%18%C2%885%3AB%19%C3%A96H%C2%BFZ)Q%C2%A5%3A%C2%84%C3%84%C2%AA%C3%A0%C3%BE%C2%90%2C%C2%BF36%C2%96%08%C2%92%C3%AE%C3%80%03%C2%98%C2%B9N%05%C2%88A%C3%92%C3%B3b%C3%B0%C3%87%40%C2%90%C2%B48%C2%80%01%C2%98%C2%BC%C3%80%C3%95%C3%B0%C2%94R%C2%938%C3%97%C3%8Ao%C2%96%20k%C2%A5%C2%A7%C3%80%C2%AD%C3%9Ak%C3%B2%C3%BF%06n%C3%80%C2%8F%C2%AA%C3%A9%C3%80%C3%A5%C2%9CW%C3%A7_%03h%C2%82%C3%AFMj%C3%95%C3%A8%C3%B9W%C2%9D%C2%B5%C3%99Lp%C2%ABjM%C3%B6%C3%9B%C3%B3%01%C3%AF%0F%C3%9E%C3%A4%C2%A9m%C3%97%C3%AF%5B%C2%87v%7BmR%C2%AB%5C%C2%AF%C2%BD%C3%AFOCqb%C2%97%09%C2%88%0E%06%0A%10_t%5B(n5%C2%A9%C2%B0%5C%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%96IDATH%C2%89%C3%AD%C2%94%C3%91%0D%C2%83%20%18%C2%84%3F%C2%8C%03t%C2%A4%C2%AE%C3%80%1A%0C%C3%84%1A%C2%8E%20%23%C3%9D%06%C3%BAdS%C2%8DRmS%7F%12%C2%B87%08%C3%A1%3B%C3%B2%1F%C3%A7%24%3D%C2%80%01xr%C2%9F%12%C3%A0%C2%9D%C2%A4%C3%B1f%C3%B0%C3%8B%C2%80%C2%934%19%C2%80%01%C3%A8%C2%AC%C3%80%0Dn%C2%A6~%C2%BB%11B%C3%B8%1B%2C%C3%86%C2%B8Z%1F%C2%A6%C3%BD%C2%8C%C2%89%C3%B7%C3%8Br%C3%A7%C2%B7%C3%90E%C3%B5%C3%8E%C2%BC%C2%AC%C3%80%7D%C2%AB%C2%A3%C2%B9%C3%A6d%C3%BA%C3%B2%C3%96%C3%AD%26*%C2%B3%C3%A1%3E%19%C3%99K%C3%B7%C3%9E%C3%B9%C3%9C%2F%C2%A8w%C3%A6e%05%C3%AE%17%5Dm%C2%B9%C3%96p%0D%5E%17%3C%19%C2%B1S%07x%03%03%09%C3%B03%C3%87%C3%AD5%C3%A0%C3%B4Qf*%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%94%C3%91%0D%C3%83%20%0CD%1FQ%07%C3%88H%5D%C2%815%18%C2%885%3AB%18%C3%89%1B%C2%B4%7F%C3%B9H%02%C2%AD%11%C3%85%C2%8A%C3%A4%C3%BBE%C3%A8%C2%9D%C3%8Eg%07%11Y%C2%81%17%C3%B0d%C2%9E%0A%10%C2%83%C2%88l%C2%93%C3%81%C2%BB%C2%81%20%22o%030%00%C2%8B%15%C3%98%C3%A1fz%C3%94%1ERJ_%3F%C3%A7%C2%9C%C3%BF%03%C3%97%C2%AAe%C2%B6f%C3%924%C3%B6%C3%93%C2%9E%C3%BF%12w%C2%AF%C2%8E%09T%C2%8F%C2%8Cv%C3%A6%C2%B7%C2%8B%7DX%C3%A1z%C2%9A%C3%AF%C2%B7%C3%9DD%C3%8D%C2%99%C3%B74x%18%5C%C2%AB%2B%C2%B3-%C2%93~%C3%A1.%C2%A5%C2%9D%C3%B9%C2%ADb%1FZ8%C3%AD%06%C3%B8%C2%85s%C3%B8tx1b%C2%97%05%C2%88%06%06%0A%10%3FF3I%C2%80k%C3%97%C2%92%C2%80%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%8FIDATH%C2%89%C3%AD%C2%94%C3%8D%0D%C2%84%20%14%06%07c%01%5B%C2%92-%C3%90%06%05%C3%91%C2%86%25%2C%25%7D%1D%C3%A8%C3%8D%C2%83%C2%BB%C2%A0h%C3%A23%C2%81%C2%B9%122%C3%AF%C3%9FI%C3%BA%0030%C3%B1%1C%09%C3%B0N%C3%92%C3%B7a%C3%B1%16%C2%80%C2%93%C2%B4%18%C2%88%01%18%C2%AC%C3%84%5Dn%C3%86%C2%98%7B%08!%1C~%C2%8E1%C3%9E%C2%92%C2%BF3%C3%B3ZJ%C2%95%C3%8AU%C2%A8%C3%9D%C2%813%C2%95%C3%BF%C2%9C%C3%973S~%C2%95%7D%C3%AF%C3%BBm7%C2%A1%C2%B8%C3%A7Wv%C2%B7%C2%86%C3%B7f%5E%C3%8B%C2%BFJ%C2%95*%C3%94%C3%AE%C3%80%C3%B5%0BgB%C2%BB%3Do%5B%C2%9E%C2%8C%C3%9Ci%00%C2%BCA%00%09%C3%B0%2B%C2%A5P2%5C%08%C3%A1%C2%93E%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        rollover: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8DIDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%84%20%10E%C2%9F%13C%0C%17%C2%B6%24Z%C3%98%0A%C2%AC%C3%8D%0Al%C3%81Bl%C2%82%C2%8B%07%0Fd%0F%1B%C3%B6%60p5%C2%9B0%C2%9A%C2%B0%C3%BFD%60%C2%92%C3%87%1F%60%C3%824%C3%B3%3C%3F%C2%80%11%C3%B0%C3%A8i%02%C2%9E-0%1Ac%C2%BCs%0Ekmq%C3%AA%C2%B2%2C%C2%84%10%C3%BC%C2%BA%C2%AE%C2%A3%00j%60%00k-%C3%8E9%00%2FiBS%5D%C3%97%01%C3%90n%17%C3%BA%C2%BE%2F%02%1C%C2%86%C3%A13%16%C2%91%3C%7C%1BXR%C2%A2B%C3%99Q%C3%96y%C3%92%C3%91%11%C2%A4%0C%C3%AD%C3%85%1De%C3%B0R%C3%A7%7Fx%7D%C3%B0%C2%AF%C2%B7%C3%BD%C2%AC~%C2%AD%0B%C3%B7u%5E%C2%BA%C3%92%C3%9D%C3%97%C3%B9%C3%99%C3%8A%C2%95%C2%8B%3B%C2%93%C2%B5z%C2%9FZ%C2%BD%C3%B0K%C2%8BL%C2%BD%C3%AF%C3%BC%5Ep%C2%AD%C3%8Fc%16%C2%AE)%C2%81w%0B%C2%A3%C2%A9%C3%84%13%60%0A!%C2%A8l%20%C3%86%C2%98z5%C2%80%C2%A9%C2%B9%C2%B2K%7D%01%C3%A1xE%C3%81%0D%C3%88%08b%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%93IDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%84%20%10%00%C3%87%C2%8D1%C2%86%0FW%12-%5C%05%C3%94f%05%C2%B6%60!6%C3%81%C2%87%C2%87%0Fs%2F%3E%C2%9E%1AQA%13%C2%9D%C2%A7%C2%AC%19va7%C2%A1%C3%A8%C3%BB%C3%BE%03%C2%B4%C2%80!%1F%1D%C3%B0-%C2%81%C2%B6%C2%AA*%C2%A3%C2%B5F)%C2%95%C3%9C%C3%AA%C2%BD%C3%879g%C2%86ah%05%C3%88%26%06PJ%C2%A1%C2%B5%060%12%3E%C3%A4%C2%A4%C2%AEk%00%C3%8A%C3%A9%C2%82%C2%B56%C2%99%C2%B4i%1A%00Dd%5E%1E%02%C2%B6%60%C2%AD%C2%8D%C2%8A%C2%9F%22%C2%BB%C3%BF%3C%C2%81%C2%BF%C3%8C%03k%C3%A5%C2%9F%C3%8B66%1E.%C3%8E%C3%BC%C2%95%C2%BF%C3%B2%C2%AC%2C%C2%B6Z%2C%7B%C2%86%C3%8D%C2%A2%C3%BC%C3%88%C3%A4%C3%9A%C3%8A%7D%C3%8B%3E7%C2%B5%C3%96*%12%1B%C3%BF%C3%9C%C3%9B%C3%BE%5C%C3%B9i%7D%0E%C3%B1%C3%AD%C2%B9*O%C3%9D%C3%AB%C3%8F%3D%C3%B3C%C3%B2%C2%A3%C3%87r%7D%C3%A6%C3%9E%C3%BB%C2%AC%C3%92%C3%A0%13%C2%A0s%C3%8Ee%C3%99%C3%808%C2%8E%C3%A1%C2%AD%06%C3%90%15W%C2%BER%7F%C3%98%C2%A7H%C3%81laP%C2%A1%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97K%0A%C3%83%20%14EO%1E!%04\'vIn%C2%A1%2B%C3%88%C3%9A%C2%B2%C2%82l!%0Bq%13N%1Cd%10%3A%12J1%C2%B5m%C2%A2%09%C3%98%3BT%C3%A1x%C3%9F%0F%5Ec%C2%AD%C2%BD%01%13%60(%C2%A7%19%C2%B8%C2%B7%C3%80%C3%94u%C2%9D%C3%91Z%C2%A3%C2%94%C3%8AN%C3%B5%C3%9E%C3%A3%C2%9C3%C3%8B%C2%B2L%02%14%03%03(%C2%A5%C3%90Z%03%18%09%07%25%C3%95%C3%B7%3D%00m%C3%ACr%18%C2%86%2C%C3%90q%1C%01%10%C2%91mxxt%C2%A4b%C2%86%C3%A4p%C3%8A%17%C2%8A%3A%7F%C3%96V%0ABtR)z%17%C3%85S%C2%9D%C3%BF%C3%A1%C3%B5%C3%81%C2%93%C3%95%C2%9E%C2%A3%C3%A7%C2%83%C2%AE%C3%AD%3C%C2%A5%3D%C2%91%C2%B9%C2%BE%C3%B3%C3%98%14%7Bu%C2%9C%C2%9A%C2%841%C3%95%C3%9Bj%C3%B5%C3%82%3F*%C2%B8%5C%C2%83fw%C2%9F%07%C3%BD%C3%B2%C3%81zs%5E%0C%1EK%C3%8B%C3%B9%C3%8E%C2%BD%C3%B7E%C2%A1%C2%81\'%C3%80%C3%AC%C2%9C%2B%C3%B2%C2%81u%5D%C3%83%C2%AE%0607gn%C2%A9%0F%C2%A1%C2%B7F%C3%9EI%C2%82%C3%87%06%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8EIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10E%1F\'%C2%84%C2%90%1Bg%24%C2%AF%C2%90%09%C2%98%C2%8D%09X%C2%81AX%C3%82%C2%8D%0B%0A%C2%94%C3%8AQ%C2%94%10%40%09%3E%23%C3%81%2B%C3%AD%C3%A2%C2%9D%C2%BE%C3%AC%2F%5D1%0C%C3%83%0D%C3%A8%00%C2%87%1E%3Dp%2F%C2%81%C2%AE%C2%AA*g%C2%AD%C3%85%18%C2%93%C3%9C%1AB%C3%80%7B%C3%AF%C3%86q%C3%AC%04P%13%03%18c%C2%B0%C3%96%028%C2%89%07%C2%9A%C3%94u%0D%C2%80%C2%BC_4M%C2%93%5C.%22%C3%B3rM%C3%8A%C2%A5%C3%8B%C2%B5%14%C3%9A%C2%B6M\'%C3%9F%C3%8A%C2%B7!%C3%97%C2%86%C3%8B%1A%C3%BB%25%C3%8F%C3%82.%0F%C3%AE%C3%97W%C2%BF(%C3%BF%C3%B7%2B%C2%ADq%C2%BC%C3%98ST%C3%AC%5C%C2%8A%C2%B3%C3%B2%C3%94qG%C2%8E%17%7Bd)%C3%BE%3D%C3%92I%C3%96%C3%AD%5B%C2%86%3Bo%C3%83%C2%9DW~u%7B%16%3E%C3%A4Z%C3%95%C3%BA%C2%94%C2%87%10%C3%94%C2%84%C2%AF%3E%01z%C3%AF%C2%BD%C3%8A%00%C3%934%C3%85%5D%0D%C2%A0%2Frn%C2%A9%0Fu%C2%98F%C3%A2%C3%90%C2%AAad%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%88IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10E%C2%9F%13c%0C%1Bz%24%C2%AE%C3%90%13p6O%C3%A0%15%3C%C2%88%C2%97%60%C3%83%C3%82%C2%85%C3%A9%C2%8A%C2%A6iS%13%C2%9C%C2%88%C2%B6%C3%BA%C2%960%C3%B0%C3%A0%C2%87LB5%C2%8E%C3%A3%0D%C3%A8%01G9%06%C3%A0%5E%03%7D%C3%934%C3%8EZ%C2%8B1fsk%C2%8C%C2%91%10%C2%82%C2%9B%C2%A6%C2%A9%17%C2%A0%C2%98%18%C3%80%18%C2%83%C2%B5%16%C3%80I%1A(I%C3%9B%C2%B6%00%C2%88f%13%C3%AF%C3%BD%C2%AAu%22%C2%A2%C2%97k%C3%99U%5E%2FM~%C2%8B%C2%B5%C3%AB%3AUm%C3%A2%C2%BC%C2%B1_%C3%B2%5DX%7C%C3%ADK%2FUS%C2%9B8%C3%96%C3%8Ds%5BfN%C3%BD%7B%3A%1F%C3%B2%C2%9C%C3%B8%C2%BC%C3%B7%C2%AB%C3%A2N%1C%2B%C3%B6W%C2%AE%C3%B6z%C3%89%C3%BFJ~%C3%9E%C3%B6%C3%BA%C2%BBrMk%7D%C3%8Ac%C2%8C%C2%AAMrI%3E%01%C2%86%10B%C2%91%03%C3%8C%C3%B3%C2%9C%C3%BEj%00C%C2%B5%C3%A7%2F%C3%B5%01C%C2%BDJ%C3%B7r%5D%C3%81H%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%10%40%1F\'%C2%84%C2%90%1Bg%24%C2%AF%C2%90%09%C2%98%C2%8D%09X%C2%81AX%C3%82%0D%05%05J%11%11%C2%A50%C2%9F%18%7C%20%C2%85W!%C2%8A%7B%C3%B6%C3%9D%C3%B9%C2%A4%C3%8B%C2%BA%C2%AE%7B%00%0D%C3%A0%C3%90%C2%A3%05%C2%9E9%C3%90%14E%C3%A1%C2%AC%C2%B5%18c%C2%92%5B%C3%BB%C2%BE%C3%87%7B%C3%AF%C2%86ah%04P%13%03%18c%C2%B0%C3%96%028%C2%99~hR%C2%96%25%00%C2%A2%25%C2%AC%C2%AA%C3%AA%C3%B3-%22%C2%BA%C3%B2%10%C3%B9%C3%9E%00%C3%9F7%0AQ%C3%97u%C2%BC%7C.%C3%B8R%C3%90%C2%AD%C2%9C%C2%9A%C3%B6%5B~%0A%C2%AB%0DwDcE%C3%8B%C3%97%C3%98s%C2%B8%C3%AB%C2%A5%7Dmp%24%C2%95%C2%A7%C2%A8s%C3%A8B%C3%97K%C3%BB%C2%AF%2C%C2%95i%C3%97l%C2%9F%0B~%C3%8F%C3%B6%5B%1E%C3%83%C2%A6%C2%86K5%C3%9F%0Fyj%C2%B1%C2%87%C3%BB%C2%8F%C2%9A%C2%87%C2%B2%23%C3%B0%5Ea4%C2%99%7C%02%C2%B4%C3%9E%7B%C2%95%03%C2%8C%C3%A38%C3%ADj%00mv%C3%A6%C2%96%C3%BA%02%02%0AF%1C%C2%A2V%C3%B6X%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8BIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10%00%C2%8F%17B%C2%96%1Bg%24%C2%AF%C2%90%09%C2%98%C2%8D%09X%C2%81A%C2%BC%C2%84%1B%0A%0A%C2%94%22%C2%A1%C2%88%C3%A2%10%0B%C3%82%C2%83%04W%C3%9A%C3%85%C2%BD%C3%BD%C3%AF%C2%97%C2%BF%08!%C3%9C%C2%80%16%C3%B0%C3%A8%C3%91%01%C3%B7%12h%C2%AB%C2%AA%C3%B2%C3%8E9%C2%AC%C2%B5%C2%9B%5B%C3%BB%C2%BE\'%C3%86%C3%A8%C2%87ah%05P%13%03Xkq%C3%8E%01x%C2%99%1641%C3%86%00%20%C2%AA%C3%96%17%22%C2%92%C2%96%C3%97u%C2%AD%17%C2%84%C2%9A%C3%A9h%C3%B2rn%C3%B3%5B%0A%C2%9A%C2%A6%C3%99%5E%C2%9EK*%C3%88%C2%9C%00%C3%8F%C2%9B%C3%B3%C3%B3%C3%8Ag%0B.%C2%B7%C2%AA%C2%97V%C3%BFqO%C3%BE%C2%AB%C3%95%C2%AE%7D%C3%AF%C3%87%3Dy.K%3B%C3%A1y%C2%9F%C3%9A%25%C3%9F%C2%85%C2%AB%C3%83%C2%BD%C2%B1%C3%85\'2u%3B%1F%C3%B2%7F%7D%C2%91r%10x%C2%8E0%C2%9AL%3E%01%C2%BA%18%C2%A3J%00%C3%A38N%C2%B3%1A%40W%C3%AC9%C2%A5%3E%00%C2%AC%5ED%C3%BB%C2%A4%C3%BB%C2%A6g%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%90IDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C2%830%0C%C2%86%3F%2C%C2%84P.%C3%A9HY%C2%A1%130%1B%13d%05%06a%C2%89%5C8p%40%3D%C2%B4%5C%C3%BAH%C2%95%06%0CR%C3%BA%1F%C3%B3%C3%90g\'%C2%B6eW%C3%A38%5E%00%0F8%C3%B44%00%C3%97%1A%C3%B0M%C3%938k-%C3%86%C2%98%C3%9D%C2%A9%C3%934%11Bp%C3%B3%3C%7B%01%C3%94%C3%80%00%C3%86%18%C2%AC%C2%B5%00N%C3%96%05M%C2%B5m%0B%C2%80%C2%A8R%1F%12%C2%91%7Cx%C3%97uyFd%C3%9D%C3%8E%C3%94%C2%A1%C3%B0%3A%C2%B6%C3%B9%C3%AEY%C3%BB%C2%BE%C3%97%C2%81%C2%A7*%C3%95%C3%98r%C3%BF%C2%BC%5Cx4%C3%A0R%23%3B%C3%B5%C3%BC9%3D%C2%8F%C2%95%C3%8E%C2%ADr%7D%C2%B3%3C%C3%BF%C3%85%C3%98r%C2%A3%C3%BD%0F%2F%0F%C3%BE1%C3%95%C3%B6%C2%AEnp6%C3%8FS%C2%9B%C3%82%C2%94%C3%B3%C3%8F%C2%AF%C3%B3%02%C3%9F%C2%B2M%C3%BA%26%C2%81%C3%BB%08%C2%A3%C2%A9%C2%95\'%C3%80%10BP1%60Y%C2%96uV%03%18%C2%AA%23%C2%A7%C3%94%1B%3FGF%18%C3%BE%C3%BF~y%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%92IDATH%C2%89%C3%AD%C2%97%C2%BD%0D%C2%830%10F%1F\'%C2%84%C2%90%1Bg%24%C2%AF%C2%90%09%C2%98%C2%8D%09X%C2%81AX%C3%82%0D%05%05J%C2%91%C2%B8%0A%01%C2%8B%C2%9F3%C2%92%C3%B3J%C2%8A%7B%3E%C3%B3%C3%B9%C2%A4%2B%C2%86ax%00%1D%C3%A0%C3%90%C2%A3%07%C2%9E%25%C3%90UU%C3%A5%C2%AC%C2%B5%18c.%C2%B7%C2%8E%C3%A3%C2%88%C3%B7%C3%9EM%C3%93%C3%94%09%C2%A0%26%060%C3%86%60%C2%AD%05p%12%3EhR%C3%975%00%C2%A2j%C3%BD%20%22%C2%BA%C3%B2%C2%A6i%C2%BE%0F%C2%A1%25_%22%C2%A9%C2%BC%3C%C2%AB%C3%90%C3%92%C2%B5%02%C2%B4m%7BL%C2%BETx%C2%ADh%2C%C3%B9%C3%BE%C3%B3%7C%C3%A5Q%C2%81%C2%8B%09%C3%97%C2%9E%00%C3%9E%C2%BF%C3%B35~%C2%BD%C3%AF%C3%80%C3%9A%C2%8D%C3%9C%C2%BB%C3%B3%3D%C2%93%2B%C2%96%7C%C2%9F%C3%9A_%C2%9E%C2%84%C3%8D%C2%B4o%C2%A5%C3%BAH%C3%AA%C3%AF%C3%97%C3%B9%C3%96%C3%94%C2%BAT~%C3%86%00%C2%89A%C3%A0%C2%BD%C3%82h%12%7C%02%C3%B4%C3%9E%7B%C2%95%03%C3%8C%C3%B3%1Cv5%C2%80%C2%BEH%C2%B9%C2%A5%C2%BE%004%C3%85C%18%04_%C3%A3~%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8DIDATH%C2%89%C3%AD%C2%97%C2%BD%0D%C2%85%20%10%C2%80%3F%2F%C3%86%18%1A%C3%9C%C3%80UX%C3%A1M%C3%A0lN%C3%A0%0A%0EB%C3%A3%084%14%16%C2%BEW%C2%BC%C3%90%C2%98%C3%B8%13%C2%A3P%C3%88W%C2%92%0B%C3%9F%C3%81q%C2%97PXk%1B%60%00%0C%C3%B1%18%C2%81O%09%0CUU%19%C2%AD5J%C2%A9%C3%87%C2%AD%C3%9E%7B%C2%9Csf%C2%9E%C3%A7A%C2%80hb%00%C2%A5%14Zk%00%23a!%26u%5D%03%20%7BA%5D%C3%97%C2%9D%C3%9A%C3%ACl%5C%40D%C2%8E%C3%A5OS%1E%05%C2%ACO%C3%95%C3%B7%7D%3C%C3%B9Y%C2%AE%24%C2%99%C3%B4%C3%9A%C2%B3%3C%09%C2%B7%3D%C2%B8%2B%5Dp(%C2%BF%C2%B3%C2%B5%C3%96%C3%A4%C2%9Ao%C2%B25%C2%B7%C3%AF(%C3%87c%13.%C2%B0%C2%97%C3%A4%7Bk%C2%9E%C3%A5%C3%AF%C2%93%C3%A7%C3%99%C2%9E%C2%84%C3%82Z%C3%BBm%C3%9B6%C2%BAx%C2%9A%C2%A6%C3%BF%C3%89%C2%BD%C3%B7Q%C3%85%C3%81\'%C3%80%C3%A8%C2%9C%C2%8B%C2%92%C3%80%C2%B2%2C%C3%A1%C2%AF%060%16)%7F%C2%A9%3F%2B%0AG%C3%87%0D%C2%B6HD%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C2%BF%0D%C2%84%20%14%C2%87%3F%C2%891%C2%86%C2%86%C3%9B%C3%80UX%C3%A1%26%606\'p%05%07%C2%A1q%04%1A%0A%0B%C3%AF%C2%8A%0B%C2%89%C2%B9%5C%22G%10%0A%C3%BDU%40%1E%7C%C2%8F%C3%B7%C2%87%C2%84%C3%86Z%C3%BB%00%26%40SN3%C3%B0l%C2%81%C2%A9%C3%AB%3A%C2%AD%C2%94BJy%3A%C3%95%7B%C2%8FsN%C2%AF%C3%AB%3A%09%C2%A0%18%18%40J%C2%89R%0A%40%C2%8B%C2%B0PR%7D%C3%9F%03%20b7%18c%C2%B2%C3%99%09!%C3%BE%C2%83%C2%9F%C2%A1%C3%B6%C3%88%60%7F%C2%930%1E%C3%87%C2%B1%0C%3CV)NV%0D%C3%BB%0D%C2%AF%C2%A2l%05%17%C2%8A%C3%8B%18%13%C3%9D%0D%C2%87%C3%B0%C2%94Ccu%C3%A7%C3%BC%C2%A7%C2%BE%C3%9F%C3%A9%C3%BD%3CG%0A%C2%B2%14%5C%C2%AA%C2%93%C3%97%C3%8D%C3%B9%0D%C2%BF%1E%3CK%C2%AB%C3%AD%C3%9B)%C3%9B%C3%9B%C2%9Ezh%C2%AC%C2%AA%C2%86%C2%BD%C2%B1%C3%96%C2%BE%C2%86a(%0E%5E%C2%96%C3%A5ss%C3%AF%7DQp%C3%A0%09%60v%C3%8E%15q%60%C3%9B%C2%B6%C3%B0W%03%C2%98%C2%9B%C2%9A%C2%BF%C3%947%C2%98!X%3B%C2%A8l%C2%9A%C2%AE%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C3%83%20%10%40%C2%9FQdY4d%03%C2%AF%C3%82%0A%C2%99%C3%80%C2%B3y%02%C2%AF%C3%A0Ah%3C%02%0D%C2%85%0B\'ED%C2%91(R%C3%8E%C3%98%C2%86%C3%82~%1D%08xw%7CN%C2%A2r%C3%8E%C3%9D%C2%81%01%C2%B0%C3%A4c%04%1E7%60%C2%A8%C3%AB%C3%9A%1Ac%C3%90Z%1Fn%0D!%C3%A0%C2%BD%C2%B7%C3%B3%3C%0F%0A%C3%88%26%06%C3%90Zc%C2%8C%01%C2%B0*v%C3%A4%C2%A4i%1A%00T%C3%8A%C3%A4%C2%AE%C3%AB6%C2%8DSJ%C2%A5%C3%8B%C3%B7%C3%A2%26%19%24%C3%8D%C3%B4%10%C2%B9%C2%94%C2%B5A%16%C3%9D%C3%B6K%5E%C2%84%5D%2F%5C%C3%9F%C3%B7%1F%C3%AD%7F%17P%24_%C2%BB%C2%A8%C2%94%C3%AB%C3%8C%7FrTe%13%C3%89%C2%A5%C2%A4%06y%C3%9E3%C2%BF%C3%A4%C3%A7%C2%93%C3%AF%C3%B2%C3%94%C2%BE%C3%8BodSmO%5DTJ%C3%91m%C2%AF%C2%9Cs%C3%8F%C2%B6m%C2%B3%C2%8B%C2%A7izg%1EB%C3%88*%C2%8E%3E%05%C2%8C%C3%9E%C3%BB%2C%01%2C%C3%8B%12%C3%BFj%00cU%C3%B2%C2%97%C3%BA%02*vD%C2%AFu%C3%B7%C3%B8%25%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%90IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E%C2%9F%C2%83%C2%88d%C2%93%1E)W%C3%A8%09%3C%C2%9B\'%C3%B0%0A%1E%24%C2%97%C3%88%26%0B%17%C3%92M%23ElZ-%26%01%C3%BB%C2%97%C3%83%C2%90%C3%B7%C2%87%C3%B9%0C%C2%A4%C2%B2%C3%96%C3%9E%C2%80%010%C2%A4%C3%93%08%C3%9Ck%60h%C2%9A%C3%86h%C2%ADQJ%C2%9DN%C3%B5%C3%9E%C3%A3%C2%9C3%C3%934%0D%02%24%03%03(%C2%A5%C3%90Z%03%18%09%C2%85%C2%94j%C3%9B%16%00IJ%7DJD%C3%B2%C3%81%17%139%C3%A1%C3%B5%C2%BA%C3%90u%C3%9Di%C2%B0%C2%BE%C3%AF%C3%A3%C3%B0%C3%90%C3%B0%C2%8D%C2%89%C3%97%C3%87b%C3%BDkh%C3%90uw%5EV%C3%A0%C2%8E%C3%AA%C3%9D%5Ec*s%C3%B2%23%C2%93%C3%AC%C3%95%3Fp%C2%8B%C2%8A%C2%B8p%C2%9F%C2%8Cleb%C2%AB%3F%C2%96%C2%9D%C3%AB%C3%AE%C2%BC%C2%AC%C3%80%C3%BD%C2%A2%C2%BD%C2%B7%C2%A1%C3%9C%C3%89%C3%8F%C2%BEr%C3%97%0D%5C~%C2%B8%C3%B7%3E)4%C3%B0%04%18%C2%9DsI%0C%C3%8C%C3%B3%1C%C3%BEj%00c%C2%95%C3%B3%C2%97%C3%BA%00ysH%C3%81%C2%88%C3%95%2B%C2%8C%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A9IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%14E%0F%16B%C3%88%C2%8D%C2%B3%01%C2%ABx%C2%85L%C3%80lL%C3%80%0A%0C%C3%A2%C2%86%11%C3%9C%C2%B8%C2%A0%20i%02%C2%8A%14%20%C2%98%C2%80-%14n%C3%A9%C2%8F%C3%8E%C3%95%7D%C3%8FOrb%C2%8C%C2%B9%015%C2%A0%09%C2%A7%06%C2%B8%C2%A7%40%C2%9De%C2%99VJ!%C2%A5%3C%C2%9C%C3%AA%C2%9C%C3%83Z%C2%AB%C2%BB%C2%AE%C2%AB%05%10%0C%0C%20%C2%A5D)%05%C2%A0%C3%85%C2%B0%10Ry%C2%9E%03%20%C2%82R_%12B%C3%84%C2%83%C2%8F%26b%C3%82%C3%93%C2%B9%C2%8D%C2%B2%2C%C2%BF%5E%C2%AE%C2%AA%C3%AA%18%C2%B8%C2%AF%C2%96%C3%8C%C3%8E%C2%99%C2%8C%1A%7Bb%C2%8Cy%14E1.%C2%AC%C2%89%7B%C2%AB%C3%9E%13h%C3%9B%C3%B63%C3%B6%C3%A1%C2%80o%C3%8DO%17%C3%BBn%0D%C2%B7%C2%A5%C3%B3g%C3%A1%C2%BF%3E%C2%A35%C2%BA%26%C3%9C%C2%A4%C2%B6t%C3%B0np_M%C2%99%5D2yM%C2%B8%C3%89%03%C2%BE5%3FU%C3%AC%C2%BB6%C2%9C%C3%AF%0BX%C2%84%1F%3D%C3%A5%C3%BEw%C3%82%C3%85%C2%87%3B%C3%A7%C2%82B%07%C2%9E%00%1Akm%10%03%7D%C3%9F%0F%7F5%C2%80%26%C2%89%C3%B9K%7D%02%14%17a%C3%A9%C2%A6%19%C3%A3%C3%9C%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDATH%C2%89%C3%AD%C2%97%C3%8D%0D%C2%83%20%18%40%C2%9F%C3%84%18%C3%83%C2%85n%C3%A0*%C2%AC%C3%90%09%C2%9C%C3%8D%09%5C%C3%81A%C2%B88%02%17%0E%1El%2F%C3%954%C2%A9%C3%9A%C2%A2%11L%C3%A8%3B%C3%B2%C2%93%07%C3%9F%0F%09%C2%991%C3%A6%06%C2%B4%C2%80%26%1C%1Dp%C3%8F%C2%81%C2%B6(%0A%C2%AD%C2%94BJy%C2%BA%C3%959%C2%87%C2%B5V%0F%C3%83%C3%90%0A%20%C2%98%18%40J%C2%89R%0A%40%C2%8Bi%20%24eY%02%20%C2%82Z_%08!%C3%A2%C3%89%C3%A7C%C3%84%C2%94%C3%A7k%13u%5D%7F%C3%9D%C3%9C4%C3%8D!%C3%B95o%C3%AE%C3%8BV%C2%A4%C3%96%22%C2%94n%C3%81E%C2%95g%C3%86%C2%98GUU%C3%B3%C3%80%2FU%C2%BE%C2%97%C3%B7%C3%9C%C3%B7%7D%C3%BFYpG%C3%9B%C3%87%C2%87ts%C2%BE%C3%99%C3%A7%7Bz%C3%97%C2%87%C3%AB%C3%9E%C3%9C%C2%97%C2%A5HmE(%C3%9D%C2%82%C3%BB%C2%BFp%C2%8B%0B%C3%8E%26%C3%9D%C2%9C%C3%87%C2%97%3B%C3%A7%C2%82J\'%C2%9F%00%3Akm%C2%90%03%C2%8C%C3%A38%C3%BD%C3%95%00%C2%BA%2C%C3%A6%2F%C3%B5%09*%C2%B5NU%C2%88%C3%A9%3Ac%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        pressed: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9BIDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_FEp%C3%95%23y%05%C3%AF%C3%A21%C2%BC%C2%8BW%C3%B0%20s%0E!%C2%84%24%5D%C3%99%C2%96b%C2%AB%14%12%05%C3%BBW%C2%81%0C%C2%BC%C3%8CO%C3%A6C%C2%8C%C2%AA%C3%9E%C2%80%11h%C3%89%C2%A7%09%C3%A8J%60%14%C2%91%C2%B6%C2%AA*%C2%8A%C2%A2HN%C3%B5%C3%9E%C3%A3%C2%9CkC%08%C2%A3Q%C3%95X%C3%97u%16%C3%B0%C3%AB%01%C2%AC%C2%B5%08%C2%90%15%0C%20%22%00%C2%94%C3%AF%1B%7D%C3%9F\'%01%0E%C3%83%C3%B0X%1Bc%C3%96%C3%A1%C3%AF%C2%85)%25Y(%1F%C2%B4%C3%9A%C3%B9%C2%A2%C2%AD%2BX%1C%C3%BAT%C2%B7%C3%A5%C3%A0%C2%A1%C2%9D%C3%BF%C3%A1%C3%97%C2%83%7F%7D%C3%AD%7B%C3%B5k.%C2%9C%C2%B7%C3%B3%C3%94Iw%C3%9E%C3%8E%C3%B7%26%C3%97Z%C3%9D%1E%C3%97%C2%AE%3Bj%C3%97%C2%85%1F%1A2%C3%97%C2%9D%C3%B3C%C3%A1FUc%C3%934%C3%99%C3%81%C3%B3%3C%C2%9F%C3%80v%C3%AF%7DV%C3%A8%C3%82%13%60r%C3%8Ee9%40%C2%8Cq%C3%B9%C2%AB%01L%25%C3%90%C2%85%10Fkm%C2%9B%C2%9C%C3%BE%C3%94%04tw%C2%98%C2%95U%C2%AF%40(%C3%BAp%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%ABIDATH%C2%89%C3%AD%C2%97%C3%81%C2%8D%C2%830%10E%C2%9F%07%10%12%C2%A7-%C2%89%16%C3%A8%C3%85e%C3%90%0B-P%C3%88%C3%94%C2%81dY%C3%989%20%C2%B2%C2%AB%C3%9D%04%C3%89%24%C2%98%C2%95%C3%88%C2%BBp%C3%80%C3%B2%C2%B3%3F%C3%8C%C3%886%C2%AA%C3%BA%05%0C%40K%3EF%C2%A0%2B%C2%81AD%C3%9A%C2%AA%C2%AA(%C2%8A%C3%A2p%C3%AB%3C%C3%8Fx%C3%AF%C3%9B%10%C3%82%60T5%C3%96u%C2%9DE%C3%BCs%01%C3%8E9%04%C3%88*%06%10%11%00%C3%8A%C3%9F%2F%C2%AC%C2%B5%C2%87I%C3%BB%C2%BE%07%C3%80%18%C2%B3%3CU56M%C2%B3k2k%C3%AD%7D%C3%82T%C2%A6iZb%3F%C2%8B%3F%C2%B1%C2%AFl%C3%85%C3%BFh%C2%B7%C2%A9%C3%A3%C2%81sw%C3%BE%C2%91%7F%C3%A4YyZj%C2%A9%C3%ACi6O%C3%A5%7B%3BW%0A%C3%BF7%C3%B6G%5Dk%2B%C2%91%C3%94%C3%B1%C3%97%C3%BD%C3%9B%C2%AF%2B%7F%5B%C2%9DCzyn%C3%8A%C2%8F%C2%AE%C3%B5%C3%AB~%C3%B3%C2%97%0E%C2%90%C2%AFp%C3%BA%01R%60%C2%B9A%C3%A4d%C3%B5%090z%C3%AF%C2%B3%2C%20%C3%86%C2%B8%C3%9E%C3%95%00%C3%86%12%C3%A8B%08%C2%83s%C2%AE%3D%C3%9C%C3%BE%C3%8D%08t779%5D%C2%9B%0A%25%C3%9C%3B%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A8IDATH%C2%89%C3%AD%C2%97%C3%81i%C3%840%10E%C2%9F%C3%866%06%C2%9F%C2%B6%24%C2%B7%C3%A0%5E%5C%C2%86%7Bq%0B.d%C3%AA0%08!)\'%C2%91%25h%C3%A3%24%C2%BBR%0C%C3%9E%7F%C2%95%C3%A0%C3%8D%C3%BF%C2%A3%19%C2%90Q%C3%95%1B%C2%B0%02%23%C3%B5%C2%B4%01S%0B%C2%AC%222v%5DG%C3%934%C3%85%C2%A9%C3%9E%7B%C2%9Csc%08a5%C2%AA%1A%C3%BB%C2%BE%C2%AF%02%C2%BE%2F%C3%80Z%C2%8B%00U%C3%81%00%22%02%40%C2%9B%3B%C2%9C%C3%A7%C2%B9%08tY%16%00%C2%8C1%C2%8F%C3%A1%C3%A9%C3%92%2B%C2%953%24%2F%C2%A7%C3%BCBY%C3%A7%C3%B7z%C3%94%C2%82%C2%94%C3%8EQ%C2%8B%C2%BEK%C3%B1_%C2%9D%C2%BF%C3%A1%C3%97%C2%83%1F%C2%BE%C3%B6%123%C2%9Ftn%C3%A7Gz%26%C2%99%C3%B3%3B%C3%8Fm%C2%B1%C2%AF%C2%8E%C2%8F6aN%C3%97%1D%C2%B5%C3%AB%C3%82%7F%C3%B4%C3%A0J-%C2%9A%C2%A7%C3%A7%3C%C3%A9%2F%05%5E%C2%B7%C3%A7FU%C3%A30%0C%C3%95%C3%81%C3%BB%C2%BE%C2%9F%20v%C3%AF%7DUh%C3%A2%09%C2%B09%C3%A7%C2%AA%14%10cL%7F5%C2%80%C2%AD%05%C2%A6%10%C3%82j%C2%AD%1D%C2%8B%C3%93%3F%C2%B5%01%C3%93%07%07%C3%84W%0B%C2%9B(4%60%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A0IDATH%C2%89%C3%AD%C2%97%C3%81%09%C2%830%18F_%C2%A2%22x%C3%AAHY%C3%81%5D%1C%C3%83%5D%5C%C3%81A%C3%BE9%C2%84%10%C2%92%C3%B4P%C2%A4%C2%A5X%C2%95%C3%96%C3%84B%C3%BB.9%C3%A4%C3%B0%C2%BE%7C%24%3FD%C2%89%C3%88%05%18%00C%3EF%C2%A0-%C2%81Akm%C2%AA%C2%AA%C2%A2(%C2%8A%C3%A4V%C3%AF%3D%C3%8E9%13B%18%C2%94%C2%88%C3%84%C2%BA%C2%AE%C2%B3%C2%88%1F%03Xk%C3%91%40V1%C2%80%C3%96%C3%BA%C2%B6%3Eot%5D%C2%97%5C%C2%AE%C2%94Z%C2%96%C3%A7%C2%A4%5C%C3%9B%C3%9Cj%C2%A1%C3%AF%C3%BBt%C3%B2%C2%BD%C2%BC%0A%C2%B9%15%C3%AE%C3%94%C3%9A%C3%BF%C3%B2S8%C3%A4%C3%82%C2%BD%7B%C3%ABW%C3%A5%C2%9F%3E%C2%A5-%C2%BE%C2%AF%C3%B6%14%23v%C2%A9%C3%85Ey%C3%AA%C2%BAg%C2%BE%C2%AF%C3%B6%C2%99%C2%B5%C3%BA%C2%8Fh\'%C3%99l%C3%9F%13%C3%AEw\'%C3%9C%C3%AF%C3%8A%C3%BF%C2%B3%C3%BD%14%C2%94%C2%88%C3%84%C2%A6i%C2%B2%C2%8B%C2%A7i%C2%BA%C2%9D%C3%9C%7B%C2%9FU%3C%C3%BB40%3A%C3%A7%C2%B2%04%C2%881%C3%8E%7F5%C2%80%C2%B1%04%C3%9A%10%C3%82%60%C2%AD5%C3%89%C3%ADwF%C2%A0%C2%BD%02%C2%8E%C2%A7W%0F%C2%9EL%02e%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9AIDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%14EO%C2%A2%22%C3%B8%C3%95%C2%91%5C%C3%81%5D2%C2%86%C2%BB%C2%B8%C2%82%C2%83%C2%BC9%C2%84%10%C2%92%C3%B4%C2%A3%C2%A4-%C2%94Jkh%2C%C2%AD%C3%A7GHb%C3%8E%C3%B3%C3%B1%C2%B8%C2%A0%12%C2%91%130%01%3D%C3%A5%C2%98%C2%81%C2%A1%06%26%C2%ADu%C3%9F4%0DUU%7D%C3%9C%C3%AA%C2%BD%C3%879%C3%97%C2%87%10%26%25%22%C2%B1m%C3%9B%22%C3%A2%C3%BB%02%C2%AC%C2%B5h%C2%A0%C2%A8%18%40k%7Dy%C3%A6%5Cb%C2%8C%C3%99%C3%B4%C2%9ER*_%C2%9E%C3%8B%C2%AE%C3%B2zm%C3%B3Y%5B%C3%87q%C3%8C%3A%C2%9B%C3%B8%C3%9F%C2%B6%1F%C3%B2%5DX%C2%9D%C3%B6%C2%B5I%C3%8D9%C2%9B%C3%98%C3%B5%C3%8B%C2%95%C2%88%C3%84%C2%AE%C3%AB%C2%AE%0B%5B%23%C3%B3%15%C3%AE%C2%BB%C2%B3%2C%C3%8B%C2%A3%C3%BC%1D%C2%8C1%C2%9B%C3%9A%C2%9D%C3%A4%C3%9F%3BpG%C2%BC%1E%C3%B2%C2%9F%C2%92%C3%BFo%C2%BC~W%C2%B6%C2%97%C3%A2%1A%C2%AF%C3%9E%C3%BB%C2%A2%C3%A2%C3%A4%C3%93%C3%80%C3%AC%C2%9C%2BR%40%C2%8C1%C3%BD%C2%AB%01%C3%8C50%C2%84%10%26km%C3%BFq%C3%BB%C2%8D%19%18%C3%8E%C3%9EFe%C2%835%C3%A2%C3%93M%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A7IDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%830%0C%00%2F%01%C2%84%C3%84%C2%AB%23%C2%B1%02%C2%BB0%06%C2%BB%C2%B0%02%C2%83x%0E%C2%A4(J%C3%92%07%C2%A2%C3%AD%C2%83%16%0AM%C3%A8%C2%83%C3%BB%C2%90%C2%97%C3%8Fv%C2%8C%C2%A5(%11%C2%B9%01%3DP%C2%93%C2%8E%01hr%C2%A0%C3%97Z%C3%97EQ%C2%90eYt%C2%ABs%0Ekm%C3%AD%C2%BD%C3%AF%C2%95%C2%88%C2%84%C2%B2%2C%C2%93%C2%88_%130%C3%86%C2%A0%C2%81%C2%A4b%00%C2%AD%C3%B5%C3%B4M%25l%C3%9B%C3%B6qVJ%C2%A5%C2%95%2F%C2%91%1F%0D%C3%B0Z%C3%91%12%5D%C3%97%C3%AD%C2%97%C2%BF%0B%C3%BE)%C3%A8VNm%C3%BB%25%3F%C2%85%C3%95%C2%81%C3%BB%C3%85%60%C3%AD%C2%96%C2%AFq%24%C2%B9%C3%BFk%C3%BB%C3%9A%C3%A2%C2%88*%C2%8Fq%C3%8FK%05%C3%BD_%C3%9B%C2%BF%C3%A5%C3%935%1D%C3%9A%C3%AD%C3%AF%C2%82_%C2%BB%C3%BD%C2%92%C3%AFa%C3%93%C3%80%C3%85%C3%9A%C3%AF%3F%C3%B9%C3%95%C3%B6%26wj%C3%9B%C2%95%C2%88%C2%84%C2%AA%C2%AA%C2%92%C2%8B%C3%87q%C2%9C*w%C3%8E%25%15%C3%8F%3E%0D%0C%C3%96%C3%9A%24%09%C2%84%10%C3%A6%C2%B7%1A%C3%80%C2%90%03%C2%8D%C3%B7%C2%BE7%C3%86%C3%94%C3%91%C3%ADO%06%C2%A0%C2%B9%033%1EV%C3%873x%C2%B8%C2%81%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9CIDATH%C2%89%C3%AD%C2%97%C3%8D%09%C2%830%18%C2%86%C2%9FDE%C3%B0%C3%94%C2%91%5C%C3%81%5D%1C%C3%83%5D%5C%C3%81A%C2%BE9%C2%84%10%C2%92%C3%B4%60K%5B%C2%B0*%C2%B6FA%C3%9FK%0E9%3C%C3%AF%C3%B7K%C2%A2D%C3%A4%06%C2%B4%40I%3Cu%40%C2%95%02%C2%AD%C3%96%C2%BA%C3%8C%C2%B2%C2%8C%24I6%C2%A7%3A%C3%A7%C2%B0%C3%96%C2%96%C3%9E%C3%BBV%C2%89H%C3%88%C3%B3%3C%0A%C3%B8%C3%9D%C2%801%06%0DD%05%03h%C2%AD%C2%873*%C3%B5!%C2%A5%C3%948%C2%BC%C2%AE%C3%ABh%26v%C2%89%C3%BC%10%C3%B0t%C3%AA%C3%B2%5B%09%C2%9A%C2%A6%C3%99%1E%C2%BETc%26%C2%97%18%3Co%C3%8D%C3%8F%0B%C2%9Fl%C2%B8%C2%A5%5D%C2%BD%C2%B6%C3%BB%C2%8F%1B%C3%B9%C3%9C%C2%AA%C3%BDu%C3%9E%C2%8F%1B%C3%B9R%C2%AD%C3%9D%C2%84%C3%A7%1D%C2%B5%0B%C2%BE%C2%8B%C2%AE%0D%C3%B7%C2%A1-%1E%C2%91c%C3%99Q%22%12%C2%8A%C2%A2%C3%B8%3BlN%7D%C3%9F%0Fiw%C3%8EE%05%3Fy%1A%C3%A8%C2%AC%C2%B5Q%0C%C2%84%10%C2%9E%7F5%C2%80.%05*%C3%AF%7Dk%C2%8C)7%C2%A7%C2%BF%C3%94%01%C3%95%1D%C2%A7mUe%C3%BA%C3%AB%C3%B6%C3%BB%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A4IDATH%C2%89%C3%AD%C2%97%C3%91%09%C3%83%20%10%C2%86%3FMB%20O%1D)%2Bd%C2%97%C2%8C%C2%91%5D%C2%B2B%06%C2%B99%04%11%C2%B5%0Fm%C3%9A%40%5B!Mc%0B%C3%A9%C3%BF%22%C2%A8%C3%B0%C3%BDw%C3%9E%C2%89*%119%01%23%C3%90%C2%92O%13%C3%90%C2%95%C3%80%C2%A8%C2%B5n%C2%AB%C2%AA%C2%A2(%C2%8A%C3%9D%C2%A9%C3%9E%7B%C2%9Csm%08aT%22%12%C3%AB%C2%BA%C3%8E%02%5E%1A%C2%B0%C3%96%C2%A2%C2%81%C2%AC%60%00%C2%AD%C3%B5e%C3%8CJ%C2%BDJ)%C2%B5%1D%C3%9E%C3%B7%C3%BD%26%13_%C2%89%C3%BC\'%C3%A0ej%C3%B1YZ%C2%87a%C3%88%03_%C2%AB%C2%B5f%C2%8F%7B%C3%A6%C3%87%C2%85\'%0Bnme%C2%AF%C3%9D%C3%BF%C2%9B%C2%91%C2%A7%C2%AE%C3%8EO%C3%B5%C3%BA%C3%87%C3%BA%C3%BC%1D%C2%B3%C3%87%C2%AD%C3%B6%3F%C3%BCx%C3%B0%C2%97%C2%AD%C2%B6%C3%B7%C3%AD%06_%C2%8E%5C%C2%89Hl%C2%9A%C3%A66%C2%B1%C3%B5Q%C2%98%C3%922%3B%C3%86%C2%98Gx.%19c.i%C3%B7%C3%9Eg%05%C3%8F%3C%0DL%C3%8E%C2%B9%2C%06b%C2%8C%C3%B3_%0D%60*%C2%81.%C2%840Zk%C3%9B%C3%9D%C3%A9wM%40w%06%60%C3%9B%5B%C3%B5%C3%B5%1A%C3%AC%C2%B9%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A5IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%A2%22%C2%B8%C3%AA%C2%91%C2%BC%C2%82w%C3%B1%18%C3%9E%25W%C3%B0%20s%0E!%C2%84%24%5D%C2%B4%C3%92B%5B%15%5B%C2%A3%60%C3%9FF%C3%88b%5Ef%C3%BC%09D%C2%89%C3%88%050%40M%3Az%C2%A0%C3%89%01%C2%A3%C2%B5%C2%AE%C2%8B%C2%A2%20%C3%8B%C2%B2%C3%8D%C2%AD%C3%9E%7B%C2%9Csu%08%C3%81(%11%C2%89eY%26%11%3Fo%C3%80Z%C2%8B%06%C2%92%C2%8A%01%C2%B4%C3%96%C2%B7oR%C3%AB%1D%C2%A5TZy%C3%9B%C2%B6%2Fk%C2%BBt~%08y%C3%BE%C2%ABB%C3%AF%C3%86%0A%C3%90u%C3%9Dw%C3%B2w%C2%85%C2%A7%C2%8A.%C3%A5%C2%BC%C3%BF%C3%BC%C2%BC%C3%B2E%C2%81%5B%12%C2%AE5%01%3C~%C3%A7S%7C%3A%C3%9F%23S%139v%C3%A7kn%C2%AE%C2%A5%C2%9C%C3%B7%C2%A8%C3%BD%C3%A5%C2%BB0%C2%9B%C3%B6%C2%B9T%7F%C2%93%C3%BA%C3%A3u%3Ewk%C3%BD%0A%25%22%C2%B1%C2%AA%C2%AA%24%C2%B2g%C2%86a%C2%B8%C2%8D%C3%9D%7B%C2%9FT%3C%C3%BA4%C3%90%3B%C3%A7%C2%92l%20%C3%868%C2%BE%C3%95%00%C3%BA%1ChB%08%C3%86Z%5Bon%7F%C3%90%03%C3%8D%15%C2%A4eS%C3%81%C2%A24I%1B%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97%C3%8B%09%C2%840%10%40_%C2%A2%22x%C3%9A%C2%92l%C3%81%5E%2C%C3%83%5El%C3%81B%C2%A6%0E!%C2%84%24%7B%10%C3%99E%C3%B0%C2%83%C2%98x%C3%90w%C3%89e%C3%88%C2%9Bd2%03Q%22%C3%B2%01z%C2%A0%26%1D%03%C3%90%C3%A4%40%C2%AF%C2%B5%C2%AE%C2%8B%C2%A2%20%C3%8B%C2%B2%C3%A8V%C3%A7%1C%C3%96%C3%9A%C3%9A%7B%C3%9F%2B%11%09eY%26%11%C3%BF\'%60%C2%8CA%03I%C3%85%00Z%C3%ABi%C3%9D%0Aj%C3%9B%C3%B6%C3%90fG%C3%A3f%C2%94R%C3%BB%C3%B2%C3%98%C3%A4%7B%01%C3%8BSu%5D%C2%97N~%C2%943I%C3%9Ez%C3%AD%C2%AF%C3%BC%16.%7Bpg%C2%BA%60W~ek-yk%C2%BE%C3%8A%C3%9A%C3%9C%C2%BE%C2%A2%1C%C3%91%26%C3%9C%C3%8CV%C2%92%C3%8F%C2%AD%C3%B9%2B%7F%C2%9E%C3%BC%C2%9D%C3%AD%C2%B7%C2%A0D%24TU%C2%95%5C%3C%C2%8E%C3%A3tr%C3%A7%5CR%C3%B1%C3%AC%C3%93%C3%80%60%C2%ADM%C2%92%40%08a%C3%BE%C2%AB%01%0C9%C3%90x%C3%AF%7BcL%1D%C3%9D%C3%BEc%00%C2%9A%2F%24%C3%ACS%C3%83Y%7DO%C3%B9%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A3IDATH%C2%89%C3%AD%C2%97%5D%0A%C2%84%20%14F%C2%8FV%04%3D%C3%8D%C2%92%C3%9AB%7Bq%19%C3%AD%C2%A5-%C2%B4%C2%90%C2%BB%C2%8E%40D%C2%9D%C2%87!%26%C2%86%C2%81q%C3%82%C3%AC%C2%A1%C2%BE%17%15%C3%94s%7F%05%C2%95%C2%88%3C%C2%80%09%C3%A8)%C2%A7%19%18j%60%C3%92Z%C3%B7M%C3%93PU%C3%95%C3%A1T%C3%AF%3D%C3%8E%C2%B9%3E%C2%840)%11%C2%89m%C3%9B%16%01o%0D%C2%B0%C3%96%C2%A2%C2%81%C2%A2%60%00%C2%AD%C3%B5kL%3D%60%C2%8C%C3%89%C2%B6O)%C3%B5%1F%C3%BC%08%C3%95%C2%BF6l%3DY%C3%A7%C3%A38%C2%96%C2%81%C2%A7j%C2%8F%C2%91%C2%A7%C2%86%C3%BD%C2%86%C2%9F%C2%A2l%05%C2%B7%16%C2%971%26%C2%B9%1B~%C3%82%C3%B7%5C%C2%9A%C2%AA%3B%C3%A7_%C3%B5%C3%B9No%C3%979R%C2%90%C2%A5%C3%A0%C3%B6%1Ay%C3%9D%C2%9C%C3%9F%C3%B0%C3%AB%C3%81%C2%B3%C2%B4%C3%9A%C2%B6%C2%9D%C2%B2%C2%BD%C3%AD%7B%2FM%C3%95%C2%A9aW%22%12%C2%BB%C2%AE%2B%0E%5E%C2%96%C3%A5%C3%A5%C2%B9%C3%B7%C2%BE(x%C3%A5i%60v%C3%8E%151%20%C3%86%C2%B8%C3%BE%C3%95%00%C3%A6%1A%18B%08%C2%93%C2%B5%C2%B6%3F%C2%9C%C3%BE%C3%96%0C%0CO%C2%B0%C3%BCe3%C3%96%C2%BC_%C3%99%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%97%C3%8B%09%C2%840%10%40_%C2%A2%22x%C3%9A%C2%92l%C3%81%5E%2C%C3%83%5El%C3%81B%C2%A6%0E!%C2%84%24%7B%10%C3%99%0F%0B%1B%7F%C3%B1%C2%A0%C3%AF%12%02I%C3%9EL%3E%03Q%22%C3%B2%00z%C2%A0%26%1D%03%C3%90%C3%A4%40%C2%AF%C2%B5%C2%AE%C2%8B%C2%A2%20%C3%8B%C2%B2%C3%83%C2%AD%C3%8E9%C2%AC%C2%B5%C2%B5%C3%B7%C2%BEW%22%12%C3%8A%C2%B2L%22~%0F%C3%80%18%C2%83%06%C2%92%C2%8A%01%C2%B4%C3%96S%C2%BBfr%C3%9B%C2%B6%C2%9B%C3%86)%C2%A5%C3%96%C3%8B%C3%B7%22%C2%8F%19%14%C2%9B%C3%A9!%C3%B2X%C2%96%06y%C3%AA%C2%B6%C3%9F%C3%B2S%C3%98%C3%B5%C3%82u%5D%C3%B7%C3%91%C3%BFw%01%C2%A3%C3%A4K%17%C2%8D%C3%A5%3E%C3%B3%C2%9F%1CU%C3%99%C2%A2%C3%A4%C2%B1%C2%AC%0D%C3%B2%C2%BAg~%C3%8B%C2%AF\'%C3%9F%C3%A5%C2%A9%7D%C2%97%C3%9F%C2%99M%C2%B5%7D%C3%AD%C2%A2%C2%B1%C2%9C%C2%BA%C3%ADJDBUU%C3%89%C3%85%C3%A38N%C2%99%3B%C3%A7%C2%92%C2%8Ag%C2%9F%06%06km%C2%92%00B%08%C3%B3_%0D%60%C3%88%C2%81%C3%86%7B%C3%9F%1Bc%C3%AA%C3%83%C3%AD%2F%06%C2%A0y%02%C3%A9*R%C2%A3%C3%BD%C3%AE%1B%5D%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%97M%0A%C2%830%10F_%C2%A2%22%C2%B8%C3%AA%C2%91%C2%BC%C2%82w%C3%B1%18%C3%9E%C3%85%2Bx%C2%909%C2%87%10B%C2%92.Z%C2%A9m%C2%B5%C3%B6%07%C2%A3%60%C3%9FF%C2%94%C3%817a%3E%07T%22r%02Z%C2%A0%24%1E%1DP%C2%A5%40%C2%AB%C2%B5.%C2%B3%2C%23I%C2%92%C3%95%C2%AD%C3%8E9%C2%AC%C2%B5%C2%A5%C3%B7%C2%BEU%22%12%C3%B2%3C%C2%8F%22%1E7%60%C2%8CA%03Q%C3%85%00Z%C3%AB%C3%8B5%C2%AA%C3%B5%C2%8ARj%3B%C3%B9%C3%80%C2%A6%C3%B2%C3%B4%C3%B1A%5D%C3%97%C2%AB%C3%89%C2%9A%C2%A6%C2%B9%C2%BBW%22%12%C2%8A%C2%A2x*%7C%C2%A7%C2%89%C3%B1%C3%8B%5E%C3%95%3FJ%01%C3%BA%C2%BE%3F%C3%B0%C3%8C%C3%B7%15%C2%B8o%C2%99%C2%9A%C3%AB%12%C2%9B%C2%9E%7C6%C3%ADks%C3%AC%C2%B4%C3%AFs%C3%83-52%C2%95%C3%AE%C2%A9%C3%BA%C2%B9%C2%AF%C3%A0%C3%983%C3%9FW%C3%A0~%C3%A1%C3%93-%C3%B7%C3%9Fp%C2%9Bpp%C2%B9s.%C2%AAt%C3%B0i%C2%A0%C2%B3%C3%96Fi%20%C2%840%C3%BC%C2%AB%01t)Py%C3%AF%5BcL%C2%B9%C2%BA%C3%BDF%07Tg%00%C3%94gq%C2%B3%C3%B5%C2%B9%C3%80%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B1IDATH%C2%89%C3%AD%C2%97Q%C2%8A%C2%830%14EO%C2%A2%22%C3%B85Kr%0B%C3%AE%C3%85e%C2%B8%17%C2%B7%C3%A0B%C3%9E%3A%02!%24%C2%99%C2%8F%C2%A9%C2%AD%C3%90%C3%9A%C2%99HM%0A%C3%93%C3%BB%23%24%C2%9As%C2%B9%C3%AF%C3%A5%C2%81JD%C2%BE%C2%80%19%C3%A8%C3%89%C2%A7%05%18j%60%C3%96Z%C3%B7M%C3%93PU%C3%95%C3%A9T%C3%AF%3D%C3%8E%C2%B9%3E%C2%840%2B%11%C2%89m%C3%9Bf%01o%0DXk%C3%91%40V0%C2%80%C3%96%C3%BA%C3%A7%C2%99%C2%95z%C2%91R%C2%AA%1C%7CUQx%C2%BD%C2%B71%C2%8E%C3%A3%C2%AF%1FO%C3%93t%0E%3CU%C3%8F%C3%8C%C3%AE%C2%99%2C%1A%C2%BB%12%C2%91%C3%98u%C3%9Du%C3%A1%2Fq%1F%C3%956%01c%C3%8C%3D%3C%C3%85%C3%84%C3%B6%C2%B0%C3%94%C3%98%C2%8D1o%C3%9A%C3%AD%C2%A9%3A%C3%92%C3%B9%C2%BB%C2%B1%C2%9F%C2%AD%C3%A2%C2%B1%C2%BFo%C3%8D%C2%8F%0C%C2%8E%C2%97%C3%81S%C3%B5%C3%88%C3%AC3%C2%93%C2%9F%09%C3%B7%C3%B0%C3%A5%C3%94%C2%9A%C2%A7%C3%84%5E%C3%BC%C2%AA%C2%BD%C2%B4%C3%A1Ro%C3%80g%C3%82%C3%BDS%C2%B8%C3%B7%3E%2Bt%C3%A5i%60q%C3%8Ee1%10c%5C%C3%BF%C3%95%00%C2%96%1A%18B%08%C2%B3%C2%B5%C2%B6%3F%C2%9D~%C3%93%02%0C%C3%9F%07%C3%8E%C2%80%C2%99%C2%A5%C3%A4%C2%A7%3E%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%10%40_%C2%A2%22%C3%B8%C3%95%C2%91%5C%C3%81%5D%1C%C3%83%5D%5C%C3%81An%C2%8E%40%08I%C3%BA%C3%91%C3%9A%16Zm%C2%B5%18%0B%C3%B6%C3%BD%04%12%C3%82%C2%BB%5C.%07Q%22r%02z%C2%A0%26%1D%03%C3%90%C3%A4%40%C2%AF%C2%B5%C2%AE%C2%8B%C2%A2%20%C3%8B%C2%B2%C3%8D%C2%AD%C3%9E%7B%C2%9Csu%08%C2%A1W%22%12%C3%8B%C2%B2L%22~%0C%C3%80Z%C2%8B%06%C2%92%C2%8A%01%C2%B4%C3%96%C2%971%C2%A9%C3%B5%C2%8ARj%3F%C3%B9%C3%88%C2%AE%C3%B2%7Cj%C2%A1m%C3%9B%C2%B7%C2%9B%C2%BB%C2%AE%C3%BBJ%C3%BE%C2%9B\'_%C3%8A%5C%C2%A6%C2%A62t%C3%9C%C2%82%C3%9BU%C2%AED%24VUu%C2%9B%C3%B8%C2%A4%C3%8A%C3%97%C3%B2x%C3%B7%C3%86%C2%98gy*%C2%8C1%07%C2%BE%C3%B3%C3%99w%C2%BE%C3%A6%C3%AD.%C3%A1wO%C2%BE%C2%94W%C2%99%C2%9A%C3%8B%C3%90q%0B%C3%AE%C3%9F%C3%A16%13Nq%C3%AC%0E%C2%B7%C2%BF%C3%9C%7B%C2%9FT%3A%C3%BA408%C3%A7%C2%92%04%10c%1C%C3%BFj%00C%0E4!%C2%84%C3%9EZ%5Bon%C2%BF3%00%C3%8D%19%C3%A4%C3%84d)A%C3%97%C3%B8%C2%9E%00%00%00%00IEND%C2%AEB%60%C2%82'
        }
    };

    var light = {
        normal: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9CIDATH%C2%89%C3%AD%C2%97%C3%8B%09%031%0CD%C3%9F%C2%8A-%20%25%C2%A5%05%C2%97%C3%A3%0A%5C%C3%8E%C2%9Eusg%C3%89!%1F%C3%82%C2%92%C2%8DM%C3%80%19%C2%832G%23x%C3%92%C3%98%1A%C3%B0%C3%A2%C3%AE\'%60%03%C3%8E%C3%BCN%15H%26%00s%C3%A7m%26%00%3F%1B0%11%18%C2%80u%7FPJ%19%02%C3%8A9%C2%B7%C3%A1G%C2%85%234%C2%97%C3%AD%C2%AFj%5D%C3%81%C3%83%C2%A1%C2%A3%C2%BA%C2%96%C2%83%C3%92%C3%89%C3%BF%C3%B0x%C3%B0%C2%8F%C2%AF%C2%BDW%C3%9F%C3%A6%C3%82%C2%BC%C2%93%C2%8FN%C2%BAy\'%C3%AFM%C2%AEwu%3D%C2%AE%C3%85%5D%C2%B5%C2%B8pi%C3%88%C3%84%C3%9Ds)%7Cq%C3%B7%C2%8B%0A%1E%C3%97v%C3%A3%C3%B6iS%C2%A8%1A%C2%90%04%0DT%20%5D%01xI%23%C3%89%C2%80%3CD%C2%91%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%AAIDATH%C2%89%C3%AD%C2%97%C3%8D%0D%C3%83%20%0CF_%C2%AC%0E%C3%90%C2%91%C2%BA%02%C3%A30%C2%81%C3%87%C3%89%C3%9976k%0F%C3%BD%C2%91%C3%9A%26%C2%A8%0EM%1C%C2%89%7C7%10%C3%B23%1F%C3%98%C2%82%C3%81%C3%8C%C3%8E%C3%80%08%5C%C3%98N%05H%12%00%C3%A6%C3%81%1B%25%00%C3%BCJ%40%C2%82%C3%80%00%C2%9C%3E\'Tu5X%C3%8E%C3%B9m%3C%C2%98%C3%99ui0U%C3%BD%0A%C3%A8%C3%91%C2%BEl%7F%C2%AAf%C3%BF%C3%94n%C2%BD%C3%AB!x%C3%A7%07%C3%BC%C2%80o%C2%AA%C3%99R%C3%B3jI%C2%B3%C2%99%C2%85%C2%B7t%C2%AE_%C2%B5_%C3%9B%C2%A7%C2%BAV%C3%8D%11%C3%AF%C3%BA~o%7B%C2%BF%C3%B0%C2%BF%C3%959%C3%B8%C3%8B%C2%B3%0A_%C2%BB%C3%96%C3%BB%3D%C3%B3%C2%A6%07d%C2%AB%C3%BA%C2%B5%5D%C2%B8%7F%C3%9A%22T%04H%01%09%14%20%C3%9D%00%18%19(%C2%85%3B%C3%BC%C2%B9%0B%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A7IDATH%C2%89%C3%AD%C2%97%C3%81%0D%021%0C%04%C3%A7%2C%0A%C2%A0%24ZH9%C2%A9%20%C3%A5%C3%9C%C3%9B%C2%BFt%06%0F%08B%C2%A7%C2%80%11Gp%24%C2%B3%C3%8F(%C3%92x%C3%97%C2%B1%C2%A5%2C%C2%AAz%04V%C3%A0%C3%84%C3%AFT%C2%81%24%0E%60n%C2%BCU%1C%C3%80%C3%B7%02%C3%84%09%0C%C3%80%C2%A1wXJ%19%02%C3%8B9%C3%9B%C3%B0%C3%AD%C2%A5o%C2%A8gh%C2%BE%C3%98%1F%C3%B5%C2%AC%05-%1D%C2%ABE%C2%AFRtu%C3%BE%C2%87%C3%87%C2%83%C2%9B%C2%AF%7D%C3%84%C3%8C7%C3%8D%C3%AD%C3%9C%C3%92%C2%9Ed%C3%A6w%C3%9E%C3%9Bb%5B%C3%87%C3%96%26%C3%AC)%C3%AE%C2%A8%C3%85%C2%85%C2%BF%C3%B5%C3%A0F-%C2%9A%C3%9Ds%C3%9E%C3%B4I%C2%81q%7B%C2%BE%C2%A8%C3%AA%C3%99%0B%1E7v%C3%A1%C3%BAi%C3%B3P%15%209%14P%C2%81t%01%C2%A6J%25%5E%40%7D%C3%93%C3%89%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%94%C2%B1%0D%C2%830%14D%1FV%06%C3%88HY%C3%81%C3%A3x%02%C2%8FC%C3%BD%3Bo%16%1A%C2%A0%09%C2%B1%11%60%C2%9F%25x%C2%AD%C2%8Bw%3A%7D%C3%9F%60fo%60%04%3E%C2%B4%23%01%C3%9E%09%C3%84%C3%8C%C2%BE%C3%91%09%C3%84k%00\'%12%03%C3%B0%23%C2%8F1%C3%AA%C3%A4-y%C3%A5%1EK-%C2%84%10%C3%AA%C3%89%C3%B7%C3%B2%2Fd)%5C_%07%C3%B7%C3%88%5Bp%C3%89%C3%81%1D%C2%BD%C3%BA%C2%AC%C3%BC%C3%ACW*%C3%91_%C3%AD5%26v%C2%AB%C3%85My%C3%AD%C2%BA%17%C3%BA%C2%AB%7D!W%C3%BF%15%C3%ADT%C3%9B%C3%B6%3D%C3%A1%C3%AE%C2%BBp%C3%B7%C2%95%3F%C3%9B.a0%C2%B3%C2%AFJ.%C2%BF%C3%B6%24r\'%07xA%C2%80%04%C3%B8%09Rk%25b%C3%93yM%0E%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%96IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%10%04%C3%87%C3%82%05%C2%A4%C2%A4%C2%B4%C2%A0rT%C3%81%C2%95%C3%A3%C3%B7%C3%BD%C3%94%C2%99%C3%B3%C2%89Bp%C2%88%20%3E%C3%B0%C2%9AX%C3%B3%C2%94%0EFZ%C2%8E%C2%9D%C3%9C%C3%BD%06%2C%C3%80%C2%9D%C3%A3%C2%A8%40N%021O%C3%9F%C2%92%04%C3%A2%C3%97%03%C2%92H%0C%40Hnf%3Ay%14%C2%A9%7C%C3%AE%5D~%C2%8B%C2%B5%C2%94%12%C2%9Am%5C7%C3%B6!%C2%97%C3%90%C3%9D%C3%B6%C3%9E%C2%A6Ff%1B%C3%92%C2%9FO%C3%AE%C2%BE%C2%BE%1FD%2B%C2%B3%C3%876%C2%9D%0F%C3%B9%2F%C2%98%C3%99%C2%AE%C2%B8%1B%C3%A7%5D%C2%B8Q%C2%AFC%C3%BEW%C3%B2%C3%AB%C3%96%C3%AB%C2%B9%C2%BA%C3%BDH%C3%A4%C2%B1W%C2%91%C2%BB%26%20%0B%1EP%C2%81%C3%BC%00X%C3%97-%3D%C3%87m7%5B%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A2IDATH%C2%89%C3%AD%C2%94%C3%81%0D%C3%83%20%10%04%C3%87(%05%C2%A4%C2%A4%C2%B4%409T%409~%C3%9F%C2%8F%C3%8E%C2%92%C2%8F%15%C3%B1%C2%B0%C2%8D%05%C3%86%1B%C3%85l%017%C3%8B%C3%9D%C2%B2%C2%93%C2%99%3D%C2%81%19xq%C2%9D%12%C3%A0%C2%9D%00%C3%8C%C3%82%C2%9B%C2%9D%00%C3%BC5%C3%A0D%60%00.%C2%83%C3%87%18u%C3%B05%3DZ%07%C2%AC%C2%BD(W%08%C2%A1%1E%C2%BE5%7Co%C3%A8Q%C3%9D%23p%03%C2%9E%C2%AB%18%C2%B83%C2%82U%0D%2F%C2%A9%C3%85%C3%9C%C3%AF%C2%AD%C2%BDT%1C%5D%C3%A1%3D%C3%AE%C3%BC%7F%C3%9D%0E%C3%BBgj%C3%AA%C3%B6%C2%AD%C3%A1%C2%A3%C3%9B%07%C2%BCF%C2%87%02%C3%97%C2%AB%C3%9FO%C3%B9j%C2%B5%C3%A6%C2%A4k%C2%9F%C3%8C%C3%AC%C2%AD%C2%82%C3%8B%C3%93%C2%9ED%C3%AC%C3%A4%00%2F0%C2%90%00%C3%BF%01%14%C3%96%25%C2%8CS%C2%B6d%24%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%99IDATH%C2%89%C3%AD%C2%96%C2%BB%0D%C3%830%0CD%C2%9F%04%0F%C3%A0%C2%91%C2%B2%C2%82%C3%86%C3%91%04%1AG5%3Bm%C2%964A%C2%80%00%C3%BE%10N%C3%AC%13%20_%C2%AB%C3%A2%1D%C3%85%23%C3%81%60f3P%C2%81%07%C3%97%C2%A9%01)%0A%C3%80%C2%BCy5%0A%C3%80%1F%03Q%04%06%C2%A0%2Fx)E%07%C2%BFRR%C3%B8%C2%B4%C3%B5%C2%B8%C3%96%C2%82%C2%9C%C3%B3%C3%B9p%C2%AF%C2%96Lz%0C%C2%8E%C3%9B%C3%B3q%C3%A1%C2%9B%C2%81%C3%B3%C2%A6%C3%BAh%C3%BA%C3%BB%C2%AD%7Co%C3%95%C3%BE%3A%C3%AF%C3%BDV%C3%AE%C3%95%C3%91M8%C3%AE%C2%A8%C3%9Dp%C2%89%C3%AE%0D%C3%B7%C2%A53%C2%8E%C3%88%C2%A5%C3%9F%09f%C3%B6%C3%BC%3B%C3%89)y%C3%9A%C2%9B%C2%88%C3%9D%22%C2%90%04%06%1A%C2%90%5E%22%C3%95%23%C3%B1%08%C3%9C%C2%84(%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%96%C3%81%0D%C3%83%20%10%04%07%C3%A4%02%5CRZ%C2%A0%1C*%C2%A0%1C%C2%BF%C3%AFGg%C3%89%C3%87%C2%B2%C2%A2%C3%98F%C3%82v%C3%98Dx%C2%9F%C2%804%C3%8B%C2%B1w%C3%82%C2%99%C3%99%08L%C3%80%C2%83v%C3%8A%40%C3%B0%0203o%C3%B2%02%C3%B0b%C3%80%C2%8B%C3%80%00%C3%BC%2F%3C%C2%A5%C2%A4%C2%83%C2%9F%C2%95%14%3E%C2%946%C2%B7%C3%8A%1Acl%03%C2%AFU%C2%AD%C3%99~%C3%9F%C2%BC_x1p%C2%B5%C3%89%C2%AE%3D%C3%BF%C2%9B7%2F%C2%8D%C3%8E%C2%ABz%C3%BD%C2%B2%3E%3Fb%C2%B6%C3%9F%C2%B4%C3%9F%C3%B0%C3%BE%C3%A0%C2%BB%C2%AD%C3%B6%C3%AD%C3%A9%06%C3%A2%C2%9B%3B3%7B%C2%BE%2F%C2%9C%C3%BD%14%C2%96%C3%B4Y%C2%9D%15%C2%BC%C2%A5%C3%A4i%C3%8F%22v%C3%B6%40%10%18%C3%88%40x%01%C3%A2%C2%8C\'%18%C3%8A%C3%A2%C3%87%C2%84%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%94%C3%81%11%C2%84%20%0CE%C2%9F%C3%8C%16%60I%C3%9B%02%C3%A5P%01%C3%A5x%C3%8E%C2%8D%C3%8E%C3%9C%C2%8Bzb%C2%81Q%C3%87%C3%8F%0C%C2%BE%02%C3%B2%12%C3%B8%C3%89df3%C2%B0%00_%C2%9E%23%01%C3%9E%09%C3%84l%C2%BE%C3%85%09%C3%84G%03N%24%06%60%0Cy%C2%8CQ\'%C3%8F!%C2%95%7F%C3%AE*%C2%94%7BV%C2%80%10%C3%825y%C2%AEp%C2%A9h%2B%C3%A3%C3%BE%C3%B9%C2%B8%C3%B2%C2%A6%C3%80%C2%B5%C2%84%C3%ABL%00%C3%BB%C2%9F%C2%BC%C3%84%C2%BF%C3%BD%C3%9E)%C2%BDH%C3%9F%C2%93%C2%9F%C2%B9%5C%C2%AD%C2%8C%C2%BBj%C2%AF%5CB5%C3%AD%C2%B5T_I%7D%7F%C2%93%C3%97%C2%AE%C3%96%5DLf%C2%B6%3Eb%C3%8A%20O%7B%12%C2%B9%C2%93%03%C2%BC%C2%A0%C2%81%04%C3%B8%1F%C2%82p%22%C2%86h%23%2C%02%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%94IDATH%C2%89%C3%AD%C2%94%C3%8B%0D%C2%80%20%10%05Gb%01%C2%96d%0B%C2%94C%05%C2%94%C3%A3yot%C2%A6%17%C3%B5%40%02%C2%A2%01%C3%97D%C3%A6%C2%BCa%1E%C3%99%C3%8F%20%22%13%C2%B0%003%C3%AF%11%00k%14%C3%84%C3%AC%C2%BE%C3%85(%C2%88%C3%8F%00FI%0C%40V%C3%AE%C2%BD%2Fz%C2%A4%C2%B4%C3%AE%C2%96%C2%BC5%C3%A3UA%C3%BC%2B%C3%A7%C3%9C%7B%C3%B2R%C2%9E%C2%84%C3%BC%C3%AE%C3%80uy%2B%C2%AA%0D%C3%9C%C2%93-%C2%B8%C2%94%C3%97%5C%C2%AD%C2%98%C3%9E%C3%B3%24%C2%A9%C2%BB%5D%C2%A3%1D%C3%8D.%C3%9CA.%C3%A4%7F%7B%C3%9E%C3%A5%C3%BF%C2%93%C3%B7%C3%9B%C2%AE%C3%82%20%22%C2%AB%C2%96%5C%7D%C3%9A%C2%83%C2%92%3B%18%C3%80*%04%08%C2%80%C3%9D%00N%3A%22%C2%88%C3%AA%1Abk%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A5IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%0CE_L%07%C3%A8HY%C3%81%C3%A3x%02%C2%8D%C2%93%C2%B3n%C3%9E%C2%AC%C2%BD4%C3%81%C2%84BT%C2%A3F%C2%84%C3%B8%C2%9Fl%10z%C2%B2%C3%B5%C2%A5IU%C2%9F%C3%80%02%C3%8C%C2%9C%C2%A7%0A%C3%A4%14%00%C3%A6%C3%83%5BR%00x%2B%20%05%C2%81%010%C3%83E%C3%845%C3%AE\'%C3%B8%3F%C3%B48%0Ah_%C2%B2%C2%9EK)%C3%A7%C3%80%C2%AD%C3%AA)%C3%B2%1A%C2%86%1BpO%C2%B9%19n5%C2%97%C2%88%C2%98%C2%A7%C3%A1%10%C3%9E%C2%93%C3%94%C2%AA%C3%91%C3%B3%C2%AF%C3%9A%C3%AF%C3%A9%C3%B6%C3%AE%C3%91%02%17%C3%83%C3%B5%16y%C3%9F%C2%9E%0F%C3%B8%C3%BD%C3%A0.%C2%A3%C3%96%C2%8E%C2%93%C3%9Bn%C3%AFMjU%C3%A8%C2%B7O%C2%AA%C3%BA%C2%8A%C2%82%C2%87%C2%BB%C2%BD%06%C2%B1k%02r%40%01%15%C3%88o%1A%C3%AF4%C3%9C%04%11%0D%C2%83%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9FIDATH%C2%89%C3%AD%C2%94%C3%81%0D%C3%83%20%10%04%C3%87%C3%88%05%C2%A4%24%C2%B7%409T%409~%C3%9F%C2%8F%C3%8E%C2%9COl)%C2%91%C2%A5%C2%9C1%C3%8E*2%C3%BBCB7%7B%C3%9Cr%C2%83%C2%99%3D%C2%80%19%C2%98%C3%B8%C2%9D%0A%10%C2%83%00%C3%8C%C2%8B7%07%01x3%10D%60%00%C2%AA%C3%A09%C3%A7%26%C3%B7%C2%A4%C2%9D%C2%8F%C2%9EK%C3%9EN%2F%C2%81%7Bu%C3%94%C3%A4%C3%BF%05%C2%AE%C3%83%C3%8F%C2%AAi%C3%A0RJo%C3%A7o%01t%C3%81%C2%8F%16%C3%B5%C2%AA%C3%8F%7CWWm6%17%C3%9C%C2%ABZ%C2%93%C3%B7%C2%9Dy%C2%87%C3%9F%0F%C3%9E%C3%A4%C2%AB%7D%C2%AE%C3%9FU%C2%A7v%7BmQ%C2%AF%C2%A4%C3%8F%3E%C2%98%C3%99%C2%A2%C2%82%C3%8B%C3%93%5ED%C3%AC%12%C2%80(0P%C2%80%C3%B8%04oJ%230%0C%00%C2%81%C2%A7%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%99IDATH%C2%89%C3%AD%C2%94%C3%81%0D%C2%84%20%10E%C2%9Fd%0B%C3%98%C2%92l%C2%81r%C2%A8%C2%80r8%C3%8F%C2%8D%C3%8E%C3%9C%C3%8Bj%C2%94%20%C2%BBjtH%C3%A0%C3%9D%20%13%C3%9F%C2%90%C3%B9%C3%8E%20%22o%20%00%23%C3%8F%11%01k%14%C3%84%7C%7D%C3%81(%C2%88%C2%97%06%C2%8C%C2%92%18%C2%80.W%C3%A1%C2%95%5Ex%C3%AFo%C2%939%C3%A76%C3%A7AD%C2%A6%5C%C3%A1%3FM%C2%AC%3FV%C2%AAO%C2%A53%C3%AD%C3%8E%C2%BC%C2%AE%C3%80%C2%9Deo%C2%AE%25T_%C2%BE%C2%9B%C3%B6\'%C3%A8%C2%81%5B%C2%A8b%C3%83%C3%BDj%24%C2%97%C3%AE%5C%7D%C3%A9%2Fhw%C3%A6u%05%C3%AE%0AG%C2%B7%5C%C3%9Fp%5D%C3%9E%C2%96%3C*%C2%B9%C2%A3%01%C2%ACB%03%11%C2%B0%1F%C3%86%C3%81%2B%C3%BB%C2%9C%7C%C3%8A%C2%96%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A1IDATH%C2%89%C3%AD%C2%94%C3%81%0D%C3%83%20%10%04%C3%87%C3%88%05%C2%A4%C2%A4%C2%B4%409T%409~%C3%9F%C2%8F%C3%8E%C2%92O%14Y189D8Y%C2%BA%7D%C2%82%60V%C3%8Br%C2%8B%C2%88%C3%9C%C2%80%0D%C2%B83O%05%C2%88%C3%81%00%C3%8C%C2%8B%C2%B7%05%03%C3%B0%C3%9B%400%02%03%C3%A0p%13%C2%AD%C2%AD%C2%8D%C2%9C%C3%B3%C3%97%C3%83)%C2%A5%C3%BF%C3%80%C2%B5%3A3%C3%9B2i%1A%C3%BB%22%22%C2%8F%C3%BD%C3%82%2Fq%C3%B7%C3%AA3%C2%81%03%5Ccb%7F%C3%99%C3%A5b%1FV%C2%B8%C2%9E%C3%A67c%C2%9F!%C2%9FpU%C3%B54x%18%5C%C2%AB%C2%9A%C3%993%C2%93%3E%C3%A1%C2%AA%C3%92%C2%BE%C3%B9%C2%A5b%1FZ8%C3%AD%0F%C3%B0%09%C3%A7%C3%B0%C3%A9%C3%B0b%C3%84.%01%C2%88%06%06%0A%10%C2%9F%C2%93o%3EQ%7Fx%C2%8CH%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%91IDATH%C2%89%C3%AD%C2%94%C3%89%0D%C2%80%20%10%00Gb%01%C2%96d%0B%C2%94C%05%C2%94%C3%83%7B%7Ft%C2%A6%1Fc%C2%8C%07%C2%8A%26%C2%AE%C3%89%3AO%08%C2%99%3DiD%C2%A4%03%12%C3%90%C3%B3%1E%19%C3%B0NA%C3%8C%C3%A4KNA%3C%07%C3%A0%C2%94%C3%84%00%C3%BCr%15%C3%9A%C2%A3%C2%8B%18%C3%A3%C3%A9%C3%A3%10%C3%82%23%C3%B973%C2%AF%C2%A5T%C2%A9%C2%A3%0A%C3%99%1D8Uy%23%22%C3%83%C3%B2%C3%A0%C3%8A%C2%94%C3%9Fe%C3%9D%C3%BB%C2%8D%C3%BCM%C3%AC%C3%B6%C2%BC%C2%B8%C3%A7wv%C2%B7%C2%86%C3%AFf%5E%C3%8B%5E%C2%A5J%15%C2%B2%3Bp%C3%BF%0F%C2%A7%C2%82%C3%9D%C2%9E%C3%9B%C2%96g%25wv%C2%80W%08%20%03~%04%3C%12)%25%C2%9C%02%C3%B5%09%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        rollover: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10%00%C2%A7A%C2%91%5CB%C2%9F%C2%94%2F%C3%B8%1F%C2%8F%3E%C3%86%5B%C2%BE%C2%90%0Fy%C3%89%C3%85C%40z(iAb%2B%C2%85%C2%ACB%3A\'I%16%26%C2%BB%C2%BA%C2%8B%C2%B9M%C3%93t%07%1C%60%C2%91%C3%83%03%7D%03%C2%B8%C2%B6m%C2%AD1%06%C2%ADuq%C3%AB%C2%B2%2C%C2%84%10l%C2%8C%C3%91)%40L%0C%C2%A0%C2%B5%C3%86%18%03%60UZ%C2%90%C2%A4%C3%AB%3A%00%C2%9A%C3%AD%C3%860%0CE%C2%84%C3%A38%C2%BE%C2%9E%C2%95Ry%C3%B96%C2%B0%24J%C3%84%C2%B2C6%C3%B3%C3%84%C2%B7W%C2%90*%C2%B4%17%C3%B7%C2%AD%C2%82%C2%A7f%C3%BE%C2%97%C3%97\'%C3%BF%C3%B8%C2%B5%1F%C3%A5%C3%97%C2%B9p%C3%9D%C3%8CKO%C2%BA%C3%ABf~tr%C3%A5%C3%A2%C2%8ET%C2%AD%C3%9EV%C2%ABW~%C3%AA%C2%90%C2%A9%C2%B7%C3%8F%C2%AF%25%C2%97%C3%BAy%C3%8C%C3%8A%25Q%C3%B0%C2%BC%C3%82H%C2%92%7C%0A%C3%B0!%04%C2%91%03%C2%AC%C3%AB%C2%9A%C3%AEj%00%C2%BE%01%C3%BA%18%C2%A3%C2%9B%C3%A7%C3%99%16%C2%B7%C2%BF%C3%B1%40%C3%BF%003qF%C2%83%C2%B4g%01%2C%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%971%0A%C2%840%10%00%C3%A7%C2%82%22i%C3%82%3D)_%C3%B0%3F)%7D%C2%8C%C2%9D_%C3%B0C6iR%04%C3%A4%C2%AAp%C3%A0%C2%A9%185%C3%B1%40%C2%A74%2B%C2%93%C3%9Du%17%7C%C2%B5m%C3%BB%06%3A%40%C2%93%C2%8F%1E%C2%A8%0B%C2%A0%2B%C3%8BR%2B%C2%A5%C2%90R%26%C2%B7%3A%C3%A7%C2%B0%C3%96j%C3%AF%7D\'%C2%80lb%00)%25J)%00-%C3%82%C2%83%C2%9CTU%05%401%3D0%C3%86%24%C2%936M%03%C2%80%10b%5E%1E%02%C2%B6%60%C2%8C%C2%89%C2%8A%C2%9F%22v%C2%BFy%02%3F%C2%99%07%C3%96%C3%8A%3F%C2%97ml%3C%5C%C2%9C%C3%B9%23%7F%C3%A4YY%1C%C2%B5X%C3%B6%2C%C2%9BE%C3%B9%C2%91%C3%8D%C2%B5%C2%95%C3%BF-%C3%BB%C3%9C%C3%96Z%C2%ABHl%C3%BC%7D%C2%BF%C3%B6%C3%BB%C3%8AO%C2%9Bs%C2%88%1F%C3%8FUy%C3%AAY%C2%BFo%C3%8F%0F%C3%89%C2%8F%C2%B6%C3%A5%C3%BA%C3%8C%C2%9DsY%C2%A5%C3%81\'%C2%80%C3%9EZ%C2%9B%C3%A5%02%C3%A38%C2%86%7F5%C2%80%C2%BE%00j%C3%AF%7D7%0C%C2%83Nn%C3%BF%C3%92%03%C3%B5%07f%C3%87I%C2%83%C2%A6dm%C3%B8%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%83%22%C3%99%C2%84%1E)W%C3%B0%3E.%3D%C2%8C%C2%BB%5C%C3%81%0B%C2%B9%C3%89%26%C2%8B%C2%80t%15ZJ%C3%9A%C2%B4%C3%95D!%7DK%15%5E%C3%BELf%C3%80%C3%8B4MW%C3%80%00%C2%9Ar%C3%8C%40%C3%9F%00%C2%A6m%5B%C2%AD%C2%94BJ%C2%99%C3%9D%C3%AA%C2%9C%C3%83Z%C2%AB%C2%BD%C3%B7F%00%C3%85%C3%84%00RJ%C2%94R%00Z%C2%84%07%25%C3%A9%C2%BA%0E%C2%80%26%C3%B6r%18%C2%86%2C%C3%92q%1C%01%10B%C2%BC%C2%96%C2%87%C2%8F%C3%B6%24%16H%C3%ACn%C3%B9%C2%82h%C3%B2G%5E%C2%B5%20T\'%C3%95%C2%A2wU%3C4%C3%B9_%5E%C2%9F%3Cy%C3%9Bs%C3%8C%7C%C3%A0%C3%9C%C3%89Sl%C2%A9%C3%8C%C3%B9%C2%93%C3%87%C2%B6%C3%98s%C3%A2%C3%94%26%C2%8CQ%C3%AF%C2%A8%C3%95%2B%C3%BF%C3%A8%C3%82%C3%A5Z4%C2%9B%C3%A7%3C%C3%B0%C3%8B%01%C3%AB%C3%ADy1y%C2%AC-%C3%87\'w%C3%8E%15%C2%95%06%C2%9F%00fkm%C2%91%03%C2%AC%C3%AB%1A%C3%BE%C3%95%00%C3%A6%06%C3%A8%C2%BD%C3%B7fY%16%C2%9D%C3%9D~g%06%C3%BA%1BB%60G%C3%B7%10%C3%90%C2%BF%C2%B9%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%971%0E%C2%83%20%18F_%C2%89%C3%86%C2%B0%C2%90%1E%C2%89%2Bx%1FG%0F%C3%A3%C3%86%15%C2%B8%C2%90%0B%0B%03%C2%89%C3%A9D%C3%9B%C2%B4V%C2%8D%154%C3%917%C3%82%C3%B0%C3%BE%7C%C3%B9%C3%B9%12n%5D%C3%97%C3%9D%01%03h%C3%B2a%C2%81%C2%BA%00LY%C2%96Z)%C2%85%C2%942%C2%B9%C3%95%7B%C2%8FsN%C2%87%10%C2%8C%00%C2%B2%C2%89%01%C2%A4%C2%94(%C2%A5%00%C2%B4%C2%88%079%C2%A9%C2%AA%0A%00%C3%B1y%C3%914Mr%C2%B9%10b%5C%C2%9E%C2%93b%C3%AAr.%C2%85%C2%B6m%C3%93%C3%89%C2%97%C3%B2k%C3%88%C2%B9%C3%A1v%C2%8D%C3%BD%C2%92%C3%AF%C3%82%26%0B%C2%B7v%C3%AB\'%C3%A5%C3%BF%3E%C2%A59%C2%8E%17%7B%C2%8A%C2%8A%1DKqT%C2%9E%3A%C3%AE%C3%88%C3%B1b%C2%8FL%C3%85%C2%BFE%3A%C3%89%C2%BA%7D%C3%89p%C3%A7m%C2%B8%C3%B3%C3%8A%C2%AFn%C3%9F%C2%85%2Fy%C2%AEj%7D%C3%8A%C2%BD%C3%B7%C3%99%C2%84%C3%AF%3E%01X%C3%A7%5C%C2%96%01%C2%86a%C2%88%7F5%00%5B%00u%08%C3%81%C3%B4%7D%C2%AF%C2%93%C3%9B_X%C2%A0~%00e%05G%C3%BB%15%C3%84v4%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%91IDATH%C2%89%C3%AD%C2%971%0A%C3%83%20%18F_%25!%C2%B8H%C2%8F%C3%A4%15r%1F%C3%87%1C%26%C2%9BW%C3%B0BY%5C%1C%C2%84%C3%90%C3%89%C2%B6%C2%B44%60%24%26m%C3%B3F%C3%BD%C3%B5%C3%A9%C2%87%C3%BC%C3%A0e%1C%C3%87%2B%60%01M%3D%1C%C3%907%C2%80m%C3%9BV%2B%C2%A5%C2%90Rnn%0D!%C3%A0%C2%BD%C3%971F%2B%C2%80jb%00)%25J)%00-%C3%92%40M%C2%BA%C2%AE%03%40%C2%94lb%C2%8CY%C2%B5N%08Q.%2FeWy%C2%B34%C3%B9)%C3%96a%18%C2%8Aj%13%C3%BF%1B%C3%BB)%C3%9F%C2%85%C3%85%C3%97%C2%BE%C3%B4RKj%13%C3%87%C2%BAyn%C3%8B%C3%8C%C2%A9%7FM%C3%A7M%C2%9E%13%C2%9F1fU%C3%9C%C2%89c%C3%85%C3%BE%C3%8C%C3%99%5EO%C3%B9O%C3%89%C3%BF%C2%B7%C2%BD~%C2%AF%C2%BC%C2%A4%C2%B5%C3%9E%C3%A5!%C2%84%C2%A2MrI%3E%018%C3%AF%7D%C2%95%03%C3%8C%C3%B3%C2%9C%C3%BEj%00%C2%AE%01%C3%BA%18%C2%A3%C2%9D%C2%A6Ion%7F%C3%A0%C2%80%C3%BE%06%C3%87BLg%C2%94G%C3%8A2%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10%00%2F%16%08%C2%B9%C2%B12%C2%92W%60%1FJ%C2%86%C2%A1%C3%B3%0A%5E%C2%88%C3%86%0D%C2%85%25%C2%94%22%22Ia%021%C3%98%20%C2%85%C2%AB%10%C3%85%C3%9F%C3%BB%C3%BF%C3%BD%C2%92o%5D%C3%97%C3%9D%01%03h%C3%B2a%C2%81%C2%BA%00LY%C2%96Z)%C2%85%C2%942%C2%B9u%18%06%C2%9Cs%C3%9A%7Bo%04%C2%90M%0C%20%C2%A5D)%05%C2%A0%C3%85%C3%B4%23\'UU%01%20r%09%C2%9B%C2%A6y%7D%0B!%C3%B2%C3%8AC%14%5B%03%7C%C2%9E(D%C3%9B%C2%B6%C3%B1%C3%B2%C2%B9%C3%A0%C3%9F%C2%82%C2%AE%C3%A5%C3%90%C2%B2_%C3%B2CX%1C%C2%B8%3D%06%2BZ%C2%BE%C3%84%C2%96%C3%A4%C3%8EW%C3%B6%C2%A5%C3%85%C2%91T%C2%9E%C2%A2%C3%8F%C2%A1%03%C2%9D%C2%AF%C3%AC%C2%BF%C3%B2%C2%ADM%C2%9Bv%C3%BB%5C%C3%B0k%C2%B7_%C3%B2%18V%0D%5C%C2%AA%C3%BD%C2%BE%C3%8BU%C2%8BM%C3%AE%3Fz%1E%C2%AA%C2%8E%C2%80%C3%A7%13%26\'%C2%93O%00%C3%969%C2%97%25%C2%81q%1C%C2%A7%C2%B7%1A%C2%80-%C2%80%C3%9A%7Bo%C3%BA%C2%BE%C3%97%C3%89%C3%ADo%2CP%3F%00%C3%91DG%C3%A3%C3%B4%C3%90%C2%A8P%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%10%40_N%20%C3%A4%C3%86%C3%8AH%5E%C2%81%7D(%19%C2%86%C2%8E%15%C2%BC%10%C2%8D%1B%0AK(E%C2%82%C2%A2(%24%C2%B1H%7CA%C2%82W%C3%9A%C3%85%3B%C3%BB%3E%C2%B2O%5D%C3%97%C2%9D%C2%81%1Ep%C3%A8%C3%A1%C2%81%C2%BA%00%C3%BA%C2%B2%2C%C2%9D%C2%B5%16cLv%C3%AB8%C2%8E%C2%84%10%5C%C2%8C%C2%B1%17%40M%0C%60%C2%8C%C3%81Z%0B%C3%A0d%5E%C3%90%C2%A4%C2%AA*%00D%C3%95zCD%C2%96%C3%A5M%C3%93%C3%A8%05%C2%A1f%C3%9A%C2%9A%C2%BCx%C2%B7%C3%B9*%05m%C3%9B%C3%A6%C2%97%C2%A7%C2%B2%14dJ%C2%80%C3%BB%C3%8D%C3%B9~%C3%A5o%0B.%C2%B5%C2%AA%C3%97V%C3%BFvO%C3%BEi%C3%94~%C3%9B%C3%AF%C3%9B%3Dy*k\'%C3%A1~%5B%C3%AD%C2%90%C3%BF%C2%85c%C3%82%3D%C2%90%C3%A3%11%C2%B9t%3BO%C3%B2_%3D%C2%91R%10%C2%B8~a4%C2%99%7D%02%C3%B8%10%C2%82J%00%C3%934%C3%8D%7F5%00_%00u%C2%8C%C2%B1%1F%C2%86%C3%81e%C2%B7%C3%9F%C3%B1%40%7D%01%3A%C3%92Fk%C3%A8%C3%BD%C3%9D%C2%8F%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9BIDATH%C2%89%C3%AD%C2%97K%0A%C3%83%20%10%C2%86%C2%BF%0E%09%C3%81%C2%8D%C3%B4H%5E!%C3%B7%C3%892%C2%87%C3%89%C3%8E%2Bx%C2%A1l%C3%9Cd!%C2%84.%C3%9AP%C3%A8%23%C3%85%C2%9A%C3%98%C2%80%C3%BD%C2%97%3E%C3%B8~uFfN%C3%830%C2%9C%01%0B%18%C3%B2%C3%89%01m%05%C3%98%C2%BA%C2%AE%C2%8D%C3%96%1A%C2%A5%C3%94%C3%AE%C3%94i%C2%9A%C3%B0%C3%9E%C2%9B%10%C2%82%15%20%1B%18%40)%C2%85%C3%96%1A%C3%80%C3%882%C2%90SM%C3%93%00%20Y%C2%A97%C2%89H%3A%C2%BC%C3%AB%C2%BA4%13I%C2%BB%13%C3%B5Sx%C2%B56%C3%B9%C3%AAZ%C3%BB%C2%BE%C3%8F%03%C2%8FU%C2%AC%C3%99r%C3%9F%C2%BC%5C%C3%B8j%C3%80%C3%85Fv%C3%AC%C3%BAc%C2%9E%7C%C3%AD%C3%AB%C3%9C*%C3%977%C3%8B%C3%B3o%C3%8C%C2%96%1B%C3%AD%7Fxy%C3%B0%C2%B7%C2%A9%C2%B6%C3%B7%C3%AF%06G%3BylQ%18%C2%B3%C3%BE%C3%B1v%C2%9E%C3%A0%5B%C2%96I%C2%9F%24pmarj%C3%A1%09%C3%A0%C2%BC%C3%B7Y%0C%C3%8C%C3%B3%C2%BC%C3%B4j%00%C2%AE%02%C3%9A%10%C2%82%1D%C3%87%C3%91%C3%ACN%C2%BF%C3%8B%01%C3%AD%05%C2%80%C3%94G%C3%9F%C3%A2%C3%88m%C2%83%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%3F%0E%C2%83%20%14%C2%87%C2%BF%12%C2%8Da!%3D%12W%C3%B0%3E%C2%8E%1E%C3%86%C2%8D%2Bp!%17%16%07%12%C3%93%C2%A1%25%1Dj%C2%95%C3%B8%C3%A7%C3%95%C3%84~%23%C3%83%C3%BBx%C3%B0%C3%A3%25%C3%9C%C2%BA%C2%AE%C2%BB%03%0E%C2%B0%C3%88%C3%A1%C2%81%C2%BA%00%5CY%C2%96%C3%96%18%C2%83%C3%96%C3%BAp%C3%AB0%0C%C2%84%10l%C2%8C%C3%91)%40L%0C%C2%A0%C2%B5%C3%86%18%03%60UZ%C2%90%C2%A4%C2%AA*%00%C2%94%C2%A8%C3%B5%C2%85RJV%C3%9E4%C3%8D%C3%A7%26%C2%A4%C3%A4S%C3%BCT%5E%C3%ACUh%C3%AAX%01%C3%9A%C2%B6%C3%9D%26%C2%9F*%3CW4%C2%97%C3%AB%C3%9E%C3%B9u%C3%A5Y%C2%81%C3%8B%09%C3%97%C2%9A%00%C2%9E%C2%BF%C3%B39%C2%BE%C2%BD%C3%AF%C3%84%C3%9C%C2%89%C2%9C%C2%BB%C3%B35%C2%93%2B%C2%97%C3%AB%3E%C2%B5%C2%BF%C3%BC\'%2C%C2%A6%7D)%C3%95%5BR%7F%C2%BE%C3%8E%C2%97%C2%A6%C3%96%C2%A1%C3%B2%3D%06H%0E%0A%C2%9E_%18I%C2%92O%01%3E%C2%84%20%C2%B2%C2%81q%1C%C3%93_%0D%C3%80%17%40%1Dct%7D%C3%9F%C3%9B%C3%83%C3%ADo%3CP%3F%00%5B%22D%C3%9F%C3%B3Y%C2%98%C3%A9%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%971%0A%C2%840%10%00%C3%87%C2%A0H%C2%9Ap%0F%C3%B01%C3%B9%C2%82%C3%BF%C2%B1%C3%B41%C3%A9%C3%B2%05%1Fck%C2%93%26E%C3%80%C2%BB%C3%A2%08%07%C2%82%C2%A7%C2%88%C3%86%C3%82L%19%C2%96%C3%8C%26%C2%9B%5DHa%C2%8Cy%01%16%C3%90%C2%A4c%00%C3%9A%12%C2%B0UUi%C2%A5%14R%C3%8A%C3%8B%C2%AD%C3%9E%7B%C2%9Cs%3A%C2%84%60%05%C2%90L%0C%20%C2%A5D)%05%C2%A0E%5CHI%5D%C3%97%00%C2%88%7FA%5D%C3%97%C3%AD%C3%9Alo%5CD%08%C2%B1-%C2%BF%C2%9Ar%2B%60y%C2%AA%C2%BE%C3%AF%C3%93%C3%89%C3%B7r%24%C3%89%5B%C2%AF%3D%C3%8Bo%C3%A1%C2%B4%07w%C2%A4%0B6%C3%A5g%C2%B6%C3%96%C2%92%5C%C3%B3U%C3%96%C3%A6%C3%B6%19%C3%A5%C2%B8l%C3%82E%C3%BE%25%C3%B9%C3%9C%C2%9Ag%C3%B9%C3%B3%C3%A4y%C2%B6%C3%9FBa%C2%8Cy7M%C2%93%5C%3C%C2%8E%C3%A3%C3%B7%C3%A4%C3%9E%C3%BB%C2%A4%C3%A2%C3%A8%13%C3%80%C3%A0%C2%9CK%C2%92%C3%80%3C%C3%8F%C3%B1%C2%AF%060%C2%94%40%1BB%C2%B0%C3%934%C3%A9%C3%8B%C3%AD%3F%06%C2%A0%C3%BD%00%40%C2%A5II%5E%C3%BCQ%3E%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A7IDATH%C2%89%C3%AD%C2%971%0E%C2%83%20%14%40_%C2%89%C3%86%C2%B0%C2%90%1E%C3%80%C3%83p%05%C3%AF%C3%83%C3%A8a%C3%98%C2%BC%C2%82%C2%87quaa%20%C2%B1%1D%1AR%C3%934%C2%91%1A%C3%84%C2%A1%C2%BEI%0D%C3%B2%3E%C3%BC%C3%BFI%C2%B8Yk%C3%AF%C3%80%00h%C3%8A1%02%5D%05%0Cu%5Dk%C2%A5%14R%C3%8A%C3%83%C2%AD%C3%9E%7B%C2%9Cs%3A%C2%840%08%C2%A0%C2%98%18%40J%C2%89R%0A%40%C2%8B%C3%B8%C2%A1%24M%C3%93%00%20R%7F0%C3%86d%1B\'%C2%84%C3%B8M~%04%C3%95%C3%96%C2%80%C3%B5J%C3%A2s%C3%9F%C3%B7e%C3%A4%C2%A9%C3%AC%09%C3%B2%C3%94m%C2%BF%C3%A4%C2%A7%C2%90%C2%AD%C3%A0bq%19c%C2%92%C2%BBaS%C2%BEg%C3%92T%C2%AE%C2%9C%7F%C3%A5%C3%B3%C2%9C%5E%C2%BF%C3%A7HA%C2%96%C2%82%C3%9B%1B%C3%A4%C3%BF%C3%A6%C3%BC%C2%92%C3%BF%C2%9F%3CK%C2%AB%C2%AD%C3%9B)%C3%9B%C3%99%C2%BEw%C3%92TN%C3%9D%C3%B6%C2%9B%C2%B5%C3%B6%C3%91%C2%B6mq%C3%B14M%C2%AF%C2%95%7B%C3%AF%C2%8B%C2%8A%C2%A3O%00%C2%A3s%C2%AEH%00%C3%8B%C2%B2%C3%84%C2%BB%1A%C3%80X%01%5D%08a%C2%98%C3%A7Y%1Fn%7F3%02%C3%9D%13FA%5B%19E%7F%13F%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A1IDATH%C2%89%C3%AD%C2%97%3D%0E%C2%83%20%18%40%C2%9FDcXH%0F%C3%A0a%C2%B8%C2%82%C3%B7q%C3%B40l%5E%C3%81%C3%83%C2%B8%C2%BA%C2%B00%C2%90%C3%98%0E%0Di%C3%9A4)%C3%BE%C2%80C%7D%1B%04x%C3%9F%C3%87%C3%8F%C2%97P%18cn%C3%80%00h%C3%B21%02m%09%0CUUi%C2%A5%14R%C3%8A%C3%A4V%C3%A7%1C%C3%96Z%C3%AD%C2%BD%1F%04%C2%90M%0C%20%C2%A5D)%05%C2%A0E%C3%A8%C3%88I%5D%C3%97%00%C2%88-%C2%93%C2%BB%C2%AE%C3%9B5N%08%C2%B1%5D~%14e%C3%8C%C2%A0%C3%98L%C2%93%C3%88cY%1B%C3%A4%C2%A9%C3%9B~%C3%89O%C3%A1%C3%90%0B%C3%97%C3%B7%C3%BD%5B%C3%BB%C3%97%05%C2%8C%C2%92%C2%AF%5D4%C2%96%C3%AB%C3%8C%C2%BF%C2%92%C2%AA%C2%B2E%C3%89c%C3%99%1A%C3%A4%C3%BF%C2%9E%C3%B9%25%C3%BF%3F%C3%B9!O%C3%AD%C2%B3%C3%BC%06v%C3%95%C3%B6%C2%AD%C2%8B%C3%86r%C3%AA%C2%B6%17%C3%86%C2%98%7B%C3%934%C3%99%C3%85%C3%934%3D3w%C3%8Ee%15%07%C2%9F%00Fkm%C2%96%00%C2%96e%09%7F5%C2%80%C2%B1%04Z%C3%AF%C3%BD0%C3%8F%C2%B3Nn%7F1%02%C3%AD%03%C2%A5%3DH%C3%A9%C2%BA%C2%B5%5Bm%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%99IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%83%22%C3%99%C2%84%1E)W%C3%B0%3E.%3D%C2%8C%C2%BB%5C!%17r%C2%93M%16%01%C3%A9%C2%A6%C2%B1EZ%5B-%C2%89%01%C3%BB%C2%96a%C3%B0%C3%8D0%C2%9F%01%2F%C3%830%5C%01%03h%C3%B2a%C2%81%C2%B6%02L%5D%C3%97Z)%C2%85%C2%942%C2%B9%C3%95%7B%C2%8FsN%C2%87%10%C2%8C%00%C2%B2%C2%89%01%C2%A4%C2%94(%C2%A5%00%C2%B4%C2%88%0F9i%C2%9A%06%00%C2%91%C3%95zG%08q%C2%9C%7Cn%C3%A2Hy%C2%B5%7C%C3%A8%C2%BA.%C2%99%C2%AC%C3%AF%C3%BBuy%2C%C3%B8%C2%A6%C2%89%C3%A7%C2%8F%C2%AD%C3%95%2F%C2%A5%C2%91%C3%B3%C3%AE%C2%BC%C2%AC%C3%80%C3%AD%C3%A5%C3%9D%5E%C3%97(s%C3%B2%3D%C2%93l%C3%A5%1F%C2%B8%C2%99%22.%C3%9C%C2%A7F%5Ee%C3%A2U%C3%BDZv%C3%8E%C2%BB%C3%B3%C2%B2%02%C3%B7%0B%5BoC%C2%B9%C2%93%C2%A7%C2%BEr%C3%A7%0D%C3%9C%C3%B1r%C3%AF%7DVi%C3%B4%09%C3%80%3A%C3%A7%C2%B240MS%C3%BCW%03%C2%B0%15%C3%90%C2%86%10%C3%8C8%C2%8E%3A%C2%B9%C3%BD%C2%81%05%C3%9A%1B%C3%B2%7CI%C2%83C%C2%B1%C2%84\'%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B4IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%14EO%2C%10rce%00%C2%86%C3%B1%0A%C3%ACC%C3%890%C3%AEX%C2%81ahi%C3%9C%C2%B8%C2%B0D%C3%92%C2%84%24R%C2%80%60%02FQrK%7Ft%C2%AE%C3%AE%7B~%C2%92O%C3%86%C2%983P%03%C2%9Axj%C2%80%22%01%C3%AA4M%C2%B5R%0A)%C3%A5%C3%AET%C3%A7%1C%C3%96Z%C3%AD%C2%BD%C2%AF%05%10%0D%0C%20%C2%A5D)%05%C2%A0%C3%85%C2%B0%10SY%C2%96%01%20%C2%A2Ro%12B%1C%07%C2%BF%C2%9B8%12%C2%9ELm%C2%94e%C3%B9%C3%B6rUU%C3%BB%C3%80C5gv%C3%8A%C3%A4%C2%A1%C2%B1%C2%9F%C2%8C1%C2%97%3C%C3%8F%C3%AF%0BK%C3%A2%5E%C2%AB%C3%A7%04%C3%9A%C2%B6%7D%C2%8D%7D8%10Z%C3%B3%C2%AF%C2%8B%7D%C2%B3%C2%86%5B%C3%93%C3%B9%C2%93%C3%B0O%C2%9F%C3%91%12%C3%BD\'%C3%9C%C2%A8%C3%96t%C3%B0f%C3%B0P%C2%8D%C2%99%C2%9D3%C3%B9%C2%9Fp%C2%A3%07Bk%C3%BEU%C2%B1o%C3%9Ap%C2%A1%2F%60%16%C2%BE%C3%B7%C2%94%C3%BB%C3%9D%09w%3C%C3%9C9%17%15%3A%C3%B0%04%C3%90Xk%C2%A3%18%C3%A8%C3%BB~%C3%B8%C2%AB%014%09Px%C3%AF%C3%AB%C2%AE%C3%AB%C3%B4%C3%AE%C3%B4%C2%87%1A%C2%A0%C2%B8%02%7BXas%C2%81%C3%AB%C3%82%C3%A1%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A1IDATH%C2%89%C3%AD%C2%97%3D%0A%C2%830%18%40%C2%9FA%C2%91%2C%C2%A1%07%C3%B00%C2%B9%C2%82%C3%B7q%C3%B40%C3%99%C2%BC%C2%82%C2%87qu%C3%89%C2%92!%60%C2%BBT%5B%C2%A8%C3%9A%C2%AA%18%05%C3%BB%C3%86%C3%BC%C3%B0%C2%92%C3%AF\'%C2%90%C3%88%18s%03*%40%13%C2%8E%1A%C3%88c%C2%A0J%C2%92D%2B%C2%A5%C2%90R%C3%AEnu%C3%8Ea%C2%AD%C3%95%C3%9E%C3%BBJ%00%C3%81%C3%84%00RJ%C2%94R%00Z%C3%B4%03!I%C3%93%14%00%11%C3%94%C3%BAD%08q%C2%9C%7C8%C3%84%C2%91%C3%B2xj%C2%A2(%C2%8A%C2%AF%C2%9B%C3%8B%C2%B2%C3%9C%24%3F%C3%A7%C3%8D%C2%972%17%C2%A9%C2%A9%08%5D%C2%B7%C3%A0%0E%C2%95G%C3%86%C2%98%7B%C2%96e%C3%83%C3%80%2FU%C2%BE%C2%96%C3%B7%C3%9C7M%C3%B3Yp%5B%C3%9Bg%09%C3%97%C3%8D%C3%B9l%C2%9F%C2%AF%C3%A9%C3%9D%25%C2%9C%C3%B7%C3%A6K%19%C2%8B%C3%94%5C%C2%84%C2%AE%5Bp%C3%BF%17nt%C3%81%C3%9E%5C7%C3%A7%C3%87%C3%8B%C2%9DsA%C2%A5%C2%BDO%00%C2%B5%C2%B56%C3%88%01%C2%BA%C2%AE%C3%AB%C3%BFj%00u%0C%C3%A4%C3%9E%C3%BB%C2%AAm%5B%C2%BD%C2%BB%C3%BDE%0D%C3%A4%0F9%C3%8BO%3B%C3%B7L%5E%C3%B8%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        pressed: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8EIDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C3%83%20%10D%C2%9FW%7B%C3%B01%25%C3%91%C2%82%3Bq).%C2%83%1B-P%C2%96e%C2%A1M%0E%09%17%7Fb%2B%C2%92%C2%B1%252GX%C3%A9%C2%B1%03%3B%12%C2%8D%C3%B7%C3%BE%01%04%C3%80QN%11%C3%A8%14%08%22%C3%A2T%15%119%C2%9Djf%C2%A4%C2%94%C2%9C%C2%99%05%01%C2%8A%C2%81%01D%04U%05p%C2%92%17J*%C3%B3t%C2%BE1%0C%C3%83)%C3%80%C2%BE%C3%AF%17k%0B%C3%B8V%C3%A1%19*%C3%AB%C3%B7L%C2%AB%C2%9Dg%C3%AD%5DAvh%C2%ABn%C3%8F%C3%81K%3B%C3%BF%C3%83%C3%AB%C2%83%7F%7D%C3%ADG%C3%B5k.%C3%9C%C2%B7%C3%B3%C2%B3%C2%93%C3%AE%C2%BE%C2%9D%1FM%C2%AE%C2%B5%C2%BA%23%C2%AE%C3%95%3Bj%C3%B5%C3%82%2F%0D%C2%99z%C3%A7%C3%BCRx%C3%A3%C2%BD%7F%C2%B6m%5B%1C%3C%C2%8E%C3%A3%0Dl7%C2%B3%C2%A2%C3%90%C3%8C%13%20%C2%A6%C2%94%C2%8A%1D%C3%A0%C3%B3W%03%C2%88%0Atf%16%C2%A6irE%C3%A8oE%C2%A0%7B%01XYF%C3%B7%C3%86%2F%C2%A9%C2%AA%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9BIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10E%1F%C2%A7%2B(3%C2%92W%60%13F%C3%B1%18%C3%AEX%C2%81%C2%B1%10%C2%B2.)%08E%20A1%04%13%09%5E%07X~%C3%B8%C3%83%C2%9D%C3%AC%22%C2%84p%03%1A%C3%80%C2%91%C2%8F%16%C2%A8%14hD%C3%84%C2%A9*%22%C2%B2%C2%BB%C3%95%C3%8C%C2%881%3A3k%04%C3%88%26%06%10%11T%15%C3%80%C3%89x%23\'%C2%A3O%C2%A7%0F%C2%BC%C3%B7%C2%BBI%C3%AB%C2%BA~%C2%B9.B%08%C3%B7%C2%B2%2CWM%C3%A6%C2%BD%C2%9FM%C3%B8-%5D%C3%97%C2%917%C3%AF%09%C2%B3%C3%98G%C2%96%C3%A2%7F%C2%B7%C3%9A%C3%94%C3%B1%C3%80%C2%B1%2B%C2%BF%C3%A4%C2%97%3C%2B%1FK-%C2%955%C3%8D%C3%A6%C2%A3%7Cm%C3%A7J%C3%A1%7Fc%7F%C3%97%C2%B5%C2%96%12I%1D%7F%C3%9E%C2%BF%C3%BD%C2%BC%C3%B2%C2%9F%C3%959%C2%A4%C2%97%C3%A7%C2%A2%7C%C3%AFZ%3F%C3%AF7%C3%9F%C2%B4%C2%81%C3%9C%C3%82%C3%A1%1BH%C2%81%C3%A1%08%C2%93%C2%93%C3%91\'%40%1Bc%C3%8C%C3%B6%02%C3%8F%C2%B3%1A%40%C2%AB%40efM%C3%9F%C3%B7.%C2%8B%7D%C2%A0%05%C2%AA%07%C2%88%C3%ADN%C2%9B%C3%8F%C2%B0u%C2%96%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9AIDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E%C2%9F%C3%83%2C%5C%C3%B6H%C2%B9%C2%827%C3%B1(%1E%23%3B%C2%AF%C2%90c%C2%89%C2%84i%17m%C2%A0%C2%95%C2%B4)%C2%B5%C2%A6%C2%82%C3%BD%3B%13%C3%A1%C3%A5%C3%BF%C3%89%0C%C2%A4%C3%B1%C3%9E%C2%9F%C2%80%11p%C3%94S%00%3A%05F%11q%C2%AA%C2%8A%C2%88lN53b%C2%8C%C3%8E%C3%8CF%01%C2%AA%C2%81%01D%04U%05p%C2%92%16j*%C3%B14%C2%B79%0C%C3%83%26%C3%90%C2%BE%C3%AF%1F%C2%BE%C2%B3%C3%B0%C3%A5O%C3%9FP%C3%8EP%C3%9D%C2%BC%17%C3%8A%3A%C2%BF%C3%97%C2%B3%12%C2%A4tJ%25z%C2%95%C3%A2O%C2%9D%C3%BF%C3%A1%C3%87%C2%83%17o%C3%BB%16%3D%C2%9F%C2%B4o%C3%A7%25%C2%ADIf%C3%BF%C3%8EsSl%C3%A9%C2%B84%09s%3An%C2%AB%1D%17%C3%BE%C3%96%C2%85%C3%9Bj%C3%90%C2%AC%C3%AE%C3%B3%C2%A4O%0Ex%C3%9C%C2%9A7%C3%9E%C3%BBs%C3%9B%C2%B6%C3%95%C3%81%C3%934%C3%AD%20v3%C2%AB%0AM%3C%01B%C2%8C%C2%B1%C3%9A%01no5%C2%80%C2%A0%40gf%C3%A3%3C%C3%8F%C2%AE%0A%C3%BD%C2%AA%00t%17%C3%93EH%C2%A7%00~%11H%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%90IDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10E_NWPf%24%C2%AF%C3%80%26%C2%8C%C3%82%18%C3%AE%C2%BC%02c!d%5DR%24%C2%AEB%20J%C3%B0%C2%81D%5Ei%17%C3%AF%C3%BB%C3%8B%3E%C3%89%C2%97%18%C3%A3%15H%40%C3%80%C2%8F%01h%15H%22%12T%15%11%C2%A9n53r%C3%8E%C3%81%C3%8C%C2%92%00nb%00%11AU%01%C2%82%C2%94%05O%C2%8A%C3%AF%C3%85%C3%9A%C3%B7%C2%BD_%087%C3%93%0C%C2%BA%C2%B4%C2%B9%C3%96B%C3%97u%C3%B5%C3%A4%C2%9F%C3%B2.%C3%A4Z%C2%B8%5Dk%C3%BF%C3%8Bwa%C2%93%0B%C3%B7%C3%AD%C2%AD_%C2%94%C3%BF%C3%BA%C2%94%C3%968%5E%C3%AD5F%C3%AC%5C%C2%8B%C2%B3%C3%B2%C3%9Au%17%C2%8EW%7Ba%C2%A9%C3%BE-%C3%9A%C2%A96%C3%9B%3F%09w%C3%9E%09w%5E%C3%B9%7F%C2%B6%C3%AF%C3%82%25%C3%86xk%C2%9A%C3%86%5D%3C%C2%8E%C3%A3%C3%A3%C3%A4f%C3%A6*.%3E%01%C2%86%C2%9C%C2%B3%5B%C2%80%C3%A7_%0D%60P%C2%A05%C2%B34MSp%C2%B1%3F%18%C2%80%C3%B6%0E%C3%94%C2%A5H%C2%AB%26%C3%AC%C3%91V%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8AIDATH%C2%89%C3%AD%C2%97A%0A%C3%83%20%10E_%C2%86Yd%C3%99%23y%C2%85%C3%9C%24G%C3%B1%18%C3%AE%C2%BC%C2%82%C3%87%0AA%C2%A6%5D%C2%B4%C2%86Bi%C2%A0%C2%95%C2%9A%C3%90%C3%A4-u%C3%A4%C3%A90%7C%C2%B0%0B!%5C%C2%80%088%C3%9A%C2%91%C2%80A%C2%81(%22NU%11%C2%91%C2%9F%5B%C3%8D%C2%8C%C2%9C%C2%B33%C2%B3(%4031%C2%80%C2%88%C2%A0%C2%AA%00N%C3%8ABK%C2%8A%C2%AF%C3%8A%C3%AA%C2%BD%C2%AF%C2%BBD%C3%95%C3%A9J6%C2%95%C3%AB%C3%9A%C3%A6%C2%BB%C2%B6%C2%8E%C3%A3XU%5B8n%C3%9BO%C3%B9%26%C2%ACN%C3%BB%C3%9A%C2%A4%C3%96%C3%94%166%7Dy%17B%C2%B8%C3%B6%7D%C2%BF%2C%C3%94F%C3%A6%1A%C3%8F%C3%9D%C2%99%C2%A6%C3%A9U%C3%BE%09%C3%9E%C3%BB%C2%AF%C3%9A%5D%C3%A4%C3%BB%1D%C2%B83%5EO%C3%B9_%C3%89%C2%8F%1B%C2%AF%C3%BB%C3%8A%C3%B6V%2C%C3%B1jfM%C3%85%C3%85\'%40%C3%8A97%C2%BB%C3%80%C3%A3%C2%AF%06%C2%90%14%18%C3%8C%2C%C3%8E%C3%B3%C3%AC%C2%9A%C3%98%C3%AF%24%60%C2%B8%01%3D%1AV%3BT%C3%91%C3%95%03%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C2%83%40%0C%05%07%C3%8B%07%C2%8E)i%5B%C2%A0%13J%C2%A1%C2%8C%C2%BD%C3%91%02e!%C2%B4rr%20H%C2%91%C3%82O%7CL%141G%0E%1E%C2%AF%C3%97%C3%BB%24%C2%B2%18%C3%A3%03%C2%A8%C2%81%C2%80%1F%0DP(P%C2%8BHPUD%C3%A4t%C2%AB%C2%99%C2%91R%0AfV%0B%C3%A0%26%06%10%11T%15%20%C3%88%C3%B0%C3%81%C2%93%C3%81%C3%A7f%C2%AD%C2%AA%C3%AA%C2%BB%09%2F%C3%B9%18%C2%BA%C2%B7%C3%80%C3%98%C2%89%3E)%C3%8Br%C2%BB%7C%C2%AA%C3%B8%5C%C3%91%C2%B5%5C%3A%C3%B6%5B~%09%C2%8B%0Bw%C3%84bm%C2%96%2F%C2%B1%C2%A7%C2%B9%C3%9F%1B%C3%BBRp%C2%9C*%3F%C3%A3%C2%9E%C3%BF%2F%C3%9Ba%C3%BE%C2%9Ave%C3%BBT%C3%B1%3B%C3%9Bo%C3%B9%16V-%C3%9CY%C3%B9~%C3%88S%C3%9B%C3%9A%C3%9C%C2%A5c%C3%8Fb%C2%8C%C3%8F%3C%C3%8F%C3%9D%C3%85m%C3%9B%C3%B6\'73W%C3%B1%C3%A0%13%C2%A0I)%C2%B95%C3%B0%C3%BEW%03h%14(%C3%8C%C2%AC%C3%AE%C2%BA.%C2%B8%C3%98%7B%1A%C2%A0x%01%11%13I%0Ba%3D%1D%C2%A8%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8DIDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%830%0C%00%0F%C3%8B%0F%C2%9E%1D)%2B%C2%B0%09%C2%A30F~Y!c!%14%C2%B9%7DP%1EE%14%10-%01%09%C3%AE%C3%A9%3C%C3%8EN%1C%2B)%C2%BC%C3%B7%0F%20%00%C2%8E%7CD%C2%A0R%20%C2%88%C2%88SUDdw%C2%AB%C2%99%C2%91Rrf%16%04%C3%88%26%06%10%11T%15%C3%80%C3%89%10%C3%88%C3%89%C3%A0%C3%8Bk%1D\'1%0E4Ms%C2%9C%3C\'%C2%87%C3%8Aun%C3%B1%C3%9B%11%C3%94u%C2%BD%C2%BF%7C-SI%C2%AEI%C3%B0%C2%BAg~%5D%C3%B9l%C3%83%C2%AD%C3%AD%C3%AA%C2%AD%C3%9D%7F%C3%9E%C3%8A%C2%97F%C3%AD%C2%AF%C3%B7%C3%BD%C2%BC%C2%95%C2%AFe%C3%AB%24%C2%BC%C3%AEU%C2%BB%C3%A5%C2%87pO%C2%B8%0F%C3%B6xDN%C3%ADN%C3%A1%C2%BD%7F%C2%96e%C3%B9w%C3%99%12m%C3%9B%C3%B6%C3%9BnfY%C3%85%C2%83O%C2%80%C2%98R%C3%8A%C2%96%C3%80%C3%BB%C2%AF%06%10%15%C2%A8%C3%8C%2Ct%5D%C3%A7%C2%B2%C3%98%7B%22P%C2%BD%00uPGU%C3%86j%15%C3%BA%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%94IDATH%C2%89%C3%AD%C2%97%C3%8D%0D%C2%830%0CF_-%1F8v%C2%A4%C2%AC%C3%80%26%C2%8C%C3%82%18%C2%B9%C2%B1%02cE(r%7B%C2%A0TU%7F%C2%90(%60*%C2%A5%C3%9F%C3%91I%C3%B4l%C3%87%C2%B6%C2%92S%C2%8C%C3%B1%0Ct%40%C3%80O%3DP%2B%C3%90%C2%89HPUDdw%C2%AA%C2%99%C2%91s%0Ef%C3%96%09%C3%A0%06%06%10%11T%15%20%C3%88d%C3%B0%C3%94%C3%84%C3%B3%C2%A5%3E%3B%C2%B1%C3%A6p%C3%9B%C2%B6%C3%87%C3%81%C3%97%C3%AAP%C2%B8%C3%8E-%C2%BEKk%C3%934%3E%C3%B0%C2%A5Z%C3%AAl%C2%B9w%5E.%7C%C2%B6%C3%A0%C2%96V%C3%B6%C3%92%C3%BD%C2%BF%19%C3%B9%C3%9C%C3%A8%C3%9C%C2%AA%C3%977%C3%AB%C3%B3o%C2%9C-%C2%B7%C3%9A%C3%BF%C3%B0%C3%B2%C3%A0%1F%5Bm%C3%AF%C3%A9%06%07G~%C2%8A1%5E%C2%AA%C2%AA%C2%BA%1B%C3%96%3E%0A%C3%A7%C3%B4%C2%98%C2%9D%C2%94%C3%92%2B%C3%9CK)%C2%A51%C3%ADf%C3%A6%0A%C2%9Ex%02%C3%B49g7%07n%7F5%C2%80%5E%C2%81%C3%9A%C3%8C%C2%BAa%18%C2%82%0B%7DT%0F%C3%94W%C2%A5%C3%84MI%C3%BD2%C3%85X%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97%C3%81%0D%C2%830%0CE%1F%C2%96%0F%1C%3BRV%60%13Fa%C2%8C%C3%9CX%C2%81%C2%B1%10%C2%8A%C3%9C%1Eh%C2%A4%C2%AA%C2%A2%C2%80(5H%C3%B4%1Ds%C3%B0%C2%8B%C2%9D%C2%9FH)b%C2%8C7%C2%A0%05%02~t%40%C2%A5%40%2B%22AU%11%C2%91%C2%9F%5B%C3%8D%C2%8C%C2%94R0%C2%B3V%0071%C2%80%C2%88%C2%A0%C2%AA%00A%C3%B2%C2%82\'%C3%99%C3%A7k%7D%C3%9F%C2%84%C2%97%C2%A8i%C2%9A%C3%A3%C3%A4S%1C*%C3%97%C2%BD%0AM%C2%8D%15%C2%A0%C2%AE%C3%AB%C3%AF%C3%A4S%C2%85%C3%A7%C2%8A%C2%AE%C3%A5%C2%BAg~%5D%C3%B9%C2%AA%C3%80%C2%AD%09%C3%97%C2%96%00%C2%9E%C2%BF%C3%B39%3E%C3%9D%C3%AF%C3%8C%C3%9CD%C3%8E%C3%9D%C3%B9%C2%96%C2%97k-%C3%97%C2%BDj%7F%C3%B9!%2C%C2%A6%7D)%C3%95%C3%9F%C2%A4%C3%BE%7C%C2%9D%2F%C2%BDZ%7BQ%C3%84%18%C3%AFeY%C2%BA%C3%88%5E%C3%A9%C3%BB~%1C%C2%BB%C2%99%C2%B9%C2%8A%C2%B3O%C2%80.%C2%A5%C3%A4%C2%B6%C2%81%C3%A7_%0D%C2%A0S%C2%A02%C2%B3v%18%C2%86%C3%A0b%1F%C3%A9%C2%80%C3%AA%01%03%C2%B3F%05%2B%0D%C2%91%17%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%88IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C3%84%20%0C%40_%2C%17)o%24V%C3%88%26%19%25c%C3%90%C2%B1%02cE%11%C3%B2%5D%C2%91%C2%A3%C3%89)%1FE%1C)%C2%92W%22%C3%A0%C3%99%18%2C%C3%91x%C3%AF_%40%00%1C%C3%B5%C2%88%40%C2%A7%40%10%11%C2%A7%C2%AA%C2%88%C3%88%C3%9F%C2%ADfFJ%C3%89%C2%99Y%10%C2%A0%C2%9A%18%40DPU%00\'y%C2%A0%26%C3%99%C2%B7i%1D%C2%86%C3%A1%C3%90fG%C3%A7%C3%BD%04qjU!to%C3%822%C2%AB%C2%BE%C3%AF%C3%AB%C3%89%C2%8Fr%26%C3%88K%C2%8F%C3%BD%C2%91_B%C2%B1%0Bw%C3%A6%15%C3%AC%C3%8AK%3E%C2%AD%25O%C3%8DWY%C3%AB%C3%9B%25%C3%8A%C3%B1%C2%B7%0E%C2%97%C3%99%0A%C3%B2%C2%BE5%7F%C3%A4%C3%B7%C2%93%3F%C2%BD%C3%BD%12%1A%C3%AF%C3%BD%C2%BBm%C3%9B%C3%AA%C3%A2q%1C%C3%A7%C3%8C%C3%8D%C2%AC%C2%AA8%C3%BB%04%C2%88)%C2%A5j%01%7C%C3%BFj%00Q%C2%81%C3%8E%C3%8C%C3%824M%C2%AE%C2%8A%7D%26%02%C3%9D%07%C3%A5%C2%9CF%07%C2%A79%C3%836%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10%00%C3%87%C3%8D%1E%3C%C3%B6I%7C%C3%81%C2%9F%C3%B8%14%C2%9E%C3%81%C2%8D%2F%C3%B8%2Cc%C3%88%C2%B6%07Kb%C2%9A%26RC%C3%B1%C2%A0s%12C%C2%98%C2%85%C3%9D%25%C2%A1%0B!%3C%C2%80%088%C3%9A1%01%C2%83%02QD%C2%9C%C2%AA%22%22%7F%C2%B7%C2%9A%19)%25gfQ%C2%80fb%00%11AU%01%C2%9C%C3%A4%1F-%C3%89%C2%BEb%C2%AB%C3%B7%C2%BE%C3%AA%C2%BC%C2%9F%C3%A4%C3%BF%40%C3%B7%26lw%C2%92%C2%BF%C3%87ql%23%2F%C3%A5H%C2%90%C2%A7%1E%C3%BB-%3F%C2%85j%05%C2%97%C2%8B%C3%8B%7B_%C3%9C%0D%C2%BB%C3%B2%23%C2%8B%C2%96r%C3%A7%C3%BC%2B%C2%9F%C3%B7%C3%B4v%5C%23%05U%0A%C3%AEh%C2%90%C3%97%C3%8D%C3%B9-%C2%BF%C2%9E%C2%BCJ%C2%ABm%C3%9B%C2%A9%C3%9A%C3%9D~t%C3%91RN%3D%C3%B6.%C2%84%C3%B0%C3%AC%C3%BB%C2%BE%C2%B9x%C2%9E%C3%A7u%C3%A7f%C3%96T%C2%9C%7D%02L)%C2%A5f%01%C2%BC%C3%9Fj%00%C2%93%02%C2%83%C2%99%C3%85eY%5C%13%C3%BB%C3%8A%04%0C%2F%C2%9B%07X%C3%87%C2%A1%26%C2%92%C2%83%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8FIDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10%00%C3%87%C3%8D%1E%3C%C3%B6I%7C%C3%81%C2%9F%C3%B8%14%C2%9F%C3%81%C2%8D%2F%C3%B0%2Cc%C3%88%C2%B6%07%C3%8B%C2%A1%C2%A6I%C3%91*%1Etn%10%C3%82%C3%AC.%C2%B0%09%C2%8D%C3%B7%C3%BE%01%04%C3%80Q%C2%8F%08t%0A%04%11q%C2%AA%C2%8A%C2%88%1Cn53RJ%C3%8E%C3%8C%C2%82%00%C3%95%C3%84%00%22%C2%82%C2%AA%028%C3%89%135%C3%89%C2%BEM%C3%96a%18vYW7%C3%A5%05Z%C2%B2%C2%A84%C3%93C%C3%A4%C2%A5%C2%AC%0D%C3%B2%C3%94%C2%B2%C3%9F%C3%B2S%C3%98%C3%B5%C3%82%C3%B5%7D%C3%BF1%C3%BEu%01%C2%8B%C3%A4k7-%C3%A5%3E%C3%B3%C2%AF%1C%C3%95%C3%99%C2%8A%C3%A4%C2%A5l%0D%C3%B2%C2%BAg~%C3%8B%C2%AF\'%C3%9F%C3%A5%C2%A9-%C3%9Bo%C3%A6%C2%AF%C3%9E%C2%BEu%C3%93RN-%7B%C3%A3%C2%BD%7F%C2%B6m%5B%5D%3C%C2%8E%C3%A3%C2%9C%C2%B9%C2%99U%15g%C2%9F%001%C2%A5T-%C2%80%C3%B7_%0D%20*%C3%90%C2%99Y%C2%98%C2%A6%C3%89U%C2%B1%C3%8FD%C2%A0%7B%01%5B%15G%C2%87D%08%C3%B4%C3%A7%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8EIDATH%C2%89%C3%AD%C2%97M%0A%C2%830%10%C2%85%3F%C2%87Y%C2%B8%C3%AC%C2%91r%05o%C3%A2Q%3CFv%C2%B9B%C2%8E%25%12%C2%A6%5D%C2%B4Bk%C2%B5%C3%B6%07%C2%A3%C2%90%C2%BE%5D%C3%82%C2%90%C3%AF%C2%85y%19H%C3%A5%C2%BD%3F%01%01p%C3%A4S%04%1A%05%C2%82%C2%888UED6%C2%A7%C2%9A%19)%25gfA%C2%80l%60%00%11AU%01%C2%9C%C2%8C%1B95%C3%B2%C3%B2R%C2%A7%26%C2%8A%C2%85%C3%ABt%C2%A3%C3%AB%C2%BA%C3%8D%60m%C3%9B%3E%C2%AC%2B%C3%AF%C3%BD%C2%B9%C2%AE%C3%AB%C2%A7%C3%82wL%C3%9C%1F%C3%B6%C2%AA~%0A%05%C3%A8%C3%BB%C2%BE%C3%A0%C2%9E%1F%2Bp%C3%9Fj%C2%AE%C2%AFk%C3%9A%C3%B5%C3%A6%C2%8Bi%C3%9FZe%C2%A7%C3%BD%C2%98%13n%C3%8D%C3%88%5C%C2%BA%C3%A7%C3%AA%C2%97%5EA%C3%99%3D%3FV%C3%A0~%C3%91%C2%A7S%C3%AE%3F%C3%A1vQ%C3%A1p3%C3%8B%0A%1Dy%02%C3%84%C2%94R6%03%C2%B7%C2%BF%1A%40T%C2%A01%C2%B30%0C%C2%83%C3%8BB%C2%BF*%02%C3%8D%05DYW%C3%A1%C3%9C%C3%B7T%3D%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C2%830%10D%1F%C2%AB%3DpLIn%C2%81N(%C2%852%7C%C2%A3%05%C3%8A%C2%B2%C2%90%C2%B5%C3%89!!B%09%241%02%C2%83D%C3%A6%C3%A8%C3%9F%1B%C2%8D%C3%97%2B%C2%B9%C3%B0%C3%9E_%C2%80%16p%C3%A4S%07T%0A%C2%B4%22%C3%A2T%15%11%C3%99%C2%9Cjf%C3%84%18%C2%9D%C2%99%C2%B5%02d%03%03%C2%88%08%C2%AA%0A%C3%A0d%18%C3%88%C2%A9%C2%81%C2%97%C2%97%C3%BAj%C3%A2%C2%B4p%C2%9D%C2%9Bh%C2%9A%C3%A6%C3%AB%C3%A6%C2%BA%C2%AE%C2%B7%C2%81%C2%A7%C3%AA%C2%93%C3%999%C2%93%C2%BB%C3%86%5Ex%C3%AF%C2%AFeY%3E%07~%C2%89%7B%C2%A9%C3%86%09%C2%84%10%C3%9E%C3%A1)%26%C3%86%C2%87%C2%A5%C3%86%1EB8h%C2%B5%C2%A7jI%C3%A5%C3%8F%C3%86%C2%BE%C2%B5v%C2%8F%C3%BD%C2%B8w%C2%BE%C2%A4q%C2%AC%06O%C3%95%C2%94%C3%99O%26%C3%BF%1Dnrq%C3%AA%C2%9D%C2%A7%C3%84%C2%BE%C3%BBS%5B%C2%B5%C3%A0R_%C3%80%C2%BF%C3%83%C2%9D%14nfY%C2%A1%03O%C2%80.%C3%86%C2%98%C3%8D%C3%80%C3%A3%C2%AF%06%C3%90)P%C2%99Y%C3%9B%C3%B7%C2%BD%C3%8BB%C2%BF%C2%AB%03%C2%AA%1B%02%3Ao%C3%91%3DGA%C3%AF%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8CIDATH%C2%89%C3%AD%C2%97K%0E%C2%820%10%40%1F%C2%93Y%C2%B0%C3%B4H%C2%BD%027%C3%A1(%1C%C2%A3%C2%BB%5E%C2%81c5%C2%A4%19%5D(%C3%86%C2%A8%C2%A0%60(%24%C3%B5-%C3%9B4o~m%C3%92%C3%8A%7B%7F%02%02%C3%A0%C3%88G%0F4%0A%04%11q%C2%AA%C2%8A%C2%88ln53RJ%C3%8E%C3%8C%C2%82%00%C3%99%C3%84%00%22%C2%82%C2%AA%028%19%17r2%C3%BA%C3%B2Z%C2%9F%C2%83(V%C2%AES%1B%5D%C3%97%7D%3C%C3%9C%C2%B6%C3%ADO%C3%B2cf%C2%BE%C2%94%C2%B9JMU%C2%A8%C3%9C%C2%81%C3%9BU%5Ey%C3%AF%C3%8Fu%5D%C3%9F%17%C2%BE%C2%99%C3%B2%C2%B5%3C%C3%B6%3E%C3%86%C3%B8*%C3%8FE%C2%8C%C2%B1%C3%A0%C2%9E%C3%8F%C3%9E%C3%B35ww%09%C3%87%C3%8D%7C)%C3%AF*5W%C2%A1r%07%C3%AE%C3%BF%C3%82m%26%C2%9C%C2%A2%C3%AC%17n%7F%C2%B9%C2%99e%C2%95%C2%8E%3E%01%C3%BA%C2%94R%C2%B6%00n%7F5%C2%80%5E%C2%81%C3%86%C3%8C%C3%820%0C.%C2%8B%C3%BDJ%0F4%17m%09UAW-Y%C2%91%00%00%00%00IEND%C2%AEB%60%C2%82'
        }
    };

    var dark = {
        normal: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9BIDATH%C2%89%C3%AD%C2%97%C3%8B%09%031%0CD%C3%9F%C2%8A-%20%25%C2%A5%05%C2%A3B%5C%C2%8B%2B%C3%99%16%C3%9CYr%C3%88%C2%87%C2%B0dc%13p%C3%86%C2%A0%C3%8C%C3%91%08%C2%9E4%C2%B6%06%C2%BC%C2%B8%C3%BB%09%C3%98%C2%803%C2%BFS%05%C2%92%09%C3%80%C3%9Cy%C2%9B%09%C3%80%C3%8F%06L%04%06%60%C3%9D%1F%C3%A4%C2%9C%C2%87%C2%80J)m%C3%B8Q%C3%A1%08%C3%8De%C3%BB%C2%ABZW%C3%B0p%C3%A8%C2%A8%C2%AE%C3%A5%C2%A0t%C3%B2%3F%3C%1E%C3%BC%C3%A3k%C3%AF%C3%95%C2%B7%C2%B90%C3%AF%C3%A4%C2%A3%C2%93n%C3%9E%C3%89%7B%C2%93%C3%AB%5D%5D%C2%8FkqW-.%5C%1A2q%C3%B7%5C%0A_%C3%9C%C3%BD%C2%A2%C2%82%C3%87%C2%B5%C3%9D%C2%B8%7D%C3%9A%14%C2%AA%06%24A%03%15HW%C2%99%3C%22%C3%8Dn%C2%92%06v%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A9IDATH%C2%89%C3%AD%C2%97%C3%9B%0D%C3%83%20%0CEO%C2%AC%0E%C3%90%C2%91%C2%BA%02%C3%B2%20%C2%9E%C2%85I%C2%B2%02%C2%9B%C2%B5%1F%7DHm%13T%C2%87%26%C2%8ED%C3%AE%1F%08%C3%B9%C2%98%0B%C2%B6%60P%C3%9530%02%17%C2%B6S%01%C2%92%04%C2%80y%C3%B0F%09%00%C2%BF%12%C2%90%200%00%C2%A7%C3%8F%093%5B%0D%C2%96s~%1B%0F%C2%AAz%5D%1A%C3%8C%C3%8C%C2%BE%02z%C2%B4%2F%C3%9B%C2%9F%C2%AA%C3%99%3F%C2%B5%5B%C3%AFz%08%C3%9E%C3%B9%01%3F%C3%A0%C2%9Bj%C2%B6%C3%94%C2%BCZ%C3%92lf%C3%A1-%C2%9D%C3%ABW%C3%AD%C3%97%C3%B6%C2%A9%C2%AEUs%C3%84%C2%BB%C2%BE%C3%9F%C3%9B%C3%9E%2F%C3%BCou%0E%C3%BE%C3%B2%C2%AC%C3%82%C3%97%C2%AE%C3%B5~%C3%8F%C2%BC%C3%A9%01%C3%99%C2%AA~m%17%C3%AE%C2%9F%C2%B6%08%15%01R%40%02%05H7%5B\'%26%0F%C2%B8%C3%B4%C3%BC%C3%BA%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A6IDATH%C2%89%C3%AD%C2%97%C3%91%09B1%0CE%C3%8F%0B%0E%C3%A0H%C2%AEP2Hg%C3%A9%24o%C2%85n%C2%A6%1FZ%C2%91G5%C3%A2%C2%B3%C2%A6%10%C3%AFg)%C2%9C%C3%9C%C2%9B%26%C3%90EU%C2%8F%C3%80%0A%C2%9C%C3%B8%C2%9D*%C2%90%C3%84%01%C3%8C%C2%8D%C2%B7%C2%8A%03%C3%B8%5E%C2%808%C2%81%018%C3%B4%0Es%C3%8EC%60%C2%A5%14%1B%C2%BE%C2%BD%C3%B4%0D%C3%B5%0C%C3%8D%17%C3%BB%C2%A3%C2%9E%C2%B5%C2%A0%C2%A5c%C2%B5%C3%A8U%C2%8A%C2%AE%C3%8E%C3%BF%C3%B0xp%C3%B3%C2%B5%C2%8F%C2%98%C3%B9%C2%A6%C2%B9%C2%9D%5B%C3%9A%C2%93%C3%8C%C3%BC%C3%8E%7B%5Bl%C3%AB%C3%98%C3%9A%C2%84%3D%C3%85%1D%C2%B5%C2%B8%C3%B0%C2%B7%1E%C3%9C%C2%A8E%C2%B3%7B%C3%8E%C2%9B%3E)0n%C3%8F%17U%3D%7B%C3%81%C3%A3%C3%86.%5C%3Fm%1E%C2%AA%02%24%C2%87%02*%C2%90.Op%24%1A%C3%97%0ABo%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%94%C3%81%0D%C2%84%20%14D%C2%9F%C3%84%02%C2%B6%C2%A4m%C2%81%C3%BCB%C2%A8%C2%85Jl%C2%81%C3%8E%C3%96%C2%8Bz%C3%91%05%C2%B3%2B%0C%C2%89%C2%BE%2B%C2%877%C2%99%7Cf0%C2%B3%170%01o%C3%9A%C2%91%00%C3%AF%04b%16%C3%9F%C3%A4%04%C3%A2-%C2%80%13%C2%89%01%C3%98%C3%89C%08%3AyK%C3%86%C3%9Cc%C2%A9%C2%85%18c%3D%C3%B9Y%C2%BE%C2%85%2C%C2%85%C3%AB%C3%AB%C3%A0%1Ey%0B.9%C2%B8_%C2%AF%3E%2B%C3%BF%C3%B7%2B%C2%95%C3%A8%C2%AF%C3%B6%1A%13%7B%C3%94%C3%A2%C2%A1%C2%BCv%C3%9D%2B%C3%BD%C3%95%C2%BE%C2%92%C2%AB%C3%BF%C2%8Av%C2%AAm%C3%BB%C2%99p%C3%B7%5D%C2%B8%C3%BB%C3%8A%C2%9Fm%C2%970%C2%98%C3%99G%25%C2%97_%7B%12%C2%B9%C2%93%03%C2%BC%20%40%02%C3%BC%0C%C2%B2u%24%1E%C3%BF%3AK%C3%8C%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%96IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%10%04%C3%87%C3%82%05%C2%A4%C2%A4%C2%B4%20%C2%AE%C2%90%C2%ABE%C2%95%C2%B8%05u%C3%A6%7C%C2%A2%10%1C%22%C2%88%0F%C2%BC%26%C3%96%3C%C2%A5%C2%83%C2%91%C2%96c\'3%C2%BB%01%0Bp%C3%A78*%C2%90%C2%93%40%C3%8C%C3%93%C2%B7%24%C2%81%C3%B8%C3%B5%C2%80%24%12%03%10%C2%92%C2%BB%C2%BBN%1EE*%C2%9F%7B%C2%97%C3%9Fb-%C2%A5%C2%84f%1B%C3%97%C2%8D%7D%C3%88%25t%C2%B7%C2%BD%C2%B7%C2%A9%C2%91%C3%99%C2%86%C3%B4%C3%A7%C2%93%C2%99%C2%AD%C3%AF%07%C3%91%C3%8A%C3%AC%C2%B1M%C3%A7C%C3%BE%0B%C3%AE%C2%BE%2B%C3%AE%C3%86y%17n%C3%94%C3%AB%C2%90%C3%BF%C2%95%C3%BC%C2%BA%C3%B5z%C2%AEn%3F%12y%C3%ACU%C3%A4%C2%AE%09%C3%88%C2%82%07T%20%3F%00%C2%A4%7F)M%C3%98%05%C3%B1-%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A2IDATH%C2%89%C3%AD%C2%94%C3%91%0D%C3%83%20%10C_P%07%C3%A8H%5D%01%C3%9D%20%C3%8C%C3%82%24Y%C2%81%C3%8D%C3%9A%C2%9F%C2%A8%C3%A2%23%09%11%C2%84%C2%B8j%C3%B0%00%C3%B7%C3%8C%C2%9D%C3%B1dfO%60%06%5E%5C%C2%A7%04x\'%00%C2%B3%C3%B0f\'%00%7F%0D8%11%18%C2%80%C3%8B%C3%A0!%04%1D%7CM%C2%8F%C3%96%01k%2F%C3%8A%15c%C2%AC%C2%87o%0D%C3%9F%1BzT%C3%B7%08%C3%9C%C2%80%C3%A7*%06%C3%AE%C2%8C%60U%C3%83Kj1%C3%B7%7Bk%2F%15GWx%C2%8F%3B%C3%BF_%C2%B7%C3%83%C3%BE%C2%99%C2%9A%C2%BA%7Dk%C3%B8%C3%A8%C3%B6%01%C2%AF%C3%91%C2%A1%C3%80%C3%B5%C3%AA%C3%B7S%C2%BEZ%C2%AD9%C3%A9%C3%9A\'3%7B%C2%AB%C3%A0%C3%B2%C2%B4\'%11%3B9%C3%80%0B%0C%24%C3%80%7F%00%C2%84%C3%AC%23%C2%B8tUQH%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%99IDATH%C2%89%C3%AD%C2%96%C3%8B%0D%C2%840%0CD%1F%C3%91%16%C2%B0%25%C3%91B%C3%A4BRK*%C2%A1%C2%85t%06%17%C2%84%C2%84%C3%84%C2%B2%16%C2%BF%C2%89%14%C3%A6%C2%9A%C3%83%1B%C3%87c%C3%8B%C2%9D%C2%99%7D%C2%81%01%C3%A8yN%05%C2%88A%00f%C3%A6%0DA%00%5E%0C%04%11%18%C2%80%C2%BA%C3%A0)%25%1D%C3%BCII%C3%A1%C2%9F%C2%BD%C3%87_-%C3%889%C3%9F%0F%C3%B7j%C3%8B%C2%A4%C3%87%60%C2%BB%3Do%17%C2%BE%1B8o%C2%AA%C2%8F%C2%A6%C2%BF%C3%9E%C3%8A%C3%BF%C2%AD%C3%9A%C2%B3%C3%B3%5Eo%C3%A5%5E%1D%C3%9D%C2%84%C3%AD%C2%8E%C3%9A%0B%C2%97%C3%A8%C3%9Dp%2B%C3%9DqDn%C3%BDNgf%C3%A3%C3%A5%24%C2%A7%C3%A4i%2F%22v%09%40%14%18(%40%C2%9C%00W%C2%91%22e%C2%B2%C3%AD%C3%95%C2%B6%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%96%C3%9D%0D%C2%84%20%10%C2%84%3F%C2%89%05X%C2%92-%C2%90-%C2%84Z%C2%A8%C3%84%16%C3%A8L_.%C3%A6r%C3%9E%C2%91%C3%A0%0F%C2%A3%C3%A1%C3%A6%11H%C2%BEa%C2%99%C3%9D%C3%90%C2%99%C3%99%00L%C3%80H%3D%25%C3%80%3B%01%C2%98%17or%02%C3%B0j%C3%80%C2%89%C3%80%00%3C%17%1EB%C3%90%C3%81%C2%8FJ%0A%C3%AFs%C2%9B%C3%9F%C3%8A%1Ac%C2%AC%03%2FU%C2%A9%C3%99v%C3%9F%C2%BC%5Dx6p%C2%A5%C3%89.%3D%7F%C3%8F%C2%9B%C3%A7F%C3%A7Y%C2%BD~Z%C2%9F%C3%AF1%C3%9Bn%C3%9A%C3%BF%C3%B0%C3%B6%C3%A0%3F%5B%C3%AD%C3%AA%C3%A9%06%C3%A2%C2%9Bwf6%C2%BF%2F%1C%C3%BD%14%C3%A6%C3%B4Y%C2%9D%0D%C2%BC%C2%A6%C3%A4iO%22vr%C2%80%17%18H%C2%80_%007%7C%24Z%2B%C2%89%C2%80I%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%94%C3%91%11%C2%84%20%0C%05W%C3%A6%0A%C2%B0%C2%A4k%C2%81I!%C3%94B%25%C2%B6%40g%C3%9E%C2%8F%C3%BA%C3%85%01%C2%A3%C2%8E%C2%8F%19%C3%9C%02%C2%B2%09%C2%BCd2%C2%B3%19X%C2%80%2F%C3%8F%C2%91%00%C3%AF%04b6%C3%9F%C3%A2%04%C3%A2%C2%A3%01\'%12%030%C2%86%3C%C2%84%C2%A0%C2%93%C3%A7%C2%90%C3%8A%3Fw%15%C3%8A%3D%2B%40%C2%8C%C3%B1%C2%9A%3CW%C2%B8T%C2%B4%C2%95q%C3%BF%7C%5CyS%C3%A0Z%C3%82u%26%C2%80%C3%BDO%5E%C3%A2%C3%9F~%C3%AF%C2%94%5E%C2%A4%C3%AF%C3%89%C3%8F%5C%C2%AEV%C3%86%5D%C2%B5W.%C2%A1%C2%9A%C3%B6Z%C2%AA%C2%AF%C2%A4%C2%BE%C2%BF%C3%89kW%C3%AB.%263%5B%1F1e%C2%90%C2%A7%3D%C2%89%C3%9C%C3%89%01%5E%C3%90%40%02%C3%BC%0F%3A%C2%94%20%C2%B2%C2%A7%C3%BA%1E%C3%B4%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%93IDATH%C2%89%C3%AD%C2%94%C3%8B%0D%C2%80%20%10%05Gb%01%C2%96d%0Bd%0B%C2%A1%16*%C2%B1%05%3A%C3%93%C2%8Bz%20%01%C3%91%C2%80k%22s%C3%9E0%C2%8F%C3%ACg%10%C2%91%09X%C2%80%C2%99%C3%B7%08%C2%805%0Abv%C3%9Fb%14%C3%84g%00%C2%A3%24%06%20%2Bw%C3%8E%15%3DRZwK%C3%9E%C2%9A%C3%B1%C2%AA%20%C3%BE%C2%95%C3%B7%C3%BE%3Dy)OB~w%C3%A0%C2%BA%C2%BC%15%C3%95%06%C3%AE%C3%89%16%5C%C3%8Ak%C2%AEVL%C3%AFy%C2%92%C3%94%C3%9D%C2%AE%C3%91%C2%8Ef%17%C3%AE%20%17%C3%B2%C2%BF%3D%C3%AF%C3%B2%C3%BF%C3%89%C3%BBmWa%10%C2%91UK%C2%AE%3E%C3%ADA%C3%89%1D%0C%60%15%02%04%C3%80n%20%C2%89%20%C2%B4.%16%C3%96%C3%8E%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A5IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%0CE_L%07%C3%A8HY%C3%81h%10%C3%8D%C3%A2I%C2%B2%C2%827k%2FM0%C2%A1%10%C3%95%C2%A8%11!%C3%BE\'%1B%C2%84%C2%9El%7Di%12%C2%91\'%C2%B0%003%C3%A7%C2%A9%029%05%C2%80%C3%B9%C3%B0%C2%96%14%00%C3%9E%0AHA%60%00%C3%8CpUu%C2%8D%C3%BB%09%C3%BE%0F%3D%C2%8E%02%C3%9A%C2%97%C2%AC%C3%A7R%C3%8A9p%C2%ABz%C2%8A%C2%BC%C2%86%C3%A1%06%C3%9CSn%C2%86%5B%C3%8D%C2%A5%C2%AA%C3%A6i8%C2%84%C3%B7%24%C2%B5j%C3%B4%C3%BC%C2%AB%C3%B6%7B%C2%BA%C2%BD%7B%C2%B4%C3%80%C3%85p%C2%BDE%C3%9E%C2%B7%C3%A7%03~%3F%C2%B8%C3%8B%C2%A8%C2%B5%C3%A3%C3%A4%C2%B6%C3%9B%7B%C2%93Z%15%C3%BA%C3%AD%C2%93%C2%88%C2%BC%C2%A2%C3%A0%C3%A1n%C2%AFA%C3%AC%C2%9A%C2%80%1CP%40%05%C3%B2%1B%C2%80%C2%A91%C3%A8%C2%9A%C3%AE%0B%C3%B0%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%94%C3%91%0D%C2%830%0CD%1F%11%03t%24V%C2%88%3CHf%C3%89%24%C2%AC%C2%90%C3%8D%C3%A8OAj%C2%85T%13BO%15%C2%B9%C2%BFH%C2%91%C3%9F9%C2%BEx0%C2%B3%070%03%13%C2%BFS%01b%10%C2%80y%C3%B1%C3%A6%20%00o%06%C2%82%08%0C%40%15%3C%C2%A5%C3%94%C3%A4%C2%9E%C2%B4%C3%B3%C3%91s%C3%89%C3%9B%C3%A9%25p%C2%AF%C2%8E%C2%9A%C3%BC%C2%BF%C3%80u%C3%B8Y5%0D%5C%C3%8E%C3%B9%C3%AD%C3%BC-%C2%80.%C3%B8%C3%91%C2%A2%5E%C3%B5%C2%99%C3%AF%C3%AA%C2%AA%C3%8D%C3%A6%C2%82%7BUk%C3%B2%C2%BE3%C3%AF%C3%B0%C3%BB%C3%81%C2%9B%7C%C2%B5%C3%8F%C3%B5%C2%BB%C3%AA%C3%94n%C2%AF-%C3%AA%C2%95%C3%B4%C3%99%073%5BTpy%C3%9A%C2%8B%C2%88%5D%02%10%05%06%0A%10%C2%9F%60%C2%9A%1F%1Cc%C3%95%02%C3%8D%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%99IDATH%C2%89%C3%AD%C2%94%C3%91%0D%C2%84%20%10%05Gb%01%C2%96d%0Bd%0B%C2%A1%16*%C2%B1%05%3A%C3%B3~N%C2%A3%04%C3%90%C2%BB%C3%8B%C2%B9%240%7F%C2%90%C2%8D%C2%B3d%C2%9F%3B%C2%88%C3%88%04%2C%C3%80%C3%8Cs%04%C3%80%1A%051o%C3%9Fb%14%C3%84%7B%03FI%0C%40%C2%97%C2%AB0%C3%86%17%C3%8E%C2%B9%C2%BF%C3%89%C2%BC%C3%B7%C2%A7%C3%B3%20%22k%C2%AA%C3%B0N%13%C3%87%C2%8F%C2%95%C3%AAc%C3%A9F%C2%BB3%C2%AF%2Bp%C3%9F%C2%92%C2%9Bk%09%C3%95%C2%97g%C3%93%C3%BE%04%3Dp%3BUl%C2%B8%C2%ABFR%C3%A9N%C3%95%C2%97%C3%BE%C2%82vg%5EW%C3%A0~%C3%A1%C3%93-%C3%977%5C%C2%97%C2%B7%25%0FJ%C3%AE%60%00%C2%AB%C3%90%40%00%C3%AC%0B%0D%C2%88%26%C2%91I%04%C2%A2%C3%B3%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A1IDATH%C2%89%C3%AD%C2%94%C3%91%0D%C3%83%20%0CD_P%06%C3%A8H%5D%01y%10fa%C2%92%C2%AC%C3%80f%C3%ADOUE%0D%C2%A45%C2%A2X%C2%91%7C%C2%9F%20x%C2%A7%C3%A3%C3%B0%22%227%60%03%C3%AE%C3%8CS%01b0%00%C3%B3%C3%A2m%C3%81%00%C3%BC6%10%C2%8C%C3%80%008%C3%9CDkk%23%C2%A5%C3%B4%C3%B5p%C3%8E%C3%B9%3Fp%C2%AD%C3%8E%C3%8C%C2%B6L%C2%9A%C3%86%C2%BE%C2%88%C3%88c%C2%BF%C3%B0K%C3%9C%C2%BD%C3%BAL%C3%A0%00%C3%97%C2%98%C3%98_v%C2%B9%C3%98%C2%87%15%C2%AE%C2%A7%C3%B9%C3%8D%C3%98g%C3%88\'%5CU%3D%0D%1E%06%C3%97%C2%AAf%C3%B6%C3%8C%C2%A4O%C2%B8%C2%AA%C2%B4o~%C2%A9%C3%98%C2%87%16N%C3%BB%03%7C%C3%829%7C%3A%C2%BC%18%C2%B1K%00%C2%A2%C2%81%C2%81%02%C3%84\'Kz6%C2%83xg%C3%96%7F%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%90IDATH%C2%89%C3%AD%C2%94%C3%AD%09%C2%80%20%10%40_%C3%92%00%C2%8D%C3%94%0Ar%C2%838%C2%8B%C2%93%C2%B4%C2%82%C2%9B%C3%95%C2%9F%C2%88%C2%A8%C2%B4%2C%C3%A8%C2%82%C3%AB%C3%BDT%C3%A4%C3%9D%C2%A7%C2%8D%C2%88t%C3%80%00%C3%B4%C2%BCG%02%C2%BCS%103%C3%BB%06%C2%A7%20%5E%02pJb%00~%C2%B9%0Am%C3%AE%22%C2%84p%C3%BA8%C3%86%C3%B8H%C3%BE%C3%8D%C3%8Ck)U*W!%C2%BB%03%C2%A7*oDd%5C%1F%5C%C2%99%C3%B2%C2%BBl%7B%C2%BF%C2%93%C2%BF%C2%89%C3%9D%C2%9E%17%C3%B7%C3%BC%C3%8E%C3%AE%C3%96%C3%B0%C3%9D%C3%8Ck9%C2%AAT%C2%A9Bv%07%C3%AE%C3%BF%C3%A1T%C2%B0%C3%9Bs%C3%9B%C3%B2%C2%A4%C3%A4N%0E%C3%B0%0A%01%24%C3%80O%C2%ABl%23%2B%C3%85N%C3%A3%C2%A8%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        rollover: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%94IDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%10%40_%C3%82%C2%81%C2%90%0F%C3%A9HY%C3%81%19%5C%C3%81u%C2%9C!%2B8U%20%22%C3%98%C2%8F%C2%92%16%24V)%24%0A%C3%A9%C3%BB%C2%92%C3%A4%C3%A0%C3%A5N%C3%AF0j%18%C2%86%07%C3%A0%00K9%26%C2%A0%13%C3%80-%C3%8Bb%C2%BD%C3%B7%C2%84%10%C2%B2%5B%C2%9B%C2%A6%C3%81%18cE%C3%84i%C2%A0%C2%98%18%20%C2%84%C2%80%C3%B7%1E%C3%80%C3%AA%C2%B8P%C2%92y%C2%9E%01%C2%90%C3%ADF%C3%9F%C3%B7Y%C2%84%C3%A38%C2%BE%C2%9F%C3%97uM%C3%8B%C2%B7%C2%819%C3%91E%2C%3B%243%C2%8F%1C%C2%BD%C2%82X%C2%A1%C2%BD%C2%B8%C2%A3%0A%5E%C2%9A%C3%B9_%5E%C2%9F%C3%BC%C3%AB%C3%97~%C2%96_%C3%A7%C3%82%7D3%C3%8F%3D%C3%A9%C3%AE%C2%9B%C3%B9%C3%99%C3%89%C2%95%C2%8A%3BS%C2%B5z%5B%C2%AD%5E%C3%B9%C2%A5C%C2%A6%C3%9E%3E%C2%BF%C2%97%C2%BC%C3%94%C3%8FcR%5E%12%0D%C2%AF%2BLI%C2%A2O%03%C2%931%C2%A6%C3%88%01%C2%94R%C3%B1%C2%AE%060%09%C3%90%C2%89%C2%88k%C3%9B%C3%96f%C2%B7%7F%C2%98%C2%80%C3%AE%09c%C3%8CB06%C2%A7%C2%ACS%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%840%0C%40%C2%9F%12(%C3%B4Cn%C2%A4%C2%AE%C3%A0%0C%5D%C3%81u%C2%9C%C3%81%15%C2%9C%C2%AAP%11%C2%BC%C2%AFr%C3%A0%C2%A9%C3%98%C3%93%C3%96%03%7D%C2%9F6%C3%B2%C2%9A%C3%84%04%2C%C2%9A%C2%A6y%01%1D%60%C3%88G%0F%C3%94%02t%C3%A38%1A%C3%A7%1C%C3%9E%C3%BB%C3%A4V%C2%A5%14Zk%23%22%5D%09d%13%03x%C3%AFq%C3%8E%01%C2%982%3C%C3%88%C3%890%0C%00%C3%88%C3%BC%C3%80Z%C2%9BL%C3%9A%C2%B6-%00%C3%934-%C3%8BC%C3%80%1E%C2%AC%C2%B5Q%C3%B1s%C3%8A%C2%9F%C3%9F%3C%C2%81%C2%AF%C3%8C%03%5B%C3%A5_%C3%8A66%1E.%C3%8E%C3%BC%C2%91%3F%C3%B2%C2%AC%C2%AC%C2%8EZ%2C%C2%BF%2C%C2%9BU%C3%B9%C2%91%C3%8D%C2%B5%C2%97%C3%BF-%C3%BB%C3%92%C3%96%C3%9A%C2%AAHl%C3%BC%7D%C2%BF%C3%B6%C3%BB%C3%8AO%C2%9Bs%C2%88%1F%C3%8FMy%C3%AAY%C2%BFo%C3%8F%0F%C3%89%C2%8F%C2%B6%C3%A5%C3%BA%C3%8C%C2%95RY%C2%A5%C3%81W%02%C2%BD%C3%96%3A%C3%8B%05%C2%8A%C2%A2%08%C3%BFj%00%C2%BD%00%C2%B5%C2%88tUU%C2%99%C3%A4%C3%B6%0F%3DP%C2%BF%01cGE0%04n%C2%9A%0A%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%10%C2%86%3F%C3%A5%20%C2%90%07%C3%A9HY%C3%81%19%5C%C3%81u%C2%9C!%2B8U%20%22%C3%98%C2%A7%C3%90Rbm%C2%AB%C2%89B%C3%BA%3D%C2%AA%C3%B0%C3%A5%C2%BF%C3%8B%1DX%C3%B5%7D%7F%03%2C%60%C3%88%C3%87%08%C2%B4%02%C3%98y%C2%9E%C2%8Ds%0E%C3%AF%7Dr%C2%ABR%0A%C2%AD%C2%B5%11%11%5B%03%C3%99%C3%84%00%C3%9E%7B%C2%9Cs%00%C2%A6%0E%0Fr2M%13%00%12%7B%C3%99u%5D%12%C3%A90%0C%00%2C%C3%8B%C2%B2.%0F%1F%1DI%2CP%7D%C2%B8%C3%A5%0B%C2%A2%C3%89%C2%9FYkA%C2%A8%C3%8EV%C2%8B%C3%9EU%C3%B1%C3%94%C3%A4%7Fyy%C3%B2%C3%8D%C3%9B%C2%9Eb%C3%A6%03%C3%97N%C2%BE%C3%85%C2%9E%C3%8A%5C%3Fyl%C2%8B%C2%BD%26%C3%9E%C3%9A%C2%841%C3%8A%1D%C2%B5r%C3%A5%1F%5D%C2%B8T%C2%8Bf%C3%B7%C2%9C%07~9%60%C2%B9%3D%C3%8F%26%C2%8F%C2%B5%C3%A5%C3%BC%C3%A4J%C2%A9%C2%AC%C3%92%C3%A0%C2%AB%C2%81Qk%C2%9D%C3%A5%00UU%C2%85%7F5%C2%80Q%C2%80VDl%C3%934%26%C2%B9%C3%BD%C3%81%08%C2%B4w%C2%BC%1BCY%C3%ACK%C3%B7p%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%14EO%C3%A4A%20%1F%C3%92%C2%91%C2%B2%C2%823%C2%B8%C2%82%C3%AB8CVp%C2%AA%40D%C2%B0_iKkUZ%13%05%3D%C2%9F%C3%89%C3%87y%5C%5E.D5Ms%03%1C%60%C3%89G%07T%02%C2%B8a%18%C2%AC%C3%B7%C2%9E%10Br%C2%AB%C3%96%1Ac%C2%8C%15%11W%00%C3%99%C3%84%00!%04%C2%BC%C3%B7%00%C2%B6%C2%88%079%C3%A9%C3%BB%1E%C2%80%C3%A2%C3%BD%C2%A2%C2%AE%C3%AB%C3%A4%C3%B2q%1C%C2%A7%C3%A59%C2%91%C2%B9%C3%8B%C2%A5%14%C3%9A%C2%B6M\'_%C3%8B%C2%B7!%C2%97%C2%86%C3%9B5%C3%B6K%C2%BE%0B%C2%9B%2C%C3%9C%C2%AF%5B%3F%2B%C3%BF%C3%B7)-q%C2%BC%C3%98ST%C3%ACT%C2%8A%C2%93%C3%B2%C3%94qG%C2%8E%17%7Bd.%C3%BE-%C3%92I%C3%96%C3%ADk%C2%86%3Bo%C3%83%C2%9DW~u%C3%BB.%7C%C3%88sU%C3%ABC%C2%AE%C2%B5%C3%8E%26%7C%C3%B5%15%40g%C2%8C%C3%892%C2%80R*%C3%BE%C3%95%00%3A%01*%11qeY%C3%9A%C3%A4%C3%B6\'%1DP%C3%9D%01%C3%A1tC%5D%C3%B82%C3%96J%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%90IDATH%C2%89%C3%AD%C2%97%C3%91%09%C3%83%20%14EO%C3%82%03%C3%81%C2%8F%C3%90%C2%91%5C!3%C2%B8B%C3%96%C3%89%0C%C2%AE%C2%90%C2%A9%04C%20%C3%BD%C2%B2--%0D%18%C2%89I%C2%9B%C2%9CO%7Dz%C3%B4%22%0F%C2%AC%C2%BA%C2%AE%C2%BB%01%0E0%C2%94c%00Z%01%C3%9C4M%C3%86%7BO%08as%C2%ABR%0A%C2%AD%C2%B5%11%11W%03%C3%85%C3%84%00!%04%C2%BC%C3%B7%00%C2%A6%C2%8E%03%25%19%C3%87%11%C2%80%3Ag%13k%C3%AD%C2%AAu%C3%B3%3C%C3%A7%C3%8Bs%C3%99U.K%C2%93%C3%9Fb%C3%AD%C3%BB%3E%C2%AB6r%C3%9E%C3%98%2F%C3%B9.%2C%C2%BE%C3%B6%C2%A5%C2%97%C2%9AS%1B9%C3%96%C3%8DS%5BfJ%C3%BD%7B%3A%1F%C3%B2%C2%94%C3%B8%C2%AC%C2%B5%C2%AB%C3%A2%C2%8E%1C%2B%C3%B6W%C2%AE%C3%B6z%C3%89%C3%BFJ~%C3%9E%C3%B6%C3%BA%C2%BB%C3%B2%C2%9C%C3%96%C3%BA%C2%90%2B%C2%A5%C2%B26I%25%C3%BAj%60%C3%90Z%179%40UU%C3%B1%C2%AF%060%08%C3%90%C2%8A%C2%88k%C2%9A%C3%86ln%7F2%00%C3%AD%1D%0A%C2%B0G~%7C%C2%BA%C3%9F%C2%9E%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C3%8B%09%C2%840%10%40_%C3%82%C2%80%C2%90%C2%83lIi%C3%81%1Al%C3%81v%C2%AC!-XU%20%22%C2%B8%C2%87%C3%85%C3%9D%3D%C3%B8%5B5QX%C3%9FI%3C%C3%8C%C2%9B%C3%8CL%06%C2%A2%C2%AA%C2%AAz%00%0E%C2%B0%C2%A4%C2%A3%01%0A%01%5C%C3%97u%C3%96%7BO%08!%C2%BA5%C3%8B2%C2%8C1VD%C2%9C%06%C2%92%C2%89%01B%08x%C3%AF%01%C2%AC%1E~%C2%A4%C2%A4m%5B%00t*aY%C2%96%C3%AF%C3%AF%C2%BE%C3%AF%C3%93%C3%8A%C3%87%C2%90%C2%BD%01%C2%BEO4F%5D%C3%97%C3%9B%C3%A5S%C3%81%C3%A7%C2%82%C2%AE%C3%A5%C3%94%C2%B2%C3%9F%C3%B2SX%1C%C2%B8%23%06k%C2%B3%7C%C2%89%3D%C3%89%5D%C2%AF%C3%ACK%C2%8B%23%C2%AA%3CF%C2%9F%C3%87%0Et%C2%BD%C2%B2%C3%BF%C3%8A%5C%C2%9Bv%C3%AD%C3%B6%C2%A9%C3%A0%C3%B7n%C2%BF%C3%A5%5BX5p%C2%B1%C3%B6%C3%BB!Wmkr%C3%BF%C3%91%C3%B3%C2%B1%C3%AAhx%3DaR2%C3%B84%C3%90%18c%C2%92%24%C2%A0%C2%94%1A%C3%9Ej%00%C2%8D%00%C2%85%C2%88%C2%B8%3C%C3%8Fmt%C3%BB%C2%87%06(%C2%9E%1A%09B%C2%AF%C3%A4%24%05u%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%94IDATH%C2%89%C3%AD%C2%97%C3%91%09%C3%83%20%10%40%C2%9Fr%10%C3%B0%23t%24W%C3%88%0CY!%C3%ABd%06Wp*%C3%81%10H%3F%C3%9APJ%C3%93V%C3%92j%02%C3%89%C3%BB%C3%94%C2%8Fw%C3%A7%C2%9D%C2%87%C2%AA%C2%AE%C3%AB.%C2%80%03%2C%C3%A5%C3%B0%40%23%C2%80%1B%C3%87%C3%91%C2%86%10%C2%881f%C2%B7VU%C2%851%C3%86%C2%8A%C2%88%C3%93%4011%40%C2%8C%C2%91%10%02%C2%80%C3%95%C3%B3BI%C2%86a%00%40%17%C2%B5%C3%9E%C2%99%C2%A6iY%C3%9E%C2%B6m%C2%B1%206%C3%89%7C%17r%C3%B9%C2%B4%C3%B9%C2%AE%04%7D%C3%9F%C3%A7%C2%97%C2%A7%C2%B2%14dJ%C2%80%C3%87%C2%AD%C3%B9q%C3%A5%1F%1B.%C2%B5%C2%AB%C3%97v%C3%BF~3%C3%BF6j%7F%C2%BD%C3%AF%C3%BB%C3%8D%3C%C2%95%C2%B5%C2%93%C3%B0%C2%B8W%C3%AD%C2%94o%C3%829%C3%A1%C2%9E%C3%88%C3%B1%C2%88%5C%3A%C2%9D%17%C3%B9%C2%BF%C2%9EH)h%C2%B8%7DaJ2%C3%BB4%C3%A0%C2%8D1E%02PJ%C3%8D%7F5%00%2F%40%23%22%C2%AE%C2%AEk%C2%9B%C3%9D%C3%BE%C3%80%03%C3%8D%15t%C3%91A%C2%82%C3%A4X%C2%A7%7C%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%97%C3%9B%09%C3%830%0CE%C2%8F%C2%8D%20%C3%A0%C2%8F%C3%90%C2%91%C2%BCBf%C3%88%0AY\'3x%05Oep%08%C2%A4%1Fm(%C3%B4%C2%91%C3%A2%3C%C3%9C%C2%80%7B%3Fm%C3%81%C2%91dI%C3%88%C2%AA%C3%AB%C2%BA%0B%C3%A0%00K%3Ey%C2%A0%11%C3%80%C2%8D%C3%A3hC%08%C3%84%18%0F%C2%A7VU%C2%851%C3%86%C2%8A%C2%88%C3%93%4060%40%C2%8C%C2%91%10%02%C2%80%C3%95%C3%B3AN%0D%C3%83%00%C2%80%C3%8EJ%C2%BDk%C2%9A%C2%A6%C3%AD%C3%B0%C2%B6m79%C3%B1%C2%93%C3%88O%01%C2%97%C2%A5%C3%8Bwi%C3%AD%C3%BB%3E%0F%3CU%C2%A9%C3%8E%C2%96%C3%BB%C3%A6%C3%A5%C3%82%17%0B.%C2%B5%C2%B2S%C3%AD%C3%8F%19%C3%B9%C3%92%C3%A8%C3%9C%C2%AB%C3%97w%C3%AB%C3%B35%C3%8E%C2%96%5B%C3%AD%7Fxy%C3%B0%C2%8F%C2%ADv%C3%B4t%C2%83%C2%B3E%C2%9E%C2%BA%14%C2%A6%C3%98%3Fg%C3%A7%05%C2%BE%C3%A7%C2%9A%C3%B4M%1An_%C2%98%C2%9C%C2%9Ay%1A%C3%B0%C3%86%C2%98%2C%0E(%C2%A5%C3%A6%C2%BF%1A%C2%80%17%C2%A0%11%11W%C3%97%C2%B5%3D%C2%9C%C3%BE%C2%90%07%C2%9A%2B%20nB%C2%AB%3C%1D%C3%AF6%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9AIDATH%C2%89%C3%AD%C2%97%C3%8D%09%C2%840%10F_%C3%82%C2%80%C2%90%C2%83lIi%C3%81%1Al%C3%81v%C2%AC%C3%81%16%C2%AC*%10%11%C3%9C%C3%83n%C3%98%C3%83%C2%BA%1A%C3%BC%C2%89%01%C3%B7%1Ds%C2%98%C2%97I%C2%BE%0CD5M%C3%B3%00%3A%C3%80%C2%92%C2%8E%1E%C2%A8%04%C3%A8%C3%86q%C2%B4%C3%8E9%C2%BC%C3%B7%C2%A7%5B%C2%8B%C2%A2%C3%80%18cE%C2%A4%C3%93%4021%C2%80%C3%B7%1E%C3%A7%1C%C2%80%C3%95a!%25%C3%830%00%C2%A0%C2%93Z%C3%9FL%C3%93%C2%94V%5E%C3%97%C3%B5%C3%97%C3%9A%25%C2%9Dg!%C2%97%C2%A3%0A%C3%8D%1D%2B%40%C3%9B%C2%B6%C3%BB%C3%A4s%C2%85%C2%97%C2%8A%C3%86r%C3%9F%3B%C2%BF%C2%AF%3C*p1%C3%A1%C3%9A%12%C3%80%C3%BC%3B_%C3%A2%C3%97%C3%BB%0E%2C%C2%9DH%C3%9E%C2%9Do%C2%99%5C%C2%B1%C3%9C%C3%B7%C2%A9%C3%BD%C3%A5%C2%97%C2%B0%C2%9A%C3%B6%C2%B5T%C3%AFI%7D~%C2%9D%C2%AFM%C2%ADS%C3%A5G%0C%C2%90%184%C2%BC%C2%BE0)%09%3E%0D%C3%B4%C3%86%C2%98%24%1BPJ%C2%85%C2%BF%1A%40%2F%40%25%22%5DY%C2%96%C3%B6t%C3%BB%C2%87%1E%C2%A8%C2%9E%12%2C%3F%C2%AB9nr%C3%B6%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97%C3%8B%09%C2%840%10%40_d%20%C2%90%C2%83%C3%AC%C3%85~%C3%92%C2%825%C3%98B%C3%9A%C2%B1%06%5B%C2%B0%1F%C3%AF%C2%81%C2%88%C3%A0%1E%C2%96%C2%B0%20%C3%B8AL%3C%C3%A8%3B%C2%86!o%C2%92%C3%89%0CD9%C3%A7%3E%40%07X%C3%B2%C3%91%03%C2%B5%00%C3%9D4M%C3%96%7BO%08!%C2%B9Uk%C2%8D1%C3%86%C2%8AHW%00%C3%99%C3%84%00!%04%C2%BC%C3%B7%00%C2%B6%C2%88%0B9%19%C3%87%11%C2%80b%2B%C2%A8i%C2%9AC%C2%9B%1D%C2%8D%C2%8B%C3%8C%C3%B3%C2%BC%2FO%C2%8D%C3%AC%05%2CO%C3%95%C2%B6m%3E%C3%B9Q%C3%8E%24y%C3%AB%C2%B5%C2%BF%C3%B2%5B%C2%B8%C3%AC%C3%81%C2%9D%C3%A9%C2%82%5D%C3%B9%C2%95%C2%AD%C2%B5%C3%A4%C2%AD%C3%B9*ks%C3%BB%C2%8Ar%24%C2%9Bp%C2%91%C2%AD%24%C2%9F%5B%C3%B3W%C3%BE%3C%C3%B9%3B%C3%9BoA9%C3%A7%C3%A6a%18%C2%B2%C2%8B%C2%AB%C2%AA%C3%BA%C2%9D%5Ck%C2%9DU%1C%7D%05%C3%90%1Bc%C2%B2%24%C2%A0%C2%94%C2%8A%7F5%C2%80%5E%C2%80ZD%C2%BA%C2%B2%2Cmr%C3%BB%C2%9F%1E%C2%A8%C2%BFP%C3%86C.%C2%81%08%C3%A5%C3%B2%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A6IDATH%C2%89%C3%AD%C2%97%C3%81%C2%A9%C2%840%10%40_d%20%C2%90%C2%83%C3%AC%C3%85~%C3%92%C2%825%C2%A4%C2%85%C2%B4c%0D%C2%B6%60%3F%C3%9E%03%11%C3%81%3D%2Ca%C3%A5%C3%B3a%C2%B3%12%C3%A3a%7D\'%C2%95%C2%987%C3%89%C3%8C%04%C2%A2%C2%BC%C3%B7%0F%60%04%2C%C3%B5%C2%98%C2%80%5E%C2%80q%5DW%1BB%20%C3%86x%C2%BAUk%C2%8D1%C3%86%C2%8A%C3%88%C3%98%00%C3%95%C3%84%001FB%08%00%C2%B6I%1Fj%C2%B2%2C%0B%00M%C3%AE%0F%C3%8E%C2%B9b%C3%A3%C2%B6m%C3%BBN~%06%C3%B2i%C3%80~%25%C3%A9y%18%C2%86%3A%C3%B2%5C%C2%8E%04y%C3%A9%C2%B6%C3%9F%C3%B2K(Vp%C2%A9%C2%B8%C2%9Cs%C3%99%C3%9D%C3%B0Q~d%C3%92%5C%C3%AE%C2%9C%C3%BF%C3%8B%C3%9Fsz%C3%BF%5E%22%05E%0A%C3%AEh%C2%90%C2%BF%C2%9B%C3%B3%5B%C3%BE%7B%C3%B2%22%C2%AD%C2%B6o%C2%A7bg%C3%BB%C3%91Is%C2%B9t%C3%9B%C2%95%C3%B7~%C2%9B%C3%A7%C2%B9%C2%BA%C2%B8%C3%AB%C2%BA%C3%97%C3%8A%C2%B5%C3%96U%C3%85%C3%89%C3%97%00%C2%931%C2%A6J%00J%C2%A9tW%03%C2%98%04%C3%A8Edl%C3%9B%C3%96%C2%9En%7F3%01%C3%BD%13z%C2%A3S%C3%92%C2%9A%C3%8E%40%C3%BE%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97M%0A%C2%84%20%14%C2%80%3F%C3%A3%C2%81%C3%A0%22f%C3%93%7D%C2%BCBg%C3%A8%0A%5E%C2%A73t%C2%85%C3%AE%C3%93%5E0%C2%82f1%C3%840%C3%83%C3%80%C2%98%C2%95-%C3%AA%C3%9B)%C3%AA%C3%B7%C2%9E%3F%0FT%C3%8E%C2%B9%07%C3%90%01%C2%96%7C%C3%B4%40-%407M%C2%93%C3%B5%C3%9E%13B8%C3%9C%C2%AA%C2%B5%C3%86%18cE%C2%A4%2B%C2%80lb%C2%80%10%02%C3%9E%7B%00%5B%2C%1D9%19%C3%87%11%C2%80%22er%C3%934%C2%9B%C3%86%C3%8D%C3%B3%C2%9C.%C3%9F%0B%C2%89%19%14%C2%9B%C3%A9!%C3%B2X%C3%96%06y%C3%AA%C2%B6%C3%9F%C3%B2S%C3%98%C3%B5%C3%82%C2%B5m%C3%BB%C3%91%C3%BEw%01%C2%A3%C3%A4k%17%C2%8D%C3%A5%3E%C3%B3%C2%9F%1CU%C3%99%C2%A2%C3%A4%C2%B1%C2%A4%06y%C3%9D3%C2%BF%C3%A5%C3%97%C2%93%C3%AF%C3%B2%C3%94%C2%BE%C3%8B%C3%AF%C3%82%C2%A6%C3%9A%C2%9E%C2%BAh%2C%C2%A7n%C2%BBr%C3%8E%C3%8D%C3%830d%17WU%C3%B5%C3%8A%5Ck%C2%9DU%C2%BC%C3%B8%0A%C2%A07%C3%86d%09%40)%C2%B5%C3%BC%C3%95%00z%01j%11%C3%A9%C3%8A%C2%B2%C2%B4%C2%87%C3%9B%C3%9F%C3%B4%40%C3%BD%04%20_%40v%121%C2%93%C3%89%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDATH%C2%89%C3%AD%C2%97%C3%91%09%C2%830%10%C2%86%C2%BF%C2%84%C2%83%40%1E%C2%A4%23e%05gp%05%C3%97q%06Wp%C2%AA%40D%C2%B0%2FM%5B%C2%A4%C2%B5%C3%95%C2%92%18%C2%B0%C3%9Fc8%C3%BC%C3%AE%C2%B8%C2%9F%03U%C3%9B%C2%B6%17%C2%A0%07%1C%C3%B9%18%C2%80Z%C2%80~%C2%9A%26%C3%A7%C2%BD\'%C2%84%C2%90%C3%9Cj%C2%8C%C3%81Z%C3%ABD%C2%A4%C3%97%4061%40%08%01%C3%AF%3D%C2%80%C3%93%C3%B1!\'%C3%A38%02%C2%A0%C2%B3Zo%C3%8C%C3%B3%7C%C2%9C%3Cr%C2%A8%5C%C2%96%0FM%C3%93%24%C2%93u%5D%C2%B7.%C2%8F%05%C3%9F4%C3%B1%C3%BC%C2%B1%C2%B5%C3%BA%C2%A54r%C3%9E%C2%9D%C2%97%15%C2%B8%C2%BD%C2%BC%C3%9B%C3%AB%1AeN%C2%BEg%C2%92%C2%AD%C3%BC%03w%C2%A7%C2%88%0B%C3%B7%C2%A9%C2%91W%C2%99xU%C2%BF%C2%96%C2%9D%C3%B3%C3%AE%C2%BC%C2%AC%C3%80%C3%BD%C3%82%C3%96%C3%9BP%C3%AE%C3%A4%C2%A9%C2%AF%C3%9Cy%03w%C2%BC%C3%9C%18%C2%93U%1A%7D%1A%18%C2%AC%C2%B5Y%1APJ%C3%85%7F5%C2%80A%C2%80ZD%C3%BA%C2%AA%C2%AA%5Cr%C3%BB%C2%83%01%C2%A8%C2%AF%C3%9D%C3%90E0%C2%A8D%C2%B6%C2%83%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B1IDATH%C2%89%C3%AD%C2%97A%C2%8A%C2%840%10E_%C2%A4%20%C2%90%C2%85%C3%B4%C3%86%C3%BB%C3%A4%0A%C2%9E%C3%81%2B%C3%A4%3A%C2%9E%C3%81%2Bx%1F%C3%B7%C2%81%C2%88%C3%A0l%263%0D%C2%ADv%C3%87%C3%91H3%C3%BD%C2%961%C3%A1%15%3F%C2%95%02%C2%95s%C3%AE%06t%C2%80%25%1F%3DP%0B%C3%90M%C3%93d%C2%BD%C3%B7%C2%84%10N%C2%B7j%C2%AD1%C3%86X%11%C3%A9%0A%20%C2%9B%18%20%C2%84%C2%80%C3%B7%1E%C3%80%16q!\'%C3%A38%02Pd%C2%B5~3%C3%8F%C3%B3u%C3%B2%C3%88%C2%A5rY%C3%BB%C3%904%C3%8D%C3%93%C3%83m%C3%9B%C2%9E%23Oe%C2%AB%C3%98%C2%B5%22%2F%C2%8D%5D9%C3%A7%C3%A6a%18~%16%5E%C2%89%7B%2F%C3%B7%09TU%C3%B5%18%7B%C3%9C%C2%90z%C3%A7o%17%C3%BBa%0D%C2%B7%C2%A7%C3%B3W%C3%A5%7F%7DF%C2%AF%C3%B0%C2%99p%C2%8B%C3%AC%C3%A9%C3%A0%C3%83%C3%A4%C2%A9%2C%15%C2%BBU%C3%A4g%C3%82-nH%C2%BD%C3%B3%C2%B7%C2%8A%C3%BD%C3%90%C2%86K%7D%01%C2%9B%C3%B2%C2%B3%C2%A7%C3%9C%C3%BF%C2%9Dp%C3%97%C3%8B%C2%B5%C3%96Y%C2%A5%C3%91W%00%C2%BD1%26K%01J%C2%A9%C3%B8%C2%AF%06%C3%90%0BP%C2%8BHW%C2%96%C2%A5%3D%C3%9D%C3%BEK%0F%C3%94_%C3%90%15%5B%C3%A8%C3%A9!%C2%80%C3%BB%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9EIDATH%C2%89%C3%AD%C2%97%C3%8D%09%C2%830%18%40_%C3%A4%C2%83%40%0E%C3%92%C2%8B%C3%BBd%05gp%C2%85%C2%AC%C3%A3%0C%C2%AE%C3%A0%3E%C3%9E%03%11%C3%81%5Ej%5B%C2%A8%C3%9A%C2%AA%18%05%C3%BB%C2%8E%C3%B9%C3%A1%25%C3%9FO%20%C3%8A9w%03*%C3%80%12%C2%8F%1A%C3%88%05%C2%A8%C2%BA%C2%AE%C2%B3%C3%9E%7BB%08%C2%BB%5B%C2%B5%C3%96%18c%C2%AC%C2%88T%09%10M%0C%10B%C3%80%7B%0F%60%C2%93a%20%26m%C3%9B%02%C2%90D%C2%B5%3E%C3%A8%C3%BB%C3%BE8%C3%B9%C3%80%C2%A1r%C2%99%C2%9A(%C2%8A%C3%A2%C3%AB%C3%A6%C2%B2%2C7%C3%89%C3%8Fy%C3%B3%C2%A5%C3%8CEj*B%C3%97-%C2%B8C%C3%A5%C3%8A9%C3%977M%C3%B3%1C%C3%B8%C2%A5%C3%8A%C3%97%C3%B2%C2%9E%C3%BB%2C%C3%8B%3E%0Bnk%C3%BB%2C%C3%A1%C2%BA9%C2%9F%C3%AD%C3%B35%C2%BD%C2%BB%C2%84%C3%B3%C3%9E%7C)c%C2%91%C2%9A%C2%8B%C3%90u%0B%C3%AE%C3%BF%C3%82%C2%8D.%C3%98%C2%9B%C3%AB%C3%A6%C3%BCx%C2%B9%C3%96%3A%C2%AAt%C3%B0%25%40m%C2%8C%C2%89r%00%C2%A5%C3%94%C3%B0W%03%C2%A8%05%C3%88E%C2%A4J%C3%93%C3%94%C3%AEn%7FQ%03%C3%B9%1D%C2%B2.H%C2%84!%1A%3AH%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        pressed: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10%00%C2%A7A%C3%88%C3%81K%C3%89%C3%8D%C3%9F%C3%A4%0B~E%7C%C2%87_%C3%89%17%C3%B2%C2%A2%C3%9C%C2%82x%C2%91%1EJZ%C2%90%C3%98J!%C2%AB%C2%90%C3%8EI%C2%92%C2%85%C3%89%C2%AE%C3%AEbn%C3%A38%C3%9E%01%07X%C3%A4%C3%B0%40%C3%9F%00nY%16%1BB%20%C3%86X%C3%9C%C3%9A%C2%B6-%C3%86%18%C2%AB%C2%B5v%0A%10%13%03%C3%84%18%09!%00X%C2%95%16%24%C2%99%C3%A7%19%C2%80f%C2%BB1%0CC%11%C3%A14M%C2%AF%C3%A7u%5D%C3%B3%C3%B2m%60I%C2%94%C2%88e%C2%87l%C3%A6%C2%89o%C2%AF%20Uh%2F%C3%AE%5B%05O%C3%8D%C3%BC%2F%C2%AFO%C3%BE%C3%B1k%3F%C3%8A%C2%AFs%C3%A1%C2%BA%C2%99%C2%97%C2%9Et%C3%97%C3%8D%C3%BC%C3%A8%C3%A4%C3%8A%C3%85%1D%C2%A9Z%C2%BD%C2%ADV%C2%AF%C3%BC%C3%94!So%C2%9F_K.%C3%B5%C3%B3%C2%98%C2%95K%C2%A2%C3%A0y%C2%85%C2%91%24%C3%B9%14%C3%A0%C2%8D1%22%07PJ%C2%A5%C2%BB%1A%C2%80o%C2%80%5Ek%C3%AD%C2%BA%C2%AE%C2%B3%C3%85%C3%ADo%3C%C3%90%3F%00%C3%8D%C2%9BAOg%7F%11%2F%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97%3B%0A%C2%840%10%40%C3%9F%06!E%C2%9A%25%C2%9D%C2%B7%C3%89%15%C2%BCJ%C3%B0%1C%5E%C3%85%2B%C3%A4D%C3%A9%C2%82%C3%98%C3%88Va%C3%81U1~%C3%A2%C2%82%C2%BE%C3%92%C2%8C%C2%BC%C3%8C%C2%8C3%C3%A0%C2%AB%C2%AE%C3%AB7%C3%90%02%C2%86%7C8%C2%A0*%C2%80%C2%B6%C3%AF%7B%C3%A3%C2%BD\'%C2%84p%C2%BAU)%C2%85%C3%96%C3%9AH)%5B%01d%13%03%C2%84%10%C3%B0%C3%9E%03%18%11%1F%C3%A4%C2%A4%C3%AB%3A%00%C2%8A%C3%B1%C2%81%C2%B5%C3%B64i%C3%934%00%0C%C3%830-%C2%8F%01k%C2%B0%C3%96%26%C3%85%C2%8F%11%C2%9B%C3%9F%3C%C2%80%C2%9F%C3%8C%23K%C3%A5%C2%9F%C3%8A65%1E.%C3%8E%C3%BC%C2%91%3F%C3%B2%C2%AC%C3%8C%C2%8EZ*%5B%C2%96%C3%8D%C2%AC%7C%C3%8F%C3%A6Z%C3%8B%C3%BF%C2%96%7Djk-U%245%C3%BE%C2%BE_%C3%BB%7D%C3%A5%C2%87%C3%8D9%C2%A4%C2%8F%C3%A7%C2%A2%C3%BC%C3%ACY%C2%BFo%C3%8Fw%C3%89%C3%B7%C2%B6%C3%A5%C3%BA%C3%8C%C2%95RY%C2%A5%C3%91\'%00%C2%A7%C2%B5%C3%8Er%01!D%C3%BCW%03p%05PI)%C3%9B%C2%B2%2C%C3%8D%C3%A9%C3%B6%2F%0E%C2%A8%3E%C3%AC3DO%C2%B4l%C2%B3%C3%9F%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A0IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%83%C2%90E6%25%3Bo%C2%93%2Bx%15%C3%B1%1C%5E%C3%85%2B%C3%A4D%C3%99%05q%23%5D%C2%85%C2%96%C2%926m5QH%C3%9FR%C2%85%C2%97%3F%C2%93%19%C3%B02%0C%C3%83%15%C2%98%00C9%2C%C3%905%C3%80%C2%B4%2C%C2%8Bq%C3%8E%C3%A1%C2%BD%C3%8FnUJ%C2%A1%C2%B56R%C3%8AI%00%C3%85%C3%84%00%C3%9E%7B%C2%9Cs%00F%C2%84%07%25%C2%99%C3%A7%19%C2%80%26%C3%B6%C2%B2%C3%AF%C3%BB%2C%C3%92q%1C%01X%C3%97%C3%B5%C2%B5%3C%7C%C2%B4\'%C2%B1%40bw%C3%8B%17D%C2%93%3F%C3%B2%C2%AA%05%C2%A1%3A%C2%A9%16%C2%BD%C2%AB%C3%A2%C2%A1%C3%89%C3%BF%C3%B2%C3%BA%C3%A4%C3%89%C3%9B%C2%9Ec%C3%A6%03%C3%A7N%C2%9EbKe%C3%8E%C2%9F%3C%C2%B6%C3%85%C2%9E%13%C2%A76a%C2%8CzG%C2%AD%5E%C3%B9G%17.%C3%97%C2%A2%C3%99%3C%C3%A7%C2%81_%0EXo%C3%8F%C2%8B%C3%89cm9%3E%C2%B9R%C2%AA%C2%A84%C3%B8%04%60%C2%B5%C3%96E%0E%20%C2%84%08%C3%BFj%00%C2%B6%01%3A)%C3%A5%C3%94%C2%B6%C2%AD%C3%89n%C2%BFc%C2%81%C3%AE%06%60SB%C2%A5%C2%88%5B%C3%A4%C2%B6%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%99IDATH%C2%89%C3%AD%C2%971%0A%C2%830%18F_%C2%83%C2%90!K%C3%89%C3%A6mr%05%C2%AF%22%C2%9E%C3%83%C2%AB%C3%A4%0A9Q%C2%B6%20.%C3%92)mi%C2%AD%C2%8A5Q%C3%907%26%C3%83%C3%BB%C3%B9%C3%B8%C3%B3AnM%C3%93%C3%9C%01%0B%18%C3%B2%C3%A1%C2%80%C2%AA%00l%C3%9F%C3%B7%C3%86%7BO%08!%C2%B9U)%C2%85%C3%96%C3%9AH)%C2%AD%00%C2%B2%C2%89%01B%08x%C3%AF%01%C2%8C%C2%88%079%C3%A9%C2%BA%0E%00%C3%B1yQ%C3%97ur%C3%B90%0C%C3%A3%C3%B2%C2%9C%14S%C2%97s)%C2%B4m%C2%9BN%C2%BE%C2%94_C%C3%8E%0D%C2%B7k%C3%AC%C2%97%7C%176Y%C2%B8%C2%B5%5B%3F)%C3%BF%C3%B7)%C3%8Dq%C2%BC%C3%98ST%C3%ACX%C2%8A%C2%A3%C3%B2%C3%94qG%C2%8E%17%7Bd*%C3%BE-%C3%92I%C3%96%C3%ADK%C2%86%3Bo%C3%83%C2%9DW~u%C3%BB.%7C%C3%89sU%C3%ABS%C2%AE%C2%94%C3%8A%26%7C%C3%B7%09%C3%80i%C2%AD%C2%B3%0C%20%C2%84%C2%88%7F5%00W%00%C2%95%C2%94%C3%92%C2%96ei%C2%92%C3%9B_8%C2%A0z%00%C2%B7%3DB%C2%A9%C2%B5%C2%B7%C3%BAe%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%92IDATH%C2%89%C3%AD%C2%97%C3%81%09%C3%83%20%18F_%25%C3%A0%C3%81K%C3%B1%C2%96m%5C!%C2%ABH%C3%A6%C3%88*%C2%AE%C3%A0D%C3%9E%24%C3%A4%12z%C2%B2--%0D%18%C2%89I%C3%9B%C2%BC%C2%A3%C3%BE%C3%BA%C3%B4C~%C3%B0%C3%92%C3%B7%C3%BD%15p%C2%80%C2%A1%1E%1E%C3%A8%1A%C3%80M%C3%93dB%08%C3%84%187%C2%B7*%C2%A5%C3%90Z%1B)%C2%A5%13%4051%40%C2%8C%C2%91%10%02%C2%80%11i%C2%A0%26%C3%A38%02%20J6%C2%B1%C3%96%C2%AEZ7%C3%8Fs%C2%B9%C2%BC%C2%94%5D%C3%A5%C3%8D%C3%92%C3%A4%C2%A7X%C2%87a(%C2%AAM%C3%BCo%C3%AC%C2%A7%7C%17%16_%C3%BB%C3%92K-%C2%A9M%1C%C3%AB%C3%A6%C2%B9-3%C2%A7%C3%BE5%C2%9D7yN%7C%C3%96%C3%9AUq\'%C2%8E%15%C3%BB3g%7B%3D%C3%A5%3F%25%C3%BF%C3%9F%C3%B6%C3%BA%C2%BD%C3%B2%C2%92%C3%96z%C2%97%2B%C2%A5%C2%8A6%C3%89%25%C3%B9%04%C3%A0%C2%B5%C3%96U%0E%20%C2%84H%7F5%00%C3%9F%00%C2%9D%C2%94%C3%92%C2%B5mk6%C2%B7%3F%C3%B0%40w%035%C3%A6F%C3%B7%C3%9E%C3%A6e%C2%95%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10%00%2F%16%C2%92%0B%C2%9A%C3%88%1D%C3%9Bx%05VA%C3%8C%C3%81*%5E%C3%81%13%C2%B9%C2%B3%10%0DJ%11%C2%91%C2%A40%C2%81%18l%C2%90%C3%82U%C2%88%C3%A2%C3%AF%C3%BD%C3%BF~%C3%89%C2%B7%C2%B6m%C3%AF%C2%80%014%C3%B9%C2%B0%40%5D%00f%18%06%C3%AD%C2%9C%C3%83%7B%C2%9F%C3%9CZ%C2%96%25J)-%C2%A54%02%C3%88%26%06%C3%B0%C3%9E%C3%A3%C2%9C%03%C3%90b%C3%BA%C2%91%C2%93%C2%BE%C3%AF%01%10%C2%B9%C2%84M%C3%93%C2%BC%C2%BE%C3%87q%C3%8C%2B%0FQl%0D%C3%B0y%C2%A2%10%5D%C3%97%C3%85%C3%8B%C3%A7%C2%82%7F%0B%C2%BA%C2%96C%C3%8B~%C3%89%0Faq%C3%A0%C3%B6%18%C2%ACh%C3%B9%12%5B%C2%92%3B_%C3%99%C2%97%16GRy%C2%8A%3E%C2%87%0Et%C2%BE%C2%B2%C3%BF%C3%8A%C2%B76m%C3%9A%C3%ADs%C3%81%C2%AF%C3%9D~%C3%89cX5p%C2%A9%C3%B6%C3%BB.W-6%C2%B9%C3%BF%C3%A8y%C2%A8%3A%02%C2%9EO%C2%98%C2%9CL%3E%01X%C2%A5T%C2%96%04%C2%84%10%C3%93%5B%0D%C3%80%16%40-%C2%A54UU%C3%A9%C3%A4%C3%B67%16%C2%A8%1Fu%3BBUu%C3%BA%1Fa%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10%00%C2%A7%1B%13%0E%5E%1An%C3%BE%C2%86%2F%C3%B8%15%C3%A3%3B%C3%BC%0A_%C3%A0E%C3%9C%C2%88%C3%B1bzhM%C3%93%C3%94Zb%0B%C2%9A%C3%A8%1C%C3%A10%C2%BB%C3%AC%C2%B2%C2%81K%C3%9B%C2%B6W%C3%80%02%C2%86%7C8%C2%A0.%00%3B%0C%C2%83%C3%B1%C3%9E%13BHn-%C3%8B%12%C2%AD%C2%B5QJY%01%C2%B2%C2%89%01B%08x%C3%AF%01%C2%8CL%0B9%C3%A9%C3%BB%1E%00%C3%89j%7D0%C2%8E%C3%A3%C2%BC%C2%BCi%C2%9AlAl%C2%92%C3%B9.%C3%A4%C3%85%C3%92%C3%A6%C2%A7%12t%5D%C2%97%5E%1E%C3%8B%5C%C2%901%01%1E%C2%B7%C3%A6%C3%87%C2%95%2F6%5ClW%C2%AF%C3%AD%C3%BE%C3%BDf%C3%BEm%C3%94%C3%BEz%C3%9F%C3%B7%C2%9By%2Ck\'%C3%A1q%C2%AF%C3%9A)%C3%9F%C2%84s%C3%82%C2%BD%C2%90%C3%A2%119w%3Ao%C3%B2%7F%3D%C2%91b%10%C2%B8%7Far2%C3%B9%04pZ%C3%AB%2C%01%C2%88%C3%88%C3%B4W%03p%05P%2B%C2%A5lUU%26%C2%B9%C3%BD%C2%89%03%C3%AA%1B%C2%A5%C2%A7%40%C3%BB%C3%88%C2%BC%C3%B0%C3%97%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9BIDATH%C2%89%C3%AD%C2%97%3D%0A%C3%830%0CF_E%C3%80C%C2%96%C3%A2-%C2%B7%C3%B1%15r%C2%95%C2%90s%C3%A4*%C2%BE%C2%82O%C3%A4%C3%8D%C2%84%2C%C2%A1C%1B%0A%C3%BDIq%C3%A3%C2%B8%01%C3%B7%1Bm%C3%81%C2%93dI%C3%88%C2%A7%C2%BE%C3%AF%C3%8F%C2%80%05%0C%C3%B9%C3%A4%C2%80%C2%B6%02%C3%AC4M%C3%86%7BO%08awj%5D%C3%97h%C2%AD%C2%8DR%C3%8A%0A%C2%90%0D%0C%10B%C3%80%7B%0F%60d9%C3%88%C2%A9q%1C%01%C2%90%C2%AC%C3%94%C2%9B%C3%A6y%C3%9E%0E%C3%AF%C2%BAn%C2%93%13%3F%C2%89%C3%BC%10%C3%B0j%C3%AD%C3%B2UZ%C2%87a%C3%88%03%C2%8FU%C2%AC%C2%B3%C3%A5%C2%BEy%C2%B9%C3%B0%C3%95%C2%82%C2%8B%C2%AD%C3%ACX%C3%BBcF%C2%BE6%3AS%C3%B5z%C2%B2%3E%C3%BF%C3%86%C3%99r%C2%AB%C3%BD%0F%2F%0F%C3%BE%C2%B6%C3%95%C3%B6%C2%9Enp%C2%B4%C3%88c%C2%97%C3%82%18%C3%BB%C3%87%C3%AC%3C%C3%81S%C2%AEI%C2%9F%24p%C3%BD%C3%82%C3%A4%C3%94%C3%82%13%C3%80i%C2%AD%C2%B38%20%22%C3%8B_%0D%C3%80U%40%C2%AB%C2%94%C2%B2M%C3%93%C2%98%C3%9D%C3%A9w9%C2%A0%C2%BD%00%C2%AD%C3%A7BQ%7Cs%C3%95%3E%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C2%BD%0D%C3%83%20%10F_N%C2%96(%C3%9CDt%C3%9E%C2%86%15%C2%BC%C2%8A%C3%A59%C2%BC%C2%8AW%60%22%3Ad%C2%B9%C2%B1R%24(E%12%1B%C3%B9%07%239%C2%AF%C2%A4%C2%B8%C3%87%C3%81%C3%87I%C3%9C%C3%9A%C2%B6%C2%BD%03%3D%60H%C2%87%05%C3%AA%02%C3%A8%C3%87q4%C3%8E9%C2%BC%C3%B7%C2%87%5B%C3%8B%C2%B2Dkm%C2%94R%C2%BD%00%C3%89%C3%84%00%C3%9E%7B%C2%9Cs%00F%C3%82BJ%C2%86a%00%40%C2%92Z_L%C3%93%C2%94V%C3%9E4%C3%8D%C3%87%C3%9A)%C2%9Dg!%2F%C3%B6*%C3%B4%C3%ADX%01%C2%BA%C2%AE%C3%9B%26%C3%BFVx%C2%AEh%2C%C3%97%C2%BD%C3%B3%C3%AB%C3%8A%C2%A3%02%17%13%C2%AE5%01%C3%8C%C2%BF%C3%B39~%C2%BD%C3%AF%C3%80%C3%9C%C2%89%C3%A4%C3%9D%C3%B9%C2%9A%C3%89%15%C3%8Bu%C2%9F%C3%9A_~%0A%C2%8Bi_J%C3%B5%C2%96%C3%94%C3%A7%C3%97%C3%B9%C3%92%C3%94%3AT%C2%BE%C3%87%00%C2%89A%C3%A0%C3%B9%C2%85II%C3%B0%09%60%C2%B5%C3%96I6%20%22%C3%A1%C2%AF%06%60%0B%C2%A0VJ%C3%B5UU%C2%99%C3%83%C3%ADo%2CP%3F%00%C2%91%C2%95%3FQTF9%C2%BF%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%97A%0A%C2%84%20%14%40_%12%C2%B8p3%C2%B8k%C3%9FA%C2%BCBW%09%C3%8F%C3%91U%C2%BCB%07%C3%A9%0C%C3%AE%24%C3%9A4%C2%B3%18d%20h%C2%8A(%5B%C3%A4%5B%C3%8A%C3%87%C3%B7%C3%B5%C3%BB%3FXXk_%C2%80%03%0C%C3%A9%C3%A8%C2%81%C2%A6%04%C3%9C4M%C3%86%7BO%08%C3%A1r%C2%ABR%0A%C2%AD%C2%B5%C2%91R%3A%01%24%13%03%C2%84%10%C3%B0%C3%9E%03%18%11%17R2%C2%8E%23%00%C3%A2_P%C3%9B%C2%B6%C2%BB6%C3%9B%1B%17%C2%99%C3%A7y%5B~5%C3%A5V%C3%80%C3%B2T%5D%C3%97%C2%A5%C2%93%C3%AF%C3%A5H%C2%92%C2%B7%5E%7B%C2%96%C3%9F%C3%82i%0F%C3%AEH%17l%C3%8A%C3%8Fl%C2%AD%25%C2%B9%C3%A6%C2%AB%C2%AC%C3%8D%C3%AD3%C3%8Aq%C3%99%C2%84%C2%8B%C3%BCK%C3%B2%C2%B95%C3%8F%C3%B2%C3%A7%C3%89%C3%B3l%C2%BF%C2%85%C3%82Z%C3%BB%1E%C2%86!%C2%B9%C2%B8%C2%AE%C3%AB%C3%AF%C3%89%C2%95RI%C3%85%C3%91\'%C2%80%5Ek%C2%9D%24%01!D%C3%BC%C2%AB%01%C3%B4%25%C3%90H)%5DUU%C3%A6r%C3%BB%C2%8F%1Eh%3E%C3%9FxC%01c%22K%C2%91%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A8IDATH%C2%89%C3%AD%C2%971%0E%C2%83%20%14%40_%C2%89%09%03K%C3%83%C3%A6%C3%AEA%C2%B8%C2%82W!%C2%9C%C3%83%C2%ABx%05%0F%C3%A2%19%C3%98%C2%88q%C2%B1%1D%1AR%C3%934%C2%91%1A%C3%84%C2%A1%C2%BEI%0D%C3%B2%3E%C3%BC%C3%BFI%C2%B89%C3%A7%C3%AE%40%0F%18%C3%8A1%00m%05%C3%B4%C3%B3%3C%1B%C3%AF%3D!%C2%84%C3%83%C2%ADJ)%C2%B4%C3%96FJ%C3%99%0B%C2%A0%C2%98%18%20%C2%84%C2%80%C3%B7%1E%C3%80%C2%88%C3%B8%C2%A1%24%C3%934%01%20R%7F%C2%B0%C3%96f%1B%C2%B7%2C%C3%8Bo%C3%B2%23%C2%A8%C2%B6%06%C2%ACW%12%C2%9F%C2%BB%C2%AE%2B%23OeO%C2%90%C2%A7n%C3%BB%25%3F%C2%85l%05%17%C2%8B%C3%8BZ%C2%9B%C3%9C%0D%C2%9B%C3%B2%3D%C2%93%C2%A6r%C3%A5%C3%BC%2B%C2%9F%C3%A7%C3%B4%C3%BA%3DG%0A%C2%B2%14%C3%9C%C3%9E%20%C3%BF7%C3%A7%C2%97%C3%BC%C3%BF%C3%A4YZm%C3%9DN%C3%99%C3%8E%C3%B6%C2%BD%C2%93%C2%A6r%C3%AA%C2%B6%C3%9F%C2%9Cs%C2%8Fq%1C%C2%8B%C2%8B%C2%9B%C2%A6y%C2%AD%5C)UT%1C%7D%02%18%C2%B4%C3%96E%02%10B%C3%84%C2%BB%1A%C3%80P%01%C2%AD%C2%94%C2%B2%C2%AF%C3%AB%C3%9A%1Cn%7F3%00%C3%AD%13%C2%8D4TY%C3%9C%C3%92%C2%B2%C2%A5%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A2IDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C3%83%20%14%00%C3%8F%C3%88%12%05MD%C3%A7%C3%9E%C2%83%C2%B0%C2%82W%C2%B1%C2%98%C3%83%C2%ABx%05%06%C3%B1%0Ct%C3%88r%C3%A3%C2%A4%C2%88P%C2%94(R%C3%B0%0F%17%C3%B1u%20%C3%A0%C3%9E%C3%A3%C3%B3%24%0Ak%C3%AD%0D%C3%A8%01C%3E%1C%C3%90%C2%94%40%3FM%C2%93%C3%B1%C3%9E%13B8%C3%9C%C2%AA%C2%94Bkm%C2%A4%C2%94%C2%BD%00%C2%B2%C2%89%01B%08x%C3%AF%01%C2%8C%C2%88%1D9%19%C3%87%11%00%C2%B1fr%C3%9B%C2%B6%C2%9B%C3%86%C3%8D%C3%B3%C2%BC%5E%C2%BE%17e%C3%8A%C2%A0%C3%94L%0F%C2%91%C2%A7%C2%B24%C3%88S%C2%B7%C3%BD%C2%92%C2%9F%C3%82%C2%AE%17%C2%AE%C3%AB%C2%BA%C2%B7%C3%B6%C2%AF%0B%C2%98%24_%C2%BAh*%C3%97%C2%99%7F%C3%A5%C2%A8%C3%8A%C2%96%24Oem%C2%90%C3%BF%7B%C3%A6%C2%97%C3%BC%C3%BF%C3%A4%C2%BB%3C%C2%B5%C3%8F%C3%B2%1B%C3%99T%C3%9B%C3%97.%C2%9A%C3%8A%C2%A9%C3%9B%5EXk%C3%AF%C3%830d%17%C3%97u%C3%BD%C3%8C%5C)%C2%95U%1C%7D%02pZ%C3%AB%2C%01%08!%C3%A2_%0D%C3%80%C2%95%40%23%C2%A5%C3%AC%C2%AB%C2%AA2%C2%87%C3%9B_8%C2%A0y%00%3B%C2%B6A%C2%B1%10%22%3EB%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%99IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%83%C2%90E6%25%3Bo%C2%93%2Bx%15%C3%B1%1C%5E%25W%C3%88%C2%89%C2%B2%0B%C3%A2F%C2%BAi%C3%9A%22%C3%96VKb%C3%80%C2%BEe%18%7C3%C3%8Cg%C3%80K%C3%97uW%C3%80%02%C2%86%7C8%C2%A0%C2%A9%00%3B%C2%8E%C2%A3%C3%B1%C3%9E%13BHnUJ%C2%A1%C2%B56RJ%2B%C2%80lb%C2%80%10%02%C3%9E%7B%00%23%C3%A2CN%C2%86a%00%40d%C2%B5%C3%9E%C2%99%C2%A6%C3%A98y%C3%A4Py5%7Fh%C3%9B6%C2%99%C2%AC%C3%AF%C3%BBuy%2C%C3%B8%C2%A6%C2%89%C3%97%C2%8F%C2%AD%C3%95%C3%8F%C2%A5%C2%91%C3%B3%C3%AE%C2%BC%C2%AC%C3%80%C3%AD%C3%A5%C3%9D%5E%C3%97(s%C3%B2%3D%C2%93l%C3%A5%1F%C2%B8%07E%5C%C2%B8O%C2%8D%2Ceb%C2%A9~-%3B%C3%A7%C3%9DyY%C2%81%C3%BB%C2%85%C2%AD%C2%B7%C2%A1%C3%9C%C3%89S_%C2%B9%C3%B3%06%C3%AEx%C2%B9R*%C2%AB4%C3%BA%04%C3%A0%C2%B4%C3%96Y%1A%10B%C3%84%7F5%00W%01%C2%8D%C2%94%C3%92%C3%96um%C2%92%C3%9B%C2%9F8%C2%A0%C2%B9%01%C3%97yDO%2B%1E%C2%9A%C3%B7%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B4IDATH%C2%89%C3%AD%C2%97%C2%B1%C2%AD%C2%830%14EO%2C%24%17n%22w%C3%B4%0C%C3%A2%15X%05y%0EVa%05%06a%06w%16%C2%A2%C3%A1%C3%BF%26N%22%05%08%C3%A6%C2%83Q%C3%B4sJc%C3%AB%3C%5D%3F%3F%C2%89%C2%8B%C2%B5%C3%B6%0A4%C2%80!%1D-Pf%403%0C%C2%83q%C3%8E%C3%A1%C2%BD%3F%C3%9C%C2%AA%C2%94Bkm%C2%A4%C2%94%C2%8D%00%C2%92%C2%89%01%C2%BC%C3%B78%C3%A7%00%C2%8C%08%0B)%C3%A9%C3%BB%1E%00%C2%91%C3%94zc%1C%C3%87%C3%B3%C3%A4%C2%81S%C3%A5%C3%99%C3%9C%C2%87%C2%AA%C2%AA%C3%9E%1E%C2%AE%C3%AB%C3%BA%18y%2CK%C3%85%C3%8E%15yj%C3%AC%17k%C3%ADO%C3%97u%C3%B7%C2%855qo%C3%A59%C2%81%C2%A2(%5Ec%0F%1Bb%C3%AF%C3%BC%C3%A3b%C3%9F%C2%AD%C3%A1%C2%B6t%C3%BE%C2%AC%C3%BC%C2%AF%C3%8Fh%0D%C3%9F%097%C3%89%C2%96%0E%C3%9EM%1E%C3%8BT%C2%B1KE~\'%C3%9C%C3%A4%C2%86%C3%98%3B%C3%BF%C2%A8%C3%98wm%C2%B8%C3%98%17%C2%B0(%3Fz%C3%8A%C3%BD%C3%9F%09w%C2%BE%5C)%C2%95T%1A%7C%02h%C2%B5%C3%96I%0A%10B%C2%84%7F5%C2%806%03J)e%C2%93%C3%A7%C2%B99%C3%9C%C3%BE%C2%A0%05%C3%8A_d%7D%5B%07%C3%9B%C2%94N-%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A1IDATH%C2%89%C3%AD%C2%97%C3%8D%09%C2%830%18%40_%C2%83%C2%90C.%257%C3%AF%0E%C2%92%15%5CE2%C2%87%C2%ABd%05%07q%C2%86%C3%9C%C2%82x%C2%B1%C2%BD%C3%94%C2%B6P%C2%B5U1%0A%C3%B6%1D%C3%B3%C3%83K%C2%BE%C2%9F%40.%C3%96%C3%9A%2B%C3%A0%00C%3C*%20O%00%C3%97%C2%B6%C2%AD%C3%B1%C3%9E%13B%C3%98%C3%9C%C2%AA%C2%94Bkm%C2%A4%C2%94N%00%C3%91%C3%84%00!%04%C2%BC%C3%B7%00F%C3%B4%031i%C2%9A%06%00%11%C3%95%C3%BA%C2%A0%C3%AB%C2%BA%C3%BD%C3%A4%3D%C2%BB%C3%8A%C2%93%C2%B1%C2%89%C2%A2(%C2%BEn.%C3%8Br%C2%95%C3%BC%C2%987%C2%9F%C3%8BT%C2%A4%C3%86%22t%C3%9E%C2%82%C3%9BU~%C2%B1%C3%96%C3%9E%C3%AA%C2%BA~%0E%C3%BCR%C3%A5Ky%C3%8F%7D%C2%96e%C2%9F%05%C2%B7%C2%B6%7D%C3%A6p%C3%9E%C2%9CO%C3%B6%C3%B9%C2%92%C3%9E%C2%9D%C3%83qo%3E%C2%97%C2%A1HME%C3%A8%C2%BC%05%C3%B7%7F%C3%A1%06%17l%C3%8Dys%C2%BE%C2%BF%5C)%15U%C3%9A%C3%BB%04Pi%C2%AD%C2%A3%1C%40%08%C3%91%C3%BF%C3%95%00%C2%AA%04%C3%88%C2%A5%C2%94.MS%C2%B3%C2%B9%C3%BDE%05%C3%A4w%C3%9D%0AHW%C3%8D%C2%9F%C2%8F(%00%00%00%00IEND%C2%AEB%60%C2%82'
        }
    };

    var darkest = {
        normal: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9CIDATH%C2%89%C3%AD%C2%97%C3%8B%09%031%0CD%C3%9F%C2%8A-%20%C2%B5%C2%A8%C2%82%C2%B4%C3%A0~%7Ct%3F%C3%9B%C2%82%3BK%0E%C3%B9%10%C2%96ll%02%C3%8E%18%C2%949%1A%C3%81%C2%93%C3%86%C3%96%C2%80%17w%3F%01%1Bp%C3%A6w%C2%AA%402%01%C2%98%3Bo3%01%C3%B8%C3%99%C2%80%C2%89%C3%80%00%C2%AC%C3%BB%C2%83R%C3%8A%10P%C3%8E%C2%B9%0D%3F*%1C%C2%A1%C2%B9l%7FU%C3%AB%0A%1E%0E%1D%C3%95%C2%B5%1C%C2%94N%C3%BE%C2%87%C3%87%C2%83%7F%7C%C3%AD%C2%BD%C3%BA6%17%C3%A6%C2%9D%7Ct%C3%92%C3%8D%3Byor%C2%BD%C2%AB%C3%ABq-%C3%AE%C2%AA%C3%85%C2%85KC%26%C3%AE%C2%9EK%C3%A1%C2%8B%C2%BB_T%C3%B0%C2%B8%C2%B6%1B%C2%B7O%C2%9BB%C3%95%C2%80%24h%C2%A0%02%C3%A9%0A%C3%B1%C3%9B%20%C3%8C%1C%3F%C2%89%C2%B8%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%AAIDATH%C2%89%C3%AD%C2%97%C3%9B%0D%C3%83%20%0CEO%C2%AC%0E%C3%90Y%3CAW%60%1F%3E%C2%BDOV%60%C2%B3%C3%B6%C2%A3%0F%C2%A9m%C2%82%C3%AA%C3%90%C3%84%C2%91%C3%88%C3%BD%03!%1Fs%C3%81%16%0C%C2%AAz%06F%C3%A0%C3%82v*%40%C2%92%000%0F%C3%9E(%01%C3%A0W%02%12%04%06%C3%A0%C3%B49af%C2%AB%C3%81r%C3%8Eo%C3%A3AU%C2%AFK%C2%83%C2%99%C3%99W%40%C2%8F%C3%B6e%C3%BBS5%C3%BB%C2%A7v%C3%AB%5D%0F%C3%81%3B%3F%C3%A0%07%7CS%C3%8D%C2%96%C2%9AWK%C2%9A%C3%8D%2C%C2%BC%C2%A5s%C3%BD%C2%AA%C3%BD%C3%9A%3E%C3%95%C2%B5j%C2%8Ex%C3%97%C3%B7%7B%C3%9B%C3%BB%C2%85%C3%BF%C2%AD%C3%8E%C3%81_%C2%9EU%C3%B8%C3%9A%C2%B5%C3%9E%C3%AF%C2%997%3D%20%5B%C3%95%C2%AF%C3%AD%C3%82%C3%BD%C3%93%16%C2%A1%22%40%0AH%C2%A0%00%C3%A9%06%07%C3%82%23%C3%AA%26%C3%96SY%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A7IDATH%C2%89%C3%AD%C2%97%C3%81%0D%021%0C%04%C3%A7%2C%0A%C2%A0%16W%40%0B%C3%A9\'%C3%8F%C3%B4s-%C2%A43x%40%10%3A%05%C2%8C8%C2%82%23%C2%99%7DF%C2%91%C3%86%C2%BB%C2%8E-eQ%C3%95%23%C2%B0%02\'~%C2%A7%0A%24q%00s%C3%A3%C2%AD%C3%A2%00%C2%BE%17%20N%60%00%0E%C2%BD%C3%83R%C3%8A%10X%C3%8E%C3%99%C2%86o%2F%7DC%3DC%C3%B3%C3%85%C3%BE%C2%A8g-h%C3%A9X-z%C2%95%C2%A2%C2%AB%C3%B3%3F%3C%1E%C3%9C%7C%C3%AD%23f%C2%BEin%C3%A7%C2%96%C3%B6%243%C2%BF%C3%B3%C3%9E%16%C3%9B%3A%C2%B66aOqG-.%C3%BC%C2%AD%077j%C3%91%C3%AC%C2%9E%C3%B3%C2%A6O%0A%C2%8C%C3%9B%C3%B3EU%C3%8F%5E%C3%B0%C2%B8%C2%B1%0B%C3%97O%C2%9B%C2%87%C2%AA%00%C3%89%C2%A1%C2%80%0A%C2%A4%0B%C2%B0%C3%A8%22X%C2%9C%C3%9B%C3%8D%2B%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9DIDATH%C2%89%C3%AD%C2%94%C3%81%0D%C2%84%20%14D%C2%9F%C3%84%02%C2%B6%C2%96_%C2%81-%C3%90%0FG%C3%BA%C2%B1%05%3A%C3%9B%C2%BD%C2%A8%17%5D0%C2%BB%C3%82%C2%90%C3%A8%C2%BBrx%C2%93%C3%89g%063%7B%0130%C3%91%C2%8E%04x\'%10%C2%B3%C3%B8f\'%10o%01%C2%9CH%0C%C3%80N%1Ec%C3%94%C3%89%5B2%C3%A6%1EK-%C2%84%10%C3%AA%C3%89%C3%8F%C3%B2-d)%5C_%07%C3%B7%C3%88%5Bp%C3%89%C3%81%C3%BDz%C3%B5Y%C3%B9%C2%BF_%C2%A9D%7F%C2%B5%C3%97%C2%98%C3%98%C2%A3%16%0F%C3%A5%C2%B5%C3%AB%5E%C3%A9%C2%AF%C3%B6%C2%95%5C%C3%BDW%C2%B4Sm%C3%9B%C3%8F%C2%84%C2%BB%C3%AF%C3%82%C3%9DW%C3%BEl%C2%BB%C2%84%C3%81%C3%8C%C3%9E*%C2%B9%C3%BC%C3%9A%C2%93%C3%88%C2%9D%1C%C3%A0%05%01%12%C3%A0%3F%C3%A6%C3%BD%22%5C%C2%93l0%02%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%96IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%10%04%C3%87%22%05%C2%B8%C2%96%C2%AB%20-%C2%A8%1F%3D%C2%AF%1F%C2%B7%C2%A0%C3%8E%C2%9CO%14BB%04%C3%B6%C2%81%C3%97%C3%84%C2%9A%C2%A7t0%C3%92r%C3%ACdf3%C2%B0%00w%C2%8E%C2%A3%029%09%C3%84%3C%7DK%12%C2%88_%0FH%221%00!%C2%B9%C2%BB%C3%AB%C3%A4Q%C2%A4%C3%B2%5B%C3%AF%C3%B2W%C2%AC%C2%A5%C2%94%C3%90l%C3%A3%C2%BA%C2%B1%0F%C2%B9%C2%84%C3%AE%C2%B6%C3%B7652%C3%9B%C2%90%C3%BE%7C2%C2%B3%C3%B5%C3%BD%20Z%C2%99%3D%3E%C3%93%C3%B9%C2%92o%C3%81%C3%9Dw%C3%85%C3%9D8%C3%AF%C3%82%C2%8Dz%1D%C3%B2%C2%BF%C2%92_%C2%B7%5E%C3%8F%C3%95%C3%ADG%22%C2%8F%C2%BD%C2%8A%C3%9C5%01Y%C3%B0%C2%80%0A%C3%A4%07%C2%BF%C3%B1\'%04%18%C3%94%C3%8A%60%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A2IDATH%C2%89%C3%AD%C2%94%C3%81%0D%C3%83%20%10%04%C3%87(%05%C2%A4%C2%96%C2%AB%20-%C3%90%0FO%C3%BAq%0Bt%C2%96%7C%C2%A2%C2%88%C2%87m%2C0%C3%9E%C3%88f%0B%C2%B8Y%C3%AE%C2%96%C2%9D%C3%8C%C3%AC%09%C3%8C%C3%80%C2%8B%C3%B3%C2%94%00%C3%AF%04%60%C2%BE%C2%BC%C3%99%09%C3%80%3F%03N%04%06%C3%A04x%C2%8CQ%07_%C3%92%C2%A3u%C3%80%C3%92%C2%8Br%C2%85%10%C3%AA%C3%A1k%C3%83%C2%B7%C2%86%C3%AE%C3%95%3D%027%C3%A0%C2%B9%C2%8A%C2%81%3B%22X%C3%95%C3%B0%C2%92Z%C3%8C%C3%BD%C3%9F%C3%9AK%C3%85%C3%91%15%C3%9E%C3%A3%C3%8E%C3%97%C3%ABv%C3%98%3ESS%C2%B7%C2%AF%0D%1F%C3%9D%3E%C3%A05%C3%9A%15%C2%B8%5E%C3%BD~%C3%88W%C2%AB5\'%5D%C3%BBdfo%15%5C%C2%9E%C3%B6%24b\'%07x%C2%81%C2%81%04%C3%B8%0F%2Bq%22t%C2%BB%C3%9FP%C2%8D%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9AIDATH%C2%89%C3%AD%C2%96%C2%BB%0D%C3%830%0CD%C2%9F%04%0F%C3%A0Y8AV%C3%90%3E*%C2%B5%C2%8FW%C3%90fI%13%04%08%C3%A0%0F%C2%A1%C3%84%3E%01%C3%B2%C2%B5*%C3%9EQ%3C%12%0Cf6%03%0B%C3%B0%C3%A0%3AU%20E%01%C2%987o%C2%89%02%C3%B0%C3%87%40%14%C2%81%01%C3%A8%0B%5EJ%C3%91%C3%81%C2%AF%C2%94%14%3E%C3%AD%3Dn%C2%B5%20%C3%A7%7C%3E%C3%9C%C2%AB5%C2%93%1E%C2%83%C3%A3%C3%B6%7C%5C%C3%B8n%C3%A0%C2%BC%C2%A9nM%7F%C2%BF%C2%95%1F%C2%AD%C3%9A_%C3%A7%C2%BD%C3%9F%C3%8A%C2%BDj%C3%9D%C2%84%C3%A3%C2%8E%C3%9A%0D%C2%97%C3%A8%C3%9Ep_%3A%C3%A3%C2%88%5C%C3%BB%C2%9D%60f%C3%8F%C2%BF%C2%93%C2%9C%C2%92%C2%A7%C2%BD%C2%8A%C3%985%02I%60%C2%A0%02%C3%A9%05r%01%20%C3%A2%C2%A1g%C3%97%C2%B2%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%96%C3%81%0D%C3%83%20%10%04%07%C3%A4%02R%C3%8BU%C3%A0%16%C3%A8%C2%87\'%C3%BD%C2%B8%05%3A%C2%8B%3F%C2%96%15%C3%85%09%12%C2%B1%C3%83%C3%9A%C3%82%C3%BB%04%C2%A4Y%C2%8E%C2%BD%13%C3%8E%C3%8C%1E%C3%80%04%C2%8C%C2%B4S%06%C2%82%17%C2%80Yx%C2%93%17%C2%80W%03%5E%04%06%C3%A0%C2%BA%C3%B0%C2%94%C2%92%0E%C2%BEWR%C3%B8P%C3%9A%C3%BCT%C3%96%18c%1Bx%C2%ADj%C3%8D%C3%B6%C3%BB%C3%A6%C3%BD%C3%82%C2%8B%C2%81%C2%ABMv%C3%AD%C3%B9s%C3%9E%C2%BC4%3A%C2%8F%C3%AA%C3%B5%C3%83%C3%BA%C3%BC%17%C2%B3%C3%BD%C2%A6%C3%BD%C2%86%C3%B7%07%C3%BF%C3%9Aj%C3%BF%C2%9En%20%C2%BE%C2%B93%C2%B3%C3%A7%C3%AB%C3%82%C3%9EOaI%C3%AF%C3%95%C3%99%C3%80%5BJ%C2%9E%C3%B6%2Cbg%0F%04%C2%81%C2%81%0C%C2%84%19Y%10%22t%C3%8E%C3%B6%C2%96p%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9EIDATH%C2%89%C3%AD%C2%94%C3%81%11%C2%84%20%0CE%C2%9F%C3%8C%16%60-%C2%A9%C3%80%16%C3%A8%C2%87%23%C3%BD%C3%98%02%C2%9D%C2%B9%17%C3%B5%C3%84%02%C2%A3%C2%8E%C2%9F%19%C3%B6%15%C2%90%C2%97%C3%80O%263%C2%9B%C2%81%15Xx%C2%8F%04x\'%10%C2%B3%C3%BBV\'%10%C2%9F%0D8%C2%91%18%C2%801%C3%A41F%C2%9D%3C%C2%87T%C3%BEy%C2%AAP%C3%AEY%01B%08%C3%B7%C3%A4%C2%B9%C3%82%C2%A5%C2%A2%C2%AD%C2%8C%C3%BB%C3%A7%C3%A3%C3%8A%C2%9B%02%C3%97%12%C2%AE%2B%01%C3%AC%7F%C3%B2%12%C2%BF%C3%B6%C3%BB%C2%A0%C3%B4%22%7DO~%C3%A5r%C2%B52%C3%AE%C2%AA%C3%BD%C3%A5%12%C2%AAi%C2%AF%C2%A5%C3%BAN%C3%AA%C3%BB%C2%9B%C2%BCv%C2%B5%C2%9Eb2%C2%B3%C3%AD%15S%06y%C3%9A%C2%93%C3%88%C2%9D%1C%C3%A0%05%0D%24%C3%80%7F%01%C3%82%09%1Fn%12%7FS%5B%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%94IDATH%C2%89%C3%AD%C2%94%C3%8B%0D%C2%80%20%10%05Gb%01%C3%96%C2%B2%15%C3%98%02%C3%BDp%C2%A4%1F%5B%C2%A03%C2%BD%C2%A8%07%12%10%0D%C2%B8%262%C3%A7%0D%C3%B3%C3%88~%06%11%C2%99%C2%80%05%C2%98y%C2%8F%00X%C2%A3%20f%C3%B7-FA%7C%060Jb%00%C2%B2r%C3%AF%7D%C3%91%23%C2%A5u%C2%B7%C3%A4%C2%AD%19%C2%AF%0A%C3%A2_9%C3%A7%C3%9E%C2%93%C2%97%C3%B2%24%C3%A4w%07%C2%AE%C3%8B%5BQm%C3%A0%C2%9El%C3%81%C2%A5%C2%BC%C3%A6j%C3%85%C3%B4%C2%9E\'I%C3%9D%C3%AD%1A%C3%ADhv%C3%A1%0Er!%C3%BF%C3%9B%C3%B3.%C3%BF%C2%9F%C2%BC%C3%9Fv%15%06%11Y%C2%B5%C3%A4%C3%AA%C3%93%1E%C2%94%C3%9C%C3%81%00V!%40%00%C3%AC%061%1E%1FpCe%20%C3%9F%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A6IDATH%C2%89%C3%AD%C2%94%C3%81%09%C3%830%0CE_L%07%C3%A8%2C%C2%9A%C2%A0%2Bx%1F%1F%C2%B5OV%C3%B0f%C3%89%C2%A5)%C2%A6%14%C2%A2%1A%25%22%C3%84%C3%BFd%C2%83%C3%90%C2%93%C2%AD%2FM%22%C3%B2%04f%C3%A0%C3%85y%C2%AA%40N%01%60%C3%9E%C2%BC9%05%C2%80%3F%05%C2%A4%200%00f%C2%B8%C2%AA%C2%BA%C3%86%C3%BD%05%3FB%C2%8F%C2%BD%C2%80%C3%B6%25%C3%9B%C2%B9%C2%94r%0E%C3%9C%C2%AA%C2%9E%22%C2%AFa%C2%B8%01%C3%B7%C2%94%C2%9B%C3%A16s%C2%A9%C2%AAy%1Av%C3%A1%3DI%C2%AD%1A%3D%C3%BF%C2%A9%C3%AF%3D%C3%9D%C3%9E%3DZ%C3%A0b%C2%B8%C3%9E%22%C3%AF%C3%9B%C3%B3%01%C2%BF%1F%C3%9Ce%C3%94%C3%9Aqr%C3%9B%C3%AD%C2%BDI%C2%AD%0A%C3%BD%C3%B6ID%C2%96(x%C2%B8%C3%9Bk%10%C2%BB%26%20%07%14P%C2%81%C2%BC%02%C2%B071%C2%A0%C3%81%C3%85HD%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9FIDATH%C2%89%C3%AD%C2%94%C3%91%0D%C2%830%0CD%1F%11%03t%16O%C3%90%15%C2%B2O%3E%C2%B3%0F%2Bd3%C3%BAS%C2%90Z!%C3%95%C2%84%C3%80%C2%A9%22%C3%B7%17)%C3%B2%3B%C3%87%17%0Ff%C3%B6%00%26%C3%A0%C3%89u*%40%0C%020o%C3%9E%14%04%C3%A0%C3%95%40%10%C2%81%01%C2%A8%C2%82%C3%A7%C2%9C%C2%9B%C3%9C%C2%93v%3Ez.y%3B%3D%05%C3%AE%C3%95%5E%C2%93%C3%BF%17%C2%B8%0E%3F%C2%AA%C2%A6%C2%81K)%7D%C2%9C%7F%05%C3%90%05%C3%9F%5B%C3%94%C2%AB%3E%C3%B3M%C2%9D%C2%B5%C3%99%5Cp%C2%AFjM%C3%9Ew%C3%A6%1D~%3Fx%C2%93%C2%AF%C3%B6%C2%BD~%17%1D%C3%9A%C3%AD%C2%B5E%C2%BD%C2%92%3E%C3%BB%60f%C2%B3%0A.O%7B%11%C2%B1K%00%C2%A2%C3%80%40%01%C3%A2%0B6%10%1F%C3%90%C2%A1v%C2%9A%C3%9A%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%9AIDATH%C2%89%C3%AD%C2%94%C3%81%0D%C2%84%20%10E%C2%9F%C3%84%02%C2%ACe*%C3%98%16%C3%A8%C2%87%23%C3%BD%C3%98%02%C2%9D%C2%B9%C2%97%C3%95(%01t%C3%97%C2%ACC%02%C3%AF%06%C2%99%C3%B8%C2%86%C3%8Cw%06%11%C2%99%C2%80%19x%C3%B1%1C%01%C2%B0FA%C3%8C%C3%877%1B%05%C3%B1%C3%96%C2%80Q%12%03%C3%90%C3%A5*%C2%8C%C3%B1%C2%85%C3%B7%C3%BEo2%C3%A7%C3%9C%C3%A1%3C%C2%88%C3%88%C2%92*%C2%BC%C3%92%C3%84%C3%BEc%C2%A5%C3%BAX%C2%BA%C3%92%C3%AE%C3%8C%C3%AB%0A%C3%9C%C2%AF%C3%A4%C3%A6ZB%C3%B5%C3%A5%C3%99%C2%B4%3FA%0F%C3%9CF%15%1B%C3%AE%C2%AC%C2%91T%C2%BAS%C3%B5%C2%A5%C2%BF%C2%A0%C3%9D%C2%99%C3%97%15%C2%B8%3B%7C%C2%BB%C3%A5%C3%BA%C2%86%C3%AB%C3%B2%C2%B6%C3%A4A%C3%89%1D%0C%60%15%1A%08%C2%80%7D%03%C3%B2*%24%24%C3%B3%C3%91f%C2%A2%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%A2IDATH%C2%89%C3%AD%C2%94%C3%81%0D%C3%83%20%10%04%C3%87%C3%88%05%C2%A4%C2%96%C2%AB%20-%C3%90%0FO%C3%BAq%0Bt%C2%96%7C%C2%A2%C3%88%C2%8A%C3%81%C3%89!%C3%82%C3%89%C3%92%C3%AD%13%04%C2%B3Z%C2%96%5BD%C3%A4%06l%C3%80%C2%9Dy*%40%0C%06%60%5E%C2%BC-%18%C2%80%C3%9F%06%C2%82%11%18%00%C2%87%C2%9Bhmm%C3%A4%C2%9C%C2%BF%1EN)%C3%BD%07%C2%AE%C3%95%C2%99%C3%99%C2%96I%C3%93%C3%98%17%11y%C3%AC%17~%C2%89%C2%BBW%C2%9F%09%1C%C3%A0%1A%13%C3%BB%C3%8B.%17%C3%BB%C2%B0%C3%82%C3%B54%C2%BF%19%C3%BB%0C%C3%B9%C2%84%C2%AB%C2%AA%C2%A7%C3%81%C3%83%C3%A0Z%C3%95%C3%8C%C2%9E%C2%99%C3%B4%09W%C2%95%C3%B6%C3%8D%2F%15%C3%BB%C3%90%C3%82i%7F%C2%80O8%C2%87O%C2%87%17%23v%09%4040P%C2%80%C3%B8%04%C2%A1%C2%AC3P%07%C3%902%C3%AA%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C2%91IDATH%C2%89%C3%AD%C2%94%C3%89%0D%C2%80%20%10%00Gb%01%C3%96%C2%B2%15%C3%98%02%C3%BD%C3%B0%C2%A4%1F%5B%C2%A03%C3%BD%18cTP4qM%C3%96yB%C3%88%C3%ACI%23%22%1D0%00%3D%C3%AF%C2%91%00%C3%AF%14%C3%84%C3%8C%C2%BE%C3%81)%C2%88%C2%97%00%C2%9C%C2%92%18%C2%80_%C2%AEB%C2%9B%C2%BB%C2%881%C2%9E%3E%0E!%3C%C2%92%7F3%C3%B3ZJ%C2%95%C3%8AU%C3%88%C3%AE%C3%80%C2%A9%C3%8A%1B%11%19%C3%97%07W%C2%A6%C3%BC.%C3%9B%C3%9E%C3%AF%C3%A4ob%C2%B7%C3%A7%C3%85%3D%C2%BF%C2%B3%C2%BB5%7C7%C3%B3Z%C2%8E*U%C2%AA%C2%90%C3%9D%C2%81%C3%BB%7F8%15%C3%AC%C3%B6%C3%9C%C2%B6%3C)%C2%B9%C2%93%03%C2%BCB%00%09%C3%B0%13%C2%AB%C2%BA!%3C%C3%81%C2%A6%5E%C3%8E%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        rollover: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%93IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10%00\'a%C3%B1%C2%90%C2%83%C3%B4I%C3%B9%C2%82%C2%BE%C3%86\'%C3%B8%C2%9B%7C%C3%81W%C3%A5%10%05%7B(iAb%C2%95B%C2%A2%C2%90%C3%8EI%C2%92%C2%85%C3%89%C2%AE%C3%AEbT%C3%9F%C3%B7%0F%C3%80%01%C2%96rL%40\'%C2%80%5B%C2%96%C3%85z%C3%AF%09!d%C2%B76M%C2%831%C3%86%C2%8A%C2%88%C3%93%4011%40%08%01%C3%AF%3D%C2%80%C3%95q%C2%A1%24%C3%B3%3C%03%20%C3%9B%C2%8Da%18%C2%B2%08%C3%87q%7C%3F%C2%AF%C3%AB%C2%9A%C2%96o%03s%C2%A2%C2%8BXvHf%1E9z%05%C2%B1B%7BqG%15%C2%BC4%C3%B3%C2%BF%C2%BC%3E%C3%B9%C3%97%C2%AF%C3%BD%2C%C2%BF%C3%8E%C2%85%C3%BBf%C2%9E%7B%C3%92%C3%9D7%C3%B3%C2%B3%C2%93%2B%15w%C2%A6j%C3%B5%C2%B6Z%C2%BD%C3%B2K%C2%87L%C2%BD%7D~%2Fy%C2%A9%C2%9F%C3%87%C2%A4%C2%BC%24%1A%5EW%C2%98%C2%92D%C2%9F%06%26cL%C2%91%03(%C2%A5%C3%A2%5D%0D%60%12%C2%A0%13%11%C3%97%C2%B6%C2%AD%C3%8Dn%C3%BF0%01%C3%9D%13%C2%84\'%40P%01z%C3%8FN%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9CIDATH%C2%89%C3%AD%C2%97%C3%81%09%C2%840%10%00GY%C3%B2%C3%88C%C2%AE%C2%A4%C2%B4%C2%A0%C3%95%C2%A4%04%C2%BB%C2%B1%05%C2%AB%C3%8A%23%0A%C3%9E%2B%1Cx*%C3%A64%C3%B1%40%C3%A7iV%26%C2%BB%C3%AB.X4M%C3%B3%02%3A%C3%80%C2%90%C2%8F%1E%C2%A8%05%C3%A8%C3%86q4%C3%8E9%C2%BC%C3%B7%C3%89%C2%ADJ)%C2%B4%C3%96FD%C2%BA%12%C3%88%26%06%C3%B0%C3%9E%C3%A3%C2%9C%030ex%C2%90%C2%93a%18%00%C2%90%C3%B9%C2%81%C2%B56%C2%99%C2%B4m%5B%00%C2%A6iZ%C2%96%C2%87%C2%80%3DXk%C2%A3%C3%A2%C3%A7%C2%94%3F%C2%BFy%02_%C2%99%07%C2%B6%C3%8A%C2%BF%C2%94ml%3C%5C%C2%9C%C3%B9%23%7F%C3%A4YY%1D%C2%B5X~Y6%C2%AB%C3%B2%23%C2%9Bk%2F%C3%BF%5B%C3%B6%C2%A5%C2%AD%C2%B5U%C2%91%C3%98%C3%B8%C3%BB~%C3%AD%C3%B7%C2%95%C2%9F6%C3%A7%10%3F%C2%9E%C2%9B%C3%B2%C3%94%C2%B3~%C3%9F%C2%9E%1F%C2%92%1Fm%C3%8B%C3%B5%C2%99%2B%C2%A5%C2%B2J%C2%83%C2%AF%04z%C2%ADu%C2%96%0B%14E%11%C3%BE%C3%95%00z%01j%11%C3%A9%C2%AA%C2%AA2%C3%89%C3%AD%1Fz%C2%A0~%03%C2%AF1CP7ut%3D%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9CIDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E%C2%9F2d%C2%91%C2%85%C3%B4H%C2%B9%C2%82%C2%9E%C3%86%23x%C2%9B%5C%C3%81Se%11%05%C2%BB%0A-%25%C3%96%C2%B6%C2%9A(%C2%A4o%C2%A9%C3%82%C3%8B%C2%9F%C3%89%0CXu%5Dw%03%2C%60%C3%88%C3%87%08%C2%B4%02%C3%98y%C2%9E%C2%8Ds%0E%C3%AF%7Dr%C2%ABR%0A%C2%AD%C2%B5%11%11%5B%03%C3%99%C3%84%00%C3%9E%7B%C2%9Cs%00%C2%A6%0E%0Fr2M%13%00%12%7B%C3%99%C3%B7%7D%12%C3%A90%0C%00%2C%C3%8B%C2%B2.%0F%1F%1DI%2CP%7D%C2%B8%C3%A5%0B%C2%A2%C3%89%C2%9FYkA%C2%A8%C3%8EV%C2%8B%C3%9EU%C3%B1%C3%94%C3%A4%7Fyy%C3%B2%C3%8D%C3%9B%C2%9Eb%C3%A6%03%C3%97N%C2%BE%C3%85%C2%9E%C3%8A%5C%3Fyl%C2%8B%C2%BD%26%C3%9E%C3%9A%C2%841%C3%8A%1D%C2%B5r%C3%A5%1F%5D%C2%B8T%C2%8Bf%C3%B7%C2%9C%07~9%60%C2%B9%3D%C3%8F%26%C2%8F%C2%B5%C3%A5%C3%BC%C3%A4J%C2%A9%C2%AC%C3%92%C3%A0%C2%AB%C2%81Qk%C2%9D%C3%A5%00UU%C2%85%7F5%C2%80Q%C2%80VDl%C3%934%26%C2%B9%C3%BD%C3%81%08%C2%B4w%C3%BA%C3%B7A%C2%B8%08%C2%8C%C2%8C%C3%8C%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10E%1Ff%C3%82%C2%82%C2%85%C3%A9%C2%91%C2%B8%C2%82%C2%9E%C3%86%23x%1B%C2%AE%C3%A0%C2%A9X%C2%A0%C2%89%5D%C3%916%C2%ADU%C3%93%0A%C2%9A%C3%A8%5B%C3%82%C3%A2M~%C2%86%C2%9F%C2%A0%C3%AA%C2%BA%C2%BE%01%0E%C2%B0%C3%A4%C2%A3%03*%01%C3%9C0%0C%C3%96%7BO%08!%C2%B9Uk%C2%8D1%C3%86%C2%8A%C2%88%2B%C2%80lb%C2%80%10%02%C3%9E%7B%00%5B%C3%84%C2%83%C2%9C%C3%B4%7D%0F%40%C3%B1~%C3%914Mr%C3%B98%C2%8E%C3%93%C3%B2%C2%9C%C3%88%C3%9C%C3%A5R%0Am%C3%9B%C2%A6%C2%93%C2%AF%C3%A5%C3%9B%C2%90K%C3%83%C3%AD%1A%C3%BB%25%C3%9F%C2%85M%16%C3%AE%C3%97%C2%AD%C2%9F%C2%95%C3%BF%C3%BB%C2%94%C2%968%5E%C3%AC)*v*%C3%85Iy%C3%AA%C2%B8%23%C3%87%C2%8B%3D2%17%C3%BF%16%C3%A9%24%C3%AB%C3%B65%C3%83%C2%9D%C2%B7%C3%A1%C3%8E%2B%C2%BF%C2%BA%7D%17%3E%C3%A4%C2%B9%C2%AA%C3%B5!%C3%97Zg%13%C2%BE%C3%BA%0A%C2%A03%C3%86d%19%40)%15%C3%BFj%00%C2%9D%00%C2%95%C2%88%C2%B8%C2%B2%2Cmr%C3%BB%C2%93%0E%C2%A8%C3%AE%C3%8C%24A%C2%BC%C3%B0r%C3%97b%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%8FIDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10E%1Ff%C3%82%C2%82%C2%85%C3%A9%C2%91%C2%B8%C2%82%C2%9E%C2%86%23x%1B%C2%AF%C3%80%C2%A9X%C2%A0%C2%89%5D%C3%916mj%C2%A2D%C2%B4%C3%95%C2%B7%C2%84%C2%81%07%3Fd%12T%C3%9B%C2%B67%C2%A0%07%2C%C3%A5%C3%B0%40%23%40%3F%C2%8E%C2%A3%0D!%10c%C3%9C%C3%9C%C2%AA%C2%B5%C3%86%18cE%C2%A4%C2%AF%C2%80bb%C2%80%18%23!%04%00%5B%C2%A5%C2%81%C2%92%0C%C3%83%00%40%C2%95%C2%B3%C2%89sn%C3%95%C2%BAi%C2%9A%C3%B2%C3%A5%C2%B9%C3%AC*%C2%97%C2%B9%C3%89o%C2%B1v%5D%C2%97U%C2%9B8o%C3%AC%C2%97%7C%17f_%C3%BB%C3%9CK%C3%8D%C2%A9M%1C%C3%AB%C3%A6K%5B%C3%A6%C2%92%C3%BA%C3%B7t%3E%C3%A4K%C3%A2s%C3%8E%C2%AD%C2%8A%3Bq%C2%AC%C3%98_%C2%B9%C3%9A%C3%AB%25%C3%BF%2B%C3%B9y%C3%9B%C3%AB%C3%AF%C3%8AsZ%C3%ABC%C2%AE%C2%B5%C3%8E%C3%9Ad)%C3%89W%01%C3%9E%18S%C3%A4%00J%C2%A9%C3%B4W%03%C3%B0%024%22%C3%92%C3%97um7%C2%B7%3F%C3%B1%40s%07%C3%93YF%1C%C3%ABg%0E%7F%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9CIDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%10%40%C2%9F%C2%AD%13%C2%85%0B%C2%94%C2%91%C2%BC%02L%C3%83%08l%C3%A3%15%C2%98%C3%8A%C2%85A%22ED%C2%92%C2%82_%00%1B%C2%A4%C3%B0*Dq%C3%AF%7Cw%3E%C3%89%C2%AA%2C%C3%8B%07%C3%A0%00K%3A%1A%C2%A0%10%C3%80u%5Dg%C2%BD%C3%B7%C2%84%10%C2%A2%5B%C2%B3%2C%C3%83%18cE%C3%84i%20%C2%99%18%20%C2%84%C2%80%C3%B7%1E%C3%80%C3%AA%C3%A1GJ%C3%9A%C2%B6%05%40%C2%A7%12VU%C3%B5%C3%BE%C3%AE%C3%BB%3E%C2%AD%7C%0C%C3%99%1B%C3%A0%C3%BBDc%C3%94u%C2%BD%5D%3E%15%7C.%C3%A8ZN-%C3%BB-%3F%C2%85%C3%85%C2%81%3Bb%C2%B06%C3%8B%C2%97%C3%98%C2%93%C3%9C%C3%B5%C3%8A%C2%BE%C2%B48%C2%A2%C3%8Ac%C3%B4y%C3%AC%40%C3%97%2B%C3%BB%C2%AF%C3%8C%C2%B5i%C3%97n%C2%9F%0A~%C3%AF%C3%B6%5B%C2%BE%C2%85U%03%17k%C2%BF%1Fr%C3%95%C2%B6%26%C3%B7%1F%3D%1F%C2%AB%C2%8E%C2%86%C3%97%13%26%25%C2%83O%03%C2%8D1%26I%02J%C2%A9%C3%A1%C2%AD%06%C3%90%08P%C2%88%C2%88%C3%8B%C3%B3%C3%9CF%C2%B7%7Fh%C2%80%C3%A2%09%C2%8COA%C2%8C%C3%A3P%C2%AA%C3%A4%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%93IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10%00%07%C2%B2%C3%B1%C3%80%C3%81%C3%B4I%7CA_%C3%A3%13%C3%BC%0D_%C3%A0U%1C%C3%90%C3%84%1EZ%C3%934%C2%B5-%C2%B1%05Mt%C2%8Ep%C2%98%5Dv%C3%99%C2%80j%C3%9B%C3%B6%028%C3%80R%0E%0F4%02%C2%B8q%1Cm%08%C2%81%18cvkUU%18c%C2%AC%C2%888%0D%14%13%03%C3%84%18%09!%00X%3D%2F%C2%94d%18%06%00tQ%C3%AB%C2%9Di%C2%9A%C2%96%C3%A5%5D%C3%97%15%0Bb%C2%93%C3%8Cw!%C2%97O%C2%9B%C3%AFJ%C3%90%C3%B7%7D~y*KA%C2%A6%04x%C3%9C%C2%9A%1FW%C3%BE%C2%B1%C3%A1R%C2%BBzm%C3%B7%C3%AF7%C3%B3o%C2%A3%C3%B6%C3%97%C3%BB%C2%BE%C3%9F%C3%8CSY%3B%09%C2%8F%7B%C3%95N%C3%B9%26%C2%9C%13%C3%AE%C2%89%1C%C2%8F%C3%88%C2%A5%C3%93y%C2%91%C3%BF%C3%AB%C2%89%C2%94%C2%82%C2%86%C3%9B%17%C2%A6%24%C2%B3O%03%C3%9E%18S%24%00%C2%A5%C3%94%C3%BCW%03%C3%B0%024%22%C3%A2%C3%AA%C2%BA%C2%B6%C3%99%C3%AD%0F%3C%C3%90%5C%01Ei%40%20%C3%A0I%C3%9B%C2%88%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%97IDATH%C2%89%C3%AD%C2%97%C3%8B%0D%C3%83%20%0C%C2%86%3F%C2%90%C2%95%03%C2%87%C2%A8%23%C2%B1B2MF%C3%886%C2%AC%C3%80T%1CH%C2%A4%C3%B4%C3%90F%C2%95%C3%BAHE%1E4%12%C3%BD%C2%8F%60%C3%A9%C2%B3%C2%8Dm%19%C3%95%C2%B6%C3%AD%05p%C2%80%25%C2%9F%3C%C3%90%08%C3%A0%C3%86q%C2%B4!%04b%C2%8C%C2%87S%C2%AB%C2%AA%C3%82%18cE%C3%84i%20%1B%18%20%C3%86H%08%01%C3%80%C3%AA%C3%B9%20%C2%A7%C2%86a%00%40g%C2%A5%C3%9E5M%C3%93vx%C3%97u%C2%9B%C2%9C%C3%B8I%C3%A4%C2%A7%C2%80%C3%8B%C3%92%C3%A5%C2%BB%C2%B4%C3%B6%7D%C2%9F%07%C2%9E%C2%AATg%C3%8B%7D%C3%B3r%C3%A1%C2%8B%05%C2%97Z%C3%99%C2%A9%C3%B6%C3%A7%C2%8C%7Cit%C3%AE%C3%95%C3%AB%C2%BB%C3%B5%C3%B9%1Ag%C3%8B%C2%AD%C3%B6%3F%C2%BC%3C%C3%B8%C3%87V%3Bz%C2%BA%C3%81%C3%99%22O%5D%0AS%C3%AC%C2%9F%C2%B3%C3%B3%02%C3%9FsM%C3%BA%26%0D%C2%B7%2FLN%C3%8D%3C%0DxcL%16%07%C2%94R%C3%B3_%0D%C3%80%0B%C3%90%C2%88%C2%88%C2%AB%C3%AB%C3%9A%1EN%7F%C3%88%03%C3%8D%15r%C2%B7A%C2%88%C2%85)%C2%BA%C2%A8%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%99IDATH%C2%89%C3%AD%C2%97M%0E%C2%83%20%10F%1Fd%C3%A2%C2%82%C2%85%C3%A9%C2%91%C2%B8%C2%82%C2%9E%C3%86%23x%1B%C2%AF%C3%A0%C2%A9X%C2%A0%C2%89%5D%C2%B4%C2%A4%C2%8BZ%25%C3%BE%20%C2%89%7DK%16%C3%B3%18%C3%B8%C2%98%04U%C3%97%C3%B5%03%C3%A8%00K%3Az%C2%A0%12%C2%A0%1B%C3%87%C3%91%3A%C3%A7%C3%B0%C3%9E%C2%9Fn-%C2%8A%02c%C2%8C%15%C2%91N%03%C3%89%C3%84%00%C3%9E%7B%C2%9Cs%00V%C2%87%C2%85%C2%94%0C%C3%83%00%C2%80Nj%7D3MSZy%C3%934_k%C2%97t%C2%9E%C2%85%5C%C2%8E*4w%C2%AC%00m%C3%9B%C3%AE%C2%93%C3%8F%15%5E*%1A%C3%8B%7D%C3%AF%C3%BC%C2%BE%C3%B2%C2%A8%C3%80%C3%85%C2%84kK%00%C3%B3%C3%AF%7C%C2%89_%C3%AF%3B%C2%B0t%22yw%C2%BEer%C3%85r%C3%9F%C2%A7%C3%B6%C2%97_%C3%82j%C3%9A%C3%97R%C2%BD\'%C3%B5%C3%B9u%C2%BE6%C2%B5N%C2%95%1F1%40b%C3%90%C3%B0%C3%BA%C3%82%C2%A4%24%C3%B84%C3%90%1Bc%C2%92l%40)%15%C3%BEj%00%C2%BD%00%C2%95%C2%88teY%C3%9A%C3%93%C3%AD%1Fz%C2%A0z%02P%C3%85%3E%C2%88%C3%B9%40%40X%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%94IDATH%C2%89%C3%AD%C2%97%3B%0A%C2%840%10%40_dH%C2%91B%C2%B6%C3%B0%40%C2%B9%C2%829%C2%8DG%C3%B06%5E%C3%81%03Y%C2%A7%C2%88%C2%82%5B%2CaA%C3%B0%C2%83%C2%98X%C3%A8%2B%C3%83%C2%907%C3%89d%06%C2%A2%C2%9Cs%1F%C2%A0%03%2C%C3%B9%C3%A8%C2%81Z%C2%80n%C2%9A%26%C3%AB%C2%BD\'%C2%84%C2%90%C3%9C%C2%AA%C2%B5%C3%86%18cE%C2%A4%2B%C2%80lb%C2%80%10%02%C3%9E%7B%00%5B%C3%84%C2%85%C2%9C%C2%8C%C3%A3%08%40%C2%B1%15%C3%944%C3%8D%C2%A1%C3%8D%C2%8E%C3%86E%C3%A6y%C3%9E%C2%97%C2%A7F%C3%B6%02%C2%96%C2%A7j%C3%9B6%C2%9F%C3%BC(g%C2%92%C2%BC%C3%B5%C3%9A_%C3%B9-%5C%C3%B6%C3%A0%C3%8Et%C3%81%C2%AE%C3%BC%C3%8A%C3%96Z%C3%B2%C3%96%7C%C2%95%C2%B5%C2%B9%7DE9%C2%92M%C2%B8%C3%88V%C2%92%C3%8F%C2%AD%C3%B9%2B%7F%C2%9E%C3%BC%C2%9D%C3%AD%C2%B7%C2%A0%C2%9Cs%C3%B30%0C%C3%99%C3%85UU%C3%BDN%C2%AE%C2%B5%C3%8E*%C2%8E%C2%BE%02%C3%A8%C2%8D1Y%12PJ%C3%85%C2%BF%1A%40%2F%40-%22%5DY%C2%966%C2%B9%C3%BDO%0F%C3%94_%C3%89%02A%C3%A4%01%C2%A2K%C2%BE%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A5IDATH%C2%89%C3%AD%C2%971%C2%AE%C2%84%20%10%40%1FfBAa%C2%B6%C3%B0%40%5CAN%C3%83%11%C2%BC%C2%8DW%C3%B0%40%C3%96%14h%C3%A2%16%1B%C2%B2%C3%A6%C3%A7\'%C3%8B%1A%C3%84b%7D%C2%95%1A%C3%A4%0D%C3%8C%0C%09%C3%8A9%C3%B7%00F%C3%80R%C2%8F%09%C3%A8%05%18%C3%97u%C2%B5!%04b%C2%8C%C2%A7%5B%C2%B5%C3%96%18c%C2%AC%C2%88%C2%8C%0DPM%0C%10c%24%C2%84%00%60%C2%9B%C3%B4%C2%A1%26%C3%8B%C2%B2%00%C3%90%C3%A4%C3%BE%C3%A0%C2%BD%2F6n%C3%9B%C2%B6%C3%AF%C3%A4g%20%C2%9F%06%C3%ACW%C2%92%C2%9E%C2%87a%C2%A8%23%C3%8F%C3%A5H%C2%90%C2%97n%C3%BB-%C2%BF%C2%84b%05%C2%97%C2%8A%C3%8B%7B%C2%9F%C3%9D%0D%1F%C3%A5G%26%C3%8D%C3%A5%C3%8E%C3%B9%C2%BF%C3%BC%3D%C2%A7%C3%B7%C3%AF%25RP%C2%A4%C3%A0%C2%8E%06%C3%B9%C2%BB9%C2%BF%C3%A5%C2%BF\'%2F%C3%92j%C3%BBv*v%C2%B6%1F%C2%9D4%C2%97K%C2%B7%5D9%C3%A7%C2%B6y%C2%9E%C2%AB%C2%8B%C2%BB%C2%AE%7B%C2%AD%5Ck%5DU%C2%9C%7C%0D0%19c%C2%AA%04%C2%A0%C2%94Jw5%C2%80I%C2%80%5ED%C3%86%C2%B6m%C3%AD%C3%A9%C3%B67%13%C3%90%3F%01%11%C3%A7S%C2%84%C3%90%C3%87%C3%8F%C2%A0%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%3B%0E%C2%84%20%10%40%1FfBAa%C2%B6%C3%B0%40%5CAN%C3%A3%11%C2%BC%C2%8DW%C3%B0%40%C3%96%14h%C3%A2%16%1B%C2%B3%C3%99%C3%8D%26%C2%8B%C2%A8X%C3%A8%C3%AB%20%C3%80%C2%9B%C3%A13%09%C3%8A9%C3%B7%00%3A%C3%80%C2%92%C2%8F%1E%C2%A8%05%C3%A8%C2%A6i%C2%B2%C3%9E%7BB%08%C2%87%5B%C2%B5%C3%96%18c%C2%AC%C2%88t%05%C2%90M%0C%10B%C3%80%7B%0F%60%C2%8B%C2%A5%23\'%C3%A38%02P%C2%A4Ln%C2%9Af%C3%93%C2%B8y%C2%9E%C3%93%C3%A5%7B!1%C2%83b3%3DD%1E%C3%8B%C3%9A%20O%C3%9D%C3%B6%5B~%0A%C2%BB%5E%C2%B8%C2%B6m%3F%C3%9A%C3%BF.%60%C2%94%7C%C3%AD%C2%A2%C2%B1%C3%9Cg%C3%BE%C2%93%C2%A3*%5B%C2%94%3C%C2%96%C3%94%20%C2%AF%7B%C3%A6%C2%B7%C3%BCz%C3%B2%5D%C2%9E%C3%9Aw%C3%B9%5D%C3%98T%C3%9BS%17%C2%8D%C3%A5%C3%94mW%C3%8E%C2%B9y%18%C2%86%C3%AC%C3%A2%C2%AA%C2%AA%5E%C2%99k%C2%AD%C2%B3%C2%8A%17_%01%C3%B4%C3%86%C2%98%2C%01(%C2%A5%C2%96%C2%BF%1A%40%2F%40-%22%5DY%C2%96%C3%B6p%C3%BB%C2%9B%1E%C2%A8%C2%9F%5D%7CA%24%C3%9B%05%5BM%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C3%82%C2%90E%16%C3%92%23%C3%A5%0Az%1A%C2%8F%C3%A0m%C2%BC%C2%82%C2%A7%C3%8A%22%0Av%C3%93%C2%B4EZ%5B-%C2%89%01%C3%BB%C2%96a%C3%B0%C3%8D0%C2%9F%01U%C3%934%17%C2%A0%07%1C%C3%B9%18%C2%80Z%C2%80~%C2%9A%26%C3%A7%C2%BD\'%C2%84%C2%90%C3%9Cj%C2%8C%C3%81Z%C3%ABD%C2%A4%C3%97%4061%40%08%01%C3%AF%3D%C2%80%C3%93%C3%B1!\'%C3%A38%02%C2%A0%C2%B3Zo%C3%8C%C3%B3%7C%C2%9C%3Cr%C2%A8%5C%C2%96%0Fm%C3%9B%26%C2%93u%5D%C2%B7.%C2%8F%05%C3%9F4%C3%B1%C3%BC%C2%B1%C2%B5%C3%BA%C2%A54r%C3%9E%C2%9D%C2%97%15%C2%B8%C2%BD%C2%BC%C3%9B%C3%AB%1AeN%C2%BEg%C2%92%C2%AD%C3%BC%03w%C2%A7%C2%88%0B%C3%B7%C2%A9%C2%91W%C2%99xU%C2%BF%C2%96%C2%9D%C3%B3%C3%AE%C2%BC%C2%AC%C3%80%C3%BD%C3%82%C3%96%C3%9BP%C3%AE%C3%A4%C2%A9%C2%AF%C3%9Cy%03w%C2%BC%C3%9C%18%C2%93U%1A%7D%1A%18%C2%AC%C2%B5Y%1APJ%C3%85%7F5%C2%80A%C2%80ZD%C3%BA%C2%AA%C2%AA%5Cr%C3%BB%C2%83%01%C2%A8%C2%AFa)CP%C3%94%5C%C2%9D0%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B0IDATH%C2%89%C3%AD%C2%97A%C2%8E%C2%84%20%10E%1F%C2%A6%C3%82%C2%82%C2%85%C3%A9%C2%85%07%C3%A2%0Ar%1A%C2%8F%C3%A0m%C2%BC%C2%82%07r%C3%8D%02M%C2%9C%C3%8D0%C3%93I%C2%AB%C3%9D8%C2%8A%C3%A9L%C2%BF%25B%5E%C3%A5ST%C2%A2r%C3%8E%C3%9D%C2%80%0E%C2%B0%C3%A4%C2%A3%07j%01%C2%BAi%C2%9A%C2%AC%C3%B7%C2%9E%10%C3%82%C3%A9V%C2%AD5%C3%86%18%2B%22%5D%01d%13%03%C2%84%10%C3%B0%C3%9E%03%C3%98%22.%C3%A4d%1CG%00%C2%8A%C2%AC%C3%96o%C3%A6y%C2%BEN%1E%C2%B9T.k%1F%C2%9A%C2%A6yz%C2%B8m%C3%9Bs%C3%A4%C2%A9l%15%C2%BBV%C3%A4%C2%A5%C2%B1%2B%C3%A7%C3%9C%3C%0C%C3%83%C3%8F%C3%82%2Bq%C3%AF%C3%A5%3E%C2%81%C2%AA%C2%AA%1Ec%C2%8F%1BR%C3%AF%C3%BC%C3%ADb%3F%C2%AC%C3%A1%C3%B6t%C3%BE%C2%AA%C3%BC%C2%AF%C3%8F%C3%A8%15%3E%13n%C2%91%3D%1D%7C%C2%98%3C%C2%95%C2%A5b%C2%B7%C2%8A%C3%BCL%C2%B8%C3%85%0D%C2%A9w%C3%BEV%C2%B1%1F%C3%9Ap%C2%A9%2F%60S~%C3%B6%C2%94%C3%BB%C2%BF%13%C3%AEz%C2%B9%C3%96%3A%C2%AB4%C3%BA%0A%C2%A07%C3%86d)%40)%15%C3%BF%C3%95%00z%01j%11%C3%A9%C3%8A%C2%B2%C2%B4%C2%A7%C3%9B%7F%C3%A9%C2%81%C3%BA%0B%2F%5BY%3C%C3%AF0%10%C2%A3%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9DIDATH%C2%89%C3%AD%C2%97%C2%BB%0D%C2%830%14%00%C3%8F%C3%A8%C3%89%C2%85%0B%C2%94%C2%82%C2%81%C2%BC%02%C2%9E%C2%86%11%C3%98%C2%86%15%18%C2%88%C3%9A%C2%85A%22MH%22%05H%00a%C2%90%C3%88%C2%95%C3%BE%C3%A8%C3%AC%C3%B7%C2%B1d%C3%A5%C2%9C%C2%BB%01%15%60%C2%89G%0D%C3%A4%02T%5D%C3%97Y%C3%AF%3D!%C2%84%C3%9D%C2%ADZk%C2%8C1VD%C2%AA%04%C2%88%26%06%08!%C3%A0%C2%BD%07%C2%B0%C3%890%10%C2%93%C2%B6m%01H%C2%A2Z%1F%C3%B4%7D%7F%C2%9C%7C%C3%A0P%C2%B9LM%14E%C3%B1usY%C2%96%C2%9B%C3%A4%C3%A7%C2%BC%C3%B9R%C3%A6%225%15%C2%A1%C3%AB%16%C3%9C%C2%A1r%C3%A5%C2%9C%C3%AB%C2%9B%C2%A6y%0E%C3%BCR%C3%A5ky%C3%8F%7D%C2%96e%C2%9F%05%C2%B7%C2%B5%7D%C2%96p%C3%9D%C2%9C%C3%8F%C3%B6%C3%B9%C2%9A%C3%9E%5D%C3%82yo%C2%BE%C2%94%C2%B1H%C3%8DE%C3%A8%C2%BA%05%C3%B7%7F%C3%A1F%17%C3%AC%C3%8Dus~%C2%BC%5Ck%1DU%3A%C3%B8%12%C2%A06%C3%86D9%C2%80Rj%C3%B8%C2%AB%01%C3%94%02%C3%A4%22R%C2%A5ijw%C2%B7%C2%BF%C2%A8%C2%81%C3%BC%0E%C2%A8%C2%99F%C3%94(%C2%8A%C2%B5m%00%00%00%00IEND%C2%AEB%60%C2%82'
        },
        pressed: {
            topLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%96IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10%00%C2%A7A%C3%88%C3%81Ks%C3%B39%C3%B9%C2%82%C3%BE%C3%86%17%C3%B8%C2%9C%7C!%3F%C3%8A)%C2%88%17%C3%A9%C2%A1%C2%A4%05%C2%89%C2%AD%14%C2%B2%0A%C3%A9%C2%9C%24Y%C2%98%C3%AC%C3%AA.%C3%A66%0C%C3%83%1Dp%C2%80E%0E%0F%C3%B4%0D%C3%A0%C2%96e%C2%B1!%04b%C2%8C%C3%85%C2%ADm%C3%9Bb%C2%8C%C2%B1Zk%C2%A7%0011%40%C2%8C%C2%91%10%02%C2%80UiA%C2%92y%C2%9E%01h%C2%B6%1B%C3%934%15%11%C2%8E%C3%A3%C3%B8z%5E%C3%975%2F%C3%9F%06%C2%96D%C2%89Xv%C3%88f%C2%9E%C3%B8%C3%B6%0AR%C2%85%C3%B6%C3%A2%C2%BEU%C3%B0%C3%94%C3%8C%C3%BF%C3%B2%C3%BA%C3%A4%1F%C2%BF%C3%B6%C2%A3%C3%BC%3A%17%C2%AE%C2%9By%C3%A9Iw%C3%9D%C3%8C%C2%8FN%C2%AE%5C%C3%9C%C2%91%C2%AA%C3%95%C3%9Bj%C3%B5%C3%8AO%1D2%C3%B5%C3%B6%C3%B9%C2%B5%C3%A4R%3F%C2%8FY%C2%B9%24%0A%C2%9EW%18I%C2%92O%01%C3%9E%18%23r%00%C2%A5T%C2%BA%C2%AB%01%C3%B8%06%C3%A8%C2%B5%C3%96%C2%AE%C3%AB%3A%5B%C3%9C%C3%BE%C3%86%03%C3%BD%03%C2%A3w%3Fl%7C%1A*%C2%8B%00%00%00%00IEND%C2%AEB%60%C2%82',
            topCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97%3B%0A%C2%840%10%40%C3%9F%06!E%C2%9AM%C3%A7qr%05%C2%BD%C2%8D\'%C3%88q%C2%BCBn%C2%94*%C2%88%C2%8Dl%15%16%5C%15%C3%A3\'.%C3%A8%2B%C3%8D%C3%88%C3%8B%C3%8C8%03%C2%BE%C3%AA%C2%BA~%03-%60%C3%88%C2%87%03%C2%AA%02h%C3%BB%C2%BE7%C3%9E%7BB%08%C2%A7%5B%C2%95Rh%C2%AD%C2%8D%C2%94%C2%B2%15%4061%40%08%01%C3%AF%3D%C2%80%11%C3%B1AN%C2%BA%C2%AE%03%C2%A0%18%1FXkO%C2%936M%03%C3%800%0C%C3%93%C3%B2%18%C2%B0%06kmR%C3%BC%18%C2%B1%C3%B9%C3%8D%03%C3%B8%C3%89%3C%C2%B2T%C3%BE%C2%A9lS%C3%A3%C3%A1%C3%A2%C3%8C%1F%C3%B9%23%C3%8F%C3%8A%C3%AC%C2%A8%C2%A5%C2%B2e%C3%99%C3%8C%C3%8A%C3%B7l%C2%AE%C2%B5%C3%BCo%C3%99%C2%A7%C2%B6%C3%96RER%C3%A3%C3%AF%C3%BB%C2%B5%C3%9FW~%C3%98%C2%9CC%C3%BAx.%C3%8A%C3%8F%C2%9E%C3%B5%C3%BB%C3%B6%7C%C2%97%7Co%5B%C2%AE%C3%8F%5C)%C2%95U%1A%7D%02pZ%C3%AB%2C%17%10B%C3%84%7F5%00W%00%C2%95%C2%94%C2%B2-%C3%8B%C3%92%C2%9Cn%C3%BF%C3%A2%C2%80%C3%AA%03%C3%AD%C2%9EBl%C3%A5%C3%B1%C3%8B%C2%BE%00%00%00%00IEND%C2%AEB%60%C2%82',
            topRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10E_%C2%89%09%0B6e%C3%A7q%C2%B8%C2%82%C3%9E%C3%86%13x%1C%C2%AF%C3%80%C2%8DX%11%C3%A3%C3%86tE%C3%9A4%C2%B4%C2%B4U%C3%90%C2%84%C2%BE%C2%A5%C2%9A%3C%C3%BE%0C3%C2%89%C2%97%C2%BE%C3%AF%C2%AF%C3%80%04%18%C3%8Aa%C2%81%C2%AE%01%C2%A6eY%C2%8Cs%0E%C3%AF%7Dv%C2%ABR%0A%C2%AD%C2%B5%C2%91RN%02(%26%06%C3%B0%C3%9E%C3%A3%C2%9C%030%22%3C(%C3%89%3C%C3%8F%004%C2%B1%C2%97%C3%A38f%C2%91%0E%C3%83%00%C3%80%C2%BA%C2%AE%C2%AF%C3%A5%C3%A1%C2%A3%3D%C2%89%05%12%C2%BB%5B%C2%BE%20%C2%9A%C3%BC%C2%91W-%08%C3%95I%C2%B5%C3%A8%5D%15%0FM%C3%BE%C2%97%C3%97\'O%C3%9E%C3%B6%1C3%1F8w%C3%B2%14%5B*s%C3%BE%C3%A4%C2%B1-%C3%B6%C2%9C8%C2%B5%09c%C3%94%3Bj%C3%B5%C3%8A%3F%C2%BAp%C2%B9%16%C3%8D%C3%A69%0F%C3%BCr%C3%80z%7B%5EL%1Ek%C3%8B%C3%B1%C3%89%C2%95RE%C2%A5%C3%81\'%00%C2%AB%C2%B5.r%00!D%C3%B8W%03%C2%B0%0D%C3%90I)%C2%A7%C2%B6mMv%C3%BB%1D%0Bt7T%C2%B0A%01Z%0B!%03%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%971%0E%C2%83%20%18F_%C2%89%09%03K%C3%99%3C%0EW%C3%90%C3%9Bx%02%C2%8F%C3%83%15%C2%B8%11%131.%C2%A6%13m%C3%93Z5V%C3%90D%C3%9F%08%C3%83%C3%BB%C3%B3%C3%A5%C3%A7K%C2%B8%C3%95u%7D%07%2C%60%C3%88%C2%87%03%C2%AA%02%C2%B0%7D%C3%9F%1B%C3%AF%3D!%C2%84%C3%A4V%C2%A5%14Zk%23%C2%A5%C2%B4%02%C3%88%26%06%08!%C3%A0%C2%BD%070%22%1E%C3%A4%C2%A4%C3%AB%3A%00%C3%84%C3%A7E%C3%9B%C2%B6%C3%89%C3%A5%C3%830%C2%8C%C3%8BsRL%5D%C3%8E%C2%A5%C3%904M%3A%C3%B9R~%0D97%C3%9C%C2%AE%C2%B1_%C3%B2%5D%C3%98d%C3%A1%C3%96n%C3%BD%C2%A4%C3%BC%C3%9F%C2%A74%C3%87%C3%B1bOQ%C2%B1c)%C2%8E%C3%8AS%C3%87%1D9%5E%C3%AC%C2%91%C2%A9%C3%B8%C2%B7H\'Y%C2%B7%2F%19%C3%AE%C2%BC%0Dw%5E%C3%B9%C3%95%C3%AD%C2%BB%C3%B0%25%C3%8FU%C2%ADO%C2%B9R*%C2%9B%C3%B0%C3%9D\'%00%C2%A7%C2%B5%C3%8E2%C2%80%10%22%C3%BE%C3%95%00%5C%01TRJ%5B%C2%96%C2%A5In%7F%C3%A1%C2%80%C3%AA%01WnA%05R%C2%98%C3%BAg%00%00%00%00IEND%C2%AEB%60%C2%82',
            center: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%91IDATH%C2%89%C3%AD%C2%97%C3%81%09%C3%83%20%18F_%25%C3%A0%C3%81K%C2%BDe%1CWH%C2%B6%C3%89%04%C2%8E%C3%A3%0An%C3%A4IB.%C2%A1\'%C3%9B%C3%92%C3%92%C2%80%C2%91%C2%98%C2%B4%C3%8D%3B%C3%AA%C2%AFO%3F%C3%A4%07%2F%7D%C3%9F_%01%07%18%C3%AA%C3%A1%C2%81%C2%AE%01%C3%9C4M%26%C2%84%40%C2%8Cqs%C2%ABR%0A%C2%AD%C2%B5%C2%91R%3A%01T%13%03%C3%84%18%09!%00%18%C2%91%06j2%C2%8E%23%00%C2%A2d%13k%C3%AD%C2%AAu%C3%B3%3C%C2%97%C3%8BK%C3%99U%C3%9E%2CM~%C2%8Au%18%C2%86%C2%A2%C3%9A%C3%84%C3%BF%C3%86~%C3%8Awa%C3%B1%C2%B5%2F%C2%BD%C3%94%C2%92%C3%9A%C3%84%C2%B1n%C2%9E%C3%9B2s%C3%AA_%C3%93y%C2%93%C3%A7%C3%84g%C2%AD%5D%15w%C3%A2X%C2%B1%3Fs%C2%B6%C3%97S%C3%BES%C3%B2%C3%BFm%C2%AF%C3%9F%2B%2Fi%C2%ADw%C2%B9R%C2%AAh%C2%93%5C%C2%92O%00%5Ek%5D%C3%A5%00B%C2%88%C3%B4W%03%C3%B0%0D%C3%90I)%5D%C3%9B%C2%B6fs%C3%BB%03%0Ft7%C2%B4%10E%C2%92%0Ev%C2%B5%C2%94%00%00%00%00IEND%C2%AEB%60%C2%82',
            centerRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9FIDATH%C2%89%C3%AD%C2%97%C2%B1%0D%C2%830%10%00%2F%16%C2%92%0B%C2%9A%C2%B8c%1C%C2%AF%00%C3%9B0%01%C3%A3x%05o%C3%A4%C3%8AB4(ED%C2%92%C3%82%04b%C2%B0A%0AW!%C2%8A%C2%BF%C3%B7%C3%BF%C3%BB%25%C3%9F%C2%9A%C2%A6%C2%B9%03%06%C3%90%C3%A4%C3%83%02u%01%C2%98a%18%C2%B4s%0E%C3%AF%7DrkY%C2%96(%C2%A5%C2%B4%C2%94%C3%92%08%20%C2%9B%18%C3%80%7B%C2%8Fs%0E%40%C2%8B%C3%A9GN%C3%BA%C2%BE%07%40%C3%A4%12v%5D%C3%B7%C3%BA%1E%C3%871%C2%AF%3CD%C2%B15%C3%80%C3%A7%C2%89B%C2%B4m%1B%2F%C2%9F%0B%C3%BE-%C3%A8Z%0E-%C3%BB%25%3F%C2%84%C3%85%C2%81%C3%9Bc%C2%B0%C2%A2%C3%A5KlI%C3%AE%7Ce_Z%1CI%C3%A5)%C3%BA%1C%3A%C3%90%C3%B9%C3%8A%C3%BE%2B%C3%9F%C3%9A%C2%B4i%C2%B7%C3%8F%05%C2%BFv%C3%BB%25%C2%8Fa%C3%95%C3%80%C2%A5%C3%9A%C3%AF%C2%BB%5C%C2%B5%C3%98%C3%A4%C3%BE%C2%A3%C3%A7%C2%A1%C3%AA%08x%3Ear2%C3%B9%04%60%C2%95RY%12%10BLo5%00%5B%00%C2%B5%C2%94%C3%92TU%C2%A5%C2%93%C3%9B%C3%9FX%C2%A0~%00%C2%9D%02A%2F%C3%96%C3%96%C2%B0%09%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomLeft: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%95IDATH%C2%89%C3%AD%C2%97A%0E%C2%83%20%10%00%C2%A7%1B%13%0E%5E%C3%8A%C3%8D%C3%A7%C3%B0%05%C3%BD%C2%8D%2F%C3%B09%7C%C2%81%1Fq%22%C3%86%C2%8B%C3%A9%C2%A15MSk%C2%89-h%C2%A2s%C2%84%C3%83%C3%AC%C2%B2%C3%8B%06.M%C3%93%5C%01%0B%18%C3%B2%C3%A1%C2%80%C2%BA%00%C3%AC0%0C%C3%86%7BO%08!%C2%B9%C2%B5%2CK%C2%B4%C3%96F)e%05%C3%88%26%06%08!%C3%A0%C2%BD%0702-%C3%A4%C2%A4%C3%AF%7B%00%24%C2%AB%C3%B5%C3%818%C2%8E%C3%B3%C3%B2%C2%AE%C3%AB%C2%B2%05%C2%B1I%C3%A6%C2%BB%C2%90%17K%C2%9B%C2%9FJ%C3%90%C2%B6mzy%2CsA%C3%86%04x%C3%9C%C2%9A%1FW%C2%BE%C3%98p%C2%B1%5D%C2%BD%C2%B6%C3%BB%C3%B7%C2%9B%C3%B9%C2%B7Q%C3%BB%C3%AB%7D%C3%9Fo%C3%A6%C2%B1%C2%AC%C2%9D%C2%84%C3%87%C2%BDj%C2%A7%7C%13%C3%8E%09%C3%B7B%C2%8AG%C3%A4%C3%9C%C3%A9%C2%BC%C3%89%C3%BF%C3%B5D%C2%8AA%C3%A0%C3%BE%C2%85%C3%89%C3%89%C3%A4%13%C3%80i%C2%AD%C2%B3%04%20%22%C3%93_%0D%C3%80%15%40%C2%AD%C2%94%C2%B2UU%C2%99%C3%A4%C3%B6\'%0E%C2%A8o%2B%C3%80%3F%C2%96%C3%A4%C2%A1%C2%87%2C%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomCenter: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9AIDATH%C2%89%C3%AD%C2%97%3D%0A%C3%830%0CF_E%C3%80C%C2%96z%C3%8Bq%7C%C2%85%C3%A469A%C2%8E%C3%A3%2B%C3%B8F%C2%9EL%C3%88%12%3A%C2%B4%C2%A1%C3%90%C2%9F%147%C2%8E%1Bp%C2%BF%C3%91%16%3CI%C2%96%C2%84%7C%C3%AA%C2%BA%C3%AE%0CX%C3%80%C2%90O%0Eh%2B%C3%80N%C3%93d%C2%BC%C3%B7%C2%84%10v%C2%A7%C3%96u%C2%8D%C3%96%C3%9A(%C2%A5%C2%AC%00%C3%99%C3%80%00!%04%C2%BC%C3%B7%00F%C2%96%C2%83%C2%9C%1A%C3%87%11%00%C3%89J%C2%BDi%C2%9E%C3%A7%C3%AD%C3%B0a%1869%C3%B1%C2%93%C3%88%0F%01%C2%AF%C3%96._%C2%A5%C2%B5%C3%AF%C3%BB%3C%C3%B0X%C3%85%3A%5B%C3%AE%C2%9B%C2%97%0B_-%C2%B8%C3%98%C3%8A%C2%8E%C2%B5%3Ff%C3%A4k%C2%A33U%C2%AF\'%C3%AB%C3%B3o%C2%9C-%C2%B7%C3%9A%C3%BF%C3%B0%C3%B2%C3%A0o%5Bm%C3%AF%C3%A9%06G%C2%8B%3Cv)%C2%8C%C2%B1%7F%C3%8C%C3%8E%13%3C%C3%A5%C2%9A%C3%B4I%02%C3%97%2FLN-%3C%01%C2%9C%C3%96%3A%C2%8B%03%22%C2%B2%C3%BC%C3%95%00%5C%05%C2%B4J)%C3%9B4%C2%8D%C3%99%C2%9D~%C2%97%03%C3%9A%0B%C2%B5%C2%B1A%2BO1.M%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottomRight: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%9CIDATH%C2%89%C3%AD%C2%97%C2%BD%0D%C3%83%20%10F_N%C2%96(%C3%9C%C2%84%C3%8E%C3%A3%C2%B0%C2%82%C2%BD%C2%8D\'%C3%B08%5E%C2%81%C2%8D%C2%A8%C2%90%C3%A5%C3%86J%C2%91%C2%A0%14Il%C3%A4%1F%C2%8C%C3%A4%C2%BC%C2%92%C3%A2%1E%07%1F\'qk%C2%9A%C3%A6%0E%C3%B4%C2%80!%1D%16%C2%A8%0B%C2%A0%1F%C3%87%C3%918%C3%A7%C3%B0%C3%9E%1Fn-%C3%8B%12%C2%AD%C2%B5QJ%C3%B5%02%24%13%03x%C3%AFq%C3%8E%01%18%09%0B)%19%C2%86%01%00Ij%7D1MSZy%C3%97u%1Fk%C2%A7t%C2%9E%C2%85%C2%BC%C3%98%C2%AB%C3%90%C2%B7c%05h%C3%9Bv%C2%9B%C3%BC%5B%C3%A1%C2%B9%C2%A2%C2%B1%5C%C3%B7%C3%8E%C2%AF%2B%C2%8F%0A%5CL%C2%B8%C3%96%040%C3%BF%C3%8E%C3%A7%C3%B8%C3%B5%C2%BE%03s\'%C2%92w%C3%A7k%26W%2C%C3%97%7Dj%7F%C3%B9)%2C%C2%A6%7D)%C3%95%5BR%C2%9F_%C3%A7KS%C3%ABP%C3%B9%1E%03%24%06%C2%81%C3%A7%17%26%25%C3%81\'%C2%80%C3%95Z\'%C3%99%C2%80%C2%88%C2%84%C2%BF%1A%C2%80-%C2%80Z)%C3%95WUe%0E%C2%B7%C2%BF%C2%B1%40%C3%BD%00%C2%85%C2%AF%3E%2B%5Ew%1F%40%00%00%00%00IEND%C2%AEB%60%C2%82',
            left: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%971%0E%C2%84%20%10%00GbBAst%C3%B6~%C2%84%2F%C3%88o%7C%C2%81%C3%8F%C3%A1%0B~%C3%847P%11c%C3%A3%5Dq!%C2%97%C2%98x%1A%C2%A3X%C3%88%C2%94d%C3%83%2C%2C%C2%BB%09%C2%85%C2%B5%C3%B6%058%C3%80%C2%90%C2%8E%1EhJ%C3%80M%C3%93d%C2%BC%C3%B7%C2%84%10.%C2%B7*%C2%A5%C3%90Z%1B)%C2%A5%13%4021%40%08%01%C3%AF%3D%C2%80%11q!%25%C3%A38%02%20%C3%BE%05u%5D%C2%B7k%C2%B3%C2%BDq%C2%91y%C2%9E%C2%B7%C3%A5WSn%05%2CO%C3%95%C2%B6m%3A%C3%B9%5E%C2%8E%24y%C3%AB%C2%B5g%C3%B9-%C2%9C%C3%B6%C3%A0%C2%8Et%C3%81%C2%A6%C3%BC%C3%8C%C3%96Z%C2%92k%C2%BE%C3%8A%C3%9A%C3%9C%3E%C2%A3%1C%C2%97M%C2%B8%C3%88%C2%BF%24%C2%9F%5B%C3%B3%2C%7F%C2%9E%3C%C3%8F%C3%B6%5B(%C2%AC%C2%B5%C3%AFa%18%C2%92%C2%8B%C3%AB%C2%BA%C3%BE%C2%9E%5C)%C2%95T%1C%7D%02%C3%A8%C2%B5%C3%96I%12%10B%C3%84%C2%BF%1A%40_%02%C2%8D%C2%94%C3%92UUe.%C2%B7%C3%BF%C3%A8%C2%81%C3%A6%03%0DDA%C2%B4G%40%C3%BF%1A%00%00%00%00IEND%C2%AEB%60%C2%82',
            vertical: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A7IDATH%C2%89%C3%AD%C2%971%0E%C2%83%20%14%40_%C2%89%09%03K%C3%99%C3%9C%C2%BD%08W%C2%90%C3%9Bx%02%C2%8E%C3%A3%15%C2%BC%C2%88g%60%22%C3%86%C3%85vhHM%C3%93Dj%10%C2%87%C3%BA%265%C3%88%C3%BB%C3%B0%C3%BF\'%C3%A1f%C2%AD%C2%BD%03%3D%60(%C3%87%00%C2%B4%15%C3%90%C3%8F%C3%B3l%C2%BC%C3%B7%C2%84%10%0E%C2%B7*%C2%A5%C3%90Z%1B)e%2F%C2%80bb%C2%80%10%02%C3%9E%7B%00%23%C3%A2%C2%87%C2%92L%C3%93%04%C2%80H%C3%BD%C3%819%C2%97m%C3%9C%C2%B2%2C%C2%BF%C3%89%C2%8F%C2%A0%C3%9A%1A%C2%B0%5EI%7C%C3%AE%C2%BA%C2%AE%C2%8C%3C%C2%95%3DA%C2%9E%C2%BA%C3%AD%C2%97%C3%BC%14%C2%B2%15%5C%2C.%C3%A7%5Cr7l%C3%8A%C3%B7L%C2%9A%C3%8A%C2%95%C3%B3%C2%AF%7C%C2%9E%C3%93%C3%AB%C3%B7%1C)%C3%88Rp%7B%C2%83%C3%BC%C3%9F%C2%9C_%C3%B2%C3%BF%C2%93gi%C2%B5u%3Be%3B%C3%9B%C3%B7N%C2%9A%C3%8A%C2%A9%C3%9B~%C2%B3%C3%96%3E%C3%86q%2C.n%C2%9A%C3%A6%C2%B5r%C2%A5TQq%C3%B4%09%60%C3%90Z%17%09%40%08%11%C3%AFj%00C%05%C2%B4R%C3%8A%C2%BE%C2%AEks%C2%B8%C3%BD%C3%8D%00%C2%B4O%C3%99%C3%AAT%08%C3%AF%C3%90%C2%87%C2%97%00%00%00%00IEND%C2%AEB%60%C2%82',
            right: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A1IDATH%C2%89%C3%AD%C2%97%3D%0E%C2%83%20%18%40%C2%9F%C3%84%C2%84%C2%81%C2%A5l%C3%AE%5E%C2%84%2B%C3%88m%3C%C2%81%C3%87%C3%B1%0A%5E%C3%8430%11%C3%A3b%3B4%C2%A4i%C3%93%C2%A4%C2%88%C2%8AC%7D%1B%04x%C3%9F%C3%87%C3%8F%C2%97PXko%40%0F%18%C3%B21%00M%09%C3%B4%C3%B3%3C%1B%C3%A7%1C%C3%9E%C3%BB%C3%83%C2%ADJ)%C2%B4%C3%96FJ%C3%99%0B%20%C2%9B%18%C3%80%7B%C2%8Fs%0E%C3%80%C2%88%C3%90%C2%91%C2%93i%C2%9A%00%10)%C2%93%C2%BB%C2%AE%C3%9B4nY%C2%96t%C3%B9%5E%C2%941%C2%83b3%3DD%1E%C3%8B%C3%9A%20O%C3%9D%C3%B6K~%0A%C2%BB%5E%C2%B8%C2%B6m%C3%9F%C3%9A%C2%BF.%60%C2%94%7C%C3%AD%C2%A2%C2%B1%5Cg%C3%BE%C2%95%C2%A3*%5B%C2%94%3C%C2%96%C3%94%20%C3%BF%C3%B7%C3%8C%2F%C3%B9%C3%BF%C3%89wyj%C2%9F%C3%A57%C2%B0%C2%A9%C2%B6%C2%A7.%1A%C3%8B%C2%A9%C3%9B%5EXk%C3%AF%C3%A38f%17%C3%97u%C3%BD%C3%8C%5C)%C2%95U%1C%7C%02%18%C2%B4%C3%96Y%02%10B%C2%84%C2%BF%1A%C3%80P%02%C2%8D%C2%94%C2%B2%C2%AF%C2%AA%C3%8A%1Cn%7F1%00%C3%8D%03.TB%5C%11%C3%AE%C2%99%C2%84%00%00%00%00IEND%C2%AEB%60%C2%82',
            top: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%98IDATH%C2%89%C3%AD%C2%97A%0A%C2%830%10E_%C2%83%C2%90E6%C3%8D%C3%8E%C3%A3%C3%A4%0Az%1BO%C3%A0qr%C2%85%C3%9C(%C2%AB%20n%C2%A4%C2%9B%C2%A6-bm%C2%B5%24%06%C3%AC%5B%C2%86%C3%817%C3%83%7C%06%C2%BC%C2%B4m%7B%05%2C%60%C3%88%C2%87%03%C2%9A%0A%C2%B0%C3%A38%1A%C3%AF%3D!%C2%84%C3%A4V%C2%A5%14Zk%23%C2%A5%C2%B4%02%C3%88%26%06%08!%C3%A0%C2%BD%070%22%3E%C3%A4d%18%06%00DV%C3%AB%C2%9Di%C2%9A%C2%8E%C2%93G%0E%C2%95W%C3%B3%C2%87%C2%BE%C3%AF%C2%93%C3%89%C2%BA%C2%AE%5B%C2%97%C3%87%C2%82o%C2%9Ax%C3%BD%C3%98Z%C3%BD%5C%1A9%C3%AF%C3%8E%C3%8B%0A%C3%9C%5E%C3%9E%C3%ADu%C2%8D2\'%C3%9F3%C3%89V%C3%BE%C2%81%7BP%C3%84%C2%85%C3%BB%C3%94%C3%88R%26%C2%96%C3%AA%C3%97%C2%B2s%C3%9E%C2%9D%C2%97%15%C2%B8_%C3%98z%1B%C3%8A%C2%9D%3C%C3%B5%C2%95%3Bo%C3%A0%C2%8E%C2%97%2B%C2%A5%C2%B2J%C2%A3O%00Nk%C2%9D%C2%A5%01!D%C3%BCW%03p%15%C3%90H)m%5D%C3%97%26%C2%B9%C3%BD%C2%89%03%C2%9A%1B%10SBl%C2%A7%C2%9D%C2%8E%C2%B8%00%00%00%00IEND%C2%AEB%60%C2%82',
            horizontal: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%B4IDATH%C2%89%C3%AD%C2%971%C2%8E%C2%84%20%14%C2%86%C2%BF!%26%144Kg%C3%AFE%C2%B8%C2%82%C3%9C%C3%86%13x%1C%C2%AF%C3%A0E%3C%03%1516%C3%8E4%C3%8B%C3%AE%26%C2%AB%C3%8E%C3%A0(%C3%86%C2%8C_%C2%89%C2%90%C3%AF%C3%A5%C3%A7%C3%B1%12o%C3%96%C3%9A%2F%C2%A0%01%0C%C3%A9h%C2%812%03%C2%9Aa%18%C2%8Cs%0E%C3%AF%C3%BD%C3%AEV%C2%A5%14Zk%23%C2%A5l%04%C2%90L%0C%C3%A0%C2%BD%C3%879%07%60DXHI%C3%9F%C3%B7%00%C2%88%C2%A4%C3%96o%C3%86q%3CN%1E8T%C2%9E%C3%8D%7D%C2%A8%C3%AB%C3%BA%C3%A9%C3%A1%C2%AA%C2%AA%C3%B6%C2%91%C3%87%C2%B2T%C3%AC%5C%C2%91%C2%87%C3%86~%C2%B3%C3%96%C3%9E%C2%BB%C2%AE%C3%BBYx%25%C3%AE%C2%B5%C3%BCM%C2%A0(%C2%8A%C3%BF%C2%B1%C2%87%0D%C2%B1w~%C2%BA%C3%987k%C2%B85%C2%9D%3F%2B%7F%C3%B7%19%C2%BD%C3%825%C3%A1%26Y%C3%93%C3%81%C2%9B%C3%89c%C2%99*v%C2%A9%C3%88k%C3%82Mn%C2%88%C2%BD%C3%B3S%C3%85%C2%BEi%C3%83%C3%85%C2%BE%C2%80E%C3%B9%C3%9ES%C3%AEs\'%C3%9C%C3%B1r%C2%A5TRi%C3%B0%09%C2%A0%C3%95Z\')%40%08%11%C3%BE%C3%95%00%C3%9A%0C(%C2%A5%C2%94M%C2%9E%C3%A7fw%C3%BB%2F-P%3E%00y5XX%C2%96%0F7%C2%A2%00%00%00%00IEND%C2%AEB%60%C2%82',
            bottom: '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%1F%00%00%00%1F%08%06%00%00%00%1F%C2%AE%169%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%00%C3%A1IDATH%C2%89%C3%AD%C2%97%C3%8D%0D%C2%83%20%18%40_%C2%89%09%07.%C3%A5%C3%A6%C3%9DEXA%C2%B6q%02%C3%87a%05%17q%06N%C3%84x%C2%B1%C2%BD%C3%94%C2%B6I%C3%95V%C2%8Dhb%C3%9F%C2%91%C2%9F%3C%C3%B8~H%C2%B8Xk%C2%AF%C2%80%03%0C%C3%B1%C2%A8%C2%80%3C%01%5C%C3%9B%C2%B6%C3%86%7BO%08as%C2%ABR%0A%C2%AD%C2%B5%C2%91R%3A%01D%13%03%C2%84%10%C3%B0%C3%9E%03%18%C3%91%0F%C3%84%C2%A4i%1A%00DT%C3%AB%C2%83%C2%AE%C3%AB%C3%B6%C2%93%C3%B7%C3%AC*O%C3%86%26%C3%8A%C2%B2%C3%BC%C2%BA%C2%B9(%C2%8AU%C3%B2c%C3%9E%7C.S%C2%91%1A%C2%8B%C3%90y%0BnW%C3%B9%C3%85Z%7B%C2%AB%C3%AB%C3%BA9%C3%B0K%C2%95%2F%C3%A5%3D%C3%B7Y%C2%96%7D%16%C3%9C%C3%9A%C3%B6%C2%99%C3%83ys%3E%C3%99%C3%A7Kzw%0E%C3%87%C2%BD%C3%B9%5C%C2%86%225%15%C2%A1%C3%B3%16%C3%9C%C3%BF%C2%85%1B%5C%C2%B05%C3%A7%C3%8D%C3%B9%C3%BEr%C2%A5TTi%C3%AF%13%40%C2%A5%C2%B5%C2%8Er%00!D%C3%BFW%03%C2%A8%12%20%C2%97R%C2%BA4M%C3%8D%C3%A6%C3%B6%17%15%C2%90%C3%9F%01%C2%88%C3%B6F%C2%A4%3C%C3%80%C3%B5%C3%BE%00%00%00%00IEND%C2%AEB%60%C2%82'
        }
    };

    var pref = app.preferences;
    var brightness = pref.getRealPreference('uiBrightness');

    if (brightness == 1) return lightest;
    if (0.5 < brightness && brightness < 1) return light;
    if (0 < brightness && brightness <= 0.5) return dark;
    if (brightness == 0) return darkest;
}


function localizeUI() {
    return {
        title: {
            en: 'Align',
            ja: '整列'
        },
        align: {
            en: 'Align Objects',
            ja: 'オブジェクトの整列'
        },
        distribute: {
            en: 'Distribute Objects',
            ja: 'オブジェクトの分布'
        },
        spacing: {
            en: 'Distribute Spacing',
            ja: '等間隔に分布'
        },
        options: {
            en: 'Options',
            ja: 'オプション'
        },
        tolerance: {
            en: 'Alignment Position Tolerance:',
            ja: '整列位置の許容誤差:'
        },
        stroke: {
            en: 'Use Preview Bounds',
            ja: 'プレビュー境界を使用'
        },
        undo: {
            en: 'Undo',
            ja: '取り消し'
        },
        close: {
            en: 'Close',
            ja: '閉じる'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
