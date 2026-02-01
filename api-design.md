
# Al-Ibaanah IntakeFlow API Documentation

## Base URL
`https://api.alibaanah-intakeflow.com/v1`

## Authentication
JWT-based authentication for Admin/Staff routes.
Role-based Access Control (RBAC) enforced on middleware.

---

## 1. Public Endpoints (Enrollment)

### GET /slots
Returns available appointment slots.
- **Filter**: `?date=YYYY-MM-DD`
- **Output**: Array of `{ id, date, startTime, capacity, remaining }`

### POST /enroll
Register a new student and book a slot.
- **Body**: `{ fullName, email, phone, age, arabicLevel, slotId, ... }`
- **Logic**: 
  - Validates slot capacity.
  - Generates Registration Code.
  - Triggers confirmation email.
- **Output**: `{ studentId, registrationCode, admissionSlipUrl }`

---

## 2. Admin Endpoints (Protected)

### GET /admin/stats
Live dashboard metrics.
- **Output**: `{ totalRegistrations, todayCount, levelBreakdown: {}, slotUtilization: [] }`

### POST /admin/check-in
Mark student as arrived.
- **Body**: `{ registrationCode }`
- **Output**: `{ status: 'success', checkInTime: 'ISO' }`

### PATCH /admin/slots/:id
Manage slot capacity or availability.
- **Body**: `{ capacity, isActive }`

### GET /admin/audit-logs
History of admin actions (Super Admin only).

---

## 3. System Background Jobs
- **Daily Cleaner**: Archived completed intakes.
- **Notification Engine**: Runs every hour to send T-24h and T-0h reminders via SMTP/SMS.
