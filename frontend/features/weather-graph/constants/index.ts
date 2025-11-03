import { City } from '../types';

export const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const CITIES: City[] = [
  { id: 1, name: '札幌', latitude: 43.0667, longitude: 141.35 },
  { id: 2, name: '東京', latitude: 35.6895, longitude: 139.6917 },
  { id: 3, name: '名古屋', latitude: 35.1815, longitude: 136.9064 },
  { id: 4, name: '大阪', latitude: 34.6938, longitude: 135.5011 },
  { id: 5, name: '福岡', latitude: 33.6, longitude: 130.4167 },
] as const;
