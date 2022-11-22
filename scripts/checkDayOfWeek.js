/* ===============================================================================================================================================
   checkDayOfWeek

   Description
   This script checks the day of the week.

   Usage
   Select a date with the cursor, run this script from File > Scripts > Other Script...

   Format
   YYYY/MM/DD, MM/DD/YYYY, DD/MM/YYYY,
   YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY,
   YYYY.MM.DD, MM.DD.YYYY, DD.MM.YYYY,
   YYYY MM DD,
   YYYY年MM月DD日,
   Jan(uary) (the) DD(st|nd|rd|th)(,) YYYY, MM DD(st|nd|rd|th)(,) YYYY,
   DD(st|nd|rd|th) (of) Jan(uary)(,) YYYY, DD(st|nd|rd|th) MM(,) YYYY,

   Notes
   If there is no year, it is considered as this year.
   If the date is incorrect, a warning is issued.
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

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
    if (app.documents.length > 0 && app.activeDocument.selection.length > 0) main();
})();


function main() {
    try {
        var text = app.activeDocument.selection;
        if (!text.typename) return;

        var contents = text.contents.split(/\s+the\s+|\s+of\s+|\/|\s+|-|,\s*|\.\s*|[^\x01-\x7E\uFF61-\uFF9F]/ig);
        var format = getFormat(contents);

        var year = getYear(format, contents);
        var month = getMonth(format, contents);
        var date = getDate(format, contents);

        var isValid = checkDate(year, month + 1, date);
        if (!isValid) return alert(errorMassage());

        var day = getDayOfWeek(year, month, date);
        showDialog(year, month + 1, date, day);
    }
    catch (err) { }
}


function getFormat(date) {
    var regex = new RegExp('^[0-9]{4}$', 'i');
    if (regex.test(date[0])) return 'YMD';

    regex = new RegExp('^[a-z]+(,|\.)*$', 'i');
    if (regex.test(date[0])) return 'MDY';
    if (regex.test(date[1])) return 'DMY';

    regex = new RegExp('^[0-9]{1,2}[a-z]{2}(,|\.)*$', 'i');
    if (regex.test(date[0])) return 'DMY';
    if (regex.test(date[1])) return 'MDY';

    if (parseInt(date[0]) > 12) return 'DMY';
    if (parseInt(date[1]) > 12) return 'MDY';

    if (parseInt(date[0]) <= 12 && parseInt(date[1]) <= 12) {
        if (/us|jp|kr|zh/i.test($.locale)) return 'MDY';
        return 'DMY';
    }
    return 'MDY';
}


function getYear(format, contents) {
    var year = (format == 'YMD') ? contents[0] : contents[2];
    if (!year) {
        return new Date().getFullYear();
    }
    return parseInt(year);
}


function getMonth(format, contents) {
    if (format == 'MDY') {
        return convertMonth(contents[0]);
    }
    return convertMonth(contents[1]);
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

    var month = parseInt(str) - 1;
    return (month < 12) ? month : undefined;
}


function getDate(format, contents) {
    if (format == 'DMY') return convertDate(contents[0]);
    if (format == 'MDY') return convertDate(contents[1]);
    if (format == 'YMD') return convertDate(contents[2]);
}


function convertDate(str) {
    if (!str) return undefined;
    var date = str.replace(/,|\./, '');
    var regex = new RegExp('^[0-9]{1,2}[a-z]{2}(,|\.)*$', 'i');
    if (regex.test(str)) {
        date = str.replace(/[a-z]{2}(,|\.)*/i, '');
    }
    return parseInt(date);
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
    var day = new Date(year, month, date).getDay();
    if (day == 0) return { en: 'Sunday', ja: '日曜日' };
    if (day == 1) return { en: 'Monday', ja: '月曜日' };
    if (day == 2) return { en: 'Tuesday', ja: '火曜日' };
    if (day == 3) return { en: 'Wednesday', ja: '水曜日' };
    if (day == 4) return { en: 'Thursday', ja: '木曜日' };
    if (day == 5) return { en: 'Friday', ja: '金曜日' };
    if (day == 6) return { en: 'Saturday', ja: '土曜日' };
}


function errorMassage() {
    $.localize = true;
    return {
        en: 'Incorrect date.',
        ja: '日付が正しくありません。'
    };
}


function showDialog(year, month, date, day) {
    var dialog = new Window('dialog');
    dialog.text = 'Day of Week';
    dialog.preferredSize.width = 160;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['left', 'center'];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add('group', undefined, { name: 'group2' });
    group2.orientation = 'column';
    group2.alignChildren = ['right', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var statictext1 = group2.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = 'Day:';

    var statictext2 = group2.add('statictext', undefined, undefined, { name: 'statictext2' });
    statictext2.text = 'Year:';

    var statictext3 = group2.add('statictext', undefined, undefined, { name: 'statictext3' });
    statictext3.text = 'Month:';

    var statictext4 = group2.add('statictext', undefined, undefined, { name: 'statictext4' });
    statictext4.text = 'Date:';

    var group3 = group1.add('group', undefined, { name: 'group3' });
    group3.orientation = 'column';
    group3.alignChildren = ['left', 'center'];
    group3.spacing = 10;
    group3.margins = 0;

    var statictext5 = group3.add('statictext', undefined, undefined, { name: 'statictext5' });
    statictext5.text = day;

    var statictext6 = group3.add('statictext', undefined, undefined, { name: 'statictext6' });
    statictext6.text = year;

    var statictext7 = group3.add('statictext', undefined, undefined, { name: 'statictext7' });
    statictext7.text = month;

    var statictext8 = group3.add('statictext', undefined, undefined, { name: 'statictext8' });
    statictext8.text = date;

    var group4 = dialog.add('group', undefined, { name: 'group4' });
    group4.orientation = 'row';
    group4.alignChildren = ['center', 'center'];
    group4.spacing = 10;
    group4.margins = [0, 5, 0, 0];

    var button1 = group4.add('button', undefined, undefined, { name: 'button1' });
    button1.text = 'OK';
    button1.preferredSize.width = 100;
    button1.preferredSize.height = 26;

    dialog.show();
}
