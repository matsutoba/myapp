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

/**
 * 非破壊的に型を厳密化するための補助関数
 *
 * 既存の `mergeActions` は互換性のため `any` を使用したまま維持します。
 * 新しい機能や段階的な移行では `mergeActionsTyped` を使用して、
 * 呼び出し元でより厳密な型を得られるようにします。
 *
 * 使い方の例:
 * const merged = mergeActionsTyped(userActions, customerActions);
 * // merged は userActions と customerActions の交差型になります。
 */
// このファイルは、コードベースがより厳密なアクションの型付けへ移行する間、
// 複数の型の位置で `any` の使用を意図的に許容しています。
// モジュール単位で `no-explicit-any` を無効化し、段階的に移行できるように
// 説明（注釈）を残しています。
/* eslint-disable @typescript-eslint/no-explicit-any --
  意図的：互換性を重視した段階的移行のため無効化しています。TODO: refactor-mergeActions を参照 */
export function mergeActionsTyped<
  A extends Record<string, (...args: any[]) => Promise<any>>,
>(a: A): A;
export function mergeActionsTyped<
  A extends Record<string, (...args: any[]) => Promise<any>>,
  B extends Record<string, (...args: any[]) => Promise<any>>,
>(a: A, b: B): A & B;
export function mergeActionsTyped<
  A extends Record<string, (...args: any[]) => Promise<any>>,
  B extends Record<string, (...args: any[]) => Promise<any>>,
  C extends Record<string, (...args: any[]) => Promise<any>>,
>(a: A, b: B, c: C): A & B & C;
export function mergeActionsTyped<
  A extends Record<string, (...args: any[]) => Promise<any>>,
  B extends Record<string, (...args: any[]) => Promise<any>>,
  C extends Record<string, (...args: any[]) => Promise<any>>,
  D extends Record<string, (...args: any[]) => Promise<any>>,
>(a: A, b: B, c: C, d: D): A & B & C & D;
// 注意: ファイルは段階的な移行のため、一部の箇所で `any` の使用を意図的に許容しています。
// ここで `no-explicit-any` ルールを無効にすることで、`mergeActionsTyped` への段階的移行中に
// 不要な ESLint エラーが発生するのを防ぎます。
/* eslint-disable @typescript-eslint/no-explicit-any, no-restricted-syntax --
  意図的：互換性を重視した段階的移行のため無効化しています。TODO: refactor-mergeActions を参照 */
export function mergeActionsTyped(...modules: Array<Record<string, any>>) {
  // ここで `as any` を使用しているのは互換性を保つための意図的な措置です。
  // features 内の各 action は異なるシグネチャを持ち得るため、
  // 厳密に型を結合すると既存の呼び出し箇所に大きな影響を与えます。
  //
  // 将来的には各機能を段階的に `mergeActionsTyped` に移行し、最終的に
  // `mergeActions` の型を厳密化する予定です（TODO: refactor-mergeActions）。
  // 現時点では非破壊的に振る舞うために `any` を残しています。
  return Object.assign({}, ...modules) as any;
}
/* eslint-enable @typescript-eslint/no-explicit-any, no-restricted-syntax */

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
import * as dashboardGetCustomerRankActions from '@/features/dashboard/actions/getCustomerRank';
import * as dashboardGetDashboardDataActions from '@/features/dashboard/actions/getDashboardData';
import * as dashboardGetMonthlyNewActions from '@/features/dashboard/actions/getMonthlyNewCustomers';
import * as dashboardGetOrderAnalyticsActions from '@/features/dashboard/actions/getOrderAnalytics';

/**
 * 複数のactionsモジュールを1つのオブジェクトにマージ
 * 型を保持するため、戻り値の型をマージしたモジュールの交差型にキャストする
 *
 * NOTE: `mergeActions` のジェネリクスは互換性を優先して `any` を使用しています。
 * `unknown` に厳密化すると、各 action が異なるパラメータ型を持つために
 * 大量の型エラーが発生し、既存の多数のモジュールや呼び出し箇所に影響します。
 */
// NOTE: older helper types (e.g. UnionToIntersection) were removed
// when cleaning up unused compatibility helpers.

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
    mergeActionsTyped(authLoginActions, authRefreshActions),
  ),

  customer: createAutoErrorProxy(
    mergeActionsTyped(
      customerGetActions,
      customerCreateActions,
      customerUpdateActions,
    ),
  ),

  user: createAutoErrorProxy(
    mergeActionsTyped(userGetActions, userCreateActions, userUpdateActions),
  ),

  order: createAutoErrorProxy(
    mergeActionsTyped(
      orderCreateActions,
      orderGetActions,
      orderUpdateActions,
      orderDeleteActions,
    ),
  ),

  dashboard: createAutoErrorProxy(
    mergeActionsTyped(
      dashboardGetOrderAnalyticsActions,
      dashboardGetCustomerRankActions,
      dashboardGetMonthlyNewActions,
      dashboardGetDashboardDataActions,
    ),
  ),
};

// 後方互換性のため、既存のuserActionsもエクスポート
export const userActions = actions.user;

// TypeScript用の型ヘルパー
export type Actions = typeof actions;
