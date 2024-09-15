/* ===============================================================================================================================================
   randomTextColor

   Description
   This script changes the text color randomly by word, character or sentence.
   Both CMYK and RGB colors are supported.

   Usage
   1. Select any text objects, run this script from File > Scripts > Other Script...
   2. Enter the color values or use the sliders to set the threshold.
   3. Click the Random button to change the color according to the threshold value.

   Notes
   If there are many characters, the conversion will take time.
   Some characters, such as periods and commas, are not applied.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.3.0

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

    dialog.notice.onClick = function() {
        dialog.cancel.notify('onClick');
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
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 0;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 0;
    group1.margins = 0;

    var progressbar1 = group1.add('progressbar', undefined, undefined, { name: 'progressbar1' });
    progressbar1.maxvalue = 100;
    progressbar1.value = 0;
    progressbar1.preferredSize.height = 2;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['fill', 'center'];
    group2.spacing = 10;
    group2.margins = [16, 5, 16, 0];

    var panel1 = group2.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.threshold;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 4, 0, 0];

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['center', 'center'];
    group4.spacing = 18;
    group4.margins = 0;
    group4.alignment = ['left', 'center'];

    var statictext1 = group4.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = label.name1;

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = label.name2;

    var statictext3 = group4.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = label.name3;

    var statictext4 = group4.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = label.name4;
    statictext4.visible = (mode == CMYK) ? true : false;

    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.preferredSize.width = 100;
    group5.orientation = 'column';
    group5.alignChildren = ['fill', 'center'];
    group5.spacing = 16;
    group5.margins = 0;
    group5.alignment = ['fill', 'center'];

    var slider1 = group5.add('slider', undefined, undefined, undefined, undefined, { name: 'slider1' });
    slider1.minvalue = 0;
    slider1.maxvalue = threshold;
    slider1.value = threshold;

    var slider2 = group5.add('slider', undefined, undefined, undefined, undefined, { name: 'slider2' });
    slider2.minvalue = 0;
    slider2.maxvalue = threshold;
    slider2.value = threshold;

    var slider3 = group5.add('slider', undefined, undefined, undefined, undefined, { name: 'slider3' });
    slider3.minvalue = 0;
    slider3.maxvalue = threshold;
    slider3.value = threshold;

    var slider4 = group5.add('slider', undefined, undefined, undefined, undefined, { name: 'slider4' });
    slider4.minvalue = 0;
    slider4.maxvalue = threshold;
    slider4.value = 0;
    slider4.visible = (mode == CMYK) ? true : false;

    var group6 = group3.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;
    group6.alignment = ['right', 'center'];

    var edittext1 = group6.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = threshold;
    edittext1.preferredSize.width = 40;
    edittext1.active = true;

    var edittext2 = group6.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = threshold;
    edittext2.preferredSize.width = 40;

    var edittext3 = group6.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = threshold;
    edittext3.preferredSize.width = 40;

    var edittext4 = group6.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '0';
    edittext4.preferredSize.width = 40;
    edittext4.visible = (mode == CMYK) ? true : false;

    var group7 = dialog.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['fill', 'center'];
    group7.spacing = 10;
    group7.margins = [16, 0, 16, 0];

    var panel2 = group7.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.options;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group8 = panel2.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 6, 0, 0];

    var radiobutton1 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.word;
    radiobutton1.value = true;

    var radiobutton2 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.character;

    var radiobutton3 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.sentence;

    var group9 = dialog.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 10;
    group9.margins = [16, 0, 16, 16];

    var button1 = group9.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.random;
    button1.preferredSize.width = 90;

    // Work around the problem of not being able to undo with the esc key due to localization.
    var button0 = group9.add('button', undefined, undefined, { name: 'button0' });
    button0.text = 'Cancel';
    button0.preferredSize.width = 20;
    button0.hide();

    var button2 = group9.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.cancel;
    button2.preferredSize.width = 90;

    var button3 = group9.add('button', undefined, undefined, { name: 'button3' });
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

    slider1.onChanging = function() {
        edittext1.text = Math.round(slider1.value);
    }

    slider2.onChanging = function() {
        edittext2.text = Math.round(slider2.value);
    }

    slider3.onChanging = function() {
        edittext3.text = Math.round(slider3.value);
    }

    slider4.onChanging = function() {
        edittext4.text = Math.round(slider4.value);
    }

    edittext1.onChanging = function() {
        slider1.value = Math.round(edittext1.text);
    }

    edittext2.onChanging = function() {
        slider2.value = Math.round(edittext2.text);
    }

    edittext3.onChanging = function() {
        slider3.value = Math.round(edittext3.text);
    }

    edittext4.onChanging = function() {
        slider4.value = Math.round(edittext4.text);
    }

    dialog.threshold1 = slider1;
    dialog.threshold2 = slider2;
    dialog.threshold3 = slider3;
    dialog.threshold4 = slider4;
    dialog.word = radiobutton1;
    dialog.character = radiobutton2;
    dialog.sentence = radiobutton3;
    dialog.progressbar = progressbar1;
    dialog.random = button1;
    dialog.notice = button2;
    dialog.cancel = button0;
    dialog.ok = button3;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Random Text Color',
            ja: 'ランダムに配色'
        },
        threshold: {
            en: 'Threshold',
            ja: 'しきい値'
        },
        options: {
            en: 'Options',
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
