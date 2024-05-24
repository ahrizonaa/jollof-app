import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  googleClientId: BehaviorSubject<string> = new BehaviorSubject(null as any);
  facebookAppId: BehaviorSubject<string> = new BehaviorSubject(null as any);

  constructor(private api: ApiService) {
    this.api.get('appsettings').subscribe((res: any) => {
      this.googleClientId.next(res.googleClientId);
      this.facebookAppId.next(res.facebookAppId);
    });
  }
}
