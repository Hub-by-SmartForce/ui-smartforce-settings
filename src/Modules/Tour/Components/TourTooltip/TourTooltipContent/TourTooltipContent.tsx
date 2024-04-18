import React, { useContext } from 'react';
import styles from './TourTooltipContent.module.scss';
import {
  SFTheme,
  createSFTheme,
  SFThemeProvider,
  SFText,
  SFIconButton,
  SFButton
} from 'sfui';
import { ThemeTypeContext } from '../../../../../Context';
import { TourContext } from '../../../context';

export interface TourTooltipContentProps {
  title: string;
  description: string;
  step: number;
  lastStep: number;
  onBack?: () => void;
  onNext?: () => void;
  onGotIt?: () => void;
}

export const TourTooltipContent = (
  props: TourTooltipContentProps
): React.ReactElement<TourTooltipContentProps> => {
  const { onClose: onTourClose } = useContext(TourContext);
  const { themeType } = React.useContext(ThemeTypeContext);
  const theme: SFTheme = createSFTheme(themeType === 'day' ? 'night' : 'day');

  return (
    <div className={styles.tourTooltipContent}>
      <SFThemeProvider theme={theme}>
        <div className={styles.content}>
          <div className={styles.text}>
            <SFText type="component-1-medium">{props.title}</SFText>
            <SFText type="component-tooltip-text">{props.description}</SFText>
          </div>

          <SFIconButton sfIcon="Close" sfSize="small" onClick={onTourClose} />
        </div>

        <div className={styles.footer}>
          <SFText
            type="component-tooltip-text"
            sfColor="neutral"
          >{`${props.step} of ${props.lastStep}`}</SFText>

          <div className={styles.actions}>
            {props.onBack && (
              <SFButton
                variant="outlined"
                sfColor="grey"
                size="small"
                onClick={props.onBack}
              >
                Back
              </SFButton>
            )}
            {props.onNext && (
              <SFButton size="small" onClick={props.onNext}>
                Next
              </SFButton>
            )}
            {props.onGotIt && (
              <SFButton size="small" onClick={props.onGotIt}>
                Got It
              </SFButton>
            )}
          </div>
        </div>
      </SFThemeProvider>
    </div>
  );
};
