/* ===============================================================================================================================================
   relinkFileExtensionExtra

   Description
   This script is an enhanced version of relinkFileExtension.js with more advanced settings for relinking linked files.

   Usage
   1. Select any linked files, run this script from File > Scripts > Other Script...
      If not selected, all files in the document are replaced.
   2. Select either file renaming method.
      Replace: Enter the current file name in the Find field and a new file name in the Replace field.
               It can also be part of the file name. Regular expressions are supported in the Find field.
      Add: Enter a string to be added to the prefix, suffix, or both of the original file names.
   3. Enter an extension.
      If the extension is the same as the original file, do not enter anything.
   4. To change the folder for the linked file, select a new folder.
      If the folder is the same as the original file, do not make any selection.
      To clear the new folder path, hold down the Option/Alt key and click the Clear button.

   Notes
   Missing linked files and embedded files not replaced.
   If the find targets a string that contains combining characters, the replacement will fail.
   When selecting linked files, select them in the document rather than the Links panel.
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
    var items = app.activeDocument.selection;
    var links = getPlacedItems(items);
    if (!links.length) return;

    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var config = getConfiguration(dialog);
        if (!config) return dialog.close();

        var failures = relink(links, config);

        app.activeDocument.selection = null;
        showResult(failures);
        dialog.close();
    }

    dialog.show();
}


function relink(items, config) {
    var failures = [];

    for (var i = 0; i < items.length; i++) {
        var link = items[i];
        try {
            var file = getRelinkFile(link.file, config);
            if (file) link.file = file;
            else failures.push(link);
        }
        catch (err) {
            failures.push(link);
        }
    }

    return failures;
}


function getRelinkFile(src, config) {
    var dir = (config.dir) ? config.dir : src.path;
    var original = {
        name: getFilename(src),
        extension: getExtension(src)
    };
    var filename = getRelinkFilename(original, config);
    var extension = (config.extension) ? config.extension : original.extension;
    var file = File(dir + '/' + filename + extension);
    if (file.fsName == src.fsName) return;
    if (file.exists) return file;
    return;
}


function getRelinkFilename(src, config) {
    if (config.isReplace) {
        var regex = new RegExp(config.search, 'ig');
        if (!regex.test(src.name)) return;
        return src.name.replace(regex, config.replace);
    }
    if (config.isAdd) {
        return config.prefix + src.name + config.suffix;
    }
}


function getFilename(src) {
    var filename = File.decode(src.name);
    var name = filename.split('.').slice(0, -1).join('.');
    if (name) return name;
    return filename;
}


function getExtension(src) {
    var filename = File.decode(src.name);
    var words = filename.split('.');
    if (words.length < 2) return '';
    return '.' + words.slice(-1)[0];
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


function getConfiguration(dialog) {
    var isReplace = dialog.isReplace.value;
    var search = dialog.search.text;
    var replace = dialog.replace.text;
    var isAdd = dialog.isAdd.value;
    var prefix = dialog.prefix.text;
    var suffix = dialog.suffix.text;
    var ext = dialog.extension.text;
    if (ext && !/^\./.test(ext)) {
        ext = '.' + ext;
    }
    var dir = dialog.dir.text;

    if (isReplace && !search && !replace && !ext && !dir) return;
    if (isAdd && !prefix && !suffix && !ext && !dir) return;

    return {
        isReplace: isReplace,
        search: search,
        replace: replace,
        isAdd: isAdd,
        prefix: prefix,
        suffix: suffix,
        extension: ext,
        dir: dir
    };
}


function showResult(items) {
    if (!items.length) return;
    for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
    }
    var failures = app.activeDocument.selection;
    var message = {
        en: 'Failed to find ' + failures.length + ' links. These links have not been relinked, and will remain selected in the Links panel.',
        ja: failures.length + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択された状態のまま残ります。'
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

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.filename;
    panel1.preferredSize.width = 421;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 6, 0, 0];

    var radiobutton1 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.isReplace;
    radiobutton1.value = true;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.preferredSize.width = (/en/i.test($.locale)) ? 57 : 87;
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext1 = group3.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.find;

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = (/en/i.test($.locale)) ? 125 : 100;
    edittext1.active = true;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = (/en/i.test($.locale)) ? 60 : 80;
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.replace;

    var edittext2 = group2.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.preferredSize.width = (/en/i.test($.locale)) ? 125 : 100;

    var divider1 = panel1.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group5 = panel1.add('group', undefined, { name: 'group5' });
    group5.preferredSize.width = 65;
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var radiobutton2 = group5.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.isAdd;

    var group6 = panel1.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;
    group6.enabled = false;

    var group7 = group6.add('group', undefined, { name: 'group7' });
    group7.preferredSize.width = (/en/i.test($.locale)) ? 57 : 87;
    group7.orientation = 'row';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext3 = group7.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.prefix;

    var edittext3 = group6.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '';
    edittext3.preferredSize.width = (/en/i.test($.locale)) ? 125 : 100;

    var group8 = group6.add('group', undefined, { name: 'group8' });
    group8.preferredSize.width = (/en/i.test($.locale)) ? 60 : 80;
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var statictext4 = group8.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.suffix;

    var edittext4 = group6.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '';
    edittext4.preferredSize.width = (/en/i.test($.locale)) ? 125 : 100;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.extension;
    panel2.preferredSize.width = 421;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 4, 0, 0];

    var statictext5 = group9.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.relink;

    var edittext5 = group9.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '';
    edittext5.preferredSize.width = 60;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.folder;
    panel3.preferredSize.width = 421;
    panel3.orientation = 'column';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group10 = panel3.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = [0, 4, 0, 0];

    var button1 = group10.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.select;
    button1.preferredSize.width = 65;

    var statictext6 = group10.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = '';
    statictext6.preferredSize.width = 320;

    var group11 = dialog.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['right', 'center'];
    group11.spacing = 10;
    group11.margins = 0;

    var button2 = group11.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.cancel;
    button2.preferredSize.width = 90;

    var button3 = group11.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.ok;
    button3.preferredSize.width = 90;

    radiobutton1.onClick = function() {
        radiobutton2.value = false;
        group2.enabled = true;
        group6.enabled = false;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton2.onClick = function() {
        radiobutton1.value = false;
        group2.enabled = false;
        group6.enabled = true;
        edittext3.active = false;
        edittext3.active = true;
    }

    button1.onClick = function() {
        if (button1.text == ui.select) {
            var src = Folder.selectDialog();
            var text = statictext6.text;
            var dir = (src) ? src.fsName : text;
            statictext6.text = dir;
            statictext6.helpTip = dir;
        }
        else {
            statictext6.text = '';
            statictext6.helpTip = '';
        }
    }

    button2.onClick = function() {
        dialog.close();
    }

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext3.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    statictext5.addEventListener('click', function() {
        edittext5.active = false;
        edittext5.active = true;
    });

    statictext6.addEventListener('click', function() {
        button1.notify('onClick');
    });

    dialog.addEventListener('keydown', function(event) {
        var keyboard = ScriptUI.environment.keyboardState;
        if (keyboard.altKey) {
            button1.text = ui.clear;
            event.preventDefault();
        }
    });

    dialog.addEventListener('keyup', function(event) {
        button1.text = ui.select;
        event.preventDefault();
    });

    dialog.isReplace = radiobutton1;
    dialog.search = edittext1;
    dialog.replace = edittext2;
    dialog.isAdd = radiobutton2;
    dialog.prefix = edittext3;
    dialog.suffix = edittext4;
    dialog.extension = edittext5;
    dialog.dir = statictext6;
    dialog.ok = button3;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Relink File Extension Extra',
            ja: 'ファイル拡張子にリンクを再設定'
        },
        filename: {
            en: 'Filename',
            ja: 'ファイル名'
        },
        isReplace: {
            en: 'Replace',
            ja: '置換'
        },
        find: {
            en: 'Find:',
            ja: '検索文字列:'
        },
        replace: {
            en: 'Replace:',
            ja: '置換文字列:'
        },
        isAdd: {
            en: 'Add',
            ja: '追加'
        },
        prefix: {
            en: 'Prefix:',
            ja: '先頭:'
        },
        suffix: {
            en: 'Suffix:',
            ja: '末尾:'
        },
        relink: {
            en: 'Relink to Filename Extension:',
            ja: 'ファイル名拡張子にリンクを再設定:'
        },
        extension: {
            en: 'Extension',
            ja: '拡張子'
        },
        folder: {
            en: 'Folder',
            ja: '画像フォルダ'
        },
        select: {
            en: 'Select',
            ja: '選択'
        },
        clear: {
            en: 'Clear',
            ja: '削除'
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
