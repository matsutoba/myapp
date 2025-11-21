'use client';

import { Popup } from '@/components/ui';
import { CITIES } from '@/features/weather-graph/constants';
import { City, DisplayKind } from '@/features/weather-graph/types';
import { useState } from 'react';
import { GeoMap } from './GeoMap';
import { WeatherChart } from './WeatherChart';

interface GeoMapBoardProps {
  date: Date;
  displayKind: DisplayKind;
}

export const GeoMapBoard: React.FC<GeoMapBoardProps> = ({
  date: currentDate,
  displayKind,
}) => {
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
    <>
      <GeoMap cities={CITIES} onSelectCity={handleSelectCity} />
      <Popup
        isOpen={!!selectedCity}
        referenceElement={markerRef}
        onClose={() => setSelectedCity(null)}
      >
        <WeatherChart
          date={currentDate}
          city={selectedCity!}
          displayKind={displayKind}
        />
      </Popup>
    </>
  );
};
