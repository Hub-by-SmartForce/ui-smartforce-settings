import React, { useContext, useEffect, useState } from 'react';
import { SettingsContentRender } from '../SettingsContentRender';
import { ListManagment } from '../../Components';
import { SettingsError, UserTitle } from '../../Models';
import { SFButton } from 'sfui';
import { ApiContext, UserContext } from '../../Context';
import { TitleItem } from './TitleItem/TitleItem';
import { getTitles, moveTitle } from '../../Services';
import { TitleModal } from './TitleModal/TitleModal';
import { TitleDeleteDialog } from './TitleDeleteDialog/TitleDeleteDialog';
import { isRoleOwner } from '../../Helpers';

const getFilteredValues = (list: UserTitle[], filter: string): UserTitle[] => {
  return list.filter((l) =>
    l.name.toLowerCase().includes(filter.toLowerCase())
  );
};

export interface TitlesProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const Titles = ({
  onClose,
  onError
}: TitlesProps): React.ReactElement<TitlesProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { user } = useContext(UserContext);
  const [titles, setTitles] = useState<UserTitle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState<UserTitle>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const isOwner = isRoleOwner(user?.role.id);

  useEffect(() => {
    let isSubscribed: boolean = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const titles = await getTitles(apiBaseUrl);

        if (isSubscribed) {
          setTitles(titles);
          setIsLoading(false);
        }
      } catch (e: any) {
        onError(e);
      }
    };

    init();

    // Unsuscribed when cleaning up
    return () => {
      isSubscribed = false;
    };
  }, [apiBaseUrl, onError]);

  const onEdit = (title: UserTitle) => {
    setModalValue(title);
    setIsModalOpen(true);
  };

  const onCreate = () => {
    setIsModalOpen(true);
  };

  const onOpenDeleteModal = (title: UserTitle) => {
    setModalValue(title);
    setIsDeleteDialogOpen(true);
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const onTransitionEnd = () => {
    setModalValue(undefined);
  };

  const onFinish = async () => {
    setModalValue(undefined);
    setIsDeleteDialogOpen(false);
    setIsLoading(true);
    try {
      const response = await getTitles(apiBaseUrl);
      setTitles(response);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      onError(e);
    }
  };

  const onMove = async (id: string, newPriority: number) => {
    setIsLoading(true);
    try {
      const titles = await moveTitle(apiBaseUrl, id, newPriority);
      setTitles(titles);
      setIsLoading(false);
    } catch (e: any) {
      console.error('Titles::onMove', e);
      setIsLoading(false);
      onError(e);
    }
  };

  const onDown = (title: UserTitle) => {
    onMove(title.id, title.priority + 1);
  };
  const onUp = (title: UserTitle) => {
    onMove(title.id, title.priority - 1);
  };

  return (
    <>
      {modalValue && (
        <TitleDeleteDialog
          value={modalValue}
          isOpen={isDeleteDialogOpen}
          onError={onError}
          onDelete={onFinish}
          onClose={() => {
            onModalClose();
            setModalValue(undefined);
          }}
        />
      )}

      <TitleModal
        title={modalValue}
        isOpen={isModalOpen}
        onClose={() => {
          onClose();
          onModalClose();
        }}
        onBack={onModalClose}
        onError={onError}
        onFinish={onFinish}
        onTransitionEnd={onTransitionEnd}
      />

      <SettingsContentRender
        renderContent={() => (
          <ListManagment<UserTitle>
            renderCreateButton={
              isOwner
                ? (props) => (
                    <SFButton {...props} onClick={onCreate}>
                      Create Title
                    </SFButton>
                  )
                : undefined
            }
            emptyMessage={
              isOwner
                ? 'There are no titles created yet.'
                : 'Contact the agency owner to set the titles for the agency.'
            }
            label="Title"
            list={titles}
            isLoading={isLoading}
            filter={getFilteredValues}
            showItemMenu={isOwner}
            options={[
              {
                label: 'Edit title',
                onClick: onEdit
              },

              {
                label: 'Delete',
                onClick: onOpenDeleteModal
              }
            ]}
            renderItem={(
              item: UserTitle,
              isFirst: boolean,
              isLast: boolean
            ) => (
              <TitleItem
                title={item}
                showActions={isOwner}
                onDown={!isLast ? () => onDown(item) : undefined}
                onUp={!isFirst ? () => onUp(item) : undefined}
              />
            )}
          />
        )}
      />
    </>
  );
};
