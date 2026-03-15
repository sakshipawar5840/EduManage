export enum UserRole {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  STUDENT = 'STUDENT'
}

export enum Permission {
  // Admin Permissions
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  VIEW_ALL_DATA = 'VIEW_ALL_DATA',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  MANAGE_PLACEMENTS = 'MANAGE_PLACEMENTS',
  
  // Trainer Permissions
  VIEW_ASSIGNED_BATCHES = 'VIEW_ASSIGNED_BATCHES',
  MANAGE_TASKS = 'MANAGE_TASKS',
  GRADE_SUBMISSIONS = 'GRADE_SUBMISSIONS',
  MARK_ATTENDANCE = 'MARK_ATTENDANCE',
  USE_AI_ASSISTANT = 'USE_AI_ASSISTANT',
  MANAGE_QUIZZES = 'MANAGE_QUIZZES',
  UPLOAD_MATERIALS = 'UPLOAD_MATERIALS',
  
  // Student Permissions
  VIEW_OWN_TASKS = 'VIEW_OWN_TASKS',
  SUBMIT_TASKS = 'SUBMIT_TASKS',
  VIEW_OWN_ATTENDANCE = 'VIEW_OWN_ATTENDANCE',
  VIEW_OWN_PAYMENTS = 'VIEW_OWN_PAYMENTS',
  VIEW_PLACEMENTS = 'VIEW_PLACEMENTS',
  TAKE_QUIZZES = 'TAKE_QUIZZES',
  VIEW_MATERIALS = 'VIEW_MATERIALS',
  VIEW_CERTIFICATES = 'VIEW_CERTIFICATES',
  USE_STUDENT_AI = 'USE_STUDENT_AI'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_ROLES,
    Permission.VIEW_ALL_DATA,
    Permission.MANAGE_PAYMENTS,
    Permission.MANAGE_PLACEMENTS
  ],
  [UserRole.TRAINER]: [
    Permission.VIEW_ASSIGNED_BATCHES,
    Permission.MANAGE_TASKS,
    Permission.GRADE_SUBMISSIONS,
    Permission.MARK_ATTENDANCE,
    Permission.USE_AI_ASSISTANT,
    Permission.MANAGE_QUIZZES,
    Permission.UPLOAD_MATERIALS
  ],
  [UserRole.STUDENT]: [
    Permission.VIEW_OWN_TASKS,
    Permission.SUBMIT_TASKS,
    Permission.VIEW_OWN_ATTENDANCE,
    Permission.VIEW_OWN_PAYMENTS,
    Permission.VIEW_PLACEMENTS,
    Permission.TAKE_QUIZZES,
    Permission.VIEW_MATERIALS,
    Permission.VIEW_CERTIFICATES,
    Permission.USE_STUDENT_AI
  ]
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  courseOrExpertise?: string; // Course for student, Expertise for trainer
  status?: 'pending' | 'approved' | 'rejected';
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
  fileUrl?: string; // Added for PDF/file upload
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
  quizzes?: Quiz[];
  quizAttempts?: QuizAttempt[];
  studyMaterials?: StudyMaterial[];
  certificates?: Certificate[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  batchId: string;
  questions: QuizQuestion[];
  dueDate: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  total: number;
  submittedAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  batchId: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  uploadedAt: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseName: string;
  issuedDate: string;
  certificateUrl: string;
}

export interface ThemeProps {
  isDark: boolean;
  toggle: () => void;
}
