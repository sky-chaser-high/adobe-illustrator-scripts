/* ===============================================================================================================================================
   selectGuides

   Description
   This script selects all guide objects.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Guides in locked or hidden layers are not supported.
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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var shapes = app.activeDocument.pathItems;
    var count = {
        before: shapes.length,
        after: 0
    };

    app.executeMenuCommand('deselectall');
    app.executeMenuCommand('clearguide');

    count.after = shapes.length;
    if (count.before == count.after) return;

    app.executeMenuCommand('undo');
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}
