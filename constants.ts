import { User, UserRole, Batch, AttendanceRecord, Task, Submission, Payment, Placement } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Admin', email: 'admin@edumanage.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'u2', name: 'John Trainer', email: 'john@edumanage.com', role: UserRole.TRAINER, avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'u3', name: 'Emily Educator', email: 'emily@edumanage.com', role: UserRole.TRAINER, avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'u4', name: 'Mike Student', email: 'mike@edumanage.com', role: UserRole.STUDENT, avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 'u5', name: 'Lisa Learner', email: 'lisa@edumanage.com', role: UserRole.STUDENT, avatar: 'https://picsum.photos/100/100?random=5' },
  { id: 'u6', name: 'Tom Techie', email: 'tom@edumanage.com', role: UserRole.STUDENT, avatar: 'https://picsum.photos/100/100?random=6' },
];

export const MOCK_BATCHES: Batch[] = [
  { id: 'b1', name: 'Spring Boot 101', trainerId: 'u2', studentIds: ['u4', 'u5'], schedule: 'Mon-Wed-Fri 10:00 AM', course: 'Java Backend' },
  { id: 'b2', name: 'React Mastery', trainerId: 'u3', studentIds: ['u5', 'u6'], schedule: 'Tue-Thu 2:00 PM', course: 'Frontend Dev' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', batchId: 'b1', title: 'Build a REST API', description: 'Create a CRUD API using Spring Data JPA.', dueDate: '2023-11-15', assignedBy: 'u2' },
  { id: 't2', batchId: 'b2', title: 'Component Composition', description: 'Build a dashboard layout using composed components.', dueDate: '2023-11-20', assignedBy: 'u3' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', batchId: 'b1', studentId: 'u4', date: '2023-11-01', status: 'PRESENT' },
  { id: 'a2', batchId: 'b1', studentId: 'u5', date: '2023-11-01', status: 'PRESENT' },
  { id: 'a3', batchId: 'b1', studentId: 'u4', date: '2023-11-03', status: 'ABSENT' },
  { id: 'a4', batchId: 'b1', studentId: 'u5', date: '2023-11-03', status: 'PRESENT' },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', taskId: 't1', studentId: 'u4', submittedAt: '2023-11-14T10:00:00Z', grade: 85, feedback: 'Good structure, but missed one endpoint.' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', studentId: 'u4', amount: 5000, date: '2023-10-01', status: 'PAID', type: 'TUITION' },
  { id: 'p2', studentId: 'u5', amount: 5000, date: '2023-10-05', status: 'PENDING', type: 'TUITION' },
  { id: 'p3', studentId: 'u6', amount: 2500, date: '2023-10-10', status: 'OVERDUE', type: 'EXAM' },
];

export const MOCK_PLACEMENTS: Placement[] = [
  { id: 'pl1', studentId: 'u4', company: 'TechSolutions Inc', role: 'Java Developer', package: '8 LPA', status: 'OFFER_RECEIVED', date: '2023-11-10' },
  { id: 'pl2', studentId: 'u6', company: 'WebWizards', role: 'Frontend Engineer', package: '12 LPA', status: 'INTERVIEWING', date: '2023-11-12' },
];