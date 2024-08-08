import React from 'react';
import styles from './Loader.module.scss';
import { SFSpinner } from 'sfui';

export interface LoaderProps {
  className?: string;
}

export const Loader = ({
  className = ''
}: LoaderProps): React.ReactElement<LoaderProps> => {
  return (
    <div className={`${className} ${styles.loader}`}>
      <SFSpinner aria-label="Loading" size={40} />
    </div>
  );
};
