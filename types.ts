
export enum ArabicLevel {
  BEGINNER = 'Beginner',
  ELEMENTARY = 'Elementary',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  FRONT_DESK = 'Front Desk'
}

export interface Student {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female';
  address: string;
  arabicLevel: ArabicLevel;
  preferredDate: string;
  registrationCode: string;
  slotId: string;
  groupNumber: string;
  checkedIn: boolean;
  checkInTime?: string;
  createdAt: string;
}

export interface AppointmentSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolledCount: number;
}

export interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
  active: boolean;
  lastLogin?: string;
}

export interface SystemConfig {
  maxDailyCapacity: number;
  maxGroupSize: number;
  registrationOpen: boolean;
}
