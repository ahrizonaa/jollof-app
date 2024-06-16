import { Injectable } from '@angular/core';
import { BehaviorSubject, skip } from 'rxjs';
import { Device, DeviceInfo } from '@capacitor/device';
import { Log } from '../types/Log';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  LogStream!: BehaviorSubject<Log>;
  Logs: Log[] = [];
  deviceInfo!: DeviceInfo;

  constructor(private http: HttpClient, private toast: ToastController) {
    this.initLogStream();
    this.getDeviceInfo();
    this.LogStream.subscribe((log: Log) => {
      // if (log && log.type) {
      //   (console as any)[log.type](log.message, log.data);
      // } else {
      //   console.log(log.message, log.data);
      // }
    });
  }

  write(log: Log) {
    log = {
      ...log,
      timestamp: new Date(),
    };
    this.Logs.push(log);
    this.LogStream.next(log);
    this.postLog(log);
  }

  info(msg: string, data?: any) {
    let log = {
      message: msg,
      data: data,
      type: 'info',
    };
    this.write(log);
  }

  debug(msg: string, data?: any) {
    let log = {
      message: msg,
      data: data,
      type: 'debug',
    };
    this.write(log);
  }

  error(msg: string, data?: any) {
    let log = {
      message: msg,
      data: data,
      type: 'error',
    };
    this.presentErrorToast(msg);
    this.write(log);
  }

  private postLog(log: Log): void {
    this.http
      .post(`${env.apiUrl}/log`, {
        ...log,
        deviceInfo: this.deviceInfo,
      })
      .subscribe((res: any) => {
        // if (!res.acknowledged) {
        //   throw new Error('Logging error');
        // }
      });
  }

  initLogStream() {
    this.LogStream = new BehaviorSubject<Log>(null as unknown as Log).pipe(
      skip(1)
    ) as BehaviorSubject<Log>;
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  async presentErrorToast(
    msg: string,
    position: 'top' | 'middle' | 'bottom' = 'top'
  ) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }
}
