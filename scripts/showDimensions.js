/* ===============================================================================================================================================
   showDimensions

   Description
   This script shows the dimension of the anchor point between two points of the path objects.

   Usage
   Select any path objects, run this script from File > Scripts > Other Script...
   If you select anchor points with the Direct Selection Tool,
   dimensions are displayed only at the selected. In this case, select at least two anchor points.

   Notes
   The Dimension Tool has been implemented in the Toolbar since version 2024.
   Supports curves.
   Group and color dimensions by path object.
   In complex shapes, dimensions may be displayed overlapping each other.
   The dimension units depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   2.1.0

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
    if (!shapes.length) return;

    var colors = setColors();

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (!hasSelectedAnchorPoints(shape)) continue;
        var color = colors[i % colors.length];
        measure(shape, color);
    }
}


function measure(item, color) {
    if (item.polarity == PolarityValues.POSITIVE) {
        item.polarity = PolarityValues.NEGATIVE;
    }
    var layer = getLayer('Dimensions');
    var group = layer.groupItems.add();

    var points = item.pathPoints;
    var count = points.length;
    if (!item.closed) count--;

    var start = 0;
    var end = points.length - 1;

    for (var i = start; i < count; i++) {
        if (!isSelected(item, i)) continue;

        var p1 = setPoint(points[i]);
        var p2 = (i < end) ? setPoint(points[i + 1]) : setPoint(points[start]);

        var position = getPosition(p1.anchor, p2.anchor);
        var distance = getDistance(p1.anchor, p2.anchor);

        if (isCurve(p1, p2)) {
            var bezier = setBezier(p1, p2);
            distance = getCurveLength(bezier);
            var t = completion(0.5, bezier);
            position.x = t.x;
            position.y = t.y;
        }

        showDimension(distance, group, position, color);
    }
}


function showDimension(distance, group, position, color) {
    var units = getRulerUnits();
    var value = convertUnits(distance + 'pt', units);
    var contents = round(value) + ' ' + units;

    var text = group.textFrames.pointText([position.x, position.y]);
    text.contents = contents;

    var paragraph = text.textRange.paragraphAttributes;
    paragraph.justification = Justification.CENTER;

    var font = getFont('SourceHanSansJP-Normal');
    var fontsize = 7;
    var scale = 100;

    var attributes = text.textRange.characterAttributes;
    if (font) attributes.textFont = font;
    attributes.size = fontsize;
    attributes.horizontalScale = scale;
    attributes.verticalScale = scale;
    attributes.fillColor = color;
    attributes.strokeColor = new NoColor();

    movePosition(text, distance, position.angle);
}


function movePosition(text, distance, angle) {
    if (text.width > distance) {
        var ratio = distance / text.width * 100;
        var attributes = text.textRange.characterAttributes;
        attributes.horizontalScale = (ratio > 50) ? ratio : 50;
    }

    var deg = angle * 180 / Math.PI;
    text.rotate(deg);

    var margin = convertUnits(1 + 'mm', 'pt');
    var rad = angle + Math.PI / 2;
    text.top += margin * Math.sin(rad);
    text.left += margin * Math.cos(rad);
}


function round(value) {
    var digits = 1000;
    return Math.round(value * digits) / digits;
}


function setPoint(item) {
    var anchor = item.anchor;
    var left = item.leftDirection;
    var right = item.rightDirection;
    return {
        anchor: { x: anchor[0], y: anchor[1] },
        handle: {
            left: { x: left[0], y: left[1] },
            right: { x: right[0], y: right[1] }
        }
    };
}


function getPosition(p1, p2) {
    var center = {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
    return {
        x: center.x,
        y: center.y,
        angle: getAngle(p1, p2)
    };
}


function getAngle(p1, p2) {
    var width = p2.x - p1.x;
    var height = p2.y - p1.y;
    return Math.atan2(height, width);
}


function getDistance(p1, p2) {
    var width = p2.x - p1.x;
    var height = p2.y - p1.y;
    var sq = 2;
    return Math.sqrt(Math.pow(width, sq) + Math.pow(height, sq));
}


function setBezier(p1, p2) {
    return [p1.anchor, p1.handle.right, p2.handle.left, p2.anchor];
}


function getCurveLength(bezier) {
    var points = [];
    var length = 0;

    for (var t = 0.0; t <= 1.0; t += 0.0005) {
        var point = completion(t, bezier);
        points.push(point);
    }

    for (var i = 0; i < points.length - 1; i++) {
        var p1 = points[i];
        var p2 = points[i + 1];
        length += getDistance(p1, p2);
    }
    return length;
}


// P(t) = (1 − t)^3 * P0 + 3 * (1 − t)^2 * t * P1 + 3 * (1 − t) * t^2 * P2 + t^3 * P3
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


// P(t) = 3 * (1 − t)^2 * (P1 − P0) + 6 * (1 − t) * t * (P2 − P1) + 3 * t^2 * (P3 − P2)
function differential(t, bezier) {
    var _t = 1 - t;
    return add(
        add(
            mult(sub(bezier[1], bezier[0]), 3 * _t * _t),
            mult(sub(bezier[2], bezier[1]), 6 * _t * t)
        ),
        mult(sub(bezier[3], bezier[2]), 3 * t * t)
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


function sub(a, b) {
    var v = vector(a);
    v.x -= b.x;
    v.y -= b.y;
    return v;
}


function mult(a, t) {
    var v = vector(a);
    v.x *= t;
    v.y *= t;
    return v;
}


function hasHandle(anchor, handle) {
    return anchor.x != handle.x || anchor.y != handle.y;
}


function isCurve(p1, p2) {
    var left = hasHandle(p2.anchor, p2.handle.left);
    var right = hasHandle(p1.anchor, p1.handle.right);
    return left || right;
}


function hasSelectedAnchorPoints(item) {
    var count = 0;
    var points = item.pathPoints;
    for (var i = 0; i < points.length; i++) {
        if (isSelected(item, i)) count++;
    }
    return count > 0;
}


function isSelected(item, index) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var points = item.pathPoints;

    var p1 = points[index];
    if (p1.selected != ANCHOR) return false;

    var last = points.length - 1;
    if (index == last && !item.closed) return false;

    var next = (index < last) ? index + 1 : 0;
    var p2 = points[next];
    if (p2.selected != ANCHOR) return false;
    return true;
}


function getLayer(name) {
    if (layerExists(name)) {
        var layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
        return layer;
    }
    return createLayer(name);
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


function setColors() {
    var mode = app.activeDocument.documentColorSpace;
    if (mode == DocumentColorSpace.CMYK) {
        return [
            setCMYKColor(0, 0, 0, 100),
            setCMYKColor(100, 0, 0, 0),
            setCMYKColor(0, 100, 0, 0),
            setCMYKColor(100, 0, 100, 0),
            setCMYKColor(0, 100, 100, 0),
            setCMYKColor(100, 50, 0, 0),
            setCMYKColor(50, 100, 0, 0)
        ];
    }
    return [
        setRGBColor(0, 0, 0),
        setRGBColor(0, 160, 233),
        setRGBColor(228, 0, 127),
        setRGBColor(0, 153, 68),
        setRGBColor(230, 0, 18),
        setRGBColor(29, 32, 136),
        setRGBColor(146, 7, 131)
    ];
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


function getFont(name) {
    try {
        return app.textFonts[name];
    }
    catch (err) {
        return;
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


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
