import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PAGE_SIZE } from '../models/constants';
import { map } from "rxjs/operators";
import { Payment } from '../models/payment';

@Injectable({ providedIn: 'root' })

export class PaymentService {

    constructor(
        private http: HttpClient) { }

    findPaymentDtlsByDateRange(
        mentorId: number,
        startDate: string,
        endDate: string,
        page: number): Observable<any> {
        let url = `?orderBy=id&direction=ASC&page=0&size=${PAGE_SIZE}`;
        return this.http.get<any[]>(`${API_URL}/payments/findPaymentDtlsByDateRange/${mentorId}/${startDate}/${endDate}${url}`);
    }

    findById(
        id: number): Observable<any> {
        return this.http.get(`${API_URL}/payments/findById/${id}`);
    }

    addPayment(
        payment: Payment): Observable<any> {
        return this.http.post(`${API_URL}/payments/addPayment`, payment);
    }

    findPaymentCommission(
        id: number): Observable<any> {

        return this.http.get<any[]>(
            `${API_URL}/payments/findPaymentCommission/${id}`)
            .pipe(map(apiResponse => { return apiResponse; }
            ));
    }

    updatePaymentCommission(
        id: number,
        commissionPercent: number): Observable<any> {

        return this.http.put<any[]>(
            `${API_URL}/payments/updatePaymentCommission/${id}/${commissionPercent}`, null)
            .pipe(map(apiResponse => { return apiResponse; }
            ));
    }

}