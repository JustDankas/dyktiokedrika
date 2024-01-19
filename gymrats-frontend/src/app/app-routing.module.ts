import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page-compoenents/landing-page/landing-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
