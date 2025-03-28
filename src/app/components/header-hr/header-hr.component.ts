import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-hr',
  templateUrl: './header-hr.component.html',
  styleUrls: ['./header-hr.component.scss']
})
export class HeaderHrComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
