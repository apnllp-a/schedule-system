import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-head',
  templateUrl: './header-head.component.html',
  styleUrl: './header-head.component.scss'
})
export class HeaderHeadComponent {
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
