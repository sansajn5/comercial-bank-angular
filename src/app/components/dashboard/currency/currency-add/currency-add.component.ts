import { CurrencyService } from "../../../../core/services/currency.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "../../../../core/services/local-storage.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-currency-add',
    templateUrl: './currency-add.component.html'
})
export class CurrencyAddComponent implements OnInit {

    public mode;
    public modeText: string = 'Add';
    public bank;
    public form: FormGroup;
    public name: AbstractControl;
    public code: AbstractControl;

    constructor(
        private currencyService: CurrencyService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.mode = this.route.snapshot.params.id;
        this.bank = this.localStorageService.getBank();
        if(this.mode != 0) {
            this.modeText = 'Edit';
            this.loadValues(this.mode)
        } else {
            this.modeText = 'Add'
        }
        this.buildClassicForm();
    }

    loadValues(id) {
        this.currencyService.getCurrency(id).toPromise()
        .then(response => {
            this.name.setValue(response.data.name);
            this.code.setValue(response.data.code);
        })
    } 

    buildClassicForm() {
        this.form = this.fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'code': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
        });
      
        this.name = this.form.controls['name'];
        this.code = this.form.controls['code'];
    }

    public onSave() {
        let body:any = {
            name: this.name.value,
            code: this.code.value,
            bankId: this.bank._id
        }
        if(this.mode == 0) {
            this.currencyService.createCurrency(body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Added new currency`,'Info.')
                this.router.navigateByUrl('/dashboard/currency')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        } else {
            this.currencyService.editCurrency(this.mode, body).toPromise()
            .then(data => {
                this.toastService.clear();
                this.toastService.info(`Edited currency`,'Info.')
                this.router.navigateByUrl('/dashboard/currency')
            })
            .catch(err => {
                this.toastService.clear();
                this.toastService.error(`${err.error.error}`,'Error!')
            });
        }
    }
}