import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [{ 
    path: '', 
    component: AuthComponent,
    children: [{
      path: '',
      component: SignInComponent,
    }, {
      path: 'sign-in',
      component: SignInComponent,
    }],
  }];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
  
export class AuthRoutingModule {
}
  