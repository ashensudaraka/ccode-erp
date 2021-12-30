import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from '../services/custom-date-parser-formatter.service';
import { EstimateService } from '../services/estimate.service';
import { ItemService } from '../services/item.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-estimate-view',
  templateUrl: './estimate-view.component.html',
  styleUrls: ['./estimate-view.component.scss'],

  //Data service providers
  providers: [ItemService]
})
export class EstimateViewComponent implements OnInit {

  estimateDetails: any;

  addItemForm: FormGroup;
  addClientForm: FormGroup;
  estimateForm: FormGroup;

  addItemFormsubmitted = false;
  addClientFormsubmitted = false;
  estimateFormsubmitted = false;

  addClientName: string = '';
  addClientType: string = '';
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

  searchItemCode: string = '';
  searchItemName: string = '';
  searchItemType: string = '';

  searchClientCode: string = '';
  searchClientName: string = '';
  searchClientType: string = '';

  errorMessage: string = '';
  errorCode: string = '';

  successMessageText: string = '';
  errorMessageText: string = '';

  rowNumber: any;

  changedItemCode: string = '';

  labourCost: any;
  transport: any;
  safty: any;
  overheads: any;

  profit: any;
  profitAmount: any;
  totalAmount: any;

  estimateNo: string;

  model: any = {};
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  invoiceFieldArray: Array<any> = [];
  invoiceNewAttribute: any = {};

  clientArray: any = [];
  itemArray: any = [];
  uomarray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dateService: CustomDateParserFormatterService,
    private dataService: EstimateService,
    private itemService: ItemService,
    private clientService: ClientService,
    private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>
  ) { }

  ngOnInit(): void {

    this.addFieldValue();
    this.changeStatusColor()

    this.addClientForm = this.formBuilder.group({
      addClientName: ['', Validators.required],
      addClientType: ['', Validators.required],
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
      addItemType: ['1'],
      addItemName: ['', Validators.required],
      addDescription: ['', Validators.required],
      addBuyPrice: ['', Validators.required],
      addSellPrice: ['', Validators.required],
      addUom: ['', Validators.required],
      addBarCode: [''],
    });

    this.estimateForm = this.formBuilder.group({
      status: [{ value: 'draft' }],
      method: ['email'],
      clientCode: ['', Validators.required],
      estimateDate: [''],
      validTillDate: ['', Validators.required],
      total: [''],
      labourCost: [''],
      transport: [''],
      safty: [''],
      overheads: [''],
      profit: [''],
      profitAmount: [''],
      totalAmount: [''],
    });

    this.getEstimationData();
    this.getUomData();
    this.getItemTableData();
    this.getClientTableData()
  }

  //Convenience getter for easy access to form fields
  get f1() { return this.addClientForm.controls; }
  get f2() { return this.addItemForm.controls; }
  get f3() { return this.estimateForm.controls; }

  //Getting selected table row data for display estimate details
  getEstimationData() {

    this.estimateDetails = this.dataService.getRowData();

    if (this.estimateDetails != '') {
      //Set date for date picker
      let dateParts = this.estimateDetails.validDate.split("/");
      let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      let year = dateObject.getFullYear();
      let month = dateObject.getMonth() + 1;
      let day = dateObject.getDate();

      this.estimateForm.patchValue({
        status: this.estimateDetails.status,
        method: this.estimateDetails.sendMethod,
        clientCode: this.estimateDetails.clientCode,
        estimateDate: this.estimateDetails.estimateDate,
        validTillDate: { "day": day, "month": month, "year": year }
      });

      setTimeout(() => {
        document.getElementById('estimateNo').innerText = this.estimateDetails.estimateNo;
      }, 10);
    }
    else {
      this.estimateForm.patchValue({
        status: 'draft',
        method: 'email',
        estimateDate: this.getDate(),
      });
    }

  }

  save() {

    this.estimateFormsubmitted = true;
    if (this.estimateForm.invalid) {
      console.log("Error");
      return;
    }
    else {
      //Save function
      console.log("Success");
      console.log(this.fieldArray[0].unitPrice);
      console.log(this.estimateForm.value);
    }

  }

    //********************************************************************
  //***********************For Client details table***********************
  //********************************************************************

  //Getting client details for table
  getClientTableData() {

    this.clientArray.length = 0;
    this.clientService.getClientDetails(this.searchClientCode, this.searchClientName, this.searchClientType)
      .subscribe(results => {
        console.log(JSON.parse(results['_body']));

        let status = results['status'];

        if (status == 200) {
          let json = results['_body'];
          //json = json.replace(new RegExp('"clientId":([0-9]+),', "g"), '"clientId":"$1",');
          this.clientArray = JSON.parse(json);
          console.log(this.clientArray);

          //Changing array as descending order
          this.clientArray = this.clientArray.reverse(function (a, b) { return b.clientId - a.clientId });

      

        }

      }, err => {
        console.log(err)
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

  //Adding new Client
  addClient() {
    this.addClientFormsubmitted = true;
    // Stop here if form is invalid
    if (this.addClientForm.invalid) {
      return;
    }
    console.log(this.addClientForm.value);
  }






  //********************************************************************
  //***********************For Item details table***********************
  //********************************************************************

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

    var checkUnitPrice = this.fieldArray[rowNumber]['unitPrice'];
    console.log(checkUnitPrice);
    if(checkUnitPrice != undefined){
      
      if (rowNumber >= 0 && rowNumber < 1000) {

        //Getting input values
        var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
        var quantity = this.fieldArray[rowNumber]['quantity'];
        var subTotal = this.fieldArray[rowNumber]['subTotal'];
  
        //Return values if quantity undifined 
        if (quantity == undefined) {
          //this.fieldArray[rowNumber]['quantity'] = 1;
          quantity = 1;
        };
  
        //Calculations
        subTotal = (unitPrice * quantity);
        this.fieldArray[rowNumber]['subTotal'] = subTotal;
      }
  
      var total = 0;
  
      for (let j = 0; j < this.fieldArray.length; j++) {
        total += (this.fieldArray[j]['unitPrice'] * this.fieldArray[j]['quantity']);
      }
      //total = total;
  
      //Set value for input fields
      this.estimateForm.patchValue({
        total: total
      });
  
      this.calculateTotalAmount();

    }
    else{
      this.fieldArray[rowNumber]['quantity'] = '';
      alert("Please select a item first.")
    }

  }

  //Reducing deleted value from item total
  deleteRowCalculation(rowNumber) {

    //Getting input values
    var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
    var quantity = this.fieldArray[rowNumber]['quantity'];
    var total = this.estimateForm.value.total;

    //Reducing deleted values
    var newTotal = total - (unitPrice * quantity);

    //Set value for input fields
    this.estimateForm.patchValue({
      total: newTotal
    });

    this.calculateTotalAmount();
  }

  //Total amount calculations
  calculateTotalAmount() {

    let total = this.estimateForm.controls['total'].value;
    let labourCost = this.estimateForm.controls['labourCost'].value;
    let transport = this.estimateForm.controls['transport'].value;
    let safty = this.estimateForm.controls['safty'].value;
    let overheads = this.estimateForm.controls['overheads'].value;
    let profit = this.estimateForm.controls['profit'].value;
    let profitAmount = this.estimateForm.controls['profitAmount'].value;
    let totalAmount = this.estimateForm.controls['profitAmount'].value;

    if (total == undefined || total == '') {
      total = 0;
    }

    if (labourCost == undefined || labourCost == '') {
      labourCost = 0;
    }

    if (transport == undefined || transport == '') {
      transport = 0;
    }

    if (safty == undefined || safty == '') {
      safty = 0;
    }

    if (overheads == undefined || overheads == '') {
      overheads = 0;
    }

    if (profit == undefined || profit == '') {
      profit = 0;
    }

    profitAmount = (total + labourCost + transport + safty + overheads) * (profit / 100);
    totalAmount = total + profitAmount + (labourCost + transport + safty + overheads);

    //Set value for input fields
    this.estimateForm.patchValue({
      profitAmount: profitAmount,
      totalAmount: totalAmount
    });

  }

  checkItemSelection(rowNumber){
    var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
    console.log(unitPrice);
  }

   //Getting item details for table
   getItemTableData() {

    this.itemArray.length = 0;
    this.itemService.getItemDetails(this.searchItemCode, this.searchItemName, this.searchItemType)
      .subscribe(results => {

        let status = results['status'];

        if (status == 200) {
          let json = results['_body'];
          json = json.replace(new RegExp('"itemId":([0-9]+),', "g"), '"itemId":"$1",');
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

  //********************************************************************

  //Changing status color
  changeStatusColor() {
    setTimeout(() => {
      let status = this.estimateForm.controls['status'].value;
      if (status == 'draft') {
        document.getElementById('status').style.color = "red";
      }
      else if (status == 'approved') {
        document.getElementById('status').style.color = "green";
      }
    }, 10);
  }

  //Getting current data & time
  public getDate() {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date
    return dateTime;
  }



  //********************************************************************
  //***********************Item Selection*******************************
  //********************************************************************


  //Open item selection modal & getting row number of the list
  openItemSelectionModal(rowNumber) {
    var unitPrice = this.fieldArray[rowNumber]['unitPrice'];
    console.log(unitPrice);
    //If line item already details already filled, give a message
    if(unitPrice == undefined || unitPrice == ''){
      //alert('This line item is already added. Please add new line to add another item.');
      this.rowNumber = rowNumber;
      ($("#itemSelectionModal") as any).modal("show");
    }
    else {
      alert('This line item is already added. Please add new line to add another item.');
    }
  }

  //Open client selection modal & getting row number of the list
  openClientSelectionModal() {
    ($("#clientSelectionModal") as any).modal("show");
  }

  //Getting item table's selected row data
  getItemRowData(data) {
    this.fieldArray[this.rowNumber]['item'] = data.itemName;
    this.fieldArray[this.rowNumber]['description'] = data.description;
    this.fieldArray[this.rowNumber]['unitPrice'] = data.sellPrice;
    ($("#itemSelectionModal") as any).modal("hide");
  }

  getClientRowData(data){
    console.log(data);
    console.log(data["firstName"]);
    this.estimateForm['clientCode']=data["firstName"];
    ($("#clientSelectionModal") as any).modal("hide");
  }

  //********************************************************************


  //********************************************************************
  //***********************Add Item Form********************************
  //********************************************************************

  //Open item selection modal & getting row number of the list
  openAddNewItemModal(rowNumber) {
    this.rowNumber = rowNumber;
    ($("#addNewItemModal") as any).modal("show");
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
      "buyPrice": parseInt(this.addItemForm.value.addBuyPrice),
      "createdDate": "",
      "description": this.addItemForm.value.addDescription,
      "itemCode": "",
      "itemId": 0,
      "itemName": this.addItemForm.value.addItemName,
      "itemType": parseInt(this.addItemForm.value.addItemType),
      "modifiedDate": "",
      "sellPrice": parseInt(this.addItemForm.value.addSellPrice),
      "status": "Act",
      "um": parseInt(this.addItemForm.value.addUom)
    }

    this.itemService.addItemDetail(record)
      .subscribe(results => {

        let status = results['status'];
        this.changedItemCode = '';
        this.changedItemCode = JSON.parse(results['_body']).itemCode;

        if (status == 201) {
          this.fieldArray[this.rowNumber]['item'] = this.addItemForm.value.addItemName;
          this.fieldArray[this.rowNumber]['description'] = this.addItemForm.value.addDescription;
          this.fieldArray[this.rowNumber]['unitPrice'] = this.addItemForm.value.addSellPrice;
          this.getItemTableData();
          ($("#addNewItemModal") as any).modal("hide");
          this.resetAddItemForm();
          (document.getElementById("rw") as HTMLInputElement).checked = true;
          this.successMessageText = "Item code: " + this.changedItemCode + " has been created successfully."
          this.showSuccessMessage();

        }

      }, err => {
        let errorCode = err['status'];

        if (errorCode == 401) {
          this.errorMessageText = "Error Code: 401, Unauthorized.";
          this.showErrorMessage();
        }
        else if (errorCode == 403) {
          this.errorMessageText = "Error Code: 403, Forbidden.";
          this.showErrorMessage();
        }
        else if (errorCode == 404) {
          this.errorMessageText = "Error Code: 404, Not Found.";
          this.showErrorMessage();
        }
        else {
          this.errorMessageText = "Error Code: " + errorCode + ", Undefined Error.";
          this.showErrorMessage();
        }
      });
  }

  //Reset form fields
  resetAddItemForm() {
    this.addItemForm.reset();
    this.addItemFormsubmitted = false;
  }

  //Success message
  showSuccessMessage() {
    $('#successAlert').fadeTo(500, 1).slideDown();
    window.setTimeout(function () {
      $("#successAlert").fadeTo(500, 0).slideUp(500, function () {
      });
    }, 10000);
  }

  //Error message
  showErrorMessage() {
    $('#errorAlert').fadeTo(500, 1).slideDown();
    window.setTimeout(function () {
      $("#errorAlert").fadeTo(500, 0).slideUp(500, function () {
      });
    }, 10000);
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

  //********************************************************************
  //********************************************************************

  //Reset search fields by button of item selection modal
  resetItemSearchFields() {
    this.searchItemCode = '';
    this.searchItemName = '';
    this.searchItemType = '';
    this.getItemTableData();
  }

  //Reset search fields by button of client selection modal
  resetClientSearchFields() {
    this.searchClientCode = '';
    this.searchClientName = '';
    this.searchClientType = '';
    this.getClientTableData();
  }

}
