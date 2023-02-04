/* ===============================================================================================================================================
   encloseWordInParentheses

   Description
   This script encloses words in parentheses.

   Usage
   Move the cursor to the position of the word you want to enclose and run this script from File > Scripts > Other Script...
   If you select text ranges, enclose them.
   If you want to enclose it with other characters, change lines 41 and 42 inside the script.

   Notes
   Since using cut and paste functions inside the script, it will lose if you have copied the content in advance.
   Area type with wrapping may not work well.
   If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.
   If you want to enter text, you must click with the mouse.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CC 2018 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0) main();
})();


function main() {
    var parentheses = {
        start: '(',
        end: ')'
    };

    try {
        var text = app.activeDocument.selection;
        if (text.typename != 'TextRange') return;

        var range = text.story.textRange;
        var point = getInsertionPoints(text);
        var cursor = enclose(range, point, parentheses);

        if (point.start == point.end) cursor--;
        var ranges = text.story.textRanges;
        restoreCursorPosition(ranges, cursor);
    }
    catch (err) { }
}


function enclose(word, point, str) {
    var cursor = point.end + 1;
    var insertion = word.insertionPoints;
    insertion[point.end].characters.add(str.end);
    insertion[point.start].characters.add(str.start);
    return cursor;
}


function getInsertionPoints(text) {
    if (text.length) return text;

    var lines = text.story.lines;
    if (!lines.length) return { start: 0, end: 0 };

    var cursor = text.start;
    var index = getLine(lines, cursor);
    var words = lines[index].words;
    return getWord(words, cursor);
}


function getWord(words, cursor) {
    for (var i = 0; i < words.length; i++) {
        var start = words[i].start;
        var end = words[i].end;
        if (start <= cursor && cursor <= end) return words[i];
    }
    return { start: cursor, end: cursor };
}


function getLine(lines, cursor) {
    for (var i = 0; i < lines.length; i++) {
        var end = lines[i].end;
        if (cursor <= end) return i;
    }
    return lines.length - 1;
}


function restoreCursorPosition(ranges, cursor) {
    ranges[cursor].select();
    app.cut();
    app.paste();
}
