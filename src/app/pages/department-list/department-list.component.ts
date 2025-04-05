import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  showAddModal = false;
  departmentForm!: FormGroup;
  showEditModal = false;
  editDepartmentForm!: FormGroup;
  editingDeptId: string | null = null;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.initForm();
  }

  loadDepartments(): void {
    this.apiService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: (err) => {
        console.error('ไม่สามารถโหลดรายชื่อแผนกได้:', err);
      }
    });
  }

  initForm() {
    this.departmentForm = this.fb.group({
      shortName: ['', Validators.required],
      name: ['', Validators.required],   // ✅ เปลี่ยนจาก fullName เป็น name
      head: ['']
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.departmentForm.reset();
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) return;

    console.log('ส่งข้อมูล:', this.departmentForm.value); // 🔍 debug

    this.apiService.addDepartment(this.departmentForm.value).subscribe({
      next: () => {
        this.loadDepartments();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('เพิ่มแผนกไม่สำเร็จ:', err);
      }
    });
  }

  onEditDepartment(id: string): void {
    alert('ยังไม่เชื่อมหน้าแก้ไขแผนก: ' + id);
  }

  onDeleteDepartment(id: string): void {
    if (confirm('คุณแน่ใจว่าต้องการลบแผนกนี้?')) {
      this.apiService.deleteDepartment(id).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => {
          console.error('ลบแผนกไม่สำเร็จ:', err);
        }
      });
    }
  }
  openEditModal(id: string) {
    this.apiService.getDepartmentById(id).subscribe({
      next: (dept) => {
        this.editingDeptId = id;
        this.editDepartmentForm = this.fb.group({
          shortName: [dept.shortName, Validators.required],
          name: [dept.name, Validators.required],
          head: [dept.head]
        });
        this.showEditModal = true;
      },
      error: (err) => {
        console.error('โหลดข้อมูลแผนกไม่สำเร็จ:', err);
      }
    });
  }
  
  closeEditModal() {
    this.showEditModal = false;
    this.editingDeptId = null;
  }
  onUpdateDepartment() {
    if (this.editDepartmentForm.invalid || !this.editingDeptId) return;
  
    this.apiService.updateDepartment(this.editingDeptId, this.editDepartmentForm.value).subscribe({
      next: () => {
        this.loadDepartments();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('อัปเดตแผนกไม่สำเร็จ:', err);
      }
    });
  }
  
}