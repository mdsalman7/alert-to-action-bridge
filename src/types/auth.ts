
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'read-only' | 'super-user';
  assignedResources: string[];
  assignedProjects: string[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
