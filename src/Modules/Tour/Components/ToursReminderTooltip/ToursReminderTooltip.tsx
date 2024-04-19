import React, { useEffect, useState } from 'react';
import { SFTooltip } from 'sfui';
import { ToursReminderContent } from './TourTooltipContent/ToursReminderContent';

export interface ToursReminderTooltipProps {
  open: boolean;
  children: React.ReactNode;
  onGotIt: (checked: boolean) => void;
}

export const ToursReminderTooltip = ({
  open,
  children,
  onGotIt
}: ToursReminderTooltipProps): React.ReactElement<ToursReminderTooltipProps> => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (open) setChecked(false);
  }, [open]);

  return (
    <SFTooltip
      open={open}
      title=""
      placement="right"
      content={
        <ToursReminderContent
          checked={checked}
          onCheckedChange={(c) => setChecked(c)}
          onGotIt={() => onGotIt(checked)}
        />
      }
    >
      <div>{children}</div>
    </SFTooltip>
  );
};
