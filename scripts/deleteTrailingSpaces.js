/* ===============================================================================================================================================
   deleteTrailingSpaces

   Description
   This script deletes trailing spaces.
   Both point and area types are supported.

   Usage
   Select text objects, run this script from File > Scripts > Other Script...
   It is not necessary to select a line.

   Notes
   Delete tabs as well.
   Area type with wrapping may not work well.
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
    for (var i = 0; i < texts.length; i++) {
        var lines = texts[i].lines;
        deleteTrailingSpaces(lines);
    }
}


function deleteTrailingSpaces(lines) {
    for (var i = 0; i < lines.length; i++) {
        var characters = lines[i].characters;
        for (var j = characters.length - 1; j >= 0; j--) {
            var str = characters[j].contents;
            if (isTrailingSpaces(str)) {
                characters[j].remove();
            }
            else {
                break;
            }
        }
    }
}


function isTrailingSpaces(str) {
    return /\s+$/.test(str);
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
