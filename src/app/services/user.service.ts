import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE } from '../models/constants';
import { Pagination } from '../models/pagination';

@Injectable({ providedIn: 'root' })

export class UserService {

    constructor(
        private http: HttpClient) { }

    logout() {
        localStorage.removeItem('logedUser');
        localStorage.removeItem('trainingObject');
        localStorage.removeItem('mentorSearchList')
        localStorage.removeItem('mentorSearchPageNo')
    }

    signin(
        userName: string,
        password: string): Observable<any> {
        return this.http.post<any>(`${API_URL}/users/signin`, {
            userName: userName,
            password: password
        }).pipe(map(apiResponse => { return apiResponse; }
        ));
    }

    signup(
        user: User): Observable<any> {
        return this.http.post(`${API_URL}/users/signup`, user);
    }

    blockUnblockUser(
        id: number,
        block: boolean): Observable<any> {
        return this.http.put(`${API_URL}/users/blockUnblockUser/${id}/${block}`, null);
    }

    updateProfile(
        user: User): Observable<any> {
        return this.http.put(`${API_URL}/users/updateProfile`, user);
    }

    deleteProfile(
        id: number): Observable<any> {
        return this.http.delete(`${API_URL}/users/deleteProfile/${id}`);
    }

    findAllUsers(
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/users/findAllUsers${url}`);
    }

    findById(
        id: number): Observable<any> {
        return this.http.get(`${API_URL}/users/findById/${id}`);
    }

    forgetPassword(
        userName: string): Observable<any> {
        return this.http.get(`${API_URL}/users/forgetPassword/${userName}`);
    }


}