
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, Ticket, Monitor } from 'lucide-react';
import { MonitoringPanel } from './MonitoringPanel';
import { TicketingPanel } from './TicketingPanel';
import IntegrationConfig from './IntegrationConfig';
import { useToast } from '@/hooks/use-toast';

export interface Alert {
  id: string;
  monitorName: string;
  status: 'down' | 'trouble' | 'up';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  ticketId?: string;
  location: string;
  responseTime?: number;
}

export interface ServiceTicket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  alertId?: string;
  description: string;
  slaStatus: 'on-track' | 'at-risk' | 'breached';
}

const UnifiedDashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [autoTicketEnabled, setAutoTicketEnabled] = useState(true);
  const { toast } = useToast();

  // Initialize with sample data
  useEffect(() => {
    const sampleAlerts: Alert[] = [
      {
        id: 'alert-1',
        monitorName: 'Production Web Server',
        status: 'down',
        severity: 'critical',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: 'Server unreachable - Connection timeout',
        location: 'US East',
        ticketId: 'INC-2024-001'
      },
      {
        id: 'alert-2',
        monitorName: 'API Gateway',
        status: 'trouble',
        severity: 'high',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        description: 'High response time detected',
        location: 'EU West',
        responseTime: 2500
      },
      {
        id: 'alert-3',
        monitorName: 'Database Server',
        status: 'up',
        severity: 'low',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        description: 'All systems operational',
        location: 'US West',
        responseTime: 145
      }
    ];

    const sampleTickets: ServiceTicket[] = [
      {
        id: 'INC-2024-001',
        title: 'Production Web Server Down',
        status: 'in-progress',
        priority: 'critical',
        assignee: 'John Smith',
        createdAt: new Date(Date.now() - 300000).toISOString(),
        updatedAt: new Date(Date.now() - 60000).toISOString(),
        alertId: 'alert-1',
        description: 'Auto-generated from Site24x7 alert: Server unreachable',
        slaStatus: 'at-risk'
      },
      {
        id: 'INC-2024-002',
        title: 'Email Service Latency',
        status: 'open',
        priority: 'medium',
        assignee: 'Sarah Johnson',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        description: 'User reported slow email delivery',
        slaStatus: 'on-track'
      }
    ];

    setAlerts(sampleAlerts);
    setTickets(sampleTickets);
  }, []);

  const createTicketFromAlert = (alert: Alert) => {
    if (alert.ticketId) {
      toast({
        title: "Ticket Already Exists",
        description: `Ticket ${alert.ticketId} is already linked to this alert.`,
      });
      return;
    }

    const newTicketId = `INC-2024-${String(tickets.length + 3).padStart(3, '0')}`;
    const newTicket: ServiceTicket = {
      id: newTicketId,
      title: `${alert.monitorName} - ${alert.status.toUpperCase()}`,
      status: 'open',
      priority: alert.severity,
      assignee: 'Auto-assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      alertId: alert.id,
      description: `Auto-generated from Site24x7 alert: ${alert.description}`,
      slaStatus: 'on-track'
    };

    // Update alert with ticket ID
    const updatedAlerts = alerts.map(a => 
      a.id === alert.id ? { ...a, ticketId: newTicketId } : a
    );

    setTickets([newTicket, ...tickets]);
    setAlerts(updatedAlerts);

    toast({
      title: "Ticket Created",
      description: `Freshservice ticket ${newTicketId} created successfully.`,
    });
  };

  const resolveAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'up' as const } : alert
    );
    
    // If there's a linked ticket, update it too
    const alert = alerts.find(a => a.id === alertId);
    if (alert?.ticketId) {
      const updatedTickets = tickets.map(ticket => 
        ticket.id === alert.ticketId ? { 
          ...ticket, 
          status: 'resolved' as const,
          updatedAt: new Date().toISOString()
        } : ticket
      );
      setTickets(updatedTickets);
    }

    setAlerts(updatedAlerts);
    toast({
      title: "Alert Resolved",
      description: "Alert status updated and linked ticket synchronized.",
    });
  };

  const getDashboardStats = () => {
    const criticalAlerts = alerts.filter(a => a.status !== 'up' && a.severity === 'critical').length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const slaBreaches = tickets.filter(t => t.slaStatus === 'breached').length;
    const upMonitors = alerts.filter(a => a.status === 'up').length;

    return { criticalAlerts, openTickets, slaBreaches, upMonitors };
  };

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <Monitor className="text-blue-600" />
            Unified IT Operations Platform
          </h1>
          <p className="text-slate-600 text-lg">
            Site24x7 Monitoring + Freshservice ITSM Integration
          </p>
        </div>

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

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">SLA Breaches</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.slaBreaches}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Healthy Monitors</p>
                  <p className="text-2xl font-bold text-green-700">{stats.upMonitors}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Unified Dashboard</TabsTrigger>
            <TabsTrigger value="monitoring">Site24x7 Monitoring</TabsTrigger>
            <TabsTrigger value="ticketing">Freshservice ITSM</TabsTrigger>
            <TabsTrigger value="config">Integration Config</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.status === 'down' ? 'destructive' : alert.status === 'trouble' ? 'default' : 'secondary'}>
                            {alert.status.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alert.monitorName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()} • {alert.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {alert.ticketId ? (
                          <Badge variant="outline" className="text-xs">
                            {alert.ticketId}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => createTicketFromAlert(alert)}>
                            Create Ticket
                          </Button>
                        )}
                        {alert.status !== 'up' && (
                          <Button size="sm" variant="default" onClick={() => resolveAlert(alert.id)}>
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Active Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.filter(t => t.status !== 'closed').slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.priority === 'critical' ? 'destructive' : 'default'}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{ticket.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Assigned to: {ticket.assignee}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Status: {ticket.status}
                          </span>
                          <Badge 
                            variant={ticket.slaStatus === 'breached' ? 'destructive' : ticket.slaStatus === 'at-risk' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            SLA: {ticket.slaStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {ticket.alertId && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <MonitoringPanel 
              alerts={alerts} 
              onCreateTicket={createTicketFromAlert}
              onResolveAlert={resolveAlert}
            />
          </TabsContent>

          <TabsContent value="ticketing">
            <TicketingPanel tickets={tickets} alerts={alerts} />
          </TabsContent>

          <TabsContent value="config">
            <IntegrationConfig 
              autoTicketEnabled={autoTicketEnabled}
              onToggleAutoTicket={setAutoTicketEnabled}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
