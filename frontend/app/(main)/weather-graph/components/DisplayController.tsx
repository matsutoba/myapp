import { Checkbox, IconButton } from '@/components/ui';
import { DisplayKind, DisplayMode } from '@/features/weather-graph/types';

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
          <IconButton
            icon="MapPinned"
            size="sm"
            onClick={() => onDisplayModeChange('map')}
            active={currentDisplayMode === 'map'}
            aria-label="マップ表示"
          />
          <IconButton
            icon="LayoutDashboard"
            size="sm"
            onClick={() => onDisplayModeChange('dashboard')}
            active={currentDisplayMode === 'dashboard'}
            aria-label="ダッシュボード表示"
          />
        </div>
      </div>

      <div className="px-2 h-full border rounded-md flex items-center justify-center gap-6">
        <div className="flex items-center justify-center">
          <IconButton
            icon="ChevronLeft"
            size="sm"
            onClick={handlePrev}
            aria-label="前の日"
          />
          {currentDate.toLocaleDateString()}
          <IconButton
            icon="ChevronRight"
            size="sm"
            onClick={handleNext}
            aria-label="次の日"
          />
        </div>

        <div className="flex gap-4">
          <Checkbox
            id="tempCheckbox"
            label="気温"
            checked={currentDisplayKind.temp}
            onChange={(e) =>
              onDisplaySwitchChange({
                temp: e.target.checked,
                rain: currentDisplayKind.rain,
              })
            }
          />
          <Checkbox
            id="rainCheckbox"
            label="降水量"
            checked={currentDisplayKind.rain}
            onChange={(e) =>
              onDisplaySwitchChange({
                temp: currentDisplayKind.temp,
                rain: e.target.checked,
              })
            }
          />
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
