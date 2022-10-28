/* ===============================================================================================================================================
   removeDeletedGlobalColor.js

   description
   Deletes the Deleted Global Colors displayed in the Separations Preview panel.

   usage
   1. Open the Ai file.
   2. Run this script from File > Scripts > Other Script...

   notes
   In rare cases, you may not be able to delete it.
   In that case, restart Illustrator and run this script again.
   If you save the file and reopen it, it may be restored.
   In this case, there is no way to delete it.

   requirements
   Illustrator CS or higher

   script version
   1.0.0
   =============================================================================================================================================== */

if (app.documents.length > 0) removeDeletedGlobalColor();


function removeDeletedGlobalColor() {
    var spotColors = app.activeDocument.spots;

    var reg = /Deleted Global Color/i;

    for (var i = spotColors.length - 1; i >= 0; i--) {
        if (reg.test(spotColors[i].name)) {
            spotColors[i].remove();
        }
    }
}
