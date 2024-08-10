/* ===============================================================================================================================================
   sortArtboards

   Description
   This script sorts the artboards in the Artboards panel.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   Only the Artboard panel. Artboards in the document are not sorted.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS5 or higher

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
    var props = getArtboardProperties();
    removeAllArtboards();
    sortArtboards(props);
    createArtboards(props);
}


function getArtboardProperties() {
    var items = [];
    var artboards = app.activeDocument.artboards;
    for (var i = 0; i < artboards.length; i++) {
        var artboard = artboards[i];
        items.push({
            name: artboard.name,
            rect: artboard.artboardRect,
            rulerOrigin: artboard.rulerOrigin,
            rulerPAR: artboard.rulerPAR,
            showCenter: artboard.showCenter,
            showCrossHairs: artboard.showCrossHairs,
            showSafeAreas: artboard.showSafeAreas
        });
    }
    return items;
}


function sortArtboards(items) {
    return items.sort(function(a, b) {
        var name = {
            a: a.name.toLowerCase(),
            b: b.name.toLowerCase()
        };
        name.a = name.a.replace(/(\d+)/g, setZeroPadding);
        name.b = name.b.replace(/(\d+)/g, setZeroPadding);
        return name.a > name.b;
    });
}


function setZeroPadding(str) {
    var zero = '0000000000';
    var digits = zero.length * -1;
    return (zero + str).slice(digits);
}


function createArtboards(items) {
    var doc = app.activeDocument;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var artboard = (i == 0) ? doc.artboards[0] : doc.artboards.add(item.rect);
        if (i == 0) artboard.artboardRect = item.rect;
        artboard.name = item.name;
        artboard.rulerOrigin = item.rulerOrigin;
        artboard.rulerPAR = item.rulerPAR;
        artboard.showCenter = item.showCenter;
        artboard.showCrossHairs = item.showCrossHairs;
        artboard.showSafeAreas = item.showSafeAreas;
    }
}


function removeAllArtboards() {
    var artboards = app.activeDocument.artboards;
    for (var i = artboards.length - 1; 1 <= i; i--) {
        var artboard = artboards[i];
        artboard.remove();
    }
}


function isValidVersion() {
    var cs5 = 15;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs5) return false;
    return true;
}
