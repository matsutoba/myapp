import { z } from 'zod';

export const customerFormSchema = z.object({
  company: z
    .string()
    .min(1, { message: '会社名は必須です' })
    .max(255, { message: '会社名は255文字以内で入力してください' }),
  contactName: z
    .string()
    .min(1, { message: '担当者名は必須です' })
    .max(100, { message: '担当者名は100文字以内で入力してください' }),
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
  customerRank: z
    .string()
    .optional()
    .refine(
      (val) => !val || ['vip', 'gold', 'silver', 'bronze'].includes(val),
      {
        message: 'ランクは vip, gold, silver, bronze から選択してください',
      },
    ),
});

export type CustomerForm = z.infer<typeof customerFormSchema>;
