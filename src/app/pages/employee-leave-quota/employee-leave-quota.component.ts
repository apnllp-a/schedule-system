// employee-leave-quota.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-employee-leave-quota',
  templateUrl: './employee-leave-quota.component.html',
  styleUrls: ['./employee-leave-quota.component.scss']
})
export class EmployeeLeaveQuotaComponent implements OnInit {
  employees: any[] = [];
  selectedEmployees: Set<string> = new Set();
  selectedYear: number = new Date().getFullYear();
  yearOptions: number[] = [];
  showModal: boolean = false;
  quotaForm!: FormGroup;
  leaveQuotas: any[] = []; // แสดงรายการพนักงานที่มีโควต้าแล้ว

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateYearOptions();
    this.loadEmployees();
    this.initForm();
    this.loadLeaveQuotas();
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    this.yearOptions = [currentYear - 1, currentYear, currentYear + 1];
  }

  loadEmployees() {
    this.api.getAllEmployees().subscribe({
      next: (res) => this.employees = res,
      error: (err) => console.error('โหลดพนักงานไม่สำเร็จ:', err)
    });
  }

  loadLeaveQuotas() {
    this.api.getLeaveQuotasByYear(this.selectedYear).subscribe({
      next: (res : any) => this.leaveQuotas = res,
      error: (err) => console.error('โหลดโควต้าไม่สำเร็จ:', err)
    });
  }

  initForm() {
    this.quotaForm = this.fb.group({
      vacation: [0, Validators.required],
      sick: [0, Validators.required],
      personal: [0, Validators.required],
      ordination: [0, Validators.required],
      maternity: [0, Validators.required],
      other: [0, Validators.required]
    });
  }

  toggleEmployeeSelection(id: string) {
    this.selectedEmployees.has(id)
      ? this.selectedEmployees.delete(id)
      : this.selectedEmployees.add(id);
  }

  openModal() {
    if (this.selectedEmployees.size === 0) return alert('กรุณาเลือกพนักงานอย่างน้อยหนึ่งคน');
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.quotaForm.reset();
  }

  submitQuota() {
    if (this.quotaForm.invalid) return;
    const body = {
      employeeIds: Array.from(this.selectedEmployees),
      year: this.selectedYear,
      quotas: this.quotaForm.value
    };

    this.api.createBulkLeaveQuota(body).subscribe({
      next: (res: any) => {
        alert(`บันทึกโควต้าสำเร็จ (${res.insertedCount} รายการ)`);
        this.closeModal();
        this.loadLeaveQuotas();
      },
      error: (err) => {
        console.error('บันทึกโควต้าไม่สำเร็จ:', err);
      }
    });
  }
}