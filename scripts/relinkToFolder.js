/* ===============================================================================================================================================
   relinkToFolder

   Description
   This script is equivalent to InDesign's Links panel menu "Relink to Folder...".
   Replace linked files with a file of the same name in the selected folder.

   Usage
   1. Run this script from File > Scripts > Other Script...
      If you don't select linked files, all in the document replace.
   2. Select a folder in the dialog that appears.

   Notes
   Missing linked files and embedded files not replaced.
   When selecting linked files, select them in the document rather than the links panel.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.1.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function() {
    if (app.documents.length > 0 && app.activeDocument.placedItems.length > 0) main();
})();


function main() {
    $.localize = true;

    var images = getImageFiles();
    if (!images) return;

    var items = app.activeDocument.selection;
    var links = getPlacedItems(items);

    var files = relink(links, images);

    app.activeDocument.selection = null;
    if (files.length) showResult(files);
}


function relink(items, images) {
    var failedFiles = [];

    for (var i = 0; i < items.length; i++) {
        var link = items[i];
        try {
            var filename = link.file.name;
            var image = images[filename];
            if (image.exists) link.file = image;
            else failedFiles.push(link);
        }
        catch (err) {
            failedFiles.push(link);
        }
    }

    return failedFiles;
}


function getImageFiles() {
    var title = {
        en: 'Select a Folder',
        ja: 'フォルダーを選択'
    };

    var dir = Folder.selectDialog(title);
    if (!dir) return false;

    var images = {};
    var files = dir.getFiles();
    for (var i = 0; i < files.length; i++) {
        images[files[i].name] = files[i];
    }
    return images;
}


function getPlacedItems(items) {
    if (items.length == 0) return app.activeDocument.placedItems;

    var links = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].typename == 'PlacedItem') {
            links.push(items[i]);
        }
        else if (items[i].typename == 'GroupItem') {
            links = links.concat(getPlacedItems(items[i].pageItems));
        }
    }
    return links;
}


function showResult(items) {
    for (var i = 0; i < items.length; i++) {
        try {
            items[i].selected = true;
        }
        catch (err) { }
    }

    var message = {
        en: 'Failed to find ' + items.length + ' links in new folder. These links have not been relinked, and will remain selected in the Links panel.',
        ja: items.length + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択された状態のまま残ります。'
    }

    var ui = localizeUI();
    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1', multiline: true });
    statictext1.preferredSize.width = 410;
    statictext1.preferredSize.height = 40;
    statictext1.text = message;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Relink to Folder',
            ja: 'フォルダーに再リンク'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
