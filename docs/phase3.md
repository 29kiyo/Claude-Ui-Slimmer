# Phase 3: 入力欄自動拡張の抑制

## やること
- 入力欄要素のDOM構造を調査(textareaかcontenteditable divかを確認)
- content.css に max-height と overflow-y: auto を設定するルールを追加
  - CSS変数(--cus-input-max-height 等)を用意
- 既存の content.css を cat で確認してから追記(Phase 2の内容と競合しないか確認)

## 次フェーズへの引き継ぎ予定
Phase 4でポップアップUIを実装し、CSS変数をユーザーが操作できるようにする。
