import React, { Fragment } from 'react';
import styles from './ManageBusinessCard.module.scss';
import { BusinessCard } from 'business-card-component';
import { SettingsContentRender } from '../SettingsContentRender';
import { SFButton, SFDivider, SFScrollable } from 'sfui';
import {
  UserContext,
  MediaContext,
  CustomerContext,
  ThemeTypeContext
} from '../../Context';
import { BusinessCardSwitchForm } from './BusinessCardSwitchForm/BusinessSwitchForm';
import { BusinessCardPreview } from './BusinessCardPreview/BusinessCardPreview';
import { ApiContext } from '../../Context';
import { saveBusinessCardSettings } from '../../Services';
import {
  dispatchCustomEvent,
  getBusinessCardData,
  isEqualObject
} from '../../Helpers';
import {
  BusinessCardSettings,
  Customer,
  User,
  SettingsError
} from '../../Models';
import { SETTINGS_CUSTOM_EVENT } from '../../Constants';

const OFFICER_DISABLED_LIST: string[] = ['show_name', 'show_officer_id'];
const AGENCY_DISABLED_LIST: string[] = [
  'show_name',
  'show_state',
  'show_phone'
];

const getOfficerEmptyFields = (user: User): string[] => {
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

  return emptyFields;
};

const getAgencyEmptyFields = (customer: Customer): string[] => {
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

export interface ManageBusinessCardProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const ManageBusinessCard = ({
  onError,
  onClose
}: ManageBusinessCardProps): React.ReactElement<ManageBusinessCardProps> => {
  const apiBaseUrl = React.useContext(ApiContext).settings;
  const { isPhone } = React.useContext(MediaContext);
  const { themeType } = React.useContext(ThemeTypeContext);
  const user = React.useContext(UserContext).user as User;
  const customer = React.useContext(CustomerContext).customer as Customer;
  const businessCardSettings = React.useContext(UserContext)
    .businessCardSettings as BusinessCardSettings;
  const { setBusinessCardSettings } = React.useContext(UserContext);

  const [switchData, setSwitchData] =
    React.useState<BusinessCardSettings>(businessCardSettings);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const isButtonDisabled: boolean = isSaveDisabled || isLoading;

  const onDiscard = () => {
    setIsSaveDisabled(true);
    setSwitchData(businessCardSettings);
  };

  const onOfficerChange = (name: string, value: boolean) => {
    const newValues: BusinessCardSettings = {
      ...switchData,
      officer_information: {
        ...switchData.officer_information,
        [name]: value
      }
    };

    setIsSaveDisabled(isEqualObject(businessCardSettings, newValues));
    setSwitchData(newValues);
  };

  const onAgencyChange = (name: string, value: boolean) => {
    const newValues: BusinessCardSettings = {
      ...switchData,
      agency_information: { ...switchData.agency_information, [name]: value }
    };

    setIsSaveDisabled(isEqualObject(businessCardSettings, newValues));
    setSwitchData(newValues);
  };

  const onSaveSettings = async () => {
    setIsLoading(true);

    try {
      const response: BusinessCardSettings = await saveBusinessCardSettings(
        apiBaseUrl,
        switchData
      );
      setBusinessCardSettings(response);
      setIsLoading(false);
      setIsSaveDisabled(true);
      dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
        message: 'Your changes was saved successfully.'
      });
    } catch (e: any) {
      setIsLoading(false);
      setIsSaveDisabled(true);
      console.error('ManageBusinessCard::Update', e);
      onError(e);
    }
  };

  return (
    <div className={styles.manageBusinessCard}>
      <SettingsContentRender
        renderContent={() => (
          <Fragment>
            <div className={styles.scrollableContainer}>
              <SFScrollable containerClassName={styles.content}>
                <div className={styles.textContainer}>
                  <h2 className={styles.title}>My Business Card</h2>
                  {!isPhone && (
                    <h5 className={styles.description}>
                      Manage your business card information.
                    </h5>
                  )}
                </div>
                <BusinessCardSwitchForm
                  title="Officer Information"
                  disabledList={OFFICER_DISABLED_LIST}
                  hiddenList={getOfficerEmptyFields(user)}
                  values={switchData.officer_information}
                  onChange={onOfficerChange}
                />

                <SFDivider />

                <BusinessCardSwitchForm
                  title="Agency Information"
                  disabledList={AGENCY_DISABLED_LIST}
                  hiddenList={getAgencyEmptyFields(customer)}
                  values={switchData.agency_information}
                  onChange={onAgencyChange}
                />

                <div>
                  <SFButton
                    size={isPhone ? 'large' : 'medium'}
                    fullWidth={isPhone}
                    variant="outlined"
                    sfColor="blue"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    Preview Business Card
                  </SFButton>
                </div>
                {!isPhone && (
                  <div className={styles.footer}>
                    <SFButton
                      size="medium"
                      sfColor="grey"
                      variant="text"
                      disabled={isButtonDisabled}
                      onClick={onDiscard}
                    >
                      Discard
                    </SFButton>

                    <SFButton
                      disabled={isSaveDisabled}
                      size="medium"
                      isLoading={isLoading}
                      onClick={onSaveSettings}
                    >
                      Save
                    </SFButton>
                  </div>
                )}
              </SFScrollable>
            </div>
            <div className={styles.scrollableContainer}>
              <BusinessCardPreview
                data={getBusinessCardData(switchData, user, customer)}
                isOpen={isPreviewOpen}
                onBack={() => setIsPreviewOpen(false)}
                onClose={() => {
                  onClose();
                  setIsPreviewOpen(false);
                }}
              />
              <SFScrollable
                className={styles.businessCard}
                containerClassName={styles.businessCardContainer}
              >
                <BusinessCard
                  className={styles.externalCard}
                  data={getBusinessCardData(switchData, user, customer)}
                  themeType={themeType}
                />
              </SFScrollable>
            </div>
          </Fragment>
        )}
        renderFooter={
          isPhone
            ? () => (
                <SFButton
                  disabled={isSaveDisabled}
                  size="large"
                  isLoading={isLoading}
                  fullWidth={true}
                  onClick={onSaveSettings}
                >
                  Save Changes
                </SFButton>
              )
            : undefined
        }
      />
    </div>
  );
};
