'use client';

import { DisplaySwitch } from '@/features/weather-graph/types';
import { formatDate } from '@/lib/date/formatDate';
import { useState } from 'react';
import { DisplayController } from './DisplayController';
import { WeatherChart } from './WeatherChart';

const cities = [
  { name: '札幌', latitude: 43.0667, longitude: 141.35 },
  { name: '東京', latitude: 35.6895, longitude: 139.6917 },
  { name: '名古屋', latitude: 35.1815, longitude: 136.9064 },
  { name: '大阪', latitude: 34.6938, longitude: 135.5011 },
  { name: '福岡', latitude: 33.6, longitude: 130.4167 },
] as const;

export const WeatherDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [displaySwitch, setDisplaySwitch] = useState<DisplaySwitch>({
    temp: true,
    rain: true,
  });

  return (
    <div>
      <h1 className="p-1 pb-2">
        {formatDate(currentDate, {
          formatStr: 'yyyy年MM月dd日',
        })}
        の気温と降水量
      </h1>
      <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
        データ提供: Open-Meteo
      </a>

      <div className="grid gap-8">
        <DisplayController
          currentDate={currentDate}
          currentDisplaySwitch={displaySwitch}
          onDateChange={(date) => {
            setCurrentDate(date);
          }}
          onDisplaySwitchChange={(newSwitch) => {
            setDisplaySwitch(newSwitch);
          }}
        />

        <div className="grid grid-cols-2 gap-1">
          {cities.map((city) => (
            <WeatherChart
              date={currentDate}
              displaySwitch={displaySwitch}
              key={city.name}
              cityName={city.name}
              latitude={city.latitude}
              longitude={city.longitude}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
