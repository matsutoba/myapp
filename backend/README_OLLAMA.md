# Ollama Docker セットアップガイド

## 概要

Ollama はローカル LLM サーバーで、ダッシュボード情報を AI で自動要約する機能を提供します。

> **本番環境の場合**: 詳細は [README_PRODUCTION.md](./README_PRODUCTION.md) を参照してください。
> 本番環境では **OpenAI API（推奨）** または **セルフホスト Ollama** が選択できます。

## クイックスタート

### 1. Ollama サービスを起動

```bash
cd /Users/matsubara/Documents/Git/myapp/backend

# Ollama プロファイルを有効にして起動
docker compose --profile ai up -d ollama

# モデルのダウンロードを確認（初回は数分かかります）
docker compose logs -f ollama
```

**初回起動時**は、`OLLAMA_MODELS` で指定されたモデル（デフォルト: mistral + llama2）を自動ダウンロードします。

### 3. Go バックエンド起動

```bash
docker compose up -d go mysql
```

### 4. テスト

```bash
# Ollama API が動作しているか確認
curl http://localhost:11434/api/tags

# ダッシュボード要約 API
curl "http://localhost:8080/api/dashboard/summary?from=2025-06-01&to=2025-12-12&language=ja"
```

## 環境設定

### docker-compose.yml での設定

```yaml
ollama:
  environment:
    - OLLAMA_HOST=0.0.0.0:11434 # バインドアドレス
    - OLLAMA_MODELS=mistral llama2 # ダウンロードするモデル（スペース区切り）
```

### Go コンテナ設定

```yaml
go:
  environment:
    - AI_ENGINE=ollama # エンジン選択
    - OLLAMA_ENDPOINT=http://ollama:11434 # Ollama API エンドポイント
    - OLLAMA_MODEL=mistral # 使用するモデル
```

### モデル選択

| モデル      | メモリ | 速度   | 日本語 | 用途       |
| ----------- | ------ | ------ | ------ | ---------- |
| llama2      | 4GB    | 中程度 | △      | 汎用       |
| mistral     | 7GB    | 高速   | ◎      | 推奨       |
| neural-chat | 8GB    | 中速   | ◎      | 日本語対応 |

### モデル追加をカスタマイズ

docker-compose.yml の `ollama` セクションで `OLLAMA_MODELS` を編集：

```yaml
ollama:
  environment:
    - OLLAMA_MODELS=neural-chat # 日本語対応のみ
    # または
    - OLLAMA_MODELS=mistral llama2 neural-chat # 複数モデル
```

## よくある操作

### Ollama コンテナのログを確認

```bash
docker compose logs -f ollama
```

### モデル一覧を表示

```bash
docker exec myapp-ollama ollama list
```

### 特定モデルを削除

```bash
docker exec myapp-ollama ollama rm mistral
```

### 追加でモデルをインストール（コンテナ起動後）

```bash
docker exec myapp-ollama ollama pull neural-chat
```

### Ollama を完全に停止・削除

```bash
docker compose --profile ai down
# データも削除する場合
docker volume rm backend_ollama_data
```

## OpenAI への切り替え

本番環境では OpenAI API を使用する場合：

```bash
# docker-compose.yml を編集
environment:
  - AI_ENGINE=openai
  - OPENAI_API_KEY=sk-...                      # API キー設定
  - OPENAI_MODEL=gpt-4o-mini
```

## トラブルシューティング

### Ollama が起動しない

```bash
# ログ確認
docker compose logs ollama

# コンテナ削除して再起動
docker compose --profile ai down ollama
docker compose --profile ai up -d ollama
```

### モデルダウンロードが遅い

- インターネット接続確認
- `docker exec myapp-ollama ollama pull <model>` で手動プッシュ試行

### API が応答しない

```bash
# Ollama が実行中か確認
docker ps | grep ollama

# 再起動
docker restart myapp-ollama
```

## 参考資料

- Ollama 公式: https://ollama.ai
- モデルライブラリ: https://ollama.ai/library
