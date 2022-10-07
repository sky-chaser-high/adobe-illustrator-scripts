# Adobe Illustrator Scripts
Adobe Illustratorのスクリプト集です。

[![Download AllScripts.zip](https://img.shields.io/badge/Download-AllScripts.zip-blue)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/AllScripts.zip)

### Artboard [![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)
- [sortArtboards.js](#sortArtboards.js)：アートボードをソート（アートボードパネル内のみ）

### Color [![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)
- [createColorChart.js](#createColorChart.js)：カラーチャート作成
- [extractColorsFromGradient.js](#extractColorsFromGradient.js)：グラデーションのカラー分岐点から色を取り出す
- [generateGradientColor.js](#generateGradientColor.js)：グラデーションを生成
- [randomTextColor.js](#randomTextColor.js)：テキストの塗り色をランダムに変更
- [removeDeletedGlobalColor.js](#removeDeletedGlobalColor.js)：Deleted Global Color を削除
- [roundColorValue.js](#roundColorValue.js)：カラー数値を四捨五入
- [roundLocationOfGradientStop.js](#roundLocationOfGradientStop.js)：グラデーションのカラー分岐点、中間点の数値を四捨五入
- [shuffleGradientColor.js](#shuffleGradientColor.js)：グラデーションをシャッフル

### Layer [![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)
- [deleteHiddenLayers.js](#deleteHiddenLayers.js)：非表示レイヤーを削除
- [deleteLockedLayers.js](#deleteLockedLayers.js)：ロック状態のレイヤーを削除
- [deleteUnusedLayers.js](#deleteUnusedLayers.js)：未使用（空）のレイヤーを削除
- [invertLockedLayer.js](#invertLockedLayer.js)：ロック状態を反転
- [invertVisibleLayer.js](#invertVisibleLayer.js)：表示状態を反転

### Link [![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)
- [relinkFileExtension.js](#relinkFileExtension.js)：ファイル拡張子にリンクを再設定
- [relinkFileExtensionExtra.js](#relinkFileExtensionExtra.js)：ファイル拡張子にリンクを再設定（機能拡張版）
- [relinkToFolder.js](#relinkToFolder.js)：フォルダに再リンク
- [resetToFullScale.js](#resetToFullScale.js)：画像サイズを100%に戻す

### Path [![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)
- [closePath.js](#closePath.js)：パスを閉じる
- `New` [convertAllAnchorPointsToCorner.js](#convertAllAnchorPointsToCorner.js)：すべてのアンカーポイントをコーナーポイントに切り替え
- [createGridLines.js](#createGridLines.js)：グリッドラインを作成
- [disjoinPath.js](#disjoinPath.js)：パスを分解
- [measurePathItems.js](#measurePathItems.js)：パスの寸法を測る
- [removeColorInGuideObject.js](#removeColorInGuideObject.js)：ガイドオブジェクトの色を削除
- [shuffleObjects.js](#shuffleObjects.js)：オブジェクトをシャッフル
- `Update` [stepAndRepeat.js](#stepAndRepeat.js)：繰り返し複製

### Text [![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)
- [addNumericSeparators.js](#addNumericSeparators.js)：数字を3桁で区切る
- [copyLineDown.js](#copyLine)：行を下へコピー
- [copyLineUp.js](#copyLine)：行を上へコピー
- [createPageNumbers.js](#createPageNumbers.js)：ノンブル作成
- [highlightWord.js](#highlightWord.js)：指定した単語の塗り色を変更
- [insertLineAbove.js](#insertLine)：上に行を挿入
- [insertLineBelow.js](#insertLine)：下に行を挿入
- [moveLineDown.js](#moveLine)：行を下へ移動
- [moveLineUp.js](#moveLine)：行を上へ移動
- [swapTextContents.js](#swapTextContents.js)：文字列を交換
- [textAlign_Center.js](#textAlign)：文字列の位置を動かさずに中央揃え
- [textAlign_Left.js](#textAlign)：文字列の位置を動かさずに左揃え
- [textAlign_Right.js](#textAlign)：文字列の位置を動かさずに右揃え

### Utility [![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)
- [arrangeWindows.js](#arrangeWindows.js)：ウィンドウを並べて表示
- [closeAllDocuments.js](#closeAllDocuments.js)：すべてのファイルを閉じる
- [compareScale.js](#compareScale.js)：拡大・縮小率を表示
- [syncView.js](#syncView.js)：ウィンドウの表示を同期
- [XmpFunctions.js](#XmpFunctions.js)：XMP関数
<br><br><br>


### インストール
[![Download](https://img.shields.io/badge/Download-66595c)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) 
または [Releases](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest) から
ZIPファイルを[ダウンロード](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest)してください。  
解凍したスクリプトは好きな場所に置いて管理してください。  
ファイル > スクリプト > その他のスクリプト... ( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>F12</kbd> ) からスクリプトを選択して実行します。  

スクリプトの導入方法は下記のサイトで詳しく解説されています。参考にしてみてください。
- [Illustratorでスクリプトを使ってみよう［標準機能編］](https://hamfactory.net/illustrator/script-basic/)
- [Illustratorでスクリプトを使ってみよう［Mac+SPAi編］](https://hamfactory.net/illustrator/script-spai/)


### アプリケーション、プラグイン
下記のアプリケーション、プラグインを使用すると楽にスクリプトを実行できるようになります。
- [SPAi](https://tama-san.com/spai/)（Mac）
- [Sppy](https://sppy.stars.ne.jp/sppyai)（Windows）
- [Scripshon Trees](https://exchange.adobe.com/apps/cc/15873?pluginId=15873&mv=product&mv2=accc)（Mac / Windows 両対応）  


### ファイル名
スクリプトのファイル名は日本語に変更しても問題なく動作します。  
例えば、textAlign_Center.js を「テキスト中央揃え.js」のように変更しても大丈夫です。


### UI デザイン
UIのあるスクリプトはすべて日本語の表示になります。  
UIデザインツールには、[ScriptUI Dialog Builder (SDB)](https://scriptui.joonas.me/) を使用しました。  
ツールの詳細は [ScriptUI-Dialog-Builder-Joonas](https://github.com/joonaspaakko/ScriptUI-Dialog-Builder-Joonas) を参照してください。


### 注意事項
スクリプトを使い続けていると、まれに動作しなくなる場合があります。  
その場合は、Illustratorを再起動してから実行してみてください。
<br><br><br>





# <a name="addNumericSeparators.js">addNumericSeparators.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

数値をカンマで3桁区切りにします。

![Add Numeric Separators](images/addNumericSeparators.png)

#### 使用方法
テキストオブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="arrangeWindows.js">arrangeWindows.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

開いているすべてのウィンドウを分割して並べて表示します。

![Arrange Windows](images/arrangeWindows.png)

#### 使用方法
このスクリプトを実行するだけです。

#### 動作条件
Illustrator CS6以降





# <a name="closeAllDocuments.js">closeAllDocuments.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

すべてのファイルを閉じます。  
編集中のファイルがある場合は、保存してから閉じるかを選択します。

#### 使用方法
このスクリプトを実行するだけです。  

#### 注意事項
バージョン2021からファイルメニューに実装されています。

#### 動作条件
Illustrator CS4以降





# <a name="closePath.js">closePath.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

開いているパスを閉じます。

![Close Path](images/closePath.png)

#### 使用方法
パスオブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="compareScale.js">compareScale.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

2つのオブジェクトを比較して拡大・縮小率を表示します。

![Compare Scale](images/compareScale.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
2つのオブジェクトを選択してスクリプトを実行します。

#### 注意事項
寸法の単位はルーラー単位により変わります。

#### 動作条件
Illustrator CS以降





# <a name="convertAllAnchorPointsToCorner.js">convertAllAnchorPointsToCorner.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

すべてのアンカーポイントをコーナーポイントに切り替えます。  
コントロールパネルの機能ではアンカーポイントを選択しなければなりませんが、このスクリプトではオブジェクト全体を選択します。

![Convert All Anchor Points To Corner](images/convertAllAnchorPointsToCorner.png)

#### 使用方法
選択ツールでパスオブジェクト全体を選択してスクリプトを実行します。

#### 注意事項
ダイレクト選択ツールでアンカーポイントを選択する必要はありません。

#### 動作条件
Illustrator CS以降





# <a name="copyLine">copyLineDown.js<br>copyLineUp.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

Visual Studio Code の「行を下へコピー」( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↓</kbd> )、
「行を上へコピー」( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑</kbd> )と同様のことができます。  
[Keyboard Maestro](https://www.keyboardmaestro.com/main/)や、[SPAi](https://tama-san.com/spai/)などでショートカットを割り当てると、より一層Visual Studio Codeの操作感が出せると思います。  
ポイント文字、エリア内文字のどちらにも対応しています。

![Vscode Copy Line](images/vscode_copyLine.png)

例 copyLineDown.js:
![Copy Line](images/copyLine.png)

#### 使用方法
コピーしたい行にカーソルを合わせてスクリプトを実行します。  
行を選択する必要はありません。

#### 注意事項
コピーできるのは 1行のみです。複数行には対応していません。  
copyLineDown.js で最終行をコピーする場合は、バグを回避するために空行を追加します。  
バージョン2020以前の場合は、スクリプトを実行するとキーボードが反応しなくなります。  
テキストを編集する場合はマウスでテキストをクリックしてください。

#### 動作条件
Illustrator CC 2018以降





# <a name="createColorChart.js">createColorChart.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

カラーチャートを作成します。

![Create Color Chart](images/createColorChart.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. スクリプトを実行します。
2. カラーモード「CMYK」または「RGB」を選択します。  
   パスオブジェクトを選択している場合は、塗りの値が初期値として使用されます。
3. 上下、左右で増減させたい色を選択します。
4. 増減値を入力します。
5. アートボードサイズ、カラーチップサイズ、単位を設定します。

#### 注意事項
CMYKの場合、K値の増減はできません。

#### 動作条件
Illustrator CS4以降





# <a name="createGridLines.js">createGridLines.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

アートボードにグリッドを作成します。

![Create Grid Lines](images/createGridLines.png)

#### 使用方法
このスクリプトを実行するだけです。

#### 注意事項
グリッドの間隔は環境設定のガイド・グリッド項目の設定に依存します。

#### 動作条件
Illustrator CS以降





# <a name="createPageNumbers.js">createPageNumbers.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

InDesignの書式メニュー > 特殊文字を挿入 > マーカー > 現在のページ番号 に相当します。  
アートボードの指定した位置にノンブルを配置します。

![Create Page Numbers](images/createPageNumbers.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. スクリプトを実行します。
2. 各項目を設定します。
   - `位置` ノンブルの表示位置。
   - `見開き` チェックを入れると見開きページに対応します。
   - `開始ページ番号` 始まりの番号を指定します。
   - `セクションプレフィックス` ノンブルの前に文字列を追加します。見開きページの場合は、後ろに追加します。
   - `フォントサイズ` ノンブルのフォントサイズ。
   - `マージン` アートボードからの距離を指定します。現在のルーラー設定で単位が切り替わります。

#### 注意事項
ノンブルに指定できるスタイルは数字のみです。  
アートボード順にノンブルを割り当てます。

#### 動作条件
Illustrator CS4以降





# <a name="deleteHiddenLayers.js">deleteHiddenLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

非表示のレイヤーを削除します。

![Delete Hidden Layers](images/deleteHiddenLayers.png)

#### 使用方法
このスクリプトを実行するだけです。  

#### 注意事項
バージョン2021からレイヤーパネルメニューに実装されています。

#### 動作条件
Illustrator CS以降





# <a name="deleteLockedLayers.js">deleteLockedLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

ロックしているレイヤーを削除します。

![Delete Locked Layers](images/deleteLockedLayers.png)

#### 使用方法
このスクリプトを実行するだけです。  

#### 動作条件
Illustrator CS以降





# <a name="deleteUnusedLayers.js">deleteUnusedLayers.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

未使用（空）のレイヤーを削除します。サブレイヤーも対象です。

![Delete Unused Layers](images/deleteUnusedLayers.png)

#### 使用方法
このスクリプトを実行するだけです。  
未使用レイヤーを選択する必要はありません。

#### 動作条件
Illustrator CS以降





# <a name="disjoinPath.js">disjoinPath.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

アンカーポイントごとにパスオブジェクトを分割します。

![Disjoin Path](images/disjoinPath.png)

#### 使用方法
パスオブジェクトを選択してスクリプトを実行します。

#### 注意事項
元のパスオブジェクトは削除されます。

#### 動作条件
Illustrator CS以降





# <a name="extractColorsFromGradient.js">extractColorsFromGradient.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

グラデーションのカラー分岐点からそれぞれ色を取り出してスウォッチに追加します。

![Extract Colors From Gradient](images/extractColorsFromGradient.png)

#### 使用方法
パスオブジェクトまたはスウォッチから色を選択してスクリプトを実行します。

#### 注意事項
パスオブジェクトを優先します。  
スウォッチから色を取り出したい場合はパスオブジェクトの選択を解除してください。  
テキスト、線の色には対応していません。

#### 動作条件
Illustrator CS以降





# <a name="generateGradientColor.js">generateGradientColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

オブジェクトの塗り色またはスウォッチからグラデーションを生成します。

![Generate Gradient Color](images/generateGradientColor.png)

#### 使用方法
パスオブジェクトまたはスウォッチからグラデーションを選択してスクリプトを実行します。

#### 注意事項
パスオブジェクトを優先します。  
スウォッチからグラデーションを生成したい場合はパスオブジェクトの選択を解除してください。  
テキスト、線の色には対応していません。

#### 動作条件
Illustrator CS4以降





# <a name="highlightWord.js">highlightWord.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

入力した単語の塗り色を変更します。CMYK、RGB のどちらにも対応しています。

![Highlight Word](images/highlightWord.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. テキストオブジェクトを選択してスクリプトを実行します。
2. 単語を入力します。
3. 必要に応じて色を設定します。

#### 動作条件
Illustrator CS4以降





# <a name="insertLine">insertLineAbove.js<br>insertLineBelow.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

Visual Studio Code の「上に行を挿入」( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> )、
「下に行を挿入」( <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> )と同様のことができます。  
[Keyboard Maestro](https://www.keyboardmaestro.com/main/)や、[SPAi](https://tama-san.com/spai/)などでショートカットを割り当てると、より一層Visual Studio Codeの操作感が出せると思います。  
ポイント文字、エリア内文字のどちらにも対応しています。

例 insertLineBelow.js:
![Insert Line](images/insertLine.png)

#### 使用方法
行を追加したい位置の下または上の行にカーソルを合わせてスクリプトを実行します。  
行を選択する必要はありません。

#### 注意事項
バージョン2020以前の場合は、スクリプトを実行するとキーボードが反応しなくなります。  
テキストを編集する場合はマウスでテキストをクリックしてください。

#### 動作条件
Illustrator CC 2018以降





# <a name="invertLockedLayer.js">invertLockedLayer.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

レイヤーの表示／非表示を切り替えます。

![Invert Locked Layer](images/invertLockedLayer.png)

#### 使用方法
このスクリプトを実行するだけです。  

#### 動作条件
Illustrator CS以降





# <a name="invertVisibleLayer.js">invertVisibleLayer.js</a>
[![Download Layer.zip](https://img.shields.io/badge/Download-Layer.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Layer.zip)

レイヤーのロック状態を切り替えます。

![Invert Visible Layer](images/invertVisibleLayer.png)

#### 使用方法
このスクリプトを実行するだけです。  

#### 動作条件
Illustrator CS以降





# <a name="measurePathItems.js">measurePathItems.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

パスオブジェクトの2点間のアンカーポイントの距離を測定します。

![Measure PathItems](images/measurePathItems.png)

#### 使用方法
パスオブジェクトを選択してスクリプトを実行します。

#### 特徴
パスオブジェクトごとに測定値をグループ化し色を付けます。  
測定値の単位は、ドキュメントのルーラ設定により切り替わります。

#### 注意事項
オブジェクトが複雑な形状や小さい場合、測定値が重なって表示されることがあります。  
曲線には対応していません。

#### 動作条件
Illustrator CS4以降





# <a name="moveLine">moveLineDown.js<br>moveLineUp.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

Visual Studio Code の「行を下へ移動」( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↓</kbd> )、
「行を上へ移動」( <kbd>Option</kbd> / <kbd>Alt</kbd> + <kbd>↑</kbd> )と同様のことができます。  
[Keyboard Maestro](https://www.keyboardmaestro.com/main/)や、[SPAi](https://tama-san.com/spai/)などでショートカットを割り当てると、より一層Visual Studio Codeの操作感が出せると思います。  
ポイント文字、エリア内文字のどちらにも対応しています。

![Vscode Move Line](images/vscode_moveLine.png)

例 moveLineDown.js:
![Move Line](images/moveLine.png)

#### 使用方法
移動したい行にカーソルを合わせてスクリプトを実行します。  
行を選択する必要はありません。

#### 注意事項
移動できるのは 1行のみです。複数行には対応していません。  
moveLineUp.js で最終行を移動する場合は、バグを回避するために空行を追加します。  
バージョン2020以前の場合は、スクリプトを実行するとキーボードが反応しなくなります。  
テキストを編集する場合はマウスでテキストをクリックしてください。

#### 動作条件
Illustrator CC 2018以降





# <a name="randomTextColor.js">randomTextColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

単語または、1文字、1文ごとにランダムに色を適用します。CMYK、RGB のどちらにも対応しています。

![Random Text Color](images/randomTextColor.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. テキストオブジェクトを選択してスクリプトを実行します。
2. スライダーで各色のしきい値を指定します。
3. ランダムボタンをクリックすると、しきい値に応じた色が割り当てられます。

#### 注意事項
文字数が多いと変換に時間がかかります。  
英文の場合、ピリオドやカンマなど一部適用されない文字があります。

#### 動作条件
Illustrator CS4以降





# <a name="relinkFileExtension.js">relinkFileExtension.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

InDesignのリンクパネルメニュー > ファイル拡張子にリンクを再設定... に相当します。

![InDesign's Relink File Extension](images/InDesign_Relink_File_Extension.png)

#### 使用方法
1. 置き換えたいリンク画像を選択しスクリプトを実行します。  
   リンク画像を選択しない場合は、ドキュメント内のすべてのリンク画像が対象となります。
2. 表示されたプロンプトに置き換えるファイルの拡張子を入力します。

![Relink File Extension](images/relinkFileExtension.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 注意事項
再配置するリンク画像は、元のリンク画像と同じフォルダに置いてください。  
画像を選択する場合は、リンクパネル内の画像ではなく、アートボード上の画像を選択してください。  
リンク切れ画像は置き換えることはできません。  
埋め込み画像も対象外です。

#### 動作条件
Illustrator CS4以降





# <a name="relinkFileExtensionExtra.js">relinkFileExtensionExtra.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

このスクリプトは、relinkFileExtension.js を機能拡張したものです。

![Relink File Extension Extra](images/relinkFileExtensionExtra.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. 置き換えたいリンク画像を選択しスクリプトを実行します。  
   リンク画像を選択しない場合は、ドキュメント内のすべてのリンク画像が対象となります。
2. 「文字列を置換する」または「文字列を追加する」を選択します。  
   「文字列を置換する」の場合は、正規表現が使用できます。  
   「文字列を追加する」の場合は、元のファイル名の先頭か末尾またはその両方に追加する文字列を入力します。
3. 置き換えるファイルの拡張子を入力します。  
   拡張子を入力しない場合は、元のファイルの拡張子が使用されます。

#### 注意事項
再配置するリンク画像は、元のリンク画像と同じフォルダに置いてください。  
画像を選択する場合は、リンクパネル内の画像ではなく、アートボード上の画像を選択してください。  
リンク切れ画像は置き換えることはできません。  
埋め込み画像も対象外です。

#### 動作条件
Illustrator CS4以降





# <a name="relinkToFolder.js">relinkToFolder.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

指定したフォルダーにある同名の画像と置き換えます。  
InDesignのリンクパネルメニュー > フォルダに再リンク... に相当します。

![InDesign's Relink To Folder](images/InDesign_Relink_To_Folder.png)

#### 使用方法
1. 置き換えたいリンク画像を選択しスクリプトを実行します。  
   リンク画像を選択しない場合は、ドキュメント内のすべてのリンク画像が対象となります。
2. 表示されたダイアログからフォルダを選択します。

#### 注意事項
画像を選択する場合は、リンクパネル内の画像ではなく、アートボード上の画像を選択してください。  
リンク切れ画像は置き換えることはできません。  
埋め込み画像も対象外です。

#### 動作条件
Illustrator CS4以降





# <a name="removeColorInGuideObject.js">removeColorInGuideObject.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

すべてのガイドオブジェクトの塗りと線の色を削除します。

![Remove Color In Guide Object](images/removeColorInGuideObject.png)

#### 使用方法
このスクリプトを実行するだけです。  
ガイドオブジェクトを選択する必要はありません。

#### 注意事項
すべてのレイヤーを表示してロックを解除します。  
<kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>3</kbd> で非表示のガイドオブジェクトは対象になりません。  
アピアランスで塗りや線の色を追加している場合は、削除できない場合があります。

#### 動作条件
Illustrator CS6以降





# <a name="removeDeletedGlobalColor.js">removeDeletedGlobalColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

分版プレビューパネルに表示される Deleted Global Color を削除します。

![Remove Deleted Global Color](images/removeDeletedGlobalColor.png)

#### 使用方法
このスクリプトを実行するだけです。  
オブジェクトを選択する必要はありません。

#### 注意事項
まれに削除できない場合があります。  
削除後にファイルを保存して再度開くと復活する場合があります。

#### 動作条件
Illustrator CS以降





# <a name="resetToFullScale.js">resetToFullScale.js</a>
[![Download Link.zip](https://img.shields.io/badge/Download-Link.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Link.zip)

リンク画像のスケールを100%に、回転角度を0°に戻します。  
埋め込み画像にも対応しています。

![Reset To Full Scale](images/resetToFullScale.png)

#### 使用方法
リンク画像または埋め込み画像を選択してスクリプトを実行します。

#### 動作条件
Illustrator CS6以降





# <a name="roundColorValue.js">roundColorValue.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

カラーの数値を四捨五入します。  
塗り、線のどちらにも対応しています。

![Round Color Value](images/roundColorValue.png)

#### 使用方法
オブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="roundLocationOfGradientStop.js">roundLocationOfGradientStop.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

グラデーションのカラー分岐点、中間点の数値を四捨五入します。  
塗り、線のどちらにも対応しています。

![Round Location Of Gradient Stops](images/roundLocationOfGradientStops.png)

#### 使用方法
オブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="shuffleGradientColor.js">shuffleGradientColor.js</a>
[![Download Color.zip](https://img.shields.io/badge/Download-Color.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Color.zip)

グラデーションをシャッフルします。

![Shuffle Gradient Color](images/shuffleGradientColor.png)

#### 使用方法
パスオブジェクトを選択してスクリプトを実行します。

#### 注意事項
線のカラーには対応していません。  
複合パスの場合は、ダイレクト選択ツールでパスを選択してください。

#### 動作条件
Illustrator CS以降





# <a name="shuffleObjects.js">shuffleObjects.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

選択したオブジェクトをシャッフルします。

![Shuffle Objects](images/shuffleObjects.png)

#### 使用方法
オブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="sortArtboards.js">sortArtboards.js</a>
[![Download Artboard.zip](https://img.shields.io/badge/Download-Artboard.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Artboard.zip)

アートボードパネル内のアートボード名を昇順でソートします。

![Sort Artboards](images/sortArtboards.png)

#### 使用方法
このスクリプトを実行するだけです。  

#### 注意事項
ドキュメント内のアートボードはソートしません。（位置はそのまま）

#### 動作条件
Illustrator CS5以降





# <a name="stepAndRepeat.js">stepAndRepeat.js</a>
[![Download Path.zip](https://img.shields.io/badge/Download-Path.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Path.zip)

InDesignの編集メニュー > 繰り返し複製... に相当します。

![Step and Repeat](images/stepAndRepeat.png)
<div style="text-align: right;">日本語版では、UIは日本語で表示します。</div>

#### 使用方法
1. オブジェクトを選択してスクリプトを実行します。
2. グリッド状にしたい場合は、「グリッドとして作成」にチェックを入れてください。
3. 繰り返しの場合はカウントに繰り返す回数を入力します。  
   グリッドの場合は行・段数にそれぞれ繰り返す回数を入力します。
4. オフセット値（オブジェクトの間隔）を入力します。

#### 注意事項
オフセット値の単位は、ルーラー単位により切り替わります。

#### 動作条件
Illustrator CS4以降





# <a name="swapTextContents.js">swapTextContents.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

2つの文字列の内容を交換します。

![Swap Text Contents](images/swapTextContents.png)

#### 使用方法
2つのテキストオブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="syncView.js">syncView.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

アクティブなファイルのアートボードの表示スケールと表示位置に開いているすべてのファイルを同期させます。

![Sync View](images/syncView.png)

#### 使用方法
このスクリプトを実行するだけです。  
オブジェクトを選択する必要はありません。

#### 注意事項
2ファイル以上開いてください。  

#### 動作条件
Illustrator CS以降  





# <a name="textAlign">textAlign_Center.js<br>textAlign_Left.js<br>textAlign_Right.js</a>
[![Download Text.zip](https://img.shields.io/badge/Download-Text.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Text.zip)

テキストの位置を移動させずにテキスト揃えを変更します。  
縦書きにも対応しています。

例 textAlign_Center.js:
![Text Align](images/textAlign.png)

#### 使用方法
テキストオブジェクトを選択してスクリプトを実行します。

#### 動作条件
Illustrator CS以降





# <a name="XmpFunctions.js">XmpFunctions.js</a>
[![Download Utility.zip](https://img.shields.io/badge/Download-Utility.zip-e60012)](https://github.com/sky-chaser-high/adobe-illustrator-scripts/releases/latest/download/Utility.zip)

XMPから取得できるフォント・カラー・リンク画像・更新履歴の情報を関数としてまとめました。  
XMPの詳しい内容については、[Adobeのサイト](https://www.adobe.io/xmp/docs/)を参照してください。

#### 使用方法
このスクリプトファイルをインクルードするか、関数をコピー＆ペーストして使用してください。

```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var fonts = xmpGetFonts(app.activeDocument.fullName);
```
また、リンク画像にも使用できます。
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var src = app.activeDocument.placedItems[0].file;
var history = xmpGetHistory(src);
```

#### 関数
- [xmpGetFonts(src)](#xmpGetFonts(src))
- [xmpGetHistory(src)](#xmpGetHistory(src))
- [xmpGetLinkedFiles(src)](#xmpGetLinkedFiles(src))
- [xmpGetPlateNames(src)](#xmpGetPlateNames(src))
- [xmpGetSwatches(src)](#xmpGetSwatches(src))

### <a name="xmpGetFonts(src)">xmpGetFonts(src)</a>
ドキュメント内で使用しているフォント情報を取得します。

**引数**: `src` `<File>`  
**返り値**: `Array<Object>`  
- `composite` `<boolean>` 合成フォントの場合、true。
- `face` `<string>` フォントフェイス。
- `family` `<string>` フォントファミリー。
- `filename` `<string>` フォントファイル名。
- `name` `<string>` フォントのポストスクリプト名。
- `type` `<string>` TrueType、Type1、OpenTypeなどのフォントタイプ。
- `version` `<string>` バージョン。

##### 例
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var fonts = xmpGetFonts(app.activeDocument.fullName);
alert(fonts[0].face);
```

### <a name="xmpGetHistory(src)">xmpGetHistory(src)</a>
更新履歴を取得します。

**引数**: `src` `<File>`  
**返り値**: `Array<Object>`  
- `action` `<string>` 発生したアクション。
- `parameter` `<string> | null` アクションの追加説明。
- `software` `<string> | null` アクションを実行したアプリケーション。
- `when` `<Date> | null` アクションが発生したときの時刻。

##### 例
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var history = xmpGetHistory(app.activeDocument.fullName);
var date = history[0].when;
alert(date.getFullYear());
```

### <a name="xmpGetLinkedFiles(src)">xmpGetLinkedFiles(src)</a>
ドキュメント内で使用しているリンク画像を取得します。

**引数**: `src` `<File>`  
**返り値**: `Array<Object>`  
- `exists` `<boolean>` ファイルの有無。
- `filePath` `<string>` リソースのファイルパスまたはURL。

##### 例
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var files = xmpGetLinkedFiles(app.activeDocument.fullName);
alert(files[0].filePath);
```

### <a name="xmpGetPlateNames(src)">xmpGetPlateNames(src)</a>
ドキュメント内で使用している色名を取得します。

**引数**: `src` `<File>`  
**返り値**: `Array<string>` 印刷に必要な色名。  

##### 例
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var platenames = xmpGetPlateNames(app.activeDocument.fullName);
alert(platenames[0]);
```

### <a name="xmpGetSwatches(src)">xmpGetSwatches(src)</a>
ドキュメント内で使用しているスウォッチを取得します。

**引数**: `src` `<File>`  
**返り値**: `Array<Object>`  
- `colorant` `<Object>` 色の値。
    - `cyan` `<number>` カラーモードがCMYKのときのシアンの値。範囲: 0〜100。
    - `magenta` `<number>` カラーモードがCMYKのときのマゼンタの値。範囲: 0〜100。
    - `yellow` `<number>` カラーモードがCMYKのときのイエローの値。範囲: 0〜100。
    - `black` `<number>` カラーモードがCMYKのときのブラックの値。範囲: 0〜100。
    - `gray` `<number>` カラーモードがグレースケールのときの値。範囲: 0〜255。
    - `l` `<number>` カラーモードがLABのときのLの値。範囲: 0〜100。
    - `a` `<number>` カラーモードがLABのときのAの値。範囲: -128〜127。
    - `b` `<number>` カラーモードがLABのときのBの値。範囲: -128〜127。
    - `red` `<number>` カラーモードがRGBのときのレッドの値。範囲: 0〜255。
    - `green` `<number>` カラーモードがRGBのときのグリーンの値。範囲: 0〜255。
    - `blue` `<number>` カラーモードがRGBのときのブルーの値。範囲: 0〜255。
- `mode` `<string>` カラーモード。
- `name` `<string>` スウォッチ名。
- `swatch` `<swatch> | null` スウォッチオブジェクト。
- `tint` `<number>` 色合い。範囲: 0〜100。
- `type` `<string>` スウォッチのカラータイプ。 `PROCESS` または `SPOT`。

##### 例
```javascript
// @include '/Path1/Path2/XmpFunctions.js'
var swatches = xmpGetSwatches(app.activeDocument.fullName);
alert(swatches[0].colorant.cyan);
```


#### 動作条件
Illustrator CS以降





# ライセンス
MITライセンスのもとで公開しています。  
詳しくはLICENSEファイルをご覧ください。
