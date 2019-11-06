import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE } from '../models/constants';

@Injectable({ providedIn: 'root' })

export class MentorCalendarService {

    constructor(
        private http: HttpClient) { }

    findMentorCalendarByMentorId(
        mentorId: number,
        startDate: string,
        endDate: string): Observable<any> {
        return this.http.get<any[]>(
            `${API_URL}/search/findMentorCalendarByMentorId/${mentorId}/${startDate}/${endDate}`
        );
    }

}