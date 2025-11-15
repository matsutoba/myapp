'use client';

import { City, DisplayKind } from '@/features/weather-graph/types';
import React, { Suspense } from 'react';
import { WeatherChartContent } from './WaetherChartContent';

interface WeatherChartProps {
  date: Date;
  city: City;
  displayKind: DisplayKind;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  date,
  city: { latitude, longitude, name: cityName },
  displayKind,
}) => {
  return (
    <div className="w-full h-80 relative">
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
          displayKind={displayKind}
          date={date}
          latitude={latitude}
          longitude={longitude}
        />
      </Suspense>
    </div>
  );
};
