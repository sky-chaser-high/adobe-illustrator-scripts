/* ===============================================================================================================================================
   toggleTransformPatternTiles

   Description
   This script toggles the Preferences > General > Transform Pattern Tiles.

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
    if (isValidVersion()) main();
})();


function main() {
    var key = 'transformPatterns';
    var pref = app.preferences;
    var pattern = pref.getBooleanPreference(key);
    pref.setBooleanPreference(key, !pattern);
    showDialog(!pattern);
}


function isValidVersion() {
    var cc = 17;
    var current = parseInt(app.version);
    if (current < cc) return false;
    return true;
}


function showDialog(pattern) {
    $.localize = true;
    var ui = localizeUI();

    var dialog = new Window('dialog');
    dialog.text = ui.title;
    dialog.preferredSize.width = 260;
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
    statictext1.text = pattern ? ui.on : ui.off;

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
            en: 'Transform Pattern Tiles',
            ja: 'パターンを変形'
        },
        on: {
            en: 'ON',
            ja: 'ON'
        },
        off: {
            en: 'OFF',
            ja: 'OFF'
        },
        ok: {
            en: 'OK',
            ja: 'OK'
        }
    };
}
