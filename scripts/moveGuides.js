/* ===============================================================================================================================================
   moveGuides

   Description
   This script moves all guide objects to a layer, frontmost, and backmost.

   Usage
   1. Run this script from File > Scripts > Other Script...
      There is no need to select any guide objects.
   2. Select a destination.
      Layer: Move to the specified layer. If it does not exist, create a new layer.
      Bring to Front: Move to the frontmost of each layer.
      Send to Back: Move to the backmost of each layer.

   Notes
   Guides in locked or hidden layers are not supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS6 or higher

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
    var dialog = showDialog();

    dialog.ok.onClick = function() {
        var name = dialog.name.text;
        if (!name) name = 'Guides';

        var destination = {
            layer: dialog.layer.value,
            front: dialog.front.value,
            back: dialog.back.value,
            name: name
        };

        moveGuides(destination);
        dialog.close();
    }
    dialog.show();
}


function moveGuides(dest) {
    var shapes = app.activeDocument.pathItems;
    var count = {
        before: shapes.length,
        after: 0
    };

    app.executeMenuCommand('deselectall');
    app.executeMenuCommand('clearguide');

    count.after = shapes.length;
    if (count.before == count.after) return;

    app.executeMenuCommand('undo');

    if (dest.layer) moveToLayer(dest.name);
    if (dest.front) app.executeMenuCommand('sendToFront');
    if (dest.back) app.executeMenuCommand('sendToBack');

    app.executeMenuCommand('deselectall');
}


function moveToLayer(name) {
    var layer = getLayer(name);
    var guides = app.activeDocument.selection;
    for (var i = guides.length - 1; i >= 0; i--) {
        var guide = guides[i];
        guide.move(layer, ElementPlacement.INSIDE);
    }
}


function getLayer(name) {
    if (!layerExists(name)) return createLayer(name);
    var layer = app.activeDocument.layers[name];
    layer.locked = false;
    layer.visible = true;
    return layer;
}


function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


function layerExists(name) {
    try {
        app.activeDocument.layers[name];
        return true;
    }
    catch (err) {
        return false;
    }
}


function isValidVersion() {
    var cs6 = 16;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs6) return false;
    return true;
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = ui.destination;
    panel1.orientation = 'column';
    panel1.alignChildren = ['left', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 8, 0, 0];

    var radiobutton1 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.layer;
    radiobutton1.value = true;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [18, 0, 0, 6];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.name;

    var edittext1 = group2.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = 'Guides';
    edittext1.preferredSize.width = 100;
    edittext1.active = true;

    var radiobutton2 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.front;

    var radiobutton3 = group1.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.back;

    var group3 = dialog.add('group', undefined, { name: 'group3' });
    group3.orientation = 'row';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 10;
    group3.margins = [0, 6, 0, 0];

    var button1 = group3.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group3.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    statictext1.addEventListener('click', function() {
        edittext1.active = false;
        edittext1.active = true;
    });

    radiobutton1.onClick = function() {
        radiobutton2.value = false;
        radiobutton3.value = false;
        group2.enabled = true;
        edittext1.active = false;
        edittext1.active = true;
    }

    radiobutton2.onClick = function() {
        radiobutton1.value = false;
        group2.enabled = false;
    }

    radiobutton3.onClick = function() {
        radiobutton1.value = false;
        group2.enabled = false;
    }

    button1.onClick = function() {
        dialog.close();
    }

    dialog.layer = radiobutton1;
    dialog.name = edittext1;
    dialog.front = radiobutton2;
    dialog.back = radiobutton3;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Move Guides',
            ja: 'ガイドを移動'
        },
        destination: {
            en: 'Destination',
            ja: '移動先'
        },
        layer: {
            en: 'Layer',
            ja: 'レイヤー'
        },
        name: {
            en: 'Name:',
            ja: '名前:'
        },
        front: {
            en: 'Bring to Front',
            ja: '最前面へ'
        },
        back: {
            en: 'Send to Back',
            ja: '最背面へ'
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
