import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { GoogleUser, FacebookUser, NimbelWearUser } from '../types/User';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: NimbelWearUser | null = null;
  pendingUser: NimbelWearUser | null = null;
  logoutEmitter: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private log: LogService,
    private router: Router,
    private api: ApiService
  ) {}

  SignIn(user: GoogleUser | FacebookUser, provider: 'Google' | 'Facebook') {
    this.api
      .post('finduser', { user, provider: provider })
      .subscribe(async (res: any) => {
        if (res.user == null) {
          switch (provider) {
            case 'Google':
              let googleUser = user as GoogleUser;
              this.pendingUser = {
                email: googleUser.email,
                name: googleUser.name,
                imgUrl: googleUser.imageUrl,
                id: googleUser.id,
                GoogleUser: googleUser,
                FacebookUser: null,
              };
              break;
            case 'Facebook':
              let facebookUser = user as FacebookUser;
              this.pendingUser = {
                email: facebookUser.email,
                name: facebookUser.name,
                imgUrl: facebookUser.picture.url,
                id: facebookUser.id,
                GoogleUser: null,
                FacebookUser: facebookUser,
              };
              break;
            default:
              this.log.error(`Unknown provider: ${provider}`);
              this.currentUser = null;
              this.pendingUser = null;
              break;
          }
          await this.router.navigate(['/onboard']);
          return;
        } else {
          this.currentUser = res.user;
          await this.router.navigate(['/']);
          return;
        }
      });
  }

  Register(profile: any) {
    let newUser = {
      ...this.pendingUser,
      profile: profile,
    } as NimbelWearUser;

    this.api.post('createuser', { user: newUser }).subscribe(
      (res: any) => {
        console.log(res);
        this.currentUser = newUser;
        this.pendingUser = null;
        this.router.navigate(['/']);
      },
      (err) => {
        this.currentUser = newUser;
        this.pendingUser = null;
        console.log('new user request failed', err);
        this.router.navigate(['/login']);
      }
    );
  }

  async SignOut(params?: any) {
    this.currentUser = null;
    this.pendingUser = null;
    this.logoutEmitter.next(true);
  }
}
