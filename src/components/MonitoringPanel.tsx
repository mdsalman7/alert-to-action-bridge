
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Server, Globe, Database, Wifi, TicketPlus, CheckCircle } from 'lucide-react';
import { Alert } from './UnifiedDashboard';

interface MonitoringPanelProps {
  alerts: Alert[];
  onCreateTicket: (alert: Alert) => void;
  onResolveAlert: (alertId: string) => void;
}

const MonitoringPanel: React.FC<MonitoringPanelProps> = ({ 
  alerts, 
  onCreateTicket, 
  onResolveAlert 
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getMonitorIcon = (monitorName: string) => {
    if (monitorName.toLowerCase().includes('web') || monitorName.toLowerCase().includes('api')) {
      return <Globe className="h-5 w-5" />;
    }
    if (monitorName.toLowerCase().includes('database')) {
      return <Database className="h-5 w-5" />;
    }
    if (monitorName.toLowerCase().includes('server')) {
      return <Server className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'down': return 'bg-red-500';
      case 'trouble': return 'bg-yellow-500';
      case 'up': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch = alert.monitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const monitorStats = {
    total: alerts.length,
    up: alerts.filter(a => a.status === 'up').length,
    trouble: alerts.filter(a => a.status === 'trouble').length,
    down: alerts.filter(a => a.status === 'down').length
  };

  return (
    <div className="space-y-6">
      {/* Monitor Stats Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Site24x7 Monitor Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{monitorStats.total}</div>
              <div className="text-sm text-gray-600">Total Monitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{monitorStats.up}</div>
              <div className="text-sm text-gray-600">Up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{monitorStats.trouble}</div>
              <div className="text-sm text-gray-600">Trouble</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{monitorStats.down}</div>
              <div className="text-sm text-gray-600">Down</div>
            </div>
          </div>

          {/* Visual Heatmap */}
          <div className="grid grid-cols-8 gap-1">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`w-8 h-8 rounded ${getStatusColor(alert.status)} flex items-center justify-center`}
                title={`${alert.monitorName} - ${alert.status}`}
              >
                <span className="text-xs text-white font-bold">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Monitor Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Monitors</label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                  <SelectItem value="trouble">Trouble</SelectItem>
                  <SelectItem value="up">Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Severity</label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitor List */}
      <Card>
        <CardHeader>
          <CardTitle>Monitor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getMonitorIcon(alert.monitorName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{alert.monitorName}</h3>
                        <Badge 
                          variant={alert.status === 'down' ? 'destructive' : alert.status === 'trouble' ? 'default' : 'secondary'}
                        >
                          {alert.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.ticketId && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Ticket: {alert.ticketId}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{alert.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Location: {alert.location}</span>
                        <span>Last Updated: {new Date(alert.timestamp).toLocaleString()}</span>
                        {alert.responseTime && (
                          <span>Response Time: {alert.responseTime}ms</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {!alert.ticketId && alert.status !== 'up' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onCreateTicket(alert)}
                        className="flex items-center gap-1"
                      >
                        <TicketPlus className="h-4 w-4" />
                        Raise Ticket
                      </Button>
                    )}
                    
                    {alert.status !== 'up' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => onResolveAlert(alert.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Resolved
                      </Button>
                    )}
                    
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { MonitoringPanel };
