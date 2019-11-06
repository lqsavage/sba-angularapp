import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE } from '../models/constants';
import { MentorSkill } from '../models/mentorSkill';
import { Pagination } from '../models/pagination';

@Injectable({ providedIn: 'root' })

export class MentorSkillService {

    constructor(
        private http: HttpClient) { }


    findBySkillIdDateRange(
        skillId: number,
        startDate: string,
        endDate: string,
        startTime: string,
        endTime: string,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(
            `${API_URL}/search/findBySkillIdDateRange/${skillId}/${startDate}/${endDate}/${startTime}/${endTime}${url}`
        );
    }

    findMentorSkillsByMentorId(
        mentorId: number,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/search/findByMentorId/${mentorId}${url}`);
    }

    addMentorSkill(
        mentorSkill: MentorSkill): Observable<any> {
        return this.http.post(`${API_URL}/search/addMentorSkill`, mentorSkill);
    }

    updateMentorSkill(
        mentorSkill: MentorSkill): Observable<any> {
        return this.http.put(`${API_URL}/search/updateMentorSkill`, mentorSkill);
    }

    deleteMentorSkill(
        id: number): Observable<any> {
        return this.http.delete(`${API_URL}/search/deleteMentorSkill/${id}`);
    }
}