import { format, Locale } from 'date-fns';
import { ja } from 'date-fns/locale';

type DateFormatOptions = {
  formatStr?: string;
  locale?: Locale;
};

export const formatDate = (
  date: Date | string | number,
  options: DateFormatOptions = {},
): string => {
  const { formatStr = 'MM/dd HH:mm', locale = ja } = options;

  const parsed =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return format(parsed, formatStr, { locale });
};
