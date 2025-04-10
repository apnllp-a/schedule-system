import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-board',
  templateUrl: './header-board.component.html',
  styleUrl: './header-board.component.scss'
})
export class HeaderBoardComponent {
  constructor(private router: Router) {}

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
