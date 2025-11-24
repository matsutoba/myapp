# グローバルエラーハンドリング (完全自動版)

## 🎯 特徴

- ✅ **完全自動**: 新しい Server Action を`features/*/actions/`に配置 →`lib/actions/index.ts`に登録するだけ
- ✅ **登録漏れ検出**: `pnpm build`時に自動チェック。未登録の actions があればビルド失敗
- ✅ **型安全**: TypeScript で型エラーも検出
- ✅ **統一フォーマット**: 全 API エラーが統一された形式で表示

## 概要

アプリケーション全体で API エラーを**完全自動で**モーダル表示する共通処理を実装しました。
**個別のページでエラー処理や withAutoError のラップも不要です。**

## Next.js の標準 Error Boundary との違い

### Next.js の`error.tsx`

- レンダリング中のエラーをキャッチ
- 非同期 API 呼び出しのエラーは自動キャッチできない

### 本実装

- **非同期 API エラーを完全自動で表示**
- Server Actions とクライアントサイド API の両方に対応
- **1 行もエラー処理コードを書く必要なし**

## 実装内容

### 1. ErrorContext (`lib/contexts/ErrorContext.tsx`)

- React Context ベースのグローバルエラー管理
- CustomEvent を使用してアプリケーション全体でエラーイベントをリッスン

### 2. createAutoErrorProxy (`lib/api/createAutoErrorProxy.ts`)

- Server Actions を自動的にラップする Proxy
- すべての Server Actions のエラーを自動キャッチ

### 3. 統一された Actions (`lib/actions/index.ts`)

- すべての Server Actions をまとめてエクスポート
- 自動エラー表示機能が組み込み済み

## 使用方法

### 統一された Actions を使用（推奨）

**エラー処理を 1 行も書く必要がありません！**

```tsx
'use client';

import { userActions } from '@/lib/actions';

export default function MyPage() {
  const loadUsers = async () => {
    const result = await userActions.getUsers();

    // エラー時は自動でモーダル表示される！
    // 成功時のみ処理を書けばOK
    if (result.success && result.data) {
      setUsers(result.data);
    }
  };

  return <div>...</div>;
}
```

### 新しい Server Actions を追加する方法

1. **Server Action を作成**

   ```bash
   # features/{feature}/actions/ に配置
   touch features/product/actions/getProducts.ts
   ```

2. **`lib/actions/index.ts` に登録**

   ```tsx
   import * as productGetActions from '@/features/product/actions/getProducts';

   export const actions = {
     // ...既存のactions
     product: createAutoErrorProxy(productGetActions),
   };
   ```

3. **登録チェック**
   ```bash
   pnpm check-actions
   # ✨ All Server Actions are properly registered!
   ```

未登録の actions がある場合、`pnpm build` 時に自動で検出され、登録方法が表示されます。

## 実装例

### 更新前（withAutoError を各ページで使用）

```tsx
import { getUsers } from '@/features/user/actions/getUsers';
import { withAutoError } from '@/lib/api/withAutoError';

const getUsersWithAutoError = withAutoError(getUsers); // ← 毎回必要だった

export default function UsersPage() {
  const result = await getUsersWithAutoError();
}
```

### 更新後（完全自動）

```tsx
import { userActions } from '@/lib/actions';

export default function UsersPage() {
  const result = await userActions.getUsers(); // ← これだけ！
  // エラー処理は完全自動
}
```

## 特徴

- ✅ **完全自動**: エラー処理コードを 1 行も書く必要なし
- ✅ **統一管理**: すべての Server Actions が`lib/actions/index.ts`で管理される
- ✅ **統一された UI**: すべてのエラーが同じデザインのモーダルで表示
- ✅ **型安全**: TypeScript 完全対応
- ✅ **保守性**: 新しい Actions の追加が簡単

## 更新済みページ

- `/admin/users` - ユーザー一覧
- `/admin/users/[id]` - ユーザー編集

すべてのページで`lib/actions`からインポートするだけで自動エラー表示が有効になります。
