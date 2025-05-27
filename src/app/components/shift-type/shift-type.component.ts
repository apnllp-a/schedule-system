import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.scss']
})
export class ShiftTypeComponent {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  searchText: string = '';
  private searchSubject = new Subject<string>();

  startDate: string = '';
  endDate: string = '';
  selectedShift: { [employeeId: string]: string } = {};
  shiftOptions: string[] = ['D', 'N', 'O', '-'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchEmployees();

    this.searchSubject.pipe(debounceTime(300)).subscribe(text => {
      this.filterEmployees();
    });
  }

  fetchEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.filterEmployees();
      },
      error: (err) => console.error('ไม่สามารถดึงข้อมูลพนักงานได้', err)
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchText);
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(start, end);
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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

  changeItemsPerPage(value: string) {
    this.itemsPerPage = parseInt(value, 10);
    this.currentPage = 1;
    this.paginate();
  }
}
