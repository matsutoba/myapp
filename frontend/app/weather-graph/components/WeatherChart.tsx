'use client';

import { useWeatherQuery } from '@/features/weather-graph/hooks/useWeatherQuery';
import { DisplaySwitch } from '@/features/weather-graph/types';
import { formatDate } from '@/lib/date/formatDate';
import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface WeatherChartProps {
  cityName: string;
  displaySwitch: DisplaySwitch;
  date: Date;
  latitude: number;
  longitude: number;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  cityName,
  displaySwitch,
  date,
  latitude,
  longitude,
}) => {
  const { isFetching, data: data2 } = useWeatherQuery({
    date,
    latitude,
    longitude,
  });
  const data = useMemo(() => {
    return data2?.map((item, index) => ({
      date: formatDate(item!.time, { formatStr: 'MM/dd HH:00' }),
      temp: displaySwitch.temp ? item!.temperature_2m : undefined,
      rain: displaySwitch.rain ? item!.rain : undefined,
    }));
  }, [data2, displaySwitch]);

  return (
    <div className="w-full h-70 relative">
      {isFetching && (
        <div
          className="w-full h-70 grid place-items-center absolute -top-10 left-0"
          aria-label="読み込み中"
        >
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      <ResponsiveContainer initialDimension={{ width: 1, height: 1 }}>
        <ComposedChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
          <text
            x={100} // グラフ中央付近
            y={60} // 上からの位置
            style={{ fontSize: 16, fontWeight: 'bold' }}
          >
            {cityName}
          </text>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={90}
            interval={2}
            tick={{ fontSize: 14 }}
          />
          <YAxis
            label={{
              value: '気温 (°C)',
              position: 'top',
              offset: 16,
              fontSize: 14,
            }}
            yAxisId="left"
            unit="°C"
            domain={[-5, 40]}
            tick={{ fontSize: 14 }}
            ticks={[0, 20, 40]}
          />
          <YAxis
            label={{
              value: '降水量 (mm)',
              position: 'top',
              offset: 16,
              fontSize: 14,
            }}
            yAxisId="right"
            orientation="right"
            domain={[0, 30]}
            tick={{ fontSize: 14 }}
            ticks={[0, 10, 30]}
            unit="mm"
          />
          <Bar yAxisId="right" dataKey="rain" fill="#60a5fa" barSize={20} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temp"
            stroke="#fb923c"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
