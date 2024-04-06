/* ===============================================================================================================================================
   arrangeWindows

   Description
   This script splits and arranges all open windows.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   It has been implemented in the Application Bar since version 2022.
   Open at least two files.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

   Version
   1.0.1

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 1 && isValidVersion()) main();
})();


function main() {
    // Window > Arrange > Float All in Windows
    app.executeMenuCommand('floatAllInWindows');
    // Window > Arrange > Tile
    app.executeMenuCommand('tile');

    var documents = app.documents;
    for (var i = 0; i < documents.length; i++) {
        var document = documents[i];
        document.activate();

        var artboards = document.artboards;
        // View > Fit All in Window
        if (artboards.length > 1) app.executeMenuCommand('fitall');
        // View > Fit Artboard in Window
        else app.executeMenuCommand('fitin');
    }
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
