/* ===============================================================================================================================================
   selectEmbeddedLink

   Description
   This script selects all embedded files.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Locked and hidden embedded files are not selected. The layer also as well.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.1

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
    var links = app.activeDocument.rasterItems;
    if (!links.length) return;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.editable) link.selected = true;
    }
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
