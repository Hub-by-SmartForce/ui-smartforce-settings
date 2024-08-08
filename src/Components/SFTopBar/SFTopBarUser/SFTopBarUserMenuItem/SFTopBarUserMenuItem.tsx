import React from 'react';
import styles from './SFTopBarUserMenuItem.module.scss';

import { SFMenuItem, SFText } from 'sfui';

export interface SFTopBarUserMenuItemProps {
  className?: string;
  title?: string;
  subTitle?: string;
  children?: React.ReactElement;
  onClick?: () => void;
}

export const SFTopBarUserMenuItem = React.forwardRef(
  (
    {
      className = '',
      title,
      subTitle,
      children,
      onClick
    }: SFTopBarUserMenuItemProps,
    ref
  ): React.ReactElement<SFTopBarUserMenuItemProps> => {
    return (
      <SFMenuItem
        tabIndex={0}
        className={`${styles.SFTopBarUserMenuItem} ${className}`}
        onClick={onClick}
        innerRef={ref}
      >
        {children && <div className={styles.content}>{children}</div>}
        <div className={styles.textContainer}>
          <SFText type="component-1">{title}</SFText>
          {subTitle && (
            <SFText
              className={styles.subtitle}
              type="component-3"
              sfColor="neutral"
            >
              {subTitle}
            </SFText>
          )}
        </div>
      </SFMenuItem>
    );
  }
);
