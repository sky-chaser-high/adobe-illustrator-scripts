/* ===============================================================================================================================================
   removeColorInGuideObject

   Description
   This script removes fill and stroke colors in all guide objects.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Show and unlock all layers.
   Guide objects hidden with Cmd or Ctrl + 3 are not supported.
   If you have added fill or stroke colors in the Appearance panel, they may not work well.
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
    if (app.documents.length > 0) main();
})();


function main() {
    showAllLayers();

    // Select > Deselect
    app.executeMenuCommand('deselectall');
    // View > Guides > Clear Guides
    app.executeMenuCommand('clearguide');
    // Edit > Undo
    app.executeMenuCommand('undo');
    // Object > Expand Appearance
    app.executeMenuCommand('expandStyle');

    var items = getPathItems(app.activeDocument.selection);
    for (var i = 0; i < items.length; i++) {
        if (items[i].guides) {
            items[i].fillColor = new NoColor();
            items[i].strokeColor = new NoColor();
        }
    }

    // Select > Deselect
    app.executeMenuCommand('deselectall');
}


function getPathItems(selections) {
    var items = [];
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].typename == 'PathItem') {
            items.push(selections[i]);
        }
        else if (selections[i].typename == 'GroupItem') {
            items = items.concat(getPathItems(selections[i].pageItems));
        }
        else if (selections[i].typename == 'CompoundPathItem') {
            items = items.concat(getPathItems(selections[i].pathItems));
        }
    }
    return items;
}


function showAllLayers() {
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        layers[i].locked = false;
        layers[i].visible = true;
    }
}
