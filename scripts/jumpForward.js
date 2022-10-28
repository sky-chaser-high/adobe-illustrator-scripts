/* ===============================================================================================================================================
   jumpForward

   Description
   This script is equivalent to Vim command "w". (jump forwards to the start of a word)
   In Visual Studio Code, it is equivalent to "Option/Ctrl + →".
   Both point and area types are supported.

   Usage
   Run this script in the text editing state from File > Scripts > Other Script...

   Notes
   Since copy and paste inside the script, if you have copied the content in advance, it will be lost.
   If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.
   If you want to enter text, you must click with the mouse.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    try {
        var text = app.activeDocument.selection;
        var ranges = text.story.textRanges;
        var lines = text.story.lines;
        var cursor = text.start;
        cursor = jumpForward(lines, cursor);
        if (!cursor) return;
        restoreCursorPosition(ranges, cursor - 1);
    }
    catch (err) { }
}


function jumpForward(lines, cursor) {
    var index = getLine(lines, cursor);
    var words = lines[index].words;
    var eol = isEndOfLine(words, cursor);
    if (eol) {
        if (index == lines.length - 1) return undefined;
        return lines[index + 1].words[0].start;
    }
    else {
        for (var i = 0; i < words.length; i++) {
            var start = words[i].start;
            if (start > cursor) return start;
        }
    }
}


function isEndOfLine(words, cursor) {
    var last = words.length - 1;
    var start = words[last].start;
    if (start <= cursor) return true;
    return false;
}


function getLine(lines, cursor) {
    for (var i = 0; i < lines.length; i++) {
        var end = lines[i].end;
        if (cursor < end) return i;
    }
    return lines.length - 1;
}


function restoreCursorPosition(ranges, cursor) {
    ranges[cursor].select();
    app.cut();
    app.paste();
}
