# テンプレートプレビュー自動生成

## 概要

`public/templates/` 配下が更新されたときに、GitHub Actions で Playwright を実行し、テンプレートのプレビュー画像を自動生成する。

生成画像は `public/template_images/` 配下に保存し、差分がある場合は bot が `main` へコミットする。

## 対象ファイル

- ワークフロー: `.github/workflows/template_preview.yml`
- 生成スクリプト: `scripts/generate-template-previews.mjs`
- テンプレート: `public/templates/<template_name>/`
- 出力先: `public/template_images/`

## 実行トリガー

- `main` への `push`
- `workflow_dispatch`（手動実行）

`push` 時は以下のパスに変更がある場合のみ実行される。

- `public/templates/**`
- `scripts/generate-template-previews.mjs`
- `.github/workflows/template_preview.yml`

## 生成される画像

1テンプレートにつき、以下3種類の画像を生成する。

- PC: `_pc.jpg`（width: 1000）
- tablet: `_tb.jpg`（width: 768）
- smartphone: `_sp.jpg`（width: 320）

高さはフルページ撮影のため固定値で初期化しつつ、`fullPage: true` で縦方向全体を保存する。

## 出力構成

例: `public/templates/01.holon/` の更新、または未生成時

- `public/template_images/01.holon_pc.jpg`
- `public/template_images/01.holon_tb.jpg`
- `public/template_images/01.holon_sp.jpg`

## 処理フロー

1. ワークフロー起動
2. 差分の `public/templates/**` を検出
3. 全テンプレートを走査して未生成テンプレートを抽出
4. `public` をローカルHTTPサーバーで配信
5. Playwright(Chromium)で対象テンプレートをレンダリング
6. 3デバイス幅でフルページスクリーンショット生成
7. `public/template_images` 配下に保存
8. 画像差分がある場合のみ commit/push

## ローカル確認の考え方

現在の運用では、画像生成は GitHub Actions 側で行う。

ローカルで最新画像を確認したい場合は次の順で行う。

1. テンプレートHTMLを `push`
2. Actions完了を待つ
3. `git pull origin main`

これで bot が追加した画像をローカルに取り込める。

## 注意点

- `main` ブランチ保護で bot の push が禁止されている場合、画像コミットが失敗する。
- サブモジュールや外部リソース依存が強いテンプレートは、レンダリング結果がローカルブラウザと完全一致しないことがある。
- キャッシュ影響を抑えるため、簡易サーバーは `Cache-Control: no-store` を返す。

## 今後の拡張案

- Viewer実装時に、テンプレートIDごとに `pc/tablet/smartphone` を切り替えるUIを追加
- 画像の命名規則を `yyyymmdd` 付きにして履歴運用
- PR時にも生成したい場合は `pull_request` トリガーを追加
