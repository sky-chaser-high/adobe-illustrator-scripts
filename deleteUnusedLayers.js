/* ===============================================================================================================================================
   deleteUnusedLayers

   Description
   This script delete unused layers.

   Usage
   run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0) deleteUnusedLayers(app.activeDocument.layers);
})();


function deleteUnusedLayers(layers) {
    for (var i = layers.length - 1; i >= 0; i--) {
        var items = layers[i].pageItems.length;
        var sublayers = layers[i].layers.length;

        if (sublayers > 0) {
            deleteUnusedLayers(layers[i].layers);
        }

        if (items < 1 && !existsSublayerItems(layers[i].layers)) {
            layers[i].locked = false;
            layers[i].visible = true;
            layers[i].remove();
        }
    }
}


function existsSublayerItems(layers) {
    for (var i = 0; i < layers.length; i++) {
        var items = layers[i].pageItems.length;
        var sublayers = layers[i].layers.length;
        if (sublayers > 0) {
            var exist = existsSublayerItems(layers[i].layers);
            if (exist) {
                return true;
            }
        }
        if (items > 0) {
            return true;
        }
    }
    return false;
}
