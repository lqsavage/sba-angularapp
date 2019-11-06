import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthToken } from '../models/authToken';
import { MentorSearchComponent } from './mentor_search.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MentorSearchComponent', () => {

    let comp: MentorSearchComponent;
    let fixture: ComponentFixture<MentorSearchComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MentorSearchComponent
            ],
            imports: [
                RouterModule.forRoot([]),
                HttpClientTestingModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MentorSearchComponent);
            comp = fixture.componentInstance;
            const logedUser: AuthToken = {
                id: 1,
                userName: "",
                role: "ADMIN",
                token: ""
            };
            comp.logedUser = logedUser;
            fixture.detectChanges();
        });

    }));

    it('should create the mentor_search.component', () => {
        expect(comp).toBeTruthy();
    });

    /*it(`should have value of h4 tag 'Search For Mentor'`, async(() => {
        let logedUser = new AuthToken();
        comp.logedUser = logedUser;
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h4').textContent).toContain('Search For Mentor');
    }));*/

});


