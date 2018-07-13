import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard.component';
import { CoreModule } from "../../core/core.module";
import { NgModule } from "@angular/core";
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

const DASHBOARAD_COMPONENTS = [
    DashboardComponent,
    HomeComponent,
    ClientsComponent,
    ClientAddComponent,
    CurrencyComponent,
    CurrencyAddComponent,
    BankAccountComponent,
    BankAccountAddComponent,
    ExchangeListComponent,
    ExchangeListAddComponent,
    ExchangeListRateComponent,
    ExchangeListRateAddComponent
]

@NgModule({
    imports: [
        DashboardRoutingModule,
        CoreModule,
    ],
    declarations: [
      ...DASHBOARAD_COMPONENTS,
    ],
    providers: [],
})
export class DashboardModule {
}