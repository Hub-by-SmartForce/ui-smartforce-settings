import React from 'react';

export const EMAIL_INVALID_MSG = (
  <p style={{ margin: 0 }}>
    Please enter an email in the correct format and domain.
    <br />
    For example: yourname@youragency.com
  </p>
);

export const OFFICER_ID_INVALID_MSG =
  'It must have at least 1 and up to 8 characters. Only letters, numbers, and hyphens are allowed.';

export const PASSWORD_INVALID_MSG =
  'Please set a password longer than eight characters.';

export const ORI_INVALID_MSG =
  'It must have 9 characters. Only uppercase letters and numbers are allowed.';
export const ORI_TAKEN_MSG = 'This ORI number is already taken.';

export const PAYMENT_ERROR_CARD_ISSUE_MSG =
  'Please try again using a different card or contact the card issuer.';
export const PAYMENT_ERROR_CARD_DETAILS_MSG =
  'Please check your card details and try again.';
export const PAYMENT_ERROR_PROCESS_MSG = 'Please try again later.';
