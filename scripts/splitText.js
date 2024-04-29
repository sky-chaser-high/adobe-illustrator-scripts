/* ===============================================================================================================================================
   splitText

   Description
   This script splits a text by lines, words, or characters.

   Usage
   1. Select any text objects, run this script from File > Scripts > Other Script...
   2. Select lines, words, or characters.

   Notes
   Area types converts to point types.
   If there are many characters, it will take time to split them.
   After splitting, the text position may move slightly.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CC or higher

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
        try {
            convertToPointType();
            splitLines();
            if (dialog.word.value) splitWords();
            if (dialog.character.value) splitCharacters();
        }
        catch (err) {
            alert(dialog.error);
        }
        dialog.close();
    }

    dialog.show();
}


function convertToPointType() {
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.kind == TextType.POINTTEXT) continue;
        convertJustification(text);
        text.convertAreaObjectToPointObject();
        // work around a bug
        text.selected = false;
        text.selected = true;
    }
}


function convertJustification(text) {
    var justification = getJustification(text);
    if (!/JUSTIFY/.test(justification.toString())) return;

    // work around a bug
    // community.adobe.com/t5/illustrator-discussions/trouble-assigning-textframe-to-justification-left/m-p/4211277
    var shrink = 80;
    var expand = (1 / shrink) * 10000;
    text.resize(shrink, shrink);

    switch (justification) {
        case Justification.FULLJUSTIFY:
        case Justification.FULLJUSTIFYLASTLINELEFT:
            setJustification(text, Justification.LEFT);
            break;
        case Justification.FULLJUSTIFYLASTLINECENTER:
            setJustification(text, Justification.CENTER);
            break;
        case Justification.FULLJUSTIFYLASTLINERIGHT:
            setJustification(text, Justification.RIGHT);
            break;
    }
    text.resize(expand, expand);
}


// Error countermeasure.
// an Illustrator error occurred: 1346458189 ('PARM')
function getJustification(text) {
    var ranges = text.textRanges;
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var paragraph = range.paragraphAttributes;
        try {
            return paragraph.justification;
        }
        catch (err) { }
    }
}


// Error countermeasure.
// an Illustrator error occurred: 1346458189 ('PARM')
function setJustification(text, align) {
    var ranges = text.textRanges;
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var paragraph = range.paragraphAttributes;
        try {
            paragraph.justification = align;
        }
        catch (err) { }
    }
}


function splitLines() {
    var flag = { line: true, word: false, character: false };
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        splitText(texts[i], flag);
    }
}


function splitWords() {
    var flag = { line: false, word: true, character: false };
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        splitText(texts[i], flag);
    }
    items = app.activeDocument.selection;
    texts = getTextFrames(items);
    for (var j = 0; j < texts.length; j++) {
        removeLineHeadSpace(texts[j]);
    }
}


function splitCharacters() {
    var flag = { line: false, word: false, character: true };
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        splitText(texts[i], flag);
    }
    items = app.activeDocument.selection;
    texts = getTextFrames(items);
    for (var j = texts.length - 1; j >= 0; j--) {
        removeNullCharacter(texts[j]);
    }
}


function splitText(item, flag) {
    var contents, count;

    if (flag.line) count = item.lines.length;
    if (flag.word) count = item.words.length;
    if (flag.character) count = item.textRanges.length;

    for (var i = 0; i < count - 1; i++) {
        if (flag.line) contents = item.lines[0];
        if (flag.word) contents = item.words[0];
        if (flag.character) contents = item.textRanges[0];
        item = split(item, contents, flag);
    }
}


function split(text, contents, flag) {
    var base = {
        x: flag.line ? text.anchor[0] : text.position[0],
        y: flag.line ? text.anchor[1] : text.position[1]
    };
    var item = text.duplicate();

    var end = (flag.word && hasPeriod(text, contents)) ? getPeriodPosition(text) : contents.end;
    var last = text.textRanges.length;

    text = removeContents(text, end, last);
    text = move(text, base, flag.line);

    item = removeContents(item, 0, end);
    if (hasLinefeed(item.contents)) {
        item = moveNextLine(item);
    }
    else {
        var position = {
            x: base.x + text.width,
            y: base.y - text.height
        };
        item = move(item, position, flag.line);
    }
    if (!item.contents) item.remove();

    removeTrailingSpaces(text.textRange);
    return item;
}


function removeContents(text, start, end) {
    for (var i = end - 1; i >= start; i--) {
        var word = text.textRanges[i];
        word.remove();
    }
    return text;
}


function move(text, base, isLine) {
    var left = isLine ? text.anchor[0] : text.position[0];
    var top = isLine ? text.anchor[1] : text.position[1];
    var x = base.x - left;
    var y = 0;
    if (text.orientation == TextOrientation.VERTICAL) {
        x = 0;
        y = base.y - top;
    }
    text.translate(x, y);
    return text;
}


function moveNextLine(text) {
    var leading = getLeading(text);
    var x = 0;
    var y = leading * -1;
    if (text.orientation == TextOrientation.VERTICAL) {
        x = leading * -1;
        y = 0;
    }
    text.textRanges[0].remove();
    text.translate(x, y);
    return text;
}


// Error countermeasure.
// an Illustrator error occurred: 1346458189 ('PARM')
function getLeading(text) {
    var language = getLanguage(text);
    var index = 1;
    if (language == LanguageType.JAPANESE) index = 0;
    var ranges = text.textRanges;
    for (var i = index; i < ranges.length; i++) {
        var range = ranges[i];
        var attributes = range.characterAttributes;
        try {
            return attributes.leading;
        }
        catch (err) { }
    }
}


// Error countermeasure.
// an Illustrator error occurred: 1346458189 ('PARM')
function getLanguage(text) {
    var ranges = text.textRanges;
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var attributes = range.characterAttributes;
        try {
            return attributes.language;
        }
        catch (err) { }
    }
}


function hasLinefeed(text) {
    var linefeed = /^\r|^\u0003/;
    return linefeed.test(text);
}


function hasPeriod(text, word) {
    var contents = text.textRanges[word.end].contents;
    var regex = /,|\.|:|;/;
    return regex.test(contents);
}


function getPeriodPosition(text) {
    var contents = text.contents;
    var regex = /(,|\.|:|;)\s*/g;
    regex.exec(contents);
    return regex.lastIndex - 1;
}


function removeTrailingSpaces(text) {
    var end = text.end - 1;
    var regex = /\s+$/;
    if (regex.test(text.contents)) text.textRanges[end].remove();
}


function removeNullCharacter(text) {
    if (!text.contents) text.remove();
}


function removeLineHeadSpace(text) {
    var CENTER = Justification.CENTER;
    var RIGHT = Justification.RIGHT;
    var justification = getJustification(text);

    var w1 = (justification == RIGHT) ? text.anchor[0] : text.width;
    var h1 = (justification == RIGHT) ? text.anchor[1] : text.height;

    var str = text.textRanges[0];
    var regex = /^\s/;
    if (regex.test(str.contents)) str.remove();

    var w2 = (justification == RIGHT) ? text.anchor[0] : text.width;
    var h2 = (justification == RIGHT) ? text.anchor[1] : text.height;

    var half = (justification == CENTER) ? 2 : 1;
    var x = (w1 - w2) / half;
    var y = (h2 - h1) / half;
    text.translate(x, y);
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind != TextType.PATHTEXT) {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function isValidVersion() {
    var cc = 17;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc) return false;
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
    dialog.error = ui.message;
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
            ja: '1文字'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        },
        message: {
            en: 'An error occurred. \nRestart Illustrator and try again.',
            ja: 'エラーが発生しました。\nイラストレーターを再起動してやり直してください。'
        }
    };
}
