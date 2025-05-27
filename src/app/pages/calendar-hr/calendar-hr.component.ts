import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-hr',
  templateUrl: './calendar-hr.component.html',
  styleUrl: './calendar-hr.component.scss'
})
export class CalendarHrComponent {
  searchText = '';
  currentStartDate = this.getStartOfWeek(new Date());
  today = new Date();

  weekDates: { date: Date; dateStr: string; dayName: string }[] = [];

  employees = [
    {
      name: 'wikran sangjun',
      position: 'กรรมการผู้จัดการ\n52 - ทำงานปกติ 08.30–17.30',
      avatar: 'https://via.placeholder.com/40',
      schedule: {} as Record<string, string>
    },
    {
      name: 'วิทราม วิทรา',
      position: 'เจ้าหน้าที่ประสานงานขาย\nD1 - D1',
      avatar: 'https://via.placeholder.com/40?text=ทาร',
      schedule: {} as Record<string, string>
    }
  ];

  ngOnInit() {
    this.updateWeekDates();
    this.generateSchedules();
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1); // จ. = 1
    return new Date(d.setDate(diff));
  }

  updateWeekDates() {
    this.weekDates = [];
    const names = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentStartDate);
      date.setDate(this.currentStartDate.getDate() + i);
      this.weekDates.push({
        date,
        dateStr: this.formatDateKey(date),
        dayName: names[date.getDay()]
      });
    }
  }

  formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  formatDateRange(): string {
    const start = this.weekDates[0]?.date;
    const end = this.weekDates[6]?.date;
    return `${start?.getDate()} - ${end?.getDate()} ${this.getMonthName(start)} ${start?.getFullYear() + 543}`;
  }

  getMonthName(date: Date): string {
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม',
      'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return months[date.getMonth()];
  }

  prevWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
    this.updateWeekDates();
  }

  nextWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.updateWeekDates();
  }

  goToToday() {
    this.currentStartDate = this.getStartOfWeek(new Date());
    this.updateWeekDates();
  }

  isToday(date: Date): boolean {
    const d1 = this.formatDateKey(date);
    const d2 = this.formatDateKey(this.today);
    return d1 === d2;
  }

  filteredEmployees() {
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  generateSchedules() {
    for (const emp of this.employees) {
      const schedule: Record<string, string> = {};
      const today = new Date();

      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = date.getDay();
        const key = this.formatDateKey(date);

        if (day === 6 || day === 5) {
          schedule[key] = 'วันหยุด';
        } else {
          schedule[key] = Math.random() < 0.3 ? 'ขาดงาน' : '08:30-17:30';
        }
      }
      emp.schedule = schedule;
    }
  }
}
