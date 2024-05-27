import { CountryPhone } from './CountryData';
import { CountryDetail } from './CountryDetail';

export type UserProfile = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumberCountry: CountryPhone;
  birthdate: string;
  country: CountryDetail;
};
