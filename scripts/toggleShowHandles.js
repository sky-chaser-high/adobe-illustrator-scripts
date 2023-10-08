/* ===============================================================================================================================================
   toggleShowHandles

   Description
   This script toggles the Preferences > Selection & Anchor Display > Anchor Points, Handle, and Bounding Box Display > Show handles when multiple anchors are selected.

   Usage
   Just run this script from File > Scripts > Other Script...

   Notes
   In rare cases, the script may not work if you continue to use it.
   In this case, restart Illustrator and try again.

   Requirements
   Illustrator CC or higher

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
    var pref = app.preferences;
    var handle = pref.getBooleanPreference('showDirectionHandles');
    pref.setBooleanPreference('showDirectionHandles', !handle);

    var items = app.activeDocument.selection;
    if (!items.length) showDialog(handle);
}


function isValidVersion() {
    var cc = 17;
    var aiVersion = parseFloat(app.version);
    if (aiVersion < cc) return false;
    return true;
}


function showDialog(handle) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.preferredSize.width = 350;
    dialog.orientation = 'column';
    dialog.alignChildren = ['fill', 'top'];
    dialog.spacing = 10;
    dialog.margins = 16;

    var group1 = dialog.add('group', undefined, { name: 'group1' });
    group1.orientation = 'row';
    group1.alignChildren = ['center', 'center'];
    group1.spacing = 10;
    group1.margins = 20;

    var statictext1 = group1.add('statictext', undefined, undefined, { name: 'statictext1' });
    statictext1.text = handle ? ui.hide : ui.show;

    var group2 = dialog.add('group', undefined, { name: 'group2' });
    group2.orientation = 'row';
    group2.alignChildren = ['center', 'center'];
    group2.spacing = 10;
    group2.margins = 0;

    var button1 = group2.add('button', undefined, undefined, { name: 'button1' });
    button1.text = ui.ok;
    button1.preferredSize.width = 90;

    dialog.show();
}


function localizeUI() {
    return {
        title: {
            en: 'Show handles for multiple selected anchor points',
            ja: '選択した複数のアンカーポイントのハンドルを表示'
        },
        show: {
            en: 'Show',
            ja: '表示'
        },
        hide: {
            en: 'Hide',
            ja: '非表示'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
