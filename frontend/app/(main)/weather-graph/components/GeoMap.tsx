'use client';

import { GEO_URL } from '@/features/weather-graph/constants';
import { City } from '@/features/weather-graph/types';
import { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

interface GeoMapProps {
  cities: ReadonlyArray<City>;
  onSelectCity: ({
    city,
    element,
  }: {
    city: City;
    element: SVGPathElement;
  }) => void;
}

export const GeoMap: React.FC<GeoMapProps> = ({ cities, onSelectCity }) => {
  const [geoData, setGeoData] = useState<any | null>(null);
  const [hoveredCityId, setHoveredCityId] = useState<number | null>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  if (!geoData) {
    // 地図データ取得後に地図を描画しないと、Marker設定時にハイドレーションエラーになる
    return <div>Loading map...</div>;
  }

  return (
    <>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200, // 地図サイズ
          center: [137, 38], // 日本中心
        }}
        width={450}
        height={450}
        style={{
          width: 'auto',
          height: '100%', // ✅ 親divの高さに合わせる
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === 'Japan')
              .map((geo) => (
                <Geography
                  key={
                    // prefer stable identifiers from topojson properties when available
                    geo.properties.iso_a3 || geo.properties.name || geo.rsmKey
                  }
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                />
              ))
          }
        </Geographies>

        {cities.map((city) => {
          const isHover = hoveredCityId === city.id;
          return (
            <Marker
              key={city.id}
              coordinates={[city.longitude, city.latitude]}
              className="cursor-pointer hover:bg-gray-200 rounded-full"
              onMouseEnter={() => setHoveredCityId(city.id)}
              onMouseLeave={() => setHoveredCityId(null)}
              onClick={(event) =>
                onSelectCity({ city, element: event.currentTarget })
              }
            >
              <circle
                r={isHover ? 8 : 6}
                fill={isHover ? '#fb923c' : '#60a5fa'}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                textAnchor="middle"
                y={isHover ? -12 : -10}
                className={isHover ? 'text-sm' : 'text-xs'}
              >
                {city.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </>
  );
};
