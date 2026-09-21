# Claude-Ui-Slimmer 設計書

## 目的
Claude Web版(claude.ai)のUIにおける以下2点の不満を解消するChrome/Edge拡張機能を作る。
1. チャット欄に長文を貼り付けると入力欄が大きく伸び、出力内容が見えなくなる
2. ファイル添付時のサムネイル(四角)が大きすぎて、出力内容が見えなくなる

## 機能要件
- 添付ファイルサムネイルのサイズを縮小する
- 入力欄の自動拡張を抑制する(最大高さを制限し、それ以上はスクロール)
- ツールバーにピン留めした拡張機能アイコンをクリックすると設定用ポップアップが開き、
  上記2つのサイズをリアルタイム(即時反映)で調整できる

## 技術スタック
- Manifest V3(Chrome / Edge共通)
- Vanilla JS + CSS(フレームワーク未使用、軽量重視)
- chrome.storage.sync による設定の永続化

## リポジトリ / 作業場所
- GitHub: https://github.com/29kiyo/Claude-Ui-Slimmer
- ローカル作業場所: `~/vscode_clone/Claude-Ui-Slimmer`
- 開発環境: VSCode + git bash(.vscode/settings.jsonでgit bashをデフォルト端末化済み)

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
├─ docs/ ← .gitignoreで除外、GitHubには含めない
└─ .gitignore


## 開発ルール(必読・全フェーズ共通)
1. **コマンド出力形式**: ファイル作成・編集・docs更新など、あらゆる作業はgit bashでそのまま実行できるコマンド(`cat > file << 'EOF' ... EOF` 等)として提示する。手動でのコピペ編集指示は行わない。
2. **作業ディレクトリの明示**: コマンドを出す際は必ず `cd ~/vscode_clone/Claude-Ui-Slimmer` を先頭に置き、作業場所を明示する。
3. **既存コード確認**: 各フェーズで既存ファイルを変更する場合、変更前に必ず `grep` や `cat` で該当箇所を確認してから編集する。調査結果は要点をまとめて提示する(冗長な全文貼り付けはしない)。
4. **docsの扱い**:
   - `docs/` はリポジトリ直下に `.md` を直接配置し、子ディレクトリは作らない
   - `.gitignore` に `docs/` を追加し、GitHubには含めない
   - 各フェーズ終盤で `docs/development_status.md` を更新する
   - 更新後は `cat docs/development_status.md` 等で内容を確認するコマンドを出す(docsはgit管理外のため `git diff` は使わない)
   - フェーズ間の引き継ぎ内容はdocsに書かず、チャット上で簡潔にまとめて表示する
5. **コミット/プッシュ運用**:
   - 各フェーズの区切りで `git add` / `git commit` の指示を出す
   - `git push` は全フェーズ完了後、最後に1回だけ行う
6. **実行コマンドの表示on/off設定**: ビルド・デバッグ用スクリプトを用意する際は、実行中のコマンドをログに表示するかどうかを切り替えられる設定(環境変数や設定ファイルでのトグル)を実装する(Phase 6で対応予定)。

## フェーズ一覧
- Phase 0: 環境準備 ✅完了
- Phase 1: 拡張機能の土台(manifest.json、content script注入)
- Phase 2: 添付ファイルサムネイル縮小
- Phase 3: 入力欄自動拡張の抑制
- Phase 4: ポップアップUI実装
- Phase 5: 設定の永続化とリアルタイム反映
- Phase 6: Edge動作確認・README整備・実行コマンド表示on/off実装
- Phase 7: 最終確認・docs最終更新・push

詳細設計は各 `docs/phaseN.md` を参照。
