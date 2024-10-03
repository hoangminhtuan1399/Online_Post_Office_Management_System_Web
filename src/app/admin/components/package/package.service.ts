import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = `${environment.apiBaseUrl}/api/Package`;
  private deliveryApiUrl = `${environment.apiBaseUrl}/api/Delivery`;
  private paymentApiUrl = `${environment.apiBaseUrl}/api/Payment`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const authToken = this.authService.getTokenFromCookies();  

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
      console.log('Authorization header set with token:', authToken);  
    } else {
      console.warn('No token found in cookies');
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Lỗi từ phía client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Lỗi từ phía server
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('HTTP Error:', errorMessage);
    return throwError(errorMessage);
  }

  getFilteredPackages(pageNumber: number, officeId: string, startDate: string, paymentStatus: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('officeId', officeId)
      .set('startDate', startDate)
      .set('paymentStatus', paymentStatus);

    return this.http.get<any>(this.apiUrl, { params, headers }).pipe(
      catchError(this.handleError)
    );;
  }

  getPackageById(packageId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${packageId}`, { headers });
  }

  createPackage(requestBody: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, requestBody, { headers });
  }

  getAllServices(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.apiBaseUrl}/api/Service`, { headers });
  }

  getAllOffice(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.apiBaseUrl}/api/Office`, { headers });
  }

  
  updateDelivery(id: string, requestBody: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.deliveryApiUrl}/${id}`, requestBody, { headers });
  }

  // API update package
  updatePackage(id: string, requestBody: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, requestBody, { headers });
  }

  // API update payment
  updatePayment(id: string, requestBody: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.paymentApiUrl}/${id}`, requestBody, { headers });
  }
}
