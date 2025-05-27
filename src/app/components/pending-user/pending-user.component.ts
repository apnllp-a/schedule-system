
import { Component, OnInit } from '@angular/core';
import { ApiService, ApiUser } from '../../core/services/api.service';

@Component({
  selector: 'app-pending-user',
  templateUrl: './pending-user.component.html',
  styleUrls: ['./pending-user.component.scss']
})
export class PendingUserComponent implements OnInit {
  pendingUsers: ApiUser[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.loading = true;
    this.error = null;
    this.apiService.getpendingUsers().subscribe({
      next: users => {
        this.pendingUsers = users;
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        this.loading = false;
      }
    });
  }

  onApprove(user: ApiUser): void {
    this.apiService.updateUser(user._id, { status: 'active' }).subscribe({
      next: () => this.loadPendingUsers(),
      error: err => alert(err.message || 'เกิดข้อผิดพลาดในการอนุมัติ')
    });
  }

  onReject(user: ApiUser): void {
    this.apiService.updateUser(user._id, { status: 'rejected' }).subscribe({
      next: () => this.loadPendingUsers(),
      error: err => alert(err.message || 'เกิดข้อผิดพลาดในการยกเลิก')
    });
  }
}