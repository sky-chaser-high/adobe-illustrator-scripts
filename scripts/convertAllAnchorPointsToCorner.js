/* ===============================================================================================================================================
   convertAllAnchorPointsToCorner

   Description
   This script converts all anchor points to the corner.
   The anchor point conversion options in the Control panel requires the anchor point to be selected,
   but this script selects the entire object.

   Usage
   Select the entire path with the Selection Tool, run this script from File > Scripts > Other Script...
   If you select anchor points with the Direct Selection Tool,
   a dialog will show to convert all or only selected anchor points to corner points.

   Notes
   Anchor points for type on a path and area type are also supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

   Version
   1.1.0

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
    var shapes = getPathItems(items);
    var texts = getTextPathItems();
    shapes = shapes.concat(texts);
    var isAll = true;

    if (hasAnchorPointNoSelected(shapes)) {
        var dialog = showDialog();
        dialog.selected.onClick = function() {
            isAll = false;
            dialog.close();
        }
        dialog.cancel.onClick = function() {
            shapes = [];
            dialog.close();
        }
        dialog.show();
    }

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        convertToCorner(shape, isAll);
    }
}


function convertToCorner(item, isAll) {
    var points = item.pathPoints;
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (!isAll && point.selected != PathPointSelection.ANCHORPOINT) continue;
        point.leftDirection = point.anchor;
        point.rightDirection = point.anchor;
    }
}


function hasAnchorPointNoSelected(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var points = item.pathPoints;
        for (var j = 0; j < points.length; j++) {
            var point = points[j];
            if (point.selected != PathPointSelection.ANCHORPOINT) return true;
        }
    }
    return false;
}


function getPathItems(items) {
    var shapes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.typename == 'PathItem') {
            shapes.push(item);
        }
        if (item.typename == 'GroupItem') {
            shapes = shapes.concat(getPathItems(item.pageItems));
        }
        if (item.typename == 'CompoundPathItem') {
            shapes = shapes.concat(getPathItems(item.pathItems));
        }
    }
    return shapes;
}


function getTextPathItems() {
    var items = [];
    var texts = app.activeDocument.textFrames;
    for (var i = 0; i < texts.length; i++) {
        var text = texts[i];
        if (text.selected && text.kind != TextType.POINTTEXT) {
            items.push(text.textPath);
        }
    }
    return items;
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.preferredSize.width = 240;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['fill', 'center'];
    group1.spacing = 16;
    group1.margins = 0;

    var button1 = group1.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.all;
    button1.active = true;

    var button2 = group1.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.selected;

    var button3 = group1.add('button', undefined, undefined, { name: 'button3' });
    button3.text = ui.cancel;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.selected = button2;
    dialog.cancel = button3;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Convert Anchor Points to Corner',
            ja: 'コーナーポイントに切り替え'
        },
        all: {
            en: 'All Anchor Points',
            ja: 'すべてのアンカーポイント'
        },
        selected: {
            en: 'Only Selected Anchor Points',
            ja: '選択したアンカーポイントのみ'
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
