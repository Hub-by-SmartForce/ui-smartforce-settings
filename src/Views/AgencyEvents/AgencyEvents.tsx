import React from 'react';
import { SettingsContentRender } from '../SettingsContentRender';
import { SettingsError } from '../../Models/Error';
import { AgencyEventType } from '../../Models/AgencyEvents';
import { ListManagment } from '../../Components/ListManagment/ListManagment';
import { AgencyEventsModal } from './AgencyEventsModal/AgencyEventsModal';
import { AgencyEventsDeleteDialog } from './AgencyEventsDeleteDialog/AgencyEventsDeleteDialog';
import { getEventTypes } from '../../Services';
import { ApiContext } from '../../Context';
import { AgencyEventsItem } from './AgencyEventsItem/AgencyEventsItem';
import { SFButton, SFChip } from 'sfui';

export interface AgencyEventsProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

const getFilteredValues = (
  list: AgencyEventType[],
  filter: string
): AgencyEventType[] => {
  return list.filter((l) =>
    l.name.toLowerCase().includes(filter.toLowerCase())
  );
};

function sortEventTypes(events: AgencyEventType[]): AgencyEventType[] {
  return events.sort((a: AgencyEventType, b: AgencyEventType): number =>
    a.name.localeCompare(b.name)
  );
}

export const AgencyEvents = ({
  onClose,
  onError
}: AgencyEventsProps): React.ReactElement<AgencyEventsProps> => {
  const apiBaseUrl = React.useContext(ApiContext).shifts;
  const [events, setEvents] = React.useState<AgencyEventType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modalValue, setModalValue] = React.useState<
    AgencyEventType | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsDeleteDialogOpen(false);
    setModalValue(undefined);
  };

  const onEventDelete = (event: AgencyEventType) => {
    setIsDeleteDialogOpen(false);
    setModalValue(undefined);
    setEvents(events.filter((e: AgencyEventType) => e.id !== event.id));
  };

  // TODO uncomment this when delete is available
  // const onDelete = (event: AgencyEventType) => {
  //   setModalValue(event);
  //   setIsDeleteDialogOpen(true);
  // };

  const onEdit = (event: AgencyEventType) => {
    setModalValue(event);
    setIsModalOpen(true);
  };

  const onCreate = () => {
    setIsModalOpen(true);
  };

  const onFinish = async () => {
    setIsLoading(true);
    try {
      const response = await getEventTypes(apiBaseUrl);
      setEvents(sortEventTypes(response));
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.error('Settings::AgencyEvents', e);
      onError(e);
    }
  };

  React.useEffect(() => {
    let isSubscribed: boolean = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const events = await getEventTypes(apiBaseUrl);

        if (isSubscribed) {
          setEvents(sortEventTypes(events));
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
  }, []);

  return (
    <div>
      <AgencyEventsModal
        value={modalValue}
        isOpen={isModalOpen}
        onClose={() => {
          onClose();
          onModalClose();
        }}
        onBack={onModalClose}
        onError={onError}
        onFinish={onFinish}
      />
      {modalValue && (
        <AgencyEventsDeleteDialog
          value={modalValue}
          isOpen={isDeleteDialogOpen}
          onError={onError}
          onDelete={onEventDelete}
          onClose={onModalClose}
        />
      )}
      <SettingsContentRender
        renderContent={() => (
          <ListManagment<AgencyEventType>
            renderCreateButton={(props) => (
              <SFButton {...props} onClick={onCreate}>
                Create Event Type
              </SFButton>
            )}
            emptyMessage="There are no event types created yet."
            label="Event Type"
            list={events}
            isLoading={isLoading}
            filter={getFilteredValues}
            options={[
              {
                label: 'Edit event type',
                onClick: onEdit
              },
              {
                label: 'Delete',
                disabled: true,
                onClick: () => {},
                chip: (
                  <SFChip size="small" sfColor="default" label="Coming Soon" />
                )
              }
            ]}
            renderItem={(item: AgencyEventType) => (
              <AgencyEventsItem event={item} />
            )}
          />
        )}
      ></SettingsContentRender>
    </div>
  );
};
