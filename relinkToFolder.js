/* ===============================================================================================================================================
   relinkToFolder.js

   Description
   This script is equivalent to InDesign's Links panel menu "Relink To Folder".
   Replaces the image with an image of the same name in the specified folder.

   Usage
   1. Run this script from File > Scripts > Other Script...
      If you don't select an image, all images will be targeted in the document.
   2. Select a folder at the dialog that appears.

   Notes
   When selecting an image, select the image on the artboard rather than the image in the links panel.
   Broken link files are not replaced.
   Embedded files are also not possible.

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
    var images = getImageFiles();
    if (!images) {
        return false;
    }

    var links = getPlacedItems();
    var failedFiles = [];

    for (var i = 0; i < links.length; i++) {
        try {
            var filename = links[i].file.name;
            if (images[filename].exists) {
                links[i].file = images[filename];
            }
            else {
                failedFiles.push(links[i]);
            }
        }
        catch (err) {
            failedFiles.push(links[i]);
        }
    }

    showResult(failedFiles);
}


function getImageFiles() {
    var title = {
        en_US: 'Select a Folder',
        ja_JP: 'フォルダを選択'
    };

    var dir = Folder.selectDialog(title[app.locale] || title.en_US);
    if (!dir) {
        return false;
    }

    var files = dir.getFiles();
    var images = {};
    for (var i = 0; i < files.length; i++) {
        images[files[i].name] = files[i];
    }
    return images;
}


function getPlacedItems() {
    var placedItems = app.activeDocument.placedItems;
    if (app.activeDocument.selection == 0) {
        return placedItems;
    }

    var images = [];
    for (var i = 0; i < placedItems.length; i++) {
        if (placedItems[i].selected) {
            images.push(placedItems[i]);
        }
    }
    return images;
}


function showResult(items) {
    app.activeDocument.selection = null;
    for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
    }

    var message = {
        en_US: 'Failed to find ' + items.length + ' links. These links have not been relinked, and will remain selected int the Links panel.',
        ja_JP: items.length + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされておらず、リンクパネルで選択された状態のまま残ります。'
    };

    if (items.length > 0) alert(message[app.locale] || message.en_US);
}
