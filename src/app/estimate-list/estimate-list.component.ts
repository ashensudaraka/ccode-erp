import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../services/custom-date-parser-formatter.service';
import { EstimateService } from '../services/estimate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate-list.component.html',
  styleUrls: ['./estimate-list.component.scss']
})
export class EstimateListComponent implements OnInit {

  searchEstimateNo: string = '';
  searchCustomerName: string = '';
  searchEstimateDate: string = '';

  estimateHeaderArray: any = [
    {
      'id': '1',
      'estimateNo': 'EN001',
      'estimateDate': '22/9/2021',
      'validDate': '23/10/2021',
      'sendMethod': 'email',
      'customerCode': 'CC003',
      'status': 'draft',
      'labourCost': '1000',
      'transportCost': '400',
      'overheadCost': '600',
      'saftyCost': '300',
      'profitPercentage': '25',
      'profitAmount': '600',
      'totalCost': '2000',
    },
    {
      'id': '2',
      'estimateNo': 'EN002',
      'estimateDate': '7/3/2021',
      'validDate': '8/4/2021',
      'sendMethod': 'email',
      'customerCode': 'CC002',
      'status': 'draft',
      'labourCost': '1200',
      'transportCost': '300',
      'overheadCost': '400',
      'saftyCost': '500',
      'profitPercentage': '15',
      'profitAmount': '300',
      'totalCost': '2500',
    },
    {
      'id': '3',
      'estimateNo': 'EN003',
      'estimateDate': '20/10/2021',
      'validDate': '21/11/2021',
      'sendMethod': 'email',
      'customerCode': 'CC002',
      'status': 'approved',
      'labourCost': '2300',
      'transportCost': '400',
      'overheadCost': '200',
      'saftyCost': '400',
      'profitPercentage': '20',
      'profitAmount': '700',
      'totalCost': '3600',
    },
    {
      'id': '4',
      'estimateNo': 'EN004',
      'estimateDate': '10/11/2021',
      'validDate': '11/12/2021',
      'sendMethod': 'email',
      'customerCode': 'CC001',
      'status': 'approved',
      'labourCost': '2300',
      'transportCost': '700',
      'overheadCost': '270',
      'saftyCost': '450',
      'profitPercentage': '25',
      'profitAmount': '800',
      'totalCost': '4600',
    },
    {
      'id': '5',
      'estimateNo': 'EN005',
      'estimateDate': '22/9/2021',
      'validDate': '23/10/2021',
      'sendMethod': 'email',
      'customerCode': 'CC002',
      'status': 'draft',
      'labourCost': '1000',
      'transportCost': '400',
      'overheadCost': '600',
      'saftyCost': '300',
      'profitPercentage': '25',
      'profitAmount': '600',
      'totalCost': '2000',
    },
    {
      'id': '6',
      'estimateNo': 'EN006',
      'estimateDate': '12/10/2021',
      'validDate': '13/11/2021',
      'sendMethod': 'email',
      'customerCode': 'CC003',
      'status': 'draft',
      'labourCost': '1000',
      'transportCost': '400',
      'overheadCost': '600',
      'saftyCost': '300',
      'profitPercentage': '25',
      'profitAmount': '600',
      'totalCost': '2000',
    },

  ];

  constructor(
    private formBuilder: FormBuilder,
    private dateService: CustomDateParserFormatterService,
    private dataService: EstimateService,
    private router: Router,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>
  ) { }

  ngOnInit(): void {

  }


  //Getting selected table row data for display estimate details
  displayEstimate(data) {
    this.dataService.setRowData(data);
    this.router.navigate(['home/estimateView']);
  }

}
