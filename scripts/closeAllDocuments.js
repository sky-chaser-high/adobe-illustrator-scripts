/* ===============================================================================================================================================
   closeAllDocuments

   Description
   This script closes all documents.

   Usage
   Just run this script from File > Scripts > Other Script...
   If there are unsaved documents, choose to save them or not.

   Notes
   It has been implemented in the File menu since version 2021.
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
    var param = {
        applyToAll: false,
        cancel: false,
        save: false
    };
    while (app.documents.length) {
        param = closeAllDocuments(param);
        if (!param) return;
    }
}


function closeAllDocuments(param) {
    var item = app.activeDocument;
    if (param.cancel) {
        return;
    }
    else if (item.saved) {
        item.close(SaveOptions.DONOTSAVECHANGES);
        return param;
    }
    else if (param.applyToAll) {
        if (param.save && !item.saved) item.save();
        item.close(SaveOptions.DONOTSAVECHANGES);
        return param;
    }
    else {
        return closeDocument(item);
    }
}


function closeDocument(item) {
    var param = {
        applyToAll: false,
        cancel: false,
        save: false
    };
    var dialog = showDialog();

    dialog.dontSave.onClick = function() {
        param.applyToAll = dialog.applyToAll.value;
        param.save = false;
        item.close(SaveOptions.DONOTSAVECHANGES);
        dialog.close();
    }

    dialog.cancel.onClick = function() {
        param.cancel = true;
        dialog.close();
    }

    dialog.save.onClick = function() {
        param.applyToAll = dialog.applyToAll.value;
        param.save = true;
        item.close(SaveOptions.SAVECHANGES);
        dialog.close();
    }

    dialog.show();
    return param;
}


function getFilename(item) {
    var name = File.decode(item.name);
    return name;
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
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
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1', multiline: true });
    statictext1.text = ui.message1;
    statictext1.preferredSize.width = 400;

    var statictext2 = group1.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.message2;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 10, 0, 6];

    var checkbox1 = group2.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.apply;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.dontSave;
    button1.preferredSize.width = 90;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.cancel;
    button2.preferredSize.width = 90;

    var button3 = group3.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.save;
    button3.preferredSize.width = 90;

    dialog.applyToAll = checkbox1;
    dialog.dontSave = button1;
    dialog.cancel = button2;
    dialog.save = button3;
    return dialog;
}


function localizeUI() {
    var item = app.activeDocument;
    var filename = getFilename(item);
    return {
        title: {
            en: 'Close All Documents',
            ja: 'すべてを閉じる'
        },
        message1: {
            en: 'Save changes to the Adobe Illustrator document "' + filename + '" before closing?',
            ja: '閉じる前に、Adobe Illustrator ドキュメント「' + filename + '」を保存しますか？'
        },
        message2: {
            en: 'If you don\'t save, your changes will be lost.',
            ja: '保存しない場合、変更が失われます。'
        },
        apply: {
            en: 'Apply to All',
            ja: 'すべてに適用'
        },
        dontSave: {
            en: 'Don\'t Save',
            ja: '保存しない'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        save: {
            en: 'Save',
            ja: '保存'
        }
    };
}
