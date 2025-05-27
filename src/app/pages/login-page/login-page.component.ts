import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      return;
    }

    this.api.login(this.credentials).subscribe({
      next: (res) => {
        if (res.user.role === 'Employee') {
          this.errorMessage = 'บัญชีพนักงานทั่วไปไม่สามารถเข้าสู่ระบบผ่านเว็บไซต์ได้';
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        const roleRoute: any = {
          IT: '/main-it',
          HR: '/main-hr',
          Head: '/main-head', 
          Board: '/main-board'
        };

        this.router.navigate([roleRoute[res.user.role] || '/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'เข้าสู่ระบบล้มเหลว';
      }
    });
  }
}
