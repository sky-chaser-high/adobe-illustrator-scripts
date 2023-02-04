/* ===============================================================================================================================================
   convertTypeOnAPathToPointType

   Description
   This script converts types on a path to point types.

   Usage
   Select type on a path object, run this script from File > Scripts > Other Script...

   Notes
   The original type objects will delete.
   Any effects applied in the appearance will be lost.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var texts = getTextFrames(app.activeDocument.selection);
    for (var i = texts.length - 1; i >= 0; i--) {
        convert(texts[i]);
        texts[i].remove();
    }
}


function convert(text) {
    var top = text.top;
    var left = text.left;
    var layer = app.activeDocument.activeLayer;
    var pointText = layer.textFrames.pointText([left, top]);
    var range = text.textRange;
    range.duplicate(pointText);
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind == TextType.PATHTEXT) {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}
