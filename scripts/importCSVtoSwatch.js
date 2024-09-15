/* ===============================================================================================================================================
   importCSVtoSwatch

   Description
   This script imports a CSV file to the Swatches panel.

   Usage
   1. Run this script from File > Scripts > Other Script...
   2. Select a CSV file.

   Format
   CSV files are available in the following 3 formats.
   For CMYK:
   | Cyan | Magenta | Yellow | Black | Swatch name |
   | 100  | 0       | 0      | 0     | Cyan        |

   For RGB:
   | Red | Green | Blue | Swatch name |
   | 255 | 0     | 0    | Red         |

   For HEX:
   | Hex    | Swatch name |
   | FF0000 | Red         |

   Notes
   Make sure the document color mode and CSV file format are the same.
   Commas or tabs separate columns.
   Line 1 is used as the title.
   The Swatch name is not required.
   The leading "#" may be omitted in the case of Hex color.
   If the Hex color is 3-digit, it behaves like CSS. (e.g. #F0F becomes #FF00FF.)
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   1.2.1

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
        var color = colors[i];
        addSwatch(color);
    }
    alert(message.complete);
}


function addSwatch(color) {
    var swatch = app.activeDocument.swatches.add();
    try {
        swatch.color = setColor(color);
        swatch.name = color.name;
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
        var row = file.readln();
        var values = row.replace(/"|'/g, '').split(/,|\t/);
        colors.push(format(values));
    }

    return colors;
}


function format(values) {
    var mode = app.activeDocument.documentColorSpace;
    if (mode == DocumentColorSpace.CMYK) {
        return getCMYKColor(values);
    }
    if (values.length <= 2) return getHexColor(values);
    if (values.length >= 3) return getRGBColor(values);
}


function setName(color) {
    var mode = app.activeDocument.documentColorSpace;
    if (color.name) return color.name;
    if (mode == DocumentColorSpace.CMYK) {
        return 'C=' + color.cyan + ' M=' + color.magenta + ' Y=' + color.yellow + ' K=' + color.black;
    }
    if (mode == DocumentColorSpace.RGB) {
        return 'R=' + color.red + ' G=' + color.green + ' B=' + color.blue;
    }
    return '';
}


function setColor(color) {
    var mode = app.activeDocument.documentColorSpace;
    if (mode == DocumentColorSpace.CMYK) {
        return setCMYKColor(color.cyan, color.magenta, color.yellow, color.black);
    }
    return setRGBColor(color.red, color.green, color.blue);
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


function getCMYKColor(values) {
    var min = 0;
    var max = 100;
    return {
        name: (values[4]) ? values[4] : '',
        cyan: getValidValue(values[0], min, max),
        magenta: getValidValue(values[1], min, max),
        yellow: getValidValue(values[2], min, max),
        black: getValidValue(values[3], min, max)
    };
}


function getRGBColor(values) {
    var min = 0;
    var max = 255;
    return {
        name: (values[3]) ? values[3] : '',
        red: getValidValue(values[0], min, max),
        green: getValidValue(values[1], min, max),
        blue: getValidValue(values[2], min, max)
    };
}


function getValidValue(value, min, max) {
    if (value > max) return max;
    if (isNaN(value) || value == '' || value < min) return min;
    return value;
}


function getHexColor(values) {
    var color = splitHexColorCode(values[0]);
    return {
        name: (values[1]) ? values[1] : values[0].toUpperCase(),
        red: parseInt(color.red, 16),
        green: parseInt(color.green, 16),
        blue: parseInt(color.blue, 16)
    };
}


function splitHexColorCode(value) {
    var hex = value.replace(/^#/, '').replace(/[^a-f0-9]/ig, '0');
    var colors = ('000000' + hex).slice(-6).match(/../g);
    if (hex.length == 3) {
        colors = hex.match(/./g);
        return {
            red: colors[0] + colors[0],
            green: colors[1] + colors[1],
            blue: colors[2] + colors[2]
        };
    }
    return {
        red: colors[0],
        green: colors[1],
        blue: colors[2]
    };
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


function isValidVersion() {
    var cs = 11;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs) return false;
    return true;
}
