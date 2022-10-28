/* ===============================================================================================================================================
   relinkFileExtension.js

   description
   This script is equivalent to InDesign's "Relink File Extension".

   usage
   1. Open the Ai file.
   2. Run this script from File > Scripts > Other Script...
   3. Enter the extension at the prompt that appears.
   If you don't select an image, all images in the document will be targeted.

   notes
   Place the relink files in the same place as the original files.
   Broken link files are not replaced.
   Embedded files are also not possible.

   requirements
   Illustrator CS4 or higher

   script version
   1.0.1
   =============================================================================================================================================== */

if (app.documents.length > 0) relinkFileExtension();


function relinkFileExtension() {
    var images = getPlacedItems();
    var extension = enterExtension();

    var failedFiles = [];
    var notfound = 0;
    var unlinked = 0;

    if (extension != null) {
        for (var i = 0; i < images.length; i++) {
            try {
                var path = images[i].file.path;
                var name = images[i].file.name.split('.').slice(0, -1).join('.') || images[i].file.name;
                // var ext = images[i].file.name.split('.').slice(-1)[0];

                var imageFile = File(path + '/' + name + extension);
                // var imageFileInLinks = File(path + '/Links/' + name + extension);

                if (imageFile.exists) {
                    images[i].file = imageFile;
                }
                // else if (imageFileInLinks.exists) {
                //     images[i].file = imageFileInLinks;
                //     images[i].selected = false;
                // }
                else {
                    failedFiles.push(images[i]);
                    notfound++;
                }
            }
            catch (e) {
                failedFiles.push(images[i]);
                unlinked++;
            }
        }
    }

    showResult({
        files: failedFiles,
        count: notfound + unlinked
    });
}


function getPlacedItems() {
    if (app.activeDocument.selection == 0) {
        return app.activeDocument.placedItems;
    }
    else {
        var images = [];
        var placedItems = app.activeDocument.placedItems;
        for (var i = 0; i < placedItems.length; i++) {
            if (placedItems[i].selected) {
                images.push(placedItems[i]);
            }
        }
        return images;
    }
}


function enterExtension() {
    var str = {
        en_US: 'Relink each selected link to a file that has tha same name as the original, and is stored in the same folder, but uses another filename extension.\rRelink to Filename Extension:',
        ja_JP: '選択した各リンクをファイルに再設定します。このファイルは元のファイルと同じ名前で、同じフォルダに保存されていますが、別の拡張子を使用しています。\rファイル名拡張子にリンクを再設定：'
    }

    var extension = prompt(str[app.locale] || str.en_US, '');

    if (extension == null) {
        return extension;
    }
    else if (extension == '') {
        return null;
    }
    else if (!/^\./.test(extension)) {
        return '.' + extension;
    }
    else {
        return extension;
    }
}


function showResult(obj) {
    app.activeDocument.selection = null;

    for (var i = 0; i < obj.files.length; i++) {
        obj.files[i].selected = true;
    }

    var message = {
        en_US: 'Failed to find ' + obj.count + ' links. These links have not been relinked, and will remain selected int the Links panel.',
        ja_JP: obj.count + ' 個のリンクが見つかりませんでした。これらのリンクは再リンクされず、リンクパネルで選択されたままの状態で残ります。'
    }

    if (obj.count > 0) alert(message[app.locale] || message.en_US);
}
