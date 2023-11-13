import React from 'react';
import { SettingsContentRender } from '../SettingsContentRender';
import { SettingsError } from '../../Models/Error';
import { AgencyEvent } from '../../Models/AgencyEvents';
import { ListManagment } from '../../Components/ListManagment/ListManagment';
import { AgencyEventsList } from './AgencyEventsList/AgencyEventsList';
import { AgencyEventsModal } from './AgencyEventsModal/AgencyEventsModal';

export interface AgencyEventsProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

const getFilteredValues = (
  list: AgencyEvent[],
  filter: string
): AgencyEvent[] => {
  return list.filter((l) =>
    l.name.toLowerCase().includes(filter.toLowerCase())
  );
};

export const AgencyEvents = ({
  onClose,
  onError
}: AgencyEventsProps): React.ReactElement<AgencyEventsProps> => {
  const [events, setEvents] = React.useState<AgencyEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modalValue, setModalValue] = React.useState<AgencyEvent | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const onModalClose = () => {
    setIsModalOpen(false);
    setModalValue(undefined);
  };

  const onDelete = (event: AgencyEvent) => {
    // TODO add event deletion logic
  };

  const onEdit = (event: AgencyEvent) => {
    // TODO add event edition logic
  };

  const onCreate = () => {
    setIsModalOpen(true);
  };

  const onFinish = async () => {
    setIsLoading(true);
    try {
      // TODO add BE implementation
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.error('Settings::AgencyEvents', e);
      onError(e);
    }
  };

  React.useEffect(() => {
    // TODO add get events
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
        onFinish={onFinish}
      />
      <SettingsContentRender
        renderContent={() => (
          <ListManagment
            label="Event Type"
            labelPlural="events"
            list={events}
            isLoading={isLoading}
            filter={getFilteredValues}
            onCreate={onCreate}
            renderList={(list: AgencyEvent[]) => (
              <AgencyEventsList
                events={list}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
          />
        )}
      ></SettingsContentRender>
    </div>
  );
};