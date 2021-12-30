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
export class ClientService {

  constructor(private http: Http) { }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getClientDetails(clientCode, clientName, clientType) {
    let searchUrl = urls.url + "/api/customer/?custCode="+clientCode+"&custName="+clientName+"&custType="+clientType+"&status=Act";
    console.log(searchUrl)
    return this.http.get(searchUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCountriesDetails() {
    let searchUrl = urls.url + "/api/country";
    return this.http.get(searchUrl)
      //.pipe(map(res => res));
      .pipe(catchError(this.handleError));
  }

  getCurrencyDetails() {
    let searchUrl = urls.url + "/api/currency";
    return this.http.get(searchUrl)
      //.pipe(map(res => res));
      .pipe(catchError(this.handleError));
  }

  getGeneratedClientCode(clientType) {
    let searchUrl = urls.url + "/client/clientCode?clientType=" + clientType;
    return this.http.get(searchUrl)
      .pipe(map(res => res));
  }

  addClientDetail(record) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(urls.url + '/api/customer/?status=Act', record, { headers: headers })
      .pipe(map(res => res));
  }

  updateClientDetail(id, record) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(urls.url + '/client/' + id, record, { headers: headers })
      .pipe(map(res => res));
  }

  deleteClientDetail(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(urls.url + '/client/' + id, { headers: headers })
      .pipe(map(res => res));
  }

}
