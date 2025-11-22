# =====================================
# Stage 1: Build stage
# =====================================
FROM golang:1.25.4 AS builder

# Build context is repository root; copy backend/go sources
WORKDIR /src

# Copy module files and download deps
COPY backend/go/go.mod backend/go/go.sum ./
RUN go mod download

# Copy entire backend/go source
COPY backend/go/ ./

# Build static binary for Linux
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags='-s -w' -o /bin/server ./cmd/server

### Runtime image (minimal)
FROM gcr.io/distroless/static-debian12

# Set working dir
WORKDIR /app

# Copy binary from builder
COPY --from=builder /bin/server /app/server

# Default PORT (can be overridden by environment)
ENV PORT=8080

# Expose port
EXPOSE 8080

# Run
ENTRYPOINT ["/app/server"]
