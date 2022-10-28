/* ===============================================================================================================================================
   shuffleObjects

   Description
   This script shuffles the objects.

   Usage
   Select the objects, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    if (app.documents.length > 0) main();
})();


function main() {
    var items = app.activeDocument.selection;
    var positions = getPosition(items);
    shuffle(items);
    for (var i = 0; i < positions.length; i++) {
        items[i].top = positions[i].top;
        items[i].left = positions[i].left;
    }
}


function shuffle(items) {
    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
    return items;
}


function getPosition(items) {
    var positions = [];
    for (var i = 0; i < items.length; i++) {
        positions.push({
            top: items[i].top,
            left: items[i].left
        });
    }
    return positions;
}
