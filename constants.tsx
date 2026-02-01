
import React from 'react';

export const APP_NAME = "Al-Ibaanah IntakeFlow";
export const INSTITUTION_NAME = "Al-Ibaanah Arabic Center";
export const OFFICIAL_SITE_URL = "https://ibaanah.com/";

export const LOGO_URL = "https://res.cloudinary.com/di7okmjsx/image/upload/v1769972834/alibaanahlogo_gw0pef.png";

export const BRAND_COLORS = {
  primary: "#0d5c46", // Dark Green
  secondary: "#8b3a3a", // Red-Brown
  accent: "#f59e0b", // Amber
  light: "#f0fdf4",
  dark: "#062e23"
};

export const INTAKE_FEATURES = [
  {
    title: "Digital Appointment Booking",
    text: "Select a specific time slot for your on-campus evaluation. No more waiting in long queues.",
    icon: "fa-calendar-check"
  },
  {
    title: "Instant Admission Slips",
    text: "Receive a digital registration code and slip immediately after booking your assessment.",
    icon: "fa-file-invoice"
  },
  {
    title: "Fast-Track Check-In",
    text: "Our front desk uses QR/Code scanning for a 10-second check-in experience upon arrival.",
    icon: "fa-bolt"
  }
];

export const ASSESSMENT_FAQS = [
  {
    q: "Do I need to register on the main site first?",
    a: "Yes. Please ensure you have read the program requirements at ibaanah.com. This portal is specifically for booking your required in-person placement assessment."
  },
  {
    q: "What happens during the assessment?",
    a: "You will have a 15-minute interview with an instructor to determine your speaking, reading, and writing proficiency."
  },
  {
    q: "Can I reschedule my slot?",
    a: "Slots are limited. If you cannot attend, please contact the front desk at least 24 hours in advance."
  }
];

export const CONTACT_INFO = {
  address: "Block 12, Area 1, 7th District, Nasr City, Cairo, Egypt",
  phone: "+20 2 2270 2414",
  mobile: "+20 100 123 4567",
  email: "info@al-ibaanah.com",
  hours: "Saturday - Thursday: 8:00 AM - 4:00 PM"
};

export const WHAT_TO_BRING_CHECKLIST = [
  "Original Passport and 2 Photocopies",
  "Four passport-sized photographs (White background)",
  "Proof of initial registration from ibaanah.com",
  "Previous Arabic study certificates (if any)",
  "A printout or digital copy of your Intake Slip"
];

export const PROFICIENCY_DESCRIPTIONS: Record<string, string> = {
  Beginner: "Cannot read or write Arabic script yet.",
  Elementary: "Can read script but limited vocabulary and grammar.",
  Intermediate: "Conversational, basic understanding of Sarf/Nahw.",
  Advanced: "Fluent reading and complex grammatical understanding."
};
