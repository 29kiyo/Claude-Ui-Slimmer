# Phase 2: 添付ファイルサムネイル縮小

## やること
- claude.aiで実際にファイルを添付し、DevTools(Edge DevTools拡張)でサムネイル要素のクラス名/構造を調査
- 調査結果をもとに content.css にサイズ縮小ルールを追加
  - CSS変数(--cus-attachment-size 等)を用意し、JSから動的に変更できる形にする
- 変更前に既存の content.js / content.css を cat で確認してから追記

## 次フェーズへの引き継ぎ予定
Phase 3で入力欄(textarea/contenteditable)の自動拡張抑制に着手。
