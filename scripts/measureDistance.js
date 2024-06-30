/* ===============================================================================================================================================
   measureDistance

   Description
   This script is an alternative to the Measure Tool and accurately measures the distance between two anchor points.

   Usage
   Select two anchor points with Direct Selection Tool, run this script from File > Scripts > Other Script...

   Notes
   Highlight the measurement points.
   The angle is based on point #1. Range: -180.0 to 180.0
   The dimension units depend on the ruler units.
   Anchor points for type on a path and area types are also supported.
   Due to the small font size, labels will not appear when enlarged above 15500%.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.3.0

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
    var shapes = getPathItems(items);
    var texts = getTextPathItems();

    var points = getSelectedPoints(shapes.concat(texts));
    if (points.length < 2) return;

    var curve = isCurve(points);
    var result = measure(points, curve);

    showDimensionLine(points, curve);
    app.redraw();

    showDialog(result);
}


function measure(points, curve) {
    var units = getRulerUnits();
    var p1 = points[0];
    var p2 = points[1];

    var x1 = convertUnits(p1.anchor.x + 'pt', units);
    var y1 = convertUnits(p1.anchor.y * -1 + 'pt', units);
    var x2 = convertUnits(p2.anchor.x + 'pt', units);
    var y2 = convertUnits(p2.anchor.y * -1 + 'pt', units);

    var width = getWidth(p1.anchor, p2.anchor);
    width = round(convertUnits(width + 'pt', units));

    var height = getHeight(p1.anchor, p2.anchor);
    height = round(convertUnits(height + 'pt', units));

    var distance = getDistance(p1.anchor, p2.anchor);
    distance = round(convertUnits(distance + 'pt', units));

    var rad = getAngle(p1.anchor, p2.anchor);
    var deg = rad * 180 / Math.PI;

    var bezier = { length: undefined, handle: undefined };
    if (curve) bezier = getCurve(points);

    return {
        x1: round(x1),
        y1: round(y1),
        x2: round(x2),
        y2: round(y2),
        width: width,
        height: height,
        distance: distance,
        curve: bezier.length,
        handle: bezier.handle,
        angle: {
            rad: round(rad),
            deg: round(deg)
        }
    };
}


function getCurve(points) {
    var units = getRulerUnits();
    var bezier = setBezier(points);
    var length = getCurveLength(bezier);
    var handle = {
        left: {
            x: round(convertUnits(bezier[2].x + 'pt', units)),
            y: round(convertUnits(bezier[2].y * -1 + 'pt', units))
        },
        right: {
            x: round(convertUnits(bezier[1].x + 'pt', units)),
            y: round(convertUnits(bezier[1].y * -1 + 'pt', units))
        }
    };
    return {
        length: round(convertUnits(length + 'pt', units)),
        handle: handle
    };
}


function round(value) {
    var digits = 10000;
    return Math.round(value * digits) / digits;
}


function getWidth(point1, point2) {
    return Math.abs(point2.x - point1.x);
}


function getHeight(point1, point2) {
    return Math.abs(point2.y - point1.y);
}


function getDistance(point1, point2) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
    var sq = 2;
    var length = Math.sqrt(Math.pow(width, sq) + Math.pow(height, sq));
    return length;
}


function getAngle(point1, point2) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
    return Math.atan2(height, width);
}


function setBezier(points) {
    var p1 = points[0];
    var p2 = points[1];
    if (p1.index.point + 1 == p2.index.point) {
        return [
            p1.anchor,
            p1.handle.right,
            p2.handle.left,
            p2.anchor
        ];
    }
    else if (p1.index.point == 0 && p2.index.point == p2.count - 1) {
        return [
            p1.anchor,
            p1.handle.left,
            p2.handle.right,
            p2.anchor
        ];
    }
}


function getCurveLength(bezier) {
    var points = [];
    var length = 0;

    for (var t = 0.0; t <= 1.0; t += 0.0005) {
        var point = completion(t, bezier);
        points.push(point);
    }

    for (var i = 0; i < points.length - 1; i++) {
        length += getDistance(points[i], points[i + 1]);
    }

    return length;
}


// P(t) = (1−t)^3 * P0 + 3 * (1−t)^2 * t * P1 + 3 * (1−t) * t^2 * P2 + t^3 * P3
function completion(t, bezier) {
    var _t = 1 - t;
    return add(
        add(
            add(
                mult(bezier[0], _t * _t * _t),
                mult(bezier[1], 3 * _t * _t * t)
            ),
            mult(bezier[2], 3 * _t * t * t)
        ),
        mult(bezier[3], t * t * t)
    );
}


function vector(v) {
    return {
        x: v.x,
        y: v.y
    };
}


function add(a, b) {
    var v = vector(a);
    v.x += b.x;
    v.y += b.y;
    return v;
}


function mult(a, t) {
    var v = vector(a);
    v.x *= t;
    v.y *= t;
    return v;
}


function showDimensionLine(points, curve) {
    var mode = app.activeDocument.documentColorSpace;
    var CMYK = DocumentColorSpace.CMYK;
    var color = {
        curve: (mode == CMYK) ? setCMYKColor(0, 100, 100, 0) : setRGBColor(230, 0, 18),
        line: (mode == CMYK) ? setCMYKColor(0, 100, 100, 0) : setRGBColor(230, 0, 18),
        circle: (mode == CMYK) ? setCMYKColor(0, 100, 100, 0) : setRGBColor(230, 0, 18),
        label: {
            fill: (mode == CMYK) ? setCMYKColor(0, 0, 0, 60) : setRGBColor(127, 127, 127),
            stroke: (mode == CMYK) ? setCMYKColor(0, 0, 0, 0) : setRGBColor(255, 255, 255),
            content: (mode == CMYK) ? setCMYKColor(0, 0, 0, 0) : setRGBColor(255, 255, 255)
        }
    };

    var layer = getLayer('__Distance__');
    var p1 = points[0].anchor;
    var p2 = points[1].anchor;

    if (curve) drawCurve(points, layer, color.curve);
    drawLine(points, layer, color.line, curve);
    drawCircle(p1, layer, color.circle);
    drawCircle(p2, layer, color.circle);

    var aiVersion = parseInt(app.version);
    var ai2020 = 24;
    if (ai2020 < aiVersion) {
        drawLabel('#1', p1, p2, layer, color.label);
        drawLabel('#2', p2, p1, layer, color.label);
    }
}


function drawCurve(points, layer, color) {
    var view = app.activeDocument.views[0];
    var width = 4 / view.zoom;
    var p1 = points[0];
    var p2 = points[1];

    var line = layer.pathItems.add();
    line.setEntirePath([
        [p1.anchor.x, p1.anchor.y],
        [p2.anchor.x, p2.anchor.y]
    ]);
    line.filled = false;
    line.stroked = true;
    line.strokeWidth = width;
    line.strokeDashes = [];
    line.strokeColor = color;

    if (p1.index.point + 1 == p2.index.point) {
        line.pathPoints[0].rightDirection = [p1.handle.right.x, p1.handle.right.y];
        line.pathPoints[1].leftDirection = [p2.handle.left.x, p2.handle.left.y];
    }
    else if (p1.index.point == 0 && p2.index.point == p2.count - 1) {
        line.pathPoints[0].rightDirection = [p1.handle.left.x, p1.handle.left.y];
        line.pathPoints[1].leftDirection = [p2.handle.right.x, p2.handle.right.y];
    }
}


function drawLine(points, layer, color, curve) {
    var view = app.activeDocument.views[0];
    var width = (curve) ? 2 / view.zoom : 4 / view.zoom;
    var dash = (curve) ? [10 / view.zoom, 8 / view.zoom] : [];

    var p1 = [
        points[0].anchor.x,
        points[0].anchor.y
    ];
    var p2 = [
        points[1].anchor.x,
        points[1].anchor.y
    ];

    var line = layer.pathItems.add();
    line.setEntirePath([p1, p2]);
    line.filled = false;
    line.stroked = true;
    line.strokeWidth = width;
    line.strokeDashes = dash;
    line.strokeColor = color;
}


function drawCircle(point, layer, color) {
    var view = app.activeDocument.views[0];
    var radius = 6 / view.zoom;
    var diameter = radius * 2;
    var top = point.y + radius;
    var left = point.x - radius;
    var circle = layer.pathItems.ellipse(top, left, diameter, diameter);
    circle.stroked = false;
    circle.filled = true;
    circle.fillColor = color;
}


function drawLabel(contents, p1, p2, layer, color) {
    var view = app.activeDocument.views[0];
    var fontsize = 20 / view.zoom;
    if (fontsize < 0.1) return;

    var margin = 10 / view.zoom;
    var padding = 5 / view.zoom;

    var width = 32 / view.zoom;
    var height = 24 / view.zoom;
    var radius = 4 / view.zoom;
    var stroke = 1 / view.zoom;

    var rad = getAngle(p1, p2);
    var top = (rad < 0) ? p1.y + margin + height : p1.y - margin;
    var left = p1.x - (width / 2);

    var rect = layer.pathItems.roundedRectangle(top, left, width, height, radius, radius);
    rect.fillColor = color.fill;
    rect.strokeColor = color.stroke;
    rect.strokeWidth = stroke;

    // work around a bug
    rect.selected = true;
    rect.selected = false;

    var position = [p1.x, top - height + padding];
    var text = layer.textFrames.pointText(position);
    text.contents = contents;

    var attributes = text.textRange.characterAttributes;
    attributes.size = fontsize;
    attributes.fillColor = color.content;

    var font = getFont('HelveticaNeue');
    if (font) attributes.textFont = font;

    var paragraph = text.textRange.paragraphAttributes;
    paragraph.justification = Justification.CENTER;
}


function getFont(name) {
    try {
        return app.textFonts[name];
    }
    catch (err) { }
}


function setCMYKColor(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


function isCurve(points) {
    var p1 = points[0];
    var p2 = points[1];
    var handle = { left: false, right: false };

    if (p1.index.item != p2.index.item) return false;

    if (p1.index.point + 1 == p2.index.point) {
        handle.left = hasHandle(p2.anchor, p2.handle.left);
        handle.right = hasHandle(p1.anchor, p1.handle.right);
    }
    else if (p1.index.point == 0 && p2.index.point == p2.count - 1) {
        handle.left = hasHandle(p1.anchor, p1.handle.left);
        handle.right = hasHandle(p2.anchor, p2.handle.right);
    }

    return handle.left || handle.right;
}


function hasHandle(anchor, handle) {
    return anchor.x != handle.x || anchor.y != handle.y;
}


function getLayer(name) {
    if (!layerExists(name)) return createLayer(name);
    var layer = app.activeDocument.layers[name];
    layer.locked = false;
    layer.visible = true;
    return layer;
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


function setPoint(i, p, count, item) {
    var anchor = item.anchor;
    var left = item.leftDirection;
    var right = item.rightDirection;
    return {
        index: {
            item: i,
            point: p
        },
        count: count,
        anchor: { x: anchor[0], y: anchor[1] },
        handle: {
            left: { x: left[0], y: left[1] },
            right: { x: right[0], y: right[1] }
        }
    };
}


function getSelectedPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var selection = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;
            selection.push(setPoint(i, j, points.length, point));
        }
    }
    return selection;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function getTextPathItems() {
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && text.kind != TextType.POINTTEXT) {
            items.push(text.textPath);
        }
    }
    return items;
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
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(result) {
    $.localize = true;
    var ui = localizeUI();
    var units = getRulerUnits();
    var curve = (result.curve) ? ('  [' + ui.curve + ' ' + result.curve + ' ' + units + ']') : '';

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.result;
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 8, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.distance;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.width;

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.height;

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.angle;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext5 = group3.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = result.distance + ' ' + units + curve;

    var statictext6 = group3.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = result.width + ' ' + units;

    var statictext7 = group3.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = result.height + ' ' + units;

    var statictext8 = group3.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = result.angle.deg + ui.deg + '  [' + result.angle.rad + ' ' + ui.rad + ']';

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.position;
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group4 = panel2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var group5 = group4.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var group6 = group5.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 8, 0, 0];

    var statictext9 = group6.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = ui.point + ' #1';

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [10, 0, 0, 0];

    var group8 = group7.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var statictext10 = group8.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = 'X:';

    var statictext11 = group8.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = 'Y:';

    var group9 = group7.add('group', undefined, { name: 'group9' });
    group9.preferredSize.width = 120;
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var statictext12 = group9.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = result.x1 + ' ' + units;

    var statictext13 = group9.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = result.y1 + ' ' + units;

    var group10 = group5.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = [0, 8, 0, 0];

    var statictext14 = group10.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = ui.handle + ' #1';

    var group11 = group10.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = [10, 0, 0, 0];

    var group12 = group11.add('group', undefined, { name: 'group12' });
    group12.orientation = 'column';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var statictext15 = group12.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = 'X:';

    var statictext16 = group12.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = 'Y:';

    var group13 = group11.add('group', undefined, { name: 'group13' });
    group13.preferredSize.width = 120;
    group13.orientation = 'column';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var statictext17 = group13.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = (result.curve) ? (result.handle.right.x + ' ' + units) : '-';

    var statictext18 = group13.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = (result.curve) ? (result.handle.right.y + ' ' + units) : '-';

    var group14 = group4.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var group15 = group14.add('group', undefined, { name: 'group15' });
    group15.orientation = 'column';
    group15.alignChildren = ['left', 'center'];
    group15.spacing = 10;
    group15.margins = 0;

    var group16 = group15.add('group', undefined, { name: 'group16' });
    group16.orientation = 'column';
    group16.alignChildren = ['left', 'center'];
    group16.spacing = 10;
    group16.margins = [0, 8, 0, 0];

    var statictext19 = group16.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = ui.point + ' #2';

    var group17 = group16.add('group', undefined, { name: 'group17' });
    group17.orientation = 'row';
    group17.alignChildren = ['left', 'center'];
    group17.spacing = 10;
    group17.margins = [10, 0, 0, 0];

    var group18 = group17.add('group', undefined, { name: 'group18' });
    group18.orientation = 'column';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 10;
    group18.margins = 0;

    var statictext20 = group18.add('statictext', undefined, undefined, { name: 'statictext20' });
    statictext20.text = 'X:';

    var statictext21 = group18.add('statictext', undefined, undefined, { name: 'statictext21' });
    statictext21.text = 'Y:';

    var group19 = group17.add('group', undefined, { name: 'group19' });
    group19.preferredSize.width = 120;
    group19.orientation = 'column';
    group19.alignChildren = ['left', 'center'];
    group19.spacing = 10;
    group19.margins = 0;

    var statictext22 = group19.add('statictext', undefined, undefined, { name: 'statictext22' });
    statictext22.text = result.x2 + ' ' + units;

    var statictext23 = group19.add('statictext', undefined, undefined, { name: 'statictext23' });
    statictext23.text = result.y2 + ' ' + units;

    var group20 = group15.add('group', undefined, { name: 'group20' });
    group20.orientation = 'column';
    group20.alignChildren = ['left', 'center'];
    group20.spacing = 10;
    group20.margins = [0, 8, 0, 0];

    var statictext24 = group20.add('statictext', undefined, undefined, { name: 'statictext24' });
    statictext24.text = ui.handle + ' #2';

    var group21 = group20.add('group', undefined, { name: 'group21' });
    group21.orientation = 'row';
    group21.alignChildren = ['left', 'center'];
    group21.spacing = 10;
    group21.margins = [10, 0, 0, 0];

    var group22 = group21.add('group', undefined, { name: 'group22' });
    group22.orientation = 'column';
    group22.alignChildren = ['left', 'center'];
    group22.spacing = 10;
    group22.margins = 0;

    var statictext25 = group22.add('statictext', undefined, undefined, { name: 'statictext25' });
    statictext25.text = 'X:';

    var statictext26 = group22.add('statictext', undefined, undefined, { name: 'statictext26' });
    statictext26.text = 'Y:';

    var group23 = group21.add('group', undefined, { name: 'group23' });
    group23.preferredSize.width = 120;
    group23.orientation = 'column';
    group23.alignChildren = ['left', 'center'];
    group23.spacing = 10;
    group23.margins = 0;

    var statictext27 = group23.add('statictext', undefined, undefined, { name: 'statictext27' });
    statictext27.text = (result.curve) ? (result.handle.left.x + ' ' + units) : '-';

    var statictext28 = group23.add('statictext', undefined, undefined, { name: 'statictext28' });
    statictext28.text = (result.curve) ? (result.handle.left.y + ' ' + units) : '-';

    var group24 = dialog.add('group', undefined, { name: 'group24' });
    group24.orientation = 'row';
    group24.alignChildren = ['right', 'center'];
    group24.spacing = 10;
    group24.margins = 0;

    var button1 = group24.add('button', undefined, undefined, { name: 'button1' });
    button1.text = 'Cancel';
    button1.preferredSize.width = 85;
    button1.hide();

    var button2 = group24.add('button', undefined, undefined, { name: 'button2' });
    button2.text = 'OK';
    button2.preferredSize.width = 85;

    button1.onClick = function() {
        app.undo();
        app.redraw();
        dialog.close();
    }

    button2.onClick = function() {
        app.undo();
        app.redraw();
        dialog.close();
    }

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Measure Distance',
            ja: '距離の測定'
        },
        result: {
            en: 'Result',
            ja: '結果'
        },
        distance: {
            en: 'Distance:',
            ja: '直線距離:'
        },
        curve: {
            en: 'Curve:',
            ja: '曲線:'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
        },
        angle: {
            en: 'Angle:',
            ja: '角度:'
        },
        deg: {
            en: '°',
            ja: '°'
        },
        rad: {
            en: 'rad',
            ja: 'rad'
        },
        position: {
            en: 'Position',
            ja: '位置'
        },
        point: {
            en: 'Anchor Point',
            ja: 'アンカーポイント'
        },
        handle: {
            en: 'Handle',
            ja: 'ハンドル'
        }
    };
}
