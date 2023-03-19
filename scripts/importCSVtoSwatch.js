/* ===============================================================================================================================================
   importCSVtoSwatch

   Description
   This script imports a CSV file to the Swatches panel.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select a CSV file.

   Format
   CSV files are available in the following two formats.
   For CMYK:
   | Cyan | Magenta | Yellow | Black | Swatch name |
   | 100  | 0       | 0      | 0     | Cyan        |

   For RGB:
   | Red | Green | Blue | Swatch name |
   | 255 | 0     | 0    | Red         |

   Notes
   Make sure the document color mode and CSV file format are the same.
   Commas or tabs separate columns.
   Line 1 is used as the title.
   The Swatch name is not required.
   In rare cases, if you continue to use the script, it may not work.
   In that case, restart Illustrator and try again.

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
    $.localize = true;
    var message = getMessage();
    var colors = [];

    var file = File.openDialog(message.title);
    if (!file.exists) return;
    if (file.open('r')) {
        colors = getColorsFromCSV(file);
        file.close();
    }

    for (var i = 0; i < colors.length; i++) {
        addSwatch(colors[i]);
    }

    alert(message.complete);
}


function addSwatch(color) {
    var swatch = app.activeDocument.swatches.add();
    try {
        swatch.color = setColor(color);
        swatch.name = setName(color);
    }
    catch (err) {
        swatch.remove();
    }
}


function getColorsFromCSV(file) {
    var colors = [];

    // Skip line 1
    file.readln();

    while (!file.eof) {
        var values = [];
        var row = file.readln();
        var columns = row.split(/,|\t/);

        for (var i = 0; i < columns.length; i++) {
            var value = (columns[i]) ? columns[i].replace(/"|'/g, '') : 0;
            values.push(value);
        }
        colors.push(format(values));
    }

    return colors;
}


function format(color) {
    var item = {
        mode: app.activeDocument.documentColorSpace,
        name: ''
    };

    if (item.mode == DocumentColorSpace.CMYK) {
        item.cyan = color[0];
        item.magenta = color[1];
        item.yellow = color[2];
        item.black = color[3];
        if (color[4]) item.name = color[4];
    }
    if (item.mode == DocumentColorSpace.RGB) {
        item.red = color[0];
        item.green = color[1];
        item.blue = color[2];
        if (color[3]) item.name = color[3];
    }

    return item;
}


function setName(color) {
    if (color.name) return color.name;
    if (color.mode == DocumentColorSpace.CMYK) {
        return 'C=' + color.cyan + ' M=' + color.magenta + ' Y=' + color.yellow + ' K=' + color.black;
    }
    if (color.mode == DocumentColorSpace.RGB) {
        return 'R=' + color.red + ' G=' + color.green + ' B=' + color.blue;
    }
}


function setColor(color) {
    if (color.mode == DocumentColorSpace.CMYK) {
        return setCMYKColor(color.cyan, color.magenta, color.yellow, color.black);
    }
    if (color.mode == DocumentColorSpace.RGB) {
        return setRGBColor(color.red, color.green, color.blue);
    }
}


function setCMYKColor(c, m, y, k) {
    var color = new CMYKColor();
    color.cyan = c;
    color.magenta = m;
    color.yellow = y;
    color.black = k;
    return color;
}


function setRGBColor(r, g, b) {
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


function getMessage() {
    return {
        title: {
            en: 'Select a CSV file.',
            ja: 'CSVファイルを選択してください。'
        },
        complete: {
            en: 'Import completed.',
            ja: 'インポートが完了しました。'
        }
    };
}
