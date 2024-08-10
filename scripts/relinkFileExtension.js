/* ===============================================================================================================================================
   relinkFileExtension

   Description
   This script replaces linked files with the specified file extension,
   equivalent to InDesign's Links panel menu > Relink File Extension.

   Usage
   1. Select any linked files, run this script from File > Scripts > Other Script...
      If no file is selected, it replaces all files in the document.
   2. Enter an extension.

   Notes
   Missing linked files and embedded files are not replaced.
   Place the relinked files in the same place as the original files.
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
    var dialog = showDialog();

    dialog.relink.onClick = function() {
        var extension = dialog.extension.text;
        if (!extension) return dialog.close();

        var items = app.activeDocument.selection;
        var links = getPlacedItems(items);
        if (!links.length) return;

        var files = relink(links, extension);

        app.activeDocument.selection = null;
        if (files.length) showResult(files);
        dialog.close();
    }

    dialog.show();
}


function relink(links, extension) {
    var failedFiles = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        try {
            var path = link.file.path;
            var words = link.file.name.split('.');
            var name = words.slice(0, -1).join('.') || link.file.name;
            var src = path + '/' + name + '.' + extension;
            var file = File(src);
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
        en: 'Failed to find ' + items.length + ' links. These links have not been relinked, and will remain selected in the Links panel.',
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


function showDialog() {
    $.localize = true;
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
    statictext1.text = ui.description;
    statictext1.preferredSize.width = (/ja/.test($.locale)) ? 415 : 400;
    statictext1.preferredSize.height = 55;

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

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.relink;
    button2.preferredSize.width = (/ja/.test($.locale)) ? 120 : 90;

    edittext1.addEventListener('keydown', function(event) {
        if (event.keyName == 'Enter') button2.notify('onClick');
    });

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
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
