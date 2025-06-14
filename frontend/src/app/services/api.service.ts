import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5086/api';  // Using HTTP port from launchSettings.json

  constructor(private http: HttpClient) { }

  getTestMessage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { username, email, password });
  }

  registerWithType(username: string, email: string, password: string, type: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { username, email, password, type });
  }

  changePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, { username, oldPassword, newPassword });
  }
} 