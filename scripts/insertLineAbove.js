/* ===============================================================================================================================================
   insertLineAbove

   Description
   This script is equivalent to Visual Studio Code's "Insert Line Above". (Cmd/Ctrl + Shift + Enter)
   Both point and area types are supported.

   Usage
   Move the cursor to the line below you want to add a line, run this script from File > Scripts > Other Script...
   It is not necessary to select a line.

   Notes
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
        var lines = text.story.lines;
        var cursor = text.start;
        var index = getLine(lines, cursor);
        lines[index].insertionPoints[0].characters.add('\r');
        lines[index].select();
    }
    catch (err) { }
}


function getLine(lines, cursor) {
    for (var i = 0; i < lines.length; i++) {
        var end = lines[i].end;
        if (cursor <= end) return i;
    }
    return lines.length - 1;
}
