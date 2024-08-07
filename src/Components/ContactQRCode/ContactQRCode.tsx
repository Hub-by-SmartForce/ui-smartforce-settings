import React from 'react';
import QRCode from 'qrcode.react';
import { CustomerContext, UserContext } from '../../Context';
import { User, Customer, BusinessCardSettings } from '../../Models';

export interface ContactQRCodeProps {
  className?: string;
  baseUrl: string;
  user: Partial<User>;
  incidentNumber?: string;
  notes?: string;
  eventIdentifier?: string;
  size?: number;
}

interface QRCodeData {
  cn?: string | null;
  cs?: string | null;
  cb?: string | null;
  cp?: string | null;
  cm?: string | null;
  cw?: string | null;
  on?: string | null;
  oid?: string | null;
  op?: string | null;
  om?: string | null;
  oa?: string | null;
  in?: string | null;
  pn?: string | null;
  ei?: string | null;
}

const isEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    value.trim() === '' ||
    value === 'null' ||
    value === 'undefined'
  );
};

function getQRCodeData(
  user: Partial<User>,
  customer?: Customer,
  settings?: BusinessCardSettings,
  notes?: string,
  incidentNumber?: string,
  eventIdentifier?: string
): QRCodeData {
  const isIncident = !isEmpty(incidentNumber);

  let data: QRCodeData = {};

  if (isIncident || settings?.agency_information.show_name) {
    data.cn = encodeURIComponent(customer?.full_name as string);
  }
  if (isIncident || settings?.agency_information.show_state) {
    data.cs = encodeURIComponent(customer?.state_name as string);
  }
  if (isIncident || settings?.agency_information.show_photo) {
    data.cb = encodeURIComponent(customer?.badge as string);
  }
  if (isIncident || settings?.agency_information.show_phone) {
    data.cp = encodeURIComponent(customer?.phone1 as string);
  }
  if (isIncident || settings?.agency_information.show_email) {
    data.cm = encodeURIComponent(customer?.email as string);
  }
  if (isIncident || settings?.agency_information.show_website) {
    data.cw = encodeURIComponent(customer?.website as string);
  }
  if (isIncident || settings?.officer_information.show_name) {
    data.on = encodeURIComponent(user.name as string);
  }
  if (isIncident || settings?.officer_information.show_officer_id) {
    data.oid = encodeURIComponent(user.officer_id as string);
  }
  if (isIncident || settings?.officer_information.show_phone) {
    data.op = encodeURIComponent(user.phone as string);
  }
  if (isIncident || settings?.officer_information.show_email) {
    data.om = encodeURIComponent(user.email as string);
  }
  if (isIncident || settings?.officer_information.show_photo) {
    data.oa = encodeURIComponent(user.avatar_url as string);
  }
  if (isIncident) {
    data.in = encodeURIComponent(incidentNumber as string);
  }
  if (notes) {
    data.pn = encodeURIComponent(notes);
  }
  if (eventIdentifier) {
    data.ei = encodeURIComponent(eventIdentifier);
  }

  return data;
}

const getQRCodeURL = (
  baseUrl: string,
  user: Partial<User>,
  customer?: Customer,
  settings?: BusinessCardSettings,
  notes?: string,
  incidentNumber?: string,
  eventIdentifier?: string
): string => {
  const data = getQRCodeData(
    user,
    customer,
    settings,
    notes,
    incidentNumber,
    eventIdentifier
  );

  const ccPublicURL: string = `${baseUrl}/?token=`;

  const paramsArray: string[] = [];
  Object.keys(data).forEach((key) => {
    const value: string | null | undefined = data[key as keyof QRCodeData];

    if (!isEmpty(value)) {
      paramsArray.push(`${key}=${value}`);
    }
  });
  const token = btoa(paramsArray.join('&'));

  return `${ccPublicURL}${token}`;
};

export const ContactQRCode = ({
  size = 256,
  user,
  baseUrl,
  ...props
}: ContactQRCodeProps): React.ReactElement<ContactQRCodeProps> => {
  const { customer } = React.useContext(CustomerContext);
  const { userSettings } = React.useContext(UserContext);

  return (
    <QRCode
      className={props.className}
      value={getQRCodeURL(
        baseUrl,
        user,
        customer,
        userSettings?.business_card,
        props.notes,
        props.incidentNumber,
        props.eventIdentifier
      )}
      size={size}
      renderAs="svg"
      includeMargin={true}
    />
  );
};
