/* ===============================================================================================================================================
   matchSelectedObjectScales

   Description
   This script matches selected object scales.

   Usage
   1. Select some objects, run this script from File > Scripts > Other Script...
   2. Select a base scale.
   3. Select either width or height.
   4. Select some options.

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    if (!items.length) return;

    var dialog = showDialog(items);

    dialog.ok.onClick = function() {
        if (!dialog.preview.value) preview(dialog, items);
        dialog.close();
    }

    dialog.show();
}


function preview(dialog, items) {
    var pref = getPreferences();
    var config = getConfiguration(dialog);
    var shapes = getPageItems(items, config.options.isIgnoreGroup);
    matchSizes(shapes, config);
    setPreferences(pref);
    app.redraw();
}


function matchSizes(items, config) {
    var shapes = getShapes(items, config.base, config.transform);
    for (var i = 0; i < shapes.targetItems.length; i++) {
        var targetItem = shapes.targetItems[i];
        var ratio = getRatio(shapes.baseItem, targetItem, config.transform, config.options);
        targetItem.resize(
            ratio.x,
            ratio.y,
            true,
            config.options.isPattern,
            true,
            config.options.isPattern,
            ratio.stroke,
            Transformation.CENTER
        );
    }
}


function getRatio(baseItem, targetItem, transform, options) {
    var base = getItemProps(baseItem);
    var target = getItemProps(targetItem);
    var ratio = {
        x: base.width / target.width * 100,
        y: base.height / target.height * 100
    };
    var x, y, stroke;

    if (transform.width) {
        x = ratio.x;
        y = (options.isTransform) ? ratio.x : 100;
        stroke = (options.isStroke) ? ratio.x : 100;
    }
    if (transform.height) {
        x = (options.isTransform) ? ratio.y : 100;
        y = ratio.y;
        stroke = (options.isStroke) ? ratio.y : 100;
    }

    return {
        x: x,
        y: y,
        stroke: stroke
    };
}


function getItemProps(item) {
    if (isClipped(item)) item = item.pathItems[0];
    var bounds = item.geometricBounds;
    var x1 = bounds[0];
    var y1 = bounds[1];
    var x2 = bounds[2];
    var y2 = bounds[3];
    var width = Math.abs(x1 - x2);
    var height = Math.abs(y1 - y2);
    var center = {
        x: x1 + width / 2,
        y: y1 - height / 2
    };
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width: width,
        height: height,
        center: center
    };
}


function getShapes(items, base, transform) {
    if (base.isLarge) return getLargestItem(items, transform);
    if (base.isSmall) return getSmallestItem(items, transform);
    if (base.isFront) return getFrontmostItem(items);
    if (base.isBack) return getBackmostItem(items);
    if (base.isArtboard) return getArtboardItem(items);
    if (base.isSize) return getBaseLength(items, base.length);
}


function getArtboardItem(items) {
    var artboard = app.activeDocument.artboards[0];
    return {
        baseItem: {
            geometricBounds: artboard.artboardRect,
            visibleBounds: artboard.artboardRect
        },
        targetItems: items
    };
}


function getBaseLength(items, length) {
    var x1 = length;
    var y1 = length;
    var x2 = 0;
    var y2 = 0;
    var bounds = [x1, y1, x2, y2];
    return {
        baseItem: {
            geometricBounds: bounds,
            visibleBounds: bounds
        },
        targetItems: items
    };
}


function getLargestItem(items, transform) {
    var baseItem = items[0];
    var targetItems = [];
    for (var i = 1; i < items.length; i++) {
        var item = items[i];
        var baseProps = getItemProps(baseItem);
        var targetProps = getItemProps(item);
        if (transform.width) {
            if (baseProps.width < targetProps.width) {
                targetItems.push(baseItem);
                baseItem = item;
            }
            else {
                targetItems.push(item);
            }
        }
        if (transform.height) {
            if (baseProps.height < targetProps.height) {
                targetItems.push(baseItem);
                baseItem = item;
            }
            else {
                targetItems.push(item);
            }
        }
    }
    return {
        baseItem: baseItem,
        targetItems: targetItems
    };
}


function getSmallestItem(items, transform) {
    var baseItem = items[0];
    var targetItems = [];
    for (var i = 1; i < items.length; i++) {
        var item = items[i];
        var baseProps = getItemProps(baseItem);
        var targetProps = getItemProps(item);
        if (transform.width) {
            if (targetProps.width < baseProps.width) {
                targetItems.push(baseItem);
                baseItem = item;
            }
            else {
                targetItems.push(item);
            }
        }
        if (transform.height) {
            if (targetProps.height < baseProps.height) {
                targetItems.push(baseItem);
                baseItem = item;
            }
            else {
                targetItems.push(item);
            }
        }
    }
    return {
        baseItem: baseItem,
        targetItems: targetItems
    };
}


function getFrontmostItem(items) {
    var baseItem = items[0];
    var targetItems = [];
    for (var i = 1; i < items.length; i++) {
        var item = items[i];
        targetItems.push(item);
    }
    return {
        baseItem: baseItem,
        targetItems: targetItems
    };
}


function getBackmostItem(items) {
    var end = items.length - 1;
    var baseItem = items[end];
    var targetItems = [];
    for (var i = end - 1; 0 <= i; i--) {
        var item = items[i];
        targetItems.push(item);
    }
    return {
        baseItem: baseItem,
        targetItems: targetItems
    };
}


function getPageItems(items, ignoreGroup) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'GroupItem' && ignoreGroup) {
            shapes = shapes.concat(getPageItems(item.pageItems, ignoreGroup));
        }
        else {
            shapes.push(item);
        }
    }
    return shapes;
}


function isClipped(item) {
    return item.typename == 'GroupItem' && item.clipped;
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
        return Number(UnitValue('0pt').as('pt'));
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

    var ruler = xmp.getProperty(namespace, unit);
    return ruler.value;
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
    var current = parseInt(app.version);
    if (current < cs6) return false;
    return true;
}


function getPreferences() {
    var transform = 'linkTransform';
    var corner = 'policyForPreservingCorners';
    var weight = 'scaleLineWeight';
    var pref = app.preferences;
    return {
        transform: {
            key: transform,
            value: pref.getBooleanPreference(transform)
        },
        corner: {
            key: corner,
            value: pref.getIntegerPreference(corner)
        },
        weight: {
            key: weight,
            value: pref.getBooleanPreference(weight)
        }
    };
}


function setPreferences(contents) {
    var transform = contents.transform;
    var corner = contents.corner;
    var weight = contents.weight;
    var pref = app.preferences;
    pref.setBooleanPreference(transform.key, transform.value);
    pref.setIntegerPreference(corner.key, corner.value);
    pref.setBooleanPreference(weight.key, weight.value);
}


function getConfiguration(dialog) {
    var base = dialog.base;
    var transform = dialog.transform;
    var options = dialog.options;

    var pref = getPreferences();
    pref.transform.value = options.isTransform.value;
    pref.corner.value = options.isCorner.value ? 1 : 2;
    pref.weight.value = options.isStroke.value;
    setPreferences(pref);

    var units = getRulerUnits();
    var value = getValue(dialog.baseSize.text);

    return {
        base: {
            isLarge: base.isLarge.value,
            isSmall: base.isSmall.value,
            isFront: base.isFront.value,
            isBack: base.isBack.value,
            isArtboard: base.isArtboard.value,
            isSize: base.isSize.value,
            length: convertUnits(value + units, 'pt')
        },
        transform: {
            width: transform.width.value,
            height: transform.height.value
        },
        options: {
            isTransform: options.isTransform.value,
            isStroke: options.isStroke.value,
            isPattern: options.isStroke.value,
            isIgnoreGroup: options.isIgnoreGroup.value
        }
    };
}


function showDialog(items) {
    $.localize = true;
    var ui = localizeUI();
    var units = getRulerUnits();
    var pref = getPreferences();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.base;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = [0, 8, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var radiobutton1 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.largest;
    radiobutton1.value = true;

    var radiobutton2 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.smallest;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [10, 0, 0, 0];

    var radiobutton3 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.frontmost;

    var radiobutton4 = group3.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.backmost;

    var group4 = panel1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var radiobutton5 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = ui.artboard;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var radiobutton6 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = ui.size;

    var edittext1 = group5.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '0';
    edittext1.preferredSize.width = 100;
    edittext1.enabled = false;

    var statictext1 = group5.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = units;
    statictext1.enabled = false;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.target;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group6 = panel2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 6, 0, 0];

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext2 = group7.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.transform;

    var group8 = group6.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 4, 0, 0];

    var radiobutton7 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton7' });
    radiobutton7.text = ui.width;
    radiobutton7.value = true;

    var radiobutton8 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton8' });
    radiobutton8.text = ui.height;

    var divider1 = panel2.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 4, 0, 0];

    var checkbox1 = group9.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.constrain;
    checkbox1.value = pref.transform.value;

    var checkbox2 = group9.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.corner;
    checkbox2.value = (pref.corner.value == 1) ? true : false;

    var checkbox3 = group9.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.stroke;
    checkbox3.value = pref.weight.value;

    var checkbox4 = group9.add('checkbox', undefined, undefined, { name: 'checkbox4' });
    checkbox4.text = ui.ignore;

    var group10 = dialog.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['right', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var checkbox5 = group10.add('checkbox', undefined, undefined, { name: 'checkbox5' });
    checkbox5.text = ui.preview;
    checkbox5.alignment = ['left', 'top'];

    var button1 = group10.add('button', undefined, undefined, { name: 'Cancel' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group10.add('button', undefined, undefined, { name: 'OK' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    radiobutton1.onClick = function() {
        disableUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton2.onClick = function() {
        disableUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton3.onClick = function() {
        disableUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton4.onClick = function() {
        disableUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton5.onClick = function() {
        disableUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton6.onClick = function() {
        disableUiSettings(dialog);
        activeUiSettings(dialog);
        this.value = true;
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    edittext1.addEventListener('keydown', function(event) {
        setSizeValue(event);
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    });

    radiobutton7.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    radiobutton8.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    checkbox1.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    checkbox2.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    checkbox3.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    checkbox4.onClick = function() {
        if (!checkbox5.value) return;
        app.undo();
        preview(dialog, items);
    }

    checkbox5.onClick = function() {
        if (this.value) {
            preview(dialog, items);
        }
        else {
            app.undo();
            app.redraw();
        }
    }

    button1.onClick = function() {
        if (checkbox5.value) app.undo();
        dialog.close();
    }

    dialog.base = {
        isLarge: radiobutton1,
        isSmall: radiobutton2,
        isFront: radiobutton3,
        isBack: radiobutton4,
        isArtboard: radiobutton5,
        isSize: radiobutton6
    };
    dialog.baseSize = edittext1;
    dialog.transform = {
        width: radiobutton7,
        height: radiobutton8
    };
    dialog.options = {
        isTransform: checkbox1,
        isCorner: checkbox2,
        isStroke: checkbox3,
        isIgnoreGroup: checkbox4
    };
    dialog.preview = checkbox5;
    dialog.ok = button2;
    return dialog;
}


function setSizeValue(event) {
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 10 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.target.text = value;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        if (value < 1) value = 0;
        event.target.text = value;
        event.preventDefault();
    }
}


function disableUiSettings(dialog) {
    var panel = dialog.panel1;
    var group2 = panel.group1.group2;
    var group3 = panel.group1.group3;
    var radiobutton1 = group2.children['radiobutton1'];
    var radiobutton2 = group2.children['radiobutton2'];
    var radiobutton3 = group3.children['radiobutton3'];
    var radiobutton4 = group3.children['radiobutton4'];
    var radiobutton5 = panel.group4.children['radiobutton5'];
    var radiobutton6 = panel.group5.children['radiobutton6'];
    var edittext1 = panel.group5.children['edittext1'];
    var statictext1 = panel.group5.children['statictext1'];
    radiobutton1.value = false;
    radiobutton2.value = false;
    radiobutton3.value = false;
    radiobutton4.value = false;
    radiobutton5.value = false;
    radiobutton6.value = false;
    edittext1.enabled = false;
    statictext1.enabled = false;
}


function activeUiSettings(dialog) {
    var group = dialog.panel1.group5;
    var edittext1 = group.children['edittext1'];
    var statictext1 = group.children['statictext1'];
    edittext1.enabled = true;
    edittext1.active = false;
    edittext1.active = true;
    statictext1.enabled = true;
}


function localizeUI() {
    return {
        'title': {
            en: 'Match Selected Object Scales',
            ja: '選択オブジェクトのサイズを揃える'
        },
        'base': {
            en: 'Base Scale',
            ja: '基準サイズ'
        },
        'largest': {
            en: 'Largest Object',
            ja: '最大オブジェクト'
        },
        'smallest': {
            en: 'Smallest Object',
            ja: '最小オブジェクト'
        },
        'frontmost': {
            en: 'Frontmost Object',
            ja: '最前面オブジェクト'
        },
        'backmost': {
            en: 'Backmost Object',
            ja: '最背面オブジェクト'
        },
        'artboard': {
            en: 'Artboard',
            ja: 'アートボード'
        },
        'size': {
            en: 'Size:',
            ja: 'サイズ:'
        },
        'target': {
            en: 'Target Objects',
            ja: '対象オブジェクト'
        },
        'transform': {
            en: 'Transform:',
            ja: '変形:'
        },
        'width': {
            en: 'Width',
            ja: '幅'
        },
        'height': {
            en: 'Height',
            ja: '高さ'
        },
        'constrain': {
            en: 'Constrain Width and Height Proportions',
            ja: '縦横比を固定'
        },
        'corner': {
            en: 'Scale Corners',
            ja: '角を拡大・縮小'
        },
        'stroke': {
            en: 'Scale Strokes & Effects',
            ja: '線幅と効果を拡大・縮小'
        },
        'ignore': {
            en: 'Ignore Group',
            ja: 'グループを無視'
        },
        'preview': {
            en: 'Preview',
            ja: 'プレビュー'
        },
        'cancel': {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        'ok': {
            en: 'OK',
            ja: 'OK'
        }
    };
}
