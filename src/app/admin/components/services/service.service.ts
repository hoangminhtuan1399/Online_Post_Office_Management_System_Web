import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../../models/service.model';
import { AuthService } from '../../auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiBaseUrl}/api/Service`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Lấy headers với token từ AuthService
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

  // Xử lý lỗi trong các yêu cầu HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`; // Lỗi từ phía client
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; // Lỗi từ phía server
    }
    console.error('HTTP Error:', errorMessage);
    return throwError(errorMessage);
  }

  // Lấy danh sách dịch vụ
  getAllServices(): Observable<Service[]> {
    const headers = this.getAuthHeaders();
    console.log('Sending GET request to:', this.apiUrl);

    return this.http.get<Service[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Lấy dịch vụ theo ID
  getServiceById(id: string): Observable<Service> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.getAuthHeaders();

    console.log('Sending GET request to:', url);

    return this.http.get<Service>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tạo mới dịch vụ
  createService(service: Service): Observable<Service> {
    const headers = this.getAuthHeaders();

    console.log('Sending POST request to:', this.apiUrl);
    console.log('Payload:', service);

    return this.http.post<Service>(this.apiUrl, service, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateService(id: string, service: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.getAuthHeaders();

    console.log('Sending PUT request to:', url);
    console.log('Payload:', JSON.stringify(service));
    return this.http.put(url, service, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteService(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.getAuthHeaders();

    return this.http.delete(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}
