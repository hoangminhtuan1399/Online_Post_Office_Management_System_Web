import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../../models/employee.model';
import { Account } from '../../models/account.model';
import { AuthService } from '../../auth.service'; 
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/api/Employee`; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Xử lý lỗi trong các yêu cầu HTTP
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

  // Lấy danh sách nhân viên
  getAllEmployees(): Observable<Employee[]> {
    console.log('Sending GET request to:', this.apiUrl);  

    return this.http.get<Employee[]>(this.apiUrl) // Không cần thêm headers
      .pipe(
        catchError(this.handleError)
      );
  }

  // Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    
    console.log('Sending GET request to:', url);  

    return this.http.get<any>(url) // Không cần thêm headers
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tạo nhân viên mới kèm tài khoản
  createEmployeeWithAccount(employee: Employee, account: Account): Observable<Employee> {
    console.log('Sending POST request to:', this.apiUrl);  
    console.log('Payload:', { employee, account });  

    return this.http.post<Employee>(this.apiUrl, { employee, account }) // Không cần thêm headers
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cập nhật nhân viên
  updateEmployee(id: string, employee: Employee): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    
    console.log('Sending PUT request to:', url);  
    console.log('Payload:', employee);  

    return this.http.put(url, employee) // Không cần thêm headers
      .pipe(
        catchError(this.handleError)
      );
  }
}
