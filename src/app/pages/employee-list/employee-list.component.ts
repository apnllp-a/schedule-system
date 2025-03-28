import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';
  selectedDepartment: string = '';
  showAddModal = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }



  fetchEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.filteredEmployees = res;
        this.paginate();
      },
      error: (err) => console.error('ไม่สามารถดึงข้อมูลพนักงานได้', err)
    });
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesText = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDept = this.selectedDepartment ? emp.department === this.selectedDepartment : true;
      return matchesText && matchesDept;
    });
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.filteredEmployees.length) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  uniqueDepartments(): string[] {
    const allDepartments = this.employees.map(emp => emp.department);
    return [...new Set(allDepartments)].filter(Boolean);
  }

  addEmployee() {
    this.showAddModal = true;
  }

  editEmployee(id: string) {
    alert('ยังไม่เชื่อมฟอร์มแก้ไข: ' + id);
  }

  deleteEmployee(id: string) {
    const confirmDelete = confirm('คุณแน่ใจว่าต้องการลบพนักงานนี้หรือไม่?');
    if (confirmDelete) {
      alert('ยังไม่เชื่อม API ลบพนักงาน: ' + id);
    }
  }

  exportToExcel() {
    alert('ยังไม่เชื่อมระบบส่งออก Excel');
  }
}
