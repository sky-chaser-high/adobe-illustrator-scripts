/* ===============================================================================================================================================
   goToLine

   Description
   This script is equivalent to Visual Studio Code's Go menu > 'Go to Line/Column...'. (macOS: Ctrl + G)
   Both point and area types are supported.

   Usage
   1. Run this script in the text editing state from File > Scripts > Other Script...
   2. Enter a line number or select a line from the list below that you want to move.

   Notes
   Since copy and paste inside the script to move the cursor position, if you have copied the content in advance, it will be lost.
   Pan that the selected line is centered in the window.
   If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.
   If you want to enter text, you must click with the mouse.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CC 2018 or higher

   Version
   1.0.1

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
    var text = app.activeDocument.selection;
    if (!text.typename) return;

    var ranges = text.story.textRanges;
    var lines = text.story.lines;

    var contents = getContents(lines);
    var dialog = showDialog(contents);

    dialog.ok.onClick = function() {
        var number = getLine(dialog.line.text, lines);
        if (number) {
            goToLine(number, lines, ranges);
            pan(number, lines);
        }
        dialog.close();
    }

    dialog.show();
}


function goToLine(number, lines, ranges) {
    var row = number - 1;
    var line = lines[row];
    var start = line.start;

    // Move the cursor position.
    if (number == 1) {
        line.insertionPoints[0].characters.add(' ');
        start = 1;
    }
    ranges[start - 1].select();
    app.cut();
    if (number > 1) app.paste();
}


function selectLine(number, lines, ranges) {
    var row = number - 1;
    var line = lines[row];
    var start = line.start;
    var end = line.end;
    for (var i = start; i < end; i++) {
        ranges[i].select(true);
    }
}


function getLine(number, lines) {
    var max = lines.length;
    if (max < Number(number)) {
        return max;
    }
    else if (/^[0-9]*$/.test(number)) {
        return Number(number);
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
    var frame = frames[index];

    var top = frame.top;
    var left = frame.left;
    var width = frame.width;

    var HORIZONTAL = TextOrientation.HORIZONTAL;
    var orientation = frame.orientation;
    var center = (orientation == HORIZONTAL) ? [left, top - leading] : [left + (width - leading), top];

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


function isValidVersion() {
    var cc2018 = 22;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cc2018) return false;
    return true;
}


function showDialog(lines) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
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
    statictext1.text = ui.description;

    var edittext1 = group1.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '';
    edittext1.preferredSize.width = 500;
    edittext1.active = true;

    var listbox1 = group1.add('listbox', undefined, undefined, {
        name: 'listbox1',
        numberOfColumns: 2,
        showHeaders: false,
        columnTitles: ['#', ui.contents]
    });
    listbox1.preferredSize.width = 500;
    listbox1.preferredSize.height = 220;

    for (var i = 0; i < lines.length; i++) {
        var row = listbox1.add('item', i + 1);
        row.subItems[0].text = lines[i];
    }

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;
    group2.alignment = ['fill', 'top'];

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    edittext1.addEventListener('keydown', function(event) {
        var value = Number(edittext1.text);
        if (isNaN(value)) value = 0;
        var keyboard = ScriptUI.environment.keyboardState;
        var step = keyboard.shiftKey ? 10 : 1;
        var line;
        if (event.keyName == 'Up') {
            line = value + step;
            if (line > lines.length) line = lines.length;
            edittext1.text = line;
            event.preventDefault();
        }
        if (event.keyName == 'Down') {
            line = value - step;
            if (line < 1) line = 1;
            edittext1.text = line;
            event.preventDefault();
        }
    });

    listbox1.onChange = function() {
        var line = listbox1.selection.index + 1;
        edittext1.text = line;
    }

    button1.onClick = function() {
        dialog.close();
    }

    dialog.line = edittext1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Go to Line',
            ja: '行に移動'
        },
        description: {
            en: 'Enter a line number or select a line from the list below.',
            ja: '行番号を入力するか、リストから選択してください。'
        },
        contents: {
            en: 'Contents',
            ja: 'コンテンツ'
        },
        select: {
            en: 'Select a line.',
            ja: '行を選択'
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
