import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../../models/employee.model';
import { Account } from '../../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/api/Employee`;

  constructor(private http: HttpClient) {}

  // Xử lý lỗi trong các yêu cầu HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Lỗi từ phía client
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Lỗi từ phía server
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Lấy danh sách nhân viên
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Employee>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tạo nhân viên mới kèm tài khoản
  createEmployeeWithAccount(employee: Employee, account: Account): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, { employee, account })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cập nhật nhân viên
  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Employee>(url, employee)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Tìm kiếm nhân viên
  searchEmployees(name?: string, officeId?: string, phone?: string, officeName?: string): Observable<Employee[]> {
    let params = new HttpParams();

    if (name && name.trim()) params = params.set('name', name.trim());
    if (officeId && officeId.trim()) params = params.set('officeId', officeId.trim());
    if (phone && phone.trim()) params = params.set('phone', phone.trim());
    if (officeName && officeName.trim()) params = params.set('officeName', officeName.trim());

    const url = `${this.apiUrl}/search`;
    
  
    console.log('Search Params:', params.toString());

    return this.http.get<Employee[]>(url, { params })
      .pipe(
        catchError(this.handleError)
      );
  }
}
