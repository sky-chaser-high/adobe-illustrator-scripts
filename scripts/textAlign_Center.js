/* ===============================================================================================================================================
   textAlign_Center

   Description
   This script changes the text alignment without moving the position.
   Vertical text is also supported.

   Usage
   Select point text objects, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.1

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
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        align(texts[i]);
    }
}


function align(text) {
    var position = text.position;
    text.textRange.paragraphAttributes.justification = Justification.CENTER;
    text.position = position;
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind == TextType.POINTTEXT) {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}
