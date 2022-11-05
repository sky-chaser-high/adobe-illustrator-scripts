/* ===============================================================================================================================================
   selectLink

   Description
   This script selects linked files.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Enter a file name. It can also be part of the file name.
      If the text field is empty, all linked files are selected.

   Notes
   Regular expressions are supported.
   Locked or hidden linked files are not selected. The layer also as well.
   Missing linked files may not be selected.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var name = dialog.link.text;
        selectLinkFile(name);
        dialog.close();
    }

    dialog.center();
    dialog.show();
}


function selectLinkFile(name) {
    var links = app.activeDocument.placedItems;
    if (links.length == 0) return;

    var reg = new RegExp(name, 'ig');
    var filename;

    for (var i = 0; i < links.length; i++) {
        try {
            filename = File.decode(links[i].file.name);
        }
        catch (err) {
            filename = File.decode(links[i].name);
        }
        if (reg.test(filename)) {
            links[i].selected = true;
        }
    }
}


function showDialog() {
    var local = localize();

    var dialog = new Window('dialog');
    dialog.text = local.title;
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

    statictext1.add('statictext', undefined, local.line1);
    statictext1.add('statictext', undefined, local.line2);

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.alignment = ['fill', 'center'];
    edittext1.active = true;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = local.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = local.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.link = edittext1;
    dialog.ok = button2;

    return dialog;
}


function localize() {
    var language = {
        en_US: {
            title: 'Select Link',
            line1: 'Enter a file name. Regular expressions are supported.',
            line2: 'If the text field is empty, all linked files are selected.',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'リンクを選択',
            line1: 'ファイル名を入力してください。正規表現に対応しています。',
            line2: '何も入力しない場合は、すべてのリンクを選択します。',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };
    return language[app.locale] || language.en_US;
}
