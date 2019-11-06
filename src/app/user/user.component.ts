import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Pagination } from '../models/pagination';
import { AuthToken } from '../models/authToken';

@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

    logedUser: AuthToken = JSON.parse(localStorage.getItem('logedUser'));
    pagination: Pagination;
    selectedPage: number = 0;

    constructor(
        private userService: UserService, ) { }

    ngOnInit() {
        this.findAllUsers(0);
    }

    pageChanged(page: number): void {
        this.selectedPage = page;
        this.findAllUsers(page);
    }

    blockunblockUser(id: number, block: boolean) {
        $('#wait').show();
        this.userService.blockUnblockUser(id, block).subscribe(
            apiResponse => {
                $('#wait').hide();
                alert(apiResponse.message);
                if (apiResponse.status == 200)
                    this.findAllUsers(this.selectedPage);
            }, error => {
                $('#wait').hide();
            }
        );
    }

    deleteUser(id: number) {
        $('#wait').show();
        this.userService.deleteProfile(id).subscribe(
            apiResponse => {
                $('#wait').hide();
                alert(apiResponse.message);
                if (apiResponse.status == 200)
                    this.findAllUsers(this.selectedPage);
            }, error => {
                $('#wait').hide();
            }
        );
    }

    findAllUsers(page: number) {
        $('#wait').show();
        this.userService.findAllUsers(page).subscribe(
            page => {
                $('#wait').hide();
                this.pagination = page;
            },
            error => {
                $('#wait').hide();
                this.pagination = new Pagination();
                this.pagination.content = [];
            }
        );
    }
}