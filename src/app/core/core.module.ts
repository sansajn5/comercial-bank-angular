import { ApiService } from './services/api.service';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './../core/services/auth.service';
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService } from './services/local-storage.service';
import { HttpTokenInterceptor } from './interceptors/http.interceptor';
import { ClientService } from './services/client.service';
import { CurrencyService } from './services/currency.service';
import { BankAccountService } from './services/bank-account.service';
import { ExchangeService } from './services/exchange.service';
import { TransactionService } from './services/transaction.service';

const COMPONENTS = [
    HeaderComponent,
]

const SERVICES = [
    ApiService,
    AuthService,
    LocalStorageService,
    ClientService,
    CurrencyService,
    BankAccountService,
    ExchangeService,
    TransactionService
]

const BASIC_MODULES = [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule
]

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [ 
    ...BASIC_MODULES,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
        ...SERVICES,
    ],
    exports: [
        ...BASIC_MODULES,
        ...COMPONENTS
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders> {
          ngModule: CoreModule,
          providers: [ ...SERVICES ]
        };
      }
}