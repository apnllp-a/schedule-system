import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { SchedulePattern } from '../models/schedule-pattern.model';

export interface ApiUser {
  _id: string;
  username: string;
  role: string;
  department?: string;
  status: 'pending' | 'active' | 'rejected';
  employeeId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://sssystemapi.duckdns.org/';
  private userUrl         = `${this.baseUrl}/users`;
  private employeeUrl     = `${this.baseUrl}/employees`;
  private deptUrl         = `${this.baseUrl}/departments`;
  private leaveQuotaUrl   = `${this.baseUrl}/leaveQuotas`;
  private schedulePatternUrl = `${this.baseUrl}/schedulePatterns`;

  constructor(private http: HttpClient, private router: Router) {}

  // ------------------ User APIs ------------------
  getUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}`);
  }
  getActiveUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}/active`);
  }
  getInactiveUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}/inactive`);
  }
  getpendingUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}/pending`);
  }
  getUserById(id: string): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.userUrl}/${id}`);
  }
  searchUsers(username: string): Observable<ApiUser[]> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ApiUser[]>(`${this.userUrl}/search`, { params });
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }
  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.userUrl}/update/${id}`, data);
  }
  register(user: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register`, user);
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response.token) {
          const decoded: any = jwtDecode(response.token);
          const status = response.user?.status || 'active';
          if (status !== 'active') {
            this.logout();
            const msg =
              status === 'inactive' ? 'บัญชีถูกปิดใช้งาน' : 'บัญชียังรอตรวจสอบ';
            alert(msg);
            this.router.navigate(['/']);
            return null;
          }
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.user.userId);
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('department', response.user.department || '');
          localStorage.setItem('status', status);
          localStorage.setItem('fullName', response.user.fullName || '');
          localStorage.setItem('employmentType', response.user.employmentType || '');
        }
        return response;
      })
    );
  }

  // ------------------ Employee APIs ------------------
  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.employeeUrl}`);
  }
  addEmployee(data: any): Observable<any> {
    return this.http.post(`${this.employeeUrl}`, data);
  }
  getHeadEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.employeeUrl}/head`);
  }

  // ------------------ Department APIs ------------------
  getDepartments(): Observable<any> {
    return this.http.get(`${this.deptUrl}`);
  }
  getDepartmentById(id: string): Observable<any> {
    return this.http.get(`${this.deptUrl}/${id}`);
  }
  addDepartment(dept: any): Observable<any> {
    return this.http.post(`${this.deptUrl}`, dept);
  }
  updateDepartment(id: string, dept: any): Observable<any> {
    return this.http.put(`${this.deptUrl}/${id}`, dept);
  }
  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.deptUrl}/${id}`);
  }

  // ------------------ Leave Quota APIs ------------------
  createBulkLeaveQuota(payload: any): Observable<any> {
    return this.http.post(`${this.leaveQuotaUrl}/bulk`, payload);
  }
  getLeaveQuotasByYear(year: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/leave-quotas?year=${year}`);
  }

  // ------------------ Schedule Pattern APIs ------------------
  getSchedulePatterns(): Observable<SchedulePattern[]> {
    return this.http.get<SchedulePattern[]>(`${this.schedulePatternUrl}`);
  }
  getSchedulePattern(identifier: string): Observable<SchedulePattern> {
    return this.http.get<SchedulePattern>(`${this.schedulePatternUrl}/${identifier}`);
  }
  createSchedulePattern(pattern: Partial<SchedulePattern>): Observable<SchedulePattern> {
    return this.http.post<SchedulePattern>(`${this.schedulePatternUrl}`, pattern);
  }
  updateSchedulePattern(id: string, pattern: Partial<SchedulePattern>): Observable<SchedulePattern> {
    return this.http.put<SchedulePattern>(`${this.schedulePatternUrl}/${id}`, pattern);
  }
  deleteSchedulePattern(id: string): Observable<any> {
    return this.http.delete(`${this.schedulePatternUrl}/${id}`);
  }

  // ------------------ Auth Utilities ------------------
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  getStatus(): string | null {
    return localStorage.getItem('status');
  }
  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
  getDepartment(): string | null {
    return localStorage.getItem('department');
  }
}
