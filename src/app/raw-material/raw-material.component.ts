import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, NgForm } from "@angular/forms";
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss'],

  //Data service providers
  providers: [ItemService]
})
export class RawMaterialComponent implements OnInit {

  searchItemCode: string = '';
  searchItemName: string = '';

  addItemForm: FormGroup;
  updateItemForm: FormGroup;

  addItemFormsubmitted = false;
  updateItemFormsubmitted = false;

  displayItemArea: boolean = false;
  addItemArea: boolean = false;
  updateItemArea: boolean = false;
  initialArea: boolean = false;

  displayAddItemBtn = true;

  itemId: string = '';
  itemCode: string = '';
  itemName: string = '';
  itemType: string = '';
  description: string = '';
  buyPrice: string = '';
  sellPrice: string = '';
  uom: string = '';
  barCode: string = '';

  errorMessage: string = '';
  errorCode: string = '';

  changedItemCode: string = '';
  arrayIndex: any = 0;

  tableLineNo: any = '0';

  successMessageDiv: boolean = false;
  errorMessageDiv: boolean = false;

  successMessageText: string = '';
  errorMessageText: string = '';

  itemArray: any = [];
  itemTypesArray: any = [];
  itemCodeArray: any = [];
  uomarray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: ItemService
  ) { }

  ngOnInit(): void {
    this.initialArea = true;
    this.getTableData();

    this.addItemForm = this.formBuilder.group({

      addItemName: ['', Validators.required],
      addDescription: ['', Validators.required],
      addBuyPrice: ['', Validators.required],
      addSellPrice: ['', Validators.required],
      addUom: ['', Validators.required],
      addBarCode: [''],
    });

    this.updateItemForm = this.formBuilder.group({
      updateItemCode: ['', Validators.required],
      updateItemName: ['', Validators.required],
      updateDescription: ['', Validators.required],
      updateBuyPrice: ['', Validators.required],
      updateSellPrice: ['', Validators.required],
      updateUom: ['', Validators.required],
      updateBarCode: [''],
    });

    //this.getItemTypesData();
    this.getUomData();
  }

  //Convenience getter for easy access to form fields
  get f1() { return this.addItemForm.controls; }
  get f2() { return this.updateItemForm.controls; }

  //Getting item details for table
  getTableData() {

    this.itemArray.length = 0;
    this.dataService.getItemDetails(this.searchItemCode, this.searchItemName, "1")
      .subscribe(results => {

        let status = results['status'];

        if (status == 200) {
          let json = results['_body'];
          json = json.replace(new RegExp('"itemId":([0-9]+),', "g"), '"itemId":"$1",');
          this.itemArray = JSON.parse(json);

          //Changing array as descending order
          this.itemArray = this.itemArray.reverse(function (a, b) { return b.itemCode - a.itemCode });

          if (this.changedItemCode == '' || this.arrayIndex == '0') {

            //Selecting first record of the array
            this.setRowData(this.itemArray[0]);

            //Highlight color of the table
            this.clickedTableRowColor();
          }
          else {
            //Selecting changed record of the array
            this.setRowData(this.itemArray[this.arrayIndex]);

            //Highlight color of the table
            this.clickedTableRowColor();

          }

        }

      }, err => {
        this.errorCode = err['status'];
        this.displayItemArea = false;
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

  //Getting UoM for drop downs
  getUomData() {
    this.uomarray.length = 0;
    this.dataService.getUomDetails()
      .subscribe(results => {

        console.log(results);
        
        let status = results['status'];
        if (status == 200) {
          this.uomarray = JSON.parse(results['_body']);
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
      "itemType": 1,
      "modifiedDate": "",
      "sellPrice": parseInt(this.addItemForm.value.addSellPrice),
      "status": "Act",
      "um": parseInt(this.addItemForm.value.addUom)
    }

    console.log(record);

    this.dataService.addItemDetail(record)
      .subscribe(results => {

        console.log(results);

        let status = results['status'];
        this.changedItemCode = '';
        this.changedItemCode = JSON.parse(results['_body']).itemCode;

        if (status == 201) {
          this.arrayIndex = 0;
          this.getTableData();
          //console.log(this.arrayIndex);
          this.resetAddItemForm();
          this.successMessageText = "Raw material code: " + this.changedItemCode + " has been created successfully."
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

  //Updating item
  updateItem() {
    this.updateItemFormsubmitted = true;
    // Stop here if form is invalid
    if (this.updateItemForm.invalid) {
      return;
    }

    let record =
    {
      "barcode": this.updateItemForm.value.updateBarCode,
      "buyPrice": this.updateItemForm.value.updateBuyPrice,
      "createdDate": "",
      "description": this.updateItemForm.value.updateDescription,
      "itemCode": this.updateItemForm.value.updateItemCode,
      "itemId": this.itemId,
      "itemName": this.updateItemForm.value.updateItemName,
      "itemType": "1",
      "modifiedDate": "",
      "sellPrice": this.updateItemForm.value.updateSellPrice,
      "status": "active",
      "um": this.updateItemForm.value.updateUom
    }

    this.dataService.updateItemDetail(this.itemId, record)
      .subscribe(results => {

        let status = results['status'];
        this.changedItemCode = '';
        this.changedItemCode = JSON.parse(results['_body']).itemCode;

        if (status == 201) {
          this.arrayIndex = this.itemArray.findIndex(obj => obj.itemCode == this.changedItemCode);
          this.getTableData();
          this.updateItemArea = false;
          this.displayItemArea = true;
          this.successMessageText = "Raw material code: " + this.changedItemCode + " has been updated successfully."
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

  deleteItem() {

    this.dataService.deleteItemDetail(this.itemId)
      .subscribe(results => {
        let status = results['status'];
        this.changedItemCode = '';
        this.changedItemCode = JSON.parse(results['_body']).itemCode;

        if (status == 200) {
          ($("#confirmationModal") as any).modal("hide");
          this.getTableData();
          this.successMessageText = "Raw material code: " + this.changedItemCode + " has been deleted successfully."
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

  //Displaying add item inputs
  displayAddItem() {
    this.displayItemArea = false;
    this.updateItemArea = false;
    this.initialArea = false;
    this.displayAddItemBtn = false;
    this.addItemArea = true;

  }

  //Closing add item inputs
  cancelAddItem() {
    this.addItemArea = false;
    this.displayItemArea = true;
    this.displayAddItemBtn = true;
    this.resetAddItemForm();
  }

  //Closing update item inputs
  cancelUpdateItem() {
    this.updateItemArea = false;
    this.displayItemArea = true;
  }

  //Getting selected table row data for display item details
  setRowData(data) {
    this.itemId = data.itemId;
    this.itemCode = data.itemCode;
    this.itemName = data.itemName;
    this.itemType = data.itemType;
    this.description = data.description;
    this.buyPrice = data.buyPrice;
    this.sellPrice = data.sellPrice;
    this.uom = data.um;
    this.barCode = data.barcode;

    this.addItemArea = false;
    this.displayAddItemBtn = true;
    this.updateItemArea = false;
    this.initialArea = false;
    this.displayItemArea = true;
  }

  //Getting selected item details for update fields
  getRowData() {
    this.updateItemForm.patchValue({
      updateItemCode: this.itemCode,
      updateItemName: this.itemName,
      updateItemType: this.itemType,
      updateDescription: this.description,
      updateBuyPrice: this.buyPrice,
      updateSellPrice: this.sellPrice,
      updateUom: this.uom,
      updateBarCode: this.barCode,
    });

    this.addItemArea = false;
    this.displayItemArea = false;
    this.initialArea = false;
    this.updateItemArea = true;
  }

  //Focusing to the first row of the table
  clickedTableRowColor() {
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
    this.searchItemCode = '';
    this.searchItemName = '';
  }

}
