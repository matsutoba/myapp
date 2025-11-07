# =====================================
# Stage 1: Build stage
# =====================================
FROM golang:1.25.4 AS builder

# 作業ディレクトリを設定
WORKDIR /app

# Go Modules をコピーして依存関係を解決
COPY ../../go/go.mod ../../go/go.sum ./
RUN go mod download

# ソースコードをコピー
COPY ../../go .

# CGOを無効化して静的バイナリをビルド
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/api

# =====================================
# Stage 2: Runtime stage (軽量)
# =====================================
# セキュアで軽量なDistrolessベース
FROM gcr.io/distroless/base-debian12 AS runtime

# 実行ユーザーを作成（rootではない）
USER nonroot:nonroot

WORKDIR /app

# バイナリをコピー
COPY --from=builder /app/server .

# 環境変数を設定
ENV PORT=8080

EXPOSE 8080

# 実行コマンド
CMD ["./server"]
