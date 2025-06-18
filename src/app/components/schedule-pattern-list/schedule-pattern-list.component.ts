import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { SchedulePattern, WorkingDay } from '../../core/models/schedule-pattern.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-schedule-pattern-list',
  templateUrl: './schedule-pattern-list.component.html',
  styleUrls: ['./schedule-pattern-list.component.scss']
})
export class SchedulePatternListComponent implements OnInit {
  patterns: SchedulePattern[] = [];
  loading = true;
  error = '';

  // สำหรับ Modal (Add/Edit)
  showAddModal = false;
  isEditMode = false;
  editId: string | null = null;
  newPattern: {
    name: string;
    weekly: boolean;
    workingDays: WorkingDay[];
  } = { name: '', weekly: true, workingDays: [] };

  readonly days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadPatterns();
  }

  loadPatterns() {
    this.loading = true;
    this.api.getSchedulePatterns().subscribe({
      next: data => { this.patterns = data; this.loading = false; },
      error: () => { this.error = 'ไม่สามารถโหลดข้อมูลได้'; this.loading = false; }
    });
  }

  // === เปิด Modal ===
  openAddModal() {
    this.isEditMode = false;
    this.editId = null;
    this.newPattern = {
      name: '',
      weekly: true,
      workingDays: this.days.map(d => ({ day: d, startTime: '08:00', endTime: '17:00' }))
    };
    this.showAddModal = true;
  }

  openEditModal(pattern: SchedulePattern) {
    this.isEditMode = true;
    this.editId = pattern._id;
    this.newPattern = {
      name: pattern.name,
      weekly: pattern.weekly,
      workingDays: pattern.weekly
        ? (pattern.workingDays ?? []).map(w => ({ ...w }))
        : []
    };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  onWeeklyToggle() {
    if (this.newPattern.weekly) {
      this.newPattern.workingDays = this.days.map(d => ({ day: d, startTime: '08:00', endTime: '17:00' }));
    } else {
      this.newPattern.workingDays = [];
    }
  }

  // === Submit Add/Edit ===
  submitAdd(form: NgForm) {
    if (form.invalid) return;

    const payload = {
      name: this.newPattern.name,
      weekly: this.newPattern.weekly,
      workingDays: this.newPattern.weekly ? this.newPattern.workingDays : []
    };

    const obs = this.isEditMode && this.editId
      ? this.api.updateSchedulePattern(this.editId, payload)
      : this.api.createSchedulePattern(payload);

    obs.subscribe({
      next: () => {
        this.closeAddModal();
        this.loadPatterns();
      },
      error: err => {
        const action = this.isEditMode ? 'แก้ไข' : 'สร้าง';
        alert(`${action}ไม่สำเร็จ: ${err.message}`);
      }
    });
  }

  // === ลบ ===
  deletePattern(id: string) {
    if (!confirm('ต้องการลบรูปแบบนี้หรือไม่?')) return;
    this.api.deleteSchedulePattern(id).subscribe({
      next: () => this.loadPatterns(),
      error: err => alert('ลบไม่สำเร็จ: ' + err.message)
    });
  }

  /** ให้ตารางเวลา หรือ — */
  getTime(p: SchedulePattern, day: string): string {
    if (!p.weekly) return '—';
    const wd = p.workingDays?.find(w => w.day === day);
    return wd ? `${wd.startTime}–${wd.endTime}` : '—';
  }


  currentPage = 1;
  itemsPerPage = 5;
  pageSizeOptions = [5, 10, 15];
  get totalPages(): number {
    return Math.ceil(this.patterns.length / this.itemsPerPage);
  }
  get paginatedPatterns(): SchedulePattern[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.patterns.slice(start, start + this.itemsPerPage);
  }
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

}