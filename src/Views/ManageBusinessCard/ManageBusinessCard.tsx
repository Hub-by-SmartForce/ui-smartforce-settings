import React, { Fragment, useContext } from 'react';
import styles from './ManageBusinessCard.module.scss';
import { BusinessCard } from 'business-card-component';
import { SettingsContentRender } from '../SettingsContentRender';
import { SFButton, SFScrollable } from 'sfui';
import {
  UserContext,
  MediaContext,
  CustomerContext,
  ThemeTypeContext
} from '../../Context';
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
  SettingsError,
  UserSettings
} from '../../Models';
import { SETTINGS_CUSTOM_EVENT } from '../../Constants';
import { Divider } from '../../Components/Divider/Divider';
import { AgencyInformationForm } from './AgencyInformationForm/AgencyInformationForm';
import { OfficerInformationForm } from './OfficerInformationForm/OfficerInformationForm';
import { TourContext, TourTooltip, useCloseTour } from '../../Modules/Tour';

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
  const businessCardSettings = (
    React.useContext(UserContext).userSettings as UserSettings
  ).business_card;
  const { setUserSettings } = React.useContext(UserContext);
  const {
    step: tourStep,
    status: tourStatus,
    onNext: onTourNext,
    onEnd: onTourEnd,
    onClose: onTourClose,
    setIsFeatureReminderOpen
  } = useContext(TourContext);

  const [switchData, setSwitchData] =
    React.useState<BusinessCardSettings>(businessCardSettings);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState<boolean>(false);
  const [isSaveDisabled, setIsSaveDisabled] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const isButtonDisabled: boolean = isSaveDisabled || isLoading;

  useCloseTour([4]);

  const onDiscard = () => {
    if (tourStep === 4 || tourStep === 2) {
      onTourClose([4]);
    }
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

    onTourNext({ tourId: 4, step: 1 });
  };

  const onAgencyChange = (name: string, value: boolean) => {
    const newValues: BusinessCardSettings = {
      ...switchData,
      agency_information: { ...switchData.agency_information, [name]: value }
    };

    setIsSaveDisabled(isEqualObject(businessCardSettings, newValues));
    setSwitchData(newValues);

    onTourNext({ tourId: 4, step: 1 });
  };

  const onSaveSettings = async () => {
    setIsLoading(true);

    if (tourStep === 4) {
      onTourEnd();
    } else if (tourStep === 2) {
      onTourClose([4]);
    }

    try {
      const response: BusinessCardSettings = await saveBusinessCardSettings(
        apiBaseUrl,
        switchData
      );

      setUserSettings((settings) => {
        if (settings) {
          return {
            ...settings,
            business_card: response
          };
        } else {
          return {
            tours: [],
            business_card: response
          };
        }
      });

      setIsLoading(false);
      setIsSaveDisabled(true);
      dispatchCustomEvent(SETTINGS_CUSTOM_EVENT, {
        message: 'Your changes was saved successfully.'
      });

      if (tourStatus === 'active') {
        setIsFeatureReminderOpen(true);
      }
    } catch (e: any) {
      setIsLoading(false);
      setIsSaveDisabled(true);
      console.error('ManageBusinessCard::Update', e);
      onError(e);
    }
  };

  const onPreview = () => {
    onTourNext({ tourId: 4, step: 2 });

    if (tourStep !== 2) {
      onTourClose([4]);
    }

    setIsPreviewOpen(true);
  };

  return (
    <div className={styles.manageBusinessCard}>
      <SettingsContentRender
        renderContent={() => (
          <Fragment>
            <div className={styles.scrollableContainer}>
              <SFScrollable
                className={styles.scrollable}
                containerClassName={styles.content}
              >
                <div className={styles.textContainer}>
                  <h2 className={styles.title}>My Business Card</h2>
                  {!isPhone && (
                    <h5 className={styles.description}>
                      Manage your business card information.
                    </h5>
                  )}
                </div>

                <OfficerInformationForm
                  user={user}
                  value={switchData.officer_information}
                  onChange={onOfficerChange}
                />

                <Divider />

                <AgencyInformationForm
                  customer={customer}
                  value={switchData.agency_information}
                  onChange={onAgencyChange}
                />

                <div>
                  <TourTooltip
                    title="Preview your business card"
                    description="To see what your business card will look like, you can click on the “Business Card Preview” button."
                    step={2}
                    lastStep={4}
                    tourId={4}
                    placement="top-start"
                    width="fit"
                    preventOverflow
                  >
                    <SFButton
                      size={isPhone ? 'large' : 'medium'}
                      fullWidth={isPhone}
                      variant="outlined"
                      sfColor="blue"
                      onClick={onPreview}
                    >
                      Preview Business Card
                    </SFButton>
                  </TourTooltip>
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

                    <TourTooltip
                      title="Save your setup"
                      description='Once you are happy with the information displayed on your business card, you must click "Save" to save your settings.'
                      step={4}
                      lastStep={4}
                      tourId={4}
                      placement="top-end"
                    >
                      <SFButton
                        disabled={isSaveDisabled}
                        size="medium"
                        isLoading={isLoading}
                        onClick={onSaveSettings}
                      >
                        Save
                      </SFButton>
                    </TourTooltip>
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
