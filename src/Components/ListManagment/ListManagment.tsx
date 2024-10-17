import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from './ListManagment.module.scss';
import { SFButton, SFButtonProps, SFSearch, SFSpinner, SFText } from 'sfui';
import { Divider } from '../Divider/Divider';
import { NoResults } from './NoResults/NoResults';
import { List } from './List/List';
import { ListManagmentMenuOption } from './List/ListItem/ListItem';

const LIST_LIMIT = 10;

export { ListManagmentMenuOption };

export interface ListManagmentProps<T> {
  renderCreateButton: (
    props: Partial<SFButtonProps>
  ) => React.ReactElement<SFButtonProps>;
  showItemMenu?: boolean;
  emptyMessage: string;
  label: string;
  list: T[];
  isLoading: boolean;
  options: ListManagmentMenuOption<T>[];
  filter: (list: T[], filter: string) => T[];
  pagination?: boolean;
  onClick?: (item: T) => void;
  renderItem: (
    item: T,
    isFirst: boolean,
    isLast: boolean
  ) => React.ReactElement;
}

export const ListManagment = <T,>(
  props: ListManagmentProps<T>
): React.ReactElement<ListManagmentProps<T>> => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [limit, setLimit] = useState<number>(LIST_LIMIT);
  const refSearchValueLength = useRef<number>(searchValue.length);
  const hasPagination = props.pagination !== false;

  useEffect(() => {
    if (searchValue.length > 2 || refSearchValueLength.current > 2) {
      setLimit(LIST_LIMIT);
    }

    refSearchValueLength.current = searchValue.length;
  }, [searchValue]);

  const filteredList =
    searchValue.length > 2 ? props.filter(props.list, searchValue) : props.list;
  const visibleList: T[] = hasPagination
    ? filteredList.slice(0, limit)
    : filteredList;
  const isListEmpty: boolean = props.list.length === 0;

  return (
    <div className={styles.listManagment}>
      <div
        className={`${styles.header} ${isListEmpty ? styles.emptyList : ''}`}
      >
        {props.renderCreateButton({
          fullWidth: true,
          sfColor: 'blue',
          variant: 'outlined',
          size: 'medium'
        })}

        {!isListEmpty && (
          <div className={styles.searchField}>
            <SFSearch
              label={`Search ${props.label.toLowerCase()}`}
              value={searchValue}
              onChange={(v: string) => setSearchValue(v)}
            />
          </div>
        )}

        <div className={styles.divider}>
          <Divider size={2} />
        </div>
      </div>

      <div className={styles.list}>
        {props.isLoading && (
          <div className={styles.spinner}>
            <SFSpinner aria-label="Loading" />
          </div>
        )}

        {!props.isLoading && (
          <Fragment>
            {isListEmpty && (
              <SFText className={styles.emptyMsg} type="component-2">
                {props.emptyMessage}
              </SFText>
            )}

            {!isListEmpty && (
              <Fragment>
                {filteredList.length === 0 && (
                  <NoResults
                    label={props.label.toLowerCase()}
                    filter={searchValue}
                  />
                )}

                {filteredList.length > 0 && (
                  <Fragment>
                    <List
                      showItemMenu={props.showItemMenu}
                      list={visibleList}
                      options={props.options}
                      onClick={props.onClick}
                      renderItem={props.renderItem}
                    />

                    {hasPagination && limit < filteredList.length && (
                      <SFButton
                        fullWidth
                        sfColor="grey"
                        size="medium"
                        variant="text"
                        onClick={() => setLimit((limit) => limit + LIST_LIMIT)}
                      >
                        See More
                      </SFButton>
                    )}

                    {hasPagination &&
                      visibleList.length === filteredList.length &&
                      limit > LIST_LIMIT && (
                        <SFButton
                          fullWidth
                          sfColor="grey"
                          size="medium"
                          variant="text"
                          onClick={() => setLimit(LIST_LIMIT)}
                        >
                          See Less
                        </SFButton>
                      )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};
