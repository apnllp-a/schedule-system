// src/app/models/schedule-pattern.model.ts
export interface WorkingDay {
    day: string;        // Monday…Sunday
    startTime: string;  // "08:00"
    endTime: string;    // "17:00"
  }
  
  export interface SchedulePattern {
    _id: string;
    name: string;
    weekly: boolean;
    workingDays?: WorkingDay[];
  }
  