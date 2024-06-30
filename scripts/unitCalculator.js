/* ===============================================================================================================================================
   unitCalculator

   Description
   This script converts almost all units supported by Illustrator.

   Usage
   1. Run this script from File > Scripts > Other Script...
      If you want to refer to an object's width or height value, select any objects with the Selection Tool and then run this script.
   2. Enter a value in one of the units.

   Notes
   If the document is open, the ruler unit is the reference.
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
    if (isValidVersion()) main();
})();


function main() {
    var index = 0;
    var items = [];
    if (app.documents.length) items = app.activeDocument.selection;

    var unit = getUnitSymbol();
    var dialog = showDialog(items);

    dialog.pixel.onChanging = function() {
        var value = getValue(dialog.pixel.text);
        var px = getUnits(value + unit.px);
        showUnits(px, dialog);
    }

    dialog.point.onChanging = function() {
        var value = getValue(dialog.point.text);
        var pt = getUnits(value + unit.pt);
        showUnits(pt, dialog);
    }

    dialog.pica.onChanging = function() {
        var value = getValue(dialog.pica.text);
        var pc = getUnits(value + unit.pc);
        showUnits(pc, dialog);
    }

    dialog.inch.onChanging = function() {
        var value = getValue(dialog.inch.text);
        var inch = getUnits(value + unit.inch);
        showUnits(inch, dialog);
    }

    dialog.feet.onChanging = function() {
        var value = getValue(dialog.feet.text);
        var ft = getUnits(value + unit.ft);
        showUnits(ft, dialog);
    }

    dialog.yard.onChanging = function() {
        var value = getValue(dialog.yard.text);
        var yd = getUnits(value + unit.yd);
        showUnits(yd, dialog);
    }

    dialog.millimeter.onChanging = function() {
        var value = getValue(dialog.millimeter.text);
        var mm = getUnits(value + unit.mm);
        showUnits(mm, dialog);
    }

    dialog.centimeter.onChanging = function() {
        var value = getValue(dialog.centimeter.text);
        var cm = getUnits(value + unit.cm);
        showUnits(cm, dialog);
    }

    dialog.meter.onChanging = function() {
        var value = getValue(dialog.meter.text);
        var meter = getUnits(value + unit.meter);
        showUnits(meter, dialog);
    }

    dialog.ha.onChanging = function() {
        var value = getValue(dialog.ha.text);
        var ha = getUnits(value + unit.ha);
        showUnits(ha, dialog);
    }

    dialog.useItemValue.onClick = function() {
        var value, ruler;
        var width = dialog.item.width;
        var height = dialog.item.height;
        var nextItem = dialog.nextItem;
        var item = items[index];
        if (dialog.useItemValue.value) {
            width.enabled = true;
            height.enabled = true;
            if (items.length > 1) nextItem.enabled = true;
            value = width.value ? item.width : item.height;
            value = getUnits(value + 'pt');
        }
        else {
            width.enabled = false;
            height.enabled = false;
            nextItem.enabled = false;
            ruler = getRulerUnits();
            value = getUnits('1' + ruler);
        }
        showUnits(value, dialog);
    }

    dialog.item.width.onClick = function() {
        var item = items[index];
        var value = getUnits(item.width + 'pt');
        showUnits(value, dialog);
    }

    dialog.item.height.onClick = function() {
        var item = items[index];
        var value = getUnits(item.height + 'pt');
        showUnits(value, dialog);
    }

    dialog.item.previous.onClick = function() {
        index -= 1;
        if (index < 0) index = items.length - 1;
        var item = items[index];
        var width = dialog.item.width;
        var value = width.value ? item.width : item.height;
        value = getUnits(value + 'pt');
        showUnits(value, dialog);
    }

    dialog.item.next.onClick = function() {
        index += 1;
        if (items.length - 1 < index) index = 0;
        var item = items[index];
        var width = dialog.item.width;
        var value = width.value ? item.width : item.height;
        value = getUnits(value + 'pt');
        showUnits(value, dialog);
    }

    dialog.show();
}


function showUnits(value, dialog) {
    dialog.pixel.text = value.px;
    dialog.point.text = value.pt;
    dialog.pica.text = value.pc;
    dialog.inch.text = value.inch;
    dialog.feet.text = value.ft;
    dialog.yard.text = value.yd;
    dialog.millimeter.text = value.mm;
    dialog.centimeter.text = value.cm;
    dialog.meter.text = value.meter;
    dialog.ha.text = value.ha;
}


function getUnits(value) {
    var unit = getUnitSymbol();
    return {
        px: convertUnits(value, unit.px),
        pt: convertUnits(value, unit.pt),
        pc: convertUnits(value, unit.pc),
        inch: convertUnits(value, unit.inch),
        ft: convertUnits(value, unit.ft),
        yd: convertUnits(value, unit.yd),
        mm: convertUnits(value, unit.mm),
        cm: convertUnits(value, unit.cm),
        meter: convertUnits(value, unit.meter),
        ha: convertToHa(value)
    };
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
}


function convertToHa(value) {
    var mm = convertUnits(value, 'mm');
    var ha = 4;
    return mm * ha;
}


function convertHaToMillimeter(value) {
    var regex = /H$/;
    value = value.replace(regex, '');
    var ha = 4;
    var mm = Number(value) / ha;
    return mm + 'mm';
}


function convertUnits(value, unit) {
    if (/H$/.test(value)) value = convertHaToMillimeter(value);
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
            case RulerUnits.Qs: return unit.ha;

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
        meter: 'm',
        ha: 'H'
    };
}


function isValidVersion() {
    var cc = 17;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc) return false;
    return true;
}


function showDialog(items) {
    $.localize = true;
    var ui = localizeUI();
    var unit = getUnitSymbol();
    var ruler = getRulerUnits();
    var value = '1' + ruler;

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 0, 0, 8];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 18;
    group2.margins = 0;
    group2.alignment = ['left', 'center'];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.px;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.pt;

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.pc;

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.inch;

    var statictext5 = group2.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.ft;

    var statictext6 = group2.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ui.yd;

    var statictext7 = group2.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = ui.mm;

    var statictext8 = group2.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = ui.cm;

    var statictext9 = group2.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = ui.meter;

    var statictext10 = group2.add('statictext', undefined, undefined, { name: 'statictext10' });
    statictext10.text = ui.ha;
    if ($.locale != 'ja_JP') statictext10.visible = false;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;
    group3.alignment = ['fill', 'center'];

    var edittext1 = group3.add('edittext', undefined, undefined, { name: unit.px });
    edittext1.text = convertUnits(value, unit.px);
    edittext1.preferredSize.width = 150;
    if (ruler == unit.px) edittext1.active = true;

    var edittext2 = group3.add('edittext', undefined, undefined, { name: unit.pt });
    edittext2.text = convertUnits(value, unit.pt);
    edittext2.preferredSize.width = 150;
    if (ruler == unit.pt) edittext2.active = true;

    var edittext3 = group3.add('edittext', undefined, undefined, { name: unit.pc });
    edittext3.text = convertUnits(value, unit.pc);
    edittext3.preferredSize.width = 150;
    if (ruler == unit.pc) edittext3.active = true;

    var edittext4 = group3.add('edittext', undefined, undefined, { name: unit.inch });
    edittext4.text = convertUnits(value, unit.inch);
    edittext4.preferredSize.width = 150;
    if (ruler == unit.inch) edittext4.active = true;

    var edittext5 = group3.add('edittext', undefined, undefined, { name: unit.ft });
    edittext5.text = convertUnits(value, unit.ft);
    edittext5.preferredSize.width = 150;
    if (ruler == unit.ft) edittext5.active = true;

    var edittext6 = group3.add('edittext', undefined, undefined, { name: unit.yd });
    edittext6.text = convertUnits(value, unit.yd);
    edittext6.preferredSize.width = 150;
    if (ruler == unit.yd) edittext6.active = true;

    var edittext7 = group3.add('edittext', undefined, undefined, { name: unit.mm });
    edittext7.text = convertUnits(value, unit.mm);
    edittext7.preferredSize.width = 150;
    if (ruler == unit.mm) edittext7.active = true;

    var edittext8 = group3.add('edittext', undefined, undefined, { name: unit.cm });
    edittext8.text = convertUnits(value, unit.cm);
    edittext8.preferredSize.width = 150;
    if (ruler == unit.cm) edittext8.active = true;

    var edittext9 = group3.add('edittext', undefined, undefined, { name: unit.meter });
    edittext9.text = convertUnits(value, unit.meter);
    edittext9.preferredSize.width = 150;
    if (ruler == unit.meter) edittext9.active = true;

    var edittext10 = group3.add('edittext', undefined, undefined, { name: unit.ha });
    edittext10.text = convertToHa(value);
    edittext10.preferredSize.width = 150;
    if (ruler == unit.ha) edittext10.active = true;
    if ($.locale != 'ja_JP') edittext10.visible = false;

    var group4 = group1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 18;
    group4.margins = 0;
    group4.alignment = ['right', 'center'];

    var statictext11 = group4.add('statictext', undefined, undefined, { name: 'statictext11' });
    statictext11.text = unit.px;

    var statictext12 = group4.add('statictext', undefined, undefined, { name: 'statictext12' });
    statictext12.text = unit.pt;

    var statictext13 = group4.add('statictext', undefined, undefined, { name: 'statictext13' });
    statictext13.text = unit.pc;

    var statictext14 = group4.add('statictext', undefined, undefined, { name: 'statictext14' });
    statictext14.text = unit.inch;

    var statictext15 = group4.add('statictext', undefined, undefined, { name: 'statictext15' });
    statictext15.text = unit.ft;

    var statictext16 = group4.add('statictext', undefined, undefined, { name: 'statictext16' });
    statictext16.text = unit.yd;

    var statictext17 = group4.add('statictext', undefined, undefined, { name: 'statictext17' });
    statictext17.text = unit.mm;

    var statictext18 = group4.add('statictext', undefined, undefined, { name: 'statictext18' });
    statictext18.text = unit.cm;

    var statictext19 = group4.add('statictext', undefined, undefined, { name: 'statictext19' });
    statictext19.text = unit.meter;

    var statictext20 = group4.add('statictext', undefined, undefined, { name: 'statictext20' });
    statictext20.text = unit.ha;
    if ($.locale != 'ja_JP') statictext20.visible = false;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.option;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 10, 0, 0];

    var group6 = group5.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var checkbox1 = group6.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.useItemValue;
    if (!items.length) checkbox1.enabled = false;

    var radiobutton1 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.width;
    radiobutton1.value = true;
    radiobutton1.enabled = false;

    var radiobutton2 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.height;
    radiobutton2.enabled = false;

    var group7 = group5.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;
    group7.enabled = false;

    var statictext21 = group7.add('statictext', undefined, undefined, { name: 'statictext21' });
    statictext21.text = ui.selectedObject;

    var button1 = group7.add('button', undefined, undefined, { name: 'button1' });
    button1.text = '←';
    button1.preferredSize.width = 40;
    button1.preferredSize.height = 20;

    var button2 = group7.add('button', undefined, undefined, { name: 'button2' });
    button2.text = '→';
    button2.preferredSize.width = 40;
    button2.preferredSize.height = 20;

    var group8 = dialog.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var button3 = group8.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.ok;
    button3.preferredSize.width = 90;

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

    statictext5.addEventListener('click', function() {
        edittext5.active = false;
        edittext5.active = true;
    });

    statictext6.addEventListener('click', function() {
        edittext6.active = false;
        edittext6.active = true;
    });

    statictext7.addEventListener('click', function() {
        edittext7.active = false;
        edittext7.active = true;
    });

    statictext8.addEventListener('click', function() {
        edittext8.active = false;
        edittext8.active = true;
    });

    statictext9.addEventListener('click', function() {
        edittext9.active = false;
        edittext9.active = true;
    });

    statictext10.addEventListener('click', function() {
        edittext10.active = false;
        edittext10.active = true;
    });

    dialog.pixel = edittext1;
    dialog.point = edittext2;
    dialog.pica = edittext3;
    dialog.inch = edittext4;
    dialog.feet = edittext5;
    dialog.yard = edittext6;
    dialog.millimeter = edittext7;
    dialog.centimeter = edittext8;
    dialog.meter = edittext9;
    dialog.ha = edittext10;

    dialog.useItemValue = checkbox1;
    dialog.nextItem = group7;
    dialog.item = {
        width: radiobutton1,
        height: radiobutton2,
        previous: button1,
        next: button2
    };

    edittext1.addEventListener('keydown', setIncreaseDecrease);
    edittext2.addEventListener('keydown', setIncreaseDecrease);
    edittext3.addEventListener('keydown', setIncreaseDecrease);
    edittext4.addEventListener('keydown', setIncreaseDecrease);
    edittext5.addEventListener('keydown', setIncreaseDecrease);
    edittext6.addEventListener('keydown', setIncreaseDecrease);
    edittext7.addEventListener('keydown', setIncreaseDecrease);
    edittext8.addEventListener('keydown', setIncreaseDecrease);
    edittext9.addEventListener('keydown', setIncreaseDecrease);
    edittext10.addEventListener('keydown', setIncreaseDecrease);
    return dialog;
}


function setIncreaseDecrease(event) {
    var dialog = event.target.window;
    var ruler = event.target.properties.name;
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 5 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        event.preventDefault();
    }
    var unit = getUnits(value + ruler);
    showUnits(unit, dialog);
}


function localizeUI() {
    return {
        title: {
            en: 'Unit Calculator',
            ja: '単位を換算'
        },
        px: {
            en: 'Pixels:',
            ja: 'ピクセル:'
        },
        pt: {
            en: 'Points:',
            ja: 'ポイント:'
        },
        pc: {
            en: 'Picas:',
            ja: 'パイカ:'
        },
        inch: {
            en: 'Inches:',
            ja: 'インチ:'
        },
        ft: {
            en: 'Feet:',
            ja: 'フィート:'
        },
        yd: {
            en: 'Yards:',
            ja: 'ヤード:'
        },
        mm: {
            en: 'Millimeters:',
            ja: 'ミリメートル:'
        },
        cm: {
            en: 'Centimeters:',
            ja: 'センチメートル:'
        },
        meter: {
            en: 'Meters:',
            ja: 'メートル:'
        },
        ha: {
            en: 'H:',
            ja: '歯:'
        },
        option: {
            en: 'Option',
            ja: 'オプション'
        },
        useItemValue: {
            en: 'Use Selected Object Value',
            ja: '選択オブジェクトの数値を使用'
        },
        width: {
            en: 'Width',
            ja: '幅'
        },
        height: {
            en: 'Height',
            ja: '高さ'
        },
        selectedObject: {
            en: 'Next Object:',
            ja: '次のオブジェクト:'
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
