[日本語の README はこちらです。](README_ja.md)

# Adobe Illustrator Scripts
[![Download AllScripts.zip](https://img.shields.io/badge/Download-AllScripts.zip-blue)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/AllScripts.zip)

This is a collection of scripts for Adobe Illustrator. I created it with simplicity and ease of use in mind.  
Click the script name to jump to learn more about the script.  
If you find a script that interests you, please download it from [![Download](https://img.shields.io/badge/Download-66595c)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest).
<br><br>

### Artboard [![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)
- [Show Artboard Name](#showArtboardName)
- [Sort Artboards](#sortArtboards)

### Color [![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)
- [Create Color Chart](#createColorChart)
- [Extract Colors from Gradient](#extractColorsFromGradient)
- [Generate Gradient Color](#generateGradientColor)
- [Highlight Word](#highlightWord)
- [Match Location of Gradient Stop](#matchLocationOfGradientStop)
- [Random Text Color](#randomTextColor)
- [Remove Deleted Global Color](#removeDeletedGlobalColor)
- [Round Color Value](#roundColorValue)
- [Round Location of Gradient Stop](#roundLocationOfGradientStop)
- [Shuffle Gradient Color](#shuffleGradientColor)

### Layer [![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)
- [Delete Hidden Layers](#deleteHiddenLayers)
- [Delete Locked Layers](#deleteLockedLayers)
- [Delete Unused Layers](#deleteUnusedLayers)
- [Invert Locked Layer](#invertLockedLayer)
- [Invert Visible Layer](#invertVisibleLayer)
- [Move Sublayer to Main Layer](#moveSublayerToMainLayer)
- [Unify Layer Colors](#unifyLayerColors)

### Link [![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)
- [Relink File Extension](#relinkFileExtension)
- [Relink File Extension Extra](#relinkFileExtensionExtra)
- [Relink to Folder](#relinkToFolder)
- [Reset to Full Scale](#resetToFullScale)
- [Select Embedded Link](#selectEmbeddedLink)
- [Select Link](#selectLink)

### Path [![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)
- [Close Path](#closePath)
- [Convert All Anchor Points to Corner](#convertAllAnchorPointsToCorner)
- [Create Grid Lines](#createGridLines)
- [Disjoin Path](#disjoinPath)
- [Draw Rectangle](#drawRectangle)
- [Draw Shape on Anchor Point](#drawShapeOnAnchorPoint)
- [Extend Line](#extendLine)
- [Fit Guide in Artboard](#fitGuideInArtboard)
- [Measure Path Items](#measurePathItems)
- [Remove Color in Guide Object](#removeColorInGuideObject)
- [Shuffle Objects](#shuffleObjects)
- [Step and Repeat](#stepAndRepeat)

### Text [![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)
- [Add Numeric Separators](#addNumericSeparators)
- [Convert Type on a Path to Point Type](#convertTypeOnAPathToPointType) `New`
- [Copy Line Down](#copyLine)
- [Copy Line Up](#copyLine)
- [Copy Line (empty selection)](#emptySelection)
- [Create Page Numbers](#createPageNumbers)
- [Cut Line (empty selection)](#emptySelection)
- [Delete All Left](#deleteAll)
- [Delete All Right](#deleteAll)
- [Delete Trailing Spaces](#deleteTrailingSpaces)
- [Delete Word](#deleteWord)
- [Enclose Word in Parentheses](#encloseWordInParentheses) `New`
- [Go to Line](#goToLine)
- [Go to Next Text](#goToText)
- [Go to Previous Text](#goToText)
- [Insert Line Above](#insertLine)
- [Insert Line Below](#insertLine)
- [Move Line Down](#moveLine)
- [Move Line Up](#moveLine)
- [Swap Text Contents](#swapTextContents)
- [Text Align Center](#textAlign)
- [Text Align Left](#textAlign)
- [Text Align Right](#textAlign)

### Utility [![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)
- [Arrange Windows](#arrangeWindows)
- [Check Day of Week](#checkDayOfWeek)
- [Close All Documents](#closeAllDocuments)
- [Compare Scale](#compareScale)
- [Sync View](#syncView)
- [XMP Functions](#XmpFunctions)
<br><br><br>


## Installation
[Download](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) the zip archive from 
[![Download](https://img.shields.io/badge/Download-66595c)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) or 
[Releases](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) and unzip it.  
The scripts can be placed anywhere on your computer.  
To run the scripts, from File > Scripts > Other Script... ( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>F12</kbd> )

> **Note**  
> In rare cases, if you continue to use the script, it may not work.  
> In that case, restart Illustrator and try again.


## Extensions, software
The following extensions or software make it easy to run scripts.
- [Scripshon Trees](https://exchange.adobe.com/apps/cc/15873/scripshon-trees) (free extension)
- [LAScripts](https://exchange.adobe.com/apps/cc/19405/lascripts) (free extension)
- [Keyboard Maestro](https://www.keyboardmaestro.com) (Mac / paid software)
- [AutoHotkey](https://www.autohotkey.com) (Windows / free software)


## UI
[ScriptUI Dialog Builder (SDB)](https://scriptui.joonas.me/) was used to design the UI.  
**See also:** [ScriptUI-Dialog-Builder-Joonas](https://github.com/joonaspaakko/ScriptUI-Dialog-Builder-Joonas).
<br><br><br>





# <a name="addNumericSeparators">addNumericSeparators</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script changes a number to a 3-digit comma delimited string.

![Add Numeric Separators](images/addNumericSeparators.png)

### Usage
Select the text objects, and run this script.  
Or, run this script in the text editing state.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="arrangeWindows">arrangeWindows</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
This script splits and arranges all open windows.

> **Note**  
> It has been implemented in the Application Bar since version 2022.

![Arrange Windows](images/arrangeWindows.png)

### Usage
Just run this script.

### Requirements
Illustrator CS6 or higher
<br><br>





# <a name="checkDayOfWeek">checkDayOfWeek</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
This script checks the day of the week.

![Check Day Of Week](images/checkDayOfWeek.png)

### Usage
Select a date with the cursor, and run this script.

> **Note**  
> If there is no year, it is considered as this year.  
> If the date is incorrect, a warning is issued.  
> The following formats are supported.

> **Format**  
> `YYYY/MM/DD`, `MM/DD/YYYY`, `DD/MM/YYYY`,   
> `YYYY-MM-DD`, `MM-DD-YYYY`, `DD-MM-YYYY`,  
> `YYYY.MM.DD`, `MM.DD.YYYY`, `DD.MM.YYYY`,  
> `YYYY MM DD`,  
> `YYYY年MM月DD日`,  
> `Jan(uary) (the) DD(st|nd|rd|th)(,) YYYY`, `MM DD(st|nd|rd|th)(,) YYYY`,  
> `DD(st|nd|rd|th) (of) Jan(uary)(,) YYYY`, `DD(st|nd|rd|th) MM(,) YYYY`

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="closeAllDocuments">closeAllDocuments</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
This script closes all documents.  
If there are documents not saved, choose to save them.

> **Note**  
> It has been implemented in the File menu since version 2021.

### Usage
Just run this script.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="closePath">closePath</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script closes the path objects.

![Close Path](images/closePath.png)

### Usage
Select the path objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="compareScale">compareScale</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
This script compares two objects' scales.

![Compare Scale](images/compareScale.png)

### Usage
Select two objects, and run this script.

> **Note**  
> The dimensional units depend on the ruler units.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="convertAllAnchorPointsToCorner">convertAllAnchorPointsToCorner</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script converts all anchor points to the corner.  
The anchor point conversion options in the Control panel require the anchor point to be selected, but this script selects the entire object.

![Convert All Anchor Points To Corner](images/convertAllAnchorPointsToCorner.png)

### Usage
Select the entire path with selection tool, and run this script.

> **Note**  
> It is not necessary to select anchor points with direct selection tool.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="convertTypeOnAPathToPointType">convertTypeOnAPathToPointType</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script converts types on a path to point types.

![Convert Type On A Path To Point Type](images/convertTypeOnAPathToPointType.png)

### Usage
Select type on a path object, and run this script.

> **Warning**  
> The original type objects will delete.  
> Any effects applied in the appearance will be lost.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="copyLine">copyLineDown<br>copyLineUp</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's Selection menu 
"Copy Line Down"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↓</kbd> ) & 
"Copy Line Up"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

![Vscode Copy Line](images/vscode_copyLine.png)

For example, copyLineDown.js:
![Copy Line](images/copyLine.png)

### Usage
Move the cursor to the line you want to copy, and run this script.  
It is not necessary to select a line.

> **Warning**  
> Since using copy and paste functions inside the script, it will lose if you have copied the content in advance.  
> Area type with wrapping may not work well.  
> In the case of copyLineDown.js, when copying the last line, a new line is added to work around a bug.

> **Note**  
> Only one line can be copied. Multiple lines are not supported.  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="emptySelection">copyLine(emptySelection)<br>cutLine(emptySelection)</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's keyboard shortcut 
"Copy line (empty selection)"( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>C</kbd> ) & 
"Cut line (empty selection)"( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>X</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

For example, cutLine(emptySelection).js:
![Empty Selection](images/emptySelection.png)

### Usage
Move the cursor to the line you want to copy or cut, and run this script.  
It is not necessary to select a line.

> **Warning**  
> Linefeed are not included to work around a bug in Illustrator.  
> Area type with wrapping may not work well.

> **Note**  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="createColorChart">createColorChart</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script creates a color chart.  
Both CMYK and RGB colors are supported.

![Create Color Chart](images/createColorChart.png)

### Usage
1. Run this script.
2. Select either CMYK or RGB, and enter the color values.  
   If an object is selected, the fill value of the object will be used as the initial value.
3. Select the color you want to increase or decrease with vertical, or horizontal.
4. Enter the increase or decrease value.  
   Enter the percentage to be increased or decreased.
5. Set the artboard size, color chip size, and units according to your preference.

> **Note**  
> Create a color chart in a new document.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="createGridLines">createGridLines</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script creates grid lines on artboards.

![Create Grid Lines](images/createGridLines.png)

### Usage
Just run this script.

> **Note**  
> Grid spacing is determined by the Guides & Grid in Preferences.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="createPageNumbers">createPageNumbers</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
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

> **Note**  
> The page numbering style is numeric only.  
> Assign page numbers in artboard order.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="deleteAll">deleteAllLeft<br>deleteAllRight</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's keyboard shortcut 
"Delete All Left"( <kbd>⌘</kbd> + <kbd>Backspace</kbd> ) & 
"Delete All Right"( <kbd>⌘</kbd> + <kbd>Delete</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

For example, deleteAllRight.js:
![Delete All Right](images/deleteAllRight.png)

### Usage
Move the cursor to the position of the character you want to delete and run this script.  
It is not necessary to select a string to be deleted.

> **Warning**  
> Since using copy and paste functions inside the script, it will lose if you have copied the content in advance.

> **Note**  
> Only one line can be deleted. Multiple lines are not supported.  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="deleteHiddenLayers">deleteHiddenLayers</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script deletes hidden layers.

> **Note**  
> It has been implemented in the Layers panel menu since version 2021.

![Delete Hidden Layers](images/deleteHiddenLayers.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="deleteLockedLayers">deleteLockedLayers</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script deletes locked layers.

![Delete Locked Layers](images/deleteLockedLayers.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="deleteTrailingSpaces">deleteTrailingSpaces</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script deletes trailing spaces.
Both point and area types are supported.

![Delete Trailing Spaces](images/deleteTrailingSpaces.png)

### Usage
Select the text objects, and run this script.  
It is not necessary to select a line.

> **Warning**  
> Area type with wrapping may not work well.

> **Note**  
> Delete tabs as well.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="deleteUnusedLayers">deleteUnusedLayers</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script deletes unused layers.

![Delete Unused Layers](images/deleteUnusedLayers.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="deleteWord">deleteWord</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script deletes a word under the cursor.
Both point and area types are supported.

![Delete Word](images/deleteWord.png)

### Usage
Move the cursor to the position of the word you want to delete and run this script.  
It is not necessary to select a word.

> **Warning**  
> Since using copy and paste functions inside the script, it will lose if you have copied the content in advance.  
> Area type with wrapping may not work well.

> **Note**  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="disjoinPath">disjoinPath</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script breaks apart the path object with anchor points.

![Disjoin Path](images/disjoinPath.png)

### Usage
Select the path objects, and run this script.

> **Warning**  
> The original path object will be deleted.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="drawRectangle">drawRectangle</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script draws a rectangle on a selected object.

![Draw Rectangle](images/drawRectangle.png)

### Usage
1. Select the path objects, and run this script.
2. Enter a margin value.  
   To include stroke width, check the Include stroke width checkbox.

> **Note**  
> The rectangle is drawn with no fill and stroke width.  
> The units of margin value depend on the ruler units.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="drawShapeOnAnchorPoint">drawShapeOnAnchorPoint</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script draws shapes on anchor points.

![Draw Shape On Anchor Point](images/drawShapeOnAnchorPoint.png)

### Usage
1. Select the path objects, and run this script.
2. Select a shape.
3. Enter a shape size.
4. Check the Draw Handle Position checkbox if you want to draw the shapes on the handle positions.

> **Note**  
> If you select anchor points with Direct Selection Tool, the shape is drawn only for the selected anchor points.  
> The handle position is drawn with a stroke.  
> The units of shape size depend on the ruler units.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="encloseWordInParentheses">encloseWordInParentheses</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script encloses words in parentheses.

![Enclose Word In Parentheses](images/encloseWordInParentheses.png)

### Usage
Move the cursor to the position of the word you want to enclose and run this script.  
If you select text ranges, enclose them.

> **Warning**  
> Since using cut and paste functions inside the script, it will lose if you have copied the content in advance.  
> Area type with wrapping may not work well.

> **Note**  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

If you want to enclose it with other characters, change lines 41 and 42 inside the script.  
For example, if you enclose it in brackets:
```javascript
var parentheses = {
    start: '[',
    end: ']'
};
```

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="extendLine">extendLine</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script extends a path object.

![Extend Line](images/extendLine.png)

### Usage
1. Select an anchor point with Direct Selection Tool, and run this script.
2. Enter a positive value to extend or a negative value to shrink.

> **Warning**  
> Closed paths and curves are not supported.

> **Note**  
> The units of extension value depend on the ruler units.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="extractColorsFromGradient">extractColorsFromGradient</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script extracts colors as swatches from the gradient stops.

![Extract Colors From Gradient](images/extractColorsFromGradient.png)

### Usage
Select the path objects or swatches, and run this script.

> **Note**  
> Prioritize the path object over swatches.  
> To extract color from swatches, deselect the path objects.  
> Text object and stroke color are not supported.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="fitGuideInArtboard">fitGuideInArtboard</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script fits guide objects in an artboard.

![Fit Guide In Artboard](images/fitGuideInArtboard.png)

### Usage
Select guide objects, and run this script.

> **Note**  
> Closed paths and curves are not supported.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="generateGradientColor">generateGradientColor</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script generates the gradient color from fill colors or swatches.

![Generate Gradient Color](images/generateGradientColor.png)

### Usage
Select the path objects or swatches, and run this script.

> **Note**  
> Prioritize the path object over swatches.  
> To generate gradient color from swatches, deselect the path objects.  
> Text object and stroke color are not supported.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="goToLine">goToLine</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's Go menu 
"Go to Line/Column..."( <kbd>Ctrl</kbd> + <kbd>G</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

![Vscode Go to Line](images/vscode_goToLine.png)

![Go to Line](images/goToLine.png)

### Usage
1. Run this script in the text editing state.
2. Enter a line number or select a line from the list below that you want to move.

> **Warning**  
> Since using copy and paste functions inside the script, it will lose if you have copied the content in advance.

> **Note**  
> Pan that the selected line is centered in the window.  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="goToText">goToNextText<br>goToPreviousText</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script moves the cursor to the beginning of the next or previous text while in the text editing state.  
Both point and area types are supported.

For example, goToNextText.js:
![Go to Text](images/goToText.png)

### Usage
Run this script in the text editing state.

> **Warning**  
> Since using cut and paste functions inside the script, it will lose if you have copied the content in advance.  
> It will not move to locked, hidden, or threaded texts. The layer also as well.

> **Note**  
> The cursor moving order is text stacking order.  
> Pan that the next or previous text is centered in the window.  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="highlightWord">highlightWord</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script highlights the searched words with the fill color.  
Both CMYK and RGB colors are supported.

![Highlight Word](images/highlightWord.png)

### Usage
1. Select the text objects, and run this script.
2. Type the word.
3. Use the slider to determine the color if necessary.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="insertLine">insertLineAbove<br>insertLineBelow</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's keyboard shortcut 
"Insert Line Above"( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> ) & 
"Insert Line Below" ( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

For example, insertLineBelow.js:
![Insert Line](images/insertLine.png)

### Usage
Move the cursor to the line below or above you want to add a line, and run this script.  
It is not necessary to move the cursor to the end of the line.

> **Warning**  
> Area type with wrapping may not work well.

> **Note**  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="invertLockedLayer">invertLockedLayer</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script inverts locked layers.

![Invert Locked Layer](images/invertLockedLayer.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="invertVisibleLayer">invertVisibleLayer</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script inverts visible layers.

![Invert Visible Layer](images/invertVisibleLayer.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="matchLocationOfGradientStop">matchLocationOfGradientStop</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script matches the location of the gradient stops and midpoints.

![Match Location Of Gradient Stop](images/matchLocationOfGradientStop.png)

### Usage
1. Select two or more gradients in the Swatches panel, and run this script.
2. Select a source gradient.

> **Note**  
> Only gradients in the Swatches panel are supported.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="measurePathItems">measurePathItems</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script measures the distance of an anchor point between two points of an object.

![Measure PathItems](images/measurePathItems.png)

### Usage
Select the path objects, and run this script.

### Feature
Group and color measurements by path object.  
Switch the dimension units according to the ruler units.

> **Warning**  
> Curves are not supported.

> **Note**  
> In complex shapes, measurements may be displayed overlapping each other.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="moveLine">moveLineDown<br>moveLineUp</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script is equivalent to Visual Studio Code's Selection menu 
"Move Line Down"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↓</kbd> ) & 
"Move Line Up"( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↑</kbd> ).  
If you assign shortcuts using [Keyboard Maestro](https://www.keyboardmaestro.com), [AutoHotkey](https://www.autohotkey.com) or similar, 
you will be able to achieve more of a Visual Studio Code feel.  
Both point and area types are supported.

![Vscode Move Line](images/vscode_moveLine.png)

For example, moveLineDown.js:
![Move Line](images/moveLine.png)

### Usage
Move the cursor to the line you want to move, and run this script.  
It is not necessary to select a line.

> **Warning**  
> Since using copy and paste functions inside the script, it will lose if you have copied the content in advance.  
> Area type with wrapping may not work well.  
> In the case of moveLineUp.js, when moving the last line, a new line is added to work around a bug.

> **Note**  
> Only one line can be moved. Multiple lines are not supported.  
> If you are using version 2020 or earlier, you will not be able to enter keyboard input after running the script.  
> If you want to enter text, you must click with the mouse.

### Requirements
Illustrator CC 2018 or higher
<br><br>





# <a name="moveSublayerToMainLayer">moveSublayerToMainLayer</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script moves sublayers to the main layer above.

![Move Sublayer To Main Layer](images/moveSublayerToMainLayer.png)

### Usage
Just run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="randomTextColor">randomTextColor</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script changes the text color randomly by word, character or sentence.  
Both CMYK and RGB colors are supported.

![Random Text Color](images/randomTextColor.png)

### Usage
1. Select the text objects, and run this script.
2. Assign the threshold value with the slider.
3. Click the Random button to assign a color according to the threshold value.

> **Note**  
> If there are many characters, the conversion will take time.  
> Some characters, such as periods and commas, are not applied.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="relinkFileExtension">relinkFileExtension</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script is equivalent to InDesign's Links panel menu "Relink File Extension...".

![Relink File Extension](images/relinkFileExtension.png)

### Usage
1. Run this script.  
   If you don't select linked files, all in the document replace.
2. Enter an extension.

> **Warning**  
> Missing linked files and embedded link files not replaced.  
> Place the relink files in the same place as the original files.

> **Note**  
> When selecting linked files, select them in the document rather than the links panel.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="relinkFileExtensionExtra">relinkFileExtensionExtra</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script is an enhanced version of relinkFileExtension.js.

![Relink File Extension Extra](images/relinkFileExtensionExtra.png)

### Usage
1. Run this script.  
   If you don't select linked files, all in the document replace.
2. Choose to Replace or Add.  
   To Replace, you can use regular expressions.  
   To Add, enter a string to be added to the prefix, suffix, or both of the original file names.
3. Enter an extension.  
   If you don't enter an extension, it uses the original file extension.

> **Warning**  
> Missing linked files and embedded link files not replaced.  
> Place the relink files in the same place as the original files.

> **Note**  
> When selecting linked files, select them in the document rather than the links panel.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="relinkToFolder">relinkToFolder</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script is equivalent to InDesign's Links panel menu "Relink to Folder...".  
Replace linked files with a file of the same name in the selected folder.

![InDesign's Relink To Folder](images/InDesign_Relink_To_Folder.png)

### Usage
1. Run this script.  
   If you don't select linked files, all in the document replace.
2. Select a folder in the dialog that appears.

> **Warning**  
> Missing linked files and embedded link files not replaced.

> **Note**  
> When selecting linked files, select them in the document rather than the links panel.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="removeColorInGuideObject">removeColorInGuideObject</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script removes fill and stroke colors in all guide objects.

![Remove Color In Guide Object](images/removeColorInGuideObject.png)

### Usage
Just run this script.  
It is not necessary to select guide objects.

> **Note**  
> Show and unlock all layers.  
> Guide objects hidden with <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>3</kbd> are not supported.  
> If you have added fill or stroke colors in the Appearance panel, they may not work well.

### Requirements
Illustrator CS6 or higher
<br><br>





# <a name="removeDeletedGlobalColor">removeDeletedGlobalColor</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script deletes the Deleted Global Color displayed in the Separations Preview panel.

![Remove Deleted Global Color](images/removeDeletedGlobalColor.png)

### Usage
Just run this script.

> **Note**  
> In rare cases, you may not be able to delete it.  
> If you save the file and reopen it, it may be restored.  
> In this case, there is no way to delete it.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="resetToFullScale">resetToFullScale</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script resets the scale to 100% and the rotation angle to 0 degrees for the linked files.  
Embedded link files are also supported.

![Reset To Full Scale](images/resetToFullScale.png)

### Usage
Select linked files or embedded link files, and run this script.

### Requirements
Illustrator CS6 or higher
<br><br>





# <a name="roundColorValue">roundColorValue</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script rounds color values.  
Both fill and stroke colors are supported.

![Round Color Value](images/roundColorValue.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="roundLocationOfGradientStop">roundLocationOfGradientStop</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script rounds the location of the gradient color stops and midpoints.  
Both fill and stroke colors are supported.

![Round Location Of Gradient Stops](images/roundLocationOfGradientStops.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="selectEmbeddedLink">selectEmbeddedLink</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script selects embedded link files.

### Usage
Just run this script.

> **Warning**  
> Locked or hidden embedded link files are not selected. The layer also as well.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="selectLink">selectLink</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)  
This script selects linked files.  
<img src="images/selectLink.png" alt="Select Link" width="70%">

### Usage
1. Run this script.
2. Enter a file name. It can also be part of the file name.  
   If the text field is empty, all linked files are selected.

> **Warning**  
> Locked or hidden linked files are not selected. The layer also as well.  
> Missing linked files may not be selected.

> **Note**  
> Regular expressions are supported.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="showArtboardName">showArtboardName</a>
[![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)  
This script shows the artboard name and size in the document.

![Show Artboard Name](images/showArtboardName.png)

### Usage
Just run this script.

> **Note**  
> The dimensional units depend on the ruler units.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="shuffleGradientColor">shuffleGradientColor</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)  
This script shuffles the gradient color.

![Shuffle Gradient Color](images/shuffleGradientColor.png)

### Usage
Select the path objects, and run this script.

> **Note**  
> Only a fill color. A stroke color is not supported.  
> For compound path objects, select them with direct selection tool.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="shuffleObjects">shuffleObjects</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script shuffles the objects.

![Shuffle Objects](images/shuffleObjects.png)

### Usage
Select the objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="sortArtboards">sortArtboards</a>
[![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)  
This script sorts the artboards in the Artboards panel.

![Sort Artboards](images/sortArtboards.png)

### Usage
Just run this script.

> **Note**  
> Only the Artboards panel. Artboards in the document are not sorted.

### Requirements
Illustrator CS5 or higher
<br><br>





# <a name="stepAndRepeat">stepAndRepeat</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)  
This script is equivalent to InDesign's Edit menu "Step and Repeat...".  

![Step and Repeat](images/stepandRepeat.png)

### Usage
1. Select the objects, and run this script.
2. If you want to create as a grid, check the create as a grid.
3. Enter the number of times to repeat.
4. Enter the offset values.

> **Note**  
> The unit of the offset value switches to match the unit of the ruler.

### Requirements
Illustrator CS4 or higher
<br><br>





# <a name="swapTextContents">swapTextContents</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script swap the text contents.

![Swap Text Contents](images/swapTextContents.png)

### Usage
Select two text objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="syncView">syncView</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
This script synchronizes the scale ratio and the position of the current work area for all documents.  

![Sync View](images/syncView.png)

### Usage
Just run this script.

> **Note**  
> Open at least two files.  

### Requirements
Illustrator CS or higher
<br><br>





# <a name="textAlign">textAlign_Center<br>textAlign_Left<br>textAlign_Right</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)  
This script changes the text alignment without moving the text position.  
Vertical text is also supported.

For example, textAlign_Center.js:
![Text Align](images/textAlign.png)

### Usage
Select the text objects, and run this script.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="unifyLayerColors">unifyLayerColors</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)  
This script unifies layer colors.

![Unify Layer Colors](images/unifyLayerColors.png)

### Usage
Select a target layer, and run this script.

> **Note**  
> Sublayers are also supported.

### Requirements
Illustrator CS or higher
<br><br>





# <a name="XmpFunctions">XmpFunctions</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)  
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
<br><br>





# License
All scripts are licensed under the MIT license.  
See the included LICENSE file for more details.  
