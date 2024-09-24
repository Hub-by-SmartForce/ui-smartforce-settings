import React from 'react';
import styles from './H3Alt.module.scss';

export interface H3AltProps {
  children: string;
}

export const H3Alt = ({
  children
}: H3AltProps): React.ReactElement<H3AltProps> => {
  return <h3 className={styles.h3Alt}>{children}</h3>;
};
