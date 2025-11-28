import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: '名前は必須です' })
    .max(100, { message: '名前は100文字以内で入力してください' }),
  email: z
    .string()
    .max(100, { message: 'メールアドレスは100文字以内で入力してください' })
    .email({ message: '正しいメールアドレスを入力してください' }),
  phone: z
    .string()
    .min(8, { message: '電話番号は8文字以上で入力してください' }),
  address: z
    .string()
    .max(255, { message: '住所は255文字以内で入力してください' })
    .optional(),
  company: z
    .string()
    .max(255, { message: '会社名は255文字以内で入力してください' })
    .optional(),
  website: z
    .string()
    .max(255, { message: 'Website は255文字以内で入力してください' })
    .optional(),
  tagsStr: z
    .string()
    .max(255, { message: 'Tags は255文字以内で入力してください' })
    .optional(),
  status: z.string().optional(),
  ownerId: z.string().pipe(z.coerce.number()).nullable().optional().catch(null),
  lastContactedAt: z.string().optional(),
  nextActionAt: z.string().optional(),
  notes: z
    .string()
    .max(500, { message: 'メモは500文字以内で入力してください' })
    .optional(),
});

export type CustomerForm = z.infer<typeof customerFormSchema>;
