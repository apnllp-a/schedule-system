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


  exportLeaveFormToPDF() {
    if (!this.selectedRequest) return;

    const doc = new jsPDF();

    // ฟอนต์ภาษาไทย
    doc.addFont('assets/fonts/Sarabun-Regular.ttf', 'Sarabun', 'normal');
    doc.setFont('Sarabun', 'normal');

    const pageWidth = doc.internal.pageSize.getWidth();

    // หัวเรื่อง - ใบขอลางาน (กึ่งกลาง)
    doc.setFontSize(22);
    doc.setTextColor('#000');
    doc.text(`ประเภท ${this.selectedRequest.type}`, pageWidth / 2, 20, { align: 'center' });

    // วันที่ (มุมขวาบน)
    const today = new Date();
    const thaiDate = today.toLocaleDateString('th-TH', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    doc.setFontSize(12);
    doc.text(`วันที่ ${thaiDate}`, pageWidth - 14, 30, { align: 'right' });

    // เรียน + เรื่อง
    doc.setFontSize(14);
    let cursorY = 45;
    doc.text('เรียน  หัวหน้างาน/ผู้จัดการฝ่ายที่เกี่ยวข้อง', 14, cursorY);
    cursorY += 10;
    doc.text('เรื่อง  ขออนุญาตลางาน', 14, cursorY);
    cursorY += 15;

    // เนื้อความแบบเต็มบรรทัด
    const leaveDays = this.calculateLeaveDays(this.selectedRequest.startDate, this.selectedRequest.endDate);

    const lines = [
      `ข้าพเจ้า นาย/นาง/นางสาว ${this.selectedRequest.employeeName} มีความประสงค์จะขอลางาน`,
      `ตั้งแต่วันที่ ${this.selectedRequest.startDate} ถึงวันที่ ${this.selectedRequest.endDate} รวมระยะเวลา ${leaveDays} วัน`,
      `เนื่องจาก ${this.selectedRequest.reason}`,
      `จึงเรียนมาเพื่อขออนุญาตลางานในวันและเวลาดังกล่าว และจะกลับมาปฏิบัติงานตามปกติในวันถัดไป`,
      `จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ`
    ];

    doc.setFontSize(13);
    const lineSpacing = 10;
    lines.forEach(line => {
      doc.text(line, 20, cursorY);
      cursorY += lineSpacing;
    });

    // ช่องว่างก่อนลายเซ็น
    cursorY += 20;

    // ลายเซ็นผู้ขอลา
    doc.text('ลงชื่อ.........................................................', pageWidth - 90, cursorY);
    cursorY += 10;
    doc.text(`( ${this.selectedRequest.employeeName} )`, pageWidth - 90, cursorY);
    cursorY += 10;
    doc.text('ผู้ขอลา', pageWidth - 90, cursorY);

    // ช่องว่างก่อนลายเซ็นผู้อนุมัติ
    cursorY += 30;

    // ลายเซ็นผู้อนุมัติ
    // doc.text('ลงชื่อ.........................................................', 20, cursorY);
    // cursorY += 10;
    // doc.text('(.........................................................)', 25, cursorY);
    // cursorY += 10;
    // doc.text('ผู้อนุมัติ', 20, cursorY);

    // บันทึก PDF
    const fileName = `ใบขอลางาน_${this.selectedRequest.employeeName}_${today.toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }



  // ฟังก์ชันคำนวณจำนวนวันลาง่ายๆ (ไม่รวมวันหยุด)
  calculateLeaveDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // รวมวันแรกและวันสุดท้าย
    return diffDays;
  }



}
