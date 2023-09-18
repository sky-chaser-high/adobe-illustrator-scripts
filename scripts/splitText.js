/* ===============================================================================================================================================
   splitText

   Description
   This script splits a point text by lines, words, or characters.

   Usage
   1. Select any point text objects, run this script from File > Scripts > Other Script...
   2. Select lines, words, or characters.

   Notes
   Area types are not supported.
   If there are many characters, it will take time to split them.
   After splitting, the text position may move slightly.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var texts = getTextFrames(app.activeDocument.selection);
    if (!texts.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var flag = {
            line: dialog.line.value,
            word: dialog.word.value,
            character: dialog.character.value
        };

        for (var i = 0; i < texts.length; i++) {
            splitText(texts[i], flag);
        }

        texts = getTextFrames(app.activeDocument.selection);
        for (var i = 0; i < texts.length; i++) {
            removeSpace(texts[i]);
        }
        dialog.close();
    }

    dialog.show();
}


function splitText(item, flag) {
    var contents, length;
    var position = {
        x: item.position[0],
        y: item.position[1]
    };

    if (flag.line) length = item.lines.length;
    if (flag.word) length = item.words.length;
    if (flag.character) length = item.textRanges.length;

    for (var i = 0; i < length - 1; i++) {
        if (flag.line) contents = item.lines[0];
        if (flag.word) contents = item.words[0];
        if (flag.character) contents = item.textRanges[0];
        item = split(item, contents, position, flag);
    }
}


function split(text, word, position, flag) {
    var x = text.position[0];
    var y = text.position[1];
    var item = text.duplicate();

    var end = (flag.word && hasPeriod(text, word)) ? getPeriodPosition(text) : word.end;
    var last = text.textRanges.length;

    text = removeContents(text, end, last);
    text = move(text, x, y);

    item = removeContents(item, 0, end);
    if (hasLinefeed(item.contents)) {
        item = moveNextLine(item, position);
    }
    else {
        item = move(item, x + text.width, y - text.height);
    }

    return item;
}


function removeContents(text, start, end) {
    for (var i = end - 1; i >= start; i--) {
        var word = text.textRanges[i];
        word.remove();
    }
    return text;
}


function move(text, x, y) {
    var left = text.position[0];
    var top = text.position[1];
    if (text.orientation == TextOrientation.HORIZONTAL) {
        text.translate(x - left, 0);
    }
    else {
        text.translate(0, y - top);
    }
    return text;
}


function moveNextLine(text, position) {
    text.textRanges[0].remove();
    var left = text.position[0];
    var top = text.position[1];
    var range = text.textRange;
    var attributes = range.characterAttributes;
    if (text.orientation == TextOrientation.HORIZONTAL) {
        text.translate(position.x - left, attributes.leading * -1);
    }
    else {
        text.translate(attributes.leading * -1, position.y - top);
    }
    return text;
}


function hasLinefeed(text) {
    var linefeed = /^\r|^\u0003/;
    if (linefeed.test(text)) return true;
    return false;
}


function hasPeriod(text, word) {
    var contents = text.textRanges[word.end].contents;
    var regex = /,|\.|:|;/;
    if (regex.test(contents)) return true;
    return false;
}


function getPeriodPosition(text) {
    var contents = text.contents;
    var regex = /(,|\.|:|;)\s*/g;
    regex.exec(contents);
    return regex.lastIndex - 1;
}


function removeSpace(text) {
    var w1 = text.width;
    var h1 = text.height;

    var word = text.textRanges[0];
    var regex = /^\s/;
    if (regex.test(word.contents)) word.remove();

    var w2 = text.width;
    var h2 = text.height;

    var attributes = text.textRange.paragraphAttributes;
    if (attributes.justification == Justification.CENTER) return;
    if (attributes.justification == Justification.RIGHT) return;

    text.translate(w1 - w2, h2 - h1);
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind == TextType.POINTTEXT) {
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

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.panel;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var radiobutton1 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.line;
    radiobutton1.value = true;

    var radiobutton2 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.word;

    var radiobutton3 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.character;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.line = radiobutton1;
    dialog.word = radiobutton2;
    dialog.character = radiobutton3;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Split Text',
            ja: '文字列を分割'
        },
        panel: {
            en: 'Split',
            ja: '分割'
        },
        line: {
            en: 'Lines',
            ja: '行'
        },
        word: {
            en: 'Words',
            ja: '単語'
        },
        character: {
            en: 'Characters',
            ja: '文字'
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
