/* ===============================================================================================================================================
   disjoinPath

   Description
   This script breaks apart the path object with anchor points.

   Usage
   Select the path objects, run this script from File > Scripts > Other Script...

   Notes
   The original object will be deleted.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts
   =============================================================================================================================================== */

(function() {
    if (app.documents.length) disjoinPath(app.activeDocument.selection);
})();


function disjoinPath(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        if (items[i].typename == 'PathItem') {

            var points = items[i].pathPoints;

            if (points.length > 2) {
                for (var j = 0; j < points.length; j++) {
                    var element = getPathElement(items[i], points[j], (j < points.length - 1) ? points[j + 1] : points[0]);
                    createPathItem(element);
                }
                items[i].remove();
            }
            else {
                items[i].selected = false;
            }
        }
        else if (items[i].typename == 'GroupItem') {
            disjoinPath(items[i].pageItems);
        }
        else if (items[i].typename == 'CompoundPathItem') {
            disjoinPath(items[i].pathItems);
        }
        else {
            items[i].selected = false;
        }
    }
}


function getPathElement(item, p1, p2) {
    var color = item.strokeColor;
    if (color.typename == 'NoColor') {
        color = (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK) ? setCMYK(0, 0, 0, 100) : setRGB(0, 0, 0);
    }
    return {
        attribute: {
            color: color,
            cap: item.strokeCap,
            join: item.strokeJoin,
            dashes: item.strokeDashes,
            weight: item.strokeWidth
        },
        anchor: {
            x1: p1.anchor[0],
            y1: p1.anchor[1],
            x2: p2.anchor[0],
            y2: p2.anchor[1]
        },
        handle: {
            left: {
                x1: p1.leftDirection[0],
                y1: p1.leftDirection[1],
                x2: p2.leftDirection[0],
                y2: p2.leftDirection[1]
            },
            right: {
                x1: p1.rightDirection[0],
                y1: p1.rightDirection[1],
                x2: p2.rightDirection[0],
                y2: p2.rightDirection[1]
            }
        }
    };
}


function createPathItem(element) {
    var item = app.activeDocument.activeLayer.pathItems.add();
    item.setEntirePath([[element.anchor.x1, element.anchor.y1], [element.anchor.x2, element.anchor.y2]]);
    item.pathPoints[0].leftDirection = [element.handle.left.x1, element.handle.left.y1];
    item.pathPoints[0].rightDirection = [element.handle.right.x1, element.handle.right.y1];
    item.pathPoints[1].leftDirection = [element.handle.left.x2, element.handle.left.y2];
    item.pathPoints[1].rightDirection = [element.handle.right.x2, element.handle.right.y2];

    item.filled = false;
    item.stroked = true;
    item.strokeWidth = element.attribute.weight;
    item.strokeDashes = element.attribute.dashes;
    item.strokeCap = element.attribute.cap;
    item.strokeJoin = element.attribute.join;
    item.strokeColor = element.attribute.color;
}


function setCMYK(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGB(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}
