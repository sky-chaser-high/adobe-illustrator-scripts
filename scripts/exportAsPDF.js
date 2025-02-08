/* ===============================================================================================================================================
   exportAsPDF

   Description
   This script exports multiple PDFs simultaneously from a single Adobe Illustrator document. Up to 5 presets can be selected.
   You can also export open documents or all documents in a folder together.

   Usage
   1. Open some documents to be exported to PDF, run this script from File > Scripts > Other Script...
   2. Select some PDF presets.
   3. Enter the string to be added to the end of the file name. The default value is a serial number.
   4. If the document has multiple artboards, select whether the exported PDF should be a single or multiple file.
   5. Select the range of the artboards to export.
      All: All artboards to export.
      Ranges: Specifies the range of the artboards to export.
   6. You can specify the document to export to PDF with the following options.
      Active Document: Export only the currently displayed document to PDF.
      All Open Documents: Export all open documents to PDF.
      All Documents in the Same Folder: Checking the checkbox will export all documents in the same folder as the active or open all documents.
                                        No need to open all documents.
   7. To create an outline, check the Create Outline checkbox.

   Notes
   The PDF files export in the same folder as the Illustrator documents.
   If the PDF file with the same name exists, it overwrites.
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
        var config = getConfiguration(dialog);
        var isValid = checkInputValues(config);
        if (!isValid) return;

        exportAllDocumentsAsPDFs(config);
        dialog.close();
    }

    dialog.show();
}


function exportAllDocumentsAsPDFs(config) {
    var docs = 1;
    if (config.isAllOpenDocuments) docs = app.documents.length;

    if (config.isAllDocumentsInFolder) {
        var files = getAllDocuments(config.isAllOpenDocuments);
        exportAllDocumentsInFolder(files, config);
    }

    for (var i = 0; i < docs; i++) {
        var isFileSave = saveAiDocument();
        if (!isFileSave) return;
        exportAsPDFs(config);
    }
}


function exportAllDocumentsInFolder(files, config) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        app.open(file);
        exportAsPDFs(config);
    }
}


function exportAsPDFs(config) {
    if (config.outline) createOutline();

    var doc = app.activeDocument;
    var src = doc.fullName.fsName;
    var ranges = getArtboardRanges(config.ranges);

    for (var i = 0; i < config.presets.length; i++) {
        var suffix = config.names[i];
        var preset = config.presets[i];
        if (preset.index < 2) continue;

        if (config.isSingleFile) {
            exportAsSinglePDF(src, preset.text, ranges.join(), suffix, config.view);
        }
        else {
            exportAsMultiplePDFs(src, preset.text, ranges, suffix, config.view);
        }
    }

    doc.close(SaveOptions.DONOTSAVECHANGES);
}


function exportAsSinglePDF(src, preset, ranges, suffix, view) {
    var filename = getFilename(src, suffix);
    var file = new File(filename);

    var options = new PDFSaveOptions();
    options.pDFPreset = preset;
    options.artboardRange = ranges;
    options.viewAfterSaving = view;

    app.activeDocument.saveAs(file, options);
}


function exportAsMultiplePDFs(src, preset, ranges, suffix, view) {
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];

        var filename = getFilename(src, suffix + '_' + range);
        var file = new File(filename);

        var options = new PDFSaveOptions();
        options.pDFPreset = preset;
        options.artboardRange = range;
        options.viewAfterSaving = view;

        app.activeDocument.saveAs(file, options);
    }
}


function getFilename(src, suffix) {
    var extension = '.pdf';
    var str = '_' + suffix + extension;
    var filename = src.replace(/\.ai$/, str);
    return filename;
}


function getArtboardRanges(range) {
    var artboard = {
        min: 1,
        max: app.activeDocument.artboards.length
    };
    var ranges = [];

    var nums = range.split(/,/g);

    for (var i = 0; i < nums.length; i++) {
        var num = nums[i];
        var value = parseInt(num);
        if (/-/.test(num)) {
            ranges = ranges.concat(getSpecifiedRange(num, ranges));
        }
        else if (artboard.max < value) {
            if (dupeRangeExists(ranges, artboard.max)) continue;
            ranges.push(artboard.max);
        }
        else if (value < artboard.min) {
            if (dupeRangeExists(ranges, artboard.min)) continue;
            ranges.push(artboard.min);
        }
        else if (value) {
            if (dupeRangeExists(ranges, value)) continue;
            ranges.push(value);
        }
    }
    return ranges.sort(function(a, b) {
        return a - b;
    });
}


function getSpecifiedRange(text, totalRanges) {
    var artboard = {
        min: 1,
        max: app.activeDocument.artboards.length
    };
    var ranges = [];

    if (/^-/.test(text)) text = artboard.min + text;
    if (/-$/.test(text)) text = text + artboard.max;

    var str = text.split(/-+/);

    var start = parseInt(str[0]);
    var end = parseInt(str[1]);
    if (end < start) {
        start = parseInt(str[1]);
        end = parseInt(str[0]);
    }
    if (artboard.max < end) end = artboard.max;

    for (var i = start; i <= end; i++) {
        if (dupeRangeExists(totalRanges, i)) continue;
        ranges.push(i);
    }
    return ranges;
}


function dupeRangeExists(ranges, value) {
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (range == value) return true;
    }
    return false;
}


function getAllDocuments(isAllOpenDocuments) {
    var files = [];
    var dirs = [];

    var docs = [app.activeDocument];
    if (isAllOpenDocuments) docs = app.documents;

    for (var i = 0; i < docs.length; i++) {
        var dir = docs[i].path;
        if (dupeFileExists(dirs, dir)) continue;
        dirs.push(dir);
    }

    for (var i = 0; i < dirs.length; i++) {
        var items = dirs[i].getFiles('*.ai');

        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            if (dupeFileExists(docs, item)) continue;
            files.push(item);
        }
    }

    return files;
}


function dupeFileExists(files, value) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.fsName == value.fsName) return true;
        if (file.fullName.fsName == value.fsName) return true;
    }
    return false;
}


function createOutline() {
    var layers = app.activeDocument.layers;
    unlockAllLayers(layers);
    app.executeMenuCommand('unlockAll');
    app.executeMenuCommand('selectall');
    app.executeMenuCommand('outline');
}


function unlockAllLayers(layers) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.locked = false;
        var children = layer.layers;
        unlockAllLayers(children);
    }
}


function saveAiDocument() {
    var isFileSave = true;

    var doc = app.activeDocument;
    if (doc.saved) return isFileSave;

    var dialog = showSaveDialog();

    dialog.doNotSave.onClick = function() {
        dialog.close();
    }

    dialog.cancel.onClick = function() {
        isFileSave = false;
        dialog.close();
    }

    dialog.save.onClick = function() {
        if (doc.fullName.exists) doc.save();
        else app.executeMenuCommand('save');
        dialog.close();
    }

    dialog.show();
    return isFileSave;
}


function getPDFPresets() {
    var ui = localizeUI();
    try {
        var presets = app.PDFPresetsList;
        return [ui.select, '-'].concat(presets.sort());
    }
    catch (err) {
        alert(ui.error);
        return [];
    }
}


function isValidVersion() {
    var cs6 = 16;
    var current = parseInt(app.version);
    if (current < cs6) return false;
    return true;
}


function checkInputValues(config) {
    $.localize = true;
    var ui = localizeUI();
    var isValid = false;
    var message = ui.invalidPreset;

    var index = 2;
    for (var i = 0; i < config.presets.length; i++) {
        var preset = config.presets[i];
        if (preset.index < index) continue;
        isValid = true;
    }

    if (isValid) {
        isValid = /^[0-9,-]*$/ig.test(config.ranges);
        if (!isValid) message = ui.invalidRange;
    }

    if (!isValid) showWarning(message);
    return isValid;
}


function getConfiguration(dialog) {
    var name1 = dialog.name1.text;
    if (!name1) name1 = '1';
    var name2 = dialog.name2.text;
    if (!name2) name1 = '2';
    var name3 = dialog.name3.text;
    if (!name3) name1 = '3';
    var name4 = dialog.name4.text;
    if (!name4) name1 = '4';
    var name5 = dialog.name5.text;
    if (!name5) name1 = '5';

    var isAllArtboareds = dialog.artboard.all.value;
    var ranges = dialog.ranges.text;
    ranges = ranges.replace(/\s/g, '');
    if (!ranges || isAllArtboareds) ranges = '1-' + app.activeDocument.artboards.length;

    return {
        presets: [
            dialog.preset1.selection,
            dialog.preset2.selection,
            dialog.preset3.selection,
            dialog.preset4.selection,
            dialog.preset5.selection
        ],
        names: [
            name1,
            name2,
            name3,
            name4,
            name5
        ],
        isSingleFile: dialog.file.single.value,
        isMultipleFiles: dialog.file.multiple.value,
        isAllArtboareds: isAllArtboareds,
        isRangeArtboards: dialog.artboard.range.value,
        ranges: ranges,
        isActiveDocument: dialog.activeDocument.value,
        isAllOpenDocuments: dialog.openDocuments.value,
        isAllDocumentsInFolder: dialog.allDocuments.value,
        outline: dialog.outline.value,
        view: dialog.view.value
    };
}


function showDialog() {
    $.localize = true;
    var ui = localizeUI();
    var presets = getPDFPresets();

    var hasMultiArtboards = (app.activeDocument.artboards.length > 1) ? true : false;
    var hasMultiOpenFiles = (app.documents.length > 1) ? true : false;

    var range = '1';
    if (hasMultiArtboards) {
        range = '1-' + app.activeDocument.artboards.length;
    }

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var panel1 = dialog.add('panel', undefined, undefined, { name: 'panel1' });
    panel1.text = 'PDF';
    panel1.orientation = 'column';
    panel1.alignChildren = ['fill', 'top'];
    panel1.spacing = 10;
    panel1.margins = 10;

    var group1 = panel1.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'bottom'];
    group1.spacing = 10;
    group1.margins = [0, 4, 0, 0];

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['center', 'center'];
    group2.spacing = (/ja/.test($.locale)) ? 19 : 18;
    group2.margins = [0, 0, 0, 4];

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = '1';

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = '2';

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = '3';

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = '4';

    var statictext5 = group2.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = '5';

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext6 = group3.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = ui.preset;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.preferredSize.width = 300;
    group4.orientation = 'column';
    group4.alignChildren = ['fill', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var dropdown1 = group4.add('dropdownlist', undefined, presets, { name: 'dropdown1' });
    dropdown1.selection = 0;
    dropdown1.active = true;

    var dropdown2 = group4.add('dropdownlist', undefined, presets, { name: 'dropdown2' });
    dropdown2.selection = 0;

    var dropdown3 = group4.add('dropdownlist', undefined, presets, { name: 'dropdown3' });
    dropdown3.selection = 0;

    var dropdown4 = group4.add('dropdownlist', undefined, presets, { name: 'dropdown4' });
    dropdown4.selection = 0;

    var dropdown5 = group4.add('dropdownlist', undefined, presets, { name: 'dropdown5' });
    dropdown5.selection = 0;

    var group5 = group1.add('group', undefined, { name: 'group5' });
    group5.orientation = 'column';
    group5.alignChildren = ['fill', 'center'];
    group5.spacing = 10;
    group5.margins = 0;

    var statictext7 = group5.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = ui.suffix;

    var group6 = group5.add('group', undefined, { name: 'group6' });
    group6.orientation = 'column';
    group6.alignChildren = ['fill', 'center'];
    group6.spacing = (/ja/.test($.locale)) ? 11 : 10;
    group6.margins = 0;

    var edittext1 = group6.add('edittext', undefined, undefined, { name: 'edittext1' });
    edittext1.text = '1';

    var edittext2 = group6.add('edittext', undefined, undefined, { name: 'edittext2' });
    edittext2.text = '2';

    var edittext3 = group6.add('edittext', undefined, undefined, { name: 'edittext3' });
    edittext3.text = '3';

    var edittext4 = group6.add('edittext', undefined, undefined, { name: 'edittext4' });
    edittext4.text = '4';

    var edittext5 = group6.add('edittext', undefined, undefined, { name: 'edittext5' });
    edittext5.text = '5';

    var divider1 = panel1.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group7 = panel1.add('group', undefined, { name: 'group7' });
    group7.orientation = 'row';
    group7.alignChildren = ['left', 'center'];
    group7.spacing = 10;
    group7.margins = 0;

    var statictext8 = group7.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = ui.exportAs;

    var group8 = group7.add('group', undefined, { name: 'group8' });
    group8.orientation = 'row';
    group8.alignChildren = ['left', 'center'];
    group8.spacing = 10;
    group8.margins = [0, 3, 0, 0];

    var radiobutton1 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton1' });
    radiobutton1.text = ui.single;
    radiobutton1.value = true;

    var radiobutton2 = group8.add('radiobutton', undefined, undefined, { name: 'radiobutton2' });
    radiobutton2.text = ui.multiple;
    radiobutton2.enabled = hasMultiArtboards ? true : false;

    var panel2 = dialog.add('panel', undefined, undefined, { name: 'panel2' });
    panel2.text = ui.artboards;
    panel2.orientation = 'column';
    panel2.alignChildren = ['left', 'top'];
    panel2.spacing = 10;
    panel2.margins = 10;

    var group9 = panel2.add('group', undefined, { name: 'group9' });
    group9.orientation = 'row';
    group9.alignChildren = ['left', 'center'];
    group9.spacing = 10;
    group9.margins = [0, 4, 0, 0];

    var group10 = group9.add('group', undefined, { name: 'group10' });
    group10.orientation = 'row';
    group10.alignChildren = ['left', 'center'];
    group10.spacing = 10;
    group10.margins = [0, 2, 0, 0];

    var radiobutton3 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton3' });
    radiobutton3.text = ui.all;
    radiobutton3.value = true;

    var radiobutton4 = group10.add('radiobutton', undefined, undefined, { name: 'radiobutton4' });
    radiobutton4.text = ui.ranges;
    radiobutton4.enabled = hasMultiArtboards ? true : false;

    var edittext6 = group9.add('edittext', undefined, undefined, { name: 'edittext6' });
    edittext6.text = range;
    edittext6.preferredSize.width = 100;
    edittext6.enabled = false;

    var panel3 = dialog.add('panel', undefined, undefined, { name: 'panel3' });
    panel3.text = ui.documents;
    panel3.orientation = 'column';
    panel3.alignChildren = ['left', 'top'];
    panel3.spacing = 10;
    panel3.margins = 10;

    var group11 = panel3.add('group', undefined, { name: 'group11' });
    group11.orientation = 'column';
    group11.alignChildren = ['left', 'center'];
    group11.spacing = 10;
    group11.margins = [0, 8, 0, 0];

    var radiobutton5 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton5' });
    radiobutton5.text = ui.activeDocument;
    radiobutton5.value = true;

    var radiobutton6 = group11.add('radiobutton', undefined, undefined, { name: 'radiobutton6' });
    radiobutton6.text = ui.openDocuments;
    radiobutton6.enabled = hasMultiOpenFiles ? true : false;

    var checkbox1 = group11.add('checkbox', undefined, undefined, { name: 'checkbox1' });
    checkbox1.text = ui.allDocuments;

    var panel4 = dialog.add('panel', undefined, undefined, { name: 'panel4' });
    panel4.text = ui.options;
    panel4.orientation = 'column';
    panel4.alignChildren = ['left', 'top'];
    panel4.spacing = 10;
    panel4.margins = 10;

    var group12 = panel4.add('group', undefined, { name: 'group12' });
    group12.orientation = 'column';
    group12.alignChildren = ['left', 'center'];
    group12.spacing = 10;
    group12.margins = [0, 8, 0, 0];

    var checkbox2 = group12.add('checkbox', undefined, undefined, { name: 'checkbox2' });
    checkbox2.text = ui.outline;

    var checkbox3 = group12.add('checkbox', undefined, undefined, { name: 'checkbox3' });
    checkbox3.text = ui.view;

    var group13 = dialog.add('group', undefined, { name: 'group13' });
    group13.orientation = 'row';
    group13.alignChildren = ['right', 'center'];
    group13.spacing = 10;
    group13.margins = 0;

    var button1 = group13.add('button', undefined, undefined, { name: 'Cancel' });
    button1.text = ui.cancel;
    button1.preferredSize.width = 90;

    var button2 = group13.add('button', undefined, undefined, { name: 'OK' });
    button2.text = ui.ok;
    button2.preferredSize.width = 90;

    radiobutton3.onClick = function() {
        edittext6.enabled = false;
    }

    radiobutton4.onClick = function() {
        edittext6.enabled = true;
        edittext6.active = false;
        edittext6.active = true;
    }

    button1.onClick = function() {
        dialog.close();
    }

    dialog.preset1 = dropdown1;
    dialog.preset2 = dropdown2
    dialog.preset3 = dropdown3;
    dialog.preset4 = dropdown4;
    dialog.preset5 = dropdown5;
    dialog.name1 = edittext1;
    dialog.name2 = edittext2
    dialog.name3 = edittext3;
    dialog.name4 = edittext4;
    dialog.name5 = edittext5;
    dialog.file = {
        single: radiobutton1,
        multiple: radiobutton2
    };
    dialog.artboard = {
        all: radiobutton3,
        range: radiobutton4
    };
    dialog.ranges = edittext6;
    dialog.activeDocument = radiobutton5;
    dialog.openDocuments = radiobutton6;
    dialog.allDocuments = checkbox1;
    dialog.outline = checkbox2;
    dialog.view = checkbox3;
    dialog.ok = button2;
    return dialog;
}


function showSaveDialog() {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = 'Adobe Illustrator';
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 0, 10, 0];

    var image1_src = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00!%00%00%00!%08%06%00%00%00W%C3%A4%C3%82o%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%C2%B9IDATX%C2%85%C3%8D%C2%98%3FR%021%14%C3%86%3F%18%2B%C2%B33%C3%8B%0D%C3%80%1BXo%C2%B3x%02%C2%B9%01ZYX%C2%B0G%C3%A0%084%16Vz%04%3D%C2%816%C2%A6%C3%B6%06%C3%A2%0Dd%C3%8C%C3%96%C3%AB%04%1F%2B%C3%B2v%C3%B3o%23%C3%B8k%60%C3%B2%C3%B2%C3%A7%C2%9B%C2%97%7C%2F%C2%81%5EUU84G%5D%04()%06%00N%01%C2%BC%26Y%C3%B9%C3%81%3A8%12%C2%9C%09%25%C3%85H%2F%0E%20%05%C2%B0%C3%92b%C2%92%C2%AC%5C%C2%B2%C2%8E%0E%C3%B4C%C3%95%03X%C2%90%00%C3%90%C3%A7%C2%82%C3%B5p%24(%13J%C2%8A1%C2%80\'%16%00%C3%8E%C2%92%C2%AC%7Cf%C2%AD%16B31g-%C3%A6v%23%C3%9E%22%C2%94%14%17%00r%16%C3%B8%26%C2%A7%C2%B8%17%5E%C3%9BAn%C3%90%C2%87q%C3%88%C2%82%3F%C2%BC%C3%93!uv%C2%8Bo%26%0A%C2%8B%00P%C2%BC%60%C2%AD%06%C2%9C3%C2%B1cI%1B%5E%C2%96%C3%B5)V%C3%B3%5D%01W7%C2%93%C3%BA%C3%BB%C3%AD%C3%B5%C3%83v(%C2%A5%C3%BEN%C3%A7%C3%83i%3B%C2%94%14%C2%BA*NY%C3%80%C3%8C%C2%94%C3%86%C3%85%11%C3%91%C2%A1%109%C2%8D%C2%B3%C2%8APRL%0C%C2%96%C2%B4%C2%91%C3%93x%23.%C2%99%08.%C3%87%C2%AE%C3%A3%C2%8D%22%C2%94%14s%07K%C3%9A%18%C3%92%3C%C2%AD%C2%B4%C2%8A%C2%A0%C3%82%C3%A4%C3%A5w%03%05%C3%8D%C3%97H%C2%AB%C2%88%26Kv%205%C3%9C7%C3%8D%22%C2%A80%C3%8DX%C2%A0%1B3%C2%9A%C2%97%C3%91(%02%C3%80%3Dk%C2%89C%C3%A3%C2%BCL%04%C2%BD%15B-i%23%C2%A7%C3%B9%C3%8D%22%22X%C3%92%06%C2%9B%C3%BF%C3%97%05Fo%C2%81%3B%C3%8B%241%C2%B8L%C2%B2%C2%B2%C3%9E%C2%9AZ%04Yh%19%C3%91%11%26%C3%B4-%3B%C3%9A%C2%BC9%C2%B6%C2%B7%C2%A3%C3%98%C2%93%00%C3%90%3Au%0DZg%C2%82%C2%AC%C3%B3%C3%86%C2%BAZ0%5C%C3%A5%C2%AE%C2%9C%C3%A87%C3%87%26%13%C2%AD%C2%85%C3%A4%C2%8FY%C2%AF%C3%9B\'%C3%8B%C3%B8%C2%BE%15b%C2%A1%C3%9F%1C%C3%A3%C3%9E%C3%A7%C3%8B%C2%B1%C3%8E%C3%A3%C3%B9%C2%81Dh%1E%C3%B5v%C2%B4%5E%2C%7Bb%C3%90%C2%A7%C3%A2%C2%B1%3A%C2%90%00%C2%BD%C3%AE%C3%A2_%C3%BC5%C3%90%C3%A5%07q%1C%00%7C%01%0A%C3%AA%C2%85%C2%AE%C3%8A%C2%B7n%C2%B9%00%00%00%00IEND%C2%AEB%60%C2%82';
    var image1 = group2.add('image', undefined, File.decode(image1_src), { name: 'image1' });

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 2;
    group4.margins = 0;

    var statictext1 = group4.add('statictext', undefined, undefined, { name: 'statictext1', multiline: true });
    statictext1.text = ui.message1;
    statictext1.preferredSize.width = 415;

    var statictext2 = group4.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.message2;

    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['right', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 6, 0, 0];

    var button1 = group5.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.doNotSave;
    button1.preferredSize.width = 90;

    var button2 = group5.add('button', undefined, undefined, { name: 'Cancel' });
    button2.text = ui.cancel;
    button2.preferredSize.width = 90;

    var button3 = group5.add('button', undefined, undefined, { name: 'OK' });
    button3.text = ui.save;
    button3.preferredSize.width = 90;
    button3.active = true;

    dialog.doNotSave = button1;
    dialog.cancel = button2;
    dialog.save = button3;
    return dialog;
}


function showWarning(message) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = 'Adobe Illustrator';
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'top'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 0, 10, 0];

    var image1_src = '%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00!%00%00%00!%08%06%00%00%00W%C3%A4%C3%82o%00%00%00%09pHYs%00%00%0B%12%00%00%0B%12%01%C3%92%C3%9D~%C3%BC%00%00%01%C2%B9IDATX%C2%85%C3%8D%C2%98%3FR%021%14%C3%86%3F%18%2B%C2%B33%C3%8B%0D%C3%80%1BXo%C2%B3x%02%C2%B9%01ZYX%C2%B0G%C3%A0%084%16Vz%04%3D%C2%816%C2%A6%C3%B6%06%C3%A2%0Dd%C3%8C%C3%96%C3%AB%04%1F%2B%C3%B2v%C3%B3o%23%C3%B8k%60%C3%B2%C3%B2%C3%A7%C2%9B%C2%97%7C%2F%C2%81%5EUU84G%5D%04()%06%00N%01%C2%BC%26Y%C3%B9%C3%81%3A8%12%C2%9C%09%25%C3%85H%2F%0E%20%05%C2%B0%C3%92b%C2%92%C2%AC%5C%C2%B2%C2%8E%0E%C3%B4C%C3%95%03X%C2%90%00%C3%90%C3%A7%C2%82%C3%B5p%24(%13J%C2%8A1%C2%80\'%16%00%C3%8E%C2%92%C2%AC%7Cf%C2%AD%16B31g-%C3%A6v%23%C3%9E%22%C2%94%14%17%00r%16%C3%B8%26%C2%A7%C2%B8%17%5E%C3%9BAn%C3%90%C2%87q%C3%88%C2%82%3F%C2%BC%C3%93!uv%C2%8Bo%26%0A%C2%8B%00P%C2%BC%60%C2%AD%06%C2%9C3%C2%B1cI%1B%5E%C2%96%C3%B5)V%C3%B3%5D%01W7%C2%93%C3%BA%C3%BB%C3%AD%C3%B5%C3%83v(%C2%A5%C3%BEN%C3%A7%C3%83i%3B%C2%94%14%C2%BA*NY%C3%80%C3%8C%C2%94%C3%86%C3%85%11%C3%91%C2%A1%109%C2%8D%C2%B3%C2%8APRL%0C%C2%96%C2%B4%C2%91%C3%93x%23.%C2%99%08.%C3%87%C2%AE%C3%A3%C2%8D%22%C2%94%14s%07K%C3%9A%18%C3%92%3C%C2%AD%C2%B4%C2%8A%C2%A0%C3%82%C3%A4%C3%A5w%03%05%C3%8D%C3%97H%C2%AB%C2%88%26Kv%205%C3%9C7%C3%8D%22%C2%A80%C3%8DX%C2%A0%1B3%C2%9A%C2%97%C3%91(%02%C3%80%3Dk%C2%89C%C3%A3%C2%BCL%04%C2%BD%15B-i%23%C2%A7%C3%B9%C3%8D%22%22X%C3%92%06%C2%9B%C3%BF%C3%97%05Fo%C2%81%3B%C3%8B%241%C2%B8L%C2%B2%C2%B2%C3%9E%C2%9AZ%04Yh%19%C3%91%11%26%C3%B4-%3B%C3%9A%C2%BC9%C2%B6%C2%B7%C2%A3%C3%98%C2%93%00%C3%90%3Au%0DZg%C2%82%C2%AC%C3%B3%C3%86%C2%BAZ0%5C%C3%A5%C2%AE%C2%9C%C3%A87%C3%87%26%13%C2%AD%C2%85%C3%A4%C2%8FY%C2%AF%C3%9B\'%C3%8B%C3%B8%C2%BE%15b%C2%A1%C3%9F%1C%C3%A3%C3%9E%C3%A7%C3%8B%C2%B1%C3%8E%C3%A3%C3%B9%C2%81Dh%1E%C3%B5v%C2%B4%5E%2C%7Bb%C3%90%C2%A7%C3%A2%C2%B1%3A%C2%90%00%C2%BD%C3%AE%C3%A2_%C3%BC5%C3%90%C3%A5%07q%1C%00%7C%01%0A%C3%AA%C2%85%C2%AE%C3%8A%C2%B7n%C2%B9%00%00%00%00IEND%C2%AEB%60%C2%82';
    var image1 = group2.add('image', undefined, File.decode(image1_src), { name: 'image1' });

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['fill', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var group4 = group3.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 10;
    group4.margins = 0;

    var statictext1 = group4.add('statictext', undefined, undefined, { name: 'statictext1', multiline: true });
    statictext1.text = message;
    // statictext1.text = 'Invalid artboard range.';

    var group5 = group3.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['right', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 20, 0, 0];

    var button1 = group5.add('button', undefined, undefined, { name: 'OK' });
    button1.text = 'OK';
    button1.preferredSize.width = 90;
    button1.active = true;

    dialog.show();
}


function localizeUI() {
    var filename = File.decode(app.activeDocument.name);
    return {
        title: {
            en: 'Export Adobe PDF',
            ja: 'Adobe PDF を書き出し'
        },
        preset: {
            en: 'Presets',
            ja: 'プリセット'
        },
        suffix: {
            en: 'Filename Suffix',
            ja: 'ファイル名 末尾'
        },
        exportAs: {
            en: 'Export PDFs as:',
            ja: 'PDFの書き出し形式:'
        },
        single: {
            en: 'Single File',
            ja: '単一ファイル'
        },
        multiple: {
            en: 'Multiple Files',
            ja: '複数ファイル'
        },
        artboards: {
            en: 'Artboards',
            ja: 'アートボード'
        },
        all: {
            en: 'All',
            ja: 'すべて'
        },
        ranges: {
            en: 'Range:',
            ja: '範囲:'
        },
        documents: {
            en: 'Documents',
            ja: 'ドキュメント'
        },
        activeDocument: {
            en: 'Active Document',
            ja: 'アクティブなドキュメントのみ'
        },
        openDocuments: {
            en: 'All Open Documents',
            ja: '開いているすべてのドキュメント'
        },
        allDocuments: {
            en: 'All Documents in the Same Folder',
            ja: '同じフォルダ内のすべてのドキュメント'
        },
        options: {
            en: 'Options',
            ja: 'オプション'
        },
        outline: {
            en: 'Create Outlines',
            ja: 'アウトラインを作成'
        },
        view: {
            en: 'View PDF after Saving',
            ja: '保存後 PDF ファイルを表示'
        },
        select: {
            en: 'Select a Preset',
            ja: 'プリセットを選択してください'
        },
        error: {
            en: 'Failed to load PDF presets.',
            ja: 'PDFプリセットの読み込みに失敗しました。'
        },
        invalidPreset: {
            en: 'Select at least one preset.',
            ja: 'プリセットを選択してください。'
        },
        invalidRange: {
            en: 'Invalid Artboard Range',
            ja: '無効なアートボード範囲'
        },
        message1: {
            en: 'Save changes to the Adobe Illustrator document "' + filename + '" before exporting?',
            ja: '書き出す前に、Adobe Illustrator ドキュメント「' + filename + '」を保存しますか？'
        },
        message2: {
            en: 'If you don\'t save, your changes will be lost.',
            ja: '保存しない場合、変更が失われます。'
        },
        doNotSave: {
            en: 'Don\'t Save',
            ja: '保存しない'
        },
        save: {
            en: 'Save',
            ja: '保存'
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
