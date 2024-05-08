import React, { Fragment, useContext, useEffect, useState } from 'react';
import styles from './Main.module.scss';
import {
  SFSettings,
  SettingsError,
  getUser,
  Area,
  Customer,
  Subscription,
  User,
  getAreas,
  getUserSettings,
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
  UserSettings,
  hideTours
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
    setIsFeatureReminderOpen,
    onDisableReminder
  } = useContext(TourContext);
  const { setUser, setUserSettings } = useContext(UserContext);
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
          const userSettings: UserSettings = await getUserSettings(BASE_URL);
          setUserSettings(userSettings);

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

  const onGotIt = async (checked: boolean) => {
    if (checked) {
      try {
        hideTours(BASE_URL, 'cc');
        onDisableReminder();
      } catch (e) {
        console.error(e);
      }
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

    if (tour.id === 1 || tour.id === 2 || tour.id === 3) {
      setSelectedSectionName('agency');
      onTourStart(tour);
    } else if (tour.id === 4) {
      setSelectedSectionName('business_card');
      onTourStart(tour);
    }
  };

  const onResumeTour = () => {
    onStartTour(activeTour as Tour);
  };

  const onShowTours = () => {
    onTourEnd();
    setIsToursCarrouselOpen(true);
  };

  return (
    <React.Fragment>
      {isLoading && <SFSpinner />}
      {!isLoading && (
        <Fragment>
          <TourResumeTab onExit={onExitTourResume} onResume={onResumeTour} />

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
                  <div className={styles.tours} onClick={onShowTours}>
                    <SFIcon icon="Rectangle-Star" />
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
