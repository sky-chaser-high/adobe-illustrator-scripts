/* ===============================================================================================================================================
   sortLines

   Description
   This script sorts lines of the text.

   Usage
   1. Select either the text objects or the lines to be sorted, run this script from File > Scripts > Other Script...
   2. Check the Match Case checkbox to make the text case-sensitive.
   3. Check the Entire Threaded Text checkbox to sort the entire threaded text.
   4. Click one of the sort buttons below.
      A → Z: Sort in A to Z order.
      Z → A: Sort in Z to A order.
      Reverse: Sort in reverse order.

   Notes
   Wrapped lines in the area type split on each line.
   If the selection spans next threads, it cannot be sorted.
   Type on a paths are not supported.
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
    var items = app.activeDocument.selection;
    if (!textItemsExists(items)) return;

    var hasThreadedText = threadedTextExists(items);
    var dialog = showDialog(hasThreadedText);

    dialog.AtoZ.onClick = function() {
        var order = 'AtoZ';
        var caps = dialog.caps.value;
        var thread = dialog.thread.value;
        sortTextContents(order, items, caps, thread);
        dialog.close();
    }

    dialog.ZtoA.onClick = function() {
        var order = 'ZtoA';
        var caps = dialog.caps.value;
        var thread = dialog.thread.value;
        sortTextContents(order, items, caps, thread);
        dialog.close();
    }

    dialog.reverse.onClick = function() {
        var order = 'Reverse';
        var caps = dialog.caps.value;
        var thread = dialog.thread.value;
        sortTextContents(order, items, caps, thread);
        dialog.close();
    }

    dialog.show();
}


function sortTextContents(order, items, caps, entire) {
    if (isTextRange(items)) {
        sortSelectedLines(order, items, caps);
        return;
    }

    var texts = getTextFrames(items);
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (isThreadedText(text)) {
            if (entire) sortEntireThreadedText(order, text, caps);
            else sortSelectedThreadedText(order, text, caps);
        }
        else {
            sortAllLines(order, text, caps);
        }
    }
}


function sortAllLines(order, text, caps) {
    removeLinefeed(text);
    addLinefeed(text);

    var lines = getLines(text);
    var contents = getOrder(order, lines, caps);

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        var end = text.contents.length - 1;
        var position = text.textRanges[end];
        content.duplicate(position);
        addLinefeed(text);
    }

    var start = 0;
    removeLines(text, start, contents.length);
    removeLinefeed(text);
}


function sortSelectedLines(order, ranges, caps) {
    var end = ranges.end;
    var text = getTextFrame(ranges);
    if (isLastThread(ranges)) addLinefeed(text);

    var lines = getLines(ranges);
    var contents = getOrder(order, lines, caps);

    var lengths = getTextLengths(contents);
    var start = getFirstSelectedLineIndex(text, ranges);

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        try {
            var position = text.textRanges[end];
        }
        catch (err) { }
        content.duplicate(position);
        position.characters.add('\n');
        end += lengths[i] + 1;
    }

    removeLines(text, start, contents.length);
    if (isLastThread(ranges)) removeLinefeed(text);
}


function sortEntireThreadedText(order, text, caps) {
    var texts = text.story.textFrames;
    var last = texts.length - 1;
    var thread = {
        first: texts[0],
        last: texts[last]
    };
    removeLinefeed(thread.last);
    addLinefeed(thread.last);

    var lines = [];
    for (var i = 0; i < texts.length; i++) {
        lines = lines.concat(getLines(texts[i]));
    }
    var contents = getOrder(order, lines, caps);

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        var end = thread.last.contents.length;
        var position = thread.last.textRange.insertionPoints[end];
        content.duplicate(position);
        addLinefeed(thread.last);
    }

    var start = 0;
    removeLines(thread.first, start, contents.length);
    removeLinefeed(thread.last);
}


function sortSelectedThreadedText(order, text, caps) {
    var end = text.textRange.end - 1;
    if (isLastThread(text.textRange)) end++;
    addLinefeed(text);

    var lines = getLines(text);
    var contents = getOrder(order, lines, caps);

    var lengths = getTextLengths(contents);
    var start = 0;

    for (var i = 0; i < contents.length; i++) {
        var content = contents[i];
        try {
            var position = text.textRanges[end];
        }
        catch (err) { }
        content.duplicate(position);
        position.characters.add('\n');
        end += lengths[i];
        if (isLastThread(text.textRange)) end++;
    }

    removeLines(text, start, contents.length);
    removeLinefeed(text);
}


function isLastThread(items) {
    var threads = items.story.textFrames;
    var last = threads.length - 1;
    var thread = threads[last];
    var start = thread.textRange.start;
    var end = thread.textRange.end;
    if (start <= items.start && items.start <= end) return true;
    return false;
}


function getFirstSelectedLineIndex(text, ranges) {
    for (var i = 0; i < text.lines.length; i++) {
        var line = text.lines[i];
        var range = ranges.lines[0];
        if (line.start == range.start) return i;
    }
    return 0;
}


function getTextLengths(texts) {
    var lengths = [];
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        lengths.push(text.contents.length);
    }
    return lengths;
}


function getOrder(order, lines, caps) {
    switch (order) {
        case 'AtoZ':
            return sortLines(lines, caps);
        case 'ZtoA':
            return sortLines(lines, caps).reverse();
        case 'Reverse':
            return lines.reverse();
    }
}


function sortLines(lines, caps) {
    return lines.sort(function(a, b) {
        var text = {
            a: caps ? a.contents : a.contents.toLowerCase(),
            b: caps ? b.contents : b.contents.toLowerCase()
        };
        text.a = text.a.replace(/(\d+)/g, setZeroPadding);
        text.b = text.b.replace(/(\d+)/g, setZeroPadding);
        return text.a > text.b;
    });
}


function setZeroPadding(str) {
    var zero = '0000000000';
    var digits = zero.length * -1;
    return (zero + str).slice(digits);
}


function removeLines(text, start, count) {
    for (var i = 0; i < count; i++) {
        text.lines[start].remove();
        var head = text.lines[start].start;
        text.textRanges[head].remove();
    }
}


function addLinefeed(text) {
    var end = text.contents.length;
    var position = text.textRange.insertionPoints[end];
    position.characters.add('\n');
}


function removeLinefeed(text) {
    var start = text.textRange.start;
    var end = text.textRange.end;
    var ranges = text.textRanges;
    for (var i = end - 1; i >= start; i--) {
        var range = ranges[i];
        var linefeed = /\n$|\r$/;
        if (!linefeed.test(range.contents)) return;
        range.remove();
    }
}


function hasLinefeed(item) {
    var linefeed = /\n$|\r$|\r\n$|\u0003$/;
    return linefeed.test(item);
}


function getLines(item) {
    var lines = [];
    for (var i = 0; i < item.lines.length; i++) {
        var line = item.lines[i];
        lines.push(line);
    }
    return lines;
}


function textItemsExists(items) {
    if (isTextRange(items)) return true;
    var texts = getTextFrames(items);
    if (texts.length) return true;
    return false;
}


function threadedTextExists(items) {
    if (isTextRange(items)) return false;
    if (!items.length) return isThreadedText(items);

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (isThreadedText(item)) return true;
    }
    return false;
}


function isTextRange(items) {
    return items.typename == 'TextRange' && items.length;
}


function isThreadedText(item) {
    var texts = item.story.textFrames;
    if (texts.length > 1) return true;
    return false;
}


function getTextFrame(items) {
    var threads = items.story.textFrames;
    if (threads.length == 1) return threads[0];

    for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];
        var start = thread.textRange.start;
        var end = thread.textRange.end;
        if (start <= items.start && items.end <= end) return thread;
    }
}


function getTextFrames(items) {
    var texts = [];
    if (items.typename == 'TextRange') {
        var text = getTextFrame(items);
        return [text];
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind != TextType.PATHTEXT) {
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


function showDialog(hasThreadedText) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.preferredSize.width = 225;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 6;
    group1.margins = 0;

    var checkbox1 = group1.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.caps;

    var checkbox2 = group1.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.thread;
    if (!hasThreadedText) checkbox2.enabled = false;

    var divider1 = dialog.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['fill', 'center'];
    group2.spacing = 14;
    group2.margins = [0, 5, 0, 0];

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.AtoZ;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ZtoA;

    var button3 = group2.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.reverse;

    var button4 = group2.add('button', undefined, undefined, { name: 'button4' });
    button4.text = ui.cancel;

    button4.onClick = function() {
        dialog.close();
    }

    dialog.caps = checkbox1;
    dialog.thread = checkbox2;
    dialog.AtoZ = button1;
    dialog.ZtoA = button2;
    dialog.reverse = button3;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Sort Lines',
            ja: 'テキストの並べ替え'
        },
        caps: {
            en: 'Match Case',
            ja: '大文字と小文字を区別'
        },
        thread: {
            en: 'Entire Threaded Text',
            ja: 'スレッド全体を並べ替え'
        },
        AtoZ: {
            en: 'A → Z',
            ja: 'A → Z'
        },
        ZtoA: {
            en: 'Z → A',
            ja: 'Z → A'
        },
        reverse: {
            en: 'Reverse',
            ja: '逆順'
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
