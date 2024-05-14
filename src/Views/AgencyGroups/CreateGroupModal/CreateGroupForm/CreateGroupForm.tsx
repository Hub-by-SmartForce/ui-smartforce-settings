import React, { useContext, useMemo, useRef } from 'react';
import styles from './CreateGroupForm.module.scss';
import { SFPeopleOption, SFPeoplePicker, SFTextField } from 'sfui';
import { getUserSession } from '../../../../Services';
import { ImageUpload } from '../../../../Components/ImageUpload/ImageUpload';
import { ApiContext } from '../../../../Context';
import { TourContext, TourTooltip } from '../../../../Modules/Tour';

const formatOption = (option: any): SFPeopleOption => {
  return {
    name: option.name as string,
    avatarUrl: option.avatar_thumbnail_url as string,
    asyncObject: option
  };
};

export interface GroupFormValue {
  avatar?: Blob | string;
  id?: string;
  name: string;
  acronym: string;
  members?: SFPeopleOption[];
}
export interface CreateGroupError {
  name: boolean;
  acronym: boolean;
}

export interface CreateGroupFormProps {
  error: CreateGroupError;
  isNew: boolean;
  value: GroupFormValue;
  onChange: (newValue: GroupFormValue) => void;
}

export const CreateGroupForm = ({
  error,
  isNew = false,
  value,
  onChange
}: CreateGroupFormProps): React.ReactElement<CreateGroupFormProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { onNext: onTourNext } = useContext(TourContext);
  const refPristine = useRef<boolean>(true);

  const nameHelper = error.name
    ? 'This name is already taken.'
    : 'It must be between 1 and 32 characters.';

  const acronymHelper = error.acronym
    ? 'This acronym is already taken.'
    : 'It must be between 1 and 3 characters. E.g. “CC1”';

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

  const onChangeAvatar = (avatar: Blob) => {
    if (refPristine.current) {
      refPristine.current = false;
      onTourNext({ tourId: 9, step: 4 });
    }
    onChange({ ...value, avatar: avatar });
  };

  const onClickUpload = () => {
    onTourNext({ tourId: 9, step: 4 });
  };

  return (
    <div className={styles.createGroupForm}>
      <SFTextField
        label="Name"
        required
        error={error.name}
        inputProps={{ maxLength: 32 }}
        helperText={nameHelper}
        value={value.name}
        onChange={(event) =>
          onChange({
            ...value,
            name: event.target.value
          })
        }
      />

      <TourTooltip
        title="Complete the fields"
        description="Type the group name and acronym. Take into consideration the maximum number of characters that each field has."
        step={2}
        lastStep={5}
        tourId={9}
        placement="bottom"
        topZIndex
      >
        <SFTextField
          label="Acronym"
          required
          error={error.acronym}
          inputProps={{ maxLength: 3 }}
          helperText={acronymHelper}
          value={value.acronym}
          onChange={(event) =>
            onChange({
              ...value,
              acronym: event.target.value
            })
          }
        />
      </TourTooltip>

      {isNew && (
        <TourTooltip
          title="Add members"
          description="Type the first few characters of the name of the member you need to add and select them from the suggested active users."
          step={3}
          lastStep={5}
          tourId={9}
          placement="right"
          topZIndex
        >
          <SFPeoplePicker
            multiple
            label="Members"
            isAsync
            formatUrlQuery={(value: string) =>
              `${apiBaseUrl}/agencies/me/users?active_only=True&name=${value}`
            }
            formatOption={formatOption}
            fetchInit={fetchInit}
            value={value.members as SFPeopleOption[]}
            onChange={(newMembers: SFPeopleOption[]) =>
              onChange({
                ...value,
                members: newMembers
              })
            }
          />
        </TourTooltip>
      )}

      <TourTooltip
        title="Upload a group image "
        description="Choose an image that represents the group you need to create."
        step={4}
        lastStep={5}
        tourId={9}
        placement="right"
        topZIndex
        width="fit"
      >
        <ImageUpload
          label="Upload Photo"
          value={value.avatar}
          onClick={onClickUpload}
          onChange={onChangeAvatar}
        />
      </TourTooltip>
    </div>
  );
};
