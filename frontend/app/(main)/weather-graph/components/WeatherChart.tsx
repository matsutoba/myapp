'use client';

import { Spinner } from '@/components/ui';
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
      <Suspense fallback={<Spinner open />}>
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
