import React from 'react';
import styles from './ListItem.module.scss';
import { SFIconButton, SFMenu, SFMenuItem } from 'sfui';
import { InteractiveBox } from '../../../InteractiveBox/InteractiveBox';

export interface ListManagmentMenuOption<T> {
  label: string;
  disabled?: boolean;
  filter?: (item: T) => boolean;
  onClick: (item: T) => void;
  chip?: React.ReactElement;
}
export interface ListItemProps<T> {
  isFirst: boolean;
  isLast: boolean;
  showItemMenu?: boolean;
  item: T;
  options: ListManagmentMenuOption<T>[];
  renderItem: (
    item: T,
    isFirst: boolean,
    isLast: boolean
  ) => React.ReactElement;
  onClick?: () => void;
}

export const ListItem = <T,>({
  isFirst,
  isLast,
  showItemMenu = true,
  item,
  options,
  renderItem,
  onClick
}: ListItemProps<T>): React.ReactElement<ListItemProps<T>> => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<
    HTMLButtonElement | undefined
  >(undefined);

  const onMenuOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMenuAnchorElement(e.currentTarget);
  };

  const onMenuClose = () => setMenuAnchorElement(undefined);

  const onOptionClick = (o: ListManagmentMenuOption<T>) => {
    o.onClick(item);
    onMenuClose();
  };

  return (
    <InteractiveBox className={styles.listItem} onClick={onClick}>
      {renderItem(item, isFirst, isLast)}

      <div
        className={styles.menu}
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {showItemMenu && (
          <SFIconButton
            aria-label="Open item options"
            rotate="left"
            sfIcon="Other"
            sfSize="small"
            onClick={onMenuOpen}
          />
        )}

        <SFMenu
          autoFocus={false} // eslint-disable-line jsx-a11y/no-autofocus
          anchorEl={menuAnchorElement}
          open={Boolean(menuAnchorElement)}
          onClose={onMenuClose}
          variant="menu"
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ className: styles.menuPaper }}
        >
          {options
            .filter(
              (o: ListManagmentMenuOption<T>) => !o.filter || o.filter(item)
            )
            .map((o: ListManagmentMenuOption<T>) => (
              <SFMenuItem
                tabIndex={0}
                className={styles.listMenuItem}
                key={o.label}
                disabled={o.disabled}
                onClick={() => onOptionClick(o)}
              >
                {o.label}
                {o.chip}
              </SFMenuItem>
            ))}
        </SFMenu>
      </div>
    </InteractiveBox>
  );
};
