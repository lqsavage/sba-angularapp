import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserComponent } from './user.component';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pagination } from '../models/pagination';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('UserComponent', () => {
  let comp: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserComponent,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(UserComponent);
      comp = fixture.componentInstance; // UserComponent test instance
      comp.pagination = {
        content: [], totalPages: 0, totalElements: 0, last: false, size: 0, first: true, sort: "", numberOfElements: 0
      };
      fixture.detectChanges();
    });
    
  }));

  it(`should create the user.component`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should get dummy request for get method`, async(() => {
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
      http.get('/foo/bar').subscribe();
      backend.expectOne({
        url: '/foo/bar',
        method: 'GET'
      });
    })
  }));

});