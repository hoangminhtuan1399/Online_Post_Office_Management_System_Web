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
      tap(data => console.log('Offices:', data)), 
      catchError(this.handleError) 
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Error: ${error.message}`);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
