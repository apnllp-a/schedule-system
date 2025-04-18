import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent implements OnInit {
  departmentForm!: FormGroup;
  headUsers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      shortName: ['', Validators.required],
      fullName: ['', Validators.required],
      head: ['']
    });

    this.loadHeadUsers();
  }

  loadHeadUsers() {
    this.apiService.getHeadEmployees().subscribe({
      next: (res) => {
        this.headUsers = res;
      },
      error: (err) => {
        console.error('โหลดหัวหน้าแผนกไม่สำเร็จ:', err);
      }
    });
  }

  onSubmit() {
    if (this.departmentForm.invalid) return;

    this.apiService.addDepartment(this.departmentForm.value).subscribe({
      next: () => {
        alert('เพิ่มแผนกสำเร็จ');
        this.router.navigate(['/pages/department/list']);
      },
      error: (err) => {
        console.error('เพิ่มแผนกไม่สำเร็จ:', err);
        alert('เกิดข้อผิดพลาดในการเพิ่มแผนก');
      }
    });
  }
}
