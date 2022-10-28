/* ===============================================================================================================================================
   sortArtboards

   Description
   This script sorts the artboards in the Artboard panel.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Only the Artboard panel. Artboards in the document are not sorted.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS5 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function () {
    if (app.documents.length > 0) main();
})();


function main() {
    var artboards = getArtboards();
    sortArtboards(artboards);
    removeAllArtboards();
    createArtboards(artboards);
}


function getArtboards() {
    var artboards = [];
    for (var i = 0; i < app.activeDocument.artboards.length; i++) {
        var artboard = app.activeDocument.artboards[i];
        var width = Math.abs(artboard.artboardRect[0] - artboard.artboardRect[2]);
        var height = Math.abs(artboard.artboardRect[1] - artboard.artboardRect[3]);
        artboards.push({
            name: artboard.name,
            x1: artboard.artboardRect[0],
            y1: artboard.artboardRect[1],
            width: width,
            height: height,
            rulerOrigin: artboard.rulerOrigin,
            rulerPAR: artboard.rulerPAR,
            showCenter: artboard.showCenter,
            showCrossHairs: artboard.showCrossHairs,
            showSafeAreas: artboard.showSafeAreas
        });
    }
    return artboards;
}


function sortArtboards(artboards) {
    return artboards.sort(function(a, b) {
        var nameA = a.name.toUpperCase().replace(/(\d+)/g, function(n) {
            return ('00000' + n).slice(-5);
        });
        var nameB = b.name.toUpperCase().replace(/(\d+)/g, function(n) {
            return ('00000' + n).slice(-5);
        });
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}


function removeAllArtboards() {
    var artboards = app.activeDocument.artboards;
    for (var i = artboards.length - 1; i >= 1; i--) {
        artboards[i].remove();
    }
}


function createArtboards(artboards) {
    for (var i = 0; i < artboards.length; i++) {
        var doc = app.activeDocument;
        var artboard = (i == 0) ? doc.artboards[0] : doc.artboards.add([0, 0, 10, -10]);
        artboard.name = artboards[i].name;
        artboard.artboardRect = [
            artboards[i].x1,
            artboards[i].y1,
            artboards[i].x1 + artboards[i].width,
            artboards[i].y1 - artboards[i].height
        ];
        artboard.rulerOrigin = artboards[i].rulerOrigin;
        artboard.rulerPAR = artboards[i].rulerPAR;
        artboard.showCenter = artboards[i].showCenter;
        artboard.showCrossHairs = artboards[i].showCrossHairs;
        artboard.showSafeAreas = artboards[i].showSafeAreas;
    }
}
