import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthToken } from '../models/authToken';
import { AppComponent } from '../app.component';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CAPTCHA_SITE_KEY } from '../models/constants';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
   selector: 'app-signup',
   templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit, AfterViewChecked {

   logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
   translate: TranslateService
   user: any = {};
   pageTitle: string;
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
      private userService: UserService,
      private appComponent: AppComponent,
   ) { }

   ngAfterViewChecked(): void {

      $(function () {
         $.datepicker.setDefaults({
            dateFormat: 'dd-mm-yy',
         });
         $("#regDateTime").datepicker();

         $("#form1 #yearsOfExperience").keypress(function (event) {
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
               if ((event.which != 46 || $(this).val().indexOf('.') != -1)) {
                  event.preventDefault();
               }
               event.preventDefault();
            }
            if (this.value.indexOf(".") > -1 && (this.value.split('.')[1].length > 1)) {
               event.preventDefault();
            }
         });

      });

   }

   handleReset(): void { }

   handleSuccess(captchaResponse: string): void {
      this.captchaSuccess = true;
      this.captchaIsExpired = false;
   }

   handleLoad(): void { }

   handleExpire(): void { }

   ngOnInit() {

      $(function () {

         $("#form1 #contactNumber").keypress(function (event) {
            if ($(this).val().indexOf('.') != -1 || event.which < 48 || event.which > 57) {
               event.preventDefault();
            }
         });

         $('.password').pstrength();

         $("#form1 #password").keyup(function () {
            var textValue = $(this).val();
            if (textValue == "") {
               $("#password_text").find("span").remove();
               $("#password_bar").css("border", "1px solid #ace4e9");
               $("#password_bar").css("margin-top", "5px");
               $("#password_bar").css("font-size", "1px");
               $("#password_bar").css("height", "5px");
               $("#password_bar").css("width", "0px");
            }
         });

         $.descByFieldName = function (name) {
            var text;
            switch (name) {
               case "userName":
                  text = "User Name";
                  break;
               case "password":
                  text = "Pasword";
                  break;
               case "repassword":
                  text = "Confirm Password";
                  break;
               case "firstName":
                  text = "First Name";
                  break;
               case "lastName":
                  text = "Last Name";
                  break;
               case "contactNumber":
                  text = "Contact Number";
                  break;
               case "linkedinUrl":
                  text = "Linkedin URL";
                  break;
               case "yearsOfExperience":
                  text = "Years of Experience";
                  break;
               case "role":
                  text = "User Type";
                  break;
               default:
                  text = "";
            }
            return text;
         };
      });

      //this.translate.setDefaultLang('en');
      //this.translate.use('en');
      if (this.logedUser != null) {
         this.pageTitle = "Update Profile";
         $('#wait').show();
         this.userService.findById(this.logedUser.id).subscribe(
            apiResponse => {
               $('#wait').hide();
               this.user = apiResponse;
               this.user.password = "";
            }, error => {
               $('#wait').hide();
            }
         );
      } else {
         this.pageTitle = "Signup";
         this.clearFields();
      }
   }

   signup() {
      var status = this.validateFormData();
      if (status) {
         $('#wait').show();
         this.userService.signup(this.user).subscribe(
            apiResponse => {
               $('#wait').hide();
               alert(apiResponse.message);
               if (apiResponse.status == 200)
                  this.clearFields();
            }, error => {
               $('#wait').hide();
            }
         );
      }
   }

   updateProfile() {
      var status = this.validateFormData();
      if (status) {
         $('#wait').show();
         this.userService.updateProfile(this.user).subscribe(
            apiResponse => {
               $('#wait').hide();
               alert(apiResponse.message);
               if (apiResponse.status == 200) {
                  this.logedUser = {
                     "id": this.logedUser.id,
                     "userName": this.user.firstName,
                     "role": this.logedUser.role,
                     "token": this.logedUser.token
                  };
                  this.clearFields();
                  localStorage.setItem('logedUser', JSON.stringify(this.logedUser));
                  this.appComponent.setLogedUser(this.logedUser);
                  this.router.navigate(['homePage']);
               }
            }, error => {
               $('#wait').hide();
            }
         );
      }
   }

   validateFormData(): boolean {
      var status = true;
      var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
      var logedUser = JSON.parse(localStorage.getItem('logedUser'));
      $("#form1 .requiredfield").css("border", "1px solid #cacaca");
      $("#form1 .requiredfield").each(function () {
         if (logedUser != null && (this.name == "userName" || this.name == "password" || this.name == "repassword"))
            return true;
         var v = $(this).val();
         if (v == '') {
            $(this).css("border", "solid 1px #f00");
            $(this).parent().children(".blankfield").html($.descByFieldName(this.name) + " required");
            $(this).parent().children(".blankfield").addClass("errorMessage");
            status = false;
         } else {
            $(this).parent().children(".blankfield").html("");
         }
      });

      var phone = $("#form1 #contactNumber").val();
      if (phone.length < 10) {
         $("#form1 #contactNumber").css("border", "solid 1px #f00");
         $("#form1 #contactNumber").parent().children(".blankfield").html("Please enter 10 digit contact number");
         $("#form1 #contactNumber").parent().children(".blankfield").addClass("errorMessage");
         status = false;
      }

      var userName = $("#form1 #userName").val();
      if (this.logedUser == null && userName.length > 0 && !pattern.test(userName)) {
         $("#form1 #userName").css("border", "solid 1px #f00");
         $("#form1 #userName").parent().children(".blankfield").html("User Name should be an email id");
         $("#form1 #userName").parent().children(".blankfield").addClass("errorMessage");
         status = false;
      }

      var pas = $("#form1 #password").val();
      var repas = $("#form1 #repassword").val();
      if (pas != repas) {
         $("#form1 #repassword").css("border", "solid 1px #f00");
         $("#form1 #repassword").css("border", "solid 1px #f00");
         $("#form1 #repassword").parent().children(".blankfield").html("Password & Confirm Password should be same");
         $("#form1 #repassword").parent().children(".blankfield").addClass("errorMessage");
         status = false;
      }

      var role = $("#form1 #role option:selected").text();
      if (this.logedUser == null && role == "") {
         $("#form1 #role").css("border", "solid 1px #f00");
         $("#form1 #role").parent().children(".blankfield").html("User Type required");
         $("#form1 #role").parent().children(".blankfield").addClass("errorMessage");
         status = false;
      }

      if (this.logedUser == null && status == true && this.captchaSuccess == false) {
         alert("Select reCheck checkbox");
         status = false;
      }

      return status;
   }

   clearFields() {
      this.user = {
         "id": "",
         "userName": "",
         "password": "",
         "firstName": "",
         "lastName": "",
         "contactNumber": "",
         "role": "",
         "linkedinUrl": "",
         "yearsOfExperience": ""
      };
      $("#form1 #repassword").val("");
   }
}
