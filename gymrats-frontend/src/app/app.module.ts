import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingPageComponent } from './pages/landing-page-compoenents/landing-page/landing-page.component';
import { ChooseProgramComponent } from './pages/landing-page-compoenents/choose-program/choose-program.component';
import { BecomeMemberComponent } from './pages/landing-page-compoenents/become-member/become-member.component';
import { OurClassesComponent } from './pages/landing-page-compoenents/our-classes/our-classes.component';
import { ClassesScheduleComponent } from './pages/landing-page-compoenents/classes-schedule/classes-schedule.component';
import { ExpertTrainersComponent } from './pages/landing-page-compoenents/expert-trainers/expert-trainers.component';
import { ContactUsComponent } from './pages/landing-page-compoenents/contact-us/contact-us.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserInfoComponent } from './pages/profile/user-info/user-info.component';
import { ProgramItemComponent } from './pages/profile/program-item/program-item.component';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CalendarComponent } from './pages/profile/calendar/calendar.component';
import { AdminProgramsComponent } from './pages/admin-programs/admin-programs.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimeSlotsComponent } from './pages/admin-programs/time-slots/time-slots.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { ProgramAppointmentComponent } from './pages/program-appointment/program-appointment.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditProgramComponent } from './pages/admin-programs/edit-program/edit-program.component';
import { LoaderComponent } from './components/loader/loader.component';
import { EditUserComponent } from './pages/profile/edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    LandingPageComponent,
    ChooseProgramComponent,
    BecomeMemberComponent,
    OurClassesComponent,
    ClassesScheduleComponent,
    ExpertTrainersComponent,
    ContactUsComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ProfileComponent,
    UserInfoComponent,
    ProgramItemComponent,
    SelectBoxComponent,
    ClickOutsideDirective,
    CalendarComponent,
    AdminProgramsComponent,
    AnnouncementsComponent,
    TimeSlotsComponent,
    FormatTimePipe,
    ProgramAppointmentComponent,
    EditProgramComponent,
    LoaderComponent,
    EditUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
