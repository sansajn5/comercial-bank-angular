import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountService } from '../../../../core/services/bank-account.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../../../../core/services/local-storage.service";
import { ClientService } from "../../../../core/services/client.service";
import { CurrencyService } from '../../../../core/services/currency.service';
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-bank-account-add',
    templateUrl: './bank-account-add.component.html'
})
export class BankAccountAddComponent implements OnInit {

    public mode;
    public modeText: string = 'Add';
    public bank;
    public form: FormGroup;
    public number: AbstractControl;
    public currency: AbstractControl;
    public owner: AbstractControl;
    public valid: AbstractControl;
    public mailReporting: AbstractControl;
    public createdDate: AbstractControl;
    public edit = false;
    public clients = [];
    public currencies = [];

    constructor(
        private route: ActivatedRoute,
        private bankAccountService: BankAccountService,
        private fb: FormBuilder,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router,
        private clientService: ClientService,
        private currencyService: CurrencyService
    ) {}

    ngOnInit() {
        this.mode = this.route.snapshot.params.id;
        this.bank = this.localStorageService.getBank();
        this.buildClassicForm();
        this.loadClients();
        this.loadCurrencies();
        if(this.mode != 0) {
            this.modeText = 'Edit';
            this.loadValues(this.mode)
            this.edit = true;
        } else {
            this.modeText = 'Add'
        }
    }

    loadValues(id) {
        this.bankAccountService.getBankAccount(id).toPromise()
        .then(response => {
            this.number.setValue(response.data.number)
            this.currency.setValue(response.data.currency._id)
            this.owner.setValue(response.data.owner._id)
            this.mailReporting.setValue(response.data.mailReporting)
            this.valid.setValue(response.data.valid)
            this.createdDate.setValue(new DatePipe('en-US').transform(response.data.createdDate))
        })
    }

    buildClassicForm() {
        this.form = this.fb.group({
            'number': [''],
            'currency': ['', Validators.compose([Validators.required])],
            'owner': ['', Validators.compose([Validators.required])],
            'valid': [''],
            'mailReporting': [''],
            'createdDate': ['']
        });
      
        this.number = this.form.controls['number'];
        this.currency = this.form.controls['currency'];
        this.owner = this.form.controls['owner'];
        this.valid = this.form.controls['valid'];
        this.mailReporting = this.form.controls['mailReporting'];
        this.createdDate = this.form.controls['createdDate'];

        this.valid.setValue(false);
        this.mailReporting.setValue(false);
    }

    loadClients() {
        this.clientService.getAllForBank().toPromise()
        .then(response => {
            this.clients = response.data;
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    loadCurrencies() {
        this.currencyService.getAllForBank().toPromise()
        .then(response => {
            this.currencies = response.data;
        })
    }

    onSave() {
        let body: any = {
            currencyId: this.currency.value,
            ownerId: this.owner.value,
            mailReporting: this.mailReporting.value,
            valid: this.valid.value
        }
        if(this.mode == 0) {
            this.bankAccountService.createBankAccount(body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Added bank account`,'Info.')
                this.router.navigateByUrl('/dashboard/bank-account')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        } else {
            this.bankAccountService.editBankAccount(this.mode, body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Edited bank account`,'Info.')
                this.router.navigateByUrl('/dashboard/bank-account')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        }
    }
}