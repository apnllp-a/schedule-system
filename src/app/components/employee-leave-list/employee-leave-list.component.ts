import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LeaveRequest {
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

@Component({
  selector: 'app-employee-leave-list',
  templateUrl: './employee-leave-list.component.html',
  styleUrls: ['./employee-leave-list.component.scss']
})
export class EmployeeLeaveListComponent {
  leaveRequests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];
  selectedType: string = '';
  selectedRequest: LeaveRequest | null = null;

  leaveTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'อื่น ๆ'];

  ngOnInit(): void {
    // ตัวอย่างข้อมูล
    this.leaveRequests = [
      {
        employeeName: 'สมชาย ใจดี',
        type: 'ลาป่วย',
        startDate: '2025-04-10',
        endDate: '2025-04-12',
        status: 'อนุมัติแล้ว',
        reason: 'ไม่สบาย มีไข้'
      },
      {
        employeeName: 'สมหญิง รักดี',
        type: 'ลากิจ',
        startDate: '2025-04-15',
        endDate: '2025-04-15',
        status: 'รออนุมัติ',
        reason: 'ไปทำธุระส่วนตัว'
      }
    ];

    this.filteredRequests = this.leaveRequests;
  }

  filterRequests() {
    if (this.selectedType) {
      this.filteredRequests = this.leaveRequests.filter(r => r.type === this.selectedType);
    } else {
      this.filteredRequests = this.leaveRequests;
    }
  }

  openModal(request: LeaveRequest) {
    this.selectedRequest = request;
  }

  closeModal() {
    this.selectedRequest = null;
  }

  exportToPDF() {
    const doc = new jsPDF();
    
    // เพิ่มฟอนต์ภาษาไทย
    doc.addFont('assets/fonts/Sarabun-Regular.ttf', 'Sarabun', 'normal');
    doc.setFont('Sarabun', 'normal'); // ใช้ฟอนต์ภาษาไทย

    // กำหนดขนาดฟอนต์
    doc.setFontSize(14);

    // สร้างตาราง PDF
    autoTable(doc, {
      head: [['ชื่อพนักงาน', 'ประเภทลา', 'วันที่เริ่ม', 'วันที่สิ้นสุด', 'สถานะ']],
      body: this.filteredRequests.map(r => [
        r.employeeName,
        r.type,
        r.startDate,
        r.endDate,
        r.status
      ])
    });

    // บันทึกไฟล์ PDF
    doc.save('leave-requests.pdf');
  }
}
