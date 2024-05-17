import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  phonePortraitOutline,
  calendarNumberOutline,
  mapOutline,
} from 'ionicons/icons';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class OnboardComponent {
  fullName: string;
  fullNameValid: boolean = false;
  phoneNumber: string;
  phoneNumberValid: boolean = false;
  birthdate: Date;
  birthdateValid: boolean = false;
  country: string;
  countryValid: boolean = false;
  formIsValid: boolean = false;
  constructor(
    private user: UserService,
    private router: Router,
    private api: ApiService
  ) {
    addIcons({
      personOutline,
      phonePortraitOutline,
      calendarNumberOutline,
      mapOutline,
    });
  }

  nameChanged(e: string) {
    this.fullNameValid = e && e.length >= 2 ? true : false;
    this.validateForm();
  }

  phoneNumberChanged(e: any) {
    this.phoneNumberValid = e && e.length == 10;
    this.validateForm();
  }

  birthdateChanged(e: any) {
    let currentDate = new Date();
    let limitDate = new Date();
    limitDate.setFullYear(currentDate.getFullYear() - 18);
    let selectedDate = new Date(e.detail.value);
    this.birthdate = selectedDate;
    this.birthdateValid = this.birthdate <= limitDate;
    this.validateForm();
  }

  countryChanged(e: CustomEvent) {
    this.country = e.detail.value;
    this.countryValid = e.detail.value ? true : false;
    this.validateForm();
  }

  onDidDismiss(event: CustomEvent) {
    console.log('didDismiss', JSON.stringify(event.detail));
  }

  async switchAccount() {
    this.user.SignOut();
    await this.router.navigate(['/login']);
  }

  proceedClicked() {
    this.user.Register({
      name: this.fullName,
      phoneNumber: this.phoneNumber,
      birthdate: this.birthdate.toLocaleDateString('en-US'),
      country: this.country,
    });
  }

  validateForm() {
    this.formIsValid =
      this.fullNameValid &&
      this.phoneNumberValid &&
      this.birthdateValid &&
      this.countryValid;
  }
}
