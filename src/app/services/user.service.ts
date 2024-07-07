import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { GoogleUser, FacebookUser, User } from '../types/User';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UserProfile } from '../types/UserProfile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: User | null = null;
  pendingUser: User | null = null;
  logoutEmitter: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private log: LogService,
    private router: Router,
    private api: ApiService
  ) {}

  SignIn(user: GoogleUser | FacebookUser, provider: 'Google' | 'Facebook') {
    this.api
      .post('common/finduser', { user, provider: provider })
      .subscribe(async (res: any) => {
        if (!res || res.user == null) {
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

  SignUp(profile: UserProfile) {
    let newUser = {
      ...this.pendingUser,
      profile: profile,
    } as User;

    this.api.post('common/signup', { user: newUser }).subscribe(
      (res: { acknowledged: boolean; insertedId: string } | unknown) => {
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

  Update(profile: UserProfile) {
    this.currentUser!.profile = profile;

    return this.api.post('common/updateprofile', { user: this.currentUser });
  }

  UploadPhoto(formData: FormData) {
    return this.api.post('common/uploadphoto', formData);
  }

  async SignOut(params?: any) {
    this.currentUser = null;
    this.pendingUser = null;
    this.logoutEmitter.next(true);
  }

  UnlinkSocial(provider: 'Google' | 'Facebook') {
    this.api
      .post(`common/unlinksocial?provider=${provider}`, { user: this.currentUser })
      .subscribe((res) => {
        if (provider == 'Google') {
          this.currentUser!.GoogleUser = null as any;
        } else {
          this.currentUser!.FacebookUser = null as any;
        }
      });
  }
}
