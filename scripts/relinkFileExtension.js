/* ===============================================================================================================================================
   relinkFileExtension

   Description
   This script is equivalent to InDesign's "Relink File Extension...".

   Usage
   1. Run this script from File > Scripts > Other Script...
      If you don't select linked files, all in the document replace.
   2. Enter an extension.

   Notes
   Place the relinked files in the same place as the original files.
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
    var dialog = showDialog();

    dialog.relink.onClick = function() {
        var extension = dialog.extension.text;
        if (!extension) return dialog.close();

        var items = app.activeDocument.selection;
        var links = getPlacedItems(items);

        var files = relink(links, extension);

        app.activeDocument.selection = null;
        if (files.length) showResult(files);

        dialog.close();
    }

    dialog.show();
}


function relink(items, extension) {
    var failedFiles = [];

    for (var i = 0; i < items.length; i++) {
        var link = items[i];
        try {
            var path = link.file.path;
            var name = link.file.name.split('.').slice(0, -1).join('.') || link.file.name;
            var file = File(path + '/' + name + '.' + extension);

            if (file.exists) link.file = file;
            else failedFiles.push(link);
        }
        catch (err) {
            failedFiles.push(link);
        }
    }

    return failedFiles;
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
        en: 'Failed to find ' + items.length + ' links. These links have not been relinked, and will remain selected in the Links panel.',
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


function showDialog() {
    $.localize = true;
    var locale = $.locale;
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
    statictext1.preferredSize.width = (/ja/.test(locale)) ? 415 : 400;
    statictext1.preferredSize.height = 55;
    statictext1.text = ui.description;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.extension;

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.preferredSize.width = 70;
    edittext1.active = true;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 6, 0, 0];

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.relink;
    button2.preferredSize.width = (/ja/.test(locale)) ? 120 : 90;
    button2.preferredSize.height = 26;

    edittext1.addEventListener('keydown', function(event) {
        if (event.keyName == 'Enter') button2.notify('onClick');
    });

    button1.onClick = function() {
        dialog.close();
    }

    dialog.extension = edittext1;
    dialog.relink = button2;

    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Relink File Extension',
            ja: 'ファイル拡張子にリンクを再設定'
        },
        description: {
            en: 'Relink each selected link to a file that has the same name as the original, and is stored in the same folder, but uses another filename extension.',
            ja: '選択した各リンクをファイルに再設定します。このファイルは元のファイルと同じ名前で、同じフォルダーに保存されていますが、別の拡張子を使用しています。'
        },
        extension: {
            en: 'Relink to Filename Extension:',
            ja: 'ファイル名拡張子にリンクを再設定:'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        },
        relink: {
            en: 'Relink',
            ja: 'リンクを再設定'
        }
    };
}
