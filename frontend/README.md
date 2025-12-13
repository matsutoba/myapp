# Frontend ドキュメント

myapp フロントエンド（Next.js 14+ App Router）の統合ドキュメントです。開発セットアップ、実装ガイド、自動エラーハンドリングシステムについて網羅します。

---

## 目次

1. [概要](#概要)
2. [クイックスタート](#クイックスタート)
3. [プロジェクト構成](#プロジェクト構成)
4. [自動エラーハンドリングシステム](#自動エラーハンドリングシステム)
5. [開発ワークフロー](#開発ワークフロー)
6. [使用可能なコマンド](#使用可能なコマンド)
7. [トラブルシューティング](#トラブルシューティング)

---

## 概要

myapp フロントエンドは、以下の特性を持つ Next.js 14+ アプリケーションです：

- **フレームワーク**: Next.js 14+（App Router）
- **言語**: TypeScript
- **UI フレームワーク**: React 18+
- **スタイリング**: Tailwind CSS
- **エラー管理**: 自動エラーハンドリングシステム
- **バックエンド連携**: 統一 API client + Server Actions

### 主な機能

- 認証・ログイン
- ユーザー管理
- 顧客管理
- 注文管理
- ダッシュボード（AI 要約付き）
- 天気グラフ表示

---

## クイックスタート

### 開発環境セットアップ

```bash
cd frontend

# 依存パッケージをインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルドとデプロイ

```bash
# ビルド（登録チェック自動実行）
pnpm build

# 本番モードでテスト
pnpm start
```

---

## プロジェクト構成

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト（ErrorProvider配置）
│   ├── (main)/                  # メインレイアウト
│   │   ├── page.tsx             # ホームページ
│   │   ├── customers/           # 顧客管理
│   │   ├── orders/              # 注文管理
│   │   ├── dashboard/           # ダッシュボード
│   │   └── weather-graph/       # 天気グラフ
│   ├── admin/                   # 管理画面
│   │   ├── layout.tsx
│   │   └── users/               # ユーザー管理
│   └── login/                   # ログインページ
├── components/                  # React コンポーネント
│   └── ui/                      # UI コンポーネント集
│       ├── Button/
│       ├── Modal/
│       ├── ErrorModal/          # エラー専用モーダル
│       ├── Card/
│       ├── Table/
│       └── ...
├── features/                    # フィーチャー別モジュール
│   ├── auth/                    # 認証機能
│   │   ├── actions/             # Server Actions
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── customer/                # 顧客機能
│   ├── order/                   # 注文機能
│   ├── user/                    # ユーザー機能
│   ├── dashboard/               # ダッシュボード機能
│   └── weather-graph/           # 天気グラフ機能
├── lib/                         # ユーティリティ・ライブラリ
│   ├── api/
│   │   └── client.ts            # API client + Server Actions wrapper
│   ├── actions/
│   │   └── index.ts             # Server Actions登録場所
│   ├── contexts/
│   │   ├── ErrorContext.tsx     # グローバルエラー管理
│   │   └── README.md            # 使用方法ドキュメント
│   ├── hooks/
│   ├── utils/
│   └── zod/                     # Zod スキーマ定義
├── scripts/
│   ├── check-actions.ts         # Server Actions登録チェック
│   ├── eslint-check-actions-rule.mjs
│   └── README.md                # チェックシステムドキュメント
├── styles/
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
└── eslint.config.mjs
```

---

## 自動エラーハンドリングシステム

### 概要

すべての API エラーと Server Actions のエラーを自動でモーダル表示します。ページコンポーネントでエラー処理コードを書く必要がありません。

### システム構成

#### 1. グローバルエラー管理（ErrorContext）

```typescript
// lib/contexts/ErrorContext.tsx
- API エラーをグローバル状態で管理
- カスタムイベント API_ERROR_EVENT で発火
- ErrorModal を自動表示
```

#### 2. API Client 統一化

```typescript
// lib/api/client.ts
- すべての API 呼び出しを統一
- エラーフォーマット: { error: { code: number, message: string } }
- エラー時に自動でイベント発火
```

#### 3. Server Actions 自動ラップ

```typescript
// lib/api/createAutoErrorProxy.ts
- Server Actions を自動でラップ
- エラーを自動でキャッチしてイベント発火
```

#### 4. エラーモーダル

```typescript
// components/ui/ErrorModal/ErrorModal.tsx
- API エラー表示専用
- グローバルエラーコンテキストと連動
- 自動で表示・非表示
```

#### 5. 登録チェックシステム

```typescript
// scripts/check-actions.ts
- Server Actions の登録漏れを自動検出
- pnpm build 時に自動実行
- 未登録があればビルル失敗
```

### エラーコード体系

| コード | 説明           |
| ------ | -------------- |
| 3xxx   | 認証エラー     |
| 4xxx   | 認可エラー     |
| 5xxx   | サーバーエラー |

---

## 開発ワークフロー

### 1. Server Action を作成

```typescript
// features/product/actions/getProducts.ts
'use server';

import { apiServer } from '@/lib/api/client';

export async function getProducts() {
  return await apiServer.get<Product[]>('/products');
}
```

### 2. lib/actions/index.ts に登録

```typescript
// lib/actions/index.ts
import * as productActions from '@/features/product/actions/getProducts';

export const actions = {
  // ... 他の機能
  product: createAutoErrorProxy(productActions),
};
```

### 3. 登録確認

```bash
pnpm check-actions
```

**出力例（登録漏れがある場合）:**

````
⚠️  Unregistered: 1 action modules
   - product/getProducts

📝 To register these actions, add them to lib/actions/index.ts:

```typescript
import * as productGetProductsActions from '@/features/product/actions/getProducts';

export const actions = {
  product: createAutoErrorProxy(productGetProductsActions),
};
````

````

### 4. ページで使用

```tsx
// pages/products.tsx
'use client';

import { actions } from '@/lib/actions';
import { useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const result = await actions.product.getProducts();

    // エラー時は自動でモーダル表示！
    if (result.success && result.data) {
      setProducts(result.data);
    }
  };

  return (
    <div>
      <button onClick={loadProducts}>商品を読込</button>
      <div>
        {products.map((p) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
}
````

---

## 使用可能なコマンド

| コマンド             | 説明                                   |
| -------------------- | -------------------------------------- |
| `pnpm dev`           | 開発サーバー起動（ポート 3000）        |
| `pnpm build`         | ビルド（自動でチェックアクション実行） |
| `pnpm start`         | 本番モードでテスト                     |
| `pnpm check-actions` | Server Actions 登録チェック（手動）    |
| `pnpm lint`          | ESLint チェック                        |

---

## Server Actions ファイル命名規則

features 配下の action モジュール構造を統一：

```
features/
  └── {feature}/
      └── actions/
          ├── get{Resource}.ts        ← 取得系
          ├── create{Resource}.ts     ← 作成系
          ├── update{Resource}.ts     ← 更新系
          └── delete{Resource}.ts     ← 削除系
```

### 例

```typescript
// features/customer/actions/
├── getCustomers.ts          # 顧客一覧取得
├── getCustomerDetail.ts     # 顧客詳細取得
├── createCustomer.ts        # 顧客作成
├── updateCustomer.ts        # 顧客更新
└── deleteCustomer.ts        # 顧客削除
```

### lib/actions/index.ts への登録例

```typescript
import * as customerGetActionsModule from '@/features/customer/actions/getCustomers';
import * as customerCreateActionsModule from '@/features/customer/actions/createCustomer';

export const actions = {
  customer: createAutoErrorProxy({
    ...customerGetActionsModule,
    ...customerCreateActionsModule,
  }),
};
```

---

## トラブルシューティング

### Q: エラーモーダルが表示されない

**確認項目:**

1. `app/layout.tsx` に `<ErrorProvider>` が配置されているか確認

```tsx
import { ErrorProvider } from '@/lib/contexts/ErrorContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorProvider>{children}</ErrorProvider>
      </body>
    </html>
  );
}
```

2. Server Action が `lib/actions/index.ts` に登録されているか確認

```bash
pnpm check-actions
```

3. `createAutoErrorProxy` でラップされているか確認

```typescript
export const actions = {
  product: createAutoErrorProxy(productActions),
};
```

### Q: 型エラーが出る

**解決方法:**

```bash
# 登録確認
pnpm check-actions

# TypeScript キャッシュクリア
rm -rf .next

# 再ビルド
pnpm dev
```

### Q: check-actions が tsx not found エラー

**解決方法:**

```bash
pnpm add -D tsx
pnpm check-actions
```

### Q: API エラーが統一フォーマットで返されない

**確認項目:**

1. バックエンド API がエラーを統一フォーマットで返しているか

```json
{
  "error": {
    "code": 3001,
    "message": "認証が必要です"
  }
}
```

2. `lib/api/client.ts` でエラーをキャッチしているか

```typescript
export const apiServer = {
  async get<T>(path: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`);
      if (!response.ok) {
        const error = await response.json();
        // イベント発火
        return { success: false, error: error.error };
      }
      return { success: true, data: (await response.json()) as T };
    } catch (err) {
      // エラーハンドリング
    }
  },
};
```

---

## エラーモーダルのカスタマイズ

### デザイン変更

```tsx
// components/ui/ErrorModal/ErrorModal.tsx
export function ErrorModal({ error, onClose }: Props) {
  return (
    <Modal size="medium">
      {' '}
      {/* small | medium | large に変更可能 */}
      <h2>{error?.message || 'エラーが発生しました'}</h2>
      <button onClick={onClose}>閉じる</button>
    </Modal>
  );
}
```

### デフォルトメッセージ変更

```tsx
const message = error?.message || 'カスタムエラーメッセージ';
```

---

## テスト方法

### API キーエラーをテスト

1. **バックエンドを起動**

```bash
cd backend && docker-compose up
```

2. **フロントエンドを起動**

```bash
cd frontend && pnpm dev
```

3. **無効な API キーで実行**

- `/admin/users` ページにアクセス
- エラーモーダルが自動表示される

### 登録チェックをテスト

1. **新しい action を作成**（登録しない）

```bash
touch features/test/actions/testAction.ts
echo "'use server';" > features/test/actions/testAction.ts
```

2. **チェック実行**

```bash
pnpm check-actions
# ⚠️  Unregistered: 1 action modules と表示される
```

3. **ビルド実行**

```bash
pnpm build
# ビルルが失敗し、登録方法が表示される
```

---

## 今後の拡張案

### 1. エラーログ収集

```typescript
// ErrorContext.tsx
window.addEventListener(API_ERROR_EVENT, (event) => {
  const error = event.detail;

  // Sentry などに送信
  logErrorToMonitoring(error);

  setApiError(error);
});
```

### 2. リトライ機能

```tsx
<ErrorModal
  error={apiError}
  onRetry={() => {
    // 失敗したアクションを再実行
  }}
/>
```

### 3. 国際化対応

```typescript
// エラーメッセージを多言語対応
const errorMessage = t(`errors.${error.code}`, error.message);
```

### 4. エラーログパネル

```tsx
// 開発環境でのみ表示
<ErrorLogPanel errors={allErrors} />
```

---

## 参考資料

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.js 機能について
- [React ドキュメント](https://react.dev) - React 18+ について
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/) - TypeScript について
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs) - CSS フレームワーク
- [Zod ドキュメント](https://zod.dev) - バリデーションスキーマ

---

## FAQ

### Q: なぜ Server Actions が必須なのか？

**A**: Server Actions を統一することで：

- エラーハンドリングを自動化
- 登録漏れを検出可能
- 全 API 呼び出しが統一されている

### Q: API client と Server Actions の違い？

**A**:

- **API client**: `lib/api/client.ts` で定義したヘルパー関数（低レベル）
- **Server Actions**: `features/*/actions/*.ts` で定義した関数（ビジネスロジック）
- Server Actions は内部で API client を使用

### Q: エラーハンドリングは全自動？

**A**:

- ✅ API エラー表示は自動
- ✅ モーダル表示は自動
- ❌ ビジネスロジック上のエラーハンドリングは手動（例：バリデーション失敗時の UI 更新）

### Q: 複数のエラーが同時に発生した場合？

**A**: ErrorContext はスタック機構で複数エラーを管理し、1 つずつモーダルで表示します。

---

## まとめ

### メリット

- ✅ **開発効率 UP**: エラー処理コードを書く必要なし
- ✅ **品質向上**: 登録漏れを自動検出
- ✅ **統一性**: すべてのエラーが同じ UI/フォーマット
- ✅ **保守性**: エラー表示ロジックが 1 箇所に集約

### 注意点

- ⚠️ 新しい Server Action は必ず `lib/actions/index.ts` に登録
- ⚠️ `pnpm build` 前に `pnpm check-actions` を実行推奨
- ⚠️ `features/*/actions/` ディレクトリ構造を守る
- ⚠️ Server Action は `'use server'` ディレクティブが必須

---

**最終更新**: 2025 年
**状態**: 本番対応
