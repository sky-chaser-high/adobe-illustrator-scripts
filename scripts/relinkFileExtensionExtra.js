/* ===============================================================================================================================================
   relinkFileExtensionExtra

   Description
   This script is an enhanced version of relinkFileExtension.js with more advanced settings for relinking linked files.

   Usage
   1. Select any linked files, run this script from File > Scripts > Other Script...
      If no files are selected, it replaces all files in the document.
   2. Select either file renaming method.
      Replace: Enter the current file name in the Find field and a new file name in the Replace field.
               It can also be part of the file name. Regular expressions are supported in the Find field.
      Add: Enter a string to be added to the prefix, suffix, or both of the original file names.
   3. Enter an extension.
      If the file extension is the same, enter nothing.
   4. If you specify PDF as the extension, select the Crop to option and enter the page number.
      See also: https://helpx.adobe.com/illustrator/using/importing-pdf-files.html
   5. To change the folder for the linked file, select a new folder.
      If the folder is the same as the original file, select nothing.
      To clear the new folder path, hold down the Option/Alt key and click the Clear button.

   Notes
   Missing linked files and embedded files are not replaced.
   When selecting linked files, select them in the document rather than the Links panel.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

   Version
   1.3.1

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
        if (failures.length) showResult(failures);
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
            if (!file) {
                failures.push(link);
                continue;
            }
            if (/pdf/i.test(config.extension)) {
                setPDFFileOptions(config);
                relinkPDFFile(link, file);
                link.remove();
            }
            else {
                link.file = file;
            }
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
    if (isMac()) filename = convertJapanese(filename);
    var words = filename.split('.');
    var name = words.slice(0, -1).join('.') || filename;
    return name;
}


function getExtension(src) {
    var filename = File.decode(src.name);
    var words = filename.split('.');
    if (words.length < 2) return '';
    return '.' + words.pop();
}


function setPDFFileOptions(config) {
    var options = app.preferences.PDFFileOptions;
    options.pDFCropToBox = config.crop;
    if (isCC2015Higher()) {
        options.pageToOpen = config.page;
        options.placeAsLinks = true;
    }
    else {
        var key = 'plugin/PDFImport/PageNumber';
        app.preferences.setIntegerPreference(key, config.page);
    }
}


function relinkPDFFile(link, src) {
    var item;
    if (isCC2015Higher()) {
        var layer = link.parent;
        item = layer.placedItems.add();
        item.file = src;
    }
    else {
        item = placePDFFile(src);
    }
    resizePDFFile(item, link);
}


function placePDFFile(src) {
    var filename = File.decode(src.fsName);
    if (isMac()) filename = convertJapanese(filename);
    runPlacePDFFileAction(filename);
    return app.activeDocument.placedItems[0];
}


function resizePDFFile(item, link) {
    var angle = getRotationAngle(link);
    if (angle) item.rotate(angle);

    var ratio = {
        x: link.width / item.width * 100,
        y: link.height / item.height * 100
    };
    var scale = (ratio.x < ratio.y) ? ratio.x : ratio.y;
    item.resize(scale, scale);

    item.top = link.top - (link.height / 2) + (item.height / 2);
    item.left = link.left + (link.width / 2) - (item.width / 2);
    item.move(link, ElementPlacement.PLACEAFTER);
}


function getRotationAngle(item) {
    var matrix = item.matrix;
    var rad = Math.atan2(matrix.mValueB, matrix.mValueA);
    var deg = rad * 180 / Math.PI;
    return deg * -1;
}


function runPlacePDFFileAction(src) {
    var set = '_replaceLinkedFile_';
    var action = 'placePDFFile';
    var code = setActionCode(
        convertToHexChars(set),
        convertToHexChars(action),
        convertToHexChars(src)
    );
    var aia = createAction(code, set);
    try {
        app.loadAction(aia);
        app.doScript(action, set);
        app.unloadAction(set, '');
    }
    catch (err) { }
    aia.remove();
}


function createAction(code, filename) {
    var dir = Folder('~/Desktop/')
    var file = File(dir + filename + '.aia');
    file.open('w');
    file.write(code);
    file.close();
    return file;
}


function setActionCode(set, action, src) {
    return '\
        /version 3\
        /name [ ' + set.length + '\
            ' + set.hex + '\
        ]\
        /isOpen 1\
        /actionCount 1\
        /action-1 {\
            /name [ ' + action.length + '\
                ' + action.hex + '\
            ]\
            /keyIndex 0\
            /colorIndex 0\
            /isOpen 1\
            /eventCount 1\
            /event-1 {\
                /useRulersIn1stQuadrant 0\
                /internalName (adobe_placeDocument)\
                /localizedName [ 5\
                    506c616365\
                ]\
                /isOpen 1\
                /isOn 1\
                /hasDialog 1\
                /showDialog 0\
                /parameterCount 7\
                /parameter-1 {\
                    /key 1885431653\
                    /showInPalette 4294967295\
                    /type (integer)\
                    /value 1\
                }\
                /parameter-2 {\
                    /key 1668444016\
                    /showInPalette 4294967295\
                    /type (enumerated)\
                    /name [ 7\
                        43726f7020546f\
                    ]\
                    /value 4\
                }\
                /parameter-3 {\
                    /key 1885823860\
                    /showInPalette 4294967295\
                    /type (integer)\
                    /value 1\
                }\
                /parameter-4 {\
                    /key 1851878757\
                    /showInPalette 4294967295\
                    /type (ustring)\
                    /value [ ' + src.length + '\
                        ' + src.hex + '\
                    ]\
                }\
                /parameter-5 {\
                    /key 1818848875\
                    /showInPalette 4294967295\
                    /type (boolean)\
                    /value 1\
                }\
                /parameter-6 {\
                    /key 1919970403\
                    /showInPalette 4294967295\
                    /type (boolean)\
                    /value 0\
                }\
                /parameter-7 {\
                    /key 1953329260\
                    /showInPalette 4294967295\
                    /type (boolean)\
                    /value 0\
                }\
            }\
        }\
    ';
}


// https://sttk3.com/blog/tips/illustrator/dynamic-generate-action.html
function convertToHexChars(str) {
    var hexStr = str.replace(/[0-9A-Za-z!'()*._~-]/g, function(c) {
        return c.charCodeAt(0).toString(16);
    });
    var uri = encodeURIComponent(hexStr).replace(/%/g, '').toLowerCase();
    return {
        hex: uri,
        length: uri.length / 2
    };
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


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
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


function isCC2015Higher() {
    var cc2015 = 19;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc2015) return false;
    return true;
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}


function getConfiguration(dialog) {
    var tab = dialog.tab.selection;
    var name = tab.properties.name;

    var isReplace = (name == 'tab1') ? true : false;
    var search = dialog.search.text;
    var replace = dialog.replace.text;

    var isAdd = (name == 'tab2') ? true : false;
    var prefix = dialog.prefix.text;
    var suffix = dialog.suffix.text;

    var ext = dialog.extension.text;
    if (ext && !/^\./.test(ext)) {
        ext = '.' + ext;
    }

    var page = getValue(dialog.page.text);
    if (!page) page = 1;
    var crop = getPDFBoxType(dialog.crop.selection);

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
        page: page,
        crop: crop,
        dir: dir
    };
}


function getPDFBoxType(item) {
    switch (item.index) {
        case 0: return PDFBoxType.PDFBOUNDINGBOX;
        case 1: return PDFBoxType.PDFARTBOX;
        case 2: return PDFBoxType.PDFCROPBOX;
        case 3: return PDFBoxType.PDFTRIMBOX;
        case 4: return PDFBoxType.PDFBLEEDBOX;
        case 5: return PDFBoxType.PDFMEDIABOX;
    }
}


function showResult(items) {
    $.localize = true;
    var ui = localizeUI();

    for (var i = 0; i < items.length; i++) {
        items[i].selected = true;
    }
    var failures = app.activeDocument.selection;
    var message = {
        en: 'Failed to find ' + failures.length + ' links. These links have not been relinked, and will remain selected in the Links panel.',
        ja: failures.length + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択された状態のまま残ります。'
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

    var crop = [
        ui.boundingBox,
        ui.art,
        ui.crop,
        ui.trim,
        ui.bleed,
        ui.media
    ];

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

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.filename;

    var tpanel1 = dialog.add('tabbedpanel', undefined, undefined, { name: 'tpanel1' });
    tpanel1.alignChildren = 'fill';
    tpanel1.margins = 0;

    var tab1 = tpanel1.add('tab', undefined, undefined, { name: 'tab1' });
    tab1.text = ui.isReplace;
    tab1.orientation = 'column';
    tab1.alignChildren = ['fill', 'top'];
    tab1.spacing = 10;
    tab1.margins = 10;

    var group2 = tab1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['fill', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 18;
    group3.margins = 0;
    group3.alignment = ['left', 'center'];

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.find;

    var statictext3 = group3.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.replace;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['fill', 'center'];
    group4.spacing = 10;
    group4.margins = 0;
    group4.alignment = ['fill', 'center'];

    var edittext1 = group4.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.active = true;

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '';

    var tab2 = tpanel1.add('tab', undefined, undefined, { name: 'tab2' });
    tab2.text = ui.isAdd;
    tab2.orientation = 'column';
    tab2.alignChildren = ['fill', 'top'];
    tab2.spacing = 10;
    tab2.margins = 10;

    var group5 = tab2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['fill', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var group6 = group5.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['right', 'center'];
    group6.spacing = 18;
    group6.margins = 0;
    group6.alignment = ['left', 'center'];

    var statictext4 = group6.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.prefix;

    var statictext5 = group6.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.suffix;

    var group7 = group5.add('group', undefined, { name: 'group7' });
    group7.orientation = 'column';
    group7.alignChildren = ['fill', 'center'];
    group7.spacing = 10;
    group7.margins = 0;
    group7.alignment = ['fill', 'center'];

    var edittext3 = group7.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '';

    var edittext4 = group7.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '';

    tpanel1.selection = tab1;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.extension;
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group8 = panel1.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 4, 0, 0];

    var statictext6 = group8.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ui.relink;

    var edittext5 = group8.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '';
    edittext5.preferredSize.width = 60;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.options;
    panel2.orientation = 'column';
    panel2.alignChildren = ['fill', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 4, 0, 0];
    group9.enabled = false;

    var statictext7 = group9.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = ui.cropTo;

    var dropdown1 = group9.add('dropdownlist', undefined, crop, { name: 'dropdown1' });
    dropdown1.selection = 5;

    var statictext8 = group9.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = ui.page;

    var edittext6 = group9.add('edittext', undefined, undefined, { name: 'edittext6' });
    edittext6.text = '1';
    edittext6.preferredSize.width = 60;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.folder;
    panel3.orientation = 'column';
    panel3.alignChildren = ['fill', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group10 = panel3.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['fill', 'center'];
    group10.spacing = 10;
    group10.margins = [0, 4, 0, 0];

    var button1 = group10.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.select;
    button1.preferredSize.width = 60;
    button1.alignment = ['left', 'center'];

    var statictext9 = group10.add('statictext', undefined, undefined, { name: 'statictext9', truncate: 'end' });
    statictext9.text = '';
    statictext9.alignment = ['fill', 'center'];

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

    edittext5.onChanging = function() {
        var extension = edittext5.text;
        if (/pdf/i.test(extension)) {
            group9.enabled = true;
            dropdown1.active = true;
        }
        else {
            group9.enabled = false;
        }
    }

    edittext6.addEventListener('keydown', setIncreaseDecrease);

    button1.onClick = function() {
        if (button1.text == ui.select) {
            var src = Folder.selectDialog();
            var text = statictext9.text;
            var dir = (src) ? src.fsName : text;
            statictext9.text = dir;
            statictext9.helpTip = dir;
        }
        else {
            statictext9.text = '';
            statictext9.helpTip = '';
        }
    }

    button2.onClick = function() {
        dialog.close();
    }

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    statictext3.addEventListener('click', function() {
        edittext2.active = false;
        edittext2.active = true;
    });

    statictext4.addEventListener('click', function() {
        edittext3.active = false;
        edittext3.active = true;
    });

    statictext5.addEventListener('click', function() {
        edittext4.active = false;
        edittext4.active = true;
    });

    statictext6.addEventListener('click', function() {
        edittext5.active = false;
        edittext5.active = true;
    });

    statictext7.addEventListener('click', function() {
        dropdown1.active = false;
        dropdown1.active = true;
    });

    statictext8.addEventListener('click', function() {
        edittext6.active = false;
        edittext6.active = true;
    });

    statictext9.addEventListener('click', function() {
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

    dialog.tab = tpanel1;
    dialog.search = edittext1;
    dialog.replace = edittext2;
    dialog.prefix = edittext3;
    dialog.suffix = edittext4;
    dialog.extension = edittext5;
    dialog.crop = dropdown1;
    dialog.page = edittext6;
    dialog.dir = statictext9;
    dialog.ok = button3;
    return dialog;
}


function setIncreaseDecrease(event) {
    var value = getValue(event.target.text);
    var keyboard = ScriptUI.environment.keyboardState;
    var step = keyboard.shiftKey ? 5 : 1;
    if (event.keyName == 'Up') {
        value += step;
        event.target.text = value;
        event.preventDefault();
    }
    if (event.keyName == 'Down') {
        value -= step;
        if (value < 1) value = 1;
        event.target.text = value;
        event.preventDefault();
    }
}


function localizeUI() {
    return {
        title: {
            en: 'Relink File Extension Extra',
            ja: 'ファイル拡張子にリンクを再設定'
        },
        filename: {
            en: 'Filename:',
            ja: 'ファイル名:'
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
            en: 'Replace With:',
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
        extension: {
            en: 'Extension',
            ja: '拡張子'
        },
        relink: {
            en: 'Relink to Filename Extension:',
            ja: 'ファイル名拡張子にリンクを再設定:'
        },
        options: {
            en: 'PDF Import Options',
            ja: 'PDF 読み込みオプション'
        },
        page: {
            en: 'Page:',
            ja: 'ページ:'
        },
        cropTo: {
            en: 'Crop to:',
            ja: 'トリミング:'
        },
        boundingBox: {
            en: 'Bounding Box',
            ja: 'バウンディングボックス'
        },
        art: {
            en: 'Art',
            ja: 'アート'
        },
        crop: {
            en: 'Crop',
            ja: 'トリミング'
        },
        trim: {
            en: 'Trim',
            ja: '仕上がり'
        },
        bleed: {
            en: 'Bleed',
            ja: '裁ち落とし'
        },
        media: {
            en: 'Media',
            ja: 'メディア'
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
