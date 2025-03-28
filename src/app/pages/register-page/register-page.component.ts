import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  user = {
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    employeeId: ''
  };

  errorMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'รหัสผ่านไม่ตรงกัน';
      return;
    }

    const payload = {
      username: this.user.username,
      password: this.user.password,
      confirmPassword: this.user.confirmPassword,
      role: this.user.role,
      department: this.user.role !== 'Board' ? this.user.department : null,
      employeeId: this.user.role !== 'Board' ? this.user.employeeId : null
    };

    this.api.register(payload).subscribe({
      next: (res) => {
        alert('สมัครสมาชิกสำเร็จ');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'สมัครไม่สำเร็จ';
      }
    });
  }
}
