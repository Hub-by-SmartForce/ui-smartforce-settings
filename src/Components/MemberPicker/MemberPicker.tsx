import React, { useMemo } from 'react';
import { SFPeoplePicker, SFPeopleOption } from 'sfui';
import { getUserSession } from '../../Services';

const formatOption = (option: any): SFPeopleOption => {
  return {
    name: option.name as string,
    avatarUrl: option.avatar_thumbnail_url as string,
    asyncObject: option
  };
};

const getOptionSelected = (o: SFPeopleOption, v: SFPeopleOption): boolean => {
  return o.asyncObject.id === v.asyncObject?.id;
};

export interface MemberPickerProps {
  disabled?: boolean;
  baseUrl: string;
  label: string;
  value: SFPeopleOption | undefined;
  onChange: (value: SFPeopleOption) => void;
  filterOptions?: (option: any) => boolean;
}

export const MemberPicker = ({
  disabled = false,
  baseUrl,
  label,
  value,
  onChange,
  filterOptions
}: MemberPickerProps): React.ReactElement<MemberPickerProps> => {
  const fetchInit: RequestInit = useMemo(
    () => ({
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `bearer ${getUserSession().access_token}`
      })
    }),
    []
  );

  return (
    <SFPeoplePicker
      isAsync
      disabled={disabled}
      multiple={false}
      label={label}
      formatUrlQuery={(value: string) =>
        `${baseUrl}/agencies/me/users?active_only=True&name=${value}`
      }
      formatOption={formatOption}
      fetchInit={fetchInit}
      value={value ?? { name: '' }}
      onChange={onChange}
      getOptionSelected={getOptionSelected}
      filterOptions={filterOptions}
    />
  );
};
