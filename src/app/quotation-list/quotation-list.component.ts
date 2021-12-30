import { Component, OnInit, ViewChild } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {

  searchQuotationNo: string = '';
  searchCustomerName: string = '';
  searchQuotationDate: string = '';
  searchEstimateNo: string = '';

  quotationArray: any = [
    {
      'quotationNo': 'Q001',
      'quotationDate': '2/3/2021',
      'method': 'email',
      'customerCode': 'CC001',
      'estimateDate': '2/3/2021',
      'validTillDate': '15/3/2021'
    },
    {
      'quotationNo': 'Q002',
      'quotationDate': '3/3/2021',
      'method': 'print',
      'customerCode': 'CC002',
      'estimateDate': '4/3/2021',
      'validTillDate': '13/3/2021'
    }
  ];

  constructor(
    private dataService: QuotationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  //Getting selected table row data for display item details
  setRowData(data) {
    console.log(data);
    this.dataService.setRowData(data);
    this.router.navigate(['home/quotationView']);
  }

}
