import { z } from 'zod';

export const orderFormSchema = z.object({
  customerId: z.string().min(1, { message: '顧客を選択してください' }),
  amount: z.preprocess((v) => {
    // Keep empty string as-is so we can produce a required-field error.
    if (v === '' || v === null || v === undefined) return '';
    return Number(v);
  }, z.union([z.string().min(1, { message: '合計金額は必須です' }), z.number().min(0, { message: '合計金額は0以上を指定してください' })])),
  currency: z.string().min(1, { message: '通貨を選択してください' }),
  itemsCount: z.preprocess((v) => {
    // Keep empty as '' to trigger required error; otherwise coerce to Number
    if (v === '' || v === null || v === undefined) return '';
    return Number(v);
  }, z.union([z.string().min(1, { message: 'アイテム数は必須です' }), z.number().min(1, { message: 'アイテム数は1以上を指定してください' })])),
  orderChannel: z.enum(['web', 'app', 'store', 'phone']),
  category: z.string().max(255).optional(),
  status: z.enum(['completed', 'pending', 'refunded']),
});

export type OrderForm = z.infer<typeof orderFormSchema>;
