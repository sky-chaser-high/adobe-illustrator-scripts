/* ===============================================================================================================================================
   splitTextAtCursorPosition

   Description
   This script splits a point text at the cursor position.

   Usage
   Move the cursor to the position you want to split, run this script from File > Scripts > Other Script...

   Notes
   Area types are not supported.
   In the case of multi-lines, the layout will break.
   After splitting, the text position may move slightly.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    var text = app.activeDocument.selection;
    if (text.typename != 'TextRange') return;

    var text1 = text.story.textFrames[0];
    if (text1.kind != TextType.POINTTEXT) return;

    var cursor = getCursorPosition(text1.contents, text.start, text.end);
    if (!cursor.start) return;

    app.executeMenuCommand('deselectall');

    var text2, text3;
    if (cursor.start) text2 = split(text1, cursor.start);
    if (cursor.end) text3 = split(text2, cursor.end);
}


function split(text, cursor) {
    var justification = getJustification(text);
    changeToLeftAlignment(text, justification);

    var position = {
        x: text.anchor[0],
        y: text.anchor[1]
    };
    var start = 0;
    var end = text.textRanges.length;

    var item = text.duplicate();

    text = removeContents(text, cursor, end);
    text = move(text, position);
    text.selected = true;

    item = removeContents(item, start, cursor);
    position = getTrailingAnchorPosition(text);
    item = move(item, position);
    item.selected = true;

    resetAlignment(text, justification);
    resetAlignment(item, justification);

    return item;
}


function removeContents(text, start, end) {
    for (var i = end - 1; i >= start; i--) {
        var contents = text.textRanges[i];
        contents.remove();
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


function getCursorPosition(text, start, end) {
    if (start == end) {
        if (start == 0 || end == text.length) return { start: false, end: false };
        return { start: start, end: false };
    }

    if (start == 0 && end == text.length) {
        return { start: false, end: false };
    }

    if (start > 0 && end == text.length) {
        return { start: start, end: false };
    }

    if (start == 0 && end < text.length) {
        return { start: end, end: false };
    }

    return { start: start, end: end - start };
}


function isValidVersion() {
    var cs6 = 16;
    var current = parseInt(app.version);
    if (current < cs6) return false;
    return true;
}
