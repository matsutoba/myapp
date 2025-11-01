'use client';

import { DisplaySwitch } from '@/features/weather-graph/types';
import React, { Suspense } from 'react';
import { WeatherChartContent } from './WaetherChartContent';

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
  return (
    <div className="w-full h-70 relative">
      <Suspense
        fallback={
          <div
            className="w-full h-70 grid place-items-center absolute -top-10 left-0"
            aria-label="読み込み中"
          >
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        }
      >
        <WeatherChartContent
          cityName={cityName}
          displaySwitch={displaySwitch}
          date={date}
          latitude={latitude}
          longitude={longitude}
        />
      </Suspense>
    </div>
  );
};
