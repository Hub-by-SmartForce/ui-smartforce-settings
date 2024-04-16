import React, { Fragment, useContext } from 'react';
import styles from './AgencyMessaging.module.scss';
import { SFButton } from 'sfui';
import { CustomerContext, UserContext, MediaContext } from '../../Context';
import { checkPermissions, isEqualObject } from '../../Helpers';
import {
  getNotificationsPreferences,
  updateRecipientsNotifications
} from '../../Services';
import {
  AGENCY_NOTIFICATIONS_EMAIL_UPDATE,
  COLORADO_STATE,
  VIRGINIA_STATE
} from '../../Constants';
import { RecipientsField } from './RecipientsField/RecipientsField';
import { Loader } from '../../Components';
import { SettingsError } from '../../Models';
import { ApiContext } from '../../Context';

const sortRecipients = (recipients: string[]): string[] => {
  const clonedRecipients = [...recipients.map((v) => v.toLowerCase())];
  return clonedRecipients.sort((a, b) => a.localeCompare(b));
};

const areRecipientsEqual = (
  recipients: string[],
  defaultRecipients: string[]
): boolean => {
  if (recipients.length !== defaultRecipients.length) {
    return false;
  }

  return isEqualObject(
    sortRecipients(recipients),
    sortRecipients(defaultRecipients)
  );
};

export interface AgencyMessagingProps {
  onError: (e: SettingsError) => void;
}

export const AgencyMessaging = ({
  onError
}: AgencyMessagingProps): React.ReactElement<AgencyMessagingProps> => {
  const apiBaseUrl = useContext(ApiContext).settings;
  const { isPhone } = React.useContext(MediaContext);
  const { customer } = React.useContext(CustomerContext);
  const { user } = React.useContext(UserContext);
  const canUpdateRecipients: boolean = checkPermissions(
    AGENCY_NOTIFICATIONS_EMAIL_UPDATE,
    user?.role.permissions
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSaveButtonLoading, setIsSaveButtonLoading] =
    React.useState<boolean>(false);

  const [defaultInvoiceRecipients, setDefaultInvoiceRecipients] =
    React.useState<string[]>([]);
  const [defaultStateReportsRecipients, setDefaultStateReportsRecipients] =
    React.useState<string[]>([]);

  const [stateReportsRecipients, setStateReportsRecipients] = React.useState<
    string[]
  >([]);
  const [invoiceRecipients, setInvoiceRecipients] = React.useState<string[]>(
    []
  );

  const isDiscardDisabled: boolean =
    areRecipientsEqual(defaultInvoiceRecipients, invoiceRecipients) &&
    areRecipientsEqual(defaultStateReportsRecipients, stateReportsRecipients);

  const [isStateReportsRecipientsInvalid, setIsStateReportsRecipientsInvalid] =
    React.useState<boolean>(false);
  const [isInvoiceRecipientsInvalid, setIsInvoiceRecipientsInvalid] =
    React.useState<boolean>(false);

  const resetRecipientsValidation = () => {
    setIsStateReportsRecipientsInvalid(false);
    setIsInvoiceRecipientsInvalid(false);
  };

  const onStateReportsRecipientChange = (
    values: string[],
    isInValid: boolean
  ) => {
    setIsStateReportsRecipientsInvalid(isInValid);
    setStateReportsRecipients(values);
  };

  const onInvoiceRecipientChange = (values: string[], isInValid: boolean) => {
    setIsInvoiceRecipientsInvalid(isInValid);
    setInvoiceRecipients(values);
  };

  const onDiscard = (): void => {
    setStateReportsRecipients(defaultStateReportsRecipients);
    setInvoiceRecipients(defaultInvoiceRecipients);
    resetRecipientsValidation();
  };

  const onSave = async (): Promise<void> => {
    try {
      setIsSaveButtonLoading(true);
      const stateReportsRecipientsChanged = !areRecipientsEqual(
        stateReportsRecipients,
        defaultStateReportsRecipients
      );
      const invoiceRecipientsChanged = !areRecipientsEqual(
        invoiceRecipients,
        defaultInvoiceRecipients
      );

      if (stateReportsRecipientsChanged) {
        const recipientUpdate = await updateRecipientsNotifications(
          apiBaseUrl,
          stateReportsRecipients,
          'state_report_recipients'
        );

        setStateReportsRecipients(recipientUpdate.emails);
        setDefaultStateReportsRecipients(recipientUpdate.emails);
      }

      if (invoiceRecipientsChanged) {
        const recipientUpdate = await updateRecipientsNotifications(
          apiBaseUrl,
          invoiceRecipients,
          'invoice_recipients'
        );

        setInvoiceRecipients(recipientUpdate.emails);
        setDefaultInvoiceRecipients(recipientUpdate.emails);
      }

      setIsSaveButtonLoading(false);
      resetRecipientsValidation();
    } catch (error: any) {
      console.error('Settings::AgencyMessaging::Update', error);
      onError(error);
    }
  };

  const isSaveDisabled = (): boolean => {
    if (isInvoiceRecipientsInvalid || isStateReportsRecipientsInvalid) {
      return true;
    }

    const stateReportsRecipientsNotChanged = areRecipientsEqual(
      stateReportsRecipients,
      defaultStateReportsRecipients
    );
    const invoiceRecipientsNotChanged = areRecipientsEqual(
      invoiceRecipients,
      defaultInvoiceRecipients
    );

    if (stateReportsRecipientsNotChanged && invoiceRecipientsNotChanged) {
      return true;
    }

    return false;
  };

  React.useEffect(() => {
    const getPreferences = async () => {
      try {
        setIsLoading(true);
        const preferences = await getNotificationsPreferences(apiBaseUrl);
        const preferencesInvoiceRecipients: string[] =
          preferences.notifications.email.invoice_recipients || [];
        const preferencesStateReportsRecipients: string[] =
          preferences.notifications.email.state_report_recipients || [];

        setDefaultStateReportsRecipients(preferencesStateReportsRecipients);
        setDefaultInvoiceRecipients(preferencesInvoiceRecipients);
        setStateReportsRecipients(preferencesStateReportsRecipients);
        setInvoiceRecipients(preferencesInvoiceRecipients);
        setIsLoading(false);
      } catch (error: any) {
        console.error('AgencyMessaging::getPreferences', error);
        onError(error);
      }
    };

    getPreferences();
  }, [apiBaseUrl, onError]);

  return (
    <Fragment>
      {!isLoading && (
        <div className={styles.agencyMessaging}>
          {(customer?.state_name === COLORADO_STATE ||
            customer?.state_name === VIRGINIA_STATE) && (
            <RecipientsField
              label="Agency’s monthly reports"
              disabled={!canUpdateRecipients}
              values={stateReportsRecipients}
              onChange={onStateReportsRecipientChange}
            />
          )}
          <RecipientsField
            label="Invoices"
            disabled={!canUpdateRecipients}
            values={invoiceRecipients}
            onChange={onInvoiceRecipientChange}
          />
          {canUpdateRecipients && (
            <Fragment>
              <div className={styles.footer}>
                {!isPhone && (
                  <SFButton
                    variant="text"
                    sfColor="grey"
                    disabled={isDiscardDisabled}
                    onClick={onDiscard}
                  >
                    Discard
                  </SFButton>
                )}

                <SFButton
                  isLoading={isSaveButtonLoading}
                  fullWidth={isPhone}
                  disabled={isSaveDisabled()}
                  onClick={onSave}
                >
                  {isPhone ? 'Save Changes' : 'Save'}
                </SFButton>
              </div>
            </Fragment>
          )}
        </div>
      )}
      {isLoading && <Loader />}
    </Fragment>
  );
};
