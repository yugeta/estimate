# テンプレートプレビュー自動生成

## 概要

`public/templates/*/index.html` が更新されたときに、GitHub Actions で Playwright を実行し、テンプレートのプレビュー画像を自動生成する。

生成画像は `public/template/images/` 配下に保存し、差分がある場合は bot が `main` へコミットする。

## 対象ファイル

- ワークフロー: `.github/workflows/template_preview.yml`
- 生成スクリプト: `scripts/generate-template-previews.mjs`
- テンプレートHTML: `public/templates/*/index.html`
- 出力先: `public/template/images/<template_name>/`

## 実行トリガー

- `main` への `push`
- `workflow_dispatch`（手動実行）

`push` 時は以下のパスに変更がある場合のみ実行される。

- `public/templates/**/index.html`
- `scripts/generate-template-previews.mjs`
- `.github/workflows/template_preview.yml`

## 生成される画像

1テンプレートにつき、以下3種類の画像を生成する。

- PC: `pc.png`（width: 1000）
- tablet: `tablet.png`（width: 768）
- smartphone: `smartphone.png`（width: 320）

高さはフルページ撮影のため固定値で初期化しつつ、`fullPage: true` で縦方向全体を保存する。

## 出力構成

例: `public/templates/01.holon/index.html` が更新された場合

- `public/template/images/01.holon/pc.png`
- `public/template/images/01.holon/tablet.png`
- `public/template/images/01.holon/smartphone.png`

## 処理フロー

1. ワークフロー起動
2. 差分の `public/templates/**/index.html` を検出
3. `public` をローカルHTTPサーバーで配信
4. Playwright(Chromium)で対象テンプレートをレンダリング
5. 3デバイス幅でフルページスクリーンショット生成
6. `public/template/images` 配下に保存
7. 画像差分がある場合のみ commit/push

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
