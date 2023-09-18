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
    var x = text.position[0];
    var y = text.position[1];
    var start = 0;
    var end = text.textRanges.length;

    var item = text.duplicate();

    text = removeContents(text, cursor, end);
    text = move(text, x, y);
    text.selected = true;

    item = removeContents(item, start, cursor);
    item = move(item, x + text.width, y - text.height);
    item.selected = true;

    return item;
}


function removeContents(text, start, end) {
    for (var i = end - 1; i >= start; i--) {
        var contents = text.textRanges[i];
        contents.remove();
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
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
