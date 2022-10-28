/* ===============================================================================================================================================
   relinkFileExtensionExtra.js

   Description
   This script is an enhanced version of relinkFileExtension.js.

   Usage
   1. Open the Ai file.
   2. Run this script from File > Scripts > Other Script...
      If you don't select an image, all images in the document will be targeted.
   3. Choose to replace or add the string.
      To replace, you can use regular expressions.
      To add, specify a string to be added to the beginning or end of the original file name, or both.
   4. Enter the extension.
      If you don't enter an extension, the extension of the original file will be used.

   Notes
   Place the relink files in the same place as the original files.
   Broken link files are not replaced.
   Embedded files are also not possible.

   Requirements
   Illustrator CS4 or higher

   Version
   1.0.0
   =============================================================================================================================================== */

if (app.documents.length > 0) main();


function main() {
    var language = getLanguage();

    var dialog = new Window('dialog', language.title, undefined);
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'fill'];

    var panelFileName = dialog.add('panel', undefined, language.filename);
    panelFileName.orientation = 'column';
    panelFileName.alignChildren = ['left', 'fill'];

    var radios = panelFileName.add('group');
    radios.orientation = 'column';
    radios.alignChildren = ['left', 'fill'];
    radios.margins = [0, 10, 0, 10];


    var replace = radios.add('radiobutton', undefined, language.isReplace);

    var replaces = radios.add('group');
    replaces.orientation = 'row';
    replaces.alignChildren = ['fill', 'fill'];
    replaces.enabled = false;
    replaces.margins = [0, 0, 0, 15];

    var strSearch = replaces.add('statictext', undefined, language.search + ' :');
    var editSearch = replaces.add('edittext', undefined, '');
    editSearch.size = { width: 90, height: 20 };

    var strReplace = replaces.add('statictext', undefined, language.replace + ' :');
    var editReplace = replaces.add('edittext', undefined, '');
    editReplace.size = { width: 90, height: 20 };


    var add = radios.add('radiobutton', undefined, language.isAdd);

    var adds = radios.add('group');
    adds.orientation = 'row';
    adds.alignChildren = ['fill', 'fill'];
    adds.enabled = false;
    adds.margins = [0, 0, 0, -5];

    var strPrefix = adds.add('statictext', undefined, language.prefix + ' :');
    var editPrefix = adds.add('edittext', undefined, '');
    editPrefix.size = { width: 90, height: 20 };

    var strSuffix = adds.add('statictext', undefined, language.suffix + ' :');
    var editSuffix = adds.add('edittext', undefined, '');
    editSuffix.size = { width: 90, height: 20 };


    var panelExtension = dialog.add('panel', undefined, language.extension);
    panelExtension.alignChildren = ['fill', 'fill'];

    var extensions = panelExtension.add('group');
    extensions.orientation = 'column';
    extensions.alignChildren = ['fill', 'fill'];
    extensions.margins = [0, 10, 0, 5];

    var staticExtension = extensions.add('statictext', undefined, language.relink + ' :');
    var editExtension = extensions.add('edittext', undefined, '');


    var buttons = dialog.add('group');
    buttons.alignChildren = ['right', 'fill'];

    var cancel = buttons.add('button', undefined, language.cancel);
    var ok = buttons.add('button', undefined, language.ok);


    replace.onClick = function() {
        if (add.value) {
            add.value = false;
            adds.enabled = false;
        }
        if (replace.value) {
            replaces.enabled = true;
        }
        editSearch.active = true;
    }

    add.onClick = function () {
        if (replace.value) {
            replace.value = false;
            replaces.enabled = false;
        }
        if (add.value) {
            adds.enabled = true;
        }
        editPrefix.active = true;
    }


    cancel.onClick = function () {
        dialog.close();
    }

    ok.onClick = function () {
        var config = {
            isReplace: replace.value,
            search: editSearch.text,
            replace: editReplace.text,
            isAdd: add.value,
            prefix: editPrefix.text,
            suffix: editSuffix.text,
            extension: editExtension.text
        };

        if (!/^\./.test(config.extension) && config.extension != '') {
            config.extension = '.' + config.extension;
        }

        var result = relinkFileExtension(config);
        showResult(result);

        dialog.close();
    }

    dialog.center();
    dialog.show();
}


function relinkFileExtension(config) {
    var images = getPlacedItems();
    var extension = config.extension;

    var failedFiles = [];
    var notfound = 0;
    var unlinked = 0;

    var imageFile;
    // var imageFileInLinks;

    for (var i = 0; i < images.length; i++) {
        try {
            var path = images[i].file.path;
            var name = images[i].file.name.split('.').slice(0, -1).join('.') || images[i].file.name;

            // If the extension is not specified, the extension of the original file is used.
            if (extension == '') {
                if (images[i].file.name.split('.').length > 1) {
                    extension = '.' + images[i].file.name.split('.').slice(-1)[0];
                }
            }

            if (config.isReplace) {
                var reg = new RegExp(config.search, 'i');
                imageFile = File(path + '/' + name.replace(reg, config.replace) + extension);
            }
            else if (config.isAdd) {
                imageFile = File(path + '/' + config.prefix + name + config.suffix + extension);
            }
            else {
                imageFile = File(path + '/' + name + extension);
            }

            // imageFileInLinks = File(path + '/Links/' + name + extension);

            if (imageFile.exists) {
                images[i].file = imageFile;
            }
            // else if (imageFileInLinks.exists) {
            //     images[i].file = imageFileInLinks;
            // }
            else {
                failedFiles.push(images[i]);
                notfound++;
            }
        }
        catch (e) {
            failedFiles.push(images[i]);
            unlinked++;
        }
    }

    return {
        files: failedFiles,
        count: notfound + unlinked
    };
}


function getPlacedItems() {
    if (app.activeDocument.selection == 0) {
        return app.activeDocument.placedItems;
    }
    else {
        var images = [];
        var placedItems = app.activeDocument.placedItems;
        for (var i = 0; i < placedItems.length; i++) {
            if (placedItems[i].selected) {
                images.push(placedItems[i]);
            }
        }
        return images;
    }
}


function enterExtension() {
    var str = {
        en_US: 'Relink each selected link to a file that has tha same name as the original, and is stored in the same folder, but uses another filename extension.\rRelink to Filename Extension:',
        ja_JP: '選択した各リンクをファイルに再設定します。このファイルは元のファイルと同じ名前で、同じフォルダに保存されていますが、別の拡張子を使用しています。\rファイル名拡張子にリンクを再設定：'
    }

    var extension = prompt(str[app.locale] || str.en_US, '');

    if (extension == null) {
        return extension;
    }
    else if (extension == '') {
        return null;
    }
    else if (!/^\./.test(extension)) {
        return '.' + extension;
    }
    else {
        return extension;
    }
}


function showResult(obj) {
    app.activeDocument.selection = null;

    for (var i = 0; i < obj.files.length; i++) {
        obj.files[i].selected = true;
    }

    var message = {
        en_US: 'Failed to find ' + obj.count + ' links. These links have not been relinked, and will remain selected int the Links panel.',
        ja_JP: obj.count + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択されたままの状態で残ります。'
    }

    if (obj.count > 0) alert(message[app.locale] || message.en_US);
}


function getLanguage() {
    var language = {
        en_US: {
            title: 'Relink File Extension Extra',
            filename: 'File name',
            isReplace: 'Replace a string',
            search: 'Search',
            replace: 'Replace',
            isAdd: 'Add a string',
            prefix: 'Prefix',
            suffix: 'Suffix',
            relink: 'Relink to Filename Extension',
            extension: 'Extension',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'ファイル拡張子にリンクを再設定',
            filename: 'ファイル名',
            isReplace: '文字列を置換する',
            search: '検索',
            replace: '置換',
            isAdd: '文字列を追加する',
            prefix: '先頭',
            suffix: '末尾',
            relink: 'ファイル名拡張子にリンクを再設定',
            extension: '拡張子',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };

    return language[app.locale] || language.en_US;
}
