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
} from '@ionic/angular/standalone';

import { dequal } from 'dequal';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonAvatar,
    ProfileComponent,
    NgIf,
  ],
})
export class Tab3Page {
  pendingChanges: boolean = false;
  pendingProfile: UserProfile;
  constructor(protected user: UserService) {
    this.pendingProfile = { ...this.user.currentUser!.profile } as any;
  }

  profileChanged(profile: UserProfile) {
    this.pendingChanges = !dequal(profile, this.user.currentUser?.profile);
  }

  saveProfile() {
    this.user.Update(this.pendingProfile).subscribe(
      (res) => {
        this.pendingChanges = false;
      },
      (err) => {
        this.pendingChanges = false;
      }
    );
  }
}
