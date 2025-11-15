'use client';

import { DisplayKind, DisplayMode } from '@/features/weather-graph/types';
import { useState } from 'react';
import { DisplayController } from './DisplayController';
import { GeoMapBoard } from './GeoMapBoard';
import { WeatherDashboard } from './WeatherDashboard';

export const Main: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>('map');
  const [displayKind, setDisplayKind] = useState<DisplayKind>({
    temp: true,
    rain: true,
  });

  const handleDisplaySwitchChange = (newKind: DisplayKind) => {
    setDisplayKind(newKind);
  };

  const handleDisplayModeChange = (mode: 'map' | 'dashboard') => {
    setDisplayMode(mode);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <DisplayController
        currentDate={currentDate}
        currentDisplayKind={displayKind}
        currentDisplayMode={displayMode}
        onDateChange={handleDateChange}
        onDisplaySwitchChange={handleDisplaySwitchChange}
        onDisplayModeChange={handleDisplayModeChange}
      />

      {displayMode === 'map' && (
        <GeoMapBoard date={currentDate} displayKind={displayKind} />
      )}
      {displayMode === 'dashboard' && (
        <WeatherDashboard date={currentDate} displayKind={displayKind} />
      )}
    </div>
  );
};
