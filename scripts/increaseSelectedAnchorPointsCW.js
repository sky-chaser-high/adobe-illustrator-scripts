/* ===============================================================================================================================================
   increaseSelectedAnchorPointsCW

   Description
   This script increases selected anchor points clockwise.

   Usage
   Select any anchor points with Direct Selection Tool, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

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
    var config = {
        clockwise: true,
        increment: true,
        decrement: false
    };
    var items = app.activeDocument.selection;
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    shapes = shapes.concat(texts);
    for (var i = 0; i < shapes.length; i++) {
        shiftAnchorPoints(shapes[i], config);
    }
}


function shiftAnchorPoints(shape, config) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var NOSELECTION = PathPointSelection.NOSELECTION;

    var indexes = getSelectedAnchorPointIndexes(shape);
    if (!indexes.length) return;

    var clockwise = (config.clockwise)
    ? shape.polarity == PolarityValues.POSITIVE
    : shape.polarity == PolarityValues.NEGATIVE;

    var points = shape.pathPoints;
    var count = points.length;

    var anchors = (clockwise)
    ? getForwardPoints(indexes, count)
    : getBackwardPoints(indexes, count);

    for (var i = 0; i < indexes.length; i++) {
        points[indexes[i]].selected = NOSELECTION;
    }

    if (config.increment) anchors = increase(indexes, count, clockwise);
    if (config.decrement) anchors = decrease(indexes, count, clockwise);

    for (var i = 0; i < anchors.length; i++) {
        points[anchors[i]].selected = ANCHOR;
    }
}


function increase(indexes, count, clockwise) {
    var index;
    for (var i = indexes.length - 1; i >= 0; i--) {
        if (clockwise) {
            index = (indexes[i] < count - 1) ? indexes[i] + 1 : 0;
        }
        else {
            index = (indexes[i] > 0) ? indexes[i] - 1 : count - 1;
        }
        if (!indexExists(indexes, index)) indexes.push(index);
    }
    return indexes.sort();
}


function decrease(indexes, count, clockwise) {
    if (indexes.length == 1) return indexes;
    var nums = [];
    var start = 0;
    var end = indexes.length - 1;

    // If one increase is interrupted, split it.
    for (var i = 0; i < indexes.length; i++) {
        if (i < end) {
            if (indexes[i] + 1 == indexes[i + 1]) continue;
            nums.push(indexes.slice(start, i + 1));
            start = i + 1;
        }
        else {
            nums.push(indexes.slice(start, i + 1));
        }
    }

    // If the first and last anchor points are selected, they are considered one lump.
    if (indexes[0] == 0 && indexes[end] == count - 1 && indexes.length < count) {
        var last = nums.length - 1;
        nums[0] = nums[last].concat(nums[0]);
        nums.pop();
    }

    for (var i = 0; i < nums.length; i++) {
        if (nums[i].length == 1) continue;
        if (clockwise) nums[i].shift();
        else nums[i].pop();
    }

    return nums.join().split(',');
}


function indexExists(array, num) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == num) return true;
    }
    return false;
}


function getForwardPoints(indexes, count) {
    var points = [];
    for (var i = 0; i < indexes.length; i++) {
        var point = (indexes[i] < count - 1) ? indexes[i] + 1 : 0;
        points.push(point);
    }
    return points;
}


function getBackwardPoints(indexes, count) {
    var points = [];
    for (var i = 0; i < indexes.length; i++) {
        var point = (indexes[i] > 0) ? indexes[i] - 1 : count - 1;
        points.push(point);
    }
    return points;
}


function getSelectedAnchorPointIndexes(shape) {
    var ANCHOR = PathPointSelection.ANCHORPOINT;
    var indexes = [];
    var points = shape.pathPoints;
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.selected == ANCHOR) indexes.push(i);
    }
    return indexes;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
    }
    return shapes;
}


function getTextPathItems() {
    var AREA = TextType.AREATEXT;
    var PATH = TextType.PATHTEXT;
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && (text.kind == AREA || text.kind == PATH)) {
            items.push(text.textPath);
        }
    }
    return items;
}
