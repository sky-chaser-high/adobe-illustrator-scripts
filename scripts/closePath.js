/* ===============================================================================================================================================
   closePath

   Description
   This script close the path objects.

   Usage
   Select the path objects, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) closePath(app.activeDocument.selection);
})();


function closePath(items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PathItem') {
            if (!items[i].closed) {
                items[i].closed = true;
            }
        }
        else if (items[i].typename == 'CompoundPathItem') {
            closePath(items[i].pathItems);
        }
        else if (items[i].typename == 'GroupItem') {
            closePath(items[i].pageItems);
        }
    }
}
