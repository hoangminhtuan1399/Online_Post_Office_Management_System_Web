import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Import thêm các operator từ rxjs
import { Office } from '../../models/office.model'; 

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  private apiUrl = 'https://localhost:7029/api/Office';

  constructor(private http: HttpClient) { }

  getAllOffices(): Observable<Office[]> {
    return this.http.get<Office[]>(this.apiUrl).pipe(
      tap(data => console.log('Offices:', data)), // Log dữ liệu nhận về để kiểm tra
      catchError(this.handleError) // Bắt lỗi và xử lý
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Bạn có thể xử lý lỗi tùy theo yêu cầu của bạn ở đây
    console.error(`Error: ${error.message}`);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
