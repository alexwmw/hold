import clsx from 'clsx';
import { BanIcon, Circle, CircleCheck } from 'lucide-react';
import type { FocusEvent } from 'react';
import { useState } from 'react';

import styles from './Scheduling.module.css';

import Button from '@/components/primitives/Button';
import Card from '@/components/primitives/Card';
import Setting from '@/components/primitives/Setting';
import { SchedulingDays, SchedulingDaysPresetButtons } from '@/entries/options/tabs/Scheduling/SchedulingDays';
import type { ScheduleWindow } from '@/types/schema';

type SchedulingWindowProps = {
  scheduleWindow: ScheduleWindow;
  disabled: boolean;
  windowIndex: number;
  removeWindow: () => Promise<void>;
  updateWindow: (update: Partial<ScheduleWindow>) => Promise<void>;
};

const SchedulingWindow = ({
  scheduleWindow,
  windowIndex,
  disabled,
  removeWindow,
  updateWindow,
}: SchedulingWindowProps) => {
  const [startValue, setStartValue] = useState(scheduleWindow.start);
  const [endValue, setEndValue] = useState(scheduleWindow.end);

  const startId = 'windowStart' + windowIndex;
  const endId = 'windowEnd' + windowIndex;
  const isRangeValid = startValue < endValue;
  const isSaved = scheduleWindow.start === startValue && scheduleWindow.end === endValue;

  const handleTimeInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const nextFocusedId = (e.relatedTarget as HTMLElement | null)?.id;
    // Do nothing if switching focus between the start and end input
    if (nextFocusedId === startId || nextFocusedId === endId) {
      return;
    }
    if (!isRangeValid) {
      return;
    }
    if (startValue === scheduleWindow.start && endValue === scheduleWindow.end) {
      return;
    }
    updateWindow({ start: startValue, end: endValue }).catch(console.error);
  };

  return (
    <Card
      padding
      className={clsx(styles.scheduleWindowSettingsGrid, styles.scheduleWindowCard, disabled && styles.disabled)}
    >
      <div className={styles.scheduleWindowHeader}>
        <div>
          <strong>Schedule {windowIndex + 1}</strong>
        </div>
        {scheduleWindow.id !== '_initial' ? (
          <Button
            variant='danger'
            disabled={disabled}
            onClick={() => {
              removeWindow().catch(console.error);
            }}
          >
            Remove
          </Button>
        ) : null}
      </div>

      <div className={styles.scheduleWindowDays}>
        <SchedulingDaysPresetButtons
          disabled={disabled}
          updateWindow={updateWindow}
          days={scheduleWindow.days}
        />
        <SchedulingDays
          days={scheduleWindow.days}
          disabled={disabled}
          updateWindow={updateWindow}
          windowId={scheduleWindow.id}
        />
      </div>
      <div className={styles.scheduleWindowStart}>
        <Setting
          settingId={startId}
          label='Start time'
          type='time'
          value={startValue}
          disabled={disabled}
          onChange={(event) => {
            setStartValue(event.target.value);
          }}
          onBlur={handleTimeInputBlur}
          hasError={!isRangeValid}
          fieldHint={'Must be earlier than end time.'}
        />
      </div>
      <div className={styles.scheduleWindowEnd}>
        <Setting
          settingId={endId}
          label='End time'
          type='time'
          value={endValue}
          disabled={disabled}
          onChange={(event) => {
            setEndValue(event.target.value);
          }}
          onBlur={handleTimeInputBlur}
          hasError={!isRangeValid}
          fieldHint={'Must be later than start time.'}
        />
      </div>
      <div className={styles.saveStatus}>
        {isSaved ? <CircleCheck /> : !isRangeValid ? <BanIcon /> : <Circle />}
        <span aria-hidden='true'>{isSaved ? 'Saved' : !isRangeValid ? 'Errors' : 'Unsaved'}</span>
      </div>
    </Card>
  );
};

export default SchedulingWindow;
