/* ===============================================================================================================================================
   measurePathItems

   Description
   This script measures the distance of an anchor point between two points of an object.

   Usage
   Select the path object, run this script from File > Scripts > Other Script...

   Feature
   Group and color a measurements by path object.
   Switch the dimension units according to the ruler units.

   Notes
   In complex shapes, a measurements may be displayed overlapping each other.
   Curves are not supported.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.1

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var layer;
    var name = 'Dimensions';

    if (existLayer(name)) {
        layer = app.activeDocument.layers[name];
        layer.locked = false;
        layer.visible = true;
    }
    else {
        layer = createLayer(name);
    }

    var items = app.activeDocument.selection;
    var scale = 1.0;
    var count = 0;

    measurePathItems(items, layer, scale, count);

    app.activeDocument.selection = null;
    app.redraw();
}


function measurePathItems(items, layer, scale, count) {
    var counter = count;
    var colors = setColors();

    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PathItem') {
            var group = layer.groupItems.add();
            var decimal = 1000;
            var points = items[i].pathPoints;

            var direction = detectAnchorPointsDirection(points);
            if (direction < 0) {
                counterclockwise(items[i]);
            }

            var polygon = getAllAnchorPoints(points);

            var len = points.length;
            if (!items[i].closed) len--;

            for (var j = 0; j < len; j++) {
                var anchor = {
                    x1: Math.round(points[j].anchor[0] * decimal) / decimal,
                    y1: Math.round(points[j].anchor[1] * decimal) / decimal,
                    x2: (j < points.length - 1) ? Math.round(points[j + 1].anchor[0] * decimal) / decimal : Math.round(points[0].anchor[0] * decimal) / decimal,
                    y2: (j < points.length - 1) ? Math.round(points[j + 1].anchor[1] * decimal) / decimal : Math.round(points[0].anchor[1] * decimal) / decimal,
                    width: 0,
                    height: 0,
                    center: {
                        x: 0,
                        y: 0
                    },
                    straightlinedistance: 0,
                    angle: 0
                };
                anchor.width = anchor.x2 - anchor.x1;
                anchor.height = anchor.y1 - anchor.y2;
                anchor.center.x = anchor.x1 + anchor.width / 2;
                anchor.center.y = anchor.y1 - anchor.height / 2;
                anchor.straightlinedistance = Math.sqrt(Math.pow(anchor.width, 2) + Math.pow(anchor.height, 2));
                anchor.angle = Math.atan(anchor.height / anchor.width) * 180 / Math.PI;

                showDimension(polygon, anchor, group, colors[counter % colors.length], anchor.straightlinedistance, scale, anchor.angle);
            }
        }
        else if (items[i].typename == 'GroupItem') {
            measurePathItems(items[i].pageItems, layer, scale, counter);
        }
        else if (items[i].typename == 'CompoundPathItem') {
            measurePathItems(items[i].pathItems, layer, scale, counter);
        }
        counter++;
    }
}


function showDimension(polygon, position, group, color, distance, scale, angle) {
    var unit = getRulerUnits();
    var pt = getUnit('pt');
    var decimal = 100;

    var fontsize = 7;

    var margin = {
        x: 1 * getUnit('mm'),
        y: 1 * getUnit('mm')
    };
    var offset = 0.5 * getUnit('mm');

    var text = group.textFrames.pointText([position.center.x, position.center.y]);
    text.contents = Math.round(distance * scale * pt * decimal) / decimal + ' ' + unit;
    text.textRange.paragraphAttributes.justification = Justification.CENTER;

    var attributes = text.textRange.characterAttributes;
    attributes.textFont = getFont('SourceHanSansJP-Normal');
    attributes.size = fontsize;
    attributes.horizontalScale = 100;
    attributes.verticalScale = 100;
    attributes.fillColor = color;
    attributes.strokeColor = new NoColor();

    var rad;

    if (angle > 0) {
        rad = (-angle + 90) * Math.PI / 180;
        text.top += margin.y * Math.sin(rad);
        text.left += margin.x * Math.cos(rad);
    }
    else {
        rad = (angle + 90) * Math.PI / 180;
        text.top += margin.y * Math.sin(rad);
        text.left -= margin.x * Math.cos(rad);
    }

    text.rotate(-angle);

    var inside = crossingNumberAlgorithm(polygon, { x: text.anchor[0], y: text.anchor[1] });
    if (inside % 2 == 0) {
        if (angle > 0) {
            text.top -= (fontsize + margin.y + offset) * Math.sin(rad);
            text.left -= (fontsize + margin.x + offset) * Math.cos(rad);
        }
        else {
            text.top -= (fontsize + margin.y + offset) * Math.sin(rad);
            text.left += (fontsize + margin.x + offset) * Math.cos(rad);
        }
    }

    var textLength = Math.sqrt(Math.pow(text.width, 2) + Math.pow(text.height, 2));
    if (textLength > distance) {
        var ratio = Math.round((distance / textLength * 100) / 10) * 10;
        if (ratio < 50) ratio = 50;
        attributes.horizontalScale = ratio;
    }
}


function getAllAnchorPoints(paths) {
    var polygon = [];

    for (var i = 0; i < paths.length; i++) {
        polygon.push({
            x: paths[i].anchor[0],
            y: paths[i].anchor[1]
        });
    }

    return polygon;
}


function crossingNumberAlgorithm(polygon, anchor) {
    var count = 0;
    for (var i = 0; i < polygon.length; i++) {
        var x1 = polygon[i].x;
        var y1 = polygon[i].y;
        var x2 = (i < polygon.length - 1) ? polygon[i + 1].x : polygon[0].x;
        var y2 = (i < polygon.length - 1) ? polygon[i + 1].y : polygon[0].y;

        if ((y1 <= anchor.y && y2 > anchor.y) || (y1 > anchor.y && y2 <= anchor.y)) {
            var vt = (anchor.y - y1) / (y2 - y1);
            if (anchor.x < (x1 + (vt * (x2 - x1)))) {
                count++;
            }
        }
    }

    return count;
}


function detectAnchorPointsDirection(points) {
    var S = 0;
    for (var i = 0; i < points.length; i++) {
        var x1 = points[i].anchor[0];
        var y1 = points[i].anchor[1];
        var x2 = (i < points.length - 1) ? points[i + 1].anchor[0] : points[0].anchor[0];
        var y2 = (i < points.length - 1) ? points[i + 1].anchor[1] : points[0].anchor[1];
        S += x1 * y2 - x2 * y1;
    }
    // S > 0：counterclockwise  S < 0：clockwise
    return S / 2;
}


function counterclockwise(item) {
    var point = {
        anchor: [],
        left: [],
        right: []
    };

    var points = item.pathPoints;

    for (var i = points.length - 1; i >= 0; i--) {
        point.anchor.push(points[i].anchor);
        point.left.push(points[i].leftDirection);
        point.right.push(points[i].rightDirection);
    }

    item.setEntirePath(point.anchor);
    for (var i = 0; i < point.anchor.length; i++) {
        item.pathPoints[i].leftDirection = point.right[i];
        item.pathPoints[i].rightDirection = point.left[i];
    }
}


function getStraightlineDistance(anchor) {
    return Math.sqrt(Math.pow(anchor.width, 2) + Math.pow(anchor.height, 2));
}


function getAngle(anchor) {
    // var rad = deg * Math.PI / 180;
    // var deg = rad * 180 / Math.PI;
    return Math.atan(anchor.height / anchor.width) * 180 / Math.PI;
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


function setColors() {
    switch (app.activeDocument.documentColorSpace) {
        case DocumentColorSpace.CMYK:
            return [
                setCMYK(100, 0, 0, 0),
                setCMYK(0, 100, 0, 0),
                setCMYK(0, 0, 0, 100),
                setCMYK(100, 0, 100, 0),
                setCMYK(0, 100, 100, 0),
                setCMYK(100, 50, 0, 0),
                setCMYK(50, 100, 0, 0)
            ];
        case DocumentColorSpace.RGB:
            return [
                setRGB(0, 158, 229),
                setRGB(193, 0, 123),
                setRGB(0, 0, 0),
                setRGB(0, 151, 76),
                setRGB(196, 0, 25),
                setRGB(0, 104, 178),
                setRGB(124, 17, 128)
            ];
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


function getRulerUnits() {
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Millimeters:
            return 'mm';
        case RulerUnits.Centimeters:
            return 'cm';
        case RulerUnits.Inches:
            return 'in';
        case RulerUnits.Points:
            return 'pt';
        case RulerUnits.Pixels:
            return 'px';
        default:
            return 'mm';
    }
}


function getUnit(unit) {
    if (/pt/i.test(unit)) {
        var ruler = getRulerUnits();
        return UnitValue(1, unit).as(ruler);
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
