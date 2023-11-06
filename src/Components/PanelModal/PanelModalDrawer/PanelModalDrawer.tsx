import React from 'react';
import styles from './PanelModalDrawer.module.scss';
import { SFButton, SFDrawer, SFIconButton, SFScrollable, SFText } from 'sfui';
import { PanelModalProps } from '../PanelModal';

export interface PanelModalDrawerClasses {
  paper?: string;
  content?: string;
}

export interface PanelModalDrawerProps
  extends Omit<PanelModalProps, 'classes'> {
  classes?: PanelModalDrawerClasses;
}

export const PanelModalDrawer = ({
  isOpen,
  anchor = 'bottom',
  headerTitle,
  title,
  children,
  classes,
  actionButton,
  altActionButton,
  onBack,
  onClose
}: PanelModalDrawerProps): React.ReactElement<PanelModalDrawerProps> => {
  return (
    <SFDrawer
      anchor={anchor}
      open={isOpen}
      PaperProps={{
        className: `${styles.panelModalDrawer} ${classes?.paper ?? ''}`
      }}
    >
      <div className={styles.header}>
        {onBack && (
          <SFIconButton sfIcon="Left-7" sfSize="medium" onClick={onBack} />
        )}

        {headerTitle && (
          <SFText type="component-1-extraBold">{headerTitle}</SFText>
        )}

        <SFIconButton
          className={styles.closeButton}
          sfIcon="Close"
          buttonSize="medium"
          iconSize="medium"
          onClick={onClose}
        />
      </div>

      {title && <h4>{title}</h4>}

      <SFScrollable className={`${styles.content} ${classes?.content ?? ''}`}>
        {children}
      </SFScrollable>

      {actionButton && (
        <div className={styles.footer}>
          <SFButton fullWidth {...actionButton}>
            {actionButton.label}
          </SFButton>

          {altActionButton && (
            <SFButton fullWidth {...altActionButton}>
              {altActionButton.label}
            </SFButton>
          )}
        </div>
      )}
    </SFDrawer>
  );
};
