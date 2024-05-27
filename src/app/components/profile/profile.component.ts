import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonInput,
  IonDatetimeButton,
  IonDatetime,
  IonModal,
  IonToolbar,
  IonButtons,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonItem,
  IonToggle,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';
import { CountryTelListComponent } from '../country-tel-list/country-tel-list.component';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  personOutline,
  phonePortraitOutline,
  calendarNumberOutline,
  mapOutline,
} from 'ionicons/icons';
import { UserService } from 'src/app/services/user.service';
import { CountryPhone } from 'src/app/types/CountryData';
import { CountryDetail } from 'src/app/types/CountryDetail';
import { UserProfile } from 'src/app/types/UserProfile';
import {
  CountryDetailList,
  DefaultCountryPhone,
  UnselectedCountry,
} from 'src/app/constants/CountryData';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonList,
    IonToggle,
    IonItem,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonContent,
    IonInput,
    IonDatetimeButton,
    IonDatetime,
    IonModal,
    IonToolbar,
    IonButtons,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    NgFor,
    FormsModule,
    CountryTelListComponent,
  ],
})
export class ProfileComponent {
  @Output() profileChanged = new EventEmitter<UserProfile>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('value') profile: UserProfile;
  hoveredCountry: CountryDetail;
  formIsValid: boolean = false;
  countryDetailList: CountryDetail[] = CountryDetailList;
  constructor(private user: UserService, private router: Router) {
    addIcons({
      personOutline,
      phonePortraitOutline,
      calendarNumberOutline,
      mapOutline,
    });

    if (!this.profile) {
      this.profile = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        phoneNumberCountry: DefaultCountryPhone,
        birthdate: new Date().toISOString(),
        country: UnselectedCountry,
      };
    }
  }

  firstNameChanged(e: string) {
    this.validateForm();
  }

  lastNameChanged(e: string) {
    this.validateForm();
  }

  phoneNumberChanged(e: any) {
    this.profile.phoneNumber = e;
    this.validateForm();
  }

  phoneNumberCountryChanged(country: CountryPhone) {
    this.profile.phoneNumberCountry = country;
    this.validateForm();
  }

  birthdateChanged(e: any) {
    this.profile.birthdate = e.detail.value;
    this.validateForm();
  }

  countryChanged(e: any) {
    this.hoveredCountry = e.detail.value;
  }

  onDidDismiss(event: CustomEvent) {
    if (event.detail.data == 'confirm') {
      this.profile.country = this.hoveredCountry;
    }
    this.hoveredCountry = null as any;
    this.validateForm();
  }

  validateForm() {
    let currentDate = new Date();
    let limitDate = new Date();
    limitDate.setFullYear(currentDate.getFullYear() - 18);

    let firstNameValid =
      this.profile.firstName && this.profile.firstName.length >= 2
        ? true
        : false;
    let lastNameValid =
      this.profile.lastName && this.profile.lastName.length >= 2 ? true : false;
    let phoneNumberValid =
      this.profile.phoneNumber && this.profile.phoneNumber.length >= 10
        ? true
        : false;
    let phoneNumberCountryValid = this.profile.phoneNumberCountry
      ? true
      : false;
    let birthdateValid = new Date(this.profile.birthdate) <= limitDate;
    let countryValid = this.profile.country.countryCode != '0';
    this.formIsValid =
      firstNameValid &&
      lastNameValid &&
      phoneNumberValid &&
      phoneNumberCountryValid &&
      birthdateValid &&
      countryValid;

    if (this.formIsValid) {
      this.profileIsValid();
    }
  }

  profileIsValid() {
    this.profileChanged.emit(this.profile);
  }
}
