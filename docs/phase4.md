# Phase 4: ポップアップUI実装

## やること
- popup.html / popup.css / popup.js を作成
  - スライダーまたは数値入力で「添付ファイルサイズ」「入力欄最大高さ」を調整
- manifest.json の action.default_popup を確認・修正(既存ファイルはcatで確認してから編集)
- popup.js から content.js へ chrome.runtime.sendMessage でリアルタイムに値を送信し、CSS変数を即時反映

## 次フェーズへの引き継ぎ予定
Phase 5で設定値をchrome.storageに保存し、再訪問時も設定が保持されるようにする。
