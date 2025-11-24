# Server Actions 登録チェックシステム

Server Actions の登録漏れを防ぐための自動チェックシステムです。

## 🎯 目的

`features/*/actions/` 配下に作成された Server Actions が、`lib/actions/index.ts`に登録されていない場合に自動検出し、警告します。

## 📋 チェック方法

### 1. ビルド時チェック (推奨)

`pnpm build` 実行時に自動チェックされます。

```bash
pnpm build
```

未登録の actions がある場合、ビルドが失敗し、登録方法が表示されます。

### 2. 手動チェック

```bash
pnpm check-actions
```

### 3. ESLint ルール (オプション)

`eslint.config.mjs` に以下を追加すると、エディタ上でリアルタイムに警告が表示されます:

```javascript
import checkActionsRule from './scripts/eslint-check-actions-rule.mjs';

export default [
  // ...他の設定
  {
    files: ['lib/actions/index.ts'],
    plugins: {
      custom: {
        rules: {
          'check-actions-registration': checkActionsRule,
        },
      },
    },
    rules: {
      'custom/check-actions-registration': 'error',
    },
  },
];
```

## 🔧 使用例

### 新しい Server Action を作成したとき

1. **action ファイルを作成**

   ```typescript
   // features/product/actions/getProducts.ts
   'use server';

   export async function getProducts() {
     // ...
   }
   ```

2. **ビルドまたはチェック実行**

   ```bash
   pnpm check-actions
   ```

3. **未登録の場合、以下のような出力が表示されます:**

   ````
   ⚠️  Unregistered: 1 action modules
      - product/getProducts

   📝 To register these actions, add them to lib/actions/index.ts:

   ```typescript
   // product actions
   import * as productGetProductsActions from '@/features/product/actions/getProducts';

   export const actions = {
     // ...既存の定義
     product: createAutoErrorProxy(mergeActions(productGetProductsActions)),
   };
   ````

   ```

   ```

4. **lib/actions/index.ts に登録**

   ```typescript
   import * as productGetProductsActions from '@/features/product/actions/getProducts';

   export const actions = {
     user: createAutoErrorProxy(
       mergeActions(userGetActions, userUpdateActions),
     ),
     product: createAutoErrorProxy(productGetProductsActions),
   };
   ```

5. **再度チェック**
   ```bash
   pnpm check-actions
   # ✨ All Server Actions are properly registered!
   ```

## 📂 対象ディレクトリ

以下のパターンに一致するファイルが自動検出されます:

```
features/
  └── {feature名}/
      └── actions/
          ├── *.ts         ← チェック対象
          ├── *.test.ts    ← 除外
          └── *.d.ts       ← 除外
```

## 🚀 CI/CD への統合

GitHub Actions などで以下を実行:

```yaml
- name: Check Server Actions Registration
  run: pnpm check-actions

- name: Build
  run: pnpm build
```

## 🎨 カスタマイズ

### チェック対象の変更

`scripts/check-actions.ts` の `FEATURES_DIR` を変更:

```typescript
const FEATURES_DIR = path.join(process.cwd(), 'src/features'); // 例
```

### 除外パターンの追加

```typescript
const actionFiles = fs.readdirSync(actionsDir).filter(
  (file) =>
    file.endsWith('.ts') &&
    !file.endsWith('.test.ts') &&
    !file.endsWith('.mock.ts') && // 追加
    !file.startsWith('_'), // 追加
);
```

## 💡 Tips

- **開発時**: 自動チェックを無効化したい場合は `package.json` の `build` スクリプトから `pnpm check-actions &&` を削除
- **型安全性**: `lib/actions/index.ts` で型エクスポートしているため、未登録の action は型エラーでも検出可能
- **命名規則**: action ファイル名は `{動詞}{名詞}.ts` (例: `getUsers.ts`, `updateUser.ts`) を推奨

## 🔗 関連ファイル

- `scripts/check-actions.ts` - チェックスクリプト本体
- `scripts/eslint-check-actions-rule.mjs` - ESLint カスタムルール
- `lib/actions/index.ts` - Server Actions 登録ファイル
- `lib/api/createAutoErrorProxy.ts` - 自動エラーハンドリング
