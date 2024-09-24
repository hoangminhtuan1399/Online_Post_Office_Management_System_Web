import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private apiUrl = `${environment.apiBaseUrl}/api/Payment`;

  constructor(private http: HttpClient) { }

  getPayments(pageNumber: number, pageSize: number, paymentStatus?: string, startDate?: string): Observable<any> {
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    if (paymentStatus && paymentStatus.trim() !== '') {
      params = params.set('PaymentStatus', paymentStatus);
    }

    if (startDate && startDate.trim() !== '') {
      params = params.set('StartDate', startDate);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getPaymentById(paymentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${paymentId}`);
  }
}
