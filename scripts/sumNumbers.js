/* ===============================================================================================================================================
   sumNumbers

   Description
   This script sums the numbers in text contents.

   Usage
   Select text objects, run this script from File > Scripts > Other Script...
   You can also recalculate using only selected items from the list.

   Notes
   Ignore the units of value.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    var texts = getTextFrames(app.activeDocument.selection);
    var numbers = getNumbers(texts);
    var total = sum(numbers);

    var dialog = showResult(total, numbers);

    dialog.recalc.onClick = function() {
        var items = getListItems(dialog.list.items);
        var numbers = getNumbers(items);
        var total = sum(numbers);
        dialog.total.text = total;
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
    var regex = /[+-]?[\d](\.|,)?[\d]*/g;
    for (var i = 0; i < items.length; i++) {
        var contents = items[i].contents;
        var values = contents.match(regex);
        if (values) numbers = numbers.concat(values);
    }
    return numbers;
}


function getListItems(items) {
    var values = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].selected) {
            var contents = items[i].subItems[0].text;
            values.push({ contents: contents });
        }
    }
    return values;
}


function getTextFrames(items) {
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


function showResult(total, numbers) {
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
    group1.orientation = 'column';
    group1.alignChildren = ['fill', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.total;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = total;
    edittext1.active = true;

    var listbox1 = group1.add('listbox', undefined, undefined, {
        name: 'listbox1',
        numberOfColumns: 2,
        multiselect: true
    });
    listbox1.preferredSize.height = 211;

    for (var i = 0; i < numbers.length; i++) {
        var row = listbox1.add('item', i + 1);
        row.subItems[0].text = numbers[i];
    }

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['fill', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2', multiline: true });
    statictext2.text = ui.description;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.recalculation;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 26;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 26;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    dialog.total = edittext1;
    dialog.list = listbox1;
    dialog.recalc = button1;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Sum the Numbers',
            ja: '数字を合計'
        },
        total: {
            en: 'Total:',
            ja: '合計:'
        },
        description: {
            en: 'You can also recalculate using only selected items from the list.',
            ja: 'リストから選択した項目のみで再計算することもできます。'
        },
        recalculation: {
            en: 'Recalculate',
            ja: '再計算'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
