# 本番環境デプロイガイド

## 概要

本番環境では `docker-compose.prod.yml` を使用します。AI 要約機能は以下のいずれかで構成できます：

- **OpenAI（推奨）**: クラウド API、高品質
- **Ollama（オプション）**: セルフホスト LLM、完全プライベート

## デプロイ方法

### 1. Railway でのデプロイ（推奨）

Railway は `docker-compose.prod.yml` 自動検出します。

```bash
# Railway CLI でデプロイ
railway up

# または GitHub 連携で自動デプロイ
```

**Railway での設定（環境変数）**：

```
AI_ENGINE=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### 2. 自社ホスト（VPS/オンプレ）での利用

#### 2.1 OpenAI を使用

```bash
cd backend
export AI_ENGINE=openai
export OPENAI_API_KEY=sk-your-key
export OPENAI_MODEL=gpt-4o-mini

docker compose -f docker-compose.prod.yml up -d
```

#### 2.2 Ollama を使用（セルフホスト）

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

## 環境変数管理

### .env.prod ファイル作成

```bash
cp .env.prod.example .env.prod
# 本番値を編集
vi .env.prod
```

### Docker Compose で読み込み

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## セキュリティ考慮事項

### 1. API キー管理

```bash
# GitLab/GitHub Secrets に登録
OPENAI_API_KEY=sk-...（シークレット）

# または環境変数で渡す
export OPENAI_API_KEY=$(cat /secure/path/to/key)
```

### 2. MySQL パスワード

```bash
# 強力なパスワードを設定
MYSQL_ROOT_PASSWORD=generate_strong_password_here
MYSQL_PASSWORD=another_strong_password
```

### 3. Ollama の場合

```bash
# ファイアウォール設定（11434 ポートを制限）
# または、Ollama を内部ネットワークのみで公開
ollama:
  expose:
    - "11434"  # ports ではなく expose を使用（外部非公開）
```

## コスト最適化

### OpenAI

- 推奨モデル: `gpt-4o-mini`（低コスト、高精度）
- 平均コスト: 月 100-500 円（月 1000 要約）

### Ollama

- 初期コスト: ホスティング料のみ
- 月間コスト: 0 円（API 費用なし）
- デメリット: サーバーリソース消費

## モニタリング

### ダッシュボード要約 API の動作確認

```bash
curl "https://your-api.example.com/api/dashboard/summary?from=2025-01-01&to=2025-12-31"
```

### ログ確認

```bash
# 本番環境ログ
docker compose -f docker-compose.prod.yml logs api
docker compose -f docker-compose.prod.yml logs db

# Ollama ログ（使用時）
docker compose -f docker-compose.prod.yml logs ollama
```

## ロールバック

```bash
# 前のバージョンに戻す
docker compose -f docker-compose.prod.yml down
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml up -d
```

## トラブルシューティング

### API が 500 エラーを返す

```bash
# ログを確認
docker compose -f docker-compose.prod.yml logs api

# 環境変数確認
docker exec myapp-api env | grep AI_ENGINE
```

### Ollama が接続できない

```bash
# Ollama の起動確認
docker compose -f docker-compose.prod.yml logs ollama

# ネットワーク接続確認
docker exec myapp-api curl http://ollama:11434/api/tags
```

### OpenAI API エラー

```bash
# API キー確認
echo $OPENAI_API_KEY

# API 使用状況確認
# https://platform.openai.com/account/usage
```

## 参考資料

- Railway ドキュメント: https://docs.railway.app/
- OpenAI API: https://platform.openai.com/
- Ollama 本番デプロイ: https://github.com/ollama/ollama/blob/main/README.md
