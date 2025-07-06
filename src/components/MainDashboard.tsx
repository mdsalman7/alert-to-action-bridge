import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, Ticket, Server, LogOut, Users, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, InfrastructureResource } from '@/types/infrastructure';
import { Ticket as TicketType } from '@/types/tickets';
import UserManagement from './UserManagement';
import InfrastructureManagement from './InfrastructureManagement';
import TicketSystem from './TicketSystem';
import AlertsPanel from './AlertsPanel';
import AdminAlertsHierarchy from './AdminAlertsHierarchy';
import CustomerTicketSystem from './CustomerTicketSystem';
import GroupManagement from './GroupManagement';
import IntegrationSettings from './IntegrationSettings';
import CustomerManagement from './CustomerManagement';

const MainDashboard = () => {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [resources, setResources] = useState<InfrastructureResource[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const sampleAlerts: Alert[] = [
      {
        id: 'alert-1',
        resourceId: 'res-1',
        resourceName: 'Production Web Server',
        severity: 'critical',
        status: 'active',
        message: 'High CPU usage detected (95%)',
        assignedUsers: user?.role === 'super-user' ? [user.id] : [],
        createdAt: new Date(Date.now() - 300000).toISOString(),
        ticketId: 'ticket-1'
      }
    ];

    const sampleTickets: TicketType[] = [
      {
        id: 'INC-3541',
        title: 'High CPU Usage - Production Web Server',
        description: 'Auto-generated from infrastructure alert: High CPU usage detected',
        status: 'open',
        priority: 'critical',
        category: 'alert-incident',
        assignedTo: user?.id || '',
        assignedBy: 'system',
        alertId: 'alert-1',
        resourceId: 'res-1',
        customerId: 'customer-1',
        customerName: 'TechCorp Solutions',
        group: 'Group A',
        company: 'TechCorp Solutions',
        kekaId: 'KEKA-001',
        state: 'overdue',
        requester: 'Saravanakumar R',
        createdAt: new Date(Date.now() - 300000).toISOString(),
        updatedAt: new Date(Date.now() - 300000).toISOString(),
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        requestedItems: [
          {
            id: 'item-1',
            name: 'Server Performance Analysis',
            description: 'Detailed analysis of server performance metrics',
            stage: 'requested',
            features: ['CPU monitoring', 'Memory analysis', 'Disk I/O tracking']
          }
        ],
        timeTracking: [
          {
            id: 'time-1',
            userId: 'user-1',
            userName: 'Harish Murugesan',
            duration: '01h 06m',
            description: 'Initial investigation',
            billable: true,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 'time-2',
            userId: 'user-2',
            userName: 'Joshua Christian',
            duration: '00h 03m',
            description: 'Status update',
            billable: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        comments: []
      },
      {
        id: 'SR-441',
        title: 'Request for Adobe Illustrator CC',
        description: 'I need adobe illustration for a project',
        status: 'open',
        priority: 'medium',
        category: 'change-request',
        assignedTo: '',
        assignedBy: 'system',
        customerId: 'customer-2',
        customerName: 'Digital Creative Agency',
        group: 'IT Support',
        company: 'Digital Creative Agency',
        kekaId: 'KEKA-002',
        state: 'overdue',
        requester: 'Keerthana Devota',
        createdAt: new Date(Date.now() - 1641600000).toISOString(),
        updatedAt: new Date(Date.now() - 1641600000).toISOString(),
        requestedItems: [
          {
            id: 'item-2',
            name: 'Adobe Illustrator CC',
            description: 'The industry-standard vector graphics software used worldwide by designers to create digital graphics, illustrations, and typography for all kinds of media: print, web, interactive, video, and mobile.',
            stage: 'requested',
            features: ['Touch Type Tool', 'Vector graphics creation', '20GB cloud storage']
          }
        ],
        comments: []
      },
      {
        id: 'INC-3540',
        title: 'Network Connectivity Issues',
        description: 'Users reporting intermittent network connectivity issues',
        status: 'in-progress',
        priority: 'high',
        category: 'alert-incident',
        assignedTo: user?.id || '',
        assignedBy: 'admin',
        customerId: 'customer-1',
        customerName: 'TechCorp Solutions',
        group: 'Network Team',
        company: 'TechCorp Solutions',
        state: 'on-time',
        requester: 'Rahul RP',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        comments: []
      },
      {
        id: 'INC-3508',
        title: 'Email Service Disruption',
        description: 'Email service experiencing delays and delivery issues',
        status: 'resolved',
        priority: 'medium',
        category: 'alert-incident',
        assignedTo: '',
        assignedBy: 'system',
        customerId: 'customer-3',
        customerName: 'Global Enterprises Ltd',
        group: 'Email Support',
        company: 'Global Enterprises Ltd',
        state: 'on-time',
        requester: 'Meher Jammula',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        resolvedAt: new Date(Date.now() - 3600000).toISOString(),
        comments: []
      }
    ];

    setAlerts(sampleAlerts);
    setTickets(sampleTickets);
  }, [user]);

  const getDashboardStats = () => {
    const criticalAlerts = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const healthyResources = resources.filter(r => r.status === 'healthy').length;

    return { criticalAlerts, openTickets, resolvedTickets, healthyResources };
  };

  const stats = getDashboardStats();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">IT Operations Platform</h1>
              <p className="text-slate-600">Welcome back, {user.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="capitalize">
                {user.role.replace('-', ' ')}
              </Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-700">{stats.criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.openTickets}</p>
                </div>
                <Ticket className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-700">{stats.resolvedTickets}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Healthy Resources</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.healthyResources}</p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">
              {user.role === 'administrator' ? 'Customer Alerts' : 'Alerts'}
            </TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            {user.role === 'administrator' && <TabsTrigger value="users">Users</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alert.resourceName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    My Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.filter(t => t.assignedTo === user.id).slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.priority === 'critical' ? 'destructive' : 'default'}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{ticket.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Status: {ticket.status}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            {user.role === 'administrator' ? (
              <AdminAlertsHierarchy />
            ) : (
              <AlertsPanel user={user} alerts={alerts} />
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <CustomerTicketSystem user={user} tickets={tickets} setTickets={setTickets} />
          </TabsContent>

          <TabsContent value="infrastructure">
            {user.role === 'administrator' ? (
              <Tabs defaultValue="resources" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>
                <TabsContent value="resources">
                  <InfrastructureManagement user={user} />
                </TabsContent>
                <TabsContent value="customers">
                  <CustomerManagement />
                </TabsContent>
              </Tabs>
            ) : (
              <InfrastructureManagement user={user} />
            )}
          </TabsContent>

          {user.role === 'administrator' && (
            <TabsContent value="users">
              <UserManagement currentUser={user} />
            </TabsContent>
          )}

          <TabsContent value="settings">
            <Tabs defaultValue="account" className="space-y-4">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                {user.role === 'administrator' && <TabsTrigger value="integrations">Integrations</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-gray-600">{user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <p className="text-gray-600 capitalize">{user.role.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Login</label>
                        <p className="text-gray-600">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {user.role === 'administrator' && (
                <TabsContent value="integrations">
                  <IntegrationSettings />
                </TabsContent>
              )}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainDashboard;
