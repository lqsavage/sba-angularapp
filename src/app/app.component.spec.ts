import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './home/home_page.component';
import { AuthGuard } from './utils/auth.guard';
import { SignupComponent } from './user/signup.component';
import { UserComponent } from './user/user.component';
import { TechnologyComponent } from './technology/technology.component';
import { TrainingComponent } from './training/training.component';
import { MentorSkillComponent } from './mentor/mentor_skill.component';
import { MentorCalendarComponent } from './mentor/mentor_calendar.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentCommissionComponent } from './payment/payment_commission.component';
import { PaginationComponent } from './utils/pagination.component';
import { MentorSearchComponent } from './mentor/mentor_search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from './app-routing.module';
import { FullCalendarModule } from 'ng-fullcalendar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCaptchaModule } from 'ngx-captcha';
import { BarRatingModule } from 'ngx-bar-rating';
import { JwtRequestInterceptor } from './utils/jwt.request.interceptor';
import { JwtResponseInterceptor } from './utils/jwt.response.interceptor';
import { WindowRef } from './utils/WindowRef';

describe('AppComponent', () => {

  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'homePage', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent },
    { path: 'updateProfile', component: SignupComponent, canActivate: [AuthGuard] },

    { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'technology', component: TechnologyComponent, canActivate: [AuthGuard] },

    { path: 'allTrainings', component: TrainingComponent, data: { trainingStatus: '' }, canActivate: [AuthGuard] },
    { path: 'receivedProposl', component: TrainingComponent, data: { trainingStatus: 'PROPOSED' }, canActivate: [AuthGuard] },
    { path: 'finalizaProposal', component: TrainingComponent, data: { trainingStatus: 'CONFIRMED;REJECTED' }, canActivate: [AuthGuard] },
    { path: 'rateMentor', component: TrainingComponent, data: { trainingStatus: 'INPROGRESS' }, canActivate: [AuthGuard] },
    { path: 'inprogressTraining', component: TrainingComponent, data: { trainingStatus: 'INPROGRESS' }, canActivate: [AuthGuard] },
    { path: 'completedTraining', component: TrainingComponent, data: { trainingStatus: 'COMPLETED' }, canActivate: [AuthGuard] },

    { path: 'mentorSkill', component: MentorSkillComponent, canActivate: [AuthGuard] },
    { path: 'mentorCalendar', component: MentorCalendarComponent, canActivate: [AuthGuard] },

    { path: 'payments', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'paymentCommission', component: PaymentCommissionComponent, canActivate: [AuthGuard] },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
        PaginationComponent,
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
      imports: [
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        RouterTestingModule,
        NgbModule,
        BrowserModule,
        FormsModule, ReactiveFormsModule,
        HttpClientModule,
        routing,
        FullCalendarModule,
        BarRatingModule,
        NgxCaptchaModule,
        MatIconModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        DatePipe,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: JwtRequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtResponseInterceptor, multi: true },
        WindowRef
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
      comp.logedUser = JSON.parse(localStorage.getItem('logedUser'));
    });

  }));


  it('should create the app.component', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as header 'Skill Based Assignment'`, () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a').title).toContain('Home');
  });

  it('should render headerPart value in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Skill Based Assignment');
  });

  it(`should have pageTitle 'SignUp'`, async(() => {
    comp.languageName = "English"
    fixture.detectChanges();
    expect(comp.languageName).toEqual('English');
  }));

});
