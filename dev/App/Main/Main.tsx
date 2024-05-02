import React, { Fragment, useContext, useEffect, useState } from 'react';
import styles from './Main.module.scss';
import {
  SFSettings,
  SettingsError,
  getUser,
  Area,
  BusinessCardSettings,
  Customer,
  Subscription,
  User,
  getAreas,
  getBusinessCardSettings,
  getCustomer,
  getSubscriptions,
  AreasContext,
  CustomerContext,
  SubscriptionContext,
  UserContext,
  TimezonesContext,
  SFTopBar,
  LARGE_SCREEN,
  ToursReminderTooltip,
  ToursCarrouselModal,
  Tour,
  TourResumeTab,
  TourContext,
  useIsTourResumeOpen
} from '../../../src';
import { SFIcon, SFSpinner, SFText, useSFMediaQuery } from 'sfui';
import { BASE_URL } from '../App';
import { getTimezones } from '../../../src/Services/TimezoneService';
import { logout } from '../../../src/Services/AuthService';
import { TOURS } from '../tours';

export const Main = (): React.ReactElement<{}> => {
  const {
    onStart: onTourStart,
    onEnd: onTourEnd,
    tour: activeTour,
    isFeatureReminderOpen,
    setIsFeatureReminderOpen
  } = useContext(TourContext);
  const { setUser, setBusinessCardSettings } = useContext(UserContext);
  const { setAreas } = useContext(AreasContext);
  const { setCustomer } = useContext(CustomerContext);
  const { setSubscriptions } = useContext(SubscriptionContext);
  const { setTimezones } = useContext(TimezonesContext);
  const isBigScreen: boolean = useSFMediaQuery(LARGE_SCREEN);

  const [selectedSectionName, setSelectedSectionName] = useState<
    string | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToursCarrouselOpen, setIsToursCarrouselOpen] =
    useState<boolean>(false);

  const onSettingsError = (e: SettingsError) => console.error(e);
  const onHome = () => console.log('onHome');
  const onUpgrade = () => console.log('onUpgrade');

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const userData: User = await getUser(BASE_URL);
      setUser(userData);

      const timezones = await getTimezones(BASE_URL);
      setTimezones(timezones);

      if (userData.agency_id) {
        const customerData: Customer = await getCustomer(BASE_URL);
        setCustomer(customerData);

        if (customerData.status === 'Active') {
          const businessCardSettings: BusinessCardSettings =
            await getBusinessCardSettings(BASE_URL);
          setBusinessCardSettings(businessCardSettings);

          const subscriptions: Subscription[] = await getSubscriptions(
            BASE_URL
          );
          setSubscriptions(subscriptions);

          const areas: Area[] = await getAreas(BASE_URL);
          setAreas(areas);
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const onLogout = () => {
    logout();
    location.reload();
  };

  const onMenuButtonClick = () => console.log('Open menu');

  const onGotIt = (checked: boolean) => {
    if (checked) {
      console.log("Save don't show again status");
    }
    setIsFeatureReminderOpen(false);
  };

  const onCloseTourCarrousel = () => {
    setIsFeatureReminderOpen(true);
    setIsToursCarrouselOpen(false);
  };

  const onExitTourResume = () => {
    setIsFeatureReminderOpen(true);
    onTourEnd();
  };

  const onStartTour = (tour: Tour) => {
    setIsToursCarrouselOpen(false);

    if (tour.id === 1) {
      setSelectedSectionName('agency');
      onTourStart(tour);
    }
  };

  const onResumeTour = () => {
    onStartTour(activeTour as Tour);
  };

  const isTourResumeOpen = useIsTourResumeOpen();

  return (
    <React.Fragment>
      {isLoading && <SFSpinner />}
      {!isLoading && (
        <Fragment>
          {isTourResumeOpen && (
            <TourResumeTab onExit={onExitTourResume} onResume={onResumeTour} />
          )}

          <ToursCarrouselModal
            tours={TOURS}
            open={isToursCarrouselOpen}
            onClose={onCloseTourCarrousel}
            onStart={onStartTour}
          />

          <div className={styles.main}>
            <SFTopBar
              enviroment="local"
              product="cc"
              siteTitle="Settings"
              isBottomTitleVisible={!isBigScreen}
              onLogout={onLogout}
              onMenuButtonClick={onMenuButtonClick}
            />

            <div className={styles.content}>
              <div className={styles.leftPanel}>
                <ToursReminderTooltip
                  open={isFeatureReminderOpen}
                  onGotIt={onGotIt}
                >
                  <div
                    className={styles.tours}
                    onClick={() => setIsToursCarrouselOpen(true)}
                  >
                    <SFIcon icon="Circle-Star" />
                    <SFText type="component-1" sfColor="neutral">
                      Feature Tours
                    </SFText>
                  </div>
                </ToursReminderTooltip>
              </div>

              <SFSettings
                product="cc"
                enviroment="local"
                stripeApiKey={
                  'pk_test_51MEZItJHbTAgxqXa6dzvaI4SubteHn7zemB9uj6hXqltKSoEAPKvBRlMeHvn06fR03vqKFkegkmH0QWdkPrpbuGe00CkvRGgxb'
                }
                selectedSectionName={selectedSectionName}
                onError={onSettingsError}
                onHome={onHome}
                onUpgrade={onUpgrade}
                onSectionChange={(name) => setSelectedSectionName(name)}
              />
            </div>
          </div>
        </Fragment>
      )}
    </React.Fragment>
  );
};
