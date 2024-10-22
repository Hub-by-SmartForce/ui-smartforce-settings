import { BusinessCardData } from 'business-card-component';
import { BusinessCardSettings, Customer, User } from '../Models';

export const getBusinessCardData = (
  values: BusinessCardSettings,
  user: User,
  customer: Customer
): BusinessCardData => {
  return {
    officer: {
      name: values.officer_information.show_name ? user.name : undefined,
      idNumber: values.officer_information.show_officer_id
        ? user.officer_id
        : undefined,
      phoneNumber: values.officer_information.show_phone
        ? user.phone
        : undefined,
      email: values.officer_information.show_email ? user.email : undefined,
      avatarUrl: values.officer_information.show_photo
        ? user.avatar_url ?? undefined
        : undefined,
      title: values.officer_information.show_title
        ? user.title?.name
        : undefined
    },
    customer: {
      name: values.agency_information.show_name
        ? customer.full_name ?? undefined
        : undefined,
      state: values.agency_information.show_state
        ? customer.state_name
        : undefined,
      badgeUrl: values.agency_information.show_photo
        ? customer.badge ?? undefined
        : undefined,
      phoneNumber: values.agency_information.show_phone
        ? customer.phone1
        : undefined,
      email: values.agency_information.show_email
        ? customer.email ?? undefined
        : undefined,
      webSite: values.agency_information.show_website
        ? customer.website ?? undefined
        : undefined
    }
  };
};
