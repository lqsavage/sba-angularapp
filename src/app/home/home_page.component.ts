import { Component, OnInit } from '@angular/core';
import { AuthToken } from '../models/authToken';

declare var $: any;

@Component({
   selector: 'app-home-page',
   templateUrl: './home_page.component.html'
})

export class HomePageComponent implements OnInit {

   logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));

   constructor(
   ) { }

   ngOnInit() {
      
   }

}
