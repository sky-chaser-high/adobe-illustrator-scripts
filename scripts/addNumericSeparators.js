/* ===============================================================================================================================================
   addNumericSeparators

   Description
   This script changes a number to a 3-digit comma delimited string.

   Usage
   Select the text objects, run this script from File > Scripts > Other Script...
   Or, run this script in the text editing state.

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.1.0

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
    var texts, item = app.activeDocument.selection;
    if (item.typename == 'TextRange') {
        texts = item.story.textFrames;
    }
    else {
        texts = getTextFrames(item);
    }

    for (var i = 0; i < texts.length; i++) {
        var contents = texts[i].contents.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        var indexes = getCommaIndexes(contents);
        insertComma(texts[i], indexes);
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


function getCommaIndexes(text) {
    var indexes = [];
    var comma = /,/g;
    var last = 0;
    var count = 1;
    comma.exec(text);
    while (last != comma.lastIndex) {
        indexes.push(comma.lastIndex - count);
        last = comma.lastIndex;
        comma.exec(text);
        count++;
        if (comma.lastIndex == 0) break;
    }
    return indexes;
}


function insertComma(text, indexes) {
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i] + i;
        var character = text.contents[index];
        if (!/,/.test(character)) {
            text.insertionPoints[index].characters.add(',');
        }
    }
}
