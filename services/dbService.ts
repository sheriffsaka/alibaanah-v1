
import { Student, AppointmentSlot, ArabicLevel, SystemConfig, UserRole, AdminUser, NotificationLog } from '../types';

// Mock initial data
const MOCK_SLOTS: AppointmentSlot[] = [
  { id: '1', date: '2024-06-01', startTime: '09:00', endTime: '10:30', capacity: 10, enrolledCount: 5, gender: 'Male' },
  { id: '2', date: '2024-06-01', startTime: '09:00', endTime: '10:30', capacity: 15, enrolledCount: 8, gender: 'Female' },
  { id: '3', date: '2024-06-01', startTime: '11:00', endTime: '12:30', capacity: 10, enrolledCount: 10, gender: 'Male' },
  { id: '4', date: '2024-06-01', startTime: '11:00', endTime: '12:30', capacity: 15, enrolledCount: 7, gender: 'Female' },
  { id: '5', date: '2024-06-02', startTime: '09:00', endTime: '10:30', capacity: 10, enrolledCount: 1, gender: 'Male' },
  { id: '6', date: '2024-06-02', startTime: '09:00', endTime: '10:30', capacity: 15, enrolledCount: 0, gender: 'Female' },
];

const MOCK_ADMINS: AdminUser[] = [
  { id: 'admin-1', username: 'superadmin', role: UserRole.SUPER_ADMIN, active: true },
  { id: 'admin-2', username: 'desk1', role: UserRole.FRONT_DESK, active: true },
];

class DBService {
  private students: Student[] = [];
  private slots: AppointmentSlot[] = [...MOCK_SLOTS];
  private admins: AdminUser[] = [...MOCK_ADMINS];
  private notificationLogs: NotificationLog[] = [];
  private config: SystemConfig = {
    maxDailyCapacity: 200,
    maxGroupSize: 15,
    registrationOpen: true,
    reminders: {
      confirmationEmail: true,
      twentyFourHourEmail: true,
      dayOfEmail: false,
    }
  };

  constructor() {
    const saved = localStorage.getItem('ibaanah_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.students = parsed.students || [];
      this.slots = parsed.slots || [...MOCK_SLOTS];
      this.config = { ...this.config, ...(parsed.config || {}) };
      this.notificationLogs = parsed.notificationLogs || [];
    } else {
       this.persist();
    }
  }

  private persist() {
    localStorage.setItem('ibaanah_db', JSON.stringify({
      students: this.students,
      slots: this.slots,
      config: this.config,
      notificationLogs: this.notificationLogs,
    }));
  }

  getCurrentUser(): AdminUser {
    // In a real app, this would involve session/token management.
    // For this mock service, we'll just return the superadmin.
    return this.admins[0];
  }

  getSlots() {
    return this.slots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addSlot(slotData: Omit<AppointmentSlot, 'id' | 'enrolledCount'>): AppointmentSlot {
    const newSlot: AppointmentSlot = {
      ...slotData,
      id: `slot-${Date.now()}`,
      enrolledCount: 0,
    };
    this.slots.push(newSlot);
    this.persist();
    return newSlot;
  }

  updateSlot(id: string, updates: Partial<AppointmentSlot>): AppointmentSlot {
    const slot = this.getSlotById(id);
    if (!slot) throw new Error("Slot not found");
    Object.assign(slot, updates);
    this.persist();
    return slot;
  }

  deleteSlot(id: string): void {
    const slot = this.getSlotById(id);
    if (!slot) throw new Error("Slot not found");
    if (slot.enrolledCount > 0) throw new Error("Cannot delete a slot with enrolled students.");
    this.slots = this.slots.filter(s => s.id !== id);
    this.persist();
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
    if (slot.gender !== data.gender) throw new Error("Gender does not match the selected slot.");
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
    
    // Simulate sending confirmation email
    if (this.config.reminders.confirmationEmail) {
      this.addNotificationLog({
        type: 'Confirmation',
        recipient: newStudent.email,
        status: 'Sent'
      });
    }

    return newStudent;
  }
  
  private addNotificationLog(logData: Omit<NotificationLog, 'id' | 'sentAt'>) {
    const newLog: NotificationLog = {
      ...logData,
      id: `log-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
    this.notificationLogs.unshift(newLog); // Add to beginning
    if (this.notificationLogs.length > 50) { // Keep log size manageable
      this.notificationLogs.pop();
    }
    this.persist();
  }

  sendTestNotification(email: string) {
    this.addNotificationLog({ type: 'Test', recipient: email, status: 'Sent' });
  }

  getNotificationLogs() {
    return this.notificationLogs;
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

    const maleCount = this.students.filter(s => s.gender === 'Male').length;
    const femaleCount = this.students.filter(s => s.gender === 'Female').length;

    return {
      total,
      checkedIn,
      booked: total - checkedIn,
      levelCounts,
      todayExpected: this.students.length, // Simplification for demo
      maleCount,
      femaleCount
    };
  }

  getAdmins() { return this.admins; }

  addAdmin(data: Omit<AdminUser, 'id'>): AdminUser {
    const newUser: AdminUser = {
      ...data,
      id: `admin-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.admins.push(newUser);
    return newUser;
  }

  updateAdmin(id: string, updates: Partial<AdminUser>): AdminUser {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) throw new Error("Admin user not found");
    Object.assign(admin, updates);
    return admin;
  }

  getConfig() { return this.config; }
  
  updateConfig(newConfig: Partial<SystemConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.persist();
  }
}

export const db = new DBService();