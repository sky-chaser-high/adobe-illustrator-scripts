/* ===============================================================================================================================================
   bulkRelink

   Description
   This script replaces missing links, linked and embedded files in bulk.
   Since version 2024, the Apply to All checkbox has been removed from the dialog that appears when there are missing link files.
   As a result, it is no longer possible to replace files in bulk using this dialog.

   Usage
   1. Select any missing link, linked or embedded files, run this script from File > Scripts > Other Script...
   2. Select a new file.
   3. For PDF, select a crop to option and enter a page number from the import options.

   Notes
   When selecting linked files, select them in the document rather than the Links panel.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

   Version
   1.0.0

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
    var run = true;
    var items = app.activeDocument.selection;
    var links = getPlacedItems(items);
    links = links.concat(getRasterItems(items));
    if (!links.length) return;

    var src = File.openDialog();
    if (!src) return;

    if (isPDFFile(src)) {
        var dialog = showDialog();
        dialog.ok.onClick = function() {
            var crop = getPDFBoxType(dialog.crop.selection);
            var page = getValue(dialog.page.text);
            setPDFFileOptions(crop, page);
            dialog.close();
        }
        dialog.cancel.onClick = function() {
            run = false;
            dialog.close();
        }
        dialog.show();
    }

    if (run) relink(links, src);
}


function relink(links, src) {
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        placeLinkedFile(link, src);
        link.remove();
    }
}


function placeLinkedFile(link, src) {
    var item;
    if (!isCC2015Higher() && isPDFFile(src)) {
        item = placePDFFile(src);
    }
    else {
        var layer = link.parent;
        item = layer.placedItems.add();
        item.file = src;
    }
    resizeLinkedFile(item, link);
}


function resizeLinkedFile(item, link) {
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


function setPDFFileOptions(crop, page) {
    var options = app.preferences.PDFFileOptions;
    options.pDFCropToBox = crop;
    if (isCC2015Higher()) {
        options.pageToOpen = page;
        options.placeAsLinks = true;
    }
    else {
        var key = 'plugin/PDFImport/PageNumber';
        app.preferences.setIntegerPreference(key, page);
    }
}


function placePDFFile(src) {
    var filename = File.decode(src.fsName);
    if (isMac()) filename = convertJapanese(filename);
    runPlacePDFFileAction(filename);
    return app.activeDocument.placedItems[0];
}


function runPlacePDFFileAction(src) {
    var set = 'replaceLinkedFile';
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


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 1;
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


function isPDFFile(src) {
    var extension = getExtension(src);
    return /pdf/i.test(extension);
}


function getExtension(src) {
    var filename = File.decode(src.name);
    var words = filename.split('.');
    if (words.length < 2) return '';
    return '.' + words.pop();
}


function getPlacedItems(items) {
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


function getRasterItems(items) {
    var links = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'RasterItem') {
            links.push(item);
        }
        if (item.typename == 'GroupItem') {
            links = links.concat(getRasterItems(item.pageItems));
        }
    }
    return links;
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
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 18;
    group2.margins = 0;
    group2.alignment = ['left', 'center'];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.cropTo;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.page;

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var dropdown1 = group3.add('dropdownlist', undefined, crop, { name: 'dropdown1' });
    dropdown1.selection = 5;
    dropdown1.active = true;
    dropdown1.alignment = ['fill', 'center'];

    var edittext1 = group3.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';
    edittext1.preferredSize.width = 60;

    var group4 = dialog.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['right', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 10, 0, 0];

    var button1 = group4.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group4.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.addEventListener('keydown', setIncreaseDecrease);

    statictext1.addEventListener('click', function() {
        dropdown1.active = false;
        dropdown1.active = true;
    });

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    dialog.crop = dropdown1;
    dialog.page = edittext1;
    dialog.cancel = button1;
    dialog.ok = button2;
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
