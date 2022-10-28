/* ===============================================================================================================================================
   roundColorValue

   Description
   This script rounds color values. Both fill and stroke colors are supported.

   Usage
   Select the objects, run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    var items = app.activeDocument.selection;
    for (var i = 0; i < items.length; i++) {
        roundOff(items[i]);
    }
}


function roundOff(item) {
    switch (item.typename) {
        case 'PathItem':
            if (item.filled) roundColorValue(item.fillColor);
            if (item.stroked) roundColorValue(item.strokeColor);
            return;
        case 'CompoundPathItem':
            var items = item.pathItems;
            for (var i = 0; i < items.length; i++) {
                roundOff(items[i]);
            }
            return;
        case 'GroupItem':
            var items = item.pageItems;
            for (var i = 0; i < items.length; i++) {
                roundOff(items[i]);
            }
            return;
        case 'TextFrame':
            var ranges = item.textRanges;
            for (var i = 0; i < ranges.length; i++) {
                var text = ranges[i].characterAttributes;
                if (text.fillColor.typename != 'NoColor') roundColorValue(text.fillColor);
                if (text.strokeColor.typename != 'NoColor') roundColorValue(text.strokeColor);
            }
            return;
    }
}


function roundColorValue(item) {
    switch (item.typename) {
        case 'CMYKColor':
            item.cyan = Math.round(item.cyan);
            item.magenta = Math.round(item.magenta);
            item.yellow = Math.round(item.yellow);
            item.black = Math.round(item.black);
            return;
        case 'GradientColor':
            var gradients = item.gradient.gradientStops;
            for (var i = 0; i < gradients.length; i++) {
                roundColorValue(gradients[i].color);
            }
            return;
        case 'GrayColor':
            item.gray = Math.round(item.gray);
            return;
        case 'SpotColor':
            item.tint = Math.round(item.tint);
            return;
    }
}
