import { Component, OnInit } from "@angular/core";
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BankAccountService } from "../../../../../core/services/bank-account.service";
import { LocalStorageService } from "../../../../../core/services/local-storage.service";
import { ToastrService } from "ngx-toastr";
import { ClientService } from "../../../../../core/services/client.service";
import { CurrencyService } from "../../../../../core/services/currency.service";
import { ExchangeService } from '../../../../../core/services/exchange.service';

@Component({
    selector: 'app-exchange-list-rate-add',
    templateUrl: './exchange-list-rate-add.component.html'
})
export class ExchangeListRateAddComponent implements OnInit {

    public mode;
    public modeText: string = 'Add';
    public bank;
    public form: FormGroup;
    public fromCurrency: AbstractControl;
    public toCurrency: AbstractControl;
    public value: AbstractControl;
    public listId;
    public edit = false;
    public fromCurrencies = [];
    public toCurrencies = [];

    constructor(
        private route: ActivatedRoute,
        private exchangeService: ExchangeService,
        private fb: FormBuilder,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router,
        private clientService: ClientService,
        private currencyService: CurrencyService
    ) {}

    ngOnInit() {
        this.mode = this.route.snapshot.params.rateId;
        this.listId = this.route.snapshot.params.id;
        this.bank = this.localStorageService.getBank();
        this.buildClassicForm();
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
        this.exchangeService.getRate(id).toPromise()
        .then(response => {
            this.fromCurrency.setValue(response.data.fromCurrency._id)
            this.toCurrency.setValue(response.data.toCurrency._id)
            this.value.setValue(response.data.value)
        })
    }

    loadCurrencies() {
        this.currencyService.getAllForBank().toPromise()
        .then(response => {
            this.fromCurrencies = response.data;
            this.toCurrencies = response.data;
        })
    }

    buildClassicForm() {
        this.form = this.fb.group({
            'fromCurrency': ['', Validators.compose([Validators.required])],
            'toCurrency': ['', Validators.compose([Validators.required])],
            'value': ['', Validators.compose([Validators.required])],
        });
      
        this.fromCurrency = this.form.controls['fromCurrency'];
        this.toCurrency = this.form.controls['toCurrency'];
        this.value = this.form.controls['value'];
    }

    onChangeBox(event) {
        const valueToDisable = event.target.value;
        this.toCurrencies = this.toCurrencies.filter(element => element._id != valueToDisable)
    }

    onChangeBox1(event) {
        const valueToDisable = event.target.value;
        this.fromCurrencies = this.fromCurrencies.filter(element => element._id != valueToDisable)
    }

    onSave() {
        let body: any = {
            fromCurrency: this.fromCurrency.value,
            toCurrency: this.toCurrency.value,
            value: this.value.value,
        }
        if(this.mode == 0) {
            this.exchangeService.createRate(this.listId, body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Added exchange rate`,'Info.')
                this.router.navigateByUrl(`/dashboard/exchange-list-rate/${this.listId}`)
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        } else {
            const editBody = {
                value: body.value
            }
            this.exchangeService.editRate(this.mode, editBody).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Edited exchange rate`,'Info.')
                this.router.navigateByUrl(`/dashboard/exchange-list-rate/${this.listId}`)
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        }
    }


}