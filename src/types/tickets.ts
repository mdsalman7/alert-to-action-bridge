
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'alert-incident' | 'maintenance-task' | 'change-request' | 'general';
  assignedTo: string;
  assignedBy: string;
  alertId?: string;
  resourceId?: string;
  projectId?: string;
  customerId: string;
  customerName: string;
  group?: string;
  company?: string;
  kekaId?: string;
  state: 'overdue' | 'on-time' | 'pending';
  requestedItems?: RequestedItem[];
  conversations?: TicketConversation[];
  timeTracking?: TimeEntry[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  dueDate?: string;
  requester: string;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface RequestedItem {
  id: string;
  name: string;
  description: string;
  stage: 'requested' | 'approved' | 'delivered' | 'rejected';
  features?: string[];
}

export interface TicketConversation {
  id: string;
  userId: string;
  userName: string;
  message: string;
  type: 'reply' | 'forward' | 'note';
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  duration: string;
  description: string;
  billable: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  ticketCount: number;
  openTickets: number;
  overdueTickets: number;
}
