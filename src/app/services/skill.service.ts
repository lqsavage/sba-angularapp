import { Injectable } from '@angular/core';
import { Skill } from '../models/skill';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE } from '../models/constants';
import { Pagination } from '../models/pagination';

@Injectable({ providedIn: 'root' })

export class SkillService {
    
    constructor(
        private http: HttpClient) { }

    findById(
        id: number): Observable<any> {
        return this.http.get(`${API_URL}/skills/findById/${id}`);
    }

    findAllSkills(
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/skills/findAllSkills${url}`);
    }

    addSkill(
        skill: Skill): Observable<any> {
        return this.http.post(`${API_URL}/skills/addSkill`, skill);
    }

    updateSkill(
        skill: Skill): Observable<any> {
        return this.http.put(`${API_URL}/skills/updateSkill`, skill);
    }

    deleteSkill(
        id: number): Observable<any> {
        return this.http.delete(`${API_URL}/skills/deleteSkill/${id}`);
    }
}