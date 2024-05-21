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
  subTitle,
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

      {title && (
        <div className={styles.contentTitle}>
          <SFText type="component-title">{title}</SFText>
          {subTitle && (
            <SFText sfColor="neutral" type="component-2">
              {subTitle}
            </SFText>
          )}
        </div>
      )}

      <SFScrollable className={`${styles.content} ${classes?.content ?? ''}`}>
        {children}
      </SFScrollable>

      {actionButton &&
        (!actionButton.visible || actionButton.visible === 'drawer') && (
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
