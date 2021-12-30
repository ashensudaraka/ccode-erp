import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  quotationData: any = '';

  constructor() { }

  setRowData(data) {
    this.quotationData = data;
  }

  getRowData() {
    return this.quotationData;
  }

}
