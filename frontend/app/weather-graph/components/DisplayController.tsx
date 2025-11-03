import { DisplayKind, DisplayMode } from '@/features/weather-graph/types';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MapPinned,
} from 'lucide-react';

interface DisplayControllerProps {
  currentDate: Date;
  currentDisplayKind: DisplayKind;
  currentDisplayMode: DisplayMode;
  onDateChange: (date: Date) => void;
  onDisplaySwitchChange: (newSwitch: any) => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

export const DisplayController: React.FC<DisplayControllerProps> = ({
  currentDate,
  currentDisplayKind,
  currentDisplayMode,
  onDateChange,
  onDisplaySwitchChange,
  onDisplayModeChange,
}) => {
  const handlePrev = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  return (
    <div className="h-12 flex gap-4 mb-4 items-center">
      <div className="px-2 h-full border rounded-md flex items-center gap-4">
        <span>表示モード</span>
        <div className="flex">
          <button
            className="hover:bg-gray-200 rounded-full p-2"
            onClick={() => onDisplayModeChange('map')}
          >
            <MapPinned
              color={currentDisplayMode === 'map' ? '#60a5fa' : undefined}
            />
          </button>
          <button
            className="hover:bg-gray-200 rounded-full p-2"
            onClick={() => onDisplayModeChange('dashboard')}
          >
            <LayoutDashboard
              color={currentDisplayMode === 'dashboard' ? '#60a5fa' : undefined}
            />
          </button>
        </div>
      </div>

      <div className="px-2 h-full border rounded-md flex items-center justify-center gap-6">
        <div className="flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="hover:bg-gray-200 rounded-full"
          >
            <ChevronLeft />
          </button>
          {currentDate.toLocaleDateString()}
          <button
            onClick={handleNext}
            className="hover:bg-gray-200 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="flex gap-2">
          <div>
            <input
              id="tempCheckbox"
              type="checkbox"
              className="mr-1"
              checked={currentDisplayKind.temp}
              onChange={(e) =>
                onDisplaySwitchChange({
                  temp: e.target.checked,
                  rain: currentDisplayKind.rain,
                })
              }
            />
            <label htmlFor="tempCheckbox">気温</label>
          </div>
          <div>
            <input
              id="rainCheckbox"
              type="checkbox"
              className="mr-1"
              checked={currentDisplayKind.rain}
              onChange={(e) =>
                onDisplaySwitchChange({
                  temp: currentDisplayKind.temp,
                  rain: e.target.checked,
                })
              }
            />
            <label htmlFor="rainCheckbox">降水量</label>
          </div>
        </div>
      </div>

      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noreferrer"
        className="hover:opacity-60"
      >
        データ提供: Open-Meteo
      </a>
    </div>
  );
};
