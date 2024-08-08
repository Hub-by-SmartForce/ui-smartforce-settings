import React from 'react';
import styles from './AgencyAreasLIstItem.module.scss';
import { Avatar } from '../../../../Components/Avatar/Avatar';
import { SFIconButton, SFMenu, SFMenuItem, SFText } from 'sfui';
import { Area } from '../../../../Models';
import { InteractiveBox } from '../../../../Components';

export interface AgencyAreasListItemProps {
  area: Area;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const AgencyAreasListItem = ({
  area,
  onClick,
  onDelete,
  onEdit
}: AgencyAreasListItemProps): React.ReactElement<AgencyAreasListItemProps> => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<
    HTMLButtonElement | undefined
  >(undefined);

  const onMenuOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMenuAnchorElement(e.currentTarget);
  };

  const onMenuClose = () => setMenuAnchorElement(undefined);

  const onSeeInfo = () => {
    onClick();
    onMenuClose();
  };

  const onAreaEdit = () => {
    onEdit();
    onMenuClose();
  };

  const onAreaDelete = () => {
    onDelete();
    onMenuClose();
  };

  return (
    <InteractiveBox className={styles.agencyAreasListItem} onClick={onClick}>
      <Avatar size="small" acronym={area.acronym} />
      <SFText type="component-2">{area.name}</SFText>
      <div
        role="presentation"
        className={styles.menu}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <SFIconButton
          rotate="left"
          sfIcon="Other"
          sfSize="small"
          onClick={onMenuOpen}
        />

        <SFMenu
          autoFocus={false} // eslint-disable-line jsx-a11y/no-autofocus
          anchorEl={menuAnchorElement}
          open={Boolean(menuAnchorElement)}
          onClose={onMenuClose}
          variant="menu"
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SFMenuItem tabIndex={0} onClick={onSeeInfo}>
            See area information
          </SFMenuItem>
          <SFMenuItem tabIndex={0} onClick={onAreaEdit}>
            Edit Area
          </SFMenuItem>
          <SFMenuItem tabIndex={0} onClick={onAreaDelete}>
            Delete
          </SFMenuItem>
        </SFMenu>
      </div>
    </InteractiveBox>
  );
};
