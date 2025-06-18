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
import { AccountSettingComponent } from './components/account-setting/account-setting.component';
import { ListOfEmployeesComponent } from './components/list-of-employees/list-of-employees.component';

import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { LeaveQuotaListComponent } from './pages/leave-quota-list/leave-quota-list.component';
import { EmployeeLeaveQuotaComponent } from './pages/employee-leave-quota/employee-leave-quota.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { SchedulePatternListComponent } from './components/schedule-pattern-list/schedule-pattern-list.component';
import { PendingUserComponent } from './components/pending-user/pending-user.component';
import { EmployeeLeaveListComponent } from './components/employee-leave-list/employee-leave-list.component';
import { CalendarHrComponent } from './pages/calendar-hr/calendar-hr.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'employee/add', component: EmployeeAddComponent },

  {
    path: 'main-it',
    component: MainItComponent,
    children: [
      { path: '', redirectTo: 'list-user', pathMatch: 'full' },
      { path: 'account-setting', component: AccountSettingComponent },
      { path: 'list-user', component: ListUserComponent },
      { path: 'pending-user', component: PendingUserComponent },

      // เพิ่ม route ย่อยอื่น ๆ
    ],
  },
  {
    path: 'main-hr',
    component: MainHrComponent,
    children: [
      { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
      { path: 'account-setting', component: AccountSettingComponent },
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'department-list', component: DepartmentListComponent },
      { path: 'leave-quota-list', component: LeaveQuotaListComponent },
      { path: 'employee-leave-quota', component: EmployeeLeaveQuotaComponent },
      { path: 'shift-type', component: ShiftTypeComponent },
      { path: 'schedule-pattern-list', component: SchedulePatternListComponent },
      
      { path: 'employee-leave-list', component: EmployeeLeaveListComponent },
      { path: 'calendar', component: CalendarHrComponent }
    ],
  },
  {
    path: 'main-head',
    component: MainHeadComponent,
    children: [
      { path: '', redirectTo: 'list-of-employees', pathMatch: 'full' },
      { path: 'account-setting', component: AccountSettingComponent },
      { path: 'list-of-employees', component: ListOfEmployeesComponent },
    ],
  },
  {
    path: 'main-board',
    component: MainBoardComponent,
    children: [
      { path: '', redirectTo: 'list-of-employees', pathMatch: 'full' },
      { path: 'account-setting', component: AccountSettingComponent },
      { path: 'list-of-employees', component: ListOfEmployeesComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  //end
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
