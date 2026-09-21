# Claude-Ui-Slimmer 設計書

## 目的

Claude Web版(claude.ai)のUIにおける以下2点の不満を解消するChrome/Edge拡張機能を作る。

1. 添付ファイルのサムネイル(四角)が大きく、出力内容が隠れる
2. 長文貼り付け時に入力欄が伸びすぎて出力が見えなくなる

## 機能要件

- 添付ファイルサムネイルのサイズを縮小する
- 入力欄の自動拡張を抑制する(最大高さを制限)
- ツールバーにピン留めしたアイコンをクリックするとポップアップが開き、上記のサイズをリアルタイムで調整できる

## 技術スタック

- Manifest V3 (Chrome / Edge共通)
- Vanilla JS + CSS(フレームワーク未使用、軽量重視)
- chrome.storage.sync による設定の永続化

## ディレクトリ構成(予定)

Claude-Ui-Slimmer/
├─ manifest.json
├─ src/
│ ├─ content.js
│ ├─ content.css
│ ├─ popup.html
│ ├─ popup.js
│ └─ popup.css
├─ icons/
├─ .vscode/
└─ .gitignore

## フェーズ一覧

- Phase 0: 環境準備
- Phase 1: 拡張機能の土台
- Phase 2: 添付ファイルサムネイル縮小
- Phase 3: 入力欄自動拡張の抑制
- Phase 4: ポップアップUI実装
- Phase 5: 設定の永続化とリアルタイム反映
- Phase 6: Edge動作確認・README整備
- Phase 7: 最終確認・push
