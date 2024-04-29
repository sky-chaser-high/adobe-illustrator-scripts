/* ===============================================================================================================================================
   addNumericSeparators

   Description
   This script changes a number to a 3-digit comma delimited string.

   Usage
   Select text objects or specify a text range in an editing state, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.2.0

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
    var texts, items = app.activeDocument.selection;
    if (items.typename == 'TextRange') {
        texts = getTextRanges(items);
    }
    else {
        texts = getTextFrames(items);
    }

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var range = (text.typename == 'TextFrame') ? text.textRange : text;
        var indexes = getCommaIndexes(range);
        insertComma(range, indexes);
    }
}


function getCommaIndexes(text) {
    var regex = /\B(?=(\d{3})+(?!\d))/g;
    var contents = text.contents.replace(regex, ',');

    var indexes = [];
    var comma = /,/g;
    var last = 0;
    var count = 1;

    comma.exec(contents);
    while (last != comma.lastIndex) {
        indexes.push(comma.lastIndex - count);
        last = comma.lastIndex;
        comma.exec(contents);
        count++;
        if (!comma.lastIndex) break;
    }
    return indexes;
}


function insertComma(text, indexes) {
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i] + i;
        var character = text.contents[index];
        if (/,/.test(character)) continue;
        text.insertionPoints[index].characters.add(',');
    }
}


function getTextRanges(item) {
    if (!item.length) return item.story.textFrames;
    return item.textSelection;
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame') {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
