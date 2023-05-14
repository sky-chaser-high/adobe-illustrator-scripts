/* ===============================================================================================================================================
   showDimensions

   Description
   This script shows the dimension of the anchor point between two points of the path objects.

   Usage
   Select the path object, run this script from File > Scripts > Other Script...

   Notes
   Supports curves.
   Group and color dimensions by path object.
   The dimension units depend on the ruler units.
   In complex shapes, dimensions may be displayed overlapping each other.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    if (!shapes.length) return;

    var layer = getLayer('Dimensions');
    var colors = setColors();

    for (var i = 0; i < shapes.length; i++) {
        measure(shapes[i], layer, colors[i % colors.length]);
    }
}


function measure(item, layer, color) {
    if (item.polarity == PolarityValues.POSITIVE) {
        app.executeMenuCommand('Reverse Path Direction');
    }

    var group = layer.groupItems.add();
    var points = item.pathPoints;
    var count = points.length;
    if (!item.closed) count--;

    for (var i = 0; i < count; i++) {
        var last = (i == points.length - 1) ? true : false;
        var p1 = setPoint(points[i]);
        var p2 = (last) ? setPoint(points[0]) : setPoint(points[i + 1]);

        var position = getPosition(p1.anchor, p2.anchor);
        var distance = getDistance(p1.anchor, p2.anchor);

        if (hasCurve(p1, p2)) {
            var bezier = setBezier(p1, p2);
            distance = getCurveLength(bezier);
            var t = completion(0.5, bezier);
            position.x = t.x;
            position.y = t.y;
        }

        showDimension(distance, group, position, color);
    }
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
    var adjacent = p2.x - p1.x;
    var opposite = p2.y - p1.y;
    return Math.atan2(opposite, adjacent);
}


function getDistance(p1, p2) {
    var adjacent = p2.x - p1.x;
    var opposite = p2.y - p1.y;
    var hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    return hypotenuse;
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
        length += getDistance(points[i], points[i + 1]);
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


function showDimension(distance, group, position, color) {
    var units = getUnits(app.activeDocument.rulerUnits);
    var contents = round(convertUnits(distance + 'pt', units)) + ' ' + units;

    var text = group.textFrames.pointText([position.x, position.y]);
    text.contents = contents;
    text.textRange.paragraphAttributes.justification = Justification.CENTER;

    var fontsize = 7;
    var attributes = text.textRange.characterAttributes;
    attributes.textFont = getFont('SourceHanSansJP-Normal');
    attributes.size = fontsize;
    attributes.horizontalScale = 100;
    attributes.verticalScale = 100;
    attributes.fillColor = color;
    attributes.strokeColor = new NoColor();

    movePosition(text, distance, position.angle);
}


function movePosition(text, distance, angle) {
    if (text.width > distance) {
        var ratio = distance / text.width * 100;
        text.textRange.characterAttributes.horizontalScale = (ratio > 50) ? ratio :50;
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


function getUnits(ruler) {
    switch (ruler) {
        case RulerUnits.Millimeters: return 'mm';
        case RulerUnits.Centimeters: return 'cm';
        case RulerUnits.Inches: return 'in';
        case RulerUnits.Points: return 'pt';
        case RulerUnits.Pixels: return 'px';
        default: return 'pt';
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


function getFont(name) {
    try {
        return app.textFonts[name];
    }
    catch (err) {
        return app.textFonts[0];
    }
}


function hasCurve(p1, p2) {
    var handle = { left: false, right: false };
    handle.left = hasHandle(p2.anchor, p2.handle.left);
    handle.right = hasHandle(p1.anchor, p1.handle.right);

    if (handle.left || handle.right) return true;
    return false;
}


function hasHandle(anchor, handle) {
    if (anchor.x == handle.x && anchor.y == handle.y) return false;
    return true;
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
