
import { Student, AppointmentSlot, ArabicLevel, SystemConfig, UserRole, AdminUser } from '../types';

// Mock initial data
const MOCK_SLOTS: AppointmentSlot[] = [
  { id: '1', date: '2024-06-01', startTime: '09:00', endTime: '10:30', capacity: 20, enrolledCount: 5 },
  { id: '2', date: '2024-06-01', startTime: '11:00', endTime: '12:30', capacity: 20, enrolledCount: 20 },
  { id: '3', date: '2024-06-02', startTime: '09:00', endTime: '10:30', capacity: 20, enrolledCount: 12 },
  { id: '4', date: '2024-06-02', startTime: '11:00', endTime: '12:30', capacity: 20, enrolledCount: 0 },
];

const MOCK_ADMINS: AdminUser[] = [
  { id: 'admin-1', username: 'superadmin', role: UserRole.SUPER_ADMIN, active: true },
  { id: 'admin-2', username: 'desk1', role: UserRole.FRONT_DESK, active: true },
];

class DBService {
  private students: Student[] = [];
  private slots: AppointmentSlot[] = [...MOCK_SLOTS];
  private admins: AdminUser[] = [...MOCK_ADMINS];
  private config: SystemConfig = {
    maxDailyCapacity: 200,
    maxGroupSize: 15,
    registrationOpen: true
  };

  constructor() {
    const saved = localStorage.getItem('ibaanah_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.students = parsed.students || [];
      this.slots = parsed.slots || [...MOCK_SLOTS];
    }
  }

  private persist() {
    localStorage.setItem('ibaanah_db', JSON.stringify({
      students: this.students,
      slots: this.slots
    }));
  }

  getSlots() {
    return this.slots;
  }

  getSlotById(id: string) {
    return this.slots.find(s => s.id === id);
  }

  getStudents() {
    return this.students;
  }

  registerStudent(data: Omit<Student, 'id' | 'registrationCode' | 'groupNumber' | 'checkedIn' | 'createdAt'>): Student {
    const slot = this.slots.find(s => s.id === data.slotId);
    if (!slot) throw new Error("Invalid slot");
    if (slot.enrolledCount >= slot.capacity) throw new Error("Slot full");

    const code = `AIB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const groupNum = `${data.arabicLevel.charAt(0)}${Math.floor(slot.enrolledCount / this.config.maxGroupSize) + 1}`;
    
    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      registrationCode: code,
      groupNumber: groupNum,
      checkedIn: false,
      createdAt: new Date().toISOString()
    };

    this.students.push(newStudent);
    slot.enrolledCount += 1;
    this.persist();
    return newStudent;
  }

  checkIn(code: string): Student {
    const student = this.students.find(s => s.registrationCode === code || s.phoneNumber === code);
    if (!student) throw new Error("Student not found");
    if (student.checkedIn) throw new Error("Already checked in");
    
    student.checkedIn = true;
    student.checkInTime = new Date().toISOString();
    this.persist();
    return student;
  }

  getStats() {
    const total = this.students.length;
    const checkedIn = this.students.filter(s => s.checkedIn).length;
    const levelCounts = this.students.reduce((acc, s) => {
      acc[s.arabicLevel] = (acc[s.arabicLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      checkedIn,
      booked: total - checkedIn,
      levelCounts,
      todayExpected: this.students.length // Simplification for demo
    };
  }

  getAdmins() { return this.admins; }
  getConfig() { return this.config; }
  updateConfig(newConfig: Partial<SystemConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const db = new DBService();
