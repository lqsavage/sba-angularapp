import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReCaptcha2Component, NgxCaptchaModule } from 'ngx-captcha';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";

describe('HomeComponent', () => {

   let comp: HomeComponent;
   let fixture: ComponentFixture<HomeComponent>;
   let de: DebugElement;
   let el: HTMLElement;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            HomeComponent,
            ReCaptcha2Component
         ],
         imports: [
            ReactiveFormsModule
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents().then(() => {
         fixture = TestBed.createComponent(HomeComponent);
         comp = fixture.componentInstance;
         comp.language = localStorage.getItem('locale');
         fixture.detectChanges();
      });

   }));

   /* it(`should have value of h4 tag 'Sign In'`, async(() => {
       setTimeout(function () {
          fixture.detectChanges();
       }, 2000);
       const compiled = fixture.debugElement.nativeElement;
       expect(compiled.querySelector('h4').textContent).toContain('Sign In');
    }));*/
   /*it('should create home.component', () => {
      //comp.captchaElem.setValue(CAPTCHA_SITE_KEY); //manually set a string data as input data.
      expect(comp).toBeTruthy();
   });*/

});
