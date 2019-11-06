import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRatingModule } from 'ngx-bar-rating'
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routing } from './app-routing.module';
import { JwtRequestInterceptor } from './utils/jwt.request.interceptor';
import { JwtResponseInterceptor } from './utils/jwt.response.interceptor';
import { FullCalendarModule } from 'ng-fullcalendar';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from './services/user.service';
import { SkillService } from './services/skill.service';
import { TrainingService } from './services/training.service';
import { MentorSkillService } from './services/mentor_skill.service';
import { MentorCalendarService } from './services/mentor_calendar.service';
import { PaymentService } from './services/payment.service';
import { PaginationComponent } from './utils/pagination.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './home/home_page.component';
import { UserComponent } from './user/user.component';
import { MentorSearchComponent } from './mentor/mentor_search.component';
import { TechnologyComponent } from './technology/technology.component';
import { SignupComponent } from './user/signup.component';
import { TrainingComponent } from './training/training.component';
import { MentorSkillComponent } from './mentor/mentor_skill.component';
import { MentorCalendarComponent } from './mentor/mentor_calendar.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentCommissionComponent } from './payment/payment_commission.component';
import { AuthGuard } from './utils/auth.guard';
import { DatePipe } from '@angular/common';
import { WindowRef } from './utils/WindowRef';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    routing,
    FullCalendarModule,
    BarRatingModule,
    NgxCaptchaModule,
    MatIconModule,
    TranslateModule.forRoot()
  ],
  declarations: [
    PaginationComponent,
    AppComponent,
    HomeComponent,
    HomePageComponent,
    SignupComponent,
    UserComponent,
    MentorSearchComponent,
    TechnologyComponent,
    TrainingComponent,
    MentorSkillComponent,
    MentorCalendarComponent,
    PaymentComponent,
    PaymentCommissionComponent,
  ],
  providers: [
    MentorSearchComponent,
    DatePipe,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtResponseInterceptor, multi: true },
    UserService,
    MentorSkillService, MentorCalendarService,
    SkillService,
    TrainingService,
    PaymentService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
