/* ===============================================================================================================================================
   textAlign_Left

   Description
   This script changes the text alignment without moving the text position.
   Vertical text is also supported.

   Usage
   Select the text objects, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts
   =============================================================================================================================================== */

(function() {
    if (app.documents.length) align(app.activeDocument.selection);
})();

function align(texts) {
    for (var i = 0; i < texts.length; i++) {
        if (texts[i].typename == 'TextFrame' && texts[i].kind == TextType.POINTTEXT) {
            var left = texts[i].left;
            var top = texts[i].top;

            // work around a bug
            texts[i].textRange.paragraphAttributes.justification = Justification.FULLJUSTIFYLASTLINELEFT;

            texts[i].textRange.paragraphAttributes.justification = Justification.LEFT;
            texts[i].left = left;
            texts[i].top = top;
        }
        else if (texts[i].typename == 'GroupItem') {
            align(texts[i].pageItems);
        }
    }
}
