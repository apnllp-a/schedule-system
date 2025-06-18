import { Component, OnInit } from '@angular/core';
import { ApiService, ApiUser } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-pending-user',
  templateUrl: './pending-user.component.html',
  styleUrls: ['./pending-user.component.scss']
})
export class PendingUserComponent implements OnInit {
  allUsers: ApiUser[] = [];
  filteredUsers: ApiUser[] = [];

  // Filters
  searchTerm: string = '';
  selectedDepartment: string = 'all';

  // Pagination
  page: number = 1;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 20];

  loading = true;
  error: string | null = null;

  constructor( private apiService: ApiService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.loading = true;
    this.apiService.getpendingUsers().subscribe({
      next: users => {
        this.allUsers = users;
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.allUsers;

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === this.selectedDepartment);
    }

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  onDepartmentChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  onApprove(user: ApiUser): void {
    this.apiService.updateUser(user._id, { status: 'active' }).subscribe({
      next: () => {
        this.toastr.success(`อนุมัติ ${user.username} สำเร็จ`);
        this.loadPendingUsers();
      },
      error: err => {
        this.toastr.error(err.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
      }
    });
  }

  onReject(user: ApiUser): void {
    this.apiService.updateUser(user._id, { status: 'rejected' }).subscribe({
      next: () => {
        this.toastr.success(`ยกเลิก ${user.username} สำเร็จ`);
        this.loadPendingUsers();
      },
      error: err => {
        this.toastr.error(err.message || 'เกิดข้อผิดพลาดในการยกเลิก');
      }
    });
  }
}
