/* ===============================================================================================================================================
   XMP

   Description
   These functions get the font, color, or history properties used in the document from XMP.
   See also: https://developer.adobe.com/xmp/docs/

   Usage
   You can include this script or copy the function to use it.

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CS or higher

   Version
   2.1.0

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */


/**
 * Get font properties used in the document from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {{composite: boolean, face: string, family: string, filename: string, name: string, type: string, version: string}[]} font properties
 */
function getFonts(src) {
    var fonts = [];

    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var prop = 'xmpTPg:Fonts';

    var count = xmp.countArrayItems(namespace, prop);

    for (var i = 1; i <= count; i++) {
        var structure = prop + '[' + i + ']/stFnt:';
        var font = {
            'composite': xmp.getProperty(namespace, structure + 'composite', XMPConst.BOOLEAN).value,
            'face': xmp.getProperty(namespace, structure + 'fontFace').value,
            'family': xmp.getProperty(namespace, structure + 'fontFamily').value,
            'filename': xmp.getProperty(namespace, structure + 'fontFileName').value,
            'name': xmp.getProperty(namespace, structure + 'fontName').value,
            'type': xmp.getProperty(namespace, structure + 'fontType').value,
            'version': xmp.getProperty(namespace, structure + 'versionString').value
        };
        fonts.push(font);
    }

    return fonts;
}


/**
 * Get history properties from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/xmpMM/
 *
 * @param {File} src File object
 * @returns {{action: string, parameter: string | undefined, software: string | undefined, when: Date | undefined}[]} history properties
 */
function getHistory(src) {
    var history = [];

    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/mm/';
    var prop = 'xmpMM:History';

    var count = xmp.countArrayItems(namespace, prop);

    for (var i = 1; i <= count; i++) {
        var structure = prop + '[' + i + ']/stEvt:';
        var param = {
            'action': xmp.getProperty(namespace, structure + 'action').value,
            'parameter': undefined,
            'software': undefined,
            'when': undefined
        };

        try {
            param.parameter = xmp.getProperty(namespace, structure + 'parameters').value;
        }
        catch (err) { }

        try {
            param.parameter = xmp.getProperty(namespace, structure + 'params').value;
        }
        catch (err) { }

        try {
            param.software = xmp.getProperty(namespace, structure + 'softwareAgent').value;
        }
        catch (err) { }

        try {
            // var when = xmp.getProperty(namespace, structure + 'when').value;
            // var xmpDateTime = new XMPDateTime(when);
            var xmpDateTime = xmp.getProperty(namespace, structure + 'when', XMPConst.XMPDATE).value;
            param.when = new Date(xmpDateTime.getDate());
        }
        catch (err) { }

        history.push(param);
    }

    return history;
}


/**
 * Get linked file properties used in the document from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/xmpMM/
 *
 * @param {File} src File object
 * @returns {{exists: boolean, filePath: string}[]} linked file properties
 */
function getLinkedFiles(src) {
    var files = [];

    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/mm/';
    var prop = 'xmpMM:Ingredients';

    var count = xmp.countArrayItems(namespace, prop);

    for (var i = 1; i <= count; i++) {
        var structure = prop + '[' + i + ']/stRef:';
        var file = {
            'exists': true,
            'filePath': xmp.getProperty(namespace, structure + 'filePath').value
        }

        if (!File(file.filePath).exists) {
            file.exists = false;
        }

        files.push(file);
    }

    return files;
}


/**
 * Get plate names used in the document from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {string[]} plate names
 */
function getPlateNames(src) {
    var plates = [];

    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var prop = 'xmpTPg:PlateNames';

    var count = xmp.countArrayItems(namespace, prop);

    for (var i = 1; i <= count; i++) {
        var plate = {
            'name': xmp.getProperty(namespace, prop + '[' + i + ']').value
        };
        plates.push(plate.name);
    }

    return plates;
}


/**
 * Get ruler units used in the document from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/XMPDataTypes/Dimensions/
 *
 * @param {File} src File object
 * @returns {string} ruler units
 */
function getRulerUnits(src) {
    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var prop = 'xmpTPg:MaxPageSize';
    var unit = prop + '/stDim:unit';

    var ruler = xmp.getProperty(namespace, unit).value;
    return ruler;
}


/**
 * Get swatch properties used in the document from XMP.
 * https://developer.adobe.com/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {{colorant:
 * {cyan: number, magenta: number, yellow: number, black: number, gray: number, l: number, a: number, b: number, red: number, green: number, blue: number},
 * mode: string, name: string, swatch: Swatch | undefined, tint: number | undefined, type: string}[]} swatch properties
 */
function getSwatches(src) {
    var colors = [];

    if (ExternalObject.AdobeXMPScript == undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
    }
    var xmpFile = new XMPFile(src.fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);
    var xmpPackets = xmpFile.getXMP();
    var xmp = new XMPMeta(xmpPackets.serialize());

    var namespace = 'http://ns.adobe.com/xap/1.0/t/pg/';
    var xmpTPg = 'xmpTPg:SwatchGroups';
    var xmpG = 'xmpG:Colorants';
    var type = XMPConst.NUMBER;

    var swatches = xmp.countArrayItems(namespace, xmpTPg);

    for (var i = 1; i <= swatches; i++) {
        var colorants = xmp.countArrayItems(namespace, xmpTPg + '[' + i + ']/' + xmpG);

        for (var j = 1; j <= colorants; j++) {
            var structure = xmpTPg + '[' + i + ']/' + xmpG + '[' + j + ']/xmpG:';
            var color = {
                'colorant': { },
                'mode': xmp.getProperty(namespace, structure + 'mode').value,
                'name': xmp.getProperty(namespace, structure + 'swatchName').value,
                'swatch': undefined,
                'tint': undefined,
                'type': xmp.getProperty(namespace, structure + 'type').value
            };

            switch (color.mode) {
                case 'CMYK':
                    color.colorant.cyan = xmp.getProperty(namespace, structure + 'cyan', type).value;
                    color.colorant.magenta = xmp.getProperty(namespace, structure + 'magenta', type).value;
                    color.colorant.yellow = xmp.getProperty(namespace, structure + 'yellow', type).value;
                    color.colorant.black = xmp.getProperty(namespace, structure + 'black', type).value;
                    break;
                case 'GRAY':
                    color.colorant.gray = xmp.getProperty(namespace, structure + 'gray', type).value;
                    break;
                case 'LAB':
                    color.colorant.l = xmp.getProperty(namespace, structure + 'L', type).value;
                    color.colorant.a = xmp.getProperty(namespace, structure + 'A', type).value;
                    color.colorant.b = xmp.getProperty(namespace, structure + 'B', type).value;
                    break;
                case 'RGB':
                    color.colorant.red = xmp.getProperty(namespace, structure + 'red', type).value;
                    color.colorant.green = xmp.getProperty(namespace, structure + 'green', type).value;
                    color.colorant.blue = xmp.getProperty(namespace, structure + 'blue', type).value;
                    break;
            }

            try {
                color.swatch = app.activeDocument.swatches[color.name];
            }
            catch (err) { }

            try {
                color.tint = xmp.getProperty(namespace, structure + 'tint', type).value;
            }
            catch (err) { }

            colors.push(color);
        }
    }

    return colors;
}
