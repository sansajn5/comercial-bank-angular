import { Component, OnInit } from "@angular/core";
import { TransactionService } from '../../../../core/services/transaction.service';
import { BankAccountService } from "../../../../core/services/bank-account.service";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-transaction-filter',
    templateUrl: './transaction-filter.component.html'
})
export class TransactionFilterComponent implements OnInit {

    public filter = {
        from: '',
        to: ''
    }

    public forAccount
    public accounts = [];
    public owners = [];
    public safe = [];
    public list = [];
    public value = ""
    public show = false;

    constructor(
        private transactionService: TransactionService,
        private bankAccountService: BankAccountService,
        private toastService: ToastrService
    ) {}

    onFilter() {
        this.transactionService.findBetween(this.filter, this.forAccount).toPromise()
        .then(response => {
            this.list = response.data;
            this.show = true;
            const len = this.list.length
            this.value = this.list[len-1].value
        })
    }

    ngOnInit() {
        this.getAccounts();
    }

    onChangeBox(event) {
        this.accounts = this.safe;
        this.accounts = this.accounts.filter(element => element.owner.name == event.target.value)
    }

    getAccounts() {
        this.bankAccountService.getAllForBank().toPromise()
        .then(response => {
            this.accounts = response.data;
            this.safe = response.data;
            this.owners = this.collectOwners(response.data);
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    collectOwners(data) {
        let owners = []
        data.forEach(element => {
            if(!owners.some(el => el == element.owner.name))
                owners.push(element.owner.name)
        })
        return owners;
    }
}