import React from 'react';
import styles from './OfficerInformationForm.module.scss';
import {
  BusinessCardSwitchForm,
  BusinessCardSwitchFormProps
} from '../BusinessCardSwitchForm/BusinessSwitchForm';
import { User } from '../../../Models';
import { TourTooltip } from '../../../Modules/Tour';

const OFFICER_DISABLED_LIST: string[] = ['show_name', 'show_officer_id'];

const getEmptyFields = (user: User): string[] => {
  const emptyFields: string[] = [];

  if (!user.email) {
    emptyFields.push('show_email');
  }

  if (!user.phone) {
    emptyFields.push('show_phone');
  }

  if (!user.avatar_url) {
    emptyFields.push('show_photo');
  }

  if (!user.title) {
    emptyFields.push('show_title');
  }

  return emptyFields;
};

function getLabel(key: string): string {
  switch (key) {
    case 'show_name':
      return 'Full Name';
    case 'show_email':
      return 'E-mail';
    case 'show_phone':
      return 'Phone';
    case 'show_officer_id':
      return 'Officer ID Number';
    case 'show_title':
      return 'Title';
    default:
      return 'Photo';
  }
}

export interface OfficerInformationFormProps
  extends Pick<BusinessCardSwitchFormProps, 'value' | 'onChange'> {
  user: User;
}

export const OfficerInformationForm = ({
  user,
  value,
  onChange
}: OfficerInformationFormProps): React.ReactElement<OfficerInformationFormProps> => {
  const { show_title, ...others } = value;

  return (
    <div className={styles.officerInformationForm}>
      <TourTooltip
        title="Setup your business card"
        description="You can quickly hide any data you don't want to show. By default, all information will be visible."
        step={1}
        lastStep={4}
        tourId={4}
        placement="right"
        width="fit"
      >
        <h3 className={styles.title}>Officer Information</h3>
      </TourTooltip>

      <BusinessCardSwitchForm
        disabledList={OFFICER_DISABLED_LIST}
        hiddenList={getEmptyFields(user)}
        value={{ show_title, ...others }}
        onChange={onChange}
        getLabel={getLabel}
      />
    </div>
  );
};
