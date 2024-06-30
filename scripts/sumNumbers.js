/* ===============================================================================================================================================
   sumNumbers

   Description
   This script adds up the numbers in the text.

   Usage
   Select text objects or specify a text range in an editing state, run this script from File > Scripts > Other Script...
   You can also edit numbers in the text field and recalculate the totals.

   Notes
   Editing numbers in the text field does not affect the original text objects.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   2.0.0

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
    var texts = getTextFrames(items);
    if (!texts.length) return;

    var numbers = getNumbers(texts);
    var total = sum(numbers);

    var dialog = showDialog(total, numbers);

    dialog.list.onChanging = function() {
        var list = dialog.list.text.split('\n');
        var texts = getListItems(list);
        var values = getNumbers(texts);
        dialog.total.text = sum(values);
    }

    dialog.reset.onClick = function() {
        dialog.total.text = total;
        dialog.list.text = numbers.join('\n');
    }

    dialog.show();
}


function sum(numbers) {
    var total = 0;
    for (var i = 0; i < numbers.length; i++) {
        var value = numbers[i].replace(/,/g, '');
        total += Number(value);
    }
    return total;
}


function getNumbers(items) {
    var numbers = [];
    var regex = /-?[\d]+,?[\d]*\.?[\d]*/g;
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var contents = getValue(item.contents);
        var values = contents.match(regex);
        if (values) numbers = numbers.concat(values);
    }
    return numbers;
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    return value;
}


function getListItems(items) {
    var list = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        list.push({
            contents: item
        });
    }
    return list;
}


function isTextRange(items) {
    return items.typename == 'TextRange' && items.length;
}


function getTextRanges(items) {
    return [items];
}


function getTextFrames(items) {
    if (isTextRange(items)) return getTextRanges(items);
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame') {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(total, numbers) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.preferredSize.width = 300;
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
    statictext1.text = ui.total;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = total;
    edittext1.alignment = ['fill', 'center'];

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['fill', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var edittext2 = group2.add('edittext', undefined, undefined, { name: 'edittext2', multiline: true });
    edittext2.text = numbers.join('\n');
    edittext2.preferredSize.height = 220;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.reset;
    button1.preferredSize.width = 90;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    dialog.total = edittext1;
    dialog.list = edittext2;
    dialog.reset = button1;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Sum Numbers',
            ja: '数字の合計'
        },
        total: {
            en: 'Total:',
            ja: '合計:'
        },
        reset: {
            en: 'Reset',
            ja: 'リセット'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
