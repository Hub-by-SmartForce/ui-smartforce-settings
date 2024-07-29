import React, { Fragment, useState } from 'react';
import styles from './SFLogo.module.scss';
import { CustomerContext } from '../../Context';
import { getStringAbbreviation } from '../../Helpers';

export interface SFLogoProps {
  className?: string;
}

export const SFLogo = ({
  className = ''
}: SFLogoProps): React.ReactElement<SFLogoProps> => {
  const { customer } = React.useContext(CustomerContext);
  const [errorBadge, setErrorBadge] = useState<boolean>(false);

  const onErrorBadge = () => setErrorBadge(true);

  return (
    <Fragment>
      {customer && (
        <div className={`${styles.SFLogo} ${className}`}>
          <div className={styles.imgContainer}>
            {customer.badge && !errorBadge && (
              <img
                className={styles.badge}
                src={customer.badge}
                alt="Badge"
                onError={onErrorBadge}
              />
            )}

            {(!customer.badge || errorBadge) && customer.full_name && (
              <p className={styles.abbreviation}>
                {getStringAbbreviation(customer.full_name)}
              </p>
            )}
          </div>

          <div className={styles.customerInfo}>
            <h3 className={styles.name}>{customer.full_name}</h3>
            <h5 className={styles.state}>{customer.state_name}</h5>
          </div>
        </div>
      )}
    </Fragment>
  );
};
