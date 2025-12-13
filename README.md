# myapp - SaaS ダッシュボードアプリケーション

Go バックエンド + Next.js フロントエンドで構築された SaaS ダッシュボード。AI による自動要約、複数のデータ可視化、リアルタイムデータ分析が特徴です。

## 概要

**myapp** は以下の機能を備えたエンタープライズ向けダッシュボードアプリケーションです：

- 売上・顧客データなどのリアルタイム分析
- AI による自動要約機能（OpenAI または Ollama）
- マルチユーザー対応、ロールベースアクセス制御
- ユーザー・顧客・注文の統合管理

---

## 技術スタック

### フロントエンド

| 技術         | 用途                           |
| ------------ | ------------------------------ |
| Next.js 14+  | App Router、SSR/SSG            |
| React 18+    | useTransition、Suspense        |
| TypeScript   | 型安全性                       |
| Tailwind CSS | スタイリング・レスポンシブ対応 |
| Zod          | バリデーション・スキーマ定義   |

### バックエンド

| 技術       | 用途                        |
| ---------- | --------------------------- |
| Go 1.21+   | 高性能 API サーバー         |
| Gin        | Web フレームワーク          |
| GORM       | ORM                         |
| MySQL      | リレーショナル DB           |
| OpenAI SDK | AI 統合（API）              |
| Ollama     | AI 統合（セルフホスト LLM） |

### DevOps・インフラ

| 技術           | 用途             |
| -------------- | ---------------- |
| Docker         | コンテナ化       |
| docker-compose | ローカル開発環境 |
| Railway        | クラウドデプロイ |

---

## アーキテクチャ

### 1. AI 統合

- OpenAI API と Ollama（セルフホスト LLM）の両対応
- プラグイン設計で AI エンジンを切り替え可能
- ダッシュボード データの自動要約・分析

```go
// backend/go/internal/ai/engine.go
type Engine interface {
  AnalyzeData(data interface{}) (string, error)
}
// OpenAI と Ollama の実装
```

### 2. パフォーマンス最適化

- `useTransition` による非ブロッキング UI 更新
- Server Actions による効率的なデータ取得
- 分割ローディング：高速データ → AI 要約は非同期

```typescript
// frontend/features/dashboard/components/Dashboard.tsx
const [data, setPending] = useTransition();
await getDashboardDataWithoutSummary(); // 高速
await getDashboardSummary(); // 低速（非同期）
```

### 3. エラーハンドリング

- グローバルエラーコンテキストによる統一管理
- Server Actions の自動ラップ
- ビルド時の登録チェック（`pnpm check-actions`）

```typescript
// frontend/lib/contexts/ErrorContext.tsx
type APIError = { error: { code: number; message: string } };
// ErrorModal が自動表示
```

### 4. クラウドデプロイ

- Docker Compose で開発環境を完全再現
- Railway での自動デプロイ対応
- 環境変数による設定分離（開発/本番）

---

## セットアップ

### ローカル開発環境

```bash
# 1. バックエンド起動
cd backend
docker-compose --profile ai up -d

# 2. フロントエンド起動
cd frontend
pnpm install
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### デプロイ

```bash
# Railway へのデプロイ（自動）
# docker-compose.prod.yml が自動検出される
railway up
```

詳細は [backend/README.md](./backend/README.md)、[frontend/README.md](./frontend/README.md) を参照

---

## プロジェクト構成

```
myapp/
├── backend/                     # Go API + AI エンジン
│   ├── go/
│   │   ├── cmd/server/main.go  # アプリケーションエントリ
│   │   └── internal/
│   │       ├── ai/             # AI エンジン（プラグイン設計）
│   │       ├── auth/           # 認証・JWT
│   │       ├── dashboard/      # ダッシュボード分析
│   │       ├── customer/       # 顧客管理
│   │       ├── order/          # 注文管理
│   │       └── user/           # ユーザー管理
│   ├── docker-compose.yml      # 開発用
│   ├── docker-compose.prod.yml # 本番用
│   └── README.md               # バックエンド詳細ドキュメント
│
├── frontend/                    # Next.js 14+ フロントエンド
│   ├── app/                    # App Router
│   │   ├── (main)/             # メインレイアウト
│   │   ├── admin/              # 管理画面
│   │   └── login/              # ログイン
│   ├── features/               # フィーチャー別モジュール
│   │   ├── auth/
│   │   ├── dashboard/          # AI 要約機能
│   │   ├── customer/
│   │   ├── order/
│   │   └── user/
│   ├── lib/
│   │   ├── api/               # API client 統一化
│   │   ├── actions/           # Server Actions 登録
│   │   └── contexts/          # グローバルエラー管理
│   ├── scripts/               # check-actions など
│   └── README.md              # フロントエンド詳細ドキュメント
│
└── README.md                   # このファイル
```

---

## 主な機能

### 認証・セキュリティ

- JWT トークンベース認証
- リフレッシュトークン機構
- ロールベースアクセス制御（RBAC）

### ダッシュボード

- **リアルタイムデータ分析**: 売上、顧客数などの集計
- **AI 自動要約**: OpenAI / Ollama による分析内容の要約
- **期間フィルター**: 日付範囲指定による動的データ取得
- **複数ビュー**: ランキング、月次推移、分析要約

### 管理画面

- ユーザー管理（作成・編集・削除）
- 顧客管理
- 注文管理
- リアルタイムデータ同期

---

## 設計上の特徴

- **プラグイン設計**: AI エンジン（OpenAI/Ollama）の切り替えが可能
- **分割ローディング**: 高速データを先に表示、低速 API は非同期
- **自動エラー検出**: ビルド時に Server Actions 登録漏れを検出
- **型安全性**: TypeScript + Zod によるエンドツーエンドの型チェック
- **環境再現性**: Docker Compose で開発環境を完全再現

---

## 開発プロセス

このプロジェクトの開発では、GitHub Copilot と Claude AI を活用しています：

- **コード生成**: Go・TypeScript のボイラープレートコード、コンポーネント実装
- **アーキテクチャ設計**: React 18+ ベストプラクティス、エラーハンドリング設計の検討
- **ドキュメント作成**: README、API ドキュメントの作成・整理
- **デバッグ支援**: エラー原因の分析、パフォーマンス改善の提案
- **リファクタリング**: コード品質の改善、設計パターンの最適化

AI アシスタントとの対話を通じて、より良い設計決定を検証し、本番環境を想定した実装を実現しています。

---

## トラブルシューティング・参考資料

各コンポーネントの詳細なセットアップ・トラブルシューティングは以下を参照：

- [backend/README.md](./backend/README.md) - Go API、AI エンジン、Railway デプロイ
- [frontend/README.md](./frontend/README.md) - Next.js、Server Actions、エラーハンドリング
