
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  Plus, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  CheckCircle,
  Activity,
  Server,
  Database,
  Globe,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface DashboardStats {
  openIncidents: number;
  serviceRequests: number;
  avgResolutionTime: string;
  activeAssets: number;
  trends: {
    incidents: 'up' | 'down' | 'neutral';
    requests: 'up' | 'down' | 'neutral';
    resolution: 'up' | 'down' | 'neutral';
    assets: 'up' | 'down' | 'neutral';
  };
}

interface RecentTicket {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo: string;
}

interface ServiceHealth {
  service: string;
  status: 'Operational' | 'Degraded' | 'Down';
}

const ITSMDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stats: DashboardStats = {
    openIncidents: 23,
    serviceRequests: 15,
    avgResolutionTime: '4.2h',
    activeAssets: 1247,
    trends: {
      incidents: 'up',
      requests: 'up', 
      resolution: 'down',
      assets: 'up'
    }
  };

  const recentTickets: RecentTicket[] = [
    {
      id: '#INC001234',
      title: 'Email server not responding',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'John Smith'
    },
    {
      id: '#REQ001235',
      title: 'New software installation request',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: '#INC001236',
      title: 'Network connectivity issues',
      priority: 'Critical',
      status: 'Open',
      assignedTo: 'Mike Davis'
    },
    {
      id: '#REQ001237',
      title: 'Hardware upgrade request',
      priority: 'Low',
      status: 'Resolved',
      assignedTo: 'Lisa Wilson'
    }
  ];

  const serviceHealth: ServiceHealth[] = [
    { service: 'Email Services', status: 'Operational' },
    { service: 'Network Infrastructure', status: 'Degraded' },
    { service: 'Database Servers', status: 'Operational' },
    { service: 'Web Applications', status: 'Operational' },
    { service: 'File Storage', status: 'Down' },
    { service: 'Video Conferencing', status: 'Operational' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'default';
      case 'Resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'secondary';
      case 'Degraded': return 'default';
      case 'Down': return 'destructive';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'neutral': return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendText = (type: string, trend: 'up' | 'down' | 'neutral') => {
    const isPositive = (type === 'resolution' && trend === 'down') || 
                      (type !== 'resolution' && trend === 'up');
    
    switch (type) {
      case 'incidents': return trend === 'up' ? '+2 from yesterday' : '-1 from yesterday';
      case 'requests': return trend === 'up' ? '+5 this week' : '-2 this week';
      case 'resolution': return trend === 'down' ? '-0.5h from last week' : '+0.3h from last week';
      case 'assets': return trend === 'up' ? '+12 this month' : '-5 this month';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ITSM Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your IT services.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search tickets, assets, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Open Incidents</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{stats.openIncidents}</span>
                  {getTrendIcon(stats.trends.incidents)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{getTrendText('incidents', stats.trends.incidents)}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Service Requests</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{stats.serviceRequests}</span>
                  {getTrendIcon(stats.trends.requests)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{getTrendText('requests', stats.trends.requests)}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Resolution Time</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{stats.avgResolutionTime}</span>
                  {getTrendIcon(stats.trends.resolution)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{getTrendText('resolution', stats.trends.resolution)}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Assets</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">{stats.activeAssets}</span>
                  {getTrendIcon(stats.trends.assets)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{getTrendText('assets', stats.trends.assets)}</p>
              </div>
              <Server className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Recent Tickets
              <span className="text-sm font-normal text-gray-500">
                Latest incidents and service requests requiring attention
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-blue-600">{ticket.id}</span>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{ticket.title}</h4>
                    <p className="text-sm text-gray-600">Assigned to {ticket.assignedTo}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Service Health
              <span className="text-sm font-normal text-gray-500">
                Current status of key IT services
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceHealth.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {service.service === 'Email Services' && <Wrench className="h-5 w-5 text-gray-500" />}
                  {service.service === 'Network Infrastructure' && <Globe className="h-5 w-5 text-gray-500" />}
                  {service.service === 'Database Servers' && <Database className="h-5 w-5 text-gray-500" />}
                  {service.service === 'Web Applications' && <Globe className="h-5 w-5 text-gray-500" />}
                  {service.service === 'File Storage' && <HardDrive className="h-5 w-5 text-gray-500" />}
                  {service.service === 'Video Conferencing' && <Activity className="h-5 w-5 text-gray-500" />}
                  <span className="font-medium">{service.service}</span>
                </div>
                <Badge variant={getServiceStatusColor(service.status)}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ITSMDashboard;
