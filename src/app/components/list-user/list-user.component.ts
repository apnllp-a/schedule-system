import { Component, OnInit } from '@angular/core';
import { ApiService, ApiUser } from '../../core/services/api.service';
export interface ViewUser extends ApiUser {
  empCode?: string;
}

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: ViewUser[] = [];
  employees: { _id: string; employeeId: string }[] = [];
  loading = true;
  error: string | null = null;

  // For edit
  editingUser: ViewUser | null = null;
  editData = { username: '', role: '', department: '', status: '' };
  
  // For password change
  editingPasswordUser: ViewUser | null = null;
  passwordData = { password: '', confirmPassword: '' };

  // For new user
  addingUser = false;
  newUserData = { username: '', password: '', confirmPassword: '', role: '', department: '' };
  registerError: string | null = null;

  // For linking employee
  linkingUser: ViewUser | null = null;
  selectedEmployeeId: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadActiveUsers();
  }

  private loadEmployees(): void {
    this.apiService.getAllEmployees().subscribe(emps => {
      this.employees = emps.map((e: any) => ({ _id: e._id, employeeId: e.employeeId }));
      this.refreshUsers();
    });
  }

  private loadActiveUsers(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe({
      next: users => {
        this.users = users
          .filter(u => u.status === 'active')
          .map(u => ({ ...u } as ViewUser));
        this.loading = false;
        this.refreshUsers();
      },
      error: err => {
        this.error = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้';
        this.loading = false;
      }
    });
  }

  private refreshUsers(): void {
    // Join empCode
    this.users.forEach(u => {
      const emp = this.employees.find(e => e._id === u.employeeId);
      u.empCode = emp ? emp.employeeId : '';
    });
  }

  // Edit user
  onEdit(u: ViewUser): void {
    this.editingUser = { ...u };
    this.editData = { username: u.username, role: u.role, department: u.department || '', status: u.status };
  }
  onSave(): void {
    if (!this.editingUser) return;
    this.apiService.updateUser(this.editingUser._id, this.editData).subscribe({
      next: () => { this.editingUser = null; this.loadActiveUsers(); },
      error: err => alert(err.message || 'เกิดข้อผิดพลาดในการบันทึก')
    });
  }
  onCancel(): void { this.editingUser = null; }

  // Change password
  onChangePassword(u: ViewUser): void {
    this.editingPasswordUser = { ...u };
    this.passwordData = { password: '', confirmPassword: '' };
  }
  onSavePassword(): void {
    if (!this.editingPasswordUser) return;
    if (this.passwordData.password !== this.passwordData.confirmPassword) {
      alert('รหัสผ่านและยืนยันไม่ตรงกัน'); return;
    }
    this.apiService.updateUser(this.editingPasswordUser._id, { password: this.passwordData.password }).subscribe({
      next: () => { alert('เปลี่ยนรหัสผ่านสำเร็จ'); this.editingPasswordUser = null; },
      error: err => alert(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน')
    });
  }
  onCancelPassword(): void { this.editingPasswordUser = null; }

  // Add new user
  onAddUser(): void {
    this.addingUser = true;
    this.newUserData = { username: '', password: '', confirmPassword: '', role: '', department: '' };
    this.registerError = null;
  }
  onSaveNewUser(): void {
    if (this.newUserData.password !== this.newUserData.confirmPassword) {
      this.registerError = 'รหัสผ่านและยืนยันไม่ตรงกัน'; return;
    }
    this.apiService.register(this.newUserData).subscribe({
      next: () => { this.addingUser = false; this.loadActiveUsers(); },
      error: err => { this.registerError = err.error?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้'; }
    });
  }
  onCancelNewUser(): void { this.addingUser = false; }

  // Link employee id
  onLinkEmployee(u: ViewUser): void {
    this.linkingUser = u;
    this.selectedEmployeeId = '';
  }
  onSaveLink(): void {
    if (!this.linkingUser || !this.selectedEmployeeId) return;
    this.apiService.updateUser(this.linkingUser._id, { employeeId: this.selectedEmployeeId }).subscribe({
      next: () => { this.linkingUser = null; this.loadActiveUsers(); },
      error: err => alert(err.message || 'เกิดข้อผิดพลาดในการเชื่อมพนักงาน')
    });
  }
  onCancelLink(): void { this.linkingUser = null; }
}