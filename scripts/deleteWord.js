/* ===============================================================================================================================================
   deleteWord

   Description
   This script deletes a word under the cursor.
   Both point and area types are supported.

   Usage
   Move the cursor to the position of the word you want to delete, run this script from File > Scripts > Other Script...
   It is not necessary to select a word.

   Notes
   Since copy and paste inside the script, if you have copied the content in advance, it will be lost.
   Area type with wrapping may not work well.
   If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.
   If you want to enter text, you must click with the mouse.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CC 2018 or higher

   Version
   1.0.1

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
    try {
        var text = app.activeDocument.selection;
        var ranges = text.story.textRanges;
        var lines = text.story.lines;
        var cursor = text.start;

        cursor = deleteWord(ranges, lines, cursor);
        if (cursor == undefined) return;

        if (cursor == 0) {
            moveToBeginningOf(lines[0], text);
        }
        else {
            restoreCursorPosition(ranges, cursor - 1);
        }
    }
    catch (err) { }
}


function deleteWord(ranges, lines, cursor) {
    var index = getLine(lines, cursor);
    var words = lines[index].words;

    var word = getWord(words, cursor);
    if (!word) return undefined;

    var start = word.start;
    var end = word.end;

    for (var i = end; i >= start; i--) {
        try {
            var str = ranges[i].contents;
            if ((i == end && !/\s/.test(str)) || /\r/.test(str)) continue;
            ranges[i].remove();
        }
        catch (err) { }
    }

    return start;
}


function getWord(words, cursor) {
    for (var i = 0; i < words.length; i++) {
        var start = words[i].start;
        var end = words[i].end;
        if (start <= cursor && cursor <= end) return words[i];
    }
    return undefined;
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


function moveToBeginningOf(line, text) {
    line.insertionPoints[0].characters.add('\r');
    text.story.textRanges[0].select();
    app.cut();
}
