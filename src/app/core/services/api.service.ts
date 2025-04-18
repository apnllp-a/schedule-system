import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // ✅ ต้นทาง API เดียว

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, credentials).pipe(
      map((response: any) => {
        if (response.token) {
          const decodedToken: any = jwtDecode(response.token);

          // ✅ ตรวจสอบสถานะ
          const status = response.user?.status || 'active';

          if (status === 'inactive') {
            this.logout();
            alert('บัญชีผู้ใช้นี้ถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
            this.router.navigate(['/']);
            return null;
          }

          if (status === 'pending') {
            this.logout();
            alert('บัญชีผู้ใช้ยังไม่ได้รับการอนุมัติ กรุณารอการอนุมัติจากผู้ดูแล');
            this.router.navigate(['/']);
            return null;
          }

          // ✅ เก็บข้อมูลผู้ใช้ลง localStorage
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
  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees`);
  }
  addEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees`, data);
  }
  getHeadEmployees() {
    return this.http.get<any[]>(`${this.baseUrl}/employees/head`);
  }
// ดึงรายชื่อแผนกทั้งหมด
getDepartments(): Observable<any> {
  return this.http.get(`${this.baseUrl}/departments`);
}

// ดึงข้อมูลแผนกรายตัว
getDepartmentById(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/departments/${id}`);
}

// เพิ่มแผนกใหม่
addDepartment(dept: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/departments`, dept);
}

// แก้ไขแผนก
updateDepartment(id: string, dept: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/departments/${id}`, dept);
}

// ลบแผนก
deleteDepartment(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/departments/${id}`);
}

createBulkLeaveQuota(payload: any) {
  return this.http.post(`${this.baseUrl}/leaveQuotas/bulk`, payload);
}
getLeaveQuotasByYear(year: number) {
  return this.http.get(`${this.baseUrl}/leave-quotas?year=${year}`);
}
  
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

