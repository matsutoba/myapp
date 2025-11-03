'use client';

import { useWeatherQuery } from '@/features/weather-graph/hooks/useWeatherQuery';
import { DisplaySwitch } from '@/features/weather-graph/types';
import { formatDate } from '@/lib/date/formatDate';
import React, { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
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

export const WeatherChartContent: React.FC<WeatherChartProps> = ({
  cityName,
  displaySwitch,
  date,
  latitude,
  longitude,
}) => {
  const { data: weatherData } = useWeatherQuery({ date, latitude, longitude });

  const data = useMemo(() => {
    return weatherData?.map((item: any, index: number) => ({
      date: formatDate(item!.time, { formatStr: 'MM/dd HH:00' }),
      temp: displaySwitch.temp ? item!.temperature_2m : undefined,
      rain: displaySwitch.rain ? item!.rain : undefined,
    }));
  }, [weatherData, displaySwitch]);

  return (
    <>
      <h2 className="text-center font-bold">
        {formatDate(date, { formatStr: 'yyyy年MM月dd日' })} {cityName}
      </h2>
      <ResponsiveContainer initialDimension={{ width: 1, height: 1 }}>
        <ComposedChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
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
              fontSize: 12,
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
              fontSize: 12,
            }}
            yAxisId="right"
            orientation="right"
            domain={[0, 30]}
            tick={{ fontSize: 14 }}
            ticks={[0, 10, 30]}
            unit="mm"
          />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 12 }}
          />
          {displaySwitch.rain && (
            <Bar
              name="降水量"
              yAxisId="right"
              dataKey="rain"
              fill="#60a5fa"
              barSize={20}
            />
          )}

          {displaySwitch.temp && (
            <Line
              name="気温"
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#fb923c"
              strokeWidth={2}
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};
