/* ===============================================================================================================================================
   relinkFileExtensionExtra

   Description
   This script is an enhanced version of relinkFileExtension.js.

   Usage
   1. Run this script from File > Scripts > Other Script...
      If you don't select linked files, all in the document replace.
   2. Choose to Replace or Add.
      To Replace, you can use regular expressions.
      To Add, enter a string to be added to the prefix, suffix, or both of the original file names.
   3. Enter an extension.
      If you don't enter an extension, it uses the original file extension.

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

    dialog.ok.onClick = function() {
        var config = {
            isReplace: dialog.isReplace.value,
            search: dialog.search.text,
            replace: dialog.replace.text,
            isAdd: dialog.isAdd.value,
            prefix: dialog.prefix.text,
            suffix: dialog.suffix.text,
            extension: dialog.extension.text
        };

        var items = app.activeDocument.selection;
        var links = getPlacedItems(items);

        var files = relink(links, config);

        app.activeDocument.selection = null;
        if (files.length) showResult(files);

        dialog.close();
    }

    dialog.show();
}


function relink(items, config) {
    var extension = config.extension;
    var failedFiles = [];

    for (var i = 0; i < items.length; i++) {
        var link = items[i];
        try {
            var path = link.file.path;
            var name = link.file.name.split('.').slice(0, -1).join('.') || link.file.name;

            if (!extension) config.extension = getExtension(link.file.name);

            var filename = getFilename(name, config);
            var file = File(path + '/' + filename);

            if (file.exists) link.file = file;
            else failedFiles.push(link);
        }
        catch (err) {
            failedFiles.push(link);
        }
    }

    return failedFiles;
}


function getFilename(str, config) {
    if (config.isReplace) {
        var regex = new RegExp(config.search, 'i');
        return File.decode(str).replace(regex, config.replace) + '.' + config.extension;
    }
    if (config.isAdd) {
        return config.prefix + File.decode(str) + config.suffix + '.' + config.extension;
    }
    return str + '.' + config.extension;
}


function getExtension(filename) {
    var words = filename.split('.');
    if (words.length > 1) return words.slice(-1)[0];
    return '';
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
    group1.alignment = ['fill','top'];

    var panel1 = group1.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.filename;
    panel1.preferredSize.width = 375;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group2 = panel1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 6, 0, 0];

    var radiobutton1 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.isReplace;
    radiobutton1.value = true;

    var group3 = panel1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'fill'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = 60;
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var statictext1 = group4.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.search;

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 100;
    edittext1.preferredSize.height = 20;
    edittext1.active = true;

    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.preferredSize.width = 60;
    group5.orientation = 'row';
    group5.alignChildren = ['right', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var statictext2 = group5.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.replace;

    var edittext2 = group3.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';
    edittext2.preferredSize.width = 100;
    edittext2.preferredSize.height = 20;

    var divider1 = panel1.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group6 = panel1.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var radiobutton2 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.isAdd;

    var group7 = panel1.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'fill'];
    group7.spacing = 10;
    group7.margins = 0;
    group7.enabled = false;

    var group8 = group7.add('group', undefined, { name: 'group8' });
    group8.preferredSize.width = 60;
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var statictext3 = group8.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.prefix;

    var edittext3 = group7.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '';
    edittext3.preferredSize.width = 100;
    edittext3.preferredSize.height = 20;

    var group9 = group7.add('group', undefined, { name: 'group9' });
    group9.preferredSize.width = 60;
    group9.orientation = 'row';
    group9.alignChildren = ['right', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var statictext4 = group9.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.suffix;

    var edittext4 = group7.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '';
    edittext4.preferredSize.width = 100;
    edittext4.preferredSize.height = 20;

    var group10 = dialog.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = 0;
    group10.alignment = ['fill', 'top'];

    var panel2 = group10.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.extension;
    panel2.preferredSize.width = 375;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;
    panel2.alignment = ['left', 'fill'];

    var group11 = panel2.add('group', undefined, { name: 'group11' });
    group11.orientation = 'row';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = [0, 6, 0, 0];

    var statictext5 = group11.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.relink;

    var edittext5 = panel2.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '';
    edittext5.alignment = ['fill', 'top'];
    edittext5.preferredSize.height = 20;

    var group12 = dialog.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['right', 'center'];
    group12.spacing = 10;
    group12.margins = 0;

    var button1 = group12.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group12.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;


    radiobutton1.onClick = function() {
        radiobutton2.value = false;
        group3.enabled = true;
        group7.enabled = false;
        edittext1.active = true;
    }

    radiobutton2.onClick = function() {
        radiobutton1.value = false;
        group3.enabled = false;
        group7.enabled = true;
        edittext3.active = true;
    }

    button1.onClick = function() {
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


    dialog.isReplace = radiobutton1;
    dialog.search = edittext1;
    dialog.replace = edittext2;
    dialog.isAdd = radiobutton2;
    dialog.prefix = edittext3;
    dialog.suffix = edittext4;
    dialog.extension = edittext5;
    dialog.ok = button2;

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
        search: {
            en: 'Search:',
            ja: '検索:'
        },
        replace: {
            en: 'Replace:',
            ja: '置換:'
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
