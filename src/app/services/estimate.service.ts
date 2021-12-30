import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  estimateData: any = '';

  constructor() { }

  setRowData(data) {
    this.estimateData = data;
  }

  getRowData() {
    return this.estimateData;
  }

}
