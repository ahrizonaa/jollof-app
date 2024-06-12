import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { api } from '../utility/Api';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  googleClientId: BehaviorSubject<string> = new BehaviorSubject(null as any);
  facebookAppId: BehaviorSubject<string> = new BehaviorSubject(null as any);

  constructor(private http: HttpClient) {
    this.http
      .get(api.origin + '/core/config?appName=jollof')
      .subscribe((res: any) => {
        this.googleClientId.next(res.googleClientId);
        this.facebookAppId.next(res.facebookAppId);
      });
  }
}
