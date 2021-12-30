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
export class ItemService {

  constructor(private http: Http) { }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getItemDetails(itemCode, itemName, itemType) {
    //var accessToken = localStorage.getItem('accessToken');
    let searchUrl = urls.url + "/api/item/?itemCode="+itemCode+"&itemName="+itemName+"&itemStatus=Act&itemType="+itemType;
    console.log(searchUrl)
    return this.http.get(searchUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getGeneratedItemCode(itemType) {
    let searchUrl = urls.url + "/api/item/itemCode?itemType=" + itemType;
    return this.http.get(searchUrl)
      .pipe(map(res => res));
  }

  getUomDetails() {
    let searchUrl = urls.url + "/api/uom/";
    return this.http.get(searchUrl)
      .pipe(map(res => res));
  }

  addItemDetail(record) {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.post(urls.url + '/api/item/', record, { headers: headers })
      .pipe(map(res => res));
  }

  updateItemDetail(id, record) {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.put(urls.url + '/api/item/' + id, record, { headers: headers })
      .pipe(map(res => res));
  }

  deleteItemDetail(id) {
    let headers = new Headers();
    headers.append('content-type', 'application/json');
    return this.http.delete(urls.url + '/api/item/' + id, { headers: headers })
      .pipe(map(res => res));
  }

}
