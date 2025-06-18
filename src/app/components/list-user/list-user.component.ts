import { Component, OnInit } from '@angular/core';
import { ApiService, ApiUser } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';

export interface ViewUser extends ApiUser {
  empCode?: string;
}

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent implements OnInit {
  users: ViewUser[] = [];
  employees: { _id: string; employeeId: string }[] = [];
  loading = true;
  error: string | null = null;

  editingUser: ViewUser | null = null;
  editData = { username: '', role: '', department: '', status: '' };

  editingPasswordUser: ViewUser | null = null;
  passwordData = { password: '', confirmPassword: '' };

  addingUser = false;
  newUserData = {
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
  };
  registerError: string | null = null;

  linkingUser: ViewUser | null = null;
  selectedEmployeeId: string = '';

  showPassword = false;
  showConfirmPassword = false;
  showNewPassword = false;
  showNewConfirmPassword = false;
  

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadActiveUsers();
  }

  private loadEmployees(): void {
    this.apiService.getAllEmployees().subscribe((emps) => {
      this.employees = emps.map((e: any) => ({
        _id: e._id,
        employeeId: e.employeeId,
      }));
      this.refreshUsers();
    });
  }

  private loadActiveUsers(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users
          .filter((u) => u.status === 'active')
          .map((u) => ({ ...u } as ViewUser));
        this.loading = false;
        this.refreshUsers();
      },
      error: (err) => {
        this.error = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้';
        this.toastr.error(this.error || 'เกิดข้อผิดพลาด');
        this.loading = false;
      },
    });
  }

  private refreshUsers(): void {
    this.users.forEach((u) => {
      const emp = this.employees.find((e) => e._id === u.employeeId);
      u.empCode = emp ? emp.employeeId : '';
    });
  }

  // Edit user
  onEdit(u: ViewUser): void {
    this.editingUser = { ...u };
    this.editData = {
      username: u.username,
      role: u.role,
      department: u.department || '',
      status: u.status,
    };
  }

  onSave(): void {
    if (!this.editingUser) return;
    this.apiService.updateUser(this.editingUser._id, this.editData).subscribe({
      next: () => {
        this.toastr.success(`บันทึกข้อมูล ${this.editingUser?.username} สำเร็จ`);
        this.editingUser = null;
        this.loadActiveUsers();
      },
      error: (err) => {
        const msg = err.message || 'เกิดข้อผิดพลาดในการบันทึก';
        this.toastr.error(msg);
      },
    });
  }

  onCancel(): void {
    this.editingUser = null;
  }

  // Change password
  onChangePassword(u: ViewUser): void {
    this.editingPasswordUser = { ...u };
    this.passwordData = { password: '', confirmPassword: '' };
  }

  onSavePassword(): void {
    if (!this.editingPasswordUser) return;
    if (this.passwordData.password !== this.passwordData.confirmPassword) {
      this.toastr.error('รหัสผ่านและยืนยันไม่ตรงกัน');
      return;
    }
    this.apiService
      .updateUser(this.editingPasswordUser._id, {
        password: this.passwordData.password,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`เปลี่ยนรหัสผ่าน ${this.editingPasswordUser?.username} สำเร็จ`);
          this.editingPasswordUser = null;
          this.loadActiveUsers();
        },
        error: (err) => {
          const msg = err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
          this.toastr.error(msg);
        },
      });
  }

  onCancelPassword(): void {
    this.editingPasswordUser = null;
  }

  // Add new user
  onAddUser(): void {
    this.addingUser = true;
    this.newUserData = {
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
    };
    this.registerError = null;
  }

  onSaveNewUser(): void {
    if (this.newUserData.password !== this.newUserData.confirmPassword) {
      this.toastr.error('รหัสผ่านและยืนยันไม่ตรงกัน');
      return;
    }
    this.apiService.register(this.newUserData).subscribe({
      next: () => {
        this.toastr.success(`เพิ่มผู้ใช้ ${this.newUserData.username} สำเร็จ`);
        this.addingUser = false;
        this.loadActiveUsers();
      },
      error: (err) => {
        const msg = err.error?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้';
        this.toastr.error(msg);
      },
    });
  }

  onCancelNewUser(): void {
    this.addingUser = false;
  }

  // Link employee id
  onLinkEmployee(u: ViewUser): void {
    this.linkingUser = u;
    this.selectedEmployeeId = '';
  }

  onSaveLink(): void {
    if (!this.linkingUser || !this.selectedEmployeeId) return;
    this.apiService
      .updateUser(this.linkingUser._id, {
        employeeId: this.selectedEmployeeId,
      })
      .subscribe({
        next: () => {
          this.toastr.success(`เชื่อมพนักงานกับ ${this.linkingUser?.username} สำเร็จ`);
          this.linkingUser = null;
          this.loadActiveUsers();
        },
        error: (err) => {
          const msg = err.message || 'เกิดข้อผิดพลาดในการเชื่อมพนักงาน';
          this.toastr.error(msg);
        },
      });
  }

  onCancelLink(): void {
    this.linkingUser = null;
  }



  // Pagination & Filter
  page = 1;
  itemsPerPage = 5;
  itemsPerPageOptions = [5, 10, 20];
  searchUsername = '';
  filterStatus = '';
  sortByRoleOrder = ['it', 'hr', 'board', 'head'];

  // Getter สำหรับแสดงผล
  get filteredUsers(): ViewUser[] {
    let result = [...this.users];

    // กรองตาม status
    if (this.filterStatus) {
      result = result.filter(u => u.status === this.filterStatus);
    }

    // ค้นหาตาม username
    if (this.searchUsername) {
      result = result.filter(u =>
        u.username.toLowerCase().includes(this.searchUsername.toLowerCase())
      );
    }

    // เรียงตามลำดับ role
    result.sort((a, b) => {
      const roleA = this.sortByRoleOrder.indexOf(a.role);
      const roleB = this.sortByRoleOrder.indexOf(b.role);
      return roleA - roleB;
    });

    return result;
  }

}
