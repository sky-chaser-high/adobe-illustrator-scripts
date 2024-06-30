/* ===============================================================================================================================================
   checkDayOfWeek

   Description
   This script checks the day of the week.

   Usage
   Select a date section in the text with the cursor, run this script from File > Scripts > Other Script...

   Format
   YYYY/MM/DD, MM/DD/YYYY, DD/MM/YYYY,
   YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY,
   YYYY.MM.DD, MM.DD.YYYY, DD.MM.YYYY,
   YYYY MM DD, MM DD YYYY, DD MM YYYY,
   YYYY年MM月DD日, 令和YY年MM月DD日, 平成YY年MM月DD日, 昭和YY年MM月DD日, 大正YY年MM月DD日, 明治YY年MM月DD日,
   Jan(uary) (the) DD(st|nd|rd|th)(,) YYYY, MM DD(st|nd|rd|th)(,) YYYY,
   DD(st|nd|rd|th) (of) Jan(uary)(,) YYYY, DD(st|nd|rd|th) MM(,) YYYY,

   Notes
   If there is no year, it will considered as this year.
   Chinese numerals are not supported.
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
    var text = app.activeDocument.selection;
    if (!text.typename) return;

    var contents = splitContents(text.contents);
    var format = getDateFormat(contents);

    var year = getYear(contents, format);
    var month = getMonth(contents, format);
    var date = getDate(contents, format);

    var isValid = checkDate(year, month + 1, date);
    if (!isValid) return showErrorMassage(text.contents);

    var day = getDayOfWeek(year, month, date);

    showDialog(text.contents, day, year, month + 1, date);
}


function splitContents(text) {
    var regex = /\s+the\s+|\s+of\s+|\/|\s+|-|,\s*|\.\s*|[^\x01-\x7E\uFF61-\uFF9F]/ig;
    var contents = convertToSingleByteCharacters(text);
    contents = convertJapaneseToGregorianCalendar(contents);
    return contents.split(regex);
}


function convertToSingleByteCharacters(text) {
    var twoByteChar = /[！-～]/g;
    var value = text.replace(twoByteChar, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 0xFEE0);
    });
    return value;
}


function convertJapaneseToGregorianCalendar(text) {
    var meiji = /明治(元|\d+)/;
    var taisho = /大正(元|\d+)/;
    var showa = /昭和(元|\d+)/;
    var heisei = /平成(元|\d+)/;
    var reiwa = /令和(元|\d+)/;
    var digits = /^\d{1,3}年/;
    if (meiji.test(text)) return convertToGregorianCalendar(text, meiji, 1867);
    if (taisho.test(text)) return convertToGregorianCalendar(text, taisho, 1911);
    if (showa.test(text)) return convertToGregorianCalendar(text, showa, 1925);
    if (heisei.test(text)) return convertToGregorianCalendar(text, heisei, 1988);
    if (reiwa.test(text)) return convertToGregorianCalendar(text, reiwa, 2018);
    if (digits.test(text)) return convertToFourDigits(text, digits);
    return text;
}


function convertToGregorianCalendar(text, era, ad) {
    var japanese = /[^\x01-\x7E\uFF61-\uFF9F]+/;
    var year = text.match(era)[0].replace(japanese, '');
    if (!year) year = 1;
    var gregorian = parseInt(year, 10) + ad;
    return text.replace(era, gregorian);
}


function convertToFourDigits(text, era) {
    var japanese = /[^\x01-\x7E\uFF61-\uFF9F]+/;
    var year = text.match(era)[0].replace(japanese, '');
    var gregorian = 2000 + parseInt(year, 10) + '年';
    return text.replace(era, gregorian);
}


function getDateFormat(contents) {
    var regex = /^[0-9]{3,4}$/;
    if (regex.test(contents[0])) return 'YMD';

    if (/jp|kr|zh/i.test($.locale) && contents.length == 3) {
        regex = /^[0-9]{1,2}$/;
        if (regex.test(contents[0]) && regex.test(contents[2])) {
            if (parseInt(contents[2]) > 31) return 'MDY';
            return 'YMD';
        }
    }

    regex = /^[a-z]+(,|\.)*$/i;
    if (regex.test(contents[0])) return 'MDY';
    if (regex.test(contents[1])) return 'DMY';

    regex = /^[0-9]{1,2}[a-z]{2}(,|\.)*$/i;
    if (regex.test(contents[0])) return 'DMY';
    if (regex.test(contents[1])) return 'MDY';

    if (parseInt(contents[0]) > 12) return 'DMY';
    if (parseInt(contents[1]) > 12) return 'MDY';

    if (parseInt(contents[0]) <= 12 && parseInt(contents[1]) <= 12) {
        if (/us|jp|kr|zh/i.test($.locale)) return 'MDY';
        return 'DMY';
    }
    return 'MDY';
}


function getYear(contents, format) {
    var year = (format == 'YMD') ? contents[0] : contents[2];
    if (!year) return new Date().getFullYear();
    if (year.length < 4) return parseInt(year, 10) + 2000;
    return parseInt(year, 10);
}


function getMonth(contents, format) {
    var month = contents[1];
    if (format == 'MDY') month = contents[0];
    return convertMonth(month);
}


function convertMonth(str) {
    if (/^Jan/i.test(str)) return 0;
    if (/^Feb/i.test(str)) return 1;
    if (/^Mar/i.test(str)) return 2;
    if (/^Apr/i.test(str)) return 3;
    if (/^May/i.test(str)) return 4;
    if (/^Jun/i.test(str)) return 5;
    if (/^Jul/i.test(str)) return 6;
    if (/^Aug/i.test(str)) return 7;
    if (/^Sep/i.test(str)) return 8;
    if (/^Oct/i.test(str)) return 9;
    if (/^Nov/i.test(str)) return 10;
    if (/^Dec/i.test(str)) return 11;

    var month = parseInt(str, 10) - 1;
    return (month < 12) ? month : undefined;
}


function getDate(contents, format) {
    var date;
    if (format == 'DMY') date = contents[0];
    if (format == 'MDY') date = contents[1];
    if (format == 'YMD') date = contents[2];
    return convertDate(date);
}


function convertDate(str) {
    if (!str) return undefined;
    var date = str.replace(/,|\./, '');
    var regex = /^[0-9]{1,2}[a-z]{2}(,|\.)*$/i;
    if (regex.test(str)) {
        var alphabet = /[a-z]{2}(,|\.)*/i;
        date = str.replace(alphabet, '');
    }
    return parseInt(date, 10);
}


function checkDate(year, month, date) {
    if (!month || !date) return false;
    if (/4|6|9|11/.test(month) && date > 30) return false;
    if (/1|3|5|7|8|10|12/.test(month) && date > 31) return false;
    if (month == 2) {
        if (isLeapYear(year) && date > 29) return false;
        if (!isLeapYear(year) && date > 28) return false;
    }
    return true;
}


function isLeapYear(year) {
    return new Date(year, 2, 0).getDate() == 29;
}


function getDayOfWeek(year, month, date) {
    $.localize = true;
    var week = localizeUI();
    var day = new Date(year, month, date).getDay();
    if (day == 0) return week.sunday;
    if (day == 1) return week.monday;
    if (day == 2) return week.tuesday;
    if (day == 3) return week.wednesday;
    if (day == 4) return week.thursday;
    if (day == 5) return week.friday;
    if (day == 6) return week.saturday;
}


function isValidVersion() {
    var cs4 = 14;
    var aiVersion = parseInt(app.version);
    if (aiVersion < cs4) return false;
    return true;
}


function showErrorMassage(contents) {
    $.localize = true;
    var ui = localizeUI();
    showDialog(contents, ui.message, '-', '-', '-');
}


function showDialog(contents, day, year, month, date) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = [0, 0, 0, 4];

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1', truncate: 'end' });
    statictext1.text = contents;
    statictext1.minimumSize.width = 160;

    var divider1 = dialog.add('panel', undefined, undefined, { name: 'divider1' });
    divider1.alignment = 'fill';

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['left', 'center'];
    group2.spacing = 10;
    group2.margins = [0, 5, 0, 0];

    var group3 = group2.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['right', 'center'];
    group3.spacing = 12;
    group3.margins = 0;

    var statictext2 = group3.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = ui.day;

    var statictext3 = group3.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = ui.year;

    var statictext4 = group3.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = ui.month;

    var statictext5 = group3.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = ui.date;

    var group4 = group2.add('group', undefined, { name: 'group4' });
    group4.orientation = 'column';
    group4.alignChildren = ['left', 'center'];
    group4.spacing = 12;
    group4.margins = 0;

    var statictext6 = group4.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = day;

    var statictext7 = group4.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = year;

    var statictext8 = group4.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = month;

    var statictext9 = group4.add('statictext', undefined, undefined, { name: 'statictext9' });
    statictext9.text = date;

    var group5 = dialog.add('group', undefined, { name: 'group5' });
    group5.orientation = 'row';
    group5.alignChildren = ['right', 'center'];
    group5.spacing = 10;
    group5.margins = [0, 5, 0, 0];

    var button1 = group5.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Day of Week',
            ja: '日付と曜日'
        },
        day: {
            en: 'Day:',
            ja: '曜日:'
        },
        year: {
            en: 'Year:',
            ja: '年:'
        },
        month: {
            en: 'Month:',
            ja: '月:'
        },
        date: {
            en: 'Date:',
            ja: '日:'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        },
        sunday: {
            en: 'Sunday',
            ja: '日曜日'
        },
        monday: {
            en: 'Monday',
            ja: '月曜日'
        },
        tuesday: {
            en: 'Tuesday',
            ja: '火曜日'
        },
        wednesday: {
            en: 'Wednesday',
            ja: '水曜日'
        },
        thursday: {
            en: 'Thursday',
            ja: '木曜日'
        },
        friday: {
            en: 'Friday',
            ja: '金曜日'
        },
        saturday: {
            en: 'Saturday',
            ja: '土曜日'
        },
        message: {
            en: 'Incorrect date.',
            ja: '日付が正しくありません。'
        }
    };
}
