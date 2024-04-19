import React from 'react';
import styles from './TourResumeTab.module.scss';
import { SFButton, SFTheme, SFThemeProvider, createSFTheme } from 'sfui';
import { ThemeTypeContext } from '../../../../Context';

export interface TourResumeTabProps {
  onExit: () => void;
  onResume: () => void;
}

export const TourResumeTab = (
  props: TourResumeTabProps
): React.ReactElement<TourResumeTabProps> => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const theme: SFTheme = createSFTheme(themeType === 'day' ? 'night' : 'day');

  return (
    <div className={styles.tourResumeTab}>
      <SFThemeProvider theme={theme}>
        <h4>Feature Tours</h4>

        <div className={styles.actions}>
          <SFButton
            size="small"
            variant="outlined"
            sfColor="grey"
            onClick={props.onExit}
          >
            Exit
          </SFButton>
          <SFButton size="small" onClick={props.onResume}>
            Resume
          </SFButton>
        </div>
      </SFThemeProvider>
    </div>
  );
};
