/* ===============================================================================================================================================
   UI_Image_Encoder

   Description
   This script converts a image file to binary for use within the ScriptUI.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select an image file. Only JPEG and PNG format image files are supported.
   3. Select the encoding method, either the Unicode or the Percent-encoding.
   4. Select whether to escape quotation marks.
   5. Click the Convert button.
   6. Copy the string converted to binary and paste it into the code you are creating.
      Escape quotation marks if necessary.

   Example
   var binary = '\u0089PNG\r\n\x1A\n\x00...';
   var image = dialog.add('image', undefined, File.decode(binary));

   Notes
   Unicode has a smaller binary size than percent-encoding.
   See also: https://github.com/NTProductions/ui-image-testing
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
    if (isValidVersion()) main();
})();


function main() {
    var dialog = showDialog();

    dialog.convert.onClick = function() {
        var src = dialog.file.text;
        var quote = getQuotationMark(dialog);
        var data = encodeFile(src, quote);
        if (dialog.unicode.value) dialog.binary.text = (data) ? data.unicode : '';
        if (dialog.percent.value) dialog.binary.text = (data) ? data.percent : '';

        dialog.binary.active = false;
        dialog.binary.active = true;
    }

    dialog.show();
}


function encodeFile(src, quote) {
    var file = File(src);
    if (!file.exists) return;

    file.encoding = 'BINARY'
    file.open('r');

    var binary = file.read();
    var unicode = binary.toSource();
    var percent = encodeURIComponent(binary);
    file.close();

    unicode = unicode.replace(/^\(new\sString\("/i, '');
    unicode = unicode.replace(/"\)\)/i, '');

    if (quote) {
        var regex = new RegExp(quote, 'g');
        percent = percent.replace(regex, '\\' + quote);
        unicode = unicode.replace(regex, '\\' + quote);
    }

    return {
        unicode: unicode,
        percent: percent
    };
}


function getQuotationMark(dialog) {
    var escape = dialog.escape.value;
    if (!escape) return '';
    var quote = dialog.singleQuote.value;
    return (quote) ? '\'' : '"';
}


function isValidVersion() {
    var cs4 = 14;
    var current = parseInt(app.version);
    if (current < cs4) return false;
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

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.image;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 4, 0, 0];

    var button1 = group1.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.select;
    button1.preferredSize.width = 60;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = '';
    statictext1.preferredSize.width = 450;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.encode;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group2 = panel2.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 8, 0, 0];

    var radiobutton1 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.unicode;
    radiobutton1.value = true;

    var radiobutton2 = group2.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.percent;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.quotationMark;
    panel3.orientation = 'column';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group3 = panel3.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 8, 0, 0];

    var checkbox1 = group3.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.escape;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;
    group4.enabled = false;

    var radiobutton3 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.singleQuote;
    radiobutton3.value = true;

    var radiobutton4 = group4.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.doubleQuote;

    var group5 = dialog.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['fill', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 6, 0, 0];

    var statictext2 = group5.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.binary;

    var edittext1 = group5.add('edittext', undefined, undefined, { name: 'edittext1', multiline: true });
    edittext1.text = '';
    edittext1.preferredSize.height = 300;

    var group6 = dialog.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['right', 'center'];
    group6.spacing = 10;
    group6.margins = 0;

    var button2 = group6.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.close;
    button2.preferredSize.width = 90;

    var button3 = group6.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.convert;
    button3.preferredSize.width = 90;
    button3.enabled = false;

    statictext1.addEventListener('click', function() {
        button1.notify('onClick');
    });

    statictext2.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    checkbox1.onClick = function() {
        if (checkbox1.value) {
            group4.enabled = true;
        }
        else {
            group4.enabled = false;
        }
    }

    button1.onClick = function() {
        var src = File.openDialog('', filterExtension(), false);
        var file = (src) ? src.fsName : ''
        if (!src && statictext1.text) file = statictext1.text;
        statictext1.text = file;
        statictext1.helpTip = file;
        if (src) button3.enabled = true;
    }

    button2.onClick = function() {
        dialog.close();
    }

    dialog.file = statictext1;
    dialog.unicode = radiobutton1;
    dialog.percent = radiobutton2;
    dialog.escape = checkbox1;
    dialog.singleQuote = radiobutton3;
    dialog.doubleQuote = radiobutton4;
    dialog.binary = edittext1;
    dialog.convert = button3;
    return dialog;
}


// See also:
// https://community.adobe.com/t5/indesign-discussions/jsx-file-opendialog-how-to-allow-multiple-file-formats-for-windows/m-p/11238773
// https://stackoverflow.com/questions/25492829/allow-all-file-types-to-be-selected-in-extendscripts-file-object-opendlg-meth
function filterExtension() {
    var extensions = [
        'jpg',
        'jpeg',
        'png'
    ];
    if (/win/i.test($.os)) {
        return '*.' + extensions.join(';*.');
    }
    return function(item) {
        var regex = new RegExp('\.(' + extensions.join('|') + ')$', 'i');
        return item instanceof Folder || regex.test(item.fsName);
    };
}


function localizeUI() {
    return {
        title: {
            en: 'UI Image Encoder',
            ja: 'UI Image Encoder'
        },
        image: {
            en: 'Image',
            ja: '画像'
        },
        select: {
            en: 'Select',
            ja: '選択'
        },
        encode: {
            en: 'Encode',
            ja: 'エンコード'
        },
        unicode: {
            en: 'Unicode',
            ja: 'Unicode'
        },
        percent: {
            en: 'Percent-encoding',
            ja: 'パーセントエンコーディング'
        },
        quotationMark: {
            en: 'Quotation Marks',
            ja: 'クォーテーションマーク'
        },
        escape: {
            en: 'Escape:',
            ja: 'エスケープ:'
        },
        singleQuote: {
            en: '\\\'',
            ja: '\\\''
        },
        doubleQuote: {
            en: '\\\"',
            ja: '\\\"'
        },
        binary: {
            en: 'Binary:',
            ja: 'バイナリー:'
        },
        close: {
            en: 'Close',
            ja: '閉じる'
        },
        convert: {
            en: 'Convert',
            ja: '変換'
        }
    };
}
