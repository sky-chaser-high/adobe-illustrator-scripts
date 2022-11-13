/* ===============================================================================================================================================
   goToNextText

   Description
   This script moves the cursor to the beginning of the next text while in the text editing state.
   Both point and area types are supported.

   Usage
   Run this script in the text editing state from File > Scripts > Other Script...

   Notes
   It will not move to locked, hidden, or threaded texts. The layer also as well.
   The cursor moving order is text stacking order.
   Pan that the next text is centered in the window.
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
        if (!text.typename) return;

        var frames = app.activeDocument.textFrames;
        var current = getCurrentTextIndex(frames, text.start);
        // frames[current].selected = false;

        var frame = getNextText(frames, current);
        moveToBeginningOf(frame);
        pan(frame);
    }
    catch (err) { }
}


function getNextText(frames, index) {
    var next = (index < frames.length - 1) ? index + 1 : 0;
    var frame = frames[next];
    var layer = getLayer(frame);

    if (layer.locked || !layer.visible) {
        return getNextText(frames, next);
    }
    if (hasGroupItem(frame)) {
        return getNextText(frames, next);
    }
    if (hasThread(frame)) {
        return getNextText(frames, next);
    }
    if (frame.locked || frame.hidden) {
        return getNextText(frames, next);
    }

    return frame;
}


function hasGroupItem(item) {
    var parent = item.parent;
    if (parent.typename == 'GroupItem') {
        if (parent.locked || parent.hidden) {
            return true;
        }
        else {
            return hasGroupItem(parent);
        }
    }
    return false;
}


function getLayer(item) {
    var parent = item.parent;
    if (parent.typename == 'GroupItem') {
        return getLayer(parent);
    }
    return parent;
}


function getCurrentTextIndex(frames, cursor) {
    for (var i = 0; i < frames.length; i++) {
        // if (frames[i].selected) return i;
        if (frames[i].selected) {
            frames[i].selected = false;
            if (hasThread(frames[i])) {
                var text = getThreadText(frames[i], cursor);
                if (text === frames[i]) return i;
            }
            else {
                return i;
            }
        }
    }
    return 0;
}


function hasThread(frame) {
    if (frame.kind == TextType.AREATEXT && frame.previousFrame) return true;
    return false;
}


function getThreadText(frame, cursor) {
    var frames = frame.story.textFrames;
    for (var i = 0; i < frames.length; i++) {
        var start = frames[i].textRange.start;
        var end = frames[i].textRange.end;
        if (start <= cursor && cursor <= end) return frames[i];
    }
}


function moveToBeginningOf(text) {
    text.insertionPoints[0].characters.add('\r');
    text.textRanges[0].select();
    app.cut();
}


function pan(text) {
    var view = app.activeDocument.views[0];
    view.centerPoint = [text.left, text.top];
}
