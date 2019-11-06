import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './home/home_page.component';
import { SignupComponent } from './user/signup.component';
import { TechnologyComponent } from './technology/technology.component';
import { TrainingComponent } from './training/training.component';
import { AuthGuard } from './utils/auth.guard';
import { UserComponent } from './user/user.component';
import { MentorSkillComponent } from './mentor/mentor_skill.component';
import { MentorCalendarComponent } from './mentor/mentor_calendar.component';
import { PaymentCommissionComponent } from './payment/payment_commission.component';
import { PaymentComponent } from './payment/payment.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'homePage', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent },
    { path: 'updateProfile', component: SignupComponent, canActivate: [AuthGuard] },
    
    { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'technology', component: TechnologyComponent, canActivate: [AuthGuard] },

    { path: 'allTrainings', component: TrainingComponent, data: {trainingStatus: ''}, canActivate: [AuthGuard] },
    { path: 'receivedProposl', component: TrainingComponent, data: {trainingStatus: 'PROPOSED'}, canActivate: [AuthGuard] },
    { path: 'finalizeProposal', component: TrainingComponent, data: {trainingStatus: 'CONFIRMED;REJECTED'}, canActivate: [AuthGuard] },
    { path: 'rateMentor', component: TrainingComponent, data: {trainingStatus: 'INPROGRESS'}, canActivate: [AuthGuard] },
    { path: 'updateTrainingStatus', component: TrainingComponent, data: {trainingStatus: 'INPROGRESS'}, canActivate: [AuthGuard] },
    { path: 'inprogressTraining', component: TrainingComponent, data: {trainingStatus: 'INPROGRESS'}, canActivate: [AuthGuard] },
    { path: 'completedTraining', component: TrainingComponent, data: {trainingStatus: 'COMPLETED'}, canActivate: [AuthGuard] },

    { path: 'mentorSkill', component: MentorSkillComponent, canActivate: [AuthGuard] },
    { path: 'mentorCalendar', component: MentorCalendarComponent, canActivate: [AuthGuard] },

    { path: 'payments', component: PaymentComponent, canActivate: [AuthGuard] },
    { path: 'paymentCommission', component: PaymentCommissionComponent, canActivate: [AuthGuard] },    
];

export const routing = RouterModule.forRoot(appRoutes);
