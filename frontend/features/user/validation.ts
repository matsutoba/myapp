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

export default userCreateSchema;
