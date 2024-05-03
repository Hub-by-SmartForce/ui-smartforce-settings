import { ChipFieldValueType } from 'sfui';
import { BLOCK_DOMAINS } from '../Constants';

export const isOfficerIdValid = (officerId: string): boolean => {
  const re = /^(?=.{1,8}$)[a-zA-Z\d]+(-{0,1}[a-zA-Z\d]+){0,2}$/;
  return re.test(officerId);
};

export const isPasswordValid = (password: string): boolean =>
  password.length > 8;

export const isEmailFormatValid = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
  return re.test(email.toLowerCase());
};

export const isEmailValid = (email: string) => {
  return (
    BLOCK_DOMAINS.indexOf(email.split('@')[1]) === -1 &&
    isEmailFormatValid(email)
  );
};

export const isOriValid = (ori: string): boolean => {
  return /^[A-Z0-9]{9}$/.test(ori);
};

export function isChipListValid(list: ChipFieldValueType[]) {
  return (
    list.length > 0 &&
    list.every((member: ChipFieldValueType) => member.isValid)
  );
}
