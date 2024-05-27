import { Component } from '@angular/core';

import { UserService } from '../services/user.service';

import { ProfileComponent } from '../components/profile/profile.component';
import { UserProfile } from '../types/UserProfile';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonInput,
  IonItem,
  IonCheckbox,
  IonList,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';

import { dequal } from 'dequal';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { logoFacebook, logoGoogle, removeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonIcon,
    IonCheckbox,
    IonItem,
    IonInput,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonAvatar,
    IonCard,
    IonList,
    IonCardContent,
    ProfileComponent,
    NgIf,
  ],
})
export class Tab3Page {
  pendingChanges: boolean = false;
  pendingProfile: UserProfile;
  constructor(protected user: UserService) {
    this.pendingProfile = { ...this.user.currentUser!.profile } as any;
    addIcons({
      logoFacebook,
      logoGoogle,
      removeCircleOutline,
    });
  }

  profileChanged(profile: UserProfile) {
    this.pendingChanges = !dequal(profile, this.user.currentUser?.profile);
  }

  saveProfile() {
    this.user.Update(this.pendingProfile).subscribe(
      (res) => {
        console.log(res);
        this.pendingChanges = false;
      },
      (err) => {
        this.pendingChanges = false;
      }
    );
  }

  logout() {
    this.user.SignOut();
  }

  removeGoogle() {
    this.user.UnlinkGoogle();
  }

  removeFacebook() {
    this.user.UnlinkFacebook();
  }
}
