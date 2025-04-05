import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainItComponent } from './pages/main-it/main-it.component';
import { MainHrComponent } from './pages/main-hr/main-hr.component';
import { MainHeadComponent } from './pages/main-head/main-head.component';
import { MainBoardComponent } from './pages/main-board/main-board.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { ShiftTypeComponent } from './components/shift-type/shift-type.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { LeaveQuotaListComponent } from './pages/leave-quota-list/leave-quota-list.component';
import { EmployeeLeaveQuotaComponent } from './pages/employee-leave-quota/employee-leave-quota.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'main-it', component: MainItComponent },
  { path: 'main-hr', component: MainHrComponent },
  { path: 'main-head', component: MainHeadComponent },
  { path: 'main-board', component: MainBoardComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'employee-list', component: EmployeeListComponent },
  { path: 'employee/add', component: EmployeeAddComponent },
  { path: 'shift-type', component: ShiftTypeComponent },
  { path: 'department-list', component: DepartmentListComponent },
  { path: 'leave-quota-list', component: LeaveQuotaListComponent },
  { path: 'employee-leave-quota', component: EmployeeLeaveQuotaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
