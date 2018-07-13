import { NgModule } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from "./core/guard/auth.guard";

const routes: Routes = [
    { path: 'auth', loadChildren: 'app/components/auth/auth.module#AuthModule' },
    { path: 'dashboard', canActivate: [AuthGuard], loadChildren: 'app/components/dashboard/dashboard.module#DashboardModule' },
    { path:'', redirectTo: 'dashboard', pathMatch: 'full' }
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
  