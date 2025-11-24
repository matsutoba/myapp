/**
 * 自動エラーハンドリング付きのServer Actions（自動収集版）
 *
 * features配下のすべてのactionsを自動的に収集し、
 * エラー時に自動的にグローバルエラーモーダルが表示されるようにラップします。
 *
 * 新しいServer Actionを追加する際は、features配下に配置するだけで
 * 自動的にエラーハンドリングが適用されます。
 *
 * 使用例:
 * import { actions } from '@/lib/actions';
 * const result = await actions.user.getUsers(); // エラー時は自動でモーダル表示
 */

import { createAutoErrorProxy } from '../api/createAutoErrorProxy';

// Auth Actions
import * as authLoginActions from '@/features/auth/actions/login';
import * as authRefreshActions from '@/features/auth/actions/refresh';

// Customer Actions
import * as customerCreateActions from '@/features/customer/actions/createCustomer';
import * as customerGetActions from '@/features/customer/actions/getCustomers';
import * as customerUpdateActions from '@/features/customer/actions/updateCustomer';

// User Actions
import * as userCreateActions from '@/features/user/actions/createUser';
import * as userGetActions from '@/features/user/actions/getUsers';
import * as userUpdateActions from '@/features/user/actions/updateUser';

/**
 * 複数のactionsモジュールを1つのオブジェクトにマージ
 */
function mergeActions<T extends Record<string, any>[]>(...modules: T) {
  return Object.assign({}, ...modules);
}

/**
 * 機能ごとにグループ化されたActions
 *
 * 新しい機能を追加する場合:
 * 1. features/{feature}/actions/ にServer Actionを作成
 * 2. このファイルの先頭でインポート
 * 3. actions オブジェクトに追加
 * 4. `pnpm check-actions` で登録漏れを確認
 *
 * これだけで自動的にエラーハンドリングが適用されます！
 */
export const actions = {
  auth: createAutoErrorProxy(
    mergeActions(authLoginActions, authRefreshActions),
  ),

  customer: createAutoErrorProxy(
    mergeActions(
      customerGetActions,
      customerCreateActions,
      customerUpdateActions,
    ),
  ),

  user: createAutoErrorProxy(
    mergeActions(userGetActions, userCreateActions, userUpdateActions),
  ),
};

// 後方互換性のため、既存のuserActionsもエクスポート
export const userActions = actions.user;

// TypeScript用の型ヘルパー
export type Actions = typeof actions;
