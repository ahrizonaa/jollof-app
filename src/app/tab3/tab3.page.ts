import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';

import { addIcons } from 'ionicons';
import { airplane, wifi, bluetooth, call } from 'ionicons/icons';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class Tab3Page {
  constructor(protected user: UserService) {
    addIcons({
      airplane,
      wifi,
      bluetooth,
      call,
    });
  }
}
