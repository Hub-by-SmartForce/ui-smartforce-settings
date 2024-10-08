import React, { createContext } from 'react';
import styles from './SFTopBar.module.scss';
import { SFIconButton } from 'sfui';
import { SFTopBarUser } from './SFTopBarUser/SFTopBarUser';
import { SFLogo } from '../SFLogo/SFLogo';
import { SFTopBarApps } from './SFTopBarApps/SFTopBarApps';
import { AppEnv, ApplicationProduct, SettingsError } from '../../Models';
import {
  ToursReminderTooltip,
  ToursReminderTooltipProps
} from '../../Modules/Tour';
import { SFTopBarNotification } from './SFTopBarNotification/SFTopBarNotification';

interface SFTopBarEnvContextProps {
  enviroment: AppEnv;
  product: ApplicationProduct;
}

export const SFTopBarEnvContext = createContext<SFTopBarEnvContextProps>({
  enviroment: 'local',
  product: 'cc'
});

export interface SFTopBarProps {
  className?: string;
  enviroment: AppEnv;
  product: ApplicationProduct;
  siteTitle: string;
  isMinimal?: boolean;
  isTopTitleVisible?: boolean;
  isBottomTitleVisible?: boolean;
  actions?: React.ReactNode;
  userMenuItems?: React.ReactNode;
  featureReminderProps?: Omit<ToursReminderTooltipProps, 'children'>;
  officerCardUrl: string;
  onLogout: () => void;
  onMenuButtonClick: () => void;
  onError: (e: SettingsError) => void;
}

export const SFTopBar = ({
  className = '',
  enviroment,
  product,
  siteTitle,
  isMinimal = false,
  isTopTitleVisible = true,
  isBottomTitleVisible = true,
  actions,
  userMenuItems,
  featureReminderProps,
  officerCardUrl,
  onLogout,
  onMenuButtonClick,
  onError
}: SFTopBarProps): React.ReactElement<SFTopBarProps> => {
  const onGotIt = (value: boolean) => featureReminderProps?.onGotIt(value);

  return (
    <SFTopBarEnvContext.Provider value={{ enviroment, product }}>
      <div
        className={`${styles.sfTopBar} ${
          isBottomTitleVisible ? styles.showBottomContent : ''
        } ${className}`}
      >
        <div className={styles.topContent}>
          {!isMinimal && (
            <div className={styles.menu}>
              <ToursReminderTooltip
                open={!!featureReminderProps?.open}
                placement="bottom-start"
                onGotIt={onGotIt}
              >
                <SFIconButton
                  aria-label="Open navigation menu"
                  sfSize="medium"
                  sfIcon="Menu-1"
                  onClick={() => onMenuButtonClick()}
                />
              </ToursReminderTooltip>

              <SFLogo />
            </div>
          )}

          {isTopTitleVisible && (
            <h3 className={styles.siteTitle}>{siteTitle}</h3>
          )}

          <div className={styles.actions}>
            {!isMinimal && (
              <>
                {actions}
                <SFTopBarNotification
                  enviroment={enviroment}
                  onError={onError}
                />
              </>
            )}

            <SFTopBarApps />
          </div>

          <div className={styles.user}>
            <SFTopBarUser officerCardUrl={officerCardUrl} onLogout={onLogout}>
              {userMenuItems}
            </SFTopBarUser>
          </div>
        </div>

        {isBottomTitleVisible && (
          <div className={styles.bottomContent}>
            <h3 className={styles.siteTitle}>{siteTitle}</h3>
          </div>
        )}
      </div>
    </SFTopBarEnvContext.Provider>
  );
};
