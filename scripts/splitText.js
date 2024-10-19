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
    for (var j = texts.length - 1; j >= 0; j--) {
        removeLeadingSpace(texts[j]);
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
    var justification = getJustification(text);
    if (text.lines.length == 1) {
        changeToLeftAlignment(text, justification);
    }

    var position = {
        x: text.anchor[0],
        y: text.anchor[1]
    };
    var item = text.duplicate();

    var end = (flag.word && hasPeriod(text, contents)) ? getPeriodPosition(text) : contents.end;
    var last = text.textRanges.length;

    text = removeContents(text, end, last);
    text = move(text, position);

    item = removeContents(item, 0, end);
    if (hasLinefeed(item.contents)) {
        item = moveNextLine(item);
    }
    else {
        position = getTrailingAnchorPosition(text);
        item = move(item, position);
    }
    if (!item.contents) item.remove();

    if (text.lines.length == 1) {
        resetAlignment(text, justification);
        resetAlignment(item, justification);
    }

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


function move(text, base) {
    var left = text.anchor[0];
    var top = text.anchor[1];
    var x = base.x - left;
    var y = base.y - top;
    text.translate(x, y);
    return text;
}


function moveNextLine(text) {
    var angle = getRotationAngle(text);
    var leading = getLeading(text);
    var x = leading * Math.sin(angle);
    var y = leading * Math.cos(angle) * -1;
    if (text.orientation == TextOrientation.VERTICAL) {
        x = leading * Math.cos(angle) * -1;
        y = leading * Math.sin(angle) * -1;
    }
    text.textRanges[0].remove();
    text.translate(x, y);
    return text;
}


function getRotationAngle(item) {
    var matrix = item.matrix;
    var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
    return rad;
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


function getTrailingAnchorPosition(text) {
    var justification = getJustification(text);
    var top = text.top;
    var left = text.left;

    var shrink = 80;
    var expand = (1 / shrink) * 10000;
    text.resize(shrink, shrink);

    switch (justification) {
        case Justification.LEFT:
        case Justification.CENTER:
            setJustification(text, Justification.RIGHT);
            break;
        case Justification.RIGHT:
            setJustification(text, Justification.LEFT);
            break;
    }
    text.resize(expand, expand);
    text.top = top;
    text.left = left;

    var x = text.anchor[0];
    var y = text.anchor[1];

    resetAlignment(text, justification);
    return {
        x: x,
        y: y
    };
}


function changeToLeftAlignment(text, justification) {
    var top = text.top;
    var left = text.left;
    var shrink = 80;
    var expand = (1 / shrink) * 10000;
    text.resize(shrink, shrink);
    switch (justification) {
        case Justification.CENTER:
        case Justification.RIGHT:
            setJustification(text, Justification.LEFT);
            break;
    }
    text.resize(expand, expand);
    text.top = top;
    text.left = left;
}


function changeToRightAlignment(text, justification) {
    var top = text.top;
    var left = text.left;
    switch (justification) {
        case Justification.LEFT:
        case Justification.CENTER:
            setJustification(text, Justification.RIGHT);
            break;
    }
    text.top = top;
    text.left = left;
}


function resetAlignment(text, justification) {
    var top = text.top;
    var left = text.left;
    var shrink = 80;
    var expand = (1 / shrink) * 10000;
    text.resize(shrink, shrink);
    setJustification(text, justification);
    text.resize(expand, expand);
    text.top = top;
    text.left = left;
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


function removeLeadingSpace(text) {
    var justification = getJustification(text);
    changeToRightAlignment(text, justification);

    var str = text.textRanges[0];
    var regex = /^\s/;
    if (regex.test(str.contents)) str.remove();

    resetAlignment(text, justification);
}


function removeTrailingSpaces(text) {
    var end = text.end - 1;
    var regex = /\s+$/;
    if (regex.test(text.contents)) text.textRanges[end].remove();
}


function removeNullCharacter(text) {
    if (!text.contents) text.remove();
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
    var current = parseInt(app.version);
    if (current < cc) return false;
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
