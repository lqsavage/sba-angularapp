import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MentorCalendarComponent } from './mentor_calendar.component';
import { DatePipe } from '@angular/common';
import { FullCalendarModule } from 'ng-fullcalendar';
import { AuthToken } from '../models/authToken';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MentorCalendarComponent', () => {
    let comp: MentorCalendarComponent;
    let fixture: ComponentFixture<MentorCalendarComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MentorCalendarComponent,
            ],
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                FullCalendarModule,
                HttpClientModule,
                HttpClientTestingModule,
            ],
            providers: [
                DatePipe
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MentorCalendarComponent);
            comp = fixture.componentInstance; // MentorCalendarComponent test instance
            const logedUser: AuthToken = { id: 1, userName: "admin", role: "ADMIN", token: "testToken" };
            localStorage.setItem('logedUser', JSON.stringify(logedUser));
            comp.logedUser.id = 1;
            fixture.detectChanges();
        });

    }));

    it('should create the mentor_calendar.component', () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

});