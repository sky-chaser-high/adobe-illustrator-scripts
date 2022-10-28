/* ===============================================================================================================================================
   goToLine

   Description
   This script is equivalent to Visual Studio Code's Go menu 'Go to Line'. (macOS: Ctrl + G)
   Both point and area types are supported.

   Usage
   1. Run this script in the text editing state from File > Scripts > Other Script...
   2. Enter a line number or select a line from the list below that you want to move.

   Notes
   Pan that the selected line is centered in the window.
   Since copy and paste inside the script to move the cursor position, if you have copied the content in advance, it will be lost.
   If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.
   If you want to enter text, you must click with the mouse.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CC 2018 or higher

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
    try {
        var text = app.activeDocument.selection;
        var ranges = text.story.textRanges;
        var lines = text.story.lines;

        var contents = getContents(lines);
        var dialog = showDialog(contents);

        dialog.ok.onClick = function() {
            var number = getLine(dialog.line.text, lines);
            if (number) {
                goToLine(number, lines, ranges);
                // if (dialog.select.value) selectLine(number, lines, ranges);
                pan(number, lines);
            }
            dialog.close();
        }

        dialog.center();
        dialog.show();
    }
    catch (err) { }
}


function goToLine(number, lines, ranges) {
    var row = number - 1;
    var start = lines[row].start;

    // Move the cursor position.
    if (number == 1) {
        lines[row].insertionPoints[0].characters.add(' ');
        start = 1;
    }
    ranges[start - 1].select();
    app.cut();
    if (number > 1) app.paste();
}


function selectLine(number, lines, ranges) {
    var row = number - 1;
    var start = lines[row].start;
    var end = lines[row].end;
    for (var i = start; i < end; i++) {
        ranges[i].select(true);
    }
}


function getLine(number, lines) {
    var max = lines.length;
    if (/^[0-9]*$/.test(number)) {
        return Number(number);
    }
    else if (Number(number) > max) {
        return max;
    }
    else {
        return 0;
    }
}


function getContents(lines) {
    var contents = [];
    for (var i = 0; i < lines.length; i++) {
        contents.push(lines[i].contents);
    }
    return contents;
}


function pan(number, lines) {
    var frames = lines.parent.textFrames;

    var index = getTextFrameIndex(number, frames);
    var leading = getLeading(number, frames, index);

    var top = frames[index].top;
    var left = frames[index].left;
    var width = frames[index].width;

    var orientation = frames[index].orientation;
    var center = (orientation == TextOrientation.HORIZONTAL) ? [left, top - leading] : [left + (width - leading), top];

    var view = app.activeDocument.views[0];
    view.centerPoint = center;
}


function getLeading(number, frames, index) {
    var lines = 0;
    for (var i = 0; i < index; i++) {
        lines += frames[i].lines.length;
    }
    var leading = 0;
    for (var i = 0; lines < number; i++, lines++) {
        var attributes = frames[index].lines[i].characterAttributes;
        leading += attributes.leading;
    }
    return leading;
}


function getTextFrameIndex(number, frames) {
    var lines = 0;
    for (var i = 0; i < frames.length; i++) {
        lines += frames[i].lines.length;
        if (lines >= number) return i;
    }
    return 0;
}


function showDialog(lines) {
    var local = localize();

    var dialog = new Window('dialog');
    dialog.text = local.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['left', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = local.description;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 500;
    edittext1.active = true;

    var listbox1 = group1.add('listbox', undefined, undefined, {
        name: 'listbox1',
        numberOfColumns: 2,
        showHeaders: false,
        columnTitles: ['#', local.contents]
    });
    listbox1.preferredSize.width = 500;
    listbox1.preferredSize.height = 220;

    for (var i = 0; i < lines.length; i++) {
        var row = listbox1.add('item', i + 1);
        row.subItems[0].text = lines[i];
    }

    // var checkbox1 = group1.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    // checkbox1.text = local.select;
    // checkbox1.value = false;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;
    group2.alignment = ['fill', 'top'];

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = local.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 30;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = local.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 30;


    listbox1.onChange = function() {
        var line = listbox1.selection.index + 1;
        edittext1.text = line;
    }

    button1.onClick = function() {
        dialog.close();
    }


    dialog.line = edittext1;
    // dialog.select = checkbox1;
    dialog.ok = button2;

    return dialog;
}


function localize() {
    var language = {
        en_US: {
            title: 'Go to Line...',
            description: 'Enter a line number or select a line from the list below.',
            contents: 'Contents',
            select: 'Select a line.',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: '行に移動...',
            description: '行番号を入力するか、リストから選択してください。',
            contents: 'コンテンツ',
            select: '行を選択',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };
    return language[app.locale] || language.en_US;
}
