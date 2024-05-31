/* ===============================================================================================================================================
   createTextParallelToPathSegment

   Description
   This script creates a text parallel to a straight segment or a line connecting two anchor points.

   Usage
   1. Select two anchor points with the Direct Selection Tool, run this script from File > Scripts > Other Script...
   2. Enter any text.
      The default values are the distance and angle between two points.
   3. Select either Point Type or Area Type.
      Point Type: Select Left-align, Center-align, or Right-align.
      Area Type: Enter area width and height values.
   4. Check the Flip checkbox reverses the drawing position.
   5. Check the Middle checkbox to draw in the middle of the path segment.
   6. Enter a value of the margin will space them from the path segment.

   Notes
   Curves are not supported.
   Anchor points for type on a path and area type are also supported.
   The units of the Width, Height and Margin value depend on the ruler units.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator 2021 or higher

   Version
   1.0.1

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
    var points = getSelectedAnchorPoints(shapes.concat(texts));
    if (points.length != 2) return;

    var contents = setContents(points);
    var align = Justification.LEFT;
    var margin = 0;
    var isFlip = false;
    var isMiddle = false;
    createPointType(contents, points, align, margin, isFlip, isMiddle);
    app.redraw();

    var dialog = showDialog(contents, points);
    dialog.show();
}


function getConfiguration(dialog) {
    var kind, align;
    if (dialog.kind.pointType.value) kind = TextType.POINTTEXT;
    if (dialog.kind.areaType.value) kind = TextType.AREATEXT;

    if (dialog.align.left.value) align = Justification.LEFT;
    if (dialog.align.center.value) align = Justification.CENTER;
    if (dialog.align.right.value) align = Justification.RIGHT;
    if (kind == TextType.AREATEXT) align = Justification.LEFT;

    var width = getValue(dialog.area.width.text);
    var height = getValue(dialog.area.height.text);

    var flip = (dialog.flip.value) ? true : false;
    var middle = (dialog.middle.value) ? true : false;
    var margin = getValue(dialog.margin.text);
    var units = dialog.units;

    return {
        contents: dialog.contents.text,
        kind: kind,
        align: align,
        area: {
            width: convertUnits(width + units, 'pt'),
            height: convertUnits(height + units, 'pt')
        },
        flip: flip,
        middle: middle,
        margin: convertUnits(margin + units, 'pt')
    };
}


function preview(dialog, points) {
    reset(points);
    var config = getConfiguration(dialog);
    addText(config, points);
    app.redraw();
}


function setContents(points) {
    var p1 = setPoint(points[0]);
    var p2 = setPoint(points[1]);

    var ruler = getRulerUnits();
    var length = getLength(p1, p2);
    length = convertUnits(length + 'pt', ruler);

    var rad = getAngle(p1, p2);
    var deg = rad * 180 / Math.PI;

    var digits = 10000;
    var contents = Math.round(length * digits) / digits + ' ' + ruler + ', ' +
        Math.round(deg * digits) / digits + '°';
    return contents;
}


function addText(config, points) {
    var contents = config.contents;
    var kind = config.kind;
    var area = config.area;
    var align = config.align;
    var margin = config.margin;
    var isFlip = config.flip;
    var isMiddle = config.middle;

    (kind == TextType.POINTTEXT)
        ? createPointType(contents, points, align, margin, isFlip, isMiddle)
        : createAreaType(contents, points, area, align, margin, isFlip, isMiddle);
}


function createPointType(contents, points, align, margin, isFlip, isMiddle) {
    var p1 = isFlip ? setPoint(points[1]) : setPoint(points[0]);
    var p2 = isFlip ? setPoint(points[0]) : setPoint(points[1]);

    var rad = getAngle(p1, p2);
    var deg = rad * 180 / Math.PI;

    var layer = app.activeDocument.activeLayer;
    var text = layer.textFrames.pointText([p1.x, p1.y]);
    text.contents = contents;

    var height = text.height;

    var paragraph = text.textRange.paragraphAttributes;
    paragraph.justification = align;

    text.rotate(deg, true, true, true, true, Transformation.BOTTOMLEFT);

    var origin = getOrigin(p1, p2, align);
    var diff = getDifference(text, origin);
    text.translate(diff.x, diff.y);

    if (isMiddle) {
        var x = (p2.x - p1.x) / 2;
        var y = (p2.y - p1.y) / 2;
        text.translate(y / height, x / height * -1);
    }
    if (margin) {
        var angle = rad + Math.PI / 2;
        var distance = getDistance(margin, angle);
        text.translate(distance.x, distance.y);
    }
}


function createAreaType(contents, points, area, align, margin, isFlip, isMiddle) {
    var p1 = isFlip ? setPoint(points[1]) : setPoint(points[0]);
    var p2 = isFlip ? setPoint(points[0]) : setPoint(points[1]);

    var rad = getAngle(p1, p2);
    var deg = rad * 180 / Math.PI;

    var position = getAreaPosition(p1, p2, area.width);
    var layer = app.activeDocument.activeLayer;
    var rect = layer.pathItems.rectangle(position.top, position.left, area.width, area.height);
    var text = layer.textFrames.areaText(rect);
    text.contents = contents;

    var paragraph = text.textRange.paragraphAttributes;
    paragraph.justification = align;

    text.rotate(deg, true, true, true, true, Transformation.BOTTOMLEFT);

    var point = text.textPath.pathPoints[0];
    var center = getCenter(p1, p2);
    var diff = getDifference(point, center);
    var length = getDistance(area.width / 2, rad);
    text.translate(diff.x - length.x, diff.y - length.y);

    if (isMiddle) {
        var middle = getDistance(area.height / 2, rad);
        text.translate(middle.y, middle.x * -1);
    }
    if (margin) {
        var angle = rad + Math.PI / 2;
        var distance = getDistance(margin, angle);
        text.translate(distance.x, distance.y);
    }
}


function getAreaPosition(point1, point2, length) {
    var width = point2.x - point1.x;
    var height = point2.y - point1.y;
    var rad = getAngle(point1, point2);
    var distance = getDistance(length, rad);
    return {
        left: point1.x + (width / 2) - (distance.x / 2),
        top: point1.y + (height / 2) - (distance.y / 2)
    };
}


function getDifference(text, position) {
    var x = position.x - text.anchor[0];
    var y = position.y - text.anchor[1];
    return {
        x: x,
        y: y
    };
}


function getOrigin(point1, point2, align) {
    switch (align) {
        case Justification.LEFT:
            return point1;
        case Justification.RIGHT:
            return point2;
        case Justification.CENTER:
            return getCenter(point1, point2);
    }
}


function getCenter(point1, point2) {
    var x = (point2.x - point1.x) / 2;
    var y = (point2.y - point1.y) / 2;
    return {
        x: point1.x + x,
        y: point1.y + y
    };
}


function getDistance(value, angle) {
    var x = value * Math.cos(angle);
    var y = value * Math.sin(angle);
    return {
        x: x,
        y: y
    };
}


function getLength(point1, point2) {
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


function setPoint(item) {
    return {
        x: item.anchor[0],
        y: item.anchor[1]
    };
}


function getSelectedAnchorPoints(shapes) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var anchors = [];
    for (var i = 0; i < shapes.length; i++) {
        var points = shapes[i].pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != ANCHOR) continue;
            anchors.push(point);
        }
    }
    return anchors;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' || item.typename == 'CompoundPathItem') {
            shapes.push(item);
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


function reset(items) {
    app.undo();
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var NOSELECTION = PathPointSelection.NOSELECTION;
    for (var i = 0; i < items.length; i++) {
        var points = items[i].parent.pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            point.selected = NOSELECTION;
        }
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.selected = ANCHOR;
    }
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


function round(value) {
    var digits = 10000;
    return Math.round(value * digits) / digits;
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
    var ai2021 = 25;
    var aiVersion = parseInt(app.version);
    if (aiVersion < ai2021) return false;
    return true;
}


function showDialog(contents, points) {
    $.localize = true;
    var ui = localizeUI();
    var ruler = getRulerUnits();
    var p1 = setPoint(points[0]);
    var p2 = setPoint(points[1]);
    var length = getLength(p1, p2);
    length = convertUnits(length + 'pt', ruler);

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.text;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 4, 0, 0];

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1', multiline: true });
    edittext1.text = contents;
    edittext1.preferredSize.height = 100;
    edittext1.active = true;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.kind;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group2 = panel2.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 10, 0, 0];

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var radiobutton1 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.pointType;
    radiobutton1.value = true;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [18, 0, 0, 0];

    var group5 = group4.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var statictext1 = group5.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.align;

    var group6 = group4.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 3, 0, 0];

    var radiobutton2 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.left;
    radiobutton2.value = true;

    var radiobutton3 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.center;

    var radiobutton4 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.right;

    var divider1 = panel2.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group7 = panel2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = [0, 2, 0, 0];

    var group8 = group7.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var radiobutton5 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = ui.areaType;

    var group9 = group7.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [18, 0, 0, 0];
    group9.enabled = false;

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['right', 'center'];
    group10.spacing = 18;
    group10.margins = 0;

    var statictext2 = group10.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.width;

    var statictext3 = group10.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.height;

    var group11 = group9.add('group', undefined, { name: 'group11' });
    group11.orientation = 'column';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var edittext2 = group11.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = round(length);
    edittext2.preferredSize.width = 150;

    var edittext3 = group11.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = round(length);
    edittext3.preferredSize.width = 150;

    var group12 = group9.add('group', undefined, { name: 'group12' });
    group12.orientation = 'column';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 18;
    group12.margins = 0;

    var statictext4 = group12.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ruler;

    var statictext5 = group12.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ruler;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.position;
    panel3.orientation = 'column';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group13 = panel3.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['left', 'center'];
    group13.spacing = 10;
    group13.margins = [0, 10, 0, 0];

    var checkbox1 = group13.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.flip;

    var checkbox2 = group13.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.middle;

    var group14 = panel3.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var statictext6 = group14.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ui.margin;

    var edittext4 = group14.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '0';
    edittext4.preferredSize.width = 60;

    var statictext7 = group14.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = ruler;

    var group15 = dialog.add('group', undefined, { name: 'group15' });
    group15.orientation = 'row';
    group15.alignChildren = ['right', 'center'];
    group15.spacing = 10;
    group15.margins = 0;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group15.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

    var button1 = group15.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group15.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.onChanging = function() {
        preview(dialog, points);
    }

    radiobutton1.onClick = function() {
        radiobutton5.value = false;
        group4.enabled = true;
        group9.enabled = false;
        preview(dialog, points);
    }

    radiobutton5.onClick = function() {
        radiobutton1.value = false;
        group4.enabled = false;
        group9.enabled = true;
        edittext2.active = false;
        edittext2.active = true;
        preview(dialog, points);
    }

    radiobutton2.onClick = function() {
        preview(dialog, points);
    }

    radiobutton3.onClick = function() {
        preview(dialog, points);
    }

    radiobutton4.onClick = function() {
        preview(dialog, points);
    }

    edittext2.onChanging = function() {
        preview(dialog, points);
    }

    edittext3.onChanging = function() {
        preview(dialog, points);
    }

    checkbox1.onClick = function() {
        preview(dialog, points);
    }

    checkbox2.onClick = function() {
        preview(dialog, points);
    }

    edittext4.onChanging = function() {
        preview(dialog, points);
    }

    edittext2.addEventListener('keydown', function(event) {
        setSizeValue(event);
        preview(dialog, points);
    });

    edittext3.addEventListener('keydown', function(event) {
        setSizeValue(event);
        preview(dialog, points);
    });

    edittext4.addEventListener('keydown', function(event) {
        setMarginValue(event);
        preview(dialog, points);
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext3.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext6.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    button0.onClick = function() {
        reset(points);
        dialog.close();
    }

    button1.onClick = function() {
        button0.notify('onClick');
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.options = {
        pointType: group4,
        areaType: group9
    };
    dialog.contents = edittext1;
    dialog.kind = {
        pointType: radiobutton1,
        areaType: radiobutton5
    };
    dialog.align = {
        left: radiobutton2,
        center: radiobutton3,
        right: radiobutton4
    };
    dialog.area = {
        width: edittext2,
        height: edittext3
    };
    dialog.flip = checkbox1;
    dialog.middle = checkbox2;
    dialog.margin = edittext4;
    dialog.units = ruler;
    return dialog;
}


function setSizeValue(event) {
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
        if (value < 1) value = 1;
        event.target.text = value;
        event.preventDefault();
    }
}


function setMarginValue(event) {
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
        event.target.text = value;
        event.preventDefault();
    }
}


function localizeUI() {
    return {
        title: {
            en: 'Create Text Parallel to Path Segment',
            ja: '直線に平行なテキストを作成'
        },
        text: {
            en: 'Text',
            ja: 'テキスト'
        },
        contents: {
            en: 'Lorem ipsum',
            ja: '山路を登りながら'
        },
        kind: {
            en: 'Type',
            ja: '種類'
        },
        pointType: {
            en: 'Point Type',
            ja: 'ポイント文字'
        },
        align: {
            en: 'Align:',
            ja: '行揃え:'
        },
        left: {
            en: 'Left',
            ja: '左揃え'
        },
        center: {
            en: 'Center',
            ja: '中央揃え'
        },
        right: {
            en: 'Right',
            ja: '右揃え'
        },
        areaType: {
            en: 'Area Type',
            ja: 'エリア内文字'
        },
        width: {
            en: 'Width:',
            ja: '幅:'
        },
        height: {
            en: 'Height:',
            ja: '高さ:'
        },
        position: {
            en: 'Position',
            ja: '位置'
        },
        flip: {
            en: 'Flip',
            ja: '反転'
        },
        middle: {
            en: 'Middle',
            ja: '中間'
        },
        margin: {
            en: 'Margin:',
            ja: '間隔:'
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
