/* ===============================================================================================================================================
   relinkToFolder

   Description
   This script replaces linked files with a file of the same name in the selected folder,
   equivalent to InDesign's Links panel menu > Relink to Folder.

   Usage
   1. Select any linked files, run this script from File > Scripts > Other Script...
      If no file is selected, it replaces all files in the document.
   2. Select a folder from the dialog that appears.

   Notes
   Missing linked files and embedded files are not replaced.
   When selecting linked files, select them in the document rather than the Links panel.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.1.1

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
    var files = getImageFiles();
    if (!files) return;

    var items = app.activeDocument.selection;
    var links = getPlacedItems(items);
    if (!links.length) return;

    var failures = relink(links, files);

    app.activeDocument.selection = null;
    if (failures.length) showResult(failures);
}


function relink(links, files) {
    var failedFiles = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        try {
            var name = link.file.name;
            var file = files[name];
            if (file.exists) link.file = file;
            else failedFiles.push(link);
        }
        catch (err) {
            failedFiles.push(link);
        }
    }
    return failedFiles;
}


function getImageFiles() {
    $.localize = true;
    var ui = localizeUI();
    var dir = Folder.selectDialog(ui.folder);
    if (!dir) return false;

    var images = {};
    var files = dir.getFiles();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        images[file.name] = file;
    }
    return images;
}


function getPlacedItems(items) {
    if (!items.length) return app.activeDocument.placedItems;
    var links = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PlacedItem') {
            links.push(item);
        }
        if (item.typename == 'GroupItem') {
            links = links.concat(getPlacedItems(item.pageItems));
        }
    }
    return links;
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showResult(items) {
    $.localize = true;
    var ui = localizeUI();

    for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
    }
    var message = {
        en: 'Failed to find ' + items.length + ' links in new folder. These links have not been relinked, and will remain selected in the Links panel.',
        ja: items.length + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択された状態のまま残ります。'
    }

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
    statictext1.text = message;
    statictext1.preferredSize.width = 410;
    statictext1.preferredSize.height = 40;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Relink to Folder',
            ja: 'フォルダーに再リンク'
        },
        folder: {
            en: 'Select a Folder',
            ja: 'フォルダーを選択'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
