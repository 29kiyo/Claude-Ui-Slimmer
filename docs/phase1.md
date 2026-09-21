# Phase 1: 拡張機能の土台

## やること
- manifest.json(Manifest V3)を作成
  - name, version, description
  - permissions: ["storage"]
  - action.default_popup: popup.html(Phase 4で使用、先に定義だけしておく)
  - content_scripts: matches ["https://claude.ai/*"], js: ["src/content.js"], css: ["src/content.css"]
  - icons: icons/フォルダの仮アイコンを指定
- src/content.js を作成(動作確認用にconsole.logのみ)
- src/content.css を作成(空ファイルでOK)
- icons/ フォルダに仮アイコン(16/48/128px)を配置
- chrome://extensions で「パッケージ化されていない拡張機能を読み込む」して動作確認
- 既存ファイル変更なし(新規作成のみ)のため、事前grep調査は不要

## 次フェーズへの引き継ぎ予定
Phase 2でclaude.aiの添付ファイルサムネイルのDOM構造を調査し、content.cssにサイズ縮小ルールを追加する。
