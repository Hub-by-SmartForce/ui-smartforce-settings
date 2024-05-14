import React from 'react';
import styles from './AgencyAreasLIstItem.module.scss';
import { Avatar } from '../../../../Components/Avatar/Avatar';
import { SFIconButton, SFMenu, SFMenuItem, SFText } from 'sfui';
import { Area } from '../../../../Models';

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
    <div className={styles.agencyAreasListItem} onClick={onClick}>
      <Avatar size="small" acronym={area.acronym} />
      <SFText type="component-2">{area.name}</SFText>
      <div
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
          autoFocus={false}
          anchorEl={menuAnchorElement}
          open={Boolean(menuAnchorElement)}
          onClose={onMenuClose}
          variant="menu"
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SFMenuItem onClick={onSeeInfo}>See area information</SFMenuItem>
          <SFMenuItem onClick={onAreaEdit}>Edit Area</SFMenuItem>
          <SFMenuItem onClick={onAreaDelete}>Delete</SFMenuItem>
        </SFMenu>
      </div>
    </div>
  );
};
