import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {
  userData: any = {
    fullName: '',
    username: '',
    role: '',
    department: '',
    employmentType: ''
  };

  isEditing = false;

  constructor(private apiService: ApiService,private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    const path = this.router.url;

    if (path.includes('/main-it')) {
      this.buttonClass = 'it';
    } else if (path.includes('/main-hr')) {
      this.buttonClass = 'hr';
    } else if (path.includes('/main-board')) {
      this.buttonClass = 'board';
    } else if (path.includes('/main-head')) {
      this.buttonClass = 'head';
    }
  }

  buttonClass: string = 'hr'; // default

  loadUserData(): void {
    this.userData.fullName = localStorage.getItem('fullName') || '';
    this.userData.username = localStorage.getItem('username') || '';
    this.userData.role = localStorage.getItem('role') || '';
    this.userData.department = localStorage.getItem('department') || '';
    this.userData.employmentType = localStorage.getItem('employmentType') || '';
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.apiService.updateUser(userId, this.userData).subscribe({
      next: () => {
        alert('บันทึกข้อมูลสำเร็จ');
        Object.entries(this.userData).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        this.isEditing = false;
      },
      error: () => alert('เกิดข้อผิดพลาดในการบันทึก')
    });
  }
}
