/* ===============================================================================================================================================
   randomTextColor

   Description
   This script changes the text color randomly by word, character or sentence.
   Both CMYK and RGB colors are supported.

   Usage
   1. Select the text objects, run this script from File > Scripts > Other Script...
   2. Assign the threshold value with the slider.
   3. Click the Random button to assign a color according to the threshold value.

   Notes
   If there are many characters, the conversion will take time.
   Some characters, such as periods and commas, are not applied.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.2.1

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
    var colors = getOriginalColor(texts);

    var dialog = showDialog();
    var threshold = getThreshold(dialog);
    setRandomColorWord(dialog, texts, threshold);

    dialog.random.onClick = function() {
        handleRandomColor(dialog, texts);
        dialog.random.active = true;
        dialog.random.active = false;
    }

    dialog.word.onClick = function() {
        handleRandomColor(dialog, texts);
    }

    dialog.character.onClick = function() {
        handleRandomColor(dialog, texts);
    }

    dialog.sentence.onClick = function() {
        handleRandomColor(dialog, texts);
    }

    dialog.cancel.onClick = function() {
        revertTextColors(texts, colors);
        app.redraw();
        dialog.close();
    }

    dialog.show();
}


function handleRandomColor(dialog, texts) {
    var threshold = getThreshold(dialog);
    if (dialog.word.value) setRandomColorWord(dialog, texts, threshold);
    if (dialog.character.value) setRandomColorChar(dialog, texts, threshold);
    if (dialog.sentence.value) setRandomColorSentence(dialog, texts, threshold);
}


function getThreshold(dialog) {
    return {
        color1: Math.round(dialog.threshold1.value),
        color2: Math.round(dialog.threshold2.value),
        color3: Math.round(dialog.threshold3.value),
        color4: Math.round(dialog.threshold4.value)
    };
}


function setRandomColorWord(dialog, texts, threshold) {
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;
        var text = texts[i];
        for (var j = 0; j < text.words.length; j++) {
            var word = text.words[j];
            var attributes = word.characterAttributes;
            attributes.fillColor = setColor(threshold);

            dialog.progressbar.value += dialog.progressbar.maxvalue / text.words.length;
            dialog.update();
        }
    }
    app.redraw();
}


function setRandomColorChar(dialog, texts, threshold) {
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;
        var text = texts[i];
        for (var j = 0; j < text.textRanges.length; j++) {
            var range = text.textRanges[j];
            var attributes = range.characterAttributes;
            attributes.fillColor = setColor(threshold);

            dialog.progressbar.value += dialog.progressbar.maxvalue / text.textRanges.length;
            dialog.update();
        }
    }
    app.redraw();
}


function setRandomColorSentence(dialog, texts, threshold) {
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;

        var text = texts[i];
        var contents = text.contents;
        var sentences = contents.split(/,|\.|:|;|。/g);

        var counter = 0, chars = 0;
        for (var j = 0; j < sentences.length; j++) {
            var color = setColor(threshold);

            counter = chars;
            chars += sentences[j].length;
            if (j < sentences.length - 1) chars++;

            for (var k = counter; k < chars; k++) {
                var range = text.textRanges[k];
                var attributes = range.characterAttributes;
                attributes.fillColor = color;

                dialog.progressbar.value += dialog.progressbar.maxvalue / (text.textRanges.length - 1);
                dialog.update();
            }
        }
    }
    app.redraw();
}


function setColor(threshold) {
    var mode = app.activeDocument.documentColorSpace;
    switch (mode) {
        case DocumentColorSpace.CMYK:
            var c = Math.round(Math.random() * threshold.color1);
            var m = Math.round(Math.random() * threshold.color2);
            var y = Math.round(Math.random() * threshold.color3);
            var k = Math.round(Math.random() * threshold.color4);
            return setCMYK(c, m, y, k);
        case DocumentColorSpace.RGB:
            var r = Math.round(Math.random() * threshold.color1);
            var g = Math.round(Math.random() * threshold.color2);
            var b = Math.round(Math.random() * threshold.color3);
            return setRGB(r, g, b);
    }
}


function revertTextColors(texts, colors) {
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        for (var j = 0; j < text.words.length; j++) {
            var word = text.words[j];
            var attributes = word.characterAttributes;
            attributes.fillColor = colors[i][j];
        }
    }
}


function getOriginalColor(texts) {
    var colors = [];
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        colors[i] = [];
        for (var j = 0; j < text.words.length; j++) {
            var word = text.words[j];
            var attributes = word.characterAttributes;
            colors[i].push(attributes.fillColor);
        }
    }
    return colors;
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
    var threshold = (mode == CMYK) ? 100 : 255;

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = [0, 0, 0, 0];

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 0;
    group1.margins = [0, 0, 0, 0];

    var progressbar1 = group1.add('progressbar', undefined, undefined, { name: 'progressbar1' });
    progressbar1.maxvalue = 100;
    progressbar1.value = 0;
    progressbar1.preferredSize.width = 343;
    progressbar1.preferredSize.height = 2;
    progressbar1.alignment = ['left', 'top'];

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [10, 0, 10, 10];

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'top'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var panel1 = group4.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.panel;
    panel1.orientation = 'row';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['center', 'center'];
    group5.spacing = 5;
    group5.margins = 0;
    group5.alignment = ['left', 'center'];

    var statictext1 = group5.add('statictext', undefined, undefined, { name: 'color1' });
    statictext1.text = label.name1;
    statictext1.preferredSize.height = 20;

    var statictext2 = group5.add('statictext', undefined, undefined, { name: 'color2' });
    statictext2.text = label.name2;
    statictext2.preferredSize.height = 20;

    var statictext3 = group5.add('statictext', undefined, undefined, { name: 'color3' });
    statictext3.text = label.name3;
    statictext3.preferredSize.height = 20;

    var statictext4 = group5.add('statictext', undefined, undefined, { name: 'color4' });
    statictext4.text = label.name4;
    statictext4.preferredSize.height = 20;
    statictext4.visible = (mode == CMYK) ? true : false;

    var group6 = panel1.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 4;
    group6.margins = [0, 2, 0, 0];
    group6.alignment = ['left', 'center'];

    var slider1 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = threshold;
    slider1.value = threshold;
    slider1.preferredSize.width = 150;
    slider1.preferredSize.height = 20;

    var slider2 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = threshold;
    slider2.value = threshold;
    slider2.preferredSize.width = 150;
    slider2.preferredSize.height = 20;

    var slider3 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = threshold;
    slider3.value = threshold;
    slider3.preferredSize.width = 150;
    slider3.preferredSize.height = 20;

    var slider4 = group6.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = threshold;
    slider4.value = 0;
    slider4.preferredSize.width = 150;
    slider4.preferredSize.height = 20;
    slider4.visible = (mode == CMYK) ? true : false;

    var group7 = panel1.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 5;
    group7.margins = 0;
    group7.alignment = ['left', 'center'];

    var statictext5 = group7.add('statictext', undefined, undefined, { name: 'value1' });
    statictext5.text = threshold;
    statictext5.preferredSize.width = 26;
    statictext5.preferredSize.height = 20;

    var statictext6 = group7.add('statictext', undefined, undefined, { name: 'value2' });
    statictext6.text = threshold;
    statictext6.preferredSize.width = 26;
    statictext6.preferredSize.height = 20;

    var statictext7 = group7.add('statictext', undefined, undefined, { name: 'value3' });
    statictext7.text = threshold;
    statictext7.preferredSize.width = 26;
    statictext7.preferredSize.height = 20;

    var statictext8 = group7.add('statictext', undefined, undefined, { name: 'value4' });
    statictext8.text = '0';
    statictext8.preferredSize.width = 26;
    statictext8.preferredSize.height = 20;
    statictext8.visible = (mode == CMYK) ? true : false;

    var group8 = group3.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 8, 0, 0];

    var button1 = group8.add('button', undefined, undefined, { name: 'random' });
    button1.text = ui.random;
    button1.preferredSize.width = 80;

    var button2 = group8.add('button', undefined, undefined, { name: 'ok' });
    button2.text = ui.ok;
    button2.preferredSize.width = 80;

    var button3 = group8.add('button', undefined, undefined, { name: 'cancel' });
    button3.text = ui.cancel;
    button3.preferredSize.width = 80;

    var group9 = group2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var panel2 = group9.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.option;
    panel2.preferredSize.width = 231;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 5;
    panel2.margins = [10, 15, 10, 5];

    var radiobutton1 = panel2.add('radiobutton', undefined, undefined, { name: 'word' });
    radiobutton1.text = ui.word;
    radiobutton1.preferredSize.height = 20;
    radiobutton1.value = true;

    var radiobutton2 = panel2.add('radiobutton', undefined, undefined, { name: 'character' });
    radiobutton2.text = ui.character;
    radiobutton2.preferredSize.height = 20;

    var radiobutton3 = panel2.add('radiobutton', undefined, undefined, { name: 'sentence' });
    radiobutton3.text = ui.sentence;
    radiobutton3.preferredSize.height = 20;

    slider1.onChanging = function() {
        statictext5.text = Math.round(slider1.value);
    }

    slider2.onChanging = function() {
        statictext6.text = Math.round(slider2.value);
    }

    slider3.onChanging = function() {
        statictext7.text = Math.round(slider3.value);
    }

    slider4.onChanging = function() {
        statictext8.text = Math.round(slider4.value);
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.threshold1 = slider1;
    dialog.threshold2 = slider2;
    dialog.threshold3 = slider3;
    dialog.threshold4 = slider4;
    dialog.label1 = statictext5;
    dialog.label2 = statictext6;
    dialog.label3 = statictext7;
    dialog.label4 = statictext8;
    dialog.word = radiobutton1;
    dialog.character = radiobutton2;
    dialog.sentence = radiobutton3;
    dialog.progressbar = progressbar1;
    dialog.random = button1;
    dialog.ok = button2;
    dialog.cancel = button3;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Random Text Color',
            ja: 'Random Text Color'
        },
        panel: {
            en: 'Threshold',
            ja: 'しきい値'
        },
        option: {
            en: 'Option',
            ja: 'オプション'
        },
        word: {
            en: 'Word',
            ja: '単語'
        },
        character: {
            en: 'Character',
            ja: '文字'
        },
        sentence: {
            en: 'Sentence',
            ja: '文'
        },
        random: {
            en: 'Random',
            ja: 'ランダム'
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
