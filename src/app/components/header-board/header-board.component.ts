import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-board',
  templateUrl: './header-board.component.html',
  styleUrl: './header-board.component.scss'
})
export class HeaderBoardComponent {
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
