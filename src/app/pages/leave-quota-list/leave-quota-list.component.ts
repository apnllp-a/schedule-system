// leave-quota-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-leave-quota-list',
  templateUrl: './leave-quota-list.component.html',
  styleUrls: ['./leave-quota-list.component.scss']
})
export class LeaveQuotaListComponent implements OnInit {
  employees: any[] = [];
  selectedEmployees: Set<string> = new Set();
  selectedYear: number = new Date().getFullYear();
  yearOptions: number[] = [];
  showModal: boolean = false;
  quotaForm!: FormGroup;
  sortKey: string = 'employeeId'; // ค่า default

  selectedDepartment: string = '';
  filteredEmployees: any[] = [];
  departmentOptions: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // จำนวนรายการต่อหน้า
  totalPages: number = 1;
  pagesArray: number[] = [];

  searchText: string = '';
  private searchSubject = new Subject<string>();


  constructor(private api: ApiService, private fb: FormBuilder) {}

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }


  ngOnInit(): void {
    this.generateYearOptions();
    this.loadEmployees();
    this.initForm();

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(searchTerm => {
      this.searchText = searchTerm;
      this.applyFilters();
    });
  }


  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    this.yearOptions = [currentYear - 1, currentYear, currentYear + 1];
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
      next: (res : any) => {
        alert(`บันทึกโควต้าสำเร็จ (${res.insertedCount} รายการ)`);
        this.closeModal();
      },
      error: (err) => {
        console.error('บันทึกโควต้าไม่สำเร็จ:', err);
      }
    });
  }


  sortEmployees() {
    this.filteredEmployees.sort((a, b) => {
      const valA = a[this.sortKey]?.toString().toLowerCase() || '';
      const valB = b[this.sortKey]?.toString().toLowerCase() || '';
      return valA.localeCompare(valB);
    });
  }

  // toggle เลือก/ยกเลิกทั้งหมด
  toggleSelectAll() {
    const allSelected = this.filteredEmployees.every(emp => this.selectedEmployees.has(emp._id));
    this.filteredEmployees.forEach(emp => {
      if (allSelected) {
        this.selectedEmployees.delete(emp._id);
      } else {
        this.selectedEmployees.add(emp._id);
      }
    });
  }


  isAllSelected(): boolean {
    return this.filteredEmployees.every(emp => this.selectedEmployees.has(emp._id));
  }


  loadEmployees() {
    this.api.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.filteredEmployees = res;
        this.extractDepartments(res);
        this.updateTotalPages();
      },
      error: (err) => console.error('โหลดพนักงานไม่สำเร็จ:', err)
    });
  }

  extractDepartments(employees: any[]) {
    const deptSet = new Set(employees.map(e => e.department).filter(Boolean));
    this.departmentOptions = Array.from(deptSet);
  }

  filterByDepartment() {
    this.applyFilters();
  }


  applyFilters() {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchDept = this.selectedDepartment ? emp.department === this.selectedDepartment : true;
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchSearch = this.searchText
        ? fullName.includes(this.searchText.toLowerCase())
        : true;
      return matchDept && matchSearch;
    });

    this.currentPage = 1;
    this.updateTotalPages();
  }



  paginatedEmployees(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }



  goToPage(page: number) {
    this.currentPage = page;
  }
}
