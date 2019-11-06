import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { AuthToken } from '../models/authToken';
import { UserService } from '../services/user.service';
import { NavbarService } from '../utils/navbar.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CAPTCHA_SITE_KEY } from '../models/constants';

declare var $: any;

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

   isLoggedIn: boolean = false;
   logedUser: AuthToken;
   language = localStorage.getItem('locale');

   //recaptch related variables
   public readonly siteKey = `${CAPTCHA_SITE_KEY}`;
   reCaptcha = "";
   public theme: 'light' | 'dark' = 'light';
   public size: 'compact' | 'normal' = 'normal';
   public lang = this.language;
   public type: 'image' | 'audio';
   public captchaSuccess = false;
   public captchaIsExpired = false;
   @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

   constructor(
      private router: Router,
      private navbarService: NavbarService,
      private userService: UserService,
      private appComponent: AppComponent,
   ) { }

   handleReset(): void { }

   handleSuccess(captchaResponse: string): void {
      this.captchaSuccess = true;
      this.captchaIsExpired = false;
   }

   handleLoad(): void { }

   handleExpire(): void { }

   ngAfterViewInit() {

      $(function () {
         fillFromCookie();

         $.descByFieldName = function (name) {
            var text;
            switch (name) {
               case "loginUserName":
                  text = "User Name"
                  break;
               case "password":
                  text = "loginPassword";
                  break;
               default:
                  text = "";
            }
            return text;
         };

         function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
         }

         function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
               var c = ca[i];
               while (c.charAt(0) == ' ') {
                  c = c.substring(1);
               }
               if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
               }
            }
            return "";
         }

         function fillFromCookie() {
            var chkbx = getCookie("chkbx");
            if (chkbx != "") {
               $("#form2 #rememberme").attr('checked', true);
               $("#form2 #loginUserName").val(getCookie("userName"));
               $("#form2 #loginPassword").val(getCookie("password"));
            } else {
               $("#form2 #rememberme").removeAttr('checked');
               $("#form2 #loginUserName").val("");
               $("#form2 #loginPassword").val("");
            }
         }

         $.rememberMe = function () {
            if ($("#form2 #rememberme").is(':checked')) {
               setCookie("userName", $("#form2 #loginUserName").val(), 365);
               setCookie("password", $("#form2 #loginPassword").val(), 365);
               setCookie("chkbx", $("#form2 #rememberme").val(), 365);
            } else {
               setCookie("userName", "", 365);
               setCookie("password", "", 365);
               setCookie("chkbx", "", 365);
            }
         }

      });
   }

   ngOnInit() {      
      this.logedUser = JSON.parse(localStorage.getItem('logedUser'));   
   }

   signin() {
      $.rememberMe();
      var status = true;
      $("#form2 .requiredfield").css("border", "1px solid #cacaca");
      $("#form2 .requiredfield").each(function () {
         var v = $(this).val();
         if (v == '' && !(typeof this.name === "undefined")) {
            $(this).css("border", "solid 1px #f00");
            $(this).parent().children(".blankfield").html($.descByFieldName(this.name) + " required");
            $(this).parent().children(".blankfield").addClass("errorMessage");
            status = false;
         } else {
            $(this).parent().children(".blankfield").html("");
         }
      });

      /*if (status == true && this.captchaSuccess == false) {
         alert("Select reCheck checkbox");
         status = false;
      }*/

      if (status) {
         $('#wait').show();
         var userName = $("#form2 #loginUserName").val();
         var password = $("#form2 #loginPassword").val();
         this.userService.signin(userName, password).subscribe(
            apiResponse => {
               if (apiResponse.status == 200) {
                  $('#wait').hide();
                  let authToken: AuthToken = <AuthToken>apiResponse.result;
                  if (authToken && authToken.token) {
                     //console.log(authToken.role);
                     //console.log(authToken.userName);
                     //console.log(authToken.token);
                     localStorage.setItem('logedUser', JSON.stringify(authToken));
                     this.logedUser = authToken;
                     this.appComponent.setLogedUser(this.logedUser);
                     this.logedUser.role.includes('ROLE_ADMIN')
                     if (this.logedUser.role.includes('ROLE_ADMIN'))
                        this.navbarService.updateNavAfterAuth('ADMIN');
                     else if (this.logedUser.role.includes('ROLE_USER'))
                        this.navbarService.updateNavAfterAuth('USER');
                     else if (this.logedUser.role.includes('ROLE_MENTOR'))
                        this.navbarService.updateNavAfterAuth('MENTOR');
                     this.navbarService.updateLoginStatus(true);
                     this.router.navigate(['homePage']);
                  }
               } else {
                  alert(apiResponse.message);
               }
            }, error => {
               $('#wait').hide();
            }
         );
      }
   }

   forgetPassword() {
      var status = true;
      var userName = $("#form2 #loginUserName").val();
      if (userName == '' || typeof userName === "undefined") {
         alert("Enter User Name");
         $("#form2 #loginUserName").focus();
         status = false;
      }

      if (status) {
         $('#wait').show();
         this.userService.forgetPassword(userName).subscribe(
            apiResponse => {
               $('#wait').hide();
               $("#form2 #loginUserName").val("");
               if (apiResponse.status == 200) {
                  alert(apiResponse.message);
               } else
                  alert(apiResponse.message);
            }, error => {
               $('#wait').hide();
               $("#form2 #loginUserName").val("");
            }
         );
      }
   }
}
