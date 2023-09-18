/* ===============================================================================================================================================
   highlightWord

   Description
   This script highlights the searched words with the fill color.
   Both CMYK and RGB colors are supported.

   Usage
   1. Select any text objects, run this script from File > Scripts > Other Script...
   2. Enter a word. Regular expressions are supported.
   3. Use the slider to specify the color if necessary.

   Notes
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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    if (!texts.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var word = dialog.word.text;
        if (!word) return dialog.close();
        var caps = dialog.caps.value;
        var color = getColor(dialog);
        highlight(word, texts, color, caps);
        dialog.close();
    }

    dialog.show();
}


function highlight(word, texts, color, caps) {
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var words = getWordIndexes(text.contents, word, caps);
        applyColor(text, words, color);
    }
}


function getWordIndexes(text, word, caps) {
    var flags = caps ? 'g' : 'ig';
    var regex = new RegExp(word, flags);
    var words = [];
    var array = [];
    while ((array = regex.exec(text)) !== null) {
        var str = array[0];
        var index = regex.lastIndex - str.length;
        words.push({
            index: index,
            length: str.length
        });
    }
    return words;
}


function applyColor(text, words, color) {
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var index = word.index;
        for (var j = 0; j < word.length; j++) {
            var range = text.textRanges[index + j];
            var attributes = range.characterAttributes;
            attributes.fillColor = color;
        }
    }
}


function getColor(dialog) {
    switch (app.activeDocument.documentColorSpace) {
        case DocumentColorSpace.CMYK:
            var c = Math.round(dialog.color1.value);
            var m = Math.round(dialog.color2.value);
            var y = Math.round(dialog.color3.value);
            var k = Math.round(dialog.color4.value);
            return setCMYK(c, m, y, k);
        case DocumentColorSpace.RGB:
            var r = Math.round(dialog.color1.value);
            var g = Math.round(dialog.color2.value);
            var b = Math.round(dialog.color3.value);
            return setRGB(r, g, b);
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


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog() {
    var mode = app.activeDocument.documentColorSpace;
    var CMYK = DocumentColorSpace.CMYK;
    var label = {
        name1: (mode == CMYK) ? 'C' : 'R',
        name2: (mode == CMYK) ? 'M' : 'G',
        name3: (mode == CMYK) ? 'Y' : 'B',
        name4: (mode == CMYK) ? 'K' : ''
    };
    var maxvalue = (mode == CMYK) ? 100 : 255;

    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = 10;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;
    group1.alignment = ['fill', 'top'];

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.word;
    statictext1.preferredSize.height = 20;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 185;
    edittext1.active = true;

    var checkbox1 = group2.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.caps;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.panel;
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['center', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 5, 0, 0];

    var color1 = group3.add('statictext', undefined, undefined, { name: 'color1' });
    color1.text = label.name1;
    color1.preferredSize.height = 20;

    var color2 = group3.add('statictext', undefined, undefined, { name: 'color2' });
    color2.text = label.name2;
    color2.preferredSize.height = 20;

    var color3 = group3.add('statictext', undefined, undefined, { name: 'color3' });
    color3.text = label.name3;
    color3.preferredSize.height = 20;

    var color4 = group3.add('statictext', undefined, undefined, { name: 'color4' });
    color4.text = label.name4;
    color4.preferredSize.height = 20;
    color4.visible = (mode == CMYK) ? true : false;

    var group4 = panel1.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = 100;
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 5, 0, 0];

    var slider1 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = maxvalue;
    slider1.value = (mode == CMYK) ? 0 : maxvalue;
    slider1.preferredSize.width = 150;
    slider1.preferredSize.height = 20;

    var slider2 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = maxvalue;
    slider2.value = (mode == CMYK) ? maxvalue : 0;
    slider2.preferredSize.width = 150;
    slider2.preferredSize.height = 20;

    var slider3 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = maxvalue;
    slider3.value = (mode == CMYK) ? maxvalue : 0;
    slider3.preferredSize.width = 150;
    slider3.preferredSize.height = 20;

    var slider4 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = maxvalue;
    slider4.value = 0;
    slider4.preferredSize.width = 150;
    slider4.preferredSize.height = 20;
    slider4.visible = (mode == CMYK) ? true : false;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 5, 0, 0];

    var value1 = group5.add('statictext', undefined, undefined, { name: 'value1' });
    value1.text = (mode == CMYK) ? 0 : maxvalue;
    value1.preferredSize.width = 26;
    value1.preferredSize.height = 20;

    var value2 = group5.add('statictext', undefined, undefined, { name: 'value2' });
    value2.text = (mode == CMYK) ? maxvalue : 0;
    value2.preferredSize.width = 26;
    value2.preferredSize.height = 20;

    var value3 = group5.add('statictext', undefined, undefined, { name: 'value3' });
    value3.text = (mode == CMYK) ? maxvalue : 0;
    value3.preferredSize.width = 26;
    value3.preferredSize.height = 20;

    var value4 = group5.add('statictext', undefined, undefined, { name: 'value4' });
    value4.text = '0';
    value4.preferredSize.width = 26;
    value4.preferredSize.height = 20;
    value4.visible = (mode == CMYK) ? true : false;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;
    group6.alignment = ['right', 'top'];

    var cancel = group6.add('button', undefined, undefined, { name: 'Cancel' });
    cancel.text = ui.cancel;
    cancel.preferredSize.width = 90;

    var ok = group6.add('button', undefined, undefined, { name: 'OK' });
    ok.text = ui.ok;
    ok.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    slider1.onChanging = function() {
        value1.text = Math.round(slider1.value);
    }

    slider2.onChanging = function() {
        value2.text = Math.round(slider2.value);
    }

    slider3.onChanging = function() {
        value3.text = Math.round(slider3.value);
    }

    slider4.onChanging = function() {
        value4.text = Math.round(slider4.value);
    }

    cancel.onClick = function() {
        dialog.close();
    }

    dialog.word = edittext1;
    dialog.caps = checkbox1;
    dialog.color1 = slider1;
    dialog.color2 = slider2;
    dialog.color3 = slider3;
    dialog.color4 = slider4;
    dialog.ok = ok;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Highlight Word',
            ja: '文字列の色を変更'
        },
        word: {
            en: 'Word:',
            ja: '単語:'
        },
        caps: {
            en: 'Match Case',
            ja: '大文字と小文字を区別'
        },
        panel: {
            en: 'Color',
            ja: 'カラー'
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
