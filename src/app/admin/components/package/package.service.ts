import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'https://onlinepostofficemanagementapi-a7csemagdjdecbbu.southeastasia-01.azurewebsites.net/api/package';

  constructor(private http: HttpClient) { }

  getPackageData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
