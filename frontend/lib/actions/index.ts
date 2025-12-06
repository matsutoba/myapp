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

// Order Actions
import * as orderCreateActions from '@/features/order/actions/createOrder';
import * as orderDeleteActions from '@/features/order/actions/deleteOrder';
import * as orderGetActions from '@/features/order/actions/getOrders';
import * as orderUpdateActions from '@/features/order/actions/updateOrder';
// Dashboard Actions
import * as dashboardGetOrderAnalyticsActions from '@/features/dashboard/actions/getOrderAnalytics';

/**
 * 複数のactionsモジュールを1つのオブジェクトにマージ
 * 型を保持するため、戻り値の型をマージしたモジュールの交差型にキャストする
 *
 * NOTE: `mergeActions` のジェネリクスは互換性を優先して `any` を使用しています。
 * `unknown` に厳密化すると、各 action が異なるパラメータ型を持つために
 * 大量の型エラーが発生し、既存の多数のモジュールや呼び出し箇所に影響します。
 */
type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

function mergeActions<
  Modules extends Array<Record<string, (...args: any[]) => any>>,
>(...modules: Modules): UnionToIntersection<Modules[number]> {
  return Object.assign({}, ...modules) as UnionToIntersection<Modules[number]>;
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

  order: createAutoErrorProxy(
    mergeActions(
      orderCreateActions,
      orderGetActions,
      orderUpdateActions,
      orderDeleteActions,
    ),
  ),

  dashboard: createAutoErrorProxy(
    mergeActions(dashboardGetOrderAnalyticsActions),
  ),
};

// 後方互換性のため、既存のuserActionsもエクスポート
export const userActions = actions.user;

// TypeScript用の型ヘルパー
export type Actions = typeof actions;
