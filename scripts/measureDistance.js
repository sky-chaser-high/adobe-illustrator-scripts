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
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.1.0

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
    var texts = getTextPathItems();

    var points = getSelectedPoints(shapes.concat(texts));
    if (points.length < 2) return;

    var curve = hasCurve(points);
    var result = measure(points, curve);

    showDimensionLine(points, curve);
    showDialog(result);
}


function measure(points, curve) {
    var units = getUnits(app.activeDocument.rulerUnits);
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
    var units = getUnits(app.activeDocument.rulerUnits);
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
    var adjacent = point2.x - point1.x;
    var opposite = point2.y - point1.y;
    var hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    return hypotenuse;
}


function getAngle(point1, point2) {
    var adjacent = point2.x - point1.x;
    var opposite = point2.y - point1.y;
    return Math.atan2(opposite, adjacent);
}


function setBezier(points) {
    var p1 = points[0];
    var p2 = points[1];
    if (p1.index.point + 1 == p2.index.point) {
        return [p1.anchor, p1.handle.right, p2.handle.left, p2.anchor];
    }
    else if (p1.index.point == 0 && p2.index.point == p2.count - 1) {
        return [p2.anchor, p2.handle.right, p1.handle.left, p1.anchor];
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
    var color = (mode == CMYK) ? setCMYKColor(0, 100, 100, 0) : setRGBColor(230, 0, 18);
    var layer = getLayer('__Distance__');

    if (curve) drawCurve(points, layer, color);
    drawLine(points, layer, color, curve);
    drawCircle(points[0].anchor, layer, color);
    drawCircle(points[1].anchor, layer, color);
    app.redraw();
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

    var line = layer.pathItems.add();
    line.setEntirePath([
        [points[0].anchor.x, points[0].anchor.y],
        [points[1].anchor.x, points[1].anchor.y]
    ]);
    line.filled = false;
    line.stroked = true;
    line.strokeWidth = width;
    line.strokeDashes = dash;
    line.strokeColor = color;
}


function drawCircle(point, layer, color) {
    var view = app.activeDocument.views[0];
    var radius = 6 / view.zoom;
    var top = point.y + radius;
    var left = point.x - radius;
    var circle = layer.pathItems.ellipse(top, left, radius * 2, radius * 2);
    circle.stroked = false;
    circle.filled = true;
    circle.fillColor = color;
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


function hasCurve(points) {
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

    if (handle.left || handle.right) return true;
    return false;
}


function hasHandle(anchor, handle) {
    if (anchor.x == handle.x && anchor.y == handle.y) return false;
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
    var AREA = TextType.AREATEXT;
    var PATH = TextType.PATHTEXT;
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && (text.kind == AREA || text.kind == PATH)) {
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


function showDialog(result) {
    $.localize = true;
    var ui = localizeUI();
    var units = getUnits(app.activeDocument.rulerUnits);
    var curve = (result.curve) ? ('  [' + ui.curve + ' ' + result.curve + ' ' + units + ']') : '';

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.point + ' #1';
    panel1.preferredSize.width = 160;
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 8, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = 'X:';

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = 'Y:';

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 8, 0, 0];

    var statictext3 = group3.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = result.x1 + ' ' + units;

    var statictext4 = group3.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = result.y1 + ' ' + units;

    var panel2 = group1.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.point + ' #2';
    panel2.preferredSize.width = 160;
    panel2.orientation = 'row';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group4 = panel2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 8, 0, 0];

    var statictext5 = group4.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = 'X:';

    var statictext6 = group4.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = 'Y:';

    var group5 = panel2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 8, 0, 0];

    var statictext7 = group5.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = result.x2 + ' ' + units;

    var statictext8 = group5.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = result.y2 + ' ' + units;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var panel3 = group6.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.handle + ' #1';
    panel3.preferredSize.width = 160;
    panel3.orientation = 'row';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group7 = panel3.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 8, 0, 0];

    var statictext9 = group7.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = 'X:';

    var statictext10 = group7.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = 'Y:';

    var group8 = panel3.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 8, 0, 0];

    var statictext11 = group8.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = (result.curve) ? (result.handle.right.x + ' ' + units) : '-';

    var statictext12 = group8.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = (result.curve) ? (result.handle.right.y + ' ' + units) : '-';

    var panel4 = group6.add('panel', undefined, undefined, { name: 'panel4' });
    panel4.text = ui.handle + ' #2';
    panel4.preferredSize.width = 160;
    panel4.orientation = 'row';
    panel4.alignChildren = ['left', 'top'];
    panel4.spacing = 10;
    panel4.margins = 10;

    var group9 = panel4.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 8, 0, 0];

    var statictext13 = group9.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = 'X:';

    var statictext14 = group9.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = 'Y:';

    var group10 = panel4.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = [0, 8, 0, 0];

    var statictext15 = group10.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = (result.curve) ? (result.handle.left.x + ' ' + units) : '-';

    var statictext16 = group10.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = (result.curve) ? (result.handle.left.y + ' ' + units) : '-';

    var panel5 = dialog.add('panel', undefined, undefined, { name: 'panel5' });
    panel5.text = ui.result;
    panel5.orientation = 'row';
    panel5.alignChildren = ['left', 'top'];
    panel5.spacing = 10;
    panel5.margins = 10;

    var group11 = panel5.add('group', undefined, { name: 'group11' });
    group11.orientation = 'column';
    group11.alignChildren = ['right', 'center'];
    group11.spacing = 10;
    group11.margins = [0, 8, 0, 0];

    var statictext17 = group11.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = ui.width;
    statictext17.preferredSize.height = 18;

    var statictext18 = group11.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = ui.height;
    statictext18.preferredSize.height = 18;

    var statictext19 = group11.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = ui.distance;
    statictext19.preferredSize.height = 18;

    var statictext20 = group11.add('statictext', undefined, undefined, { name: 'statictext20' });
    statictext20.text = ui.angle;
    statictext20.preferredSize.height = 18;

    var group12 = panel5.add('group', undefined, { name: 'group12' });
    group12.orientation = 'column';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = [0, 8, 0, 0];

    var statictext21 = group12.add('statictext', undefined, undefined, { name: 'statictext21' });
    statictext21.text = result.width + ' ' + units;
    statictext21.preferredSize.height = 18;

    var statictext22 = group12.add('statictext', undefined, undefined, { name: 'statictext22' });
    statictext22.text = result.height + ' ' + units;
    statictext22.preferredSize.height = 18;

    var statictext23 = group12.add('statictext', undefined, undefined, { name: 'statictext23' });
    statictext23.text = result.distance + ' ' + units + curve;
    statictext23.preferredSize.height = 18;

    var statictext24 = group12.add('statictext', undefined, undefined, { name: 'statictext24' });
    statictext24.text = result.angle.deg + ' ' + ui.deg + '  [' + result.angle.rad + ' ' + ui.rad + ']';
    statictext24.preferredSize.height = 18;

    var group13 = dialog.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['right', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var button1 = group13.add('button', undefined, undefined, { name: 'button1' });
    button1.text = 'Cancel';
    button1.preferredSize.width = 85;
    button1.hide();

    var button2 = group13.add('button', undefined, undefined, { name: 'button2' });
    button2.text = 'OK';
    button2.preferredSize.width = 85;

    button1.onClick = function() {
        app.undo();
        dialog.close();
    }

    button2.onClick = function() {
        app.undo();
        dialog.close();
    }

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Measure the Distance',
            ja: '距離を測る'
        },
        point: {
            en: 'Point',
            ja: 'ポイント'
        },
        handle: {
            en: 'Handle',
            ja: 'ハンドル'
        },
        result: {
            en: 'Result',
            ja: '結果'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
        },
        distance: {
            en: 'Distance:',
            ja: '距離:'
        },
        curve: {
            en: 'Curve:',
            ja: '曲線:'
        },
        angle: {
            en: 'Angle:',
            ja: '角度:'
        },
        deg: {
            en: 'deg',
            ja: '度'
        },
        rad: {
            en: 'rad',
            ja: 'ラジアン'
        }
    };
}
