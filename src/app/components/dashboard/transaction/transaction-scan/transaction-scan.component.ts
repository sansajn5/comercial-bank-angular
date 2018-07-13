import { Component } from "@angular/core";
import { TransactionService } from "../../../../core/services/transaction.service";
import { ToastrService } from "ngx-toastr";

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
    ) {}

    selectFile(event) {
        const name = event.target.files[0].name
        console.log(name)
        this.transactionService.scanDocument({name: name}).toPromise()
        .then(response => {
            // console.log(response.data)
            this.xmlModel = response.data;
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    onSave() {
        this.transactionService.makeDocument(this.xmlModel).toPromise()
        .then(data => console.log(data))
    }

}