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
  hideTours,
  useSaveTourAction,
  getAppNotifications,
  AppNotificationsContext,
  InteractiveBox
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
    onClose: onTourClose,
    tour: activeTour,
    isFeatureReminderOpen,
    setIsFeatureReminderOpen,
    onDisableReminder,
    onInitPaused
  } = useContext(TourContext);
  const { setUser, setUserSettings } = useContext(UserContext);
  const { setNotifications } = useContext(AppNotificationsContext);
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
  const onActivate = () => console.log('onActivate');
  const onUpgrade = () => console.log('onUpgrade');
  const onGenerateDebitUrl = (url: string) => {
    console.log('onGenerateDebitUrl:', url);
  };

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

          const appNotifications = await getAppNotifications(BASE_URL);
          setNotifications(appNotifications);

          const tourSettings = userSettings.tours.find((t) => t.app === 'cc');

          if (tourSettings?.circuit) {
            const pausedTour = TOURS.find(
              (t) => t.id === tourSettings?.circuit
            );
            if (pausedTour) {
              onInitPaused(pausedTour);
            }
          }

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
  }, [
    onInitPaused,
    setAreas,
    setCustomer,
    setNotifications,
    setSubscriptions,
    setTimezones,
    setUser,
    setUserSettings
  ]);

  const onLogout = () => {
    logout();
    window.location.reload();
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
    } else if (tour.id === 4) {
      setSelectedSectionName('business_card');
    } else if (tour.id === 5) {
      setSelectedSectionName('areas');
    } else if (tour.id === 9) {
      setSelectedSectionName('groups');
    } else return;

    onTourStart(tour);
  };

  const onResumeTour = () => {
    onStartTour(activeTour as Tour);
  };

  const onShowTours = () => {
    onTourClose();
    setIsToursCarrouselOpen(true);
  };

  useSaveTourAction(BASE_URL, 'cc');

  return (
    <React.Fragment>
      {isLoading && <SFSpinner aria-label="Fetching content" />}
      {!isLoading && (
        <Fragment>
          <TourResumeTab onExit={onExitTourResume} onResume={onResumeTour} />

          <ToursCarrouselModal
            tours={TOURS}
            open={isToursCarrouselOpen}
            onClose={onCloseTourCarrousel}
            onStart={(tour) => onStartTour(tour)}
          />

          <div className={styles.main}>
            <SFTopBar
              enviroment="local"
              product="cc"
              siteTitle="Settings"
              isBottomTitleVisible={!isBigScreen}
              officerCardUrl="https://officercard-dev.citizencontact.app"
              onLogout={onLogout}
              onMenuButtonClick={onMenuButtonClick}
              onError={onSettingsError}
            />

            <div className={styles.content}>
              <div className={styles.leftPanel}>
                <ToursReminderTooltip
                  open={isFeatureReminderOpen}
                  onGotIt={onGotIt}
                >
                  <InteractiveBox
                    className={styles.tours}
                    onClick={onShowTours}
                  >
                    <SFIcon icon="Rectangle-Star" />
                    <SFText type="component-1" sfColor="neutral">
                      Feature Tours
                    </SFText>
                  </InteractiveBox>
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
                onActivate={onActivate}
                onUpgrade={onUpgrade}
                onSectionChange={(name) => setSelectedSectionName(name)}
                onGenerateDebitUrl={onGenerateDebitUrl}
              />
            </div>
          </div>
        </Fragment>
      )}
    </React.Fragment>
  );
};
