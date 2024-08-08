import React, { Fragment, useContext, useEffect, useState } from 'react';
import styles from './ShiftFormModal.module.scss';
import moment from 'moment';
import {
  DateTimeValue,
  PanelModal,
  PanelModalAnchor
} from '../../../Components';
import {
  SettingsError,
  Shift,
  ShiftArea,
  ShiftFormValue,
  ShiftEditRequest,
  ShiftMember,
  ShiftRequest,
  ShiftHistoryDate,
  ShiftRecurrence
} from '../../../Models';
import { ShiftForm } from './ShiftForm/ShiftForm';
import { isEqualObject, upperFirstChar } from '../../../Helpers';
import { SFAlert, SFPeopleOption, SFSpinner } from 'sfui';
import { ApiContext } from '../../../Context';
import { addShift, editShift } from '../../../Services';

const initValue: ShiftFormValue = {
  name: '',
  acronym: '',
  areas: [],
  start: { date: null, time: '' },
  end: { date: null, time: '' },
  recurrence: {
    frequency: 'Weekly',
    interval: 1,
    days: []
  },
  min_staff: '',
  participants: []
};

function getDateValue(isoString: string): DateTimeValue {
  const date = moment(isoString);
  return { date, time: date.format('HH:mm') };
}

function getShiftValue(shift: Shift): ShiftFormValue {
  return {
    name: shift.name,
    acronym: shift.acronym,
    areas: shift.areas
      ? shift.areas.map((a: ShiftArea) => ({
          name: a.name,
          asyncObject: { id: a.id }
        }))
      : [],
    start: getDateValue(shift.start.datetime),
    end: getDateValue(shift.end.datetime),
    recurrence: {
      ...shift.recurrence,
      frequency: upperFirstChar(shift.recurrence.frequency)
    },
    min_staff: shift.min_staff.toString(),
    participants: shift.participants.map((m: ShiftMember) => ({
      name: m.name,
      asyncObject: {
        id: m.id
      }
    })),
    supervisor: shift.supervisor
      ? {
          name: shift.supervisor.name,
          asyncObject: {
            id: shift.supervisor.id
          }
        }
      : undefined
  };
}

function getDateRequestValue(date: moment.Moment, time: string): string {
  return `${date.format('YYYY-MM-DDT')}${time}:00`;
}

function isDateTimeInvalid(datetime: DateTimeValue): boolean {
  return (
    !datetime.date ||
    !datetime.date.isValid() ||
    !datetime.time ||
    datetime.time.length === 0
  );
}

function isSameOption(
  a: SFPeopleOption | undefined,
  b: SFPeopleOption | undefined
): boolean {
  return a?.asyncObject?.id === b?.asyncObject?.id;
}

function isSameOptionList(a: SFPeopleOption[], b: SFPeopleOption[]): boolean {
  if (a.length !== b.length) return false;
  else {
    return a.every((oa: SFPeopleOption) =>
      b.find((ob: SFPeopleOption) => isSameOption(oa, ob))
    );
  }
}

function isSameDate(a: DateTimeValue, b: DateTimeValue): boolean {
  return (
    getDateRequestValue(a.date as moment.Moment, a.time) ===
    getDateRequestValue(b.date as moment.Moment, b.time)
  );
}

function isSameShift(a: ShiftFormValue, b: ShiftFormValue): boolean {
  const {
    participants: aMembers,
    supervisor: aSupervisor,
    areas: aAreas,
    start: aStart,
    end: aEnd,
    ...aProps
  } = a;
  const {
    participants: bMembers,
    supervisor: bSupervisor,
    areas: bAreas,
    start: bStart,
    end: bEnd,
    ...bProps
  } = b;
  if (!isEqualObject(aProps, bProps)) return false;
  else
    return (
      isSameOption(aSupervisor, bSupervisor) &&
      isSameOptionList(aMembers, bMembers) &&
      isSameOptionList(aAreas, bAreas) &&
      isSameDate(aStart, bStart) &&
      isSameDate(aEnd, bEnd)
    );
}

function isFormInvalid(value: ShiftFormValue, shift?: Shift): boolean {
  if (
    !value.name ||
    !value.acronym ||
    isDateTimeInvalid(value.start) ||
    isDateTimeInvalid(value.end) ||
    value.recurrence.days.length === 0 ||
    !value.min_staff ||
    value.min_staff.length === 0
  ) {
    return true;
  }

  if (shift && isSameShift(value, getShiftValue(shift))) {
    return true;
  }

  return false;
}

function getOptionListValue(list: SFPeopleOption[]): ShiftMember[] {
  return list.map((o: SFPeopleOption) => ({
    id: o.asyncObject.id,
    name: o.name
  }));
}

function sortRecurrenceDays(days: string[]): string[] {
  const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const currentDays = [...days];
  return currentDays.sort(
    (a: string, b: string) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
  );
}

function getShiftRequestValue(value: ShiftFormValue): ShiftRequest {
  return {
    ...value,
    start: {
      datetime: getDateRequestValue(
        value.start.date as moment.Moment,
        value.start.time
      )
    },
    end: {
      datetime: getDateRequestValue(
        value.end.date as moment.Moment,
        value.end.time
      )
    },
    recurrence: {
      ...value.recurrence,
      frequency: value.recurrence.frequency.toLowerCase(),
      days: sortRecurrenceDays(value.recurrence.days)
    },
    areas: getOptionListValue(value.areas),
    participants: getOptionListValue(value.participants),
    supervisor: value.supervisor
      ? {
          id: value.supervisor.asyncObject.id,
          name: value.supervisor.name
        }
      : null
  };
}

const getEditedDatetime = (
  datetime: DateTimeValue,
  shiftDate: moment.Moment | null
): ShiftHistoryDate | undefined => {
  const dateValue = getDateRequestValue(
    datetime.date as moment.Moment,
    datetime.time
  );

  return !shiftDate?.isSame(dateValue)
    ? {
        datetime: dateValue
      }
    : undefined;
};

const getEditedRecurrence = (
  recurrence: ShiftRecurrence,
  newDays: string[]
): ShiftRecurrence | undefined => {
  const recurrenceDaysChanged = newDays.filter(
    (d) => !recurrence.days.includes(d)
  );

  return newDays.length !== recurrence.days.length ||
    recurrenceDaysChanged.length > 0
    ? {
        ...recurrence,
        frequency: recurrence.frequency.toLowerCase(),
        days: sortRecurrenceDays(newDays)
      }
    : undefined;
};

const getEditedSupervisor = (
  shiftSupervisor?: SFPeopleOption,
  formSupervisor?: SFPeopleOption
): ShiftMember | undefined | null => {
  const hasSupervisorChanged: boolean =
    shiftSupervisor !== formSupervisor &&
    formSupervisor?.asyncObject.id !== shiftSupervisor?.asyncObject.id;

  if (!hasSupervisorChanged) {
    return undefined;
  } else if (!formSupervisor) {
    return null;
  } else {
    return {
      id: (formSupervisor as SFPeopleOption).asyncObject.id,
      name: (formSupervisor as SFPeopleOption).name
    };
  }
};

const getEditedArea = (
  areas: SFPeopleOption[],
  shiftAreas: SFPeopleOption[]
): ShiftArea[] | undefined => {
  const areasChanged = areas
    .filter((a) => shiftAreas.includes(a))
    .map((a) => a.asyncObject.id);

  if (areas.length === shiftAreas.length && areasChanged.length === 0) {
    return undefined;
  } else if (areas.length === 0) {
    return [];
  } else {
    return areas.map((a) => ({ id: a.asyncObject.id, name: a.name }));
  }
};

function getEditedShift(
  value: ShiftFormValue,
  shift: ShiftFormValue
): ShiftEditRequest {
  return {
    name: value.name === shift.name ? undefined : value.name,
    acronym: value.acronym === shift.acronym ? undefined : value.acronym,
    start: getEditedDatetime(value.start, shift.start.date),
    end: getEditedDatetime(value.end, shift.end.date),
    recurrence: getEditedRecurrence(shift.recurrence, value.recurrence.days),
    areas: getEditedArea(value.areas, shift.areas),
    supervisor: getEditedSupervisor(shift.supervisor, value.supervisor),
    min_staff:
      value.min_staff !== shift.min_staff ? Number(value.min_staff) : undefined
  };
}

export interface ShiftFormModalProps {
  shift?: Shift;
  isOpen: boolean;
  isLoading: boolean;
  onBack: () => void;
  onError: (e: SettingsError) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ShiftFormModal = ({
  shift,
  isOpen,
  isLoading,
  onBack,
  onError,
  onClose,
  ...props
}: ShiftFormModalProps): React.ReactElement<ShiftFormModalProps> => {
  const apiBaseUrl = useContext(ApiContext).shifts;
  const [value, setValue] = useState<ShiftFormValue>(initValue);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const onSave = async () => {
    try {
      setIsSaving(true);
      if (!shift) {
        await addShift(apiBaseUrl, getShiftRequestValue(value));
      } else {
        const editedShiftValue = getEditedShift(value, getShiftValue(shift));

        if (Object.entries(editedShiftValue).length > 0)
          await editShift(apiBaseUrl, shift.id, editedShiftValue);
      }
      setIsSaving(false);
      props.onSave();
      onClose();
    } catch (e: any) {
      setIsSaving(false);
      onError(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (shift) {
        setValue(getShiftValue(shift));
      } else {
        setValue(initValue);
      }
    }
  }, [isOpen, shift]);

  return (
    <PanelModal
      anchor={anchor}
      isOpen={isOpen}
      title={isLoading ? undefined : `${shift ? 'Edit' : 'Create'} Shift`}
      dialogCloseButton={
        isLoading
          ? undefined
          : {
              label: 'Discard',
              variant: 'text',
              sfColor: 'grey',
              disabled: isSaving,
              onClick: onClose
            }
      }
      actionButton={
        isLoading
          ? undefined
          : {
              label: shift ? 'Save Changes' : 'Create Shift',
              isLoading: isSaving,
              disabled: isFormInvalid(value, shift),
              onClick: onSave
            }
      }
      onBack={() => {
        setAnchor('bottom');
        onBack();
      }}
      onClose={onClose}
    >
      <Fragment>
        {isLoading && (
          <div className={styles.spinner}>
            <SFSpinner aria-label="Loading" />
          </div>
        )}

        {!isLoading && (
          <Fragment>
            {shift && (
              <SFAlert
                className={styles.alert}
                type="info"
                title="The changes will be applied starting on the next shift."
              ></SFAlert>
            )}
            <ShiftForm
              value={value}
              isEdit={!!shift}
              onChange={(value: ShiftFormValue) => {
                const newValue = {
                  ...value,
                  recurrence: {
                    ...value.recurrence,
                    days: sortRecurrenceDays(value.recurrence.days)
                  }
                };

                setValue(newValue);
              }}
            />
          </Fragment>
        )}
      </Fragment>
    </PanelModal>
  );
};
