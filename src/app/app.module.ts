import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { ServiceComponent } from './service/service.component';
import { ClientComponent } from './client/client.component';
import { EstimateListComponent } from './estimate-list/estimate-list.component';
import { HttpModule, Http, JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatterService } from './services/custom-date-parser-formatter.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
import { EstimateViewComponent } from './estimate-view/estimate-view.component';
import { FinishedGoodsComponent } from './finished-goods/finished-goods.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // enables the application to communicate with the backend services

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RawMaterialComponent,
    ServiceComponent,
    ClientComponent,
    EstimateListComponent,
    QuotationListComponent,
    QuotationViewComponent,
    EstimateViewComponent,
    FinishedGoodsComponent,
    LandingPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    NgbModule
  ],
  providers: [
    //{provide: NgbDateAdapter, useClass: CustomAdapter},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatterService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
