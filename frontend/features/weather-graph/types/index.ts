export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface DisplayKind {
  temp: boolean;
  rain: boolean;
}

export type DisplayMode = 'map' | 'dashboard';
