import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public user

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService
    ) {}

    ngOnInit() {
        this.user = this.localStorageService.getCurentUser();
    }

    onHome() {
        this.router.navigateByUrl('/dashboard');
    }

    onClients() {
        this.router.navigateByUrl('/dashboard/clients')
    }

    onCurrencys() {
        this.router.navigateByUrl('/dashboard/currency')
    }

    onBankAccounts() {
        this.router.navigateByUrl('/dashboard/bank-account')
    }

    onExchangeList() {
        this.router.navigateByUrl('/dashboard/exchange-list')
    }

    onLogin() {
        this.router.navigateByUrl('/auth/sign-in');
    }

    onLogout() {
        this.router.navigateByUrl('/auth/sign-in');
        localStorage.clear();
    }
}