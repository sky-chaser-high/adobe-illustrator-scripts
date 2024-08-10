/* ===============================================================================================================================================
   renameLayer

   Description
   This script renames all layer names at once.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Edit the layer name displayed in the text field.

   Options are available for quickly editing layer names.
   Number
    - Replace the number at the beginning or end of the layer name.
    - Add a number to the beginning or end of the layer name.
    - Increase or decrease the number at the beginning or end of the layer name.
    - Check the Descending Order checkbox to change to descending order.
   Text
    - Add text to the beginning or end of the layer name.
   Replace
    - Replace the layer name with the specified string.
    - Regular expressions support in the Find field.

   Notes
   Sublayers are not supported.
   A warning is issued if the number of lines of the text field is less than the number of layers.
   Add layers for the increased number of lines if the number of lines of the text field is greater than the number of layers.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

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
    if (app.documents.length && isValidVersion()) main();
})();


function main() {
    var layerNames = getLayerNames();
    var history = [layerNames];
    var count = 0;

    var dialog = showDialog(layerNames);

    dialog.number.add.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var names = addNumber(texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.number.replace.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var names = replaceNumber(texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.number.decrease.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var value = -1;
        var names = increaseNumber(value, texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.number.increase.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var value = 1;
        var names = increaseNumber(value, texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.contents.add.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var names = addText(texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.search.apply.onClick = function() {
        var texts = dialog.names.text.split('\n');
        history.push(texts);
        count++;
        var config = getConfiguration(dialog);
        var names = replaceText(texts, config);
        dialog.names.text = names.join('\n');
    }

    dialog.reset.onClick = function() {
        history = [];
        history.push(layerNames);
        count = 0;
        dialog.names.text = layerNames.join('\n');
    }

    dialog.undo.onClick = function() {
        dialog.names.text = history[count].join('\n');
        count--;
        if (count < 0) count = 0;
        if (1 < history.length) history.pop();
    }

    dialog.ok.onClick = function() {
        var texts = dialog.names.text.split('\n');
        var done = renameLayer(texts);
        if (done) dialog.close();
    }

    dialog.show();
}


function getConfiguration(dialog) {
    var number = {
        start: getValue(dialog.number.start.text),
        isDescendingOrder: dialog.number.isDescendingOrder.value,
        isPrefix: dialog.number.isPrefix.value,
        isSuffix: dialog.number.isSuffix.value
    };
    var contents = {
        text: dialog.contents.text.text,
        isPrefix: dialog.contents.isPrefix.value,
        isSuffix: dialog.contents.isSuffix.value
    };
    var search = {
        find: dialog.search.find.text,
        replace: dialog.search.replace.text
    };
    return {
        number: number,
        contents: contents,
        search: search
    };
}


function renameLayer(items) {
    items = deleteEmptyName(items);

    var layers = app.activeDocument.layers;
    var length = layers.length;

    var count = countTextLines(items, layers);
    if (!count) return false;

    for (var i = 0; i < items.length; i++) {
        var name = items[i];
        var layer = (i < length) ? layers[i] : layers.add();
        layer.name = name;
        if (length - 1 < i) layer.zOrder(ZOrderMethod.SENDTOBACK);
    }
    return true;
}


function deleteEmptyName(items) {
    for (var i = items.length - 1; 0 <= i; i--) {
        var name = items[i];
        var regex = /\s+/g;
        name = name.replace(regex, '');
        if (!name) items.splice(i, 1);
    }
    return items;
}


function countTextLines(items, layers) {
    if (layers.length <= items.length) return true;
    $.localize = true;
    var ui = localizeUI();
    return alert(ui.message);
}


function addNumber(layers, config) {
    var names = [];
    var start = config.number.start;
    var isDescendingOrder = config.number.isDescendingOrder;
    var isPrefix = config.number.isPrefix;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var name = isPrefix ? (start + ' ' + layer) : (layer + ' ' + start);
        names.push(name);
        isDescendingOrder ? start-- : start++;
    }
    return names;
}


function increaseNumber(value, layers, config) {
    var names = [];
    var isPrefix = config.number.isPrefix;
    var regex = isPrefix ? /^\d+/ : /\d+$/;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (regex.test(layer)) {
            var num = Number(layer.match(regex)[0]);
            num += value;
            if (num < 0) num = 0;
            layer = layer.replace(regex, num);
        }
        names.push(layer);
    }
    return names;
}


function replaceNumber(layers, config) {
    var names = [];
    var start = config.number.start;
    var isDescendingOrder = config.number.isDescendingOrder;
    var isPrefix = config.number.isPrefix;
    var regex = isPrefix ? /^\d+/ : /\d+$/;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (regex.test(layer)) {
            layer = layer.replace(regex, start);
            isDescendingOrder ? start-- : start++;
        }
        names.push(layer);
    }
    return names;
}


function addText(layers, config) {
    var names = [];
    var text = config.contents.text;
    var isPrefix = config.contents.isPrefix;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (text) {
            layer = isPrefix ? (text + ' ' + layer) : (layer + ' ' + text);
        }
        names.push(layer);
    }
    return names;
}


function replaceText(layers, config) {
    var names = [];
    var find = config.search.find;
    var replace = config.search.replace;
    var regex = new RegExp(find, 'ig');

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (regex.test(layer)) {
            layer = layer.replace(regex, replace);
        }
        names.push(layer);
    }
    return names;
}


function getLayerNames() {
    var names = [];
    var layers = app.activeDocument.layers;
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        names.push(layer.name);
    }
    return names;
}


function getValue(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function (str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    if (isNaN(value) || !value) return 0;
    return Number(value);
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(layers) {
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
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 0, 0, 10];

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1', multiline: true });
    edittext1.text = layers.join('\n');
    edittext1.preferredSize.height = 220;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = layers.length + ' ' + ui.lines + '/ ' + layers.length + ' ' + ui.layers;

    var tpanel1 = dialog.add('tabbedpanel', undefined, undefined, { name: 'tpanel1' });
    tpanel1.alignChildren = 'fill';
    tpanel1.margins = 0;

    var tab1 = tpanel1.add('tab', undefined, undefined, { name: 'tab1' });
    tab1.text = ui.number;
    tab1.orientation = 'column';
    tab1.alignChildren = ['fill', 'top'];
    tab1.spacing = 10;
    tab1.margins = [10, 10, 0, 10];

    var group2 = tab1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.start;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var edittext2 = group4.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '1';
    edittext2.preferredSize.width = 50;

    var group5 = group2.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['left', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 5, 0, 0];

    var checkbox1 = group5.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.descendingOrder;

    var group6 = group2.add('group', undefined, { name: 'group6' });
    group6.orientation = 'row';
    group6.alignChildren = ['left', 'center'];
    group6.spacing = 10;
    group6.margins = [0, 5, 0, 0];

    var radiobutton1 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.prefix;

    var radiobutton2 = group6.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.suffix;
    radiobutton2.value = true;

    var group7 = group2.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['right', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var button1 = group7.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.replace;
    button1.preferredSize.width = 70;

    var button2 = group7.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.add;
    button2.preferredSize.width = 70;

    var group8 = tab1.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['right', 'center'];
    group8.spacing = 10;
    group8.margins = 0;

    var button3 = group8.add('button', undefined, undefined, { name: 'button3' });
    button3.text = '-1';
    button3.preferredSize.width = 30;

    var button4 = group8.add('button', undefined, undefined, { name: 'button4' });
    button4.text = '+1';
    button4.preferredSize.width = 30;

    var tab2 = tpanel1.add('tab', undefined, undefined, { name: 'tab2' });
    tab2.text = ui.text;
    tab2.orientation = 'column';
    tab2.alignChildren = ['fill', 'top'];
    tab2.spacing = 10;
    tab2.margins = [10, 10, 0, 10];

    var group9 = tab2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = 0;

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'column';
    group10.alignChildren = ['right', 'center'];
    group10.spacing = 10;
    group10.margins = 0;

    var statictext3 = group10.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.contents;

    var group11 = group9.add('group', undefined, { name: 'group11' });
    group11.orientation = 'column';
    group11.alignChildren = ['fill', 'center'];
    group11.spacing = 10;
    group11.margins = 0;
    group11.alignment = ['fill', 'center'];

    var edittext3 = group11.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '';

    var group12 = group9.add('group', undefined, { name: 'group12' });
    group12.orientation = 'row';
    group12.alignChildren = ['right', 'center'];
    group12.spacing = 10;
    group12.margins = [0, 5, 0, 0];
    group12.alignment = ['right', 'center'];

    var radiobutton3 = group12.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.prefix;
    radiobutton3.value = true;

    var radiobutton4 = group12.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.suffix;

    var group13 = group9.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['right', 'center'];
    group13.spacing = 10;
    group13.margins = 0;
    group13.alignment = ['left', 'center'];

    var button5 = group13.add('button', undefined, undefined, { name: 'button5' });
    button5.text = ui.add;
    button5.preferredSize.width = 70;

    var tab3 = tpanel1.add('tab', undefined, undefined, { name: 'tab3' });
    tab3.text = ui.replace;
    tab3.orientation = 'column';
    tab3.alignChildren = ['fill', 'top'];
    tab3.spacing = 10;
    tab3.margins = [10, 10, 0, 10];

    var group14 = tab3.add('group', undefined, { name: 'group14' });
    group14.orientation = 'row';
    group14.alignChildren = ['left', 'center'];
    group14.spacing = 10;
    group14.margins = 0;

    var group15 = group14.add('group', undefined, { name: 'group15' });
    group15.orientation = 'column';
    group15.alignChildren = ['right', 'center'];
    group15.spacing = 18;
    group15.margins = [0, 2, 0, 0];

    var statictext4 = group15.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.find;

    var statictext5 = group15.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.search;

    var group16 = group14.add('group', undefined, { name: 'group16' });
    group16.orientation = 'column';
    group16.alignChildren = ['fill', 'center'];
    group16.spacing = 10;
    group16.margins = [0, 2, 0, 0];
    group16.alignment = ['fill', 'center'];

    var edittext4 = group16.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '';

    var edittext5 = group16.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '';

    var group17 = group14.add('group', undefined, { name: 'group17' });
    group17.orientation = 'row';
    group17.alignChildren = ['right', 'center'];
    group17.spacing = 10;
    group17.margins = 0;
    group17.alignment = ['right', 'top'];

    var button6 = group17.add('button', undefined, undefined, { name: 'button6' });
    button6.text = ui.replace;
    button6.preferredSize.width = 70;

    tpanel1.selection = tab1;

    var group18 = dialog.add('group', undefined, { name: 'group18' });
    group18.orientation = 'row';
    group18.alignChildren = ['left', 'center'];
    group18.spacing = 10;
    group18.margins = 0;

    var button7 = group18.add('button', undefined, undefined, { name: 'button7' });
    button7.text = ui.reset;
    button7.preferredSize.width = 90;
    button7.alignment = ['left', 'center'];

    var button8 = group18.add('button', undefined, undefined, { name: 'button8' });
    button8.text = ui.undo;
    button8.preferredSize.width = 90;
    button8.alignment = ['left', 'center'];

    var button9 = group18.add('button', undefined, undefined, { name: 'button9' });
    button9.text = ui.cancel;
    button9.preferredSize.width = 90;
    button9.alignment = ['right', 'center'];

    var button10 = group18.add('button', undefined, undefined, { name: 'button10' });
    button10.text = ui.ok;
    button10.preferredSize.width = 90;
    button10.alignment = ['right', 'center'];

    edittext1.onChanging = function() {
        var texts = edittext1.text.split('\n');
        var contents = texts.length + ' ' + ui.lines + '/ ' + layers.length + ' ' + ui.layers;
        statictext1.text = contents;
    }

    edittext2.addEventListener('keydown', setIncreaseDecrease);

    checkbox1.onClick = function() {
        if (checkbox1.value) {
            edittext2.text = layers.length;
        }
        else {
            edittext2.text = '1';
        }
    }

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

    button9.onClick = function() {
        dialog.close();
    }

    dialog.names = edittext1;
    dialog.number = {
        start: edittext2,
        isDescendingOrder: checkbox1,
        isPrefix: radiobutton1,
        isSuffix: radiobutton2,
        replace: button1,
        add: button2,
        decrease: button3,
        increase: button4
    };
    dialog.contents = {
        text: edittext3,
        isPrefix: radiobutton3,
        isSuffix: radiobutton4,
        add: button5
    };
    dialog.search = {
        find: edittext4,
        replace: edittext5,
        apply: button6
    };
    dialog.reset = button7;
    dialog.undo = button8;
    dialog.ok = button10;
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
        event.target.text = value;
        event.preventDefault();
    }
}


function localizeUI() {
    return {
        title: {
            en: 'Rename Layer',
            ja: 'レイヤー名の変更'
        },
        layerName: {
            en: 'Layer Name',
            ja: 'レイヤー名'
        },
        lines: {
            en: 'Lines',
            ja: '行'
        },
        layers: {
            en: 'Layers',
            ja: 'レイヤー'
        },
        number: {
            en: 'Number',
            ja: '数字'
        },
        start: {
            en: 'Start:',
            ja: '開始:'
        },
        descendingOrder: {
            en: 'Descending Order',
            ja: '降順'
        },
        prefix: {
            en: 'Prefix',
            ja: '先頭'
        },
        suffix: {
            en: 'Suffix',
            ja: '末尾'
        },
        replace: {
            en: 'Replace',
            ja: '置換'
        },
        add: {
            en: 'Add',
            ja: '追加'
        },
        text: {
            en: 'Text',
            ja: '文字'
        },
        contents: {
            en: 'Text:',
            ja: '文字:'
        },
        find: {
            en: 'Find:',
            ja: '検索文字列:'
        },
        search: {
            en: 'Replace With:',
            ja: '置換文字列:'
        },
        reset: {
            en: 'Reset All',
            ja: 'リセット'
        },
        undo: {
            en: 'Undo',
            ja: '取り消し'
        },
        cancel: {
            en: 'Cancel',
            ja: 'キャンセル'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        },
        message: {
            en: 'The number of lines in the text field are less than the number of layers.',
            ja: 'テキストフィールドの行数がレイヤー数より少なくなっています。'
        }
    };
}
