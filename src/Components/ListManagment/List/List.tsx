import React from 'react';
import { SFCollapse } from 'sfui';
import { TransitionGroup } from 'react-transition-group';
import { Divider } from '../../Divider/Divider';
import { ListItem, ListManagmentMenuOption } from './ListItem/ListItem';

export interface ListProps<T> {
  list: T[];
  options: ListManagmentMenuOption<T>[];
  onClick?: (item: T) => void;
  renderItem: (item: T) => React.ReactElement;
}

export const List = <T,>({
  list,
  options,
  onClick,
  renderItem
}: ListProps<T>): React.ReactElement<ListProps<T>> => {
  return (
    <TransitionGroup component="div">
      {list.map((item: T, index: number) => (
        <SFCollapse key={(item as { id: string }).id} timeout={480}>
          <ListItem
            item={item}
            options={options}
            renderItem={renderItem}
            onClick={() => onClick && onClick(item)}
          />
          {index < list.length - 1 && <Divider size={1} />}
        </SFCollapse>
      ))}
    </TransitionGroup>
  );
};
