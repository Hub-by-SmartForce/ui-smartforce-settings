import React from 'react';
import styles from './AgencyBillingItem.module.scss';
import { SFText } from 'sfui';

export interface AgencyBillingItemProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const AgencyBillingItem = ({
  title,
  children,
  action
}: AgencyBillingItemProps): React.ReactElement<AgencyBillingItemProps> => {
  return (
    <div className={styles.agencyBillingItem}>
      <div className={styles.description}>
        <SFText
          className={styles.title}
          type="component-messages"
          sfColor="neutral"
        >
          {title}
        </SFText>

        {typeof children === 'string' && (
          <SFText type="component-1-medium">{children}</SFText>
        )}

        {typeof children !== 'string' && children}
      </div>

      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
};
