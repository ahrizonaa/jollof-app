import { CountryData } from 'emoji-flags';
export interface CountryPhone extends CountryData {
  dialCode: string;
}
