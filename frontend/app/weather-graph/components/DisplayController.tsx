import { DisplaySwitch } from '@/features/weather-graph/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DisplayControllerProps {
  currentDate: Date;
  currentDisplaySwitch: DisplaySwitch;
  onDateChange: (date: Date) => void;
  onDisplaySwitchChange: (newSwitch: any) => void;
}

export const DisplayController: React.FC<DisplayControllerProps> = ({
  currentDate,
  currentDisplaySwitch,
  onDateChange,
  onDisplaySwitchChange,
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
    <div className="border rounded-full w-300px p-2 flex items-center justify-center">
      <button onClick={handlePrev}>
        <ChevronLeft />
      </button>
      {currentDate.toLocaleDateString()}
      <button onClick={handleNext}>
        <ChevronRight />
      </button>
      <input
        id="tempCheckbox"
        type="checkbox"
        className="ml-4"
        checked={currentDisplaySwitch.temp}
        onChange={(e) =>
          onDisplaySwitchChange({
            temp: e.target.checked,
            rain: currentDisplaySwitch.rain,
          })
        }
      />
      <label htmlFor="tempCheckbox">気温</label>
      <input
        id="rainCheckbox"
        type="checkbox"
        className="ml-2"
        checked={currentDisplaySwitch.rain}
        onChange={(e) =>
          onDisplaySwitchChange({
            temp: currentDisplaySwitch.temp,
            rain: e.target.checked,
          })
        }
      />
      <label htmlFor="rainCheckbox">降水量</label>
    </div>
  );
};
