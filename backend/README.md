# Backend API ドキュメント

myapp の Go バックエンド API 統合ドキュメントです。開発環境、本番環境、Ollama セットアップについての全情報を網羅します。

---

## 目次

1. [概要](#概要)
2. [クイックスタート](#クイックスタート)
3. [AI エンジン構成](#aiエンジン構成)
4. [開発環境セットアップ](#開発環境セットアップ)
5. [本番環境デプロイ](#本番環境デプロイ)
6. [Railway へのデプロイ](#railwayへのデプロイ)
7. [トラブルシューティング](#トラブルシューティング)

---

## 概要

myapp バックエンド API は以下の特性を持つ Go アプリケーションです：

- **言語**: Go（Gin フレームワーク）
- **データベース**: MySQL または SQLite
- **AI 機能**: ダッシュボード情報を自動要約する機能搭載
- **AI エンジン**: OpenAI API または Ollama（ローカル LLM）を選択可能

### 主な機能

- 認証・ユーザー管理
- 顧客管理
- 注文管理
- ダッシュボード集計と AI 要約分析

---

## クイックスタート

### 開発環境（MySQL + Ollama）

```bash
cd backend

# Ollama（AI LLM）を有効にして起動
docker compose --profile ai up -d

# 起動確認
docker compose logs -f
```

**初回起動時は Ollama がモデルをダウンロードするため数分かかります**

### 起動確認

```bash
# Ollama API の確認
curl http://localhost:11434/api/tags

# ダッシュボード要約 API のテスト
curl "http://localhost:8080/api/dashboard/summary?from=2025-06-01&to=2025-12-12&language=ja"
```

### 停止

```bash
docker compose down
# データも削除する場合
docker volume rm backend_ollama_data
```

---

## AI エンジン構成

### 1. OpenAI（推奨 - 本番環境）

**特徴**：

- クラウド API、高品質な日本語対応
- 初期セットアップが簡単
- API 費用がかかる（月 100-500 円程度）

**設定**：

```yaml
environment:
  - AI_ENGINE=openai
  - OPENAI_API_KEY=sk-your-api-key
  - OPENAI_MODEL=gpt-4o-mini # 推奨モデル（低コスト・高精度）
```

### 2. Ollama（オプション - セルフホスト）

**特徴**：

- ローカル LLM、完全プライベート
- API 費用なし（ホスティング料のみ）
- セットアップに時間がかかる、ローカルリソース消費

**設定**：

```yaml
environment:
  - AI_ENGINE=ollama
  - OLLAMA_ENDPOINT=http://ollama:11434
  - OLLAMA_MODEL=mistral # 日本語対応推奨
```

### モデル比較表

| モデル      | メモリ | 速度   | 日本語 | 用途       |
| ----------- | ------ | ------ | ------ | ---------- |
| llama2      | 4GB    | 中程度 | △      | 汎用       |
| mistral     | 7GB    | 高速   | ◎      | 推奨       |
| neural-chat | 8GB    | 中速   | ◎      | 日本語対応 |

---

## 開発環境セットアップ

### 前提

- Docker & Docker Compose インストール済み
- Go 1.21+（ローカルビルド時）

### 1. Ollama Docker セットアップ

```bash
cd backend

# Ollama を有効にして起動
docker compose --profile ai up -d ollama

# モデルのダウンロード確認（初回は数分かかります）
docker compose logs -f ollama
```

#### docker-compose.yml での設定

```yaml
ollama:
  environment:
    - OLLAMA_HOST=0.0.0.0:11434 # バインドアドレス
    - OLLAMA_MODELS=mistral llama2 # ダウンロードするモデル（スペース区切り）
```

#### Go コンテナ設定

```yaml
go:
  environment:
    - AI_ENGINE=ollama
    - OLLAMA_ENDPOINT=http://ollama:11434
    - OLLAMA_MODEL=mistral
```

### 2. MySQL とバックエンド起動

```bash
docker compose up -d go mysql
```

### 3. 開発環境での操作

#### Ollama コンテナのログ確認

```bash
docker compose logs -f ollama
```

#### モデル一覧表示

```bash
docker exec myapp-ollama ollama list
```

#### 特定モデルを削除

```bash
docker exec myapp-ollama ollama rm mistral
```

#### コンテナ起動後に新しいモデルをインストール

```bash
docker exec myapp-ollama ollama pull neural-chat
```

#### モデルカスタマイズ（docker-compose.yml での `OLLAMA_MODELS` 編集）

```yaml
ollama:
  environment:
    - OLLAMA_MODELS=neural-chat # 日本語対応のみ
    # または
    - OLLAMA_MODELS=mistral llama2 neural-chat # 複数モデル
```

#### 完全にクリーンアップ

```bash
docker compose --profile ai down
# データも削除する場合
docker volume rm backend_ollama_data
```

---

## 本番環境デプロイ

### 概要

本番環境では `docker-compose.prod.yml` を使用します。AI 要約機能は以下から選択可能：

- **OpenAI（推奨）**: クラウド API、高品質
- **Ollama（オプション）**: セルフホスト LLM、完全プライベート

### デプロイ方法

#### 方法 1: OpenAI を使用（推奨）

```bash
cd backend

export AI_ENGINE=openai
export OPENAI_API_KEY=sk-your-key
export OPENAI_MODEL=gpt-4o-mini

docker compose -f docker-compose.prod.yml up -d
```

#### 方法 2: Ollama を使用（セルフホスト）

docker-compose.prod.yml で Ollama サービスをコメント解除：

```yaml
ollama:
  build:
    context: ./docker/ollama
    dockerfile: Dockerfile
  environment:
    - OLLAMA_MODELS=mistral
  volumes:
    - ollama_data:/root/.ollama
  profiles:
    - ai
```

起動：

```bash
export AI_ENGINE=ollama
docker compose -f docker-compose.prod.yml --profile ai up -d
```

### 環境変数管理

#### .env.prod ファイル作成

```bash
cp .env.prod.example .env.prod
# 本番値を編集
vi .env.prod
```

#### Docker Compose で読み込み

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### セキュリティ考慮事項

#### 1. API キー管理

```bash
# GitHub Secrets に登録（GitHub Actions 使用時）
# または環境変数で渡す
export OPENAI_API_KEY=$(cat /secure/path/to/key)
```

#### 2. MySQL パスワード

```bash
# 強力なパスワードを設定
MYSQL_ROOT_PASSWORD=generate_strong_password_here
MYSQL_PASSWORD=another_strong_password
```

#### 3. Ollama の場合

```yaml
# ファイアウォール設定（11434 ポートを制限）
# または、Ollama を内部ネットワークのみで公開
ollama:
  expose:
    - "11434" # ports ではなく expose を使用（外部非公開）
```

### コスト最適化

#### OpenAI

- 推奨モデル: `gpt-4o-mini`（低コスト、高精度）
- 平均コスト: 月 100-500 円（月 1000 要約）

#### Ollama

- 初期コスト: ホスティング料のみ
- 月間コスト: 0 円（API 費用なし）
- デメリット: サーバーリソース消費

### モニタリング

#### ダッシュボード要約 API の動作確認

```bash
curl "https://your-api.example.com/api/dashboard/summary?from=2025-01-01&to=2025-12-31"
```

#### ログ確認

```bash
# 本番環境ログ
docker compose -f docker-compose.prod.yml logs api
docker compose -f docker-compose.prod.yml logs db

# Ollama ログ（使用時）
docker compose -f docker-compose.prod.yml logs ollama
```

### ロールバック

```bash
# 前のバージョンに戻す
docker compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml up -d
```

---

## Railway へのデプロイ

Railway は `docker-compose.prod.yml` を自動検出してデプロイします。

### 前提

- GitHub リポジトリが用意されていること
- Railway アカウント（https://railway.app）を作成済み
- `backend/go` に `Dockerfile` があること（既存の構成が利用可能）

### 1. Railway プロジェクト作成（UI）

- Railway にログイン → `New Project` を作成
- `Provision Database` または `Add Plugin` から `MySQL` を追加
- Railway が接続情報（host, port, user, password, database）を生成

### 2. 環境変数の設定

Railway の Project → Variables で以下を設定：

| 環境変数       | 値                         | 説明            |
| -------------- | -------------------------- | --------------- |
| DB_HOST        | Railway MySQL host         | DB ホスト       |
| DB_PORT        | 3306                       | DB ポート       |
| DB_NAME        | Railway database           | DB 名           |
| DB_USER        | Railway db user            | DB ユーザー     |
| DB_PASS        | Railway password           | DB パスワード   |
| PORT           | 8080                       | アプリポート    |
| GO_ENV         | production                 | 環境            |
| JWT_SECRET_KEY | 本番用の強力なシークレット | 認証キー        |
| AI_ENGINE      | openai                     | AI エンジン選択 |
| OPENAI_API_KEY | sk-...                     | OpenAI API キー |
| OPENAI_MODEL   | gpt-4o-mini                | OpenAI モデル   |

**補足**：リポジトリの `.env` はコミットしないでください。Railway で管理してください。

### 3. デプロイ方法（GUI / GitHub 連携）

- Railway の Project 設定で `Deploy from GitHub` を選択
- 対象リポジトリを接続
- デプロイ対象ディレクトリを `backend/go` に指定（Dockerfile がある場所）
- ビルドコマンドや Start コマンドをカスタムする場合は UI で設定

### 4. デプロイ方法（CLI）

#### 初期化 / リンク

```bash
railway login
cd backend/go
railway init   # 既存のプロジェクトにリンクする場合は 'railway link' を使用
```

#### MySQL プラグインを追加（まだ追加していない場合）

```bash
railway add mysql
```

#### 環境変数を設定

```bash
railway variables set \
  DB_HOST=your-host \
  DB_PORT=3306 \
  DB_NAME=myapp \
  DB_USER=user \
  DB_PASS=password \
  PORT=8080 \
  GO_ENV=production \
  JWT_SECRET_KEY=your-secret
```

#### デプロイ

```bash
railway up
```

### 5. マイグレーション / 初期データ投入

`backend/docker/mysql/init` にある SQL ファイルを参考に、Railway の MySQL に初期データを投入します。

**方法 1: ローカルから実行**

```bash
mysql -h <host> -P <port> -u <user> -p<password> < my_init_script.sql
```

**方法 2: Railway Console 経由**

- Railway UI の MySQL プラグイン → Console → SQL を実行

### 6. 動作確認

- Railway UI の Deployments / Logs でアプリの起動ログを確認
- ヘルスチェック:
  ```bash
  curl https://your-app.railway.app/health
  ```

---

## トラブルシューティング

### Ollama 関連

#### Ollama が起動しない

```bash
# ログ確認
docker compose logs ollama

# コンテナ削除して再起動
docker compose --profile ai down ollama
docker compose --profile ai up -d ollama
```

#### モデルダウンロードが遅い

- インターネット接続確認
- 手動プッシュ試行: `docker exec myapp-ollama ollama pull <model>`

#### API が応答しない

```bash
# Ollama が実行中か確認
docker compose ps ollama

# API の確認
curl http://localhost:11434/api/tags
```

### API 関連

#### API が 500 エラーを返す

```bash
# ログを確認
docker compose -f docker-compose.prod.yml logs api

# 環境変数確認
docker exec myapp-api env | grep AI_ENGINE
```

#### Ollama が接続できない

```bash
# Ollama の起動確認
docker compose -f docker-compose.prod.yml logs ollama

# ネットワーク接続確認
docker exec myapp-api curl http://ollama:11434/api/tags
```

#### OpenAI API エラー

```bash
# API キー確認
echo $OPENAI_API_KEY

# API 使用状況確認
# https://platform.openai.com/account/usage
```

### Railway デプロイ関連

#### DB 接続エラーが出る

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` が正しいか確認
- TLS やホワイトリストが必要な場合は Railway ドキュメント確認

#### マイグレーションが走らない

- アプリ起動時に自動でマイグレーションを走らせるコード（例: GORM の AutoMigrate）を `main.go` に組み込むことを検討

---

## 参考資料

- [Railway ドキュメント](https://docs.railway.app/)
- [OpenAI API](https://platform.openai.com/)
- [Ollama 本番デプロイ](https://github.com/ollama/ollama/blob/main/README.md)
- [Gin フレームワーク](https://gin-gonic.com/)
- [GORM ドキュメント](https://gorm.io/)

---

## よくある質問（FAQ）

### Q1: 開発環境と本番環境で AI エンジンを変えたい

**A**: 環境変数 `AI_ENGINE` を設定するだけです。

```bash
# 開発環境
export AI_ENGINE=ollama

# 本番環境
export AI_ENGINE=openai
```

### Q2: Ollama のモデルを追加したい

**A**: docker-compose.yml の `OLLAMA_MODELS` に追加するか、起動後に以下で追加：

```bash
docker exec myapp-ollama ollama pull neural-chat
```

### Q3: OpenAI API の費用を削減したい

**A**: `gpt-4o-mini` を使用してください（月 100-500 円程度）。

### Q4: Railway でログを確認したい

**A**: Railway UI の Deployments タブを確認、または CLI：

```bash
railway logs
```

---

**最終更新**: 2025 年
**状態**: 本番対応
