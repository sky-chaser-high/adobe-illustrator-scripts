/* ===============================================================================================================================================
   matchLocationOfGradientStop

   Description
   This script matches the location of the gradient stops and midpoints.

   Usage
   1. Select two or more gradients in the Swatches panel, run this script from File > Scripts > Other Script...
   2. Select a source gradient.

   Notes
   Only gradients in the Swatches panel are supported.
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS4 or higher

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
    var swatches = getSwatches();
    if (swatches.length < 2) return;

    var names = getSwatchNames(swatches);
    var dialog = showDialog(names);

    dialog.ok.onClick = function() {
        var source = getSource(swatches, dialog.list);
        if (!source) return showMessage();

        matchLocation(source, swatches);
        dialog.close();
    }

    dialog.show();
}


function matchLocation(src, swatches) {
    var location = getGradientStops(src.color);
    for (var i = 0; i < swatches.length; i++) {
        var swatch = swatches[i];
        if (swatch.name == src.name) continue;
        setGradientStops(swatch.color, location);
    }
}


function setGradientStops(color, location) {
    var gradients = color.gradient.gradientStops;
    for (var i = 0; i < gradients.length; i++) {
        var gradient = gradients[i];
        gradient.midPoint = location.midPoints[i];
        gradient.rampPoint = location.rampPoints[i];
    }
}


function getGradientStops(color) {
    var location = {
        midPoints: [],
        rampPoints: []
    };
    var gradients = color.gradient.gradientStops;
    for (var i = 0; i < gradients.length; i++) {
        var gradient = gradients[i];
        location.midPoints.push(gradient.midPoint);
        location.rampPoints.push(gradient.rampPoint);
    }
    return location;
}


function getSwatches() {
    var colors = [];
    var swatches = app.activeDocument.swatches.getSelected();
    for (var i = 0; i < swatches.length; i++) {
        var color = swatches[i].color;
        if (color.typename == 'GradientColor') {
            colors.push(swatches[i]);
        }
    }
    return colors;
}


function getSwatchNames(colors) {
    var names = [];
    for (var i = 0; i < colors.length; i++) {
        names.push(colors[i].name);
    }
    return names;
}


function getSource(swatches, list) {
    try {
        var index = list.selection.index;
        return swatches[index];
    }
    catch (err) {
        return undefined;
    }
}


function showMessage() {
    $.localize = true;
    var ui = localizeUI();
    alert(ui.message);
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showDialog(swatches) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['right', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'column';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = ui.message;

    var listbox1 = group1.add('listbox', undefined, undefined, { name: 'listbox1', items: swatches });
    listbox1.preferredSize.width = 380;
    listbox1.preferredSize.height = 200;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.list = listbox1;
    dialog.ok = button2;
    return dialog;
}


function localizeUI() {
    return {
        title: {
            en: 'Match Location of Gradient Stop',
            ja: 'Match Location of Gradient Stop'
        },
        message: {
            en: 'Select a source gradient.',
            ja: '元となるグラデーションを選択してください。'
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
