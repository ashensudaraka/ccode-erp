import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { urls } from '../base_url/base_url';
import { HttpInterceptor, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: Http) { }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  userController(record) {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post(urls.url + '/authenticate', record, { headers: headers })
      .pipe(map(res => res));
  }

}
