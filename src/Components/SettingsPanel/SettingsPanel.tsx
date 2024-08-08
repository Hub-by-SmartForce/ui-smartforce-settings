import React from 'react';
import styles from './SettingsPanel.module.scss';

import { SFDrawer, SFIconButton } from 'sfui';
import { Loader } from '../Loader/Loader';

export interface SettingsPanelProps {
  children?: JSX.Element;
  isOpen: boolean;
  footerButtons?: JSX.Element;
  isLoading: boolean;
  onClose: () => void;
}

const SettingsPanel = ({
  children,
  isOpen,
  footerButtons,
  isLoading = false,
  onClose
}: SettingsPanelProps): React.ReactElement<SettingsPanelProps> => {
  return (
    <SFDrawer
      PaperProps={{
        className: `${styles.settingsPanel} ${
          footerButtons ? styles.withFooterButtons : ''
        }`
      }}
      onClose={onClose}
      open={isOpen}
      anchor="bottom"
    >
      {isLoading && <Loader />}
      <div
        className={`${styles.settingsPanelContainer} ${
          footerButtons ? styles.withFooterButtons : ''
        } ${isLoading ? styles.hide : ''}`}
      >
        <div className={styles.topBar}>
          <SFIconButton
            aria-label="Close panel"
            sfIcon="Close"
            sfSize="medium"
            onClick={onClose}
          />
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </SFDrawer>
  );
};

export default SettingsPanel;
