/* ===============================================================================================================================================
   selectLink

   Description
   This script selects the specified linked files.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Enter a file name in the Find field or select the file name from the list below.
      If the Find field is empty, all linked files are selected.
      Regular expressions support in the Find field.

   Notes
   Locked and hidden linked files are not selected. The layer also as well.
   Missing linked files may not be selected.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

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
    var links = getLinkFiles();
    if (!links.length) return;

    var dialog = showDialog(links);

    dialog.find.onChanging = function() {
        var items = dialog.list.items;
        var find = dialog.find.text;
        selectList(items, find);
    }

    dialog.ok.onClick = function() {
        var items = dialog.list.selection;
        var name = (items) ? items.join('|') : '^';
        selectLinkFile(name);
        dialog.close();
    }

    dialog.show();
}


function selectList(items, find) {
    var regex = new RegExp(find, 'ig');
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (!find || !regex.test(item.text)) item.selected = false;
        else item.selected = true;
    }
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
        if (isMac()) filename = convertJapanese(filename);
        if (regex.test(filename)) link.selected = true;
    }
}


function getLinkFiles() {
    var links = [];
    var items = app.activeDocument.placedItems;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var name = getFilename(item);
        if (!name || isArrayExists(links, name)) continue;
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
    var filename = File.decode(file.name);
    if (isMac()) return convertJapanese(filename);
    else return filename;
}


function getFile(item) {
    try {
        return item.file;
    }
    catch (err) {
        return;
    }
}


// Unicode Combining Character Sequence
// https://shinkufencer.hateblo.jp/entry/2021/12/04/233000
// https://bn.dgcr.com/archives/20080707140200.html
function convertJapanese(text) {
    var dakuten = '%E3%82%99';
    var handakuten = '%E3%82%9A';
    text = convertJapaneseSub(File.encode(text), dakuten, 1);
    text = convertJapaneseSub(text, handakuten, 2);
    return File.decode(text);
}
function convertJapaneseSub(src, code, count) {
    src = src.replace(/%E3%82%BF%E3%82%99/g, '%E3%83%80'); // ダだけ特殊処理
    var texts = src.split(code);
    for (var i = 0; i < texts.length - 1; i++) {
        var str = texts[i];
        if (!str) continue;
        var body = str.substring(0, str.length - 2);
        var foot = str.substring(str.length - 2, str.length);
        var hex = eval('0x' + foot) + count;
        hex = hex.toString(16).toUpperCase();
        texts[i] = body + hex;
    }
    return texts.join('');
}


function isMac() {
    return /mac/i.test($.os);
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
    dialog.preferredSize.width = 340;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.find;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.alignment = ['fill', 'center'];
    edittext1.active = true;

    var listbox1 = dialog.add('listbox', undefined, undefined, {
        name: 'listbox1',
        items: links,
        multiselect: true
    });
    listbox1.preferredSize.height = 300;

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

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    button1.onClick = function() {
        dialog.close();
    }

    dialog.find = edittext1;
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
        find: {
            en: 'Find:',
            ja: '検索文字列:'
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
