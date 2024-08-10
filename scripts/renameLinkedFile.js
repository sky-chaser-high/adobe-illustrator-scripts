/* ===============================================================================================================================================
   renameLinkedFile

   Description
   This script renames the name of the linked files and relink.

   WARNING!
   It is not possible to undo file names with Edit > Undo.
   File manipulation is dangerous, so we recommend backing up your data before running the script.

   Usage
   1. Select any linked files, run this script from File > Scripts > Other Script...
      If not selected, all files in the document are renamed.
   2. Enter the current file name in the Find field and a new file name in the Replace field. It can also be part of the file name.
      Regular expressions are supported in the Find field.
   3. Clicking the Preview button shows the renamed file names in the list.
      A check in the Already Exists column indicates that a file with the same name already exists.

   Notes
   Missing linked files and embedded files not replaced.
   If you are using linked files for other documents, the link will be missing.
   When selecting linked files, select them in the document rather than the Links panel.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.1

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
    var items = app.activeDocument.selection;
    var links = getLinkItems(items);
    if (!links.length) return;

    showWarning();
    var dialog = showDialog(links);

    dialog.ok.onClick = function() {
        var search = dialog.search.text;
        var replace = dialog.replace.text;
        if (!search && !replace) return dialog.close();
        renameLinkedFiles(links, search, replace);
        dialog.close();
    }

    dialog.preview.onClick = function() {
        var search = dialog.search.text;
        var replace = dialog.replace.text;
        var results = showRenameResults(links, search, replace);
        dialog.list.removeAll();
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var row = dialog.list.add('item', result.oldName);
            var sub = row.subItems;
            sub[0].text = '→';
            sub[1].text = result.newName;
            sub[2].text = result.exists ? '\u2713' : '';
        }
        dialog.search.active = false;
        dialog.search.active = true;
    }

    dialog.show();
}


function showRenameResults(links, search, replace) {
    var results = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var result = getRenameResult(link, search, replace);
        if (!result) continue;
        results.push(result);
    }
    return results;
}


function renameLinkedFiles(links, search, replace) {
    var files = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var src = getFile(link);
        if (!src) continue;

        var result = rename(link, search, replace);
        if (!result) continue;

        files.push(src);
    }
    remove(files);
}


function remove(files) {
    for (var i = files.length - 1; i >= 0; i--) {
        var file = files[i];
        if (file.exists) file.remove();
    }
}


function getFile(item) {
    try {
        return item.file;
    }
    catch (err) {
        return;
    }
}


function rename(link, search, replace) {
    var src = getFile(link);
    if (!src) return;

    var name = getFilename(src);
    var extension = getExtension(src);

    var regex = new RegExp(search, 'ig');
    if (!regex.test(name)) return;

    var newName = name.replace(regex, replace);
    if (/^\./.test(newName) || !newName) return;

    var filename = newName + extension;
    var uri = src.fsName;
    var exists = fileExists(src, filename);
    if (!exists) {
        // Rename a file first because the timestamp changed when duplicated.
        src.rename(filename);
        src.copy(uri);
    }

    var file = File(src.path + '/' + filename);
    if (!file.exists) return;
    link.file = file;

    if (exists) return;
    return true;
}


function getRenameResult(link, search, replace) {
    var src = getFile(link);
    if (!src) return;

    var name = getFilename(src);
    var extension = getExtension(src);

    var regex = new RegExp(search, 'ig');
    if (!regex.test(name)) return;

    var newName = name.replace(regex, replace);
    var exists = fileExists(src, newName + extension);

    return {
        oldName: name,
        newName: newName + extension,
        exists: exists
    };
}


function getFilename(src) {
    var filename = File.decode(src.name);
    if (isMac()) filename = convertJapanese(filename);
    var words = filename.split('.');
    var name = words.slice(0, -1).join('.') || filename;
    return name;
}


function getExtension(src) {
    var filename = File.decode(src.name);
    var words = filename.split('.');
    if (words.length < 2) return '';
    return '.' + words.slice(-1)[0];
}


function fileExists(src, filename) {
    var dir = File.decode(src.path);
    var file = File(dir + '/' + filename);
    if (!file.exists) return false;
    return true;
}


function getLinkItems(items) {
    if (!items.length) return app.activeDocument.placedItems;
    var links = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PlacedItem') {
            links.push(item);
        }
        if (item.typename == 'GroupItem') {
            links = links.concat(getLinkItems(item.pageItems));
        }
    }
    return links;
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


function showWarning() {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.warning;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var image1_src = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00!%00%00%00!%08%06%00%00%00W%C3%A4%C3%82o%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%C2%B9IDATX%C2%85%C3%8D%C2%98%3FR%021%14%C3%86%3F%18%2B%C2%B33%C3%8B%0D%C3%80%1BXo%C2%B3x%02%C2%B9%01ZYX%C2%B0G%C3%A0%084%16Vz%04%3D%C2%816%C2%A6%C3%B6%06%C3%A2%0Dd%C3%8C%C3%96%C3%AB%04%1F%2B%C3%B2v%C3%B3o%23%C3%B8k%60%C3%B2%C3%B2%C3%A7%C2%9B%C2%97%7C%2F%C2%81%5EUU84G%5D%04()%06%00N%01%C2%BC%26Y%C3%B9%C3%81%3A8%12%C2%9C%09%25%C3%85H%2F%0E%20%05%C2%B0%C3%92b%C2%92%C2%AC%5C%C2%B2%C2%8E%0E%C3%B4C%C3%95%03X%C2%90%00%C3%90%C3%A7%C2%82%C3%B5p%24(%13J%C2%8A1%C2%80\'%16%00%C3%8E%C2%92%C2%AC%7Cf%C2%AD%16B31g-%C3%A6v%23%C3%9E%22%C2%94%14%17%00r%16%C3%B8%26%C2%A7%C2%B8%17%5E%C3%9BAn%C3%90%C2%87q%C3%88%C2%82%3F%C2%BC%C3%93!uv%C2%8Bo%26%0A%C2%8B%00P%C2%BC%60%C2%AD%06%C2%9C3%C2%B1cI%1B%5E%C2%96%C3%B5)V%C3%B3%5D%01W7%C2%93%C3%BA%C3%BB%C3%AD%C3%B5%C3%83v(%C2%A5%C3%BEN%C3%A7%C3%83i%3B%C2%94%14%C2%BA*NY%C3%80%C3%8C%C2%94%C3%86%C3%85%11%C3%91%C2%A1%109%C2%8D%C2%B3%C2%8APRL%0C%C2%96%C2%B4%C2%91%C3%93x%23.%C2%99%08.%C3%87%C2%AE%C3%A3%C2%8D%22%C2%94%14s%07K%C3%9A%18%C3%92%3C%C2%AD%C2%B4%C2%8A%C2%A0%C3%82%C3%A4%C3%A5w%03%05%C3%8D%C3%97H%C2%AB%C2%88%26Kv%205%C3%9C7%C3%8D%22%C2%A80%C3%8DX%C2%A0%1B3%C2%9A%C2%97%C3%91(%02%C3%80%3Dk%C2%89C%C3%A3%C2%BCL%04%C2%BD%15B-i%23%C2%A7%C3%B9%C3%8D%22%22X%C3%92%06%C2%9B%C3%BF%C3%97%05Fo%C2%81%3B%C3%8B%241%C2%B8L%C2%B2%C2%B2%C3%9E%C2%9AZ%04Yh%19%C3%91%11%26%C3%B4-%3B%C3%9A%C2%BC9%C2%B6%C2%B7%C2%A3%C3%98%C2%93%00%C3%90%3Au%0DZg%C2%82%C2%AC%C3%B3%C3%86%C2%BAZ0%5C%C3%A5%C2%AE%C2%9C%C3%A87%C3%87%26%13%C2%AD%C2%85%C3%A4%C2%8FY%C2%AF%C3%9B\'%C3%8B%C3%B8%C2%BE%15b%C2%A1%C3%9F%1C%C3%A3%C3%9E%C3%A7%C3%8B%C2%B1%C3%8E%C3%A3%C3%B9%C2%81Dh%1E%C3%B5v%C2%B4%5E%2C%7Bb%C3%90%C2%A7%C3%A2%C2%B1%3A%C2%90%00%C2%BD%C3%AE%C3%A2_%C3%BC5%C3%90%C3%A5%07q%1C%00%7C%01%0A%C3%AA%C2%85%C2%AE%C3%8A%C2%B7n%C2%B9%00%00%00%00IEND%C2%AEB%60%C2%82';
    var image1 = group1.add('image', undefined, File.decode(image1_src), { name: 'image1' });

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [10, 0, 0, 0];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.message1;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2', multiline: true });
    statictext2.text = ui.message2;
    statictext2.preferredSize.width = 372;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;

    dialog.show();
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

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.filename;
    panel1.orientation = 'column';
    panel1.alignChildren = ['right', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.find;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 400;
    edittext1.active = true;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.replace;

    var edittext2 = group2.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.preferredSize.width = 400;

    var listbox1 = dialog.add('listbox', undefined, undefined, {
        name: 'listbox1',
        numberOfColumns: 4,
        showHeaders: true,
        columnTitles: [ui.link, '', ui.subtitle, ui.exists]
    });
    listbox1.preferredSize.height = 230;

    for (var i = 0; i < links.length; i++) {
        var file = getFile(links[i]);
        if (!file) continue;
        var filename = getFilename(file);
        listbox1.add('item', filename);
    }

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.reset;
    button1.preferredSize.width = 90;
    button1.alignment = ['left', 'center'];

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.preview;
    button2.preferredSize.width = 90;
    button2.alignment = ['left', 'center'];

    var button3 = group3.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.cancel;
    button3.preferredSize.width = 90;
    button3.alignment = ['right', 'center'];

    var button4 = group3.add('button', undefined, undefined, { name: 'button4' });
    button4.text = ui.ok;
    button4.preferredSize.width = 90;
    button4.alignment = ['right', 'center'];

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    button1.onClick = function() {
        edittext1.text = '';
        edittext2.text = '';
        listbox1.removeAll();
        for (var i = 0; i < links.length; i++) {
            var file = getFile(links[i]);
            if (!file) continue;
            var filename = getFilename(file);
            listbox1.add('item', filename);
        }
        edittext1.active = false;
        edittext1.active = true;
    }

    button3.onClick = function() {
        dialog.close();
    }

    dialog.search = edittext1;
    dialog.replace = edittext2;
    dialog.list = listbox1;
    dialog.preview = button2;
    dialog.ok = button4;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Rename Linked File',
            ja: 'リンク画像の名前を変更'
        },
        filename: {
            en: 'Filename',
            ja: 'ファイル名'
        },
        link: {
            en: 'Current Filename',
            ja: '現在のファイル名'
        },
        subtitle: {
            en: 'Rename',
            ja: '変更後のファイル名'
        },
        exists: {
            en: 'Already Exists',
            ja: '既存ファイル'
        },
        find: {
            en: 'Find:',
            ja: '検索文字列:'
        },
        replace: {
            en: 'Replace With:',
            ja: '置換文字列:'
        },
        reset: {
            en: 'Reset',
            ja: 'リセット'
        },
        preview: {
            en: 'Preview',
            ja: 'プレビュー'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        },
        warning: {
            en: 'WARNING!',
            ja: 'WARNING!'
        },
        message1: {
            en: 'It is not possible to undo the file names with Edit > Undo.',
            ja: '「編集 > 取り消し」でファイル名を元に戻すことができません。'
        },
        message2: {
            en: 'File manipulation is dangerous, so we recommend backing up your data before running the script.',
            ja: 'ファイル操作は危険です。スクリプトを実行する前にデータのバックアップをおすすめします。'
        }
    };
}
