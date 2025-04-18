import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
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
  private baseUrl      = 'http://localhost:8080';
  private userUrl      = `${this.baseUrl}/users`;
  private employeeUrl  = `${this.baseUrl}/employees`;
  private deptUrl      = `${this.baseUrl}/departments`;
  private leaveQuotaUrl= `${this.baseUrl}/leaveQuotas`;

  constructor(private http: HttpClient, private router: Router) {}

  // ------------------ User APIs ------------------
  /** ดึงผู้ใช้ทั้งหมด */
  getUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}`);
  }

  /** ดึงผู้ใช้สถานะ active */
  getActiveUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}/active`);
  }

  /** ดึงผู้ใช้สถานะ inactive (rejected) */
  getInactiveUsers(): Observable<ApiUser[]> {
    return this.http.get<ApiUser[]>(`${this.userUrl}/inactive`);
  }

  /** ดึงผู้ใช้ตาม ID */
  getUserById(id: string): Observable<ApiUser> {
    return this.http.get<ApiUser>(`${this.userUrl}/${id}`);
  }

  /** ค้นหาผู้ใช้ผ่าน query param username */
  searchUsers(username: string): Observable<ApiUser[]> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ApiUser[]>(`${this.userUrl}/search`, { params });
  }

  /** ลบผู้ใช้ (ID) */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }

  /** อัปเดตข้อมูลผู้ใช้ */
  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.userUrl}/update/${id}`, data);
  }

  /** สมัครใหม่ */
  register(user: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register`, user);
  }

  /** เข้าสู่ระบบ */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response.token) {
          const decoded: any = jwtDecode(response.token);
          const status = response.user?.status || 'active';

          if (status !== 'active') {
            this.logout();
            const msg = status === 'inactive'
              ? 'บัญชีถูกปิดใช้งาน'
              : 'บัญชียังรอตรวจสอบ';
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

  // ------------------ Auth Utilities ------------------
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getStatus(): string | null { return localStorage.getItem('status'); }
  getFullName(): string | null { return localStorage.getItem('fullName'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  getDepartment(): string | null { return localStorage.getItem('department'); }
}
