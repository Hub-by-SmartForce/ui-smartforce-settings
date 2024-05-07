import React from 'react';
import { SFSwitch } from 'sfui';

export type BusinessSwitchSectionFormValue = Record<string, boolean>;

export interface BusinessCardSwitchFormProps {
  disabledList: string[];
  hiddenList: string[];
  value: BusinessSwitchSectionFormValue;
  onChange: (key: string, checked: boolean) => void;
  getLabel: (key: string) => string;
}

export const BusinessCardSwitchForm = ({
  disabledList,
  hiddenList,
  value,
  onChange,
  getLabel
}: BusinessCardSwitchFormProps): React.ReactElement<BusinessCardSwitchFormProps> => {
  return (
    <>
      {Object.keys(value).map(
        (key) =>
          !hiddenList.includes(key) && (
            <SFSwitch
              key={key}
              label={getLabel(key)}
              checked={value[key]}
              disabled={disabledList.includes(key)}
              onChange={(_, checked) => onChange(key, checked)}
            />
          )
      )}
    </>
  );
};
