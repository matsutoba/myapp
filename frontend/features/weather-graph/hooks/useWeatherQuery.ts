import { addDyas } from '@/lib/date/addDays';
import { formatDate } from '@/lib/date/formatDate';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchWeatherApi } from 'openmeteo';

interface UseWeatherQueryProps {
  date: Date;
  latitude: number;
  longitude: number;
}

export const useWeatherQuery = ({
  date,
  latitude,
  longitude,
}: UseWeatherQueryProps) => {
  const currentDate = formatDate(date, { formatStr: 'yyyy-MM-dd' });
  const startDate = formatDate(addDyas(date, -1), { formatStr: 'yyyy-MM-dd' });
  const endDate = formatDate(addDyas(date, 1), { formatStr: 'yyyy-MM-dd' });

  const query = useSuspenseQuery({
    queryKey: ['weatherData', currentDate, latitude, longitude],
    queryFn: async () => {
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, {
        latitude,
        longitude,
        hourly: ['temperature_2m', 'rain'],
        timezone: 'Asia/Tokyo',
        start_date: startDate,
        end_date: endDate,
      });

      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly()!;

      // 時系列データの作成（時刻、気温、降水量）
      const times = Array.from(
        {
          length:
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        },
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000,
          ),
      );
      const temperature_2m = hourly.variables(0)!.valuesArray()!;
      const rain = hourly.variables(1)!.valuesArray()!;

      // 指定された日付のデータのみを抽出して整形
      const todayWeatherData = times.reduce<
        Array<{ time: Date; temperature_2m: number; rain: number }>
      >((acc, time, index) => {
        const isTargetDate =
          formatDate(time, { formatStr: 'yyyy-MM-dd' }) === currentDate;
        if (!isTargetDate) return acc;

        return [
          ...acc,
          {
            time,
            temperature_2m: temperature_2m[index],
            rain: rain[index],
          },
        ];
      }, []);
      return todayWeatherData;
    },
  });

  return query;
};
