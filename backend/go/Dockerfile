FROM golang:1.25.4-alpine

WORKDIR /app

# Air（ホットリロードツール）をインストール
RUN go install github.com/air-verse/air@latest

# 依存関係を先に解決
COPY go.mod go.sum ./
RUN go mod download

# Airを使ってホットリロード実行
CMD ["air", "-c", ".air.toml"]