# システム構成

- データベースは `MySQL 8`

# ディレクトリ構成

- バックエンド: `backend/go`
  - エントリポイント: `go/cmd/server/main.go`
  - マイグレーションファイル: `go/internal/common/db/migration`
  - システム共通のモデル: `go/internal/domain`
  - API: `go/internal` の下にモデル単位でディレクトリを作成する
  - エラーコード: `go/internal/common/errors/errors.go`
- フロントエンド: `frontend`
  - ログイン: `app/login`
  - 管理画面: `app/admin`
  - 共通機能（一般ユーザー・管理者共通）: `app/(main)` の下に機能ごとのディレクトリを作成
  - ページで使う機能別コンポーネント: `app/features`
  - API 共通処理: `lib/api`
  - 共通 UI コンポーネント: `components/ui`
  - サイドメニュー: `app/(main)/layout.tsx`, `app/admin/layout.tsx` にメニューを追加する

# コーディングルール

- バックエンド
  - `controller` / `service` / `repository` を分離して作成する
  - `dto` を作成する（入力/出力を明確にする）
  - エラーは `errors.go` に定義して使う（例: `go/internal/common/errors/errors.go`）
- フロントエンド
  - `as` を使った型アサーションは可能な限り避ける
    - NG: `const x = value as Foo`
    - OK: `const x: Foo = value` または 型判定関数を使う `if (isFoo(value)) { const x = value }`
  - 即時実行関数（IIFE）は使用しない
  - 型が自動推論できる場合は明示しない（例: `const n = 1` に `: number` を付けない）
  - データ取得はカスタムフックで行う（例: `useCustomers()`）
  - `page.tsx` には UI やイベントハンドラを直接書かず、エントリコンポーネントに URL から取得したパラメータのみを渡す
  - 1 つの `.tsx` ファイルは小さく保ち、適切にコンポーネント化する
  - `async/await` を優先し、`then/catch` は極力避ける
  - ジェネリクスを使用して型を明確にする
  - 既存の共通 UI コンポーネントを優先して使用する。汎用的なら新しく共通コンポーネントを作成する
  - 共通 UI の追加/変更時は Storybook を更新する
  - 機能ごとのサーバーアクションを作成したら、`lib/actions/index.ts` でエラープロキシ登録を行う

# その他のルール

- コードを追加したときは、対応するテストコードを作成する
- 変更時はテストを修正して実行し、問題がないことを確認する

---

このファイルは Copilot に与えるコンテキストです。文言やルールで補足・具体例が必要であれば指示してください。
