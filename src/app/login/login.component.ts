import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  //Data service providers
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  submitted: boolean = false;
  loginForm: FormGroup;
  formsubmitted = false;
  errorMessageText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['admin@company.com', [Validators.required, Validators.email]],
      password: ['admin123', Validators.required]
    });
  }

  //Convenience getter for easy access to form fields
  get f1() { return this.loginForm.controls; }

  onSubmit() {
    this.formsubmitted = true;
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    let record =
    {
      "password": this.loginForm.value.password,
      "userName": this.loginForm.value.username,
    }

    this.loginService.userController(record)
      .subscribe(results => {
        let status = results['status'];
        if (status == 200) {
          var accessToken = JSON.parse(results['_body'])['jwt'];
          localStorage.setItem("accessToken", accessToken);
          this.router.navigate(['home/landing-page']);
        }
      }, err => {
        let errorCode = err['status'];
        if (errorCode == 401) {
          this.errorMessageText = "Invalid UserName or Password";
          this.showErrorMessage();
        }
        if (errorCode == 201) {
          this.errorMessageText = "Created";
          this.showErrorMessage();
        }
        if (errorCode == 403) {
          this.errorMessageText = "Forbidden";
          this.showErrorMessage();
        }
        if (errorCode == 404) {
          this.errorMessageText = "404";
          this.showErrorMessage();
        }
      });



  }

  //Error message
  showErrorMessage() {
    $('#errorAlert').fadeTo(500, 1).slideDown();
    window.setTimeout(function () {
      $("#errorAlert").fadeTo(500, 0).slideUp(500, function () {
      });
    }, 6000);
  }

}
