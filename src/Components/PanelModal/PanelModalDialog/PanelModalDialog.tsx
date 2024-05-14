import React from 'react';
import styles from './PanelModalDialog.module.scss';
import { SFDialog, SFScrollable, SFButton, SFText } from 'sfui';
import { PanelModalProps } from '../PanelModal';

export interface PanelModalDialogClasses {
  root?: string;
  paper?: string;
  container?: string;
  content?: string;
  header?: string;
}

export interface PanelModalDialogProps
  extends Omit<PanelModalProps, 'classes'> {
  classes?: PanelModalDialogClasses;
}

export const PanelModalDialog = ({
  isOpen,
  headerTitle,
  title,
  children,
  dialogCloseButton,
  classes,
  actionButton,
  altActionButton,
  subTitle,
  onClose
}: PanelModalDialogProps): React.ReactElement<PanelModalDialogProps> => {
  const showFooter = !!dialogCloseButton || !!actionButton || !!altActionButton;

  return (
    <SFDialog
      className={`${styles.panelModalDialog} ${classes?.root ?? ''}`}
      PaperProps={{
        className: `${styles.paper} ${classes?.paper ?? ''}`
      }}
      open={isOpen}
      onClose={onClose}
    >
      {headerTitle && (
        <div className={`${styles.header} ${classes?.header ?? ''}`}>
          <SFText type="component-1-extraBold">{headerTitle}</SFText>
        </div>
      )}
      <div
        className={`${styles.container} ${classes?.container ?? ''} ${
          title && showFooter ? styles.withTitleAndFooter : ''
        } ${title && !showFooter ? styles.withOnlyTitle : ''}`}
      >
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

        {showFooter && (
          <div className={styles.footer}>
            {altActionButton && (
              <SFButton
                className={styles.altActionButton}
                {...altActionButton}
                size="large"
              >
                {altActionButton.label}
              </SFButton>
            )}

            {dialogCloseButton && (
              <SFButton
                {...dialogCloseButton}
                size="large"
                onClick={dialogCloseButton.onClick ?? onClose}
              >
                {dialogCloseButton.label}
              </SFButton>
            )}

            {actionButton && (
              <SFButton {...actionButton} size="large">
                {actionButton.label}
              </SFButton>
            )}
          </div>
        )}
      </div>
    </SFDialog>
  );
};
