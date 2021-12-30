import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { EstimateListComponent } from './estimate-list/estimate-list.component';
import { EstimateViewComponent } from './estimate-view/estimate-view.component';
import { FinishedGoodsComponent } from './finished-goods/finished-goods.component';
import { HomeComponent } from './home/home.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { LoginComponent } from './login/login.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
import { ServiceComponent } from './service/service.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: 'landing-page', component: LandingPageComponent },
      { path: 'raw-material', component: RawMaterialComponent },
      { path: 'service', component: ServiceComponent },
      { path: 'finished-good', component: FinishedGoodsComponent },
      { path: 'client', component: ClientComponent },
      { path: 'estimateList', component: EstimateListComponent },
      { path: 'estimateView', component: EstimateViewComponent },
      { path: 'quotationList', component: QuotationListComponent },
      { path: 'quotationView', component: QuotationViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
