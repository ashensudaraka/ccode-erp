import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../services/custom-date-parser-formatter.service';
import { QuotationService } from '../services/quotation.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-quotation-view',
  templateUrl: './quotation-view.component.html',
  styleUrls: ['./quotation-view.component.scss'],

  //Data service providers
  providers: [ItemService]
})
export class QuotationViewComponent implements OnInit {

  viewSendBtn: boolean = false;
  viewPrintBtn: boolean = false;

  quotationDetails: any;

  addItemForm: FormGroup;
  addCustomerForm: FormGroup;
  quotationForm: FormGroup;

  addItemFormsubmitted = false;
  addCustomerFormsubmitted = false;
  quotationFormsubmitted = false;

  addCustomerName: string = '';
  addCustomerType: string = '';
  addFirstName: string = '';
  addLastName: string = '';
  addTelephone: string = '';
  addMobile: string = '';
  addAddress1: string = '';
  addAddress2: string = '';
  addAddress3: string = '';
  addCity: string = '';
  addPostalCode: string = '';
  addCountry: string = '';
  addCurrency: string = '';
  addInvoiceMethod: string = '';
  addEmail: string = '';
  addCategory: string = '';
  addNotes: string = '';

  addItemName: string = '';
  addItemType: string = '';
  addDescription: string = '';
  addBuyPrice: string = '';
  addSellPrice: string = '';
  addUom: string = '';

  labourCost: any;
  transport: any;
  safty: any;
  overheads: any;

  profit: any;
  profitAmount: any;
  totalAmount: any;

  rowNumber: any;

  quotationNo: string;

  searchItemCode: string = '';
  searchItemName: string = '';
  searchItemType: string = '';

  errorMessage: string = '';
  errorCode: string = '';

  model: any = {};
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  invoiceFieldArray: Array<any> = [];
  invoiceNewAttribute: any = {};

  itemArray: any = [];
  customerArray: any = [];
  uomarray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: QuotationService,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {

    this.addFieldValue();

    this.addCustomerForm = this.formBuilder.group({
      addCustomerName: ['', Validators.required],
      addCustomerType: ['', Validators.required],
      addFirstName: ['', Validators.required],
      addLastName: ['', Validators.required],
      addTelephone: ['', Validators.required],
      addMobile: ['', Validators.required],
      addAddress1: ['', Validators.required],
      addAddress2: ['', Validators.required],
      addAddress3: ['', Validators.required],
      addCity: ['', Validators.required],
      addPostalCode: ['', Validators.required],
      addCountry: ['', Validators.required],
      addCurrency: ['', Validators.required],
      addInvoiceMethod: ['', Validators.required],
      addEmail: ['', [Validators.required, Validators.email]],
      addCategory: ['', Validators.required],
      addNotes: ['', Validators.required]
    });

    this.addItemForm = this.formBuilder.group({
      addItemType: ['', Validators.required],
      addItemName: ['', Validators.required],
      addDescription: ['', Validators.required],
      addBuyPrice: ['', Validators.required],
      addSellPrice: ['', Validators.required],
      addUom: ['', Validators.required],
      addBarCode: [''],
    });

    this.quotationForm = this.formBuilder.group({
      method: [''],
      customerCode: ['', Validators.required],
      quotationDate: [''],
      validTillDate: ['', Validators.required],
      itemTotal: [''],
      tax: [''],
      totalAmount: [''],
      quotationDescription: ['Quotation description is here...'],
    });

    this.getQuotationData();
    this.getAllItemData();
    this.getUomData();
  }

  //Convenience getter for easy access to form fields
  get f1() { return this.addCustomerForm.controls; }
  get f2() { return this.addItemForm.controls; }
  get f3() { return this.quotationForm.controls; }

  //Getting selected table row data for display quotation details
  getQuotationData() {

    this.quotationDetails = this.dataService.getRowData();

    if (this.quotationDetails != '') {

      this.quotationForm.patchValue({
        method: this.quotationDetails.method,
        customerCode: this.quotationDetails.customerCode,
        quotationDate: this.quotationDetails.quotationDate,
        validTillDate: this.quotationDetails.validTillDate
      });

      setTimeout(() => {
        document.getElementById('quotationNo').innerText = this.quotationDetails.quotationNo;
      }, 10);

      if (this.quotationDetails.method == 'email') {
        this.viewSendBtn = true;
      }
      else {
        this.viewPrintBtn = true;
      }
    }

  }

  save() {

    this.quotationFormsubmitted = true;
    if (this.quotationForm.invalid) {
      console.log("Error");
      return;
    }
    else {
      //Save function
      console.log("Success");
      console.log(this.fieldArray[0].unitPrice);
      console.log(this.quotationForm.value);
    }

  }

  //---For Item details table---
  //Adding new line for item list table
  addFieldValue() {
    this.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }

  //Deleting selected line
  deleteFieldValue(index) {

    //Changing calculations when deleting rows of the table
    this.deleteRowCalculation(index);

    this.fieldArray.splice(index, 1);
  }

  deleteNewFieldValue(index) {
    this.newAttribute.splice(index, 1);
  }

  //Item total calculations
  calculateItemTotal(rowNumber) {

    if (rowNumber >= 0 && rowNumber < 1000) {

      //Getting input values
      var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
      var quantity = this.fieldArray[rowNumber]['quantity'];
      var subTotal = this.fieldArray[rowNumber]['subTotal'];

      //Return values if tax & quantity undifined 
      if (quantity == undefined) {
        this.fieldArray[rowNumber]['quantity'] = 1;
        quantity = 1;
      };

      //Calculations
      subTotal = (unitPrice * quantity);
      this.fieldArray[rowNumber]['subTotal'] = subTotal;
    }

    var tax = this.quotationForm.value.tax;
    if (tax == undefined) {
      tax = 0;
    }

    var itemTotal = 0;
    var total = 0;

    for (let j = 0; j < this.fieldArray.length; j++) {
      itemTotal += (this.fieldArray[j]['unitPrice'] * this.fieldArray[j]['quantity']);
    }
    total = itemTotal + (itemTotal * tax / 100);

    //Set value for input fields
    this.quotationForm.patchValue({
      itemTotal: itemTotal,
      totalAmount: total
    });


  }

  //Reducing deleted value from item total
  deleteRowCalculation(rowNumber) {

    //Getting input values
    var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
    var quantity = this.fieldArray[rowNumber]['quantity'];
    var tax = this.quotationForm.value.tax;
    var itemTotal = this.quotationForm.value.itemTotal;

    //Reducing deleted values
    var newItemTotal = itemTotal - (unitPrice * quantity);
    var newTotal = newItemTotal + (newItemTotal * tax / 100);

    //Set value for input fields
    this.quotationForm.patchValue({
      itemTotal: newItemTotal,
      totalAmount: newTotal
    });

  }

  //Getting all item details 
  getAllItemData() {

    this.itemArray.length = 0;
    this.itemService.getItemDetails(this.searchItemCode, this.searchItemName, "2")
      .subscribe(results => {

        this.itemService.getItemDetails(this.searchItemCode, this.searchItemName, "3")
          .subscribe(results1 => {

            let status = results['status'];
            let status1 = results1['status'];

            if (status == 200 && status1 == 200) {
              let json = results['_body'];
              let json1 = results1['_body'];

              let rw = JSON.parse(json);
              let sv = JSON.parse(json1);

              for (let i = 0; i < rw.length; i++) {
                this.itemArray.push(rw[i]);
              }

              for (let j = 0; j < sv.length; j++) {
                this.itemArray.push(sv[j]);
              }

            }

          });

      }, err => {
        this.errorCode = err['status'];

        if (this.errorCode == '401') {
          this.errorMessage = "Unauthorized";
        }
        else if (this.errorCode == '403') {
          this.errorMessage = "Forbidden";
        }
        else if (this.errorCode == '404') {
          this.errorMessage = "Not Found";
        }
        else {
          this.errorMessage = "Failed to load resource";
        }
      });

  }

  //Filtering item details
  filterItemData() {
    this.itemArray.length = 0;

    if (this.searchItemCode == '' && this.searchItemName == '' && this.searchItemType == '') {
      this.getAllItemData();
    }
    else {

      this.itemService.getItemDetails(this.searchItemCode, this.searchItemName, this.searchItemType)
        .subscribe(results => {
          let status = results['status'];

          if (status == 200) {
            let json = results['_body'];

            this.itemArray = JSON.parse(json);

            //Changing array as descending order
            this.itemArray = this.itemArray.reverse(function (a, b) { return b.itemCode - a.itemCode });

          }
        }, err => {
          this.errorCode = err['status'];

          if (this.errorCode == '401') {
            this.errorMessage = "Unauthorized";
          }
          else if (this.errorCode == '403') {
            this.errorMessage = "Forbidden";
          }
          else if (this.errorCode == '404') {
            this.errorMessage = "Not Found";
          }
          else {
            this.errorMessage = "Failed to load resource";
          }
        });

    }

  }

  //Open item selection modal & getting row number of the list
  openItemSelectionModal(rowNumber) {
    this.rowNumber = rowNumber;
    ($("#itemSelectionModal") as any).modal("show");
  }

  //Getting item table's selected row data
  getItemRowData(data) {
    this.fieldArray[this.rowNumber]['item'] = data.itemName;
    this.fieldArray[this.rowNumber]['description'] = data.description;
    this.fieldArray[this.rowNumber]['unitPrice'] = data.sellPrice;
    ($("#itemSelectionModal") as any).modal("hide");
  }


  //Adding new item
  addItem() {
    this.addItemFormsubmitted = true;
    // Stop here if form is invalid
    if (this.addItemForm.invalid) {
      return;
    }

    let record =
    {
      "barcode": this.addItemForm.value.addBarCode,
      "buyPrice": this.addItemForm.value.addBuyPrice,
      "createdDate": "",
      "description": this.addItemForm.value.addDescription,
      "itemCode": "",
      "itemId": "",
      "itemName": this.addItemForm.value.addItemName,
      "itemType": "1",
      "modifiedDate": "",
      "sellPrice": this.addItemForm.value.addSellPrice,
      "status": "active",
      "um": this.addItemForm.value.addUom
    }

    console.log(record)
    this.itemService.addItemDetail(record)
      .subscribe(results => {

        // let status = results['status'];
        // this.changedItemCode = '';
        // this.changedItemCode = JSON.parse(results['_body']).itemCode;

        // if (status == 201) {
        //   this.arrayIndex = 0;
        //   this.getTableData();
        //   console.log(this.arrayIndex);
        //   this.resetAddItemForm();
        //   this.successMessageText = "Raw material code: " + this.changedItemCode + " has been created successfully."
        //   this.showSuccessMessage();
        // }

      }, err => {
        // let errorCode = err['status'];

        // if (errorCode == 401) {
        //   this.errorMessageText = "Error Code: 401, Unauthorized.";
        //   this.showErrorMessage();
        // }
        // else if (errorCode == 403) {
        //   this.errorMessageText = "Error Code: 403, Forbidden.";
        //   this.showErrorMessage();
        // }
        // else if (errorCode == 404) {
        //   this.errorMessageText = "Error Code: 404, Not Found.";
        //   this.showErrorMessage();
        // }
        // else {
        //   this.errorMessageText = "Error Code: " + errorCode + ", Undefined Error.";
        //   this.showErrorMessage();
        // }
      });
  }

  //Getting UoM for drop downs
  getUomData() {
    this.uomarray.length = 0;
    this.itemService.getUomDetails()
      .subscribe(results => {
        let status = results['status'];
        if (status == 200) {
          this.uomarray = JSON.parse(results['_body']);
        }
      }, err => {
        let errorCode = err['status'];

        if (errorCode == 401) {
          alert("Error Code: 401, Unauthorized");
        }
        else if (errorCode == 403) {
          alert("Error Code: 403, Forbidden");
        }
        else if (errorCode == 404) {
          alert("Error Code: 404, Not Found");
        }
      });
  }

  //Reset search fields by button ofitem selection modal
  resetSearchFields() {
    this.searchItemCode = '';
    this.searchItemName = '';
    this.searchItemType = '';
  }


}
