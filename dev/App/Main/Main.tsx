import React from 'react';
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
  LARGE_SCREEN
} from '../../../src';
import { SFSpinner, useSFMediaQuery } from 'sfui';
import { BASE_URL } from '../App';
import { getTimezones } from '../../../src/Services/TimezoneService';
import { logout } from '../../../src/Services/AuthService';

export const Main = (): React.ReactElement<{}> => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { setUser, setBusinessCardSettings } = React.useContext(UserContext);
  const { setAreas } = React.useContext(AreasContext);
  const { setCustomer } = React.useContext(CustomerContext);
  const { setSubscriptions } = React.useContext(SubscriptionContext);
  const { setTimezones } = React.useContext(TimezonesContext);
  const [selectedSectionName, setSelectedSectionName] = React.useState<
    string | undefined
  >();

  const isBigScreen: boolean = useSFMediaQuery(LARGE_SCREEN);

  const onSettingsError = (e: SettingsError) => console.error(e);
  const onHome = () => console.log('onHome');
  const onUpgrade = () => console.log('onUpgrade');

  React.useEffect(() => {
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

  return (
    <React.Fragment>
      {isLoading && <SFSpinner />}
      {!isLoading && (
        <div className={styles.main}>
          <SFTopBar
            enviroment="local"
            product="cc"
            siteTitle="Settings"
            isBottomTitleVisible={!isBigScreen}
            onLogout={onLogout}
            onMenuButtonClick={onMenuButtonClick}
          />

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
      )}
    </React.Fragment>
  );
};
