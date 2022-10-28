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
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   UI
   ScriptUI Dialog Builder (SDB) was used for the UI design tool.
   https://scriptui.joonas.me/

   Requirements
   Illustrator CS4 or higher

   Version
   1.2.0

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
    var texts = getTextFrames(app.activeDocument.selection);
    var colors = getOriginalColor(texts);

    var dialog = showDialog();
    var threshold = {
        color1: dialog.threshold1.value,
        color2: dialog.threshold2.value,
        color3: dialog.threshold3.value,
        color4: dialog.threshold4.value
    };
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

    dialog.center();
    dialog.show();
}


function setRandomColorWord(dialog, texts, threshold) {
    var mode = app.activeDocument.documentColorSpace;
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;
        for (var j = 0; j < texts[i].words.length; j++) {
            var word = texts[i].words[j].characterAttributes;
            switch (mode) {
                case DocumentColorSpace.CMYK:
                    var c = Math.round(Math.random() * threshold.color1);
                    var m = Math.round(Math.random() * threshold.color2);
                    var y = Math.round(Math.random() * threshold.color3);
                    var k = Math.round(Math.random() * threshold.color4);
                    word.fillColor = setCMYK(c, m, y, k);
                    break;
                case DocumentColorSpace.RGB:
                    var r = Math.round(Math.random() * threshold.color1);
                    var g = Math.round(Math.random() * threshold.color2);
                    var b = Math.round(Math.random() * threshold.color3);
                    word.fillColor = setRGB(r, g, b);
                    break;
            }
            dialog.progressbar.value += dialog.progressbar.maxvalue / texts[i].words.length;
            dialog.update();
        }
    }
    app.redraw();
}


function setRandomColorChar(dialog, texts, threshold) {
    var mode = app.activeDocument.documentColorSpace;
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;
        for (var j = 0; j < texts[i].textRanges.length; j++) {
            var character = texts[i].textRanges[j].characterAttributes;
            switch (mode) {
                case DocumentColorSpace.CMYK:
                    var c = Math.round(Math.random() * threshold.color1);
                    var m = Math.round(Math.random() * threshold.color2);
                    var y = Math.round(Math.random() * threshold.color3);
                    var k = Math.round(Math.random() * threshold.color4);
                    character.fillColor = setCMYK(c, m, y, k);
                    break;
                case DocumentColorSpace.RGB:
                    var r = Math.round(Math.random() * threshold.color1);
                    var g = Math.round(Math.random() * threshold.color2);
                    var b = Math.round(Math.random() * threshold.color3);
                    character.fillColor = setRGB(r, g, b);
                    break;
            }
            dialog.progressbar.value += dialog.progressbar.maxvalue / texts[i].textRanges.length;
            dialog.update();
        }
    }
    app.redraw();
}


function setRandomColorSentence(dialog, texts, threshold) {
    var mode = app.activeDocument.documentColorSpace;
    for (var i = 0; i < texts.length; i++) {
        dialog.progressbar.value = 0;

        var text = texts[i].contents;
        var sentences = text.split(/,|\.|:|;|。/g);

        var color, counter = 0, chars = 0;
        for (var j = 0; j < sentences.length; j++) {
            switch (mode) {
                case DocumentColorSpace.CMYK:
                    var c = Math.round(Math.random() * threshold.color1);
                    var m = Math.round(Math.random() * threshold.color2);
                    var y = Math.round(Math.random() * threshold.color3);
                    var k = Math.round(Math.random() * threshold.color4);
                    color = setCMYK(c, m, y, k);
                    break;
                case DocumentColorSpace.RGB:
                    var r = Math.round(Math.random() * threshold.color1);
                    var g = Math.round(Math.random() * threshold.color2);
                    var b = Math.round(Math.random() * threshold.color3);
                    color = setRGB(r, g, b);
                    break;
            }

            counter = chars;

            chars += sentences[j].length;
            if (j < sentences.length - 1) chars++;

            for (var k = counter; k < chars; k++) {
                var character = texts[i].textRanges[k].characterAttributes;
                character.fillColor = color;

                dialog.progressbar.value += dialog.progressbar.maxvalue / (texts[i].textRanges.length - 1);
                dialog.update();
            }
        }
    }
    app.redraw();
}


function handleRandomColor(dialog, texts) {
    var threshold = {
        color1: Math.round(dialog.threshold1.value),
        color2: Math.round(dialog.threshold2.value),
        color3: Math.round(dialog.threshold3.value),
        color4: Math.round(dialog.threshold4.value)
    };
    if (dialog.word.value) setRandomColorWord(dialog, texts, threshold);
    if (dialog.character.value) setRandomColorChar(dialog, texts, threshold);
    if (dialog.sentence.value) setRandomColorSentence(dialog, texts, threshold);
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'TextFrame') {
            texts.push(items[i]);
        }
        else if (items[i].typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(items[i].pageItems));
        }
    }
    return texts;
}


function revertTextColors(texts, colors) {
    for (var i = 0; i < texts.length; i++) {
        for (var j = 0; j < texts[i].words.length; j++) {
            var word = texts[i].words[j].characterAttributes;
            word.fillColor = colors[i][j];
        }
    }
}


function getOriginalColor(texts) {
    var colors = [];
    for (var i = 0; i < texts.length; i++) {
        colors[i] = [];
        for (var j = 0; j < texts[i].words.length; j++) {
            var word = texts[i].words[j].characterAttributes;
            colors[i].push(word.fillColor);
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


function showDialog() {
    var language = getLanguage();

    var mode = app.activeDocument.documentColorSpace;
    var label = {
        name1: (mode == DocumentColorSpace.CMYK) ? 'C' : 'R',
        name2: (mode == DocumentColorSpace.CMYK) ? 'M' : 'G',
        name3: (mode == DocumentColorSpace.CMYK) ? 'Y' : 'B',
        name4: (mode == DocumentColorSpace.CMYK) ? 'K' : ''
    };
    var threshold = (mode == DocumentColorSpace.CMYK) ? 100 : 255;

    var dialog = new Window('dialog');
    dialog.text = language.title;
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
    panel1.text = language.panel;
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
    statictext4.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

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
    slider4.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

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
    statictext8.visible = (mode == DocumentColorSpace.CMYK) ? true : false;

    var group8 = group3.add('group', undefined, { name: 'group8' });
    group8.orientation = 'column';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 8, 0, 0];

    var button1 = group8.add('button', undefined, undefined, { name: 'random' });
    button1.text = language.random;
    button1.preferredSize.width = 80;

    var button2 = group8.add('button', undefined, undefined, { name: 'ok' });
    button2.text = language.ok;
    button2.preferredSize.width = 80;

    var button3 = group8.add('button', undefined, undefined, { name: 'cancel' });
    button3.text = language.cancel;
    button3.preferredSize.width = 80;

    var group9 = group2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'column';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var panel2 = group9.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = language.option;
    panel2.preferredSize.width = 231;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 5;
    panel2.margins = [10, 15, 10, 5];

    var radiobutton1 = panel2.add('radiobutton', undefined, undefined, { name: 'word' });
    radiobutton1.text = language.word;
    radiobutton1.preferredSize.height = 20;
    radiobutton1.value = true;

    var radiobutton2 = panel2.add('radiobutton', undefined, undefined, { name: 'character' });
    radiobutton2.text = language.character;
    radiobutton2.preferredSize.height = 20;

    var radiobutton3 = panel2.add('radiobutton', undefined, undefined, { name: 'sentence' });
    radiobutton3.text = language.sentence;
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


function getLanguage() {
    var language = {
        en_US: {
            title: 'Random Text Color',
            panel: 'Threshold',
            option: 'Option',
            word: 'Word',
            character: 'Character',
            sentence: 'Sentence',
            random: 'Random',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'Random Text Color',
            panel: 'しきい値',
            option: 'オプション',
            word: '単語',
            character: '文字',
            sentence: '文',
            random: 'ランダム',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };
    return language[app.locale] || language.en_US;
}
