import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  SettingsError,
  Shift,
  ShiftHistory,
  ShiftListItem
} from '../../Models';
import { SettingsContentRender } from '../SettingsContentRender';
import { ListManagment } from '../../Components/ListManagment/ListManagment';
import { ApiContext } from '../../Context';
import {
  deleteShift,
  getShift,
  getShiftHistory,
  getShifts,
  restoreShift
} from '../../Services';
import { ShiftFormModal } from './ShiftFormModal/ShiftFormModal';
import { ShiftInfoModal } from './ShiftInfoModal/ShiftInfoModal';
import { AgencyShiftItem } from './AgencyShiftItem/AgencyShiftItem';
import { ShiftHistoryModal } from './ShiftHistoryModal/ShiftHistoryModal';
import { DeleteConfirmNameModal } from '../../Components/DeleteConfirmNameModal/DeleteConfirmNameModal';
import { dispatchCustomEvent } from '../../Helpers';
import { SETTINGS_CUSTOM_EVENT } from '../../Constants';
import { SFButton } from 'sfui';

function sortShifts(shifts: ShiftListItem[]): ShiftListItem[] {
  return shifts.sort((a: ShiftListItem, b: ShiftListItem): number => {
    if (a.status === 'Inactive' && b.status === 'Active') {
      return -1;
    } else if (a.status === 'Inactive' && b.status === 'Inactive') {
      return (
        new Date(a.updated_at as string).getTime() -
        new Date(b.updated_at as string).getTime()
      );
    } else {
      return a.name.localeCompare(b.name);
    }
  });
}

function getFilteredShifts(
  shifts: ShiftListItem[],
  filter: string
): ShiftListItem[] {
  if (filter.length < 3) {
    return shifts;
  } else {
    const filterLower = filter.toLowerCase();
    return shifts.filter((s: ShiftListItem) =>
      s.name.toLowerCase().includes(filterLower)
    );
  }
}

export interface AgencyShiftsProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const AgencyShifts = ({
  onError,
  onClose
}: AgencyShiftsProps): React.ReactElement<AgencyShiftsProps> => {
  const apiBaseUrl = useContext(ApiContext).shifts;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shifts, setShifts] = useState<ShiftListItem[]>([]);
  const [selected, setSelected] = useState<Shift | undefined>();
  const [isLoadingModalItem, setIsLoadingModalItem] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isShiftHistoryModalOpen, setIsShiftHistoryModalOpen] =
    useState<boolean>(false);

  const [shiftHistory, setShiftHistory] = useState<ShiftHistory[]>([]);
  const [shiftItem, setShiftItem] = useState<ShiftListItem>();
  const [modalValue, setModalValue] = useState<Shift>();

  useEffect(() => {
    let isSubscribed: boolean = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const shifts = await getShifts(apiBaseUrl);

        if (isSubscribed) {
          setShifts(sortShifts(shifts));
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

  const onUpdate = async () => {
    setIsLoading(true);
    try {
      const shifts = await getShifts(apiBaseUrl);
      setShifts(sortShifts(shifts));
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      onError(e);
    }
  };

  const onCreate = () => {
    setSelected(undefined);
    setIsCreateModalOpen(true);
  };

  const onInfo = async (shiftPreview: ShiftListItem) => {
    try {
      setIsLoadingModalItem(true);
      setIsViewModalOpen(true);
      const shift = await getShift(apiBaseUrl, shiftPreview.id);
      setModalValue(shift);
      setIsLoadingModalItem(false);
    } catch (e: any) {
      setIsLoadingModalItem(false);
      onError(e);
    }
  };

  const onEdit = async (shiftPreview: ShiftListItem) => {
    try {
      setIsLoadingModalItem(true);
      setIsCreateModalOpen(true);
      const shift = await getShift(apiBaseUrl, shiftPreview.id);
      setSelected(shift);
      setIsLoadingModalItem(false);
    } catch (e: any) {
      setIsLoadingModalItem(false);
      onError(e);
    }
  };

  const onHistory = async (shiftItem: ShiftListItem) => {
    setIsShiftHistoryModalOpen(true);
    setIsLoadingModalItem(true);

    try {
      const response = await getShiftHistory(apiBaseUrl, shiftItem.id);
      setShiftHistory(response);
      setShiftItem(shiftItem);
      setIsLoadingModalItem(false);
    } catch (e: any) {
      setIsLoadingModalItem(false);
      onError(e);
    }
  };

  const onOpenDeleteModal = async (shiftItem: ShiftListItem) => {
    setIsLoadingModalItem(false);
    setIsDeleteModalOpen(true);
    setShiftItem(shiftItem);
  };

  const onDelete = async () => {
    try {
      setIsLoadingModalItem(true);
      await deleteShift(apiBaseUrl, shiftItem?.id as string);
      setIsLoadingModalItem(false);
      setIsDeleteModalOpen(false);
      onUpdate();
    } catch (e: any) {
      setIsDeleteModalOpen(false);
      setIsLoadingModalItem(false);
      onError(e);
    }
  };

  const onRestore = async (shift: ShiftListItem) => {
    try {
      setIsLoading(true);
      await restoreShift(apiBaseUrl, shift.id);
      onUpdate();
      dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
        message: `The shift “${shift.name}” was restored.`
      });
    } catch (e: any) {
      onError(e);
    }
  };

  return (
    <SettingsContentRender
      renderContent={() => (
        <Fragment>
          <ShiftHistoryModal
            isOpen={isShiftHistoryModalOpen}
            isLoading={isLoadingModalItem}
            history={shiftHistory}
            shiftStart={shiftItem?.start}
            shiftEnd={shiftItem?.end}
            onClose={() => {
              setIsShiftHistoryModalOpen(false);
              onClose();
            }}
            onBack={() => setIsShiftHistoryModalOpen(false)}
          />

          <ShiftFormModal
            shift={selected}
            isOpen={isCreateModalOpen}
            isLoading={isLoadingModalItem}
            onBack={() => setIsCreateModalOpen(false)}
            onError={onError}
            onSave={onUpdate}
            onClose={() => {
              onClose();
              setIsCreateModalOpen(false);
            }}
          />

          <ShiftInfoModal
            isOpen={isViewModalOpen}
            isLoading={isLoadingModalItem}
            onClose={() => {
              onClose();
              setIsViewModalOpen(false);
            }}
            onBack={() => setIsViewModalOpen(false)}
            onError={onError}
            shift={modalValue}
          />

          <DeleteConfirmNameModal
            label="shift"
            isOpen={isDeleteModalOpen}
            name={shiftItem?.name as string}
            isSaving={isLoadingModalItem}
            onDelete={onDelete}
            onClose={() => setIsDeleteModalOpen(false)}
          />

          <ListManagment<ShiftListItem>
            renderCreateButton={(props) => (
              <SFButton {...props} onClick={onCreate}>
                Create Shift
              </SFButton>
            )}
            emptyMessage="There are no shifts created yet."
            label="Shift"
            list={shifts}
            isLoading={isLoading}
            filter={getFilteredShifts}
            onClick={onInfo}
            options={[
              {
                label: 'See shift information',
                onClick: onInfo
              },
              {
                label: 'Restore shift',
                filter: (shift: ShiftListItem) => shift.status === 'Inactive',
                onClick: onRestore
              },
              {
                label: 'Edit shift',
                filter: (shift: ShiftListItem) => shift.status === 'Active',
                onClick: onEdit
              },
              {
                label: 'View history',
                filter: (shift: ShiftListItem) => shift.status === 'Active',
                onClick: onHistory
              },
              {
                label: 'Delete',
                filter: (shift: ShiftListItem) => shift.status === 'Active',
                onClick: onOpenDeleteModal
              }
            ]}
            renderItem={(item) => <AgencyShiftItem shift={item} />}
          />
        </Fragment>
      )}
    />
  );
};
