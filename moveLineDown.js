/* ===============================================================================================================================================
   moveLineDown

   Description
   This script is equivalent to Visual Studio Code's Selection menu "Move Line Down".
   Both point and area types are supported.

   Usage
   Move the cursor to the line you want to move, run this script from File > Scripts > Other Script...
   It is not necessary to select a line.

   Notes
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
        var lines = text.story.lines;
        var cursor = text.start;

        var i = 0, count = 0;

        while (true) {
            var line = lines[i].contents.length;
            if (cursor <= line + count) {
                if (i == lines.length - 1) return;

                lines[i].select();
                app.cut();

                lines[i + 1].duplicate(lines[i]);

                var contents = lines[i].contents.length;
                i++;
                lines[i].select();
                app.paste();

                // Restore the cursor position.
                text.story.textRanges[cursor + contents].select();
                app.cut();
                app.paste();
                return;
            }
            count += line + 1;
            i++;
        }
    }
    catch (err) { }
}
