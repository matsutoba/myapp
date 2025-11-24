# Server Actions 自動エラーハンドリングシステム - 最終実装ガイド

## ✅ 実装完了内容

### 1. 完全自動エラーハンドリング

- ✅ Server Actions 呼び出し時のエラーを自動でモーダル表示
- ✅ ページコンポーネントでエラー処理コードが不要
- ✅ 全 API エラーが統一フォーマット: `{"error": {"code": number, "message": string}}`

### 2. 自動登録チェックシステム

- ✅ `pnpm check-actions` で Server Actions 登録漏れを検出
- ✅ `pnpm build` 時に自動チェック (未登録があればビルド失敗)
- ✅ ESLint カスタムルールも用意 (オプション)

### 3. バックエンド統一化

- ✅ すべてのミドルウェアが同じエラーフォーマットを返す
- ✅ エラーコード体系: 3xxx (認証), 4xxx (認可)

## 📁 作成/更新されたファイル

### Backend

```
backend/go/internal/common/
├── errors/errors.go                    ← エラーコード定義
└── middleware/
    ├── api_key.go                      ← 統一フォーマット適用
    ├── auth.go                         ← 統一フォーマット適用
    └── rbac.go                         ← 統一フォーマット適用
```

### Frontend - Core

```
frontend/
├── lib/
│   ├── api/
│   │   ├── client.ts                   ← API client統一化、グローバルエラー発火
│   │   └── createAutoErrorProxy.ts    ← Server Action自動ラップ
│   ├── actions/
│   │   └── index.ts                    ← Server Actions統一エクスポート (登録場所)
│   └── contexts/
│       ├── ErrorContext.tsx            ← グローバルエラー管理
│       └── README.md                   ← 使用方法ドキュメント
├── components/ui/
│   ├── Modal/Modal.tsx                 ← 汎用モーダル
│   └── ErrorModal/ErrorModal.tsx      ← APIエラー専用モーダル
└── app/layout.tsx                      ← ErrorProviderを配置
```

### Frontend - Tools

```
frontend/
├── scripts/
│   ├── check-actions.ts                ← 登録チェックスクリプト
│   ├── eslint-check-actions-rule.mjs   ← ESLintカスタムルール
│   └── README.md                       ← チェックシステムドキュメント
└── package.json                        ← check-actions, buildスクリプト追加
```

## 🚀 使用方法

### 日常的な開発フロー

1. **Server Action を作成**

   ```typescript
   // features/product/actions/getProducts.ts
   'use server';

   import { apiServer } from '@/lib/api/client';

   export async function getProducts() {
     return await apiServer.get<Product[]>('/products');
   }
   ```

2. **`lib/actions/index.ts` に登録**

   ```typescript
   import * as productActions from '@/features/product/actions/getProducts';

   export const actions = {
     // ...
     product: createAutoErrorProxy(productActions),
   };
   ```

3. **登録確認**

   ```bash
   pnpm check-actions
   ```

4. **ページで使用**

   ```tsx
   'use client';

   import { actions } from '@/lib/actions';

   export default function ProductsPage() {
     const loadProducts = async () => {
       const result = await actions.product.getProducts();

       // エラー時は自動でモーダル表示！
       if (result.success && result.data) {
         setProducts(result.data);
       }
     };

     return <div>...</div>;
   }
   ```

### 登録漏れがある場合

```bash
pnpm check-actions
```

**出力例:**

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

## 🔧 コマンド一覧

| コマンド | 説明 |
|---------|------|
| `pnpm check-actions` | Server Actions登録チェック |
| `pnpm build` | ビルド (自動で check-actions も実行) |
| `pnpm dev` | 開発サーバー起動 |

## 📖 詳細ドキュメント

- **使用方法**: `frontend/lib/contexts/README.md`
- **チェックシステム**: `frontend/scripts/README.md`
- **API Client**: `frontend/lib/api/README.md`

## 🎨 エラーモーダルのカスタマイズ

`components/ui/ErrorModal/ErrorModal.tsx` を編集:

```tsx
// デフォルトメッセージ変更
error?.message || 'カスタムエラーメッセージ'

// デザイン変更
<Modal size="small">  // small | medium | large
````

## 🧪 テスト方法

### API キーエラーをテスト

1. **バックエンドを起動** (API key チェック有効)

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

1. **新しい action を作成** (登録しない)

   ```bash
   touch features/test/actions/testAction.ts
   ```

2. **チェック実行**

   ```bash
   pnpm check-actions
   # ⚠️ Unregistered: 1 action modules と表示される
   ```

3. **ビルド実行**
   ```bash
   pnpm build
   # ビルドが失敗し、登録方法が表示される
   ```

## 🔍 トラブルシューティング

### Q: エラーモーダルが表示されない

A: 以下を確認:

- `app/layout.tsx` に `<ErrorProvider>` が配置されているか
- Server Action が `lib/actions/index.ts` に登録されているか
- `createAutoErrorProxy` でラップされているか

### Q: 型エラーが出る

A: 以下を実行:

```bash
pnpm check-actions  # 登録確認
# TypeScript の型キャッシュをクリア
rm -rf .next && pnpm dev
```

### Q: check-actions が tsx not found エラー

A: tsx をインストール:

```bash
pnpm add -D tsx
```

## 🎯 今後の拡張案

### 1. エラーログ収集

```typescript
// ErrorContext.tsx
window.addEventListener(API_ERROR_EVENT, (event) => {
  const error = event.detail;

  // Sentryなどに送信
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

## 📝 まとめ

### メリット

- ✅ **開発効率 UP**: エラー処理コードを書く必要なし
- ✅ **品質向上**: 登録漏れを自動検出
- ✅ **統一性**: すべてのエラーが同じ UI/フォーマット
- ✅ **保守性**: エラー表示ロジックが 1 箇所に集約

### 注意点

- ⚠️ 新しい Server Action は必ず `lib/actions/index.ts` に登録
- ⚠️ `pnpm build` 前に `pnpm check-actions` を実行推奨
- ⚠️ features 配下の actions/ディレクトリ構造を守る

### ファイル命名規則

```
features/
  └── {feature}/
      └── actions/
          ├── get{Resource}.ts      ← 取得系
          ├── create{Resource}.ts   ← 作成系
          ├── update{Resource}.ts   ← 更新系
          └── delete{Resource}.ts   ← 削除系
```

---

**🎉 実装完了！すべての Server Actions で自動エラーハンドリングが有効です。**
