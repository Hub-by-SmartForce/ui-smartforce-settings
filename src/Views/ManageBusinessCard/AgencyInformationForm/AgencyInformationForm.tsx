import React from 'react';
import styles from './AgencyInformationForm.module.scss';
import {
  BusinessCardSwitchForm,
  BusinessCardSwitchFormProps
} from '../BusinessCardSwitchForm/BusinessSwitchForm';
import { Customer } from '../../../Models';

const AGENCY_DISABLED_LIST: string[] = [
  'show_name',
  'show_state',
  'show_phone'
];

const getEmptyFields = (customer: Customer): string[] => {
  const emptyFields: string[] = [];

  if (!customer.email) {
    emptyFields.push('show_email');
  }

  if (!customer.website) {
    emptyFields.push('show_website');
  }

  if (!customer.badge) {
    emptyFields.push('show_photo');
  }

  return emptyFields;
};

function getLabel(key: string): string {
  switch (key) {
    case 'show_name':
      return 'Agency Name';
    case 'show_email':
      return 'E-mail';
    case 'show_phone':
      return 'Phone';
    case 'show_website':
      return 'Website';
    case 'show_state':
      return 'State';
    default:
      return 'Photo';
  }
}

export interface AgencyInformationFormProps
  extends Pick<BusinessCardSwitchFormProps, 'value' | 'onChange'> {
  customer: Customer;
}

export const AgencyInformationForm = ({
  customer,
  value,
  onChange
}: AgencyInformationFormProps): React.ReactElement<AgencyInformationFormProps> => {
  return (
    <div className={styles.agencyInformationForm}>
      <h3>Agency Information</h3>
      <BusinessCardSwitchForm
        disabledList={AGENCY_DISABLED_LIST}
        hiddenList={getEmptyFields(customer)}
        value={value}
        onChange={onChange}
        getLabel={getLabel}
      />
    </div>
  );
};
