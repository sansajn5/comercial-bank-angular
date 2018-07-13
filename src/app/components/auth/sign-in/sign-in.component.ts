import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from '../../../core/models/login.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormGroup, AbstractControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-sign-in',
    styleUrls: ['./sign-in.component.css'],
    templateUrl: './sign-in.component.html'
})
export class SignInComponent {
    
    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private toastService: ToastrService,
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        });
      
        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }

    signIn() {
        this.authService.loginUser(new LoginModel(this.email.value, this.password.value)).toPromise()
        .then(response => {
            this.localStorageService.saveUser(response.data.token, response.data.employee);
            this.toastService.clear();
            this.getBankData(response.data.employee.bank);
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }

    getBankData(bankId) {
        const username = this.localStorageService.getCurentUser().username;
        this.authService.getBankData(bankId).toPromise()
        .then(response => {
            this.localStorageService.saveBank(response.data)
            this.toastService.success(`You have been succesfully logged in as ${username}`,'Welcome!')
            this.router.navigateByUrl('/dashboard')
        })
        .catch(err => {
            this.toastService.clear();
            this.toastService.error(`${err.error.error}`,'Error!')
        });
    }
}