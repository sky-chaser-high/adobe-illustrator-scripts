/* ===============================================================================================================================================
   selectMissingLink

   Description
   This script selects all missing linked files.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Locked and hidden missing files are not selected. The layer also as well.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

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
    var links = app.activeDocument.placedItems;
    if (!links.length) return;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        try {
            link.file.name;
        }
        catch (err) {
            if (link.editable) link.selected = true;
        }
    }
}


function isValidVersion() {
    var cs = 11;
    var current = parseInt(app.version);
    if (current < cs) return false;
    return true;
}
