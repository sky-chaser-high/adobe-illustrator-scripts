/* ===============================================================================================================================================
   deleteAllRight

   Description
   This script is equivalent to Visual Studio Code's "Delete All Right". (macOS: Cmd + Delete)
   Both point and area types are supported.

   Usage
   Move the cursor to the position of the character you want to delete, run this script from File > Scripts > Other Script...
   It is not necessary to select a line.

   Notes
   Since copy and paste inside the script, if you have copied the content in advance, it will be lost.
   Only one line can be deleted. Multiple lines are not supported.
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
        deleteAllRight(ranges, lines, cursor);
        (cursor > 0) ? restoreCursorPosition(ranges, cursor - 1) : text.select();
    }
    catch (err) { }
}


function deleteAllRight(ranges, lines, cursor) {
    var index = getLine(lines, cursor);
    var end = lines[index].end - 1;
    while (true) {
        if (cursor > end) break;
        ranges[end].select(true);
        end--;
    }
    app.cut();
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
