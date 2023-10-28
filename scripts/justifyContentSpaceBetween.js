/* ===============================================================================================================================================
   justifyContentSpaceBetween

   Description
   This script adjusts tracking to align point texts at both ends.
   Vertical text is also supported.

   Usage
   Select point text objects and a reference path object, run this script from File > Scripts > Other Script...
   Text objects can also align with each other. In this case, select only the text objects.

   Notes
   Different font sizes mixed within a single-line point text will not work well.
   The text position does not change.
   The object to use as a reference will be the longest one.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

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
    var items = app.activeDocument.selection;
    var texts = getTextFrames(items);
    if (!texts.length) return;

    var orientation = texts[0].orientation;
    var target = getTargetItem(texts, orientation);
    var shapes = getPathItems(items);
    if (shapes.length) target = getTargetItem(shapes, orientation);
    var ref = getTargetLength(target, orientation);

    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var lines = text.lines;
        if (lines.length > 1) {
            justifyMultiLine(lines, ref);
            continue;
        }
        if (text === target) continue;
        justifySingleLine(text, ref, target);
    }
}


function justifySingleLine(text, target) {
    text.textRange.characterAttributes.kerningMethod = AutoKernType.NOAUTOKERN;
    text.textRange.kerning = 0;

    var em = getTrackingValue(text, target);
    text.textRange.characterAttributes.tracking = em;

    var ranges = text.textRanges;
    var end = ranges.length - 1;
    ranges[end].characterAttributes.tracking = 0;
}


function justifyMultiLine(texts, target) {
    var start = 0;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        var temp = app.activeDocument.activeLayer.textFrames.add();
        var range = temp.textRange;
        text.duplicate(range);

        var orientation = temp.orientation;
        var length = getTargetLength(temp, orientation);

        if (length != target) {
            range.characterAttributes.kerningMethod = AutoKernType.NOAUTOKERN;
            range.kerning = 0;
            var em = getTrackingValue(temp, target);
            text.characterAttributes.kerningMethod = AutoKernType.NOAUTOKERN;
            text.kerning = 0;
            text.characterAttributes.tracking = em;
        }

        var ranges = text.textRanges;
        var end = start + ranges.length - 1;
        ranges[end].characterAttributes.kerningMethod = AutoKernType.NOAUTOKERN;
        ranges[end].characterAttributes.tracking = 0;

        start += ranges.length + 1;
        temp.remove();
    }
}


function getTrackingValue(text, target) {
    var delta = getDelta(text, target);
    var scale = getCharacterScale(text);
    var fontsize = text.textRange.characterAttributes.size;
    var count = text.contents.length - 1;

    // length(pt) = em * fontsize(pt) / 1000
    var em = (delta / scale) * 1000 / fontsize;
    var tracking = em / count;
    return tracking;
}


function getDelta(text, target) {
    text.textRange.characterAttributes.tracking = 0;
    var length = getTargetLength(text, text.orientation);
    return target - length;
}


function getCharacterScale(text) {
    var attributes = text.textRange.characterAttributes;
    if (text.orientation == TextOrientation.VERTICAL) {
        return attributes.verticalScale / 100;
    }
    return attributes.horizontalScale / 100;
}


function getTargetLength(target, orientation) {
    if (orientation == TextOrientation.VERTICAL) {
        return getHeight(target);
    }
    return getWidth(target);
}


// Get the width value considering the descender and the arc of stem. (https://www.canva.com/learn/typography-terms/)
function getWidth(item) {
    if (item.typename != 'TextFrame') return item.width;

    var justification = item.textRange.paragraphAttributes.justification;
    var position = item.position;

    align(item, Justification.LEFT);
    var width = item.width;
    var x1 = item.anchor[0];
    var x2 = item.geometricBounds[0];
    var left = Math.abs(x2 - x1);

    align(item, Justification.RIGHT);
    var x3 = item.anchor[0];
    var x4 = item.geometricBounds[2];
    var right = Math.abs(x4 - x3);

    align(item, justification);
    item.position = position;
    return width - left - right;
}


// Get the height value considering the descender and the arc of stem. (https://www.canva.com/learn/typography-terms/)
function getHeight(item) {
    if (item.typename != 'TextFrame') return item.height;

    var justification = item.textRange.paragraphAttributes.justification;
    var position = item.position;

    align(item, Justification.LEFT);
    var height = item.height;
    var y1 = item.anchor[1];
    var y2 = item.geometricBounds[1];
    var top = Math.abs(y2 - y1);

    align(item, Justification.RIGHT);
    var y3 = item.anchor[1];
    var y4 = item.geometricBounds[3];
    var bottom = Math.abs(y4 - y3);

    align(item, justification);
    item.position = position;
    return height - top - bottom;
}


function align(text, justification) {
    // work around a bug
    // community.adobe.com/t5/illustrator-discussions/trouble-assigning-textframe-to-justification-left/m-p/4211277
    var shrink = 80;
    var expand = (1 / shrink) * 10000;

    text.resize(shrink, shrink);
    text.textRange.paragraphAttributes.justification = justification;
    text.resize(expand, expand);
}


function getTargetItem(items, orientation) {
    var target = items[0];
    for (var i = 1; i < items.length; i++) {
        var item = items[i];
        if (orientation == TextOrientation.HORIZONTAL) {
            if (target.width < item.width) target = item;
        }
        else {
            if (target.height < item.height) target = item;
        }
    }
    return target;
}


function getTextFrames(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'TextFrame' && item.kind == TextType.POINTTEXT) {
            texts.push(item);
        }
        if (item.typename == 'GroupItem') {
            texts = texts.concat(getTextFrames(item.pageItems));
        }
    }
    return texts;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem' || item.typename == 'CompoundPathItem') {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
