export enum UserRole {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  courseOrExpertise?: string; // Course for student, Expertise for trainer
}

export interface Batch {
  id: string;
  name: string;
  trainerId: string;
  studentIds: string[];
  schedule: string;
  course: string;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface Task {
  id: string;
  batchId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string; // Trainer ID
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  submittedAt: string;
  grade?: number; // 0-100
  feedback?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  type: 'TUITION' | 'EXAM' | 'OTHER';
}

export interface Placement {
  id: string;
  studentId: string;
  company: string;
  role: string;
  package: string;
  status: 'PLACED' | 'OFFER_RECEIVED' | 'INTERVIEWING';
  date: string;
}

export interface AppState {
  users: User[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  tasks: Task[];
  submissions: Submission[];
  payments: Payment[];
  placements: Placement[];
}

export interface ThemeProps {
  isDark: boolean;
  toggle: () => void;
}
