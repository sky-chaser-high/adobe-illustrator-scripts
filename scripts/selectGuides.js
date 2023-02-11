/* ===============================================================================================================================================
   selectGuides

   Description
   This script selects guide objects.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Locked or hidden guides are not selected. The layer also as well.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0) main();
})();


function main() {
    try {
        app.executeMenuCommand('clearguide');
        app.executeMenuCommand('undo');
    }
    catch (err) { }
}
