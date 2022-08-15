/* ===============================================================================================================================================
   closeAllDocuments

   Description
   This script closes all documents.
   If there are documents not saved, choose to save them.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   It has been implemented in the File menu since version 2021.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS4 or higher

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
    var save = false;
    var docs = app.documents;
    if (modified(docs)) {
        var local = localize();
        save = confirm(local.caution, false);
    }
    for (var i = docs.length - 1; i >= 0; i--) {
        if (save) docs[i].save();
        docs[i].close(SaveOptions.DONOTSAVECHANGES);
    }
}


function modified(docs) {
    for (var i = 0; i < docs.length; i++) {
        if (!docs[i].saved) return true;
    }
    return false;
}


function localize() {
    var language = {
        en_US: {
            caution: 'There are documents not saved. Save before closing?'
        },
        ja_JP: {
            caution: '保存していないファイルがあります。閉じる前に保存しますか？'
        }
    };
    return language[app.locale] || language.en_US;
}
