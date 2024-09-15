/* ===============================================================================================================================================
   highlightWord

   Description
   This script highlights the searched string by fill color, swatch or character style.
   Both CMYK and RGB colors are supported.

   Usage
   1. Select any text objects, run this script from File > Scripts > Other Script...
      If no texts are selected, it highlights all texts in the document.
   2. Enter a string in the Find field. Regular expressions are supported.
   3. To specify a color, enter the color values or use the sliders
   4. To specify a swatch, select a swatch name from the list on the Swatches tab and check the Ignore Color Settings checkbox.
   5. To specify a character style, select a style name from the list on the Character Styles tab.
   6. To specify a paragraph style, select a style name from the list on the Paragraph Styles tab.

   Notes
   Color and swatch cannot be applied at the same time.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

   Version
   1.2.0

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
        var word = dialog.find.text;
        if (!word) return dialog.close();
        var caps = dialog.caps.value;
        var ignore = dialog.ignore.value;
        var color = (ignore) ? getSwatch(dialog) : getColor(dialog);
        var style = {
            character: getCharacterStyle(dialog),
            paragraph: getParagraphStyle(dialog)
        };
        if (ignore && color) ignore = false;
        highlight(word, texts, color, style, caps, ignore);
        dialog.close();
    }

    dialog.show();
}


function highlight(word, texts, color, style, caps, override) {
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var words = getWordIndexes(text.contents, word, caps);
        applyColor(text, words, color, style, override);
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


function applyColor(text, words, color, style, override) {
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var index = word.index;
        for (var j = 0; j < word.length; j++) {
            var range = text.textRanges[index + j];
            var attributes = range.characterAttributes;
            if (color) attributes.fillColor = color;
            if (style.character) style.character.applyTo(range, override);
            if (style.paragraph) style.paragraph.applyTo(range, override);
        }
    }
}


function getColor(dialog) {
    var mode = app.activeDocument.documentColorSpace;
    switch (mode) {
        case DocumentColorSpace.CMYK:
            var c = Math.round(dialog.color1.value);
            var m = Math.round(dialog.color2.value);
            var y = Math.round(dialog.color3.value);
            var k = Math.round(dialog.color4.value);
            return setCMYKColor(c, m, y, k);
        case DocumentColorSpace.RGB:
            var r = Math.round(dialog.color1.value);
            var g = Math.round(dialog.color2.value);
            var b = Math.round(dialog.color3.value);
            return setRGBColor(r, g, b);
    }
}


function getSwatch(dialog) {
    var swatch = dialog.swatches.selection;
    if (!swatch) return;
    var name = swatch.toString();
    var swatches = app.activeDocument.swatches;
    return swatches[name].color;
}


function getCharacterStyle(dialog) {
    var style = dialog.charStyles.selection;
    if (!style) return;
    var name = style.toString();
    var styles = app.activeDocument.characterStyles;
    return styles[name];
}


function getParagraphStyle(dialog) {
    var style = dialog.paraStyles.selection;
    if (!style) return;
    var name = style.toString();
    var styles = app.activeDocument.paragraphStyles;
    return styles[name];
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


function getSwatchNames() {
    var items = [];
    var swatches = app.activeDocument.swatches;
    for (var i = 0; i < swatches.length; i++) {
        var swatch = swatches[i];
        try {
            items.push(swatch.name);
        }
        catch (err) { }
    }
    return items;
}


function getCharacterStyleNames() {
    var items = [];
    var styles = app.activeDocument.characterStyles;
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        try {
            items.push(style.name);
        }
        catch (err) { }
    }
    return items;
}


function getParagraphStyleNames() {
    var items = [];
    var styles = app.activeDocument.paragraphStyles;
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        try {
            items.push(style.name);
        }
        catch (err) { }
    }
    return items;
}


function getTextFrames(items) {
    if (!items.length) return app.activeDocument.textFrames;
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
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();

    var mode = app.activeDocument.documentColorSpace;
    var CMYK = DocumentColorSpace.CMYK;
    var label = {
        name1: (mode == CMYK) ? 'C' : 'R',
        name2: (mode == CMYK) ? 'M' : 'G',
        name3: (mode == CMYK) ? 'Y' : 'B',
        name4: (mode == CMYK) ? 'K' : ''
    };
    var maxvalue = (mode == CMYK) ? 100 : 255;

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 4, 0, 0];
    group2.alignment = ['left', 'top'];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.find;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;
    group3.alignment = ['fill', 'center'];

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.active = true;

    var checkbox1 = group3.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.caps;

    var tpanel1 = dialog.add('tabbedpanel', undefined, undefined, { name: 'tpanel1' });
    tpanel1.alignChildren = 'fill';
    tpanel1.margins = 0;

    var tab1 = tpanel1.add('tab', undefined, undefined, { name: 'tab1' });
    tab1.text = ui.color;
    tab1.orientation = 'column';
    tab1.alignChildren = ['fill', 'top'];
    tab1.spacing = 10;
    tab1.margins = 10;

    var group4 = tab1.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var group5 = group4.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['center', 'center'];
    group5.spacing = 18;
    group5.margins = 0;
    group5.alignment = ['left', 'center'];

    var statictext2 = group5.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = label.name1;

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = label.name2;

    var statictext4 = group5.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = label.name3;

    var statictext5 = group5.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = label.name4;
    statictext5.visible = (mode == CMYK) ? true : false;

    var group6 = group4.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['fill', 'center'];
    group6.spacing = 16;
    group6.margins = 0;
    group6.alignment = ['fill', 'center'];

    var slider1 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = maxvalue;
    slider1.value = (mode == CMYK) ? 0 : maxvalue;

    var slider2 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = maxvalue;
    slider2.value = (mode == CMYK) ? maxvalue : 0;

    var slider3 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = maxvalue;
    slider3.value = (mode == CMYK) ? maxvalue : 0;

    var slider4 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = maxvalue;
    slider4.value = 0;
    slider4.visible = (mode == CMYK) ? true : false;

    var group7 = group4.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;
    group7.alignment = ['right', 'center'];

    var edittext2 = group7.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = (mode == CMYK) ? 0 : maxvalue;
    edittext2.preferredSize.width = 40;

    var edittext3 = group7.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = (mode == CMYK) ? maxvalue : 0;
    edittext3.preferredSize.width = 40;

    var edittext4 = group7.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = (mode == CMYK) ? maxvalue : 0;
    edittext4.preferredSize.width = 40;

    var edittext5 = group7.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '0';
    edittext5.preferredSize.width = 40;
    edittext5.visible = (mode == CMYK) ? true : false;

    var tab2 = tpanel1.add('tab', undefined, undefined, { name: 'tab2' });
    tab2.text = ui.swatch;
    tab2.orientation = 'column';
    tab2.alignChildren = ['fill', 'top'];
    tab2.spacing = 10;
    tab2.margins = 10;

    var listbox1_array = getSwatchNames();
    var listbox1 = tab2.add('listbox', undefined, undefined, { name: 'listbox1', items: listbox1_array });
    listbox1.preferredSize.height = 200;

    var tab3 = tpanel1.add('tab', undefined, undefined, { name: 'tab3' });
    tab3.text = ui.charStyle;
    tab3.orientation = 'column';
    tab3.alignChildren = ['fill', 'top'];
    tab3.spacing = 10;
    tab3.margins = 10;

    var listbox2_array = getCharacterStyleNames();
    var listbox2 = tab3.add('listbox', undefined, undefined, { name: 'listbox2', items: listbox2_array });
    listbox2.preferredSize.height = 200;

    var tab4 = tpanel1.add('tab', undefined, undefined, { name: 'tab4' });
    tab4.text = ui.paraStyle;
    tab4.orientation = 'column';
    tab4.alignChildren = ['fill', 'top'];
    tab4.spacing = 10;
    tab4.margins = 10;

    var listbox3_array = getParagraphStyleNames();
    var listbox3 = tab4.add('listbox', undefined, undefined, { name: 'listbox3', items: listbox3_array });
    listbox3.preferredSize.height = 200;

    tpanel1.selection = tab1;

    var group8 = dialog.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var checkbox2 = group8.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.ignore;

    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var button1 = group9.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group9.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    listbox1.onChange = function() {
        var item = listbox1.selection;
        if (item) checkbox2.value = true;
    }

    listbox2.onChange = function() {
        var item = listbox2.selection;
        if (item) checkbox2.value = true;
    }

    listbox3.onChange = function() {
        var item = listbox3.selection;
        if (item) checkbox2.value = true;
    }

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

    slider1.onChanging = function() {
        edittext2.text = Math.round(slider1.value);
    }

    slider2.onChanging = function() {
        edittext3.text = Math.round(slider2.value);
    }

    slider3.onChanging = function() {
        edittext4.text = Math.round(slider3.value);
    }

    slider4.onChanging = function() {
        edittext5.text = Math.round(slider4.value);
    }

    edittext2.onChanging = function() {
        slider1.value = Math.round(edittext2.text);
    }

    edittext3.onChanging = function() {
        slider2.value = Math.round(edittext3.text);
    }

    edittext4.onChanging = function() {
        slider3.value = Math.round(edittext4.text);
    }

    edittext5.onChanging = function() {
        slider4.value = Math.round(edittext5.text);
    }

    button1.onClick = function() {
        dialog.close();
    }

    dialog.find = edittext1;
    dialog.caps = checkbox1;
    dialog.color1 = slider1;
    dialog.color2 = slider2;
    dialog.color3 = slider3;
    dialog.color4 = slider4;
    dialog.swatches = listbox1;
    dialog.charStyles = listbox2;
    dialog.paraStyles = listbox3;
    dialog.ignore = checkbox2;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Highlight Word',
            ja: '文字列の色を変更'
        },
        find: {
            en: 'Find:',
            ja: '検索文字列:'
        },
        caps: {
            en: 'Match Case',
            ja: '大文字と小文字を区別'
        },
        color: {
            en: 'Color',
            ja: 'カラー'
        },
        swatch: {
            en: 'Swatches',
            ja: 'スウォッチ'
        },
        charStyle: {
            en: 'Character Styles',
            ja: '文字スタイル'
        },
        paraStyle: {
            en: 'Paragraph Styles',
            ja: '段落スタイル'
        },
        ignore: {
            en: 'Ignore Color Settings',
            ja: 'カラー設定を無視'
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
