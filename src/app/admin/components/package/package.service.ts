import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiBaseUrl}/api/Package`;
  private deliveryApiUrl = `${environment.apiBaseUrl}/api/Delivery`;
  private paymentApiUrl = `${environment.apiBaseUrl}/api/Payment`;

  constructor(private http: HttpClient) { }

  getFilteredPackages(pageNumber: number, officeId: string, startDate: string, paymentStatus: string): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('itemsPerPage', '10')
      .set('officeId', officeId)
      .set('startDate', startDate)
      .set('paymentStatus', paymentStatus);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getPackageById(packageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${packageId}`);
  }

  createPackage(requestBody: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, requestBody);
  }

  getAllServices(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/Service`);
  }

  getAllOffice(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/api/Office`);
  }

  
  updateDelivery(id: string, requestBody: any): Observable<any> {
    return this.http.put<any>(`${this.deliveryApiUrl}/${id}`, requestBody);
  }

  // API update package
  updatePackage(id: string, requestBody: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestBody);
  }

  // API update payment
  updatePayment(id: string, requestBody: any): Observable<any> {
    return this.http.put<any>(`${this.paymentApiUrl}/${id}`, requestBody);
  }
}
