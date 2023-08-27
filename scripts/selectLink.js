/* ===============================================================================================================================================
   selectLink

   Description
   This script selects the specified link files.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Enter a file name. It can also be part of the file name. Or select it from the list below.
      If the text field is empty, all linked files are selected.
      Regular expressions are supported.

   Notes
   Locked or hidden linked files are not selected. The layer also as well.
   Missing linked files may not be selected.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var links = getLinkFiles();
    if (!links.length) return;

    var dialog = showDialog(links);

    dialog.ok.onClick = function() {
        var name = dialog.link.text;
        var items = dialog.list.selection;
        if (items) name = items.join('|');
        selectLinkFile(name);
        dialog.close();
    }

    dialog.show();
}


function selectLinkFile(name) {
    var links = app.activeDocument.placedItems;
    var regex = new RegExp(name, 'ig');
    var filename;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        try {
            filename = File.decode(link.file.name);
        }
        catch (err) {
            filename = File.decode(link.name);
        }
        if (regex.test(filename)) {
            link.selected = true;
        }
    }
}


function getLinkFiles() {
    var links = [];
    var items = app.activeDocument.placedItems;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var name = getFilename(item);
        if (!name) continue;
        if (isArrayExists(links, name)) continue;
        links.push(name);
    }
    return links.sort();
}


function isArrayExists(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    return false;
}


function getFilename(item) {
    var file = getFile(item);
    if (!file) return;
    return File.decode(file.name);
}


function getFile(item) {
    try {
        return item.file;
    }
    catch (err) {
        return;
    }
}

function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(links) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('group', undefined, { name: 'statictext1' });
    statictext1.orientation = 'column';
    statictext1.alignChildren = ['left', 'center'];
    statictext1.spacing = 0;
    statictext1.alignment = ['fill', 'center'];

    statictext1.add('statictext', undefined, ui.line1);
    statictext1.add('statictext', undefined, ui.line2);
    statictext1.add('statictext', undefined, ui.line3);

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.alignment = ['fill', 'center'];
    edittext1.active = true;

    var listbox1 = dialog.add('listbox', undefined, undefined, {
        name: 'listbox1',
        items: links,
        multiselect: true
    });
    listbox1.preferredSize.height = 191;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.link = edittext1;
    dialog.list = listbox1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Select Link',
            ja: 'リンクを選択'
        },
        line1: {
            en: 'Enter a file name. Regular expressions are supported.',
            ja: 'ファイル名を入力してください。正規表現に対応しています。'
        },
        line2: {
            en: 'Or select from the list below.',
            ja: 'または、下のリストから選択してください。'
        },
        line3: {
            en: 'If the text field is empty, all linked files are selected.',
            ja: '何も入力しない場合は、すべてのリンクを選択します。'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
