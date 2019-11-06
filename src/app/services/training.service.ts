import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE, RAZORPAY_KEY, RAZORPAY_SECRET } from '../models/constants';
import { Training } from '../models/training';
import { map } from "rxjs/operators";
import { Pagination } from '../models/pagination';

@Injectable({ providedIn: 'root' })

export class TrainingService {

    constructor(
        private http: HttpClient) { }

    findAllTrainings(
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/trainings/findAllTrainings${url}`);
    }

    findProposedTrainings(
        mentorId: number,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/trainings/findProposedTrainings/${mentorId}${url}`);
    }

    findByMentorIdAndStatus(
        mentorId: number,
        status: string,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/trainings/findByMentorIdAndStatus/${mentorId}/${status}${url}`);
    }

    findByUserIdAndStatus(
        userId: number,
        status: string,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/trainings/findByUserIdAndStatus/${userId}/${status}${url}`);
    }

    findByMentorIdSkillId(
        mentorId: number,
        skillId: number,
        page: number): Observable<Pagination> {
        let url = `?orderBy=id&direction=ASC&page=${page}&size=${PAGE_SIZE}`;
        return this.http.get<any>(`${API_URL}/trainings/findByMentorIdSkillId/${mentorId}/${skillId}${url}`);
    }

    findById(
        id: number): Observable<any> {
        return this.http.get(`${API_URL}/trainings/findById/${id}`);
    }

    proposeTraining(
        training: Training): Observable<any> {

        return this.http.post<any[]>(
            `${API_URL}/trainings/proposeTraining`, training)
            .pipe(map(apiResponse => { return apiResponse; }
            ));
    }

    approveTraining(
        id: number,
        status: string): Observable<any> {
        return this.http.put(`${API_URL}/trainings/approveTraining/${id}/${status}`, null);
    }

    updateTraining(
        training: Training): Observable<any> {
        return this.http.put(`${API_URL}/trainings/updateTraining`, training);
    }

    deleteTraining(
        id: number): Observable<any> {
        return this.http.delete(`${API_URL}/trainings/deleteTraining/${id}`);
    }

    capturePayment(razorpayPaymentId: string, amount: string): Observable<any> {

        var form: any = {
            amount: amount
        }
        return this.http.post<any[]>(
            `https://${RAZORPAY_KEY}:${RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${razorpayPaymentId}/capture`, form)
            .pipe(map(apiResponse => { return apiResponse; }
            ));
    }

    refundMoney(razorpayPaymentId: string): Observable<any> {

        return this.http.post<any[]>(
            `https://${RAZORPAY_KEY}:${RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${razorpayPaymentId}/refund`, null)
            .pipe(map(apiResponse => { return apiResponse; }
            ));
    }
}