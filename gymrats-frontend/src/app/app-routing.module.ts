import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page-compoenents/landing-page/landing-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth/auth.guard';
import { AdminProgramsComponent } from './pages/admin-programs/admin-programs.component';
import { adminGuard } from './auth/admin.guard';
import { ProgramAppointmentComponent } from './pages/program-appointment/program-appointment.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'admin-programs',
    component: AdminProgramsComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'program-reserve',
    component: ProgramAppointmentComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
