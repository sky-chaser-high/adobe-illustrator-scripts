/* ===============================================================================================================================================
   arrangeWindows

   Description
   This script splits and arranges all open windows.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    if (app.documents.length > 1) main();
})();


function main() {
    // Window > Arrange > Float All in Windows
    app.executeMenuCommand('floatAllInWindows');
    // Window > Arrange > Tile
    app.executeMenuCommand('tile');

    var docs = app.documents;

    for (var i = 0; i < docs.length; i++) {
        docs[i].activate();
        if (docs[i].artboards.length > 1) {
            // View > Fit All in Window
            app.executeMenuCommand('fitall');
        }
        else {
            // View > Fit Artboard in Window
            app.executeMenuCommand('fitin');
        }
    }
}
