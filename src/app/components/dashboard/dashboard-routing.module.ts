import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientAddComponent } from './clients/client-add/client-add.component';
import { CurrencyComponent } from './currency/currency.component';
import { CurrencyAddComponent } from './currency/currency-add/currency-add.component';
import { BankAccountComponent } from './bank-accounts/bank-accounts.components';
import { BankAccountAddComponent } from './bank-accounts/bank-account-add/bank-account-add.component';
import { ExchangeListComponent } from './exchange-list/exchange-list.component';
import { ExchangeListAddComponent } from './exchange-list/exchange-list-add/exchange-list-add.component';
import { ExchangeListRateComponent } from './exchange-list/exchnage-list-rate/exchange-list-rate.component';
import { ExchangeListRateAddComponent } from './exchange-list/exchnage-list-rate/exchange-list-rate-add/exchange-list-rate-add.component';

const routes: Routes = [{ 
    path: '', 
    component: DashboardComponent,
    children: [{
      path: '',
      component: HomeComponent,
    },{
      path: 'clients',
      component: ClientsComponent
    },{
      path: 'clients/:id',
      component: ClientAddComponent
    },{
      path: 'currency',
      component: CurrencyComponent
    },{
      path: 'currency/:id',
      component: CurrencyAddComponent
    },{
      path: 'bank-account',
      component: BankAccountComponent
    },{
      path: 'bank-account/:id',
      component: BankAccountAddComponent
    },{
      path: 'exchange-list',
      component: ExchangeListComponent
    },{
      path: 'exchange-list-add',
      component: ExchangeListAddComponent
    },{
      path: 'exchange-list-rate/:id',
      component: ExchangeListRateComponent
    }, {
      path: 'exchange-list-rate/:id/:rateId',
      component: ExchangeListRateAddComponent
    }],
  }];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
  
export class DashboardRoutingModule {
}
  