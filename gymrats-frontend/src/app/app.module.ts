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

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    LandingPageComponent,
    ChooseProgramComponent,
    BecomeMemberComponent,
    OurClassesComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
