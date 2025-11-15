# API 呼び出し統一ガイド

このプロジェクトでは、Next.js App Router 向けに統一された API 呼び出しパターンを採用しています。

## 基本構造

```
lib/api/
  client.ts           # 共通APIクライアント

features/
  [feature]/
    types/
      index.ts        # 型定義
    actions/
      *.ts            # Server Actions
```

## 使い方

### 1. Server Actions（推奨）

サーバーコンポーネントやクライアントコンポーネントから呼び出す場合:

```typescript
// features/user/actions/getUsers.ts
'use server';

import { apiServer } from '@/lib/api/client';
import type { User } from '../types';

export async function getUsers() {
  return apiServer<User[]>('/api/users', {
    method: 'GET',
  });
}
```

### 2. コンポーネントから使用

```typescript
// app/(main)/users/page.tsx
import { getUsers } from '@/features/user/actions/getUsers';

export default async function UsersPage() {
  const result = await getUsers();

  if (!result.success) {
    return <div>エラー: {result.error}</div>;
  }

  return (
    <ul>
      {result.data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 3. クライアントコンポーネントから

```typescript
'use client';

import { getUsers } from '@/features/user/actions/getUsers';
import { useEffect, useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((result) => {
      if (result.success) {
        setUsers(result.data);
      }
    });
  }, []);

  // ...
}
```

## 自動機能

### ✅ Authorization ヘッダー自動付与

- サーバー側: httpOnly Cookie（accessToken/authToken）から自動取得
- クライアント側: credentials: 'include' で自動送信

### ✅ エラーハンドリング統一

- すべてのレスポンスは `{ success, data?, error? }` 形式

### ✅ 型安全

- TypeScript 型定義により自動補完とエラー検出

### ✅ 環境変数対応

- API_HOST 環境変数でバックエンド URL 切り替え

## CRUD 操作の例

### Create（作成）

```typescript
import { createUser } from '@/features/user/actions/createUser';

const result = await createUser({
  name: '山田太郎',
  email: 'yamada@example.com',
  password: 'secure-password',
  role: 'user',
});

if (result.success) {
  console.log('作成成功:', result.data);
}
```

### Read（読み取り）

```typescript
import { getUsers, getUserById } from '@/features/user/actions/getUsers';

// 一覧取得
const usersResult = await getUsers();

// 詳細取得
const userResult = await getUserById(1);
```

### Update（更新）

```typescript
import { updateUser } from '@/features/user/actions/updateUser';

const result = await updateUser(1, {
  name: '山田花子',
  email: 'hanako@example.com',
});

if (result.success) {
  console.log('更新成功:', result.data);
}
```

### Delete（削除）

```typescript
import { deleteUser } from '@/features/user/actions/updateUser';

const result = await deleteUser(1);

if (result.success) {
  console.log('削除成功');
}
```

## クライアントコンポーネントでの使用例

### フォーム送信

```typescript
'use client';

import { createCustomer } from '@/features/customer/actions/createCustomer';
import { useState } from 'react';

export function CustomerForm() {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await createCustomer({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    });

    if (result.success) {
      alert('作成成功！');
      e.currentTarget.reset();
    } else {
      setError(result.error || '作成に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
    </form>
  );
}
```

### 削除確認

```typescript
'use client';

import { deleteCustomer } from '@/features/customer/actions/updateCustomer';
import { useRouter } from 'next/navigation';

export function DeleteButton({ customerId }: { customerId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;

    const result = await deleteCustomer(customerId);

    if (result.success) {
      alert('削除しました');
      router.refresh(); // ページ再読み込み
    } else {
      alert(`削除失敗: ${result.error}`);
    }
  };

  return (
    <button onClick={handleDelete} className="btn-danger">
      削除
    </button>
  );
}
```

### リアルタイム更新（Server Action 内）

```typescript
'use server';

import { updateUser } from '@/features/user/actions/updateUser';
import { revalidatePath } from 'next/cache';

export async function toggleUserStatus(userId: number, isActive: boolean) {
  const result = await updateUser(userId, {
    // Note: バックエンドの型定義に応じて調整
    // is_active: !isActive,
  });

  if (result.success) {
    // Server Action内でキャッシュ再検証
    revalidatePath('/users');
    return result.data;
  }
  throw new Error(result.error);
}
```

## 権限と制限

バックエンドの RBAC により、以下の制限があります:

| 操作              | 一般ユーザー(user) | 管理者(admin) |
| ----------------- | ------------------ | ------------- |
| GET（一覧・詳細） | ✅ 可能            | ✅ 可能       |
| POST（作成）      | ❌ 403 エラー      | ✅ 可能       |
| PUT（更新）       | ❌ 403 エラー      | ✅ 可能       |
| DELETE（削除）    | ❌ 403 エラー      | ✅ 可能       |

一般ユーザーで作成・更新・削除を試みると、`{ success: false, error: "forbidden: insufficient permissions" }` が返されます。

## 追加する API

新しい API を追加する場合:

1. 型定義を追加: `features/[feature]/types/index.ts`
2. Server Action を作成: `features/[feature]/actions/[action].ts`
3. `apiServer<型>()` を使用して実装

例:

```typescript
'use server';

import { apiServer } from '@/lib/api/client';
import type { UpdateUserRequest, User } from '../types';

export async function updateUser(id: number, data: UpdateUserRequest) {
  return apiServer<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
```
