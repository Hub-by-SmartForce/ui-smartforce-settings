import React, { Fragment, useEffect } from 'react';
import styles from './MyProfile.module.scss';
import { SFButton, SFChip, SFText } from 'sfui';
import { UserContext, MediaContext } from '../../Context';
import { SettingsContentRender } from '../SettingsContentRender';
import { MyProfileForm } from './MyProfileForm/MyProfileForm';
import { AvatarImg, updateAvatar, updateUser } from '../../Services';
import { ApiContext } from '../../Context';
import { isFieldEmpty, isEqualObject, isOfficerIdValid } from '../../Helpers';
import { User, UserGroup, SettingsError } from '../../Models';

const isFormValid = (user: User): boolean => {
  return (
    !isFieldEmpty(user.name) &&
    user.dob !== 'Invalid date' &&
    user.career_start_date !== 'Invalid date'
  );
};

const removeTimeZone = (date: string): string => {
  if (date[date.length - 1] === 'Z') {
    return date.substring(0, date.length - 1);
  } else {
    return date;
  }
};

const isEqualDate = (a: string | undefined, b: string | undefined) => {
  if (a && b) {
    return a.substring(0, 10) === b.substring(0, 10);
  } else return !!a === !!b;
};

const getEditUser = (user: User): User => {
  let editUser: User = { ...user };
  editUser.dob = user.dob ? removeTimeZone(user?.dob) : undefined;
  editUser.career_start_date = user.career_start_date
    ? removeTimeZone(user?.career_start_date)
    : undefined;

  return editUser;
};

function getUserGroups(user?: User): UserGroup[] {
  if (user?.groups) {
    let groups = [...user.groups];
    return groups.sort((a: UserGroup, b: UserGroup) =>
      a.name.localeCompare(b.name)
    );
  } else {
    return [];
  }
}

export interface MyProfileProps {
  onLoading: () => void;
  onDone: () => void;
  onError: (e: SettingsError) => void;
}

export const MyProfile = ({
  onLoading,
  onDone,
  onError
}: MyProfileProps): React.ReactElement<MyProfileProps> => {
  const apiBaseUrl = React.useContext(ApiContext).settings;
  const { isPhone } = React.useContext(MediaContext);
  const { user, setUser } = React.useContext(UserContext);
  const [editUser, setEditUser] = React.useState<User>(
    getEditUser(user as User)
  );
  const groups: UserGroup[] = getUserGroups(user);
  const [avatar, setAvatar] = React.useState<string | Blob | undefined | null>(
    user?.avatar_url
  );
  const [isOfficerIdError, setIsOfficerIdError] =
    React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  useEffect(() => {
    setEditUser(getEditUser(user as User));
    setAvatar(user?.avatar_url);
  }, [user]);

  const checkFormChange = (): boolean => {
    const {
      dob: userDob,
      career_start_date: userCareerStart,
      ...restUser
    } = user as User;

    const {
      dob: editUserDob,
      career_start_date: editUserCareerStart,
      ...restEditUser
    } = editUser;

    return (
      !isEqualObject<Partial<User>>(restUser, restEditUser) ||
      !isEqualDate(userDob, editUserDob) ||
      !isEqualDate(userCareerStart, editUserCareerStart)
    );
  };

  const checkAvatarChange = (): boolean => avatar instanceof Blob;

  const onUserChange = (newUser: User) => {
    setEditUser(newUser);
  };

  const onAvatarChange = (value: Blob) => {
    setAvatar(value);
  };

  const onSave = async () => {
    const checkOfficerId: boolean = isOfficerIdValid(
      editUser.officer_id as string
    );

    setIsOfficerIdError(!checkOfficerId);

    if (checkOfficerId) {
      try {
        setIsSaving(true);
        onLoading();

        let newUser: User = { ...editUser };

        if (checkFormChange()) {
          const { email, ...userWithoutEmail } = newUser;
          await updateUser(apiBaseUrl, userWithoutEmail);
        }

        if (checkAvatarChange()) {
          const avatarUrl: AvatarImg = await updateAvatar(
            apiBaseUrl,
            avatar as Blob
          );
          newUser = {
            ...newUser,
            avatar_url: avatarUrl.url,
            avatar_thumbnail_url: avatarUrl.url_thumbnail
          };
        }

        setUser(newUser);
        setIsSaving(false);
        onDone();
      } catch (e: any) {
        console.error('SFSettings::MyProfile::onSave', e);
        onError(e);
      }
    }
  };

  const onDiscard = () => {
    setEditUser(user as User);
    setAvatar(user?.avatar_url);
  };

  const isSaveDisabled: boolean =
    !isFormValid(editUser) || (!checkFormChange() && !checkAvatarChange());

  const renderContent = () => {
    return (
      <div className={styles.content}>
        <div className={styles.item}>
          <span>Role</span>
          <SFChip
            sfColor="default"
            label={user?.role?.name}
            variant="outlined"
            size="small"
          />
        </div>

        <div className={styles.item}>
          <span>Groups</span>
          <div className={styles.chipGroups}>
            {groups.length === 0 && (
              <SFText type="component-1" sfColor="neutral">
                You are not part of any group.
              </SFText>
            )}
            {groups.length > 0 &&
              groups.map((group: UserGroup) => (
                <SFChip
                  key={group.id}
                  sfColor="default"
                  variant="outlined"
                  size="small"
                  label={group.name}
                />
              ))}
          </div>
        </div>

        {user?.title && (
          <div className={styles.item}>
            <span>Title</span>
            <SFChip
              sfColor="default"
              label={user?.title?.name}
              variant="outlined"
              size="small"
            />
          </div>
        )}

        <MyProfileForm
          user={editUser}
          avatar={avatar}
          isOfficerIdError={isOfficerIdError}
          onChange={onUserChange}
          onAvatarChange={onAvatarChange}
        />
      </div>
    );
  };

  return (
    <div className={styles.myProfile}>
      <SettingsContentRender
        renderContent={renderContent}
        renderFooter={() => (
          <Fragment>
            {!isPhone && (
              <SFButton
                size="medium"
                sfColor="grey"
                variant="text"
                disabled={isSaveDisabled || isSaving}
                onClick={onDiscard}
              >
                Discard
              </SFButton>
            )}
            <SFButton
              size={isPhone ? 'large' : 'medium'}
              fullWidth={isPhone}
              disabled={isSaveDisabled}
              isLoading={isSaving}
              onClick={onSave}
            >
              {isPhone ? 'Save Changes' : 'Save'}
            </SFButton>
          </Fragment>
        )}
      />
    </div>
  );
};
