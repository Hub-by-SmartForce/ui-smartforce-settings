import React from 'react';
import styles from './ToursReminderContent.module.scss';
import {
  SFTheme,
  createSFTheme,
  SFThemeProvider,
  SFText,
  SFButton,
  SFCheckbox
} from 'sfui';
import { ThemeTypeContext } from '../../../../../Context';

export interface ToursReminderContentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onGotIt: () => void;
}

export const ToursReminderContent = (
  props: ToursReminderContentProps
): React.ReactElement<ToursReminderContentProps> => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const theme: SFTheme = createSFTheme(themeType === 'day' ? 'night' : 'day');

  return (
    <div
      role="presentation"
      className={styles.tourTooltipContent}
      onClick={(e) => e.stopPropagation()}
    >
      <SFThemeProvider theme={theme}>
        <div className={styles.content}>
          <div className={styles.text}>
            <SFText type="component-1-medium">Feature Tours</SFText>
            <SFText type="component-tooltip-text">
              Learn more about our features anytime you need.
            </SFText>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.checkbox}>
            <SFCheckbox
              checked={props.checked}
              onChange={(_e, checked) => props.onCheckedChange(checked)}
            />
            <SFText type="component-chip-S-M" sfColor="neutral">
              Don't show this again
            </SFText>
          </div>

          <SFButton size="small" onClick={() => props.onGotIt()}>
            Got It
          </SFButton>
        </div>
      </SFThemeProvider>
    </div>
  );
};
