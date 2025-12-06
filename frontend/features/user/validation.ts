import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名前は必須です' })
    .max(100, { message: '名前は100文字以内で入力してください' }),
  email: z
    .string()
    .max(100, { message: 'メールアドレスは100文字以内で入力してください' })
    .email({ message: '正しいメールアドレスを入力してください' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' }),
  role: z.enum(['user', 'admin']).default('user'),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>;

// `userCreateSchema` を default export しないように変更しました。

export const userEditSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名前は必須です' })
    .max(100, { message: '名前は100文字以内で入力してください' }),
  email: z
    .string()
    .max(100, { message: 'メールアドレスは100文字以内で入力してください' })
    .email({ message: '正しいメールアドレスを入力してください' }),
  // 編集時のパスワードは任意。ただし、入力があれば8文字以上にする。
  // ブラウザのフォーム入力は未入力が空文字列（""）になるため、
  // 空文字列がそのまま来ると zod の min チェックに引っかかってしまう。
  // ここで z.preprocess を使い、空文字列を `undefined` に変換してから
  // optional な string の検証を行うことで、スキーマ側で正規化を一元化する。
  password: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z
      .string()
      .min(8, { message: 'パスワードは8文字以上で入力してください' })
      .optional(),
  ),
  role: z.enum(['user', 'admin']).default('user'),
});

export type UserEditForm = z.infer<typeof userEditSchema>;
