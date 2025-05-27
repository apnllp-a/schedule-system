import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-head',
  templateUrl: './header-head.component.html',
  styleUrl: './header-head.component.scss'
})
export class HeaderHeadComponent {
  constructor(private router: Router) {
    localStorage.getItem("username")?.split(" ").forEach((item, index) => {
      if (index === 0) {
        this.userName = item;
        console.log(this.userName);
      }
    });
  }

  userName: string | undefined; // ดึงมาจาก auth หรือ service
userDropdownOpen = false;
toggleUserDropdown() {
  this.userDropdownOpen = !this.userDropdownOpen;
}

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
