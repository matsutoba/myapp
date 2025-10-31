# AI Agent Instructions for Weather App Frontend

## Project Overview

このプロジェクトは Next.js 16.0.0 を使用した天気予報アプリケーションのフロントエンドです。App Router を採用し、TanStack Query と OpenMeteo API を使用して天気データを取得・表示します。

## アーキテクチャと構造

### ディレクトリ構造

- `app/` - Next.js App Router のページコンポーネント
- `components/` - 共通コンポーネント（グローバルナビゲーション等）
- `features/` - 機能ごとのコンポーネント、hooks、ロジック
  - `weather-graph/` - 天気グラフ機能関連
    - `hooks/` - カスタムフック
    - `components/` - 機能固有のコンポーネント

### 重要なパターン

1. **機能ベースの分割**

   - 機能ごとに `features/` 配下にディレクトリを作成
   - 例: `features/weather-graph/` には天気グラフ関連のすべてのコードを配置

2. **データ取得パターン**

   ```typescript
   // features/weather-graph/hooks/useWeatherQuery.ts での例
   const query = useQuery({
     queryKey: ['weatherData', latitude, longitude],
     queryFn: async () => {
       // OpenMeteo APIからデータを取得
     },
   });
   ```

3. **コンポーネント構造**
   - 共通 UI コンポーネントは `components/` に配置
   - 機能固有のコンポーネントは `features/<機能名>/components/` に配置

## 開発ワークフロー

### ローカル開発

```bash
pnpm install    # 依存関係のインストール
pnpm dev        # 開発サーバーの起動
pnpm lint       # ESLintによるコード検証
pnpm build      # プロダクションビルド
```

### 主要な依存関係

- `@tanstack/react-query` - サーバーステート管理
- `openmeteo` - 天気データ API
- `recharts` - グラフ描画
- TailwindCSS - スタイリング

## Tips & 注意点

1. 新機能の追加時は `features/` ディレクトリ配下に適切な構造で配置する
2. データ取得ロジックは必ず Custom Hooks として実装する
3. コンポーネントの再利用性を考慮し、適切なディレクトリに配置する
4. TanStack Query の `queryKey` は適切なキャッシュ制御のため、依存データをすべて含める

## フィードバックについて

このインストラクションファイルはプロジェクトの進化に応じて更新が必要です。特に以下の点について、フィードバックをお願いします：

- ビルド・デプロイメントプロセスの詳細
- テスト戦略とベストプラクティス
- エラーハンドリングのパターン
- 状態管理の方針
