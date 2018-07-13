import { Component } from "@angular/core";
import { TransactionService } from "../../../../core/services/transaction.service";
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';

@Component({
    selector: 'app-transaction-scan',
    templateUrl: './transaction-scan.component.html'
})
export class TransactionScanComponent {

    public xmlModel = {
        accountCreditorXML: '',
        code: '',
        creditor: '',
        currencyDate: '',
        dateOfReceipt: '',
        debtor: '',
        debtorAccountXML: '',
        emergency: '',
        modelApproval: '',
        modelAssigments: '',
        paymentCurrencyXML: '',
        paymentTypeXML: '',
        purposeOfPayment: '',
        referenceNumberAssigments: '',
        referenceNumberCreditor: '',
        status: '',
        sum: '',
        type: '',
        typeOfMistake: ''
    }

    constructor(
        private transactionService: TransactionService,
        private toastService: ToastrService,
        private router: Router
    ) {}

    selectFile(event) {
        const name = event.target.files[0].name
        this.transactionService.scanDocument({name: name}).toPromise()
        .then(response => {
            this.toastService.clear();
            this.toastService.info(`Successfully scaned document`,'Info.')
            this.xmlModel = response.data;
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    onSave() {
        this.transactionService.makeDocument(this.xmlModel).toPromise()
        .then(data => this.router.navigateByUrl('/dashboard/transaction'))
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

}