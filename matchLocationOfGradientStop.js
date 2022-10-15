/* ===============================================================================================================================================
   matchLocationOfGradientStop

   Description
   This script matches the location of the gradient stops and midpoints.

   Usage
   1. Select two or more gradients in the Swatches panel, run this script from File > Scripts > Other Script...
   2. Select a source gradient.

   Notes
   Only gradients in the Swatches panel are supported.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    if (app.documents.length > 0) main();
})();


function main() {
    var swatches = getSwatches();
    if (swatches.length < 2) return;

    var names = getSwatchNames(swatches);
    var dialog = showDialog(names);

    dialog.ok.onClick = function() {
        var source = getSource(swatches, dialog.list);
        if (source) {
            var location = getGradientStops(source.color);
            for (var i = 0; i < swatches.length; i++) {
                if (swatches[i].name == source.name) continue;
                setGradientStops(swatches[i].color, location);
            }
            dialog.close();
        }
        else {
            showMessage();
        }
    }

    dialog.center();
    dialog.show();
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
    var index = list.selection.index;
    try {
        return swatches[index];
    }
    catch (err) {
        return undefined;
    }
}


function showMessage() {
    var error = {
        en_US: {
            message: 'Select a source gradient.'
        },
        ja_JP: {
            message: '元となるグラデーションを選択してください。'
        }
    };
    var message = error[app.locale].message || error.en_US.message;
    alert(message);
}


function showDialog(swatches) {
    var local = localize();

    var dialog = new Window('dialog');
    dialog.text = local.title;
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
    statictext1.text = local.source;

    var listbox1 = group1.add('listbox', undefined, undefined, { name: 'listbox1', items: swatches });
    listbox1.preferredSize.width = 380;
    listbox1.preferredSize.height = 200;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = local.cancel;
    button1.preferredSize.width = 90;
    button1.preferredSize.height = 30;

    var button2 = group2.add('button', undefined, undefined, { name: 'button2' });
    button2.text = local.ok;
    button2.preferredSize.width = 90;
    button2.preferredSize.height = 30;

    button1.onClick = function() {
        dialog.close();
    }

    dialog.list = listbox1;
    dialog.ok = button2;

    return dialog;
}


function localize() {
    var language = {
        en_US: {
            title: 'matchLocationOfGradientStop',
            source: 'Select a source gradient.',
            cancel: 'Cancel',
            ok: 'OK'
        },
        ja_JP: {
            title: 'matchLocationOfGradientStop',
            source: '元となるグラデーションを選択してください。',
            cancel: 'キャンセル',
            ok: 'OK'
        }
    };
    return language[app.locale] || language.en_US;
}
