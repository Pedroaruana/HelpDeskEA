export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'hardware' | 'software' | 'network' | 'access' | 'other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  requester: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Technician {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
  avgResolutionHours: number;
}
