/* ===============================================================================================================================================
   highlightWord

   Description
   This script highlights the searched words with the fill color.
   Both CMYK and RGB colors are supported.

   Usage
   1. Select the text objects, run this script from File > Scripts > Other Script...
   2. Type the word.
   3. Use the slider to determine the color if necessary.

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   UI
   ScriptUI Dialog Builder (SDB) was used for the UI design tool.
   https://scriptui.joonas.me/

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0

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
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var word = dialog.word.text;
        var color = getColor(dialog);
        var texts = getTextFrames(app.activeDocument.selection);
        for (var i = 0; i < texts.length; i++) {
            var indexes = getWordIndexes(word, texts[i].contents);
            applyColor(texts[i], indexes, word, color);
        }
        dialog.close();
    }

    dialog.show();
}


function getTextFrames(selections) {
    var items = [];
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].typename == 'TextFrame') {
            items.push(selections[i]);
        }
        else if (selections[i].typename == 'GroupItem') {
            items = items.concat(getTextFrames(selections[i].pageItems));
        }
    }
    return items;
}


function getWordIndexes(str, text) {
    var indexes = [];
    var word = new RegExp(str, 'g');
    var last = 0;
    var count = str.length;
    word.exec(text);
    while (last != word.lastIndex) {
        indexes.push(word.lastIndex - count);
        last = word.lastIndex;
        word.exec(text);
        if (word.lastIndex == 0) break;
    }
    return indexes;
}


function applyColor(text, indexes, word, color) {
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        for (var j = 0; j < word.length; j++) {
            var attributes = text.textRanges[index + j].characterAttributes;
            attributes.fillColor = color;
        }
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


function showDialog() {
    var mode = app.activeDocument.documentColorSpace;
    var label = {
        name1: (mode == DocumentColorSpace.CMYK) ? 'C' : 'R',
        name2: (mode == DocumentColorSpace.CMYK) ? 'M' : 'G',
        name3: (mode == DocumentColorSpace.CMYK) ? 'Y' : 'B',
        name4: (mode == DocumentColorSpace.CMYK) ? 'K' : ''
    };
    var maxvalue = (mode == DocumentColorSpace.CMYK) ? 100 : 255;

    var local = localize();

    var dialog = new Window('dialog');
    dialog.text = local.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = 10;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;
    group1.alignment = ['fill', 'top'];

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = local.word;
    statictext1.preferredSize.height = 20;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 185;
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 10, 0, 5];

    var panel1 = group2.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = local.panel;
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
    color4.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

    var group4 = panel1.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = 100;
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 5, 0, 0];

    var slider1 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = maxvalue;
    slider1.value = (mode == DocumentColorSpace.CMYK) ? 0 : maxvalue;
    slider1.preferredSize.width = 150;
    slider1.preferredSize.height = 20;

    var slider2 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = maxvalue;
    slider2.value = (mode == DocumentColorSpace.CMYK) ? maxvalue : 0;
    slider2.preferredSize.width = 150;
    slider2.preferredSize.height = 20;

    var slider3 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = maxvalue;
    slider3.value = (mode == DocumentColorSpace.CMYK) ? maxvalue : 0;
    slider3.preferredSize.width = 150;
    slider3.preferredSize.height = 20;

    var slider4 = group4.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = maxvalue;
    slider4.value = 0;
    slider4.preferredSize.width = 150;
    slider4.preferredSize.height = 20;
    slider4.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 5, 0, 0];

    var value1 = group5.add('statictext', undefined, undefined, { name: 'value1' });
    value1.text = (mode == DocumentColorSpace.CMYK) ? 0 : maxvalue;
    value1.preferredSize.width = 26;
    value1.preferredSize.height = 20;

    var value2 = group5.add('statictext', undefined, undefined, { name: 'value2' });
    value2.text = (mode == DocumentColorSpace.CMYK) ? maxvalue : 0;
    value2.preferredSize.width = 26;
    value2.preferredSize.height = 20;

    var value3 = group5.add('statictext', undefined, undefined, { name: 'value3' });
    value3.text = (mode == DocumentColorSpace.CMYK) ? maxvalue : 0;
    value3.preferredSize.width = 26;
    value3.preferredSize.height = 20;

    var value4 = group5.add('statictext', undefined, undefined, { name: 'value4' });
    value4.text = '0';
    value4.preferredSize.width = 26;
    value4.preferredSize.height = 20;
    value4.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;
    group6.alignment = ['right', 'top'];

    var cancel = group6.add('button', undefined, undefined, { name: 'Cancel' });
    cancel.text = 'Cancel';
    cancel.preferredSize.width = 80;

    var ok = group6.add('button', undefined, undefined, { name: 'OK' });
    ok.text = 'OK';
    ok.preferredSize.width = 80;


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
    dialog.color1 = slider1;
    dialog.color2 = slider2;
    dialog.color3 = slider3;
    dialog.color4 = slider4;
    dialog.ok = ok;

    return dialog;
}


function localize() {
    var language = {
        en_US: {
            title: 'Highlight Word',
            word: 'Word:',
            panel: 'Color'
        },
        ja_JP: {
            title: 'Highlight Word',
            word: '単語:',
            panel: 'カラー'
        }
    };
    return language[app.locale] || language.en_US;
}
