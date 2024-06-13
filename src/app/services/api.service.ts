import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { LogService } from './log.service';
import { api } from '../utility/Api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private log: LogService) {}

  get(path: string) {
    return this.http.get(`${api.url}/${path}`).pipe(catchError(this.httpError));
  }

  post(path: string, data: any) {
    return this.http
      .post(`${api.url}/${path}`, data)
      .pipe(catchError(this.httpError));
  }

  put(path: string, data: any) {
    return this.http
      .put(`${api.url}/${path}`, data)
      .pipe(catchError(this.httpError));
  }

  delete(path: string) {
    return this.http
      .delete(`${api.url}/${path}`)
      .pipe(catchError(this.httpError));
  }

  httpError(err: any) {
    this.log.error(
      'Ruh roh! Something went wrong while talking to our servers.',
      err
    );
    return err;
  }
}
