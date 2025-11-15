'use client';

import { CITIES } from '@/features/weather-graph/constants';
import { DisplayKind } from '@/features/weather-graph/types';
import { WeatherChart } from './WeatherChart';

interface WeatherDashboardProps {
  date: Date;
  displayKind: DisplayKind;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  date: currentDate,
  displayKind,
}) => {
  return (
    <div className="w-full h-full p-2 overflow-auto">
      <div className="grid gap-8">
        <div className="grid grid-cols-2 gap-1">
          {CITIES.map((city) => (
            <WeatherChart
              date={currentDate}
              key={city.name}
              city={city}
              displayKind={displayKind}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
