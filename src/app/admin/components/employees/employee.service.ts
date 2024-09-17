import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { Account } from '../../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://onlinepostofficemanagementapi-a7csemagdjdecbbu.southeastasia-01.azurewebsites.net/api/Employee'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  
    });
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getEmployeeById(id: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Employee>(url, { headers: this.getAuthHeaders() });
  }

  createEmployeeWithAccount(employee: Employee, account: Account): Observable<Employee> {
    // Log the data before sending it to the API
    console.log('Sending Employee:', employee);
    console.log('Sending Account:', account);

    return this.http.post<Employee>(this.apiUrl, { employee, account }, { headers: this.getAuthHeaders() });
  }
}
