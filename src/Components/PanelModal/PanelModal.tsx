import React, { Fragment } from 'react';
import { SFButtonProps } from 'sfui';
import { MediaContext } from '../../Context';
import {
  PanelModalDrawer,
  PanelModalDrawerClasses
} from './PanelModalDrawer/PanelModalDrawer';
import {
  PanelModalDialog,
  PanelModalDialogClasses
} from './PanelModalDialog/PanelModalDialog';

export type PanelModalAnchor = 'right' | 'left' | 'top' | 'bottom' | undefined;

export interface PanelModalButtonProps extends SFButtonProps {
  label: string;
  visible?: 'dialog' | 'drawer' | 'all';
}

export interface PanelModalClasses {
  drawer?: PanelModalDrawerClasses;
  dialog?: PanelModalDialogClasses;
}

export interface PanelModalProps {
  classes?: PanelModalClasses;
  isOpen: boolean;
  anchor?: PanelModalAnchor;
  headerTitle?: string;
  title?: string;
  children: React.ReactNode;
  dialogCloseButton?: PanelModalButtonProps;
  actionButton?: PanelModalButtonProps;
  altActionButton?: PanelModalButtonProps;
  subTitle?: string;
  onBack?: () => void;
  onClose: () => void;
}

export const PanelModal = ({
  classes,
  ...props
}: PanelModalProps): React.ReactElement<PanelModalProps> => {
  const { isPhone } = React.useContext(MediaContext);

  return (
    <Fragment>
      {isPhone && <PanelModalDrawer {...props} classes={classes?.drawer} />}

      {!isPhone && <PanelModalDialog {...props} classes={classes?.dialog} />}
    </Fragment>
  );
};
