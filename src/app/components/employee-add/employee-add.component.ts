import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  employee = {
    employeeId: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    contactInformation: {
      email: '',
      phone: ''
    },
    startDate: '',
    endDate: '',
    HIPID: '',
    workStatus: '',
    employmentType: 'trial-work',
    birthDate: '',
    address: '',
    salary: null,
    profileImage: ''
  };

  constructor(private api: ApiService) {}

  saveEmployee() {
    this.api.addEmployee(this.employee).subscribe({
      next: () => {
        alert('บันทึกข้อมูลสำเร็จ');
        this.saved.emit();
        this.resetForm();
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาด:', err);
        alert('บันทึกข้อมูลไม่สำเร็จ');
      }
    });
  }

  resetForm() {
    this.employee = {
      employeeId: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      contactInformation: {
        email: '',
        phone: ''
      },
      startDate: '',
      endDate: '',
      HIPID: '',
      workStatus: '',
      employmentType: 'trial-work',
      birthDate: '',
      address: '',
      salary: null,
      profileImage: ''
    };
  }

  cancel() {
    this.close.emit();
  }
}
