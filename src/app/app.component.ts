import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarService } from './utils/navbar.service';
import { AuthToken } from './models/authToken';
import { UserService } from './services/user.service';
import { PlatformLocation } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Skill Based Assignment';
  headerPart = 'Skill Based Assignment';
  footerPart = 'SBA - IIHT & IBM';
  links: Array<{ text: string, path: string }>;
  isLoggedIn = false;
  logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
  languageName = localStorage.getItem("languageName");

  constructor(
    location: PlatformLocation,
    private router: Router,
    private navbarService: NavbarService,
    private userService: UserService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url == '/' || url == '/home') {
          localStorage.removeItem('logedUser');
          this.logedUser = JSON.parse(localStorage.getItem('logedUser'));
          this.navbarService.updateLoginStatus(false);
        }
      }
    })

    location.onPopState(() => {
      history.go(0);
    });
  }

  ngOnInit() {

    localStorage.removeItem('trainingObject');
    localStorage.removeItem('mentorSearchList');
    localStorage.removeItem('mentorSearchPageNo');

    this.links = this.navbarService.getLinks();
    if (this.logedUser != null) {
      this.isLoggedIn = true;
      if (this.logedUser.role.includes('ROLE_ADMIN'))
        this.navbarService.updateNavAfterAuth('ADMIN');
      else if (this.logedUser.role.includes('ROLE_USER'))
        this.navbarService.updateNavAfterAuth('USER');
      else if (this.logedUser.role.includes('ROLE_MENTOR'))
        this.navbarService.updateNavAfterAuth('MENTOR');
      this.navbarService.updateLoginStatus(true);
    }
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);

    $(document).ready(function () {

      $(window).load(function () {
        $("#bodyTD").css("height", (GetHeight() - 247));
        //$("#bodyDiv").css("width", GetWidth() - 300);
      });

      function GetWidth() {
        var x = 0;
        if (self.innerWidth) {
          x = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientHeight) {
          x = document.documentElement.clientWidth;
        } else if (document.body) {
          x = document.body.clientWidth;
        }
        return x;
      };

      function GetHeight() {
        var y = 0;
        if (self.innerHeight) {
          y = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
          y = document.documentElement.clientHeight;
        } else if (document.body) {
          y = document.body.clientHeight;
        }
        return y;
      };

    });

  }

  logout() {
    if (confirm("Do you want to Logout ?")) {
      this.userService.logout();
      this.navbarService.updateLoginStatus(false);
      this.router.navigate(['']);
    } else
      return false;
  }

  setLogedUser(logedUser: AuthToken) {
    this.logedUser = logedUser;
  }

  public setLanguage(language: string, languageName: string) {

    if (localStorage.getItem("locale") != null && localStorage.getItem("locale") === language)
      return;
    localStorage.setItem("locale", language);
    localStorage.setItem("languageName", languageName);
  }
}
