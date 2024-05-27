import * as countries from 'country-codes-list';
import * as flags from 'emoji-flags';

import { CountryDetail } from '../types/CountryDetail';
import { CountryPhone } from '../types/CountryData';

export const CountryDetailList: CountryDetail[] = countries
  .all()
  .sort((a: CountryDetail, b: CountryDetail) => {
    return a.countryNameEn.localeCompare(b.countryNameEn);
  });

export const CountryPhoneList: CountryPhone[] = flags.data.map(
  (countryData) => {
    countryData.unicode = countryData.unicode
      .split(' ')
      .map((s) => '&#' + s.replace('U+', 'x') + ';')
      .join('');
    return countryData;
  }
) as CountryPhone[];

export const DefaultCountryPhone = CountryPhoneList.find(
  (country: CountryPhone) => {
    return country.code == 'US';
  }
) as CountryPhone;

export const UnselectedCountry = {
  countryNameEn: 'Select a Country',
  countryCode: '0',
} as CountryDetail;
