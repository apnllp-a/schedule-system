import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.scss']
})
export class ShiftTypeComponent {
  shiftTypes: any[] = [];
  filteredShiftTypes: any[] = [];
  paginatedShiftTypes: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';
  totalPages: number = 0;
  employees: any[] = [];
  selectedShift: { [employeeId: string]: string } = {};
  startDate: string = '';
  endDate: string = '';
  shiftOptions: string[] = ['D', 'N', 'O', '-'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }
  editShiftType(shiftId: string): void {
    // Implement the logic for editing a shift type here
    console.log(`Editing shift type with ID: ${shiftId}`);
  }

  fetchEmployees() {
    this.apiService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
      },
      error: (err) => console.error('ไม่สามารถดึงข้อมูลพนักงานได้', err)
    });
  }

  filterShiftTypes() {
    this.filteredShiftTypes = this.shiftTypes.filter(shift =>
      shift.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedShiftTypes = this.filteredShiftTypes.slice(start, end);
    this.totalPages = Math.ceil(this.filteredShiftTypes.length / this.itemsPerPage);
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
    }
  }
}
/*เขียนโค้ดให้สามารถรันได้ตามที่หน้า UI กำหนดให้ โดยหน้าข้อมูลที่แสดงชื่อพนักงานให้ใช้ api เดี๋ยวกับหน้าของ employeelist 
โดยแสดงแค่ ชื่อ นามสกุล และ แผนก และเพิ่มในส่วนของการบันทึกเลือกเวรการทำงานโดยตอนนี้ให้มีแค่ 4 
เวรนั้นก็คือ D ดึก N กลางวัน O ทำงานนอกเวลา และ - สำหรับวันหยุด 
โดยให้สามารถเลือกได้ว่าพนักงานคนนี้จะทำเวรอะไร และเมื่อกดบันทึกและเลือกวันที่เริ่มต้นและวันที่
สิ้นสุดแล้วให้แสดงข้อความว่าบันทึกข้อมูลสำเร็จ โดยยังไม่ต้องเชื่อมต่อกับ api ของการเพิ่มเวรการทำงาน*/