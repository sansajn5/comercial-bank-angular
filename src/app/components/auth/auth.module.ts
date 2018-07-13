import { AppModule } from './../../app.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from "./auth.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { NgModule } from "@angular/core";
import { CoreModule } from '../../core/core.module';

const AUTH_COMPONENTS = [
    AuthComponent,
    SignInComponent,
];
  
@NgModule({
    imports: [
        AuthRoutingModule,
        CoreModule
    ],
    declarations: [
      ...AUTH_COMPONENTS,
    ],
    providers: [],
})
export class AuthModule {
}
  