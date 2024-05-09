import React from 'react';
import styles from './NavIndicator.module.scss';
import { NavIndicatorItem } from './NavIndicatorItem/NavIndicatorItem';

export interface NavIndicatorProps {
  size: number;
  selected: number;
}

export const NavIndicator = ({
  size,
  selected
}: NavIndicatorProps): React.ReactElement<NavIndicatorProps> => {
  return (
    <div className={styles.navIndicator}>
      {[...Array(size)].map((_n, i) => (
        <NavIndicatorItem
          key={`navindicator-item-${i}`}
          selected={selected === i}
        />
      ))}
    </div>
  );
};
