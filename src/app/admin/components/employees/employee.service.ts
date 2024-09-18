import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../../models/employee.model';
import { Account } from '../../models/account.model';
import { AuthService } from '../../auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://onlinepostofficemanagementapi-a7csemagdjdecbbu.southeastasia-01.azurewebsites.net/api/Employee'; 

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
    const headers = this.getAuthHeaders();
    console.log('GET Request Headers:', headers);  
    console.log('Sending GET request to:', this.apiUrl);  

    return this.http.get<Employee[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.getAuthHeaders();
    
    console.log('GET Request Headers:', headers);  
    console.log('Sending GET request to:', url);  

    return this.http.get<Employee>(url, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tạo nhân viên mới kèm tài khoản
  createEmployeeWithAccount(employee: Employee, account: Account): Observable<Employee> {
    const headers = this.getAuthHeaders();
    console.log('POST Request Headers:', headers);  
    console.log('Sending POST request to:', this.apiUrl);  
    console.log('Payload:', { employee, account });  

    return this.http.post<Employee>(this.apiUrl, { employee, account }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cập nhật nhân viên
  updateEmployee(id: string, employee: Employee): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.getAuthHeaders();
    
    console.log('PUT Request Headers:', headers);  
    console.log('Sending PUT request to:', url);  
    console.log('Payload:', employee);  

    return this.http.put(url, employee, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}
