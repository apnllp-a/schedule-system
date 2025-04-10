import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-it',
  templateUrl: './header-it.component.html',
  styleUrl: './header-it.component.scss'
})
export class HeaderItComponent {
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
