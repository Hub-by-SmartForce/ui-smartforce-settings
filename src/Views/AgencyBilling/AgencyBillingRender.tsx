import React from 'react';
import styles from './AgencyBillingRender.module.scss';
import { SettingsContentRender } from '../SettingsContentRender';
import { AgencyBilling, AgencyBillingProps } from './AgencyBilling';

export interface AgencyBillingRenderProps extends AgencyBillingProps {}

export const AgencyBillingRender = (
  props: AgencyBillingRenderProps
): React.ReactElement<AgencyBillingRenderProps> => {
  return (
    <div className={styles.agencyBillingRender}>
      <SettingsContentRender
        renderContent={() => <AgencyBilling {...props} />}
      />
    </div>
  );
};
