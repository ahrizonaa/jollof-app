import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonInput,
  IonSelect,
  IonContent,
  IonPopover,
  IonButton,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

import { SafehtmlPipe } from 'src/app/pipes/safehtml.pipe';
import { UserService } from 'src/app/services/user.service';

import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { FormsModule } from '@angular/forms';
polyfillCountryFlagEmojis();

import { addIcons } from 'ionicons';
import { chevronExpandOutline } from 'ionicons/icons';
import { CountryPhone } from 'src/app/types/CountryData';
import {
  CountryPhoneList,
  DefaultCountryPhone,
} from 'src/app/constants/CountryData';

@Component({
  selector: 'app-country-tel-list',
  templateUrl: './country-tel-list.component.html',
  styleUrls: ['./country-tel-list.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonNote,
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonButton,
    IonContent,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    NgFor,
    IonSelect,
    IonPopover,
    SafehtmlPipe,
    FormsModule,
  ],
})
export class CountryTelListComponent implements OnInit {
  @Output() countryChanged = new EventEmitter<CountryPhone>();
  @Output() phoneNumberChangedCallback = new EventEmitter<string>();
  countryPhoneList: CountryPhone[] = CountryPhoneList;
  countrySearchResults: CountryPhone[] = [];
  countrySearchQuery: string = '';
  countryPhone: CountryPhone;
  phoneNumber: string = '';
  constructor(protected user: UserService) {
    addIcons({
      chevronExpandOutline,
    });

    this.countrySearchResults = [...this.countryPhoneList];
  }

  ngOnInit(): void {
    this.countryPhone =
      this.user.currentUser?.profile?.phoneNumberCountry || DefaultCountryPhone;
    this.countryChanged.emit(this.countryPhone);

    this.phoneNumber = this.user.currentUser?.profile?.phoneNumber || '';
  }

  searchBarClicked(e: Event) {
    e.stopPropagation();
  }

  countrySelected(country: CountryPhone) {
    this.countryPhone = country;
    this.countryChanged.emit(country);
  }

  phoneNumberChanged(phoneNumber: any) {
    this.phoneNumberChangedCallback.emit(phoneNumber);
  }

  countrySearched(searchQuery: string) {
    if (!searchQuery) {
      this.countrySearchResults = [...this.countryPhoneList];
    } else if (searchQuery.length <= 2) {
      this.countrySearchResults = this.countryPhoneList.filter(
        (country: CountryPhone) => {
          return country.name
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
        }
      );
    } else {
      this.countrySearchResults = this.countryPhoneList.filter(
        (country: CountryPhone) => {
          return (
            country.name.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1
          );
        }
      );
    }
  }

  countrySearchCleared() {
    this.countrySearchResults = [...this.countryPhoneList];
  }
}
