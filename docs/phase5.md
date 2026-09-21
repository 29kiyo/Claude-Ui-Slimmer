# Phase 5: 設定の永続化とリアルタイム反映

## やること
- chrome.storage.sync に初期値を定義
- content.js: chrome.storage.onChanged を監視し、CSS変数を動的更新
- popup.js: ポップアップを開いたタイミングで現在の保存値を読み込みUIに反映
- 既存の content.js / popup.js を cat で確認してから機能追加

## 次フェーズへの引き継ぎ予定
Phase 6でEdgeでの動作確認とREADME整備、実行コマンド表示on/off設定を実装。
