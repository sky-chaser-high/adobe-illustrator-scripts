[日本語の README はこちらです。](README_ja.md)

# Adobe Illustrator Scripts
This is a collection of scripts for Adobe Illustrator.

[![Download AllScripts.zip](https://img.shields.io/badge/Download-AllScripts.zip-blue)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/AllScripts.zip)

### Artboard [![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)
- [sortArtboards.js](#sortArtboards.js)

### Color [![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)
- [createColorChart.js](#createColorChart.js)
- [extractColorsFromGradient.js](#extractColorsFromGradient.js)
- [generateGradientColor.js](#generateGradientColor.js)
- [randomTextColor.js](#randomTextColor.js)
- [removeDeletedGlobalColor.js](#removeDeletedGlobalColor.js)
- [roundColorValue.js](#roundColorValue.js)
- [roundLocationOfGradientStop.js](#roundLocationOfGradientStop.js)
- [shuffleGradientColor.js](#shuffleGradientColor.js)

### Layer [![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)
- [deleteHiddenLayers.js](#deleteHiddenLayers.js)
- [deleteLockedLayers.js](#deleteLockedLayers.js)
- [deleteUnusedLayers.js](#deleteUnusedLayers.js)
- [invertLockedLayer.js](#invertLockedLayer.js)
- [invertVisibleLayer.js](#invertVisibleLayer.js)

### Link [![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)
- [relinkFileExtension.js](#relinkFileExtension.js)
- [relinkFileExtensionExtra.js](#relinkFileExtensionExtra.js)
- [relinkToFolder.js](#relinkToFolder.js)
- [resetToFullScale.js](#resetToFullScale.js)

### Path [![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)
- [closePath.js](#closePath.js)
- [convertAllAnchorPointsToCorner.js](#convertAllAnchorPointsToCorner.js) `New`
- [createGridLines.js](#createGridLines.js)
- [disjoinPath.js](#disjoinPath.js)
- [measurePathItems.js](#measurePathItems.js)
- [removeColorInGuideObject.js](#removeColorInGuideObject.js)
- [shuffleObjects.js](#shuffleObjects.js)
- [stepAndRepeat.js](#stepAndRepeat.js) `Update`

### Text [![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)
- [addNumericSeparators.js](#addNumericSeparators.js)
- [copyLineDown.js](#copyLine)
- [copyLineUp.js](#copyLine)
- [createPageNumbers.js](#createPageNumbers.js)
- [highlightWord.js](#highlightWord.js)
- [insertLineAbove.js](#insertLine)
- [insertLineBelow.js](#insertLine)
- [moveLineDown.js](#moveLine)
- [moveLineUp.js](#moveLine)
- [swapTextContents.js](#swapTextContents.js)
- [textAlign_Center.js](#textAlign)
- [textAlign_Left.js](#textAlign)
- [textAlign_Right.js](#textAlign)

### Utility [![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)
- [arrangeWindows.js](#arrangeWindows.js)
- [closeAllDocuments.js](#closeAllDocuments.js)
- [compareScale.js](#compareScale.js)
- [syncView.js](#syncView.js)
- [XmpFunctions.js](#XmpFunctions.js)
<br><br><br>


## Installation
[Download](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) the zip archive from 
[![Download](https://img.shields.io/badge/Download-66595c)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) or 
[Releases](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) and unzip it.  
The scripts can be placed anywhere on your computer.  
To run the scripts, from File > Scripts > Other Script... ( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>F12</kbd> )


## UI
[ScriptUI Dialog Builder (SDB)](https://scriptui.joonas.me/) was used to design the UI.  
**See also:** [ScriptUI-Dialog-Builder-Joonas](https://github.com/joonaspaakko/ScriptUI-Dialog-Builder-Joonas).


## Notes
In rare cases, if you continue to use the script, it may stop working.  
In that case, restart Illustrator and run this script again.
<br><br><br>





# <a name="addNumericSeparators.js">addNumericSeparators.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script changes a number to a 3-digit comma delimited string.

![Add Numeric Separators](images/addNumericSeparators.png)

### Usage
Select the text objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="arrangeWindows.js">arrangeWindows.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

### Description
This script splits and arranges all open windows.

![Arrange Windows](images/arrangeWindows.png)

### Usage
Just run this script.

### Requirements
Illustrator CS6 or higher





# <a name="closeAllDocuments.js">closeAllDocuments.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

### Description
This script closes all documents.  
If there are documents not saved, choose to save them.

### Usage
Just run this script.

### Notes
It has been implemented in the File menu since version 2021.

### Requirements
Illustrator CS4 or higher





# <a name="closePath.js">closePath.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script closes the path objects.

![Close Path](images/closePath.png)

### Usage
Select the path objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="compareScale.js">compareScale.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

### Description
This script compares two objects' scales.

![Compare Scale](images/compareScale.png)

### Usage
Select two objects, and run this script.

### Notes
The dimensional units depend on the ruler units.

### Requirements
Illustrator CS or higher





# <a name="convertAllAnchorPointsToCorner.js">convertAllAnchorPointsToCorner.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script converts all anchor points to the corner.  
The anchor point conversion options in the Control panel require the anchor point to be selected, but this script selects the entire object.

![Convert All Anchor Points To Corner](images/convertAllAnchorPointsToCorner.png)

### Usage
Select the entire path with selection tool, and run this script.

### Notes
It is not necessary to select anchor points with direct selection tool.

### Requirements
Illustrator CS or higher





# <a name="copyLine">copyLineDown.js<br>copyLineUp.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script is equivalent to Visual Studio Code's Selection menu 
"Copy Line Down"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↓</kbd> ) & 
"Copy Line Up"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com/main/) or similar, you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

![Vscode Copy Line](images/vscode_copyLine.png)

For example, copyLineDown.js:
![Copy Line](images/copyLine.png)

### Usage
Move the cursor to the line you want to copy, and run this script.  
It is not necessary to select a line.

### Notes
Only one line can be copied. Multiple lines are not supported.  
In the case of copyLineDown.js, when copying the last line, a new line is added to work around a bug.  
If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher





# <a name="createColorChart.js">createColorChart.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script creates a color chart.

![Create Color Chart](images/createColorChart.png)

### Usage
1. Run this script.
2. Select either CMYK or RGB, and enter the color values.  
   If an object is selected, the fill value of the object will be used as the initial value.
3. Select the color you want to increase or decrease with vertical, or horizontal.
4. Enter the increase or decrease value.  
   Enter the percentage to be increased or decreased.
5. Set the artboard size, chip size, and units according to your preference.

### Notes
For CMYK, Black cannot be increased or decreased.  

### Requirements
Illustrator CS4 or higher





# <a name="createGridLines.js">createGridLines.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script creates grid lines on artboards.

![Create Grid Lines](images/createGridLines.png)

### Usage
Just run this script.

### Notes
Grid spacing is determined by the Guides & Grid in Preferences.

### Requirements
Illustrator CS or higher





# <a name="createPageNumbers.js">createPageNumbers.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script is equivalent to InDesign's Type menu > Insert Special Character > Markers > Current Page Number.  
Places a page number at a specified location on the artboards.

![Create Page Numbers](images/createPageNumbers.png)

### Usage
1. Run this script.
2. Set up each parameter in the dialog that appears.
   - `Position` Position of the page number.
   - `Facing Pages` If true, the facing page.
   - `Start Page Numbering at` a Start page number.
   - `Section Prefix` Add a Section Prefix in front of the page number. If facing page, in back of the page number.
   - `Font Size` Font size of the page number.
   - `Margin` Distance from the artboard. Switch the units according to the ruler units.

### Notes
The page numbering style is numeric only.  
Assign page numbers in artboard order.

### Requirements
Illustrator CS4 or higher





# <a name="deleteHiddenLayers.js">deleteHiddenLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

### Description
This script deletes hidden layers.

![Delete Hidden Layers](images/deleteHiddenLayers.png)

### Usage
Just run this script.

### Notes
It has been implemented in the Layers panel menu since version 2021.

### Requirements
Illustrator CS or higher





# <a name="deleteLockedLayers.js">deleteLockedLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

### Description
This script deletes locked layers.

![Delete Locked Layers](images/deleteLockedLayers.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher





# <a name="deleteUnusedLayers.js">deleteUnusedLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

### Description
This script deletes unused layers.

![Delete Unused Layers](images/deleteUnusedLayers.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher





# <a name="disjoinPath.js">disjoinPath.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script breaks apart the path object with anchor points.

![Disjoin Path](images/disjoinPath.png)

### Usage
Select the path objects, and run this script.

### Notes
The original path object will be deleted.  

### Requirements
Illustrator CS or higher





# <a name="extractColorsFromGradient.js">extractColorsFromGradient.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script extracts colors as swatches from the gradient stops.

![Extract Colors From Gradient](images/extractColorsFromGradient.png)

### Usage
Select the path objects or swatches, and run this script.

### Notes
Prioritize the path object over swatches.  
To extract color from swatches, deselect the path objects.  
Text object and stroke color are not supported.

### Requirements
Illustrator CS or higher





# <a name="generateGradientColor.js">generateGradientColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script generates the gradient color from fill colors or swatches.

![Generate Gradient Color](images/generateGradientColor.png)

### Usage
Select the path objects or swatches, and run this script.

### Notes
Prioritize the path object over swatches.  
To generate gradient color from swatches, deselect the path objects.  
Text object and stroke color are not supported.

### Requirements
Illustrator CS4 or higher





# <a name="highlightWord.js">highlightWord.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script highlights the searched words with the fill color.  
Both CMYK and RGB colors are supported.

![Highlight Word](images/highlightWord.png)

### Usage
1. Select the text objects, and run this script.
2. Type the word.
3. Use the slider to determine the color if necessary.

### Requirements
Illustrator CS4 or higher





# <a name="insertLine">insertLineAbove.js<br>insertLineBelow.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script is equivalent to Visual Studio Code's 
"Insert Line Above"( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> ) & 
"Insert Line Below" ( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com/main/) or similar, you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

For example, insertLineBelow.js:
![Insert Line](images/insertLine.png)

### Usage
Move the cursor to the line below or above you want to add a line, and run this script.  
It is not necessary to select a line.

### Notes
If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher





# <a name="invertLockedLayer.js">invertLockedLayer.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

### Description
This script inverts locked layers.

![Invert Locked Layer](images/invertLockedLayer.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher





# <a name="invertVisibleLayer.js">invertVisibleLayer.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

### Description
This script inverts visible layers.

![Invert Visible Layer](images/invertVisibleLayer.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher





# <a name="measurePathItems.js">measurePathItems.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script measures the distance of an anchor point between two points of an object.

![Measure PathItems](images/measurePathItems.png)

### Usage
Select the path objects, and run this script.

### Feature
Group and color measurements by path object.  
Switch the dimension units according to the ruler units.

### Notes
In complex shapes, measurements may be displayed overlapping each other.  
Curves are not supported.  

### Requirements
Illustrator CS4 or higher





# <a name="moveLine">moveLineDown.js<br>moveLineUp.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script is equivalent to Visual Studio Code's Selection menu 
"Move Line Down"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↓</kbd> ) & 
"Move Line Up"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↑</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com/main/) or similar, you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

![Vscode Move Line](images/vscode_moveLine.png)

For example, moveLineDown.js:
![Move Line](images/moveLine.png)

### Usage
Move the cursor to the line you want to move, and run this script.  
It is not necessary to select a line.

### Notes
Only one line can be moved. Multiple lines are not supported.  
In the case of moveLineUp.js, when moving the last line, a new line is added to work around a bug.  
If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher





# <a name="randomTextColor.js">randomTextColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script changes the text color randomly by word, character or sentence.  
Both CMYK and RGB colors are supported.

![Random Text Color](images/randomTextColor.png)

### Usage
1. Select the text objects, and run this script.
2. Assign the threshold value with the slider.
3. Click the Random button to assign a color according to the threshold value.

### Notes
If there are many characters, the conversion will take time.  
Some characters, such as periods and commas, are not applied.

### Requirements
Illustrator CS4 or higher





# <a name="relinkFileExtension.js">relinkFileExtension.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

### Description
This script is equivalent to InDesign's Links panel menu "Relink File Extension".

![InDesign's Relink File Extension](images/InDesign_Relink_File_Extension.png)

### Usage
1. Run this script.  
   If you don't select an image, all images will be targeted in the document.
2. Enter the extension at the prompt that appears.

![Relink File Extension](images/relinkFileExtension.png)

### Notes
Place the relink files in the same place as the original files.  
When selecting an image, select the image on the artboard rather than the image in the links panel.  
Broken link files are not replaced.  
Embedded files are also not possible.

### Requirements
Illustrator CS4 or higher





# <a name="relinkFileExtensionExtra.js">relinkFileExtensionExtra.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

### Description
This script is an enhanced version of relinkFileExtension.js.

![Relink File Extension Extra](images/relinkFileExtensionExtra.png)

### Usage
1. Run this script.  
   If you don't select an image, all images will be targeted in the document.
2. Choose to replace or add the string.  
   To replace, you can use regular expressions.  
   To add, specify a string to be added to the beginning or end of the original file name, or both.
3. Enter the extension.  
   If you don't enter an extension, the extension of the original file will be used.

### Notes
Place the relink files in the same place as the original files.  
When selecting an image, select the image on the artboard rather than the image in the links panel.  
Broken link files are not replaced.  
Embedded files are also not possible.

### Requirements
Illustrator CS4 or higher





# <a name="relinkToFolder.js">relinkToFolder.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

### Description
This script is equivalent to InDesign's Links panel menu "Relink To Folder".  
Replaces the image with an image of the same name in the specified folder.

![InDesign's Relink To Folder](images/InDesign_Relink_To_Folder.png)

### Usage
1. Run this script.  
   If you don't select an image, all images will be targeted in the document.
2. Select a folder in the dialog that appears.

### Notes
When selecting an image, select the image on the artboard rather than the image in the links panel.  
Broken link files are not replaced.  
Embedded files are also not possible.

### Requirements
Illustrator CS4 or higher





# <a name="removeColorInGuideObject.js">removeColorInGuideObject.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script removes fill and stroke colors in all guide objects.

![Remove Color In Guide Object](images/removeColorInGuideObject.png)

### Usage
Just run this script.  
It is not necessary to select guide objects.

### Notes
Show and unlock all layers.  
Guide objects hidden with <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>3</kbd> are not supported.  
If you have added fill or stroke colors in the Appearance panel, they may not work well.

### Requirements
Illustrator CS6 or higher





# <a name="removeDeletedGlobalColor.js">removeDeletedGlobalColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
Deletes the Deleted Global Color displayed in the Separations Preview panel.  

![Remove Deleted Global Color](images/removeDeletedGlobalColor.png)

### Usage
Just run this script.

### Notes
In rare cases, you may not be able to delete it.  
If you save the file and reopen it, it may be restored.  
In this case, there is no way to delete it.

### Requirements
Illustrator CS or higher





# <a name="resetToFullScale.js">resetToFullScale.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

### Description
This script resets the scale to 100% and the rotation angle to 0 degrees for the linked files.  
Embedded images are also supported.

![Reset To Full Scale](images/resetToFullScale.png)

### Usage
Select the linked files or the embedded images, and run this script.

### Requirements
Illustrator CS6 or higher





# <a name="roundColorValue.js">roundColorValue.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script rounds color values.  
Both fill and stroke colors are supported.

![Round Color Value](images/roundColorValue.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="roundLocationOfGradientStop.js">roundLocationOfGradientStop.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script rounds the location of the gradient color stops and midpoints.  
Both fill and stroke colors are supported.

![Round Location Of Gradient Stops](images/roundLocationOfGradientStops.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="shuffleGradientColor.js">shuffleGradientColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

### Description
This script shuffles the gradient color.

![Shuffle Gradient Color](images/shuffleGradientColor.png)

### Usage
Select the path objects, and run this script.

### Notes
Only a fill color. A stroke color is not supported.  
For compound path objects, select them with direct selection tool.

### Requirements
Illustrator CS or higher





# <a name="shuffleObjects.js">shuffleObjects.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script shuffles the objects.

![Shuffle Objects](images/shuffleObjects.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="sortArtboards.js">sortArtboards.js</a>
[![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)

### Description
This script sorts the artboards in the Artboard panel.

![Sort Artboards](images/sortArtboards.png)

### Usage
Just run this script.

### Notes
Only the Artboard panel. Artboards in the document are not sorted.

### Requirements
Illustrator CS5 or higher





# <a name="stepAndRepeat.js">stepAndRepeat.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

### Description
This script is equivalent to InDesign's Edit menu "Step and Repeat".  

![Step and Repeat](images/stepAndRepeat.png)

### Usage
1. Select the objects, and run this script.
2. If you want to create as a grid, check the create as a grid.
3. Enter the number of times to repeat.
4. Enter the offset values.

### Notes
The unit of the offset value switches to match the unit of the ruler.

### Requirements
Illustrator CS4 or higher





# <a name="swapTextContents.js">swapTextContents.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script swap the text contents.

![Swap Text Contents](images/swapTextContents.png)

### Usage
Select two text objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="syncView.js">syncView.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

### Description
This script synchronizes the scale ratio and the position of the current work area for all documents.  

![Sync View](images/syncView.png)

### Usage
Just run this script.

### Notes
Open at least two files.  

### Requirements
Illustrator CS or higher





# <a name="textAlign">textAlign_Center.js<br>textAlign_Left.js<br>textAlign_Right.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

### Description
This script changes the text alignment without moving the text position.  
Vertical text is also supported.

For example, textAlign_Center.js:
![Text Align](images/textAlign.png)

### Usage
Select the text objects, and run this script.

### Requirements
Illustrator CS or higher





# <a name="XmpFunctions.js">XmpFunctions.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

### Description
These functions get the font, color, or history properties that are used in the document from XMP.  
**See also:** [Adobe XMP Document](https://www.adobe.io/xmp/docs/)

### Usage
You can include this script or copy the function to use it.

```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var fonts = xmpGetFonts(app.activeDocument.fullName);
```
It can also be used for linked files.
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var src = app.activeDocument.placedItems[0].file;
var history = xmpGetHistory(src);
```

### Functions
- [xmpGetFonts(src)](#xmpGetFonts(src))
- [xmpGetHistory(src)](#xmpGetHistory(src))
- [xmpGetLinkedFiles(src)](#xmpGetLinkedFiles(src))
- [xmpGetPlateNames(src)](#xmpGetPlateNames(src))
- [xmpGetSwatches(src)](#xmpGetSwatches(src))

### <a name="xmpGetFonts(src)">xmpGetFonts(src)</a>
Get font properties that are used in the document from XMP.  

**Param**: `src` `<File>`  
**Returns**: `Array<Object>` An unordered array of font properties.  
- `composite` `<boolean>` When true, this is a composite font.
- `face` `<string>` The font face name.
- `family` `<string>` The font family name.
- `filename` `<string>` The font file name. (not a complete path)
- `name` `<string>` PostScript name of the font.
- `type` `<string>` The font type, such as TrueType, Type 1, Open Type, and so on.
- `version` `<string>` The version string.

##### Example
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var fonts = xmpGetFonts(app.activeDocument.fullName);
alert(fonts[0].face);
```

### <a name="xmpGetHistory(src)">xmpGetHistory(src)</a>
Get history properties from XMP.

**Param**: `src` `<File>`  
**Returns**: `Array<Object>` An ordered array of user actions that resulted in the document.  
- `action` `<string>` The action that occurred.
- `parameter` `<string> | null` Additional description of the action.
- `software` `<string> | null` The software agent that performed the action.
- `when` `<Date> | null` Timestamp of when the action occurred.

##### Example
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var history = xmpGetHistory(app.activeDocument.fullName);
var date = history[0].when;
alert(date.getFullYear());
```

### <a name="xmpGetLinkedFiles(src)">xmpGetLinkedFiles(src)</a>
Get linked file properties from XMP.

**Param**: `src` `<File>`  
**Returns**: `Array<Object>` References to resources that were incorporated, by inclusion or reference, into this resource.  
- `exists` `<boolean>` When true, the path name of this object refers to an existing file.
- `filePath` `<string>` The referenced resource's file path or URL.

##### Example
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var files = xmpGetLinkedFiles(app.activeDocument.fullName);
alert(files[0].filePath);
```

### <a name="xmpGetPlateNames(src)">xmpGetPlateNames(src)</a>
Get plate names that are used in the document from XMP.

**Param**: `src` `<File>`  
**Returns**: `Array<string>` An ordered array of plate names that are needed to print the document.  

##### Example
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var platenames = xmpGetPlateNames(app.activeDocument.fullName);
alert(platenames[0]);
```

### <a name="xmpGetSwatches(src)">xmpGetSwatches(src)</a>
Get swatch properties that are used in the document from XMP.

**Param**: `src` `<File>`  
**Returns**: `Array<Object>` A structure containing the characteristics of a colorant (swatch) used in the document.  
- `colorant` `<Object>` The color values.
    - `cyan` `<number>` Cyan color value when the mode is CMYK. Range 0-100.
    - `magenta` `<number>` Magenta color value when the mode is CMYK. Range 0-100.
    - `yellow` `<number>` Yellow color value when the mode is CMYK. Range 0-100.
    - `black` `<number>` Black color value when the mode is CMYK. Range 0-100.
    - `gray` `<number>` Gray color value when the mode is GRAY. Range 0-255.
    - `l` `<number>` L value when the mode is LAB. Range 0-100.
    - `a` `<number>` A value when the mode is LAB. Range -128 to 127.
    - `b` `<number>` B value when the mode is LAB. Range -128 to 127.
    - `red` `<number>` Red color value when the mode is RGB. Range 0-255.
    - `green` `<number>` Green color value when the mode is RGB. Range 0-255.
    - `blue` `<number>` Blue color value when the mode is RGB. Range 0-255.
- `mode` `<string>` The color space in which the color is defined.
- `name` `<string>` Name of the swatch.
- `swatch` `<swatch> | null` Swatch object.
- `tint` `<number>` The tint of the color.
- `type` `<string>` The type of color, one of PROCESS or SPOT.

##### Example
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var swatches = xmpGetSwatches(app.activeDocument.fullName);
alert(swatches[0].colorant.cyan);
```



### Requirements
Illustrator CS or higher



# Licence
All scripts are licensed under the MIT license.  
See the included LICENSE file for more details.  
