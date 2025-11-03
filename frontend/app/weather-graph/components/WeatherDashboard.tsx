'use client';

import { AnimationPopup } from '@/components/AnimationPopup';
import { CITIES } from '@/features/weather-graph/constants';
import { City } from '@/features/weather-graph/types';
import { useState } from 'react';
import { GeoMap } from './GeoMap';
import { WeatherChart } from './WeatherChart';

export const WeatherDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [markerRef, setMarkerRef] = useState<SVGPathElement | null>(null);

  const handleSelectCity = ({
    city,
    element,
  }: {
    city: City;
    element: SVGPathElement;
  }) => {
    setSelectedCity(city);
    setMarkerRef(element);
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <GeoMap cities={CITIES} onSelectCity={handleSelectCity} />
      <AnimationPopup
        isOpen={!!selectedCity}
        referenceElement={markerRef}
        onClose={() => setSelectedCity(null)}
      >
        <WeatherChart date={currentDate} city={selectedCity!} />
      </AnimationPopup>
    </div>
  );
};
