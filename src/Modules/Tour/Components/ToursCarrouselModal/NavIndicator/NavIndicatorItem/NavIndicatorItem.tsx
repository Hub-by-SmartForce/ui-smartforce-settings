import React from 'react';
import styles from './NavIndicatorItem.module.scss';

export interface NavIndicatorItemProps {
  selected: boolean;
}

export const NavIndicatorItem = ({
  selected
}: NavIndicatorItemProps): React.ReactElement<NavIndicatorItemProps> => {
  return (
    <div
      className={`${styles.navIndicatorItem} ${
        selected ? styles.selected : ''
      }`}
    ></div>
  );
};
