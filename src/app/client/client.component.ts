import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-customer',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],

  //Data service providers
  providers: [ClientService]
})
export class ClientComponent implements OnInit {

  searchClientCode: string = '';
  searchClientName: string = '';
  searchClientType: string = '';

  addClientForm: FormGroup;
  updateClientForm: FormGroup;

  addClientFormsubmitted = false;
  updateClientFormsubmitted = false;

  displayClientArea: boolean = false;
  addClientArea: boolean = false;
  updateClientArea: boolean = false;
  initialArea: boolean = false;

  displayAddClientBtn = true;

  clientId: string = '';
  clientCode: string = '';
  clientName: string = '';
  clientType: string = '';
  firstName: string = '';
  lastName: string = '';
  telephone: string = '';
  mobile: string = '';
  address1: string = '';
  address2: string = '';
  address3: string = '';
  postalCode: string = '';
  country: string = '';
  currency: string = '';
  invoiceMethod: string = '';
  email: string = '';
  category: string = '';
  notes: string = '';

  errorMessage: string = '';
  errorCode: string = '';

  changedClientCode: string = '';
  arrayIndex: any = 0;

  tableLineNo: any = '0';

  successMessageDiv: boolean = false;
  errorMessageDiv: boolean = false;

  successMessageText: string = '';
  errorMessageText: string = '';

  clientArray: any = [];
  countriesArray: any = [];
  currencyArray: any = [];
  clientTypesArray: any = [];
  clientCodeArray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: ClientService
  ) { }

  ngOnInit(): void {
    this.initialArea = true;
    this.getCountryData();
    this.getCurrencyData();
    this.getTableData();

    this.addClientForm = this.formBuilder.group({
      //addClientName: ['', Validators.required],
      addClientType: ['', Validators.required],
      addFirstName: ['', Validators.required],
      addLastName: ['', Validators.required],
      addTelephone: ['', Validators.required],
      addMobile: ['', Validators.required],
      addAddress1: ['', Validators.required],
      addAddress2: ['', Validators.required],
      addAddress3: ['', Validators.required],
      addPostalCode: ['', Validators.required],
      addCountry: ['', Validators.required],
      addCurrency: ['', Validators.required],
      addInvoiceMethod: ['', Validators.required],
      addEmail: ['', [Validators.required, Validators.email]],
      addCategory: ['', Validators.required],
      addNotes: ['', Validators.required]
    });

    this.updateClientForm = this.formBuilder.group({
      updateClientCode: ['', Validators.required],
      //updateClientName: ['', Validators.required],
      updateClientType: ['', Validators.required],
      updateFirstName: ['', Validators.required],
      updateLastName: ['', Validators.required],
      updateTelephone: ['', Validators.required],
      updateMobile: ['', Validators.required],
      updateAddress1: ['', Validators.required],
      updateAddress2: ['', Validators.required],
      updateAddress3: ['', Validators.required],
      updatePostalCode: ['', Validators.required],
      updateCountry: ['', Validators.required],
      updateCurrency: ['', Validators.required],
      updateInvoiceMethod: ['', Validators.required],
      updateEmail: ['', [Validators.required, Validators.email]],
      updateCategory: ['', Validators.required],
      updateNotes: ['', Validators.required]
    });

  }

  //Convenience getter for easy access to form fields
  get f1() { return this.addClientForm.controls; }
  get f2() { return this.updateClientForm.controls; }

  //Getting client details for table
  getTableData() {

    this.clientArray.length = 0;
    this.dataService.getClientDetails(this.searchClientCode, this.searchClientName, this.searchClientType)
      .subscribe(results => {

        let status = results['status'];

        if (status == 200) {
          let json = results['_body'];
          //json = json.replace(new RegExp('"clientId":([0-9]+),', "g"), '"clientId":"$1",');
          this.clientArray = JSON.parse(json);

          //Changing array as descending order
          this.clientArray = this.clientArray.reverse(function (a, b) { return b.clientId - a.clientId });

          //console.log(this.changedClientCode)
          //console.log(this.arrayIndex)
          if (this.changedClientCode == '' || this.arrayIndex == '0') {

            //Selecting first record of the array
            this.setRowData(this.clientArray[0]);

            //Highlight color of the table
            this.clickedTableRowColor();
          }
          else {
            //Selecting changed record of the array
            this.setRowData(this.clientArray[this.arrayIndex]);

            //Highlight color of the table
            this.clickedTableRowColor();

          }

        }

      }, err => {
        console.log(err)
        this.errorCode = err['status'];
        this.displayClientArea = false;
        this.initialArea = true;

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

  //Getting Countries for drop downs
  getCountryData() {
    this.countriesArray.length = 0;
    this.dataService.getCountriesDetails()
      .subscribe(results => {
        
        let status = results['status'];
        if (status == 200) {
          this.countriesArray = JSON.parse(results['_body']);
          //console.log(JSON.parse(results['_body']));
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

  //Getting Countries for drop downs
  getCurrencyData() {
    this.currencyArray.length = 0;
    this.dataService.getCurrencyDetails()
      .subscribe(results => {
        
        let status = results['status'];
        if (status == 200) {
          this.currencyArray = JSON.parse(results['_body']);
          //console.log(JSON.parse(results['_body']));
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

  //Adding new client
  addClient() {
    this.addClientFormsubmitted = true;
    // Stop here if form is invalid
    if (this.addClientForm.invalid) {
      return;
    }

    let record =
    {
      "id": 0,
      "customerCode": "",
      "customerType": this.addClientForm.value.addClientType,
      "firstName": this.addClientForm.value.addFirstName,
      "lastName": this.addClientForm.value.addLastName,
      "telephone": this.addClientForm.value.addTelephone,
      "mobile": this.addClientForm.value.addMobile,
      "address1": this.addClientForm.value.addAddress1,
      "address2": this.addClientForm.value.addAddress2,
      "address3": this.addClientForm.value.addAddress3,
      "postalCode": this.addClientForm.value.addPostalCode,
      "country": parseInt(this.addClientForm.value.addCountry),
      "currency": parseInt(this.addClientForm.value.addCurrency),
      "invoiceMethods": parseInt(this.addClientForm.value.addInvoiceMethod),
      "email": this.addClientForm.value.addEmail,
      "customerCategory": this.addClientForm.value.addCategory,
      "createdDate": null,
      "modifiedDate": null,
      "status": "Act",
      "modifiedUser": null,
      "companyId": 100

    }
   

    this.dataService.addClientDetail(record)
      .subscribe(results => {
        let status = results['status'];
        this.changedClientCode = '';
        if(results['_body'] != "") {
          this.changedClientCode = JSON.parse(results['_body']).customerCode;
        }

        if (status == 201) {
          this.arrayIndex = 0;
          this.getTableData();
          console.log(this.arrayIndex);
          this.resetAddClientForm();
          this.successMessageText = "Client code: " + this.changedClientCode + " has been created successfully."
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

  //Updating client
  updateClient() {
    this.updateClientFormsubmitted = true;
    // Stop here if form is invalid
    if (this.updateClientForm.invalid) {
      return;
    }

    let record =
    {
      "id": 0,
      "customerCode": "",
      "customerType": this.updateClientForm.value.updateClientType,
      "firstName": this.updateClientForm.value.updateFirstName,
      "lastName": this.updateClientForm.value.updateLastName,
      "telephone": this.updateClientForm.value.updateTelephone,
      "mobile": this.updateClientForm.value.updateMobile,
      "address1": this.updateClientForm.value.updateAddress1,
      "address2": this.updateClientForm.value.updateAddress2,
      "address3": this.updateClientForm.value.updateAddress3,
      "postalCode": this.updateClientForm.value.updatePostalCode,
      "country": parseInt(this.updateClientForm.value.updateCountry),
      "currency": parseInt(this.updateClientForm.value.updateCurrency),
      "invoiceMethods": parseInt(this.updateClientForm.value.updateInvoiceMethod),
      "email": this.updateClientForm.value.updateEmail,
      "customerCategory": null,
      "createdDate": null,
      "modifiedDate": null,
      "status": "Act",
      "modifiedUser": null,
      "companyId": 100
    }

    this.dataService.updateClientDetail(this.clientId, record)
      .subscribe(results => {

        let status = results['status'];
        this.changedClientCode = '';
        this.changedClientCode = JSON.parse(results['_body']).clientCode;

        if (status == 201) {
          this.arrayIndex = this.clientArray.findIndex(obj => obj.clientCode == this.changedClientCode);
          this.getTableData();
          this.updateClientArea = false;
          this.displayClientArea = true;
          this.successMessageText = "Client code: " + this.changedClientCode + " has been updated successfully."
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

  deleteClient() {

    this.dataService.deleteClientDetail(this.clientId)
      .subscribe(results => {
        let status = results['status'];
        this.changedClientCode = '';
        this.changedClientCode = JSON.parse(results['_body']).clientCode;

        if (status == 200) {
          ($("#confirmationModal") as any).modal("hide");
          this.getTableData();
          this.successMessageText = "Client code: " + this.changedClientCode + " has been deleted successfully."
          this.showSuccessMessage();
        }
      }, err => {
        let errorCode = err['status'];

        if (errorCode == 204) {
          this.errorMessageText = "Error Code: 204, No Content";
          this.showErrorMessage();
        }
        else if (errorCode == 401) {
          this.errorMessageText = "Error Code: 401, Unauthorized";
          this.showErrorMessage();
        }
        else if (errorCode == 403) {
          this.errorMessageText = "Error Code: 403, Forbidden";
          this.showErrorMessage();
        }
      });

  }

  //Reset form fields
  resetAddClientForm() {
    this.addClientForm.reset();
    this.addClientFormsubmitted = false;
  }

  //Displaying add client inputs
  displayAddClient() {
    this.displayClientArea = false;
    this.updateClientArea = false;
    this.initialArea = false;
    this.displayAddClientBtn = false;
    this.addClientArea = true;

  }

  //Closing add client inputs
  cancelAddClient() {
    this.addClientArea = false;
    this.displayClientArea = true;
    this.displayAddClientBtn = true;
    this.resetAddClientForm();
  }

  //Closing update client inputs
  cancelUpdateClient() {
    this.updateClientArea = false;
    this.displayClientArea = true;
  }

  //Getting selected table row data for display client details
  setRowData(data) {
    if(data != undefined){
      this.clientCode = data.customerCode;
      this.clientName = data.firstName;
      this.clientType = data.customerType;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.telephone = data.telephone;
      this.mobile = data.mobile;
      this.address1 = data.address1;
      this.address2 = data.address2;
      this.address3 = data.address3;
      this.postalCode = data.postalCode;
      this.country = data.country;
      this.currency = data.currency;
      this.invoiceMethod = data.invoiceMethods;
      this.email = data.email;
      this.category = data.customerCategory;
      this.notes = data.address3;
    }
   
    this.addClientArea = false;
    this.displayAddClientBtn = true;
    this.updateClientArea = false;
    this.initialArea = false;
    this.displayClientArea = true;
  }

  //Getting selected client details for update fields
  getRowData() {
    this.updateClientForm.patchValue({
      updateClientCode: this.clientCode,
      updateClientName: this.clientName,
      updateClientType: this.clientType,
      updateFirstName: this.firstName,
      updateLastName: this.lastName,
      updateTelephone: this.telephone,
      updateMobile: this.mobile,
      updateAddress1: this.address1,
      updateAddress2: this.address2,
      updateAddress3: this.address3,
      updatePostalCode: this.postalCode,
      updateCountry: this.country,
      updateCurrency: this.currency,
      updateInvoiceMethod: this.invoiceMethod,
      updateEmail: this.email,
      updateCategory: this.category,
      updateNotes: this.notes
    });

    console.log(this.updateClientForm);

    this.addClientArea = false;
    this.displayClientArea = false;
    this.initialArea = false;
    this.updateClientArea = true;
  }

  //Focusing to the first row of the table
  clickedTableRowColor() {
    if(this.clientArray.length != 0){
      setTimeout(() => {
        document.getElementById('line' + this.arrayIndex).style.color = "black";
        document.getElementById('line' + this.arrayIndex).style.backgroundColor = "rgb(46,139,87, 0.3)";
  
        this.arrayIndex = 0;
  
        $('.line').click(function () {
          $('.line').css("color", "");
          $('.line').css("background-color", "");
          $(this).css("color", "black");
          $(this).css("background-color", "rgb(46,139,87, 0.3)");
        });
      }, 500);
    }
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


  //Reset search fields by button
  resetSearchFields() {
    this.searchClientCode = '';
    this.searchClientName = '';
    this.searchClientType = '';
  }

}
