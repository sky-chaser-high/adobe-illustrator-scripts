/* ===============================================================================================================================================
   swapTextContents

   Description
   This script swap the text contents.

   Usage
   Select two text objects, run this script from File > Scripts > Other Script...

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
    var texts = getTextFrames(app.activeDocument.selection);
    if (texts.length == 2) {
        var temp = texts[0].contents;
        texts[0].contents = texts[1].contents;
        texts[1].contents = temp;
    }
    else {
        alert('Select two text objects.');
    }
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'TextFrame') {
            texts.push(items[i]);
        }
        else if (items[i].typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(items[i].pageItems));
        }
    }
    return texts;
}
