
export interface InfrastructureResource {
  id: string;
  name: string;
  type: 'aws-ec2' | 'aws-rds' | 'aws-lambda' | 'aws-ecs' | 'azure-vm' | 'gcp-compute' | 'on-premise';
  provider: 'aws' | 'azure' | 'gcp' | 'on-premise';
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  projectId: string;
  assignedUsers: string[];
  region?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  assignedUsers: string[];
  resources: string[];
  createdAt: string;
}

export interface Alert {
  id: string;
  resourceId: string;
  resourceName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved';
  message: string;
  assignedUsers: string[];
  createdAt: string;
  resolvedAt?: string;
  ticketId?: string;
}
