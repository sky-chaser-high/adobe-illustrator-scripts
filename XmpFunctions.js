/* ===============================================================================================================================================
   XmpFunctions

   Description
   These functions gets the font or color properties used in the document from XMP.

   Usage
   You can include this script or copy the function to use it.

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS or higher

   Version
   1.0.1

   Homepage
   github.com/sky-chaser-high/adobe-illustrator-scripts
   =============================================================================================================================================== */


/**
 * Get font properties used in the document from XMP.
 * https://www.adobe.io/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {{composite: string, face: string, family: string, filename: string, name: string, type: string, version: string}[]} font properties
 */
function xmpGetFonts(src) {
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
        var structure = prop + '[' + i + ']/';
        var font = {
            'composite': xmp.getProperty(namespace, structure + 'stFnt:composite').value,
            'face': xmp.getProperty(namespace, structure + 'stFnt:fontFace').value,
            'family': xmp.getProperty(namespace, structure + 'stFnt:fontFamily').value,
            'filename': xmp.getProperty(namespace, structure + 'stFnt:fontFileName').value,
            'name': xmp.getProperty(namespace, structure + 'stFnt:fontName').value,
            'type': xmp.getProperty(namespace, structure + 'stFnt:fontType').value,
            'version': xmp.getProperty(namespace, structure + 'stFnt:versionString').value
        };
        fonts.push(font);
    }

    return fonts;
}


/**
 * Get history properties from XMP.
 * https://www.adobe.io/xmp/docs/XMPNamespaces/xmpMM/
 *
 * @param {File} src File object
 * @returns {{action: string, parameter: string | null, software: string | null, when: Date | null}[]} history properties
 */
function xmpGetHistory(src) {
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
        var structure = prop + '[' + i + ']/';
        var param = {
            'action': xmp.getProperty(namespace, structure + 'stEvt:action').value,
            'parameter': null,
            'software': null,
            'when': null
        };

        try {
            param.parameter = xmp.getProperty(namespace, structure + 'stEvt:parameters').value;
        }
        catch (e) { }

        try {
            param.parameter = xmp.getProperty(namespace, structure + 'stEvt:params').value;
        }
        catch (e) { }

        try {
            param.software = xmp.getProperty(namespace, structure + 'stEvt:softwareAgent').value;
        }
        catch (e) { }

        try {
            var when = xmp.getProperty(namespace, structure + 'stEvt:when').value;
            var xmpDateTime = new XMPDateTime(when);
            param.when = new Date(xmpDateTime.getDate());
        }
        catch (e) { }

        history.push(param);
    }

    return history;
}


/**
 * Get plate names used in the document from XMP.
 * https://www.adobe.io/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {string[]} plate names
 */
function xmpGetPlateNames(src) {
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
 * Get swatch properties used in the document from XMP.
 * https://www.adobe.io/xmp/docs/XMPNamespaces/xmpTPg/
 *
 * @param {File} src File object
 * @returns {{colorant:
 * {cyan: number, magenta: number, yellow: number, black: number, gray: number, l: number, a: number, b: number, red: number, green: number, blue: number},
 * mode: string, name: string, swatch: Swatch | null, tint: number | null, type: string}[]} swatch properties
 */
function xmpGetSwatches(src) {
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

    var swatches = xmp.countArrayItems(namespace, xmpTPg);

    for (var i = 1; i <= swatches; i++) {
        var colorants = xmp.countArrayItems(namespace, xmpTPg + '[' + i + ']/' + xmpG);

        for (var j = 1; j <= colorants; j++) {
            var structure = xmpTPg + '[' + i + ']/' + xmpG + '[' + j + ']/';
            var color = {
                'colorant': { },
                'mode': xmp.getProperty(namespace, structure + 'xmpG:mode').value,
                'name': xmp.getProperty(namespace, structure + 'xmpG:swatchName').value,
                'swatch': null,
                'tint': null,
                'type': xmp.getProperty(namespace, structure + 'xmpG:type').value
            };

            switch (color.mode) {
                case 'CMYK':
                    color.colorant.cyan = Number(xmp.getProperty(namespace, structure + 'xmpG:cyan').value);
                    color.colorant.magenta = Number(xmp.getProperty(namespace, structure + 'xmpG:magenta').value);
                    color.colorant.yellow = Number(xmp.getProperty(namespace, structure + 'xmpG:yellow').value);
                    color.colorant.black = Number(xmp.getProperty(namespace, structure + 'xmpG:black').value);
                    break;
                case 'GRAY':
                    color.colorant.gray = Number(xmp.getProperty(namespace, structure + 'xmpG:gray').value);
                    break;
                case 'LAB':
                    color.colorant.l = Number(xmp.getProperty(namespace, structure + 'xmpG:L').value);
                    color.colorant.a = Number(xmp.getProperty(namespace, structure + 'xmpG:A').value);
                    color.colorant.b = Number(xmp.getProperty(namespace, structure + 'xmpG:B').value);
                    break;
                case 'RGB':
                    color.colorant.red = Number(xmp.getProperty(namespace, structure + 'xmpG:red').value);
                    color.colorant.green = Number(xmp.getProperty(namespace, structure + 'xmpG:green').value);
                    color.colorant.blue = Number(xmp.getProperty(namespace, structure + 'xmpG:blue').value);
                    break;
            }

            try {
                color.swatch = app.activeDocument.swatches[color.name];
            }
            catch (e) { }

            try {
                var tint = xmp.getProperty(namespace, structure + 'xmpG:tint').value;
                color.tint = Number(tint);
            }
            catch (e) { }

            colors.push(color);
        }
    }

    return colors;
}
