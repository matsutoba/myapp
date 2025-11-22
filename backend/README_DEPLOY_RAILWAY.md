# Railway デプロイ手順（Go API + MySQL）

このファイルは `myapp` リポジトリの `backend` ディレクトリ内の Go API を Railway と Railway の Managed MySQL でデプロイするための手順をまとめたものです。

**前提**

- GitHub リポジトリが用意されていること
- Railway アカウント（https://railway.app）を作成済みであること
- `backend/go` に `Dockerfile` があること（既存の構成が利用可能）

**重要**: 本番用のシークレット（`JWT_SECRET_KEY` など）は Railway の Environment で設定し、ローカルの `.env` をそのまま公開しないでください。

**1. 準備（ローカル）**

- Railway CLI（任意）
  - インストール（npm 経由）:

```bash
npm i -g railway
```

- リポジトリを GitHub に push しておく。

**2. Railway プロジェクト作成（UI）**

- Railway にログインし、`New Project` を作成。
- `Provision Database` または `Add Plugin` から `MySQL` を追加する。
  - 追加後、Railway は接続情報（host, port, user, password, database）を生成します。

**3. 環境変数の設定（Railway の Project -> Variables）**
次の環境変数を Railway の Project の Environment（Variables）に登録してください。

- `DB_HOST` = Railway の MySQL host
- `DB_PORT` = Railway の MySQL port (例: `3306`)
- `DB_NAME` = Railway の database name
- `DB_USER` = Railway の db user
- `DB_PASS` = Railway の password
- `PORT` = `8080`（アプリの listening ポート。Railway の Service 側設定と合わせる）
- `GO_ENV` = `production`
- `JWT_SECRET_KEY` = 本番用の強力なシークレット
- （必要に応じて）`ACCESS_TOKEN_TTL_HOURS`, `REFRESH_TOKEN_TTL_HOURS`, `CORS_ALLOW_ORIGINS` など

注意: リポジトリの `.env` はそのままコミットしないでください。代わりに Railway で管理してください。

**4. デプロイ方法（GUI / GitHub 連携）**

- Railway の Project 設定で `Deploy from GitHub` を選択し、対象のリポジトリを接続。
- デプロイ対象のディレクトリは `backend/go`（Dockerfile がここにある前提）を指定。
- ビルドコマンドや Start コマンドをカスタムする場合は UI で設定しますが、Dockerfile がある場合は通常自動ビルドされます。

**5. デプロイ方法（CLI）**

- 初期化 / リンク

```bash
railway login
cd backend/go
railway init   # 既存のprojectにlinkする場合は 'railway link' を使う
```

- MySQL プラグインを追加する（もしまだ追加していない場合）

```bash
railway add mysql
```

- 環境変数を設定（例）

```bash
railway variables set DB_HOST=your-host DB_PORT=3306 DB_NAME=myapp DB_USER=user DB_PASS=password PORT=8080 GO_ENV=production JWT_SECRET_KEY=your-secret
```

- デプロイ

```bash
railway up
```

**6. マイグレーション / 初期データ投入**

- `backend/docker/mysql/init` にある SQL ファイルを参考に、Railway の MySQL に対して初期データを投入する必要があります。
- 方法:
  - Railway の `Console` で `MySQL` の接続情報を用いて外部 MySQL クライアントから接続して SQL を実行する
  - または一時的に `railway run` / `railway shell` を使ってコンテナ内で `mysql` クライアントを実行して `docker/mysql/init` 内の SQL を実行する

例（ローカルから実行）:

```bash
mysql -h <host> -P <port> -u <user> -p<password> < my_init_script.sql
```

**7. 動作確認**

- Railway UI の Deployments / Logs でアプリの起動ログを確認
- 簡易チェック:
  - `GET /health` や `GET /` など、アプリに用意されたヘルスチェックエンドポイントを叩く

**8. トラブルシュート**

- DB 接続エラーが出る場合:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` が正しいか確認
  - もし TLS やホワイトリストが必要な場合は Railway のドキュメント確認
- マイグレーションが走らない場合:
  - アプリ起動時に自動でマイグレーションを走らせるコード（例: GORM の AutoMigrate）を `main.go` に組み込むことを検討

**9. セキュリティ / 運用メモ**

- 本番では `JWT_SECRET_KEY` は必ず安全な方法で管理する
- 定期バックアップを設定（Railway のバックアップ機能や外部でダンプを取る）
- ログの保持期間やモニタリングを確立する

---

必要であれば、次を自動で作成できます:

- `railway` 用の簡易 `.railway` 設定ファイル（`railway init` の雛形）
- GitHub Actions ワークフロー（`backend/go` を自動でビルドして Railway にデプロイする）

次に何をしますか？

- (1) この README の微調整（あなたのプロジェクト固有値を反映）
- (2) Railway CLI 用の自動化スクリプト / GitHub Actions を作成
- (3) 今すぐ私が CLI 操作を実行してデプロイを試す（あなたの Railway アカウント情報が必要）
