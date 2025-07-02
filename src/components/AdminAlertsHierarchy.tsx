
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Users, Monitor, Settings, AlertTriangle, Server, Cloud, Database, Activity } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  totalMonitors: number;
  alertsCount: number;
}

interface InfrastructureResource {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: 'up' | 'down' | 'warning' | 'critical';
  customerId: string;
  monitorCount: number;
  upMonitors: number;
  downMonitors: number;
  warningMonitors: number;
  criticalMonitors: number;
}

interface ServiceIntegration {
  id: string;
  name: string;
  type: string;
  status: 'enabled' | 'disabled';
  count: number;
  icon: string;
}

interface MonitorDetail {
  id: string;
  name: string;
  type: string;
  status: 'up' | 'down' | 'warning';
  customerId: string;
  alertsCount: number;
  lastChecked: string;
}

interface ThresholdConfig {
  id: string;
  monitorId: string;
  parameter: string;
  warningLevel: number;
  criticalLevel: number;
  unit: string;
  currentValue: number;
}

const AdminAlertsHierarchy = () => {
  const [currentView, setCurrentView] = useState<'customers' | 'infrastructure' | 'monitors' | 'thresholds'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedResource, setSelectedResource] = useState<InfrastructureResource | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorDetail | null>(null);

  // Sample data
  const customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Acme Corporation',
      status: 'critical',
      totalMonitors: 15,
      alertsCount: 3
    },
    {
      id: 'cust-2', 
      name: 'TechStart Solutions',
      status: 'warning',
      totalMonitors: 8,
      alertsCount: 1
    },
    {
      id: 'cust-3',
      name: 'Global Industries',
      status: 'healthy',
      totalMonitors: 22,
      alertsCount: 0
    }
  ];

  const infrastructureResources: InfrastructureResource[] = [
    {
      id: 'infra-1',
      name: 'Production Environment',
      type: 'AWS Account',
      provider: 'aws',
      status: 'critical',
      customerId: 'cust-1',
      monitorCount: 8,
      upMonitors: 5,
      downMonitors: 1,
      warningMonitors: 1,
      criticalMonitors: 1
    },
    {
      id: 'infra-2',
      name: 'Web Servers Cluster',
      type: 'EC2 Instances',
      provider: 'aws',
      status: 'warning',
      customerId: 'cust-1',
      monitorCount: 4,
      upMonitors: 3,
      downMonitors: 0,
      warningMonitors: 1,
      criticalMonitors: 0
    },
    {
      id: 'infra-3',
      name: 'Database Infrastructure',
      type: 'RDS Cluster',
      provider: 'aws',
      status: 'up',
      customerId: 'cust-1',
      monitorCount: 3,
      upMonitors: 3,
      downMonitors: 0,
      warningMonitors: 0,
      criticalMonitors: 0
    }
  ];

  const serviceIntegrations: ServiceIntegration[] = [
    { id: '1', name: 'SQS Queue', type: 'messaging', status: 'enabled', count: 11, icon: '📨' },
    { id: '2', name: 'ECS Cluster Service', type: 'container', status: 'enabled', count: 8, icon: '🐳' },
    { id: '3', name: 'EBS Volume', type: 'storage', status: 'enabled', count: 1, icon: '💾' },
    { id: '4', name: 'OpenSearch', type: 'search', status: 'disabled', count: 1, icon: '🔍' },
    { id: '5', name: 'RDS Instance', type: 'database', status: 'disabled', count: 1, icon: '🗄️' },
    { id: '6', name: 'ECS Cluster', type: 'container', status: 'disabled', count: 1, icon: '🏗️' },
    { id: '7', name: 'EC2 Instance', type: 'compute', status: 'disabled', count: 1, icon: '🖥️' },
    { id: '8', name: 'OpenSearch Nodes', type: 'search', status: 'disabled', count: 0, icon: '🔍' }
  ];

  const monitors: MonitorDetail[] = [
    {
      id: 'mon-1',
      name: 'Production Web Server',
      type: 'HTTP',
      status: 'down',
      customerId: 'cust-1',
      alertsCount: 2,
      lastChecked: '2 minutes ago'
    },
    {
      id: 'mon-2',
      name: 'Database Server',
      type: 'MySQL',
      status: 'warning',
      customerId: 'cust-1',
      alertsCount: 1,
      lastChecked: '1 minute ago'
    }
  ];

  const thresholds: ThresholdConfig[] = [
    {
      id: 'thresh-1',
      monitorId: 'mon-1',
      parameter: 'Response Time',
      warningLevel: 2000,
      criticalLevel: 5000,
      unit: 'ms',
      currentValue: 6500
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
      case 'down':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'healthy':
      case 'up':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'critical':
      case 'down':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'healthy':
      case 'up':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return <Cloud className="h-5 w-5 text-orange-500" />;
      case 'azure': return <Cloud className="h-5 w-5 text-blue-500" />;
      case 'gcp': return <Cloud className="h-5 w-5 text-green-500" />;
      default: return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderCustomersView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {customers.map((customer) => (
        <Card 
          key={customer.id}
          className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${
            customer.status === 'critical' ? 'border-l-red-500' :
            customer.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'
          }`}
          onClick={() => {
            setSelectedCustomer(customer);
            setCurrentView('infrastructure');
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">{customer.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={getStatusBadgeVariant(customer.status)}>
                  {customer.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monitors</span>
                <span className="font-medium">{customer.totalMonitors}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Alerts</span>
                <Badge variant={customer.alertsCount > 0 ? 'destructive' : 'secondary'}>
                  {customer.alertsCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderInfrastructureView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setCurrentView('customers');
            setSelectedCustomer(null);
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Button>
        <span className="text-sm text-gray-500">•</span>
        <span className="font-medium">{selectedCustomer?.name}</span>
      </div>

      {/* Customer Overview Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {selectedCustomer?.name} - Service Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {serviceIntegrations.map((service) => (
              <Card key={service.id} className="text-center p-3">
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="font-medium text-sm mb-1">{service.name}</div>
                <div className="text-lg font-bold mb-2">{service.count}</div>
                <Button 
                  size="sm" 
                  variant={service.status === 'enabled' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {service.status === 'enabled' ? 'Disable Integration' : 'Enable Integration'}
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infrastructureResources
          .filter(resource => resource.customerId === selectedCustomer?.id)
          .map((resource) => (
            <Card 
              key={resource.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${
                resource.status === 'critical' ? 'border-l-red-500' :
                resource.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
              onClick={() => {
                setSelectedResource(resource);
                setCurrentView('monitors');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getProviderIcon(resource.provider)}
                    <span className="font-semibold">{resource.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium">{resource.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={getStatusBadgeVariant(resource.status)}>
                      {resource.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Monitor Status Summary */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Monitor Status</div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-green-600 font-bold">{resource.upMonitors}</div>
                        <div className="text-xs text-gray-500">Up</div>
                      </div>
                      <div>
                        <div className="text-red-600 font-bold">{resource.downMonitors}</div>
                        <div className="text-xs text-gray-500">Down</div>
                      </div>
                      <div>
                        <div className="text-yellow-600 font-bold">{resource.warningMonitors}</div>
                        <div className="text-xs text-gray-500">Warning</div>
                      </div>
                      <div>
                        <div className="text-red-800 font-bold">{resource.criticalMonitors}</div>
                        <div className="text-xs text-gray-500">Critical</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Total Monitors: {resource.monitorCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderMonitorsView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setCurrentView('infrastructure');
            setSelectedResource(null);
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Infrastructure
        </Button>
        <span className="text-sm text-gray-500">•</span>
        <span className="font-medium">{selectedCustomer?.name}</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="font-medium">{selectedResource?.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitors
          .filter(monitor => monitor.customerId === selectedCustomer?.id)
          .map((monitor) => (
            <Card 
              key={monitor.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow border-l-4 ${
                monitor.status === 'down' ? 'border-l-red-500' :
                monitor.status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
              onClick={() => {
                setSelectedMonitor(monitor);
                setCurrentView('thresholds');
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{monitor.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium">{monitor.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={getStatusBadgeVariant(monitor.status)}>
                      {monitor.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Alerts</span>
                    <Badge variant={monitor.alertsCount > 0 ? 'destructive' : 'secondary'}>
                      {monitor.alertsCount}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last checked: {monitor.lastChecked}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const renderThresholdsView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setCurrentView('monitors');
            setSelectedMonitor(null);
          }}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Monitors
        </Button>
        <span className="text-sm text-gray-500">•</span>
        <span className="font-medium">{selectedCustomer?.name}</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="font-medium">{selectedMonitor?.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {thresholds
          .filter(threshold => threshold.monitorId === selectedMonitor?.id)
          .map((threshold) => {
            const isOverCritical = threshold.currentValue > threshold.criticalLevel;
            const isOverWarning = threshold.currentValue > threshold.warningLevel;
            const status = isOverCritical ? 'critical' : isOverWarning ? 'warning' : 'normal';
            
            return (
              <Card 
                key={threshold.id}
                className={`border-l-4 ${
                  status === 'critical' ? 'border-l-red-500' :
                  status === 'warning' ? 'border-l-yellow-500' : 'border-l-green-500'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">{threshold.parameter}</span>
                    </div>
                    {status !== 'normal' && (
                      <AlertTriangle className={`h-4 w-4 ${
                        status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className={`font-bold ${
                        status === 'critical' ? 'text-red-600' :
                        status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {threshold.currentValue} {threshold.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Warning Level</span>
                        <span className="text-yellow-600 font-medium">
                          {threshold.warningLevel} {threshold.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Critical Level</span>
                        <span className="text-red-600 font-medium">
                          {threshold.criticalLevel} {threshold.unit}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Badge variant={
                        status === 'critical' ? 'destructive' :
                        status === 'warning' ? 'default' : 'secondary'
                      }>
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {currentView === 'customers' && 'Customer Alert Dashboard'}
            {currentView === 'infrastructure' && `Infrastructure - ${selectedCustomer?.name}`}
            {currentView === 'monitors' && `Monitors - ${selectedResource?.name}`}
            {currentView === 'thresholds' && `Thresholds - ${selectedMonitor?.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentView === 'customers' && renderCustomersView()}
          {currentView === 'infrastructure' && renderInfrastructureView()}
          {currentView === 'monitors' && renderMonitorsView()}
          {currentView === 'thresholds' && renderThresholdsView()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAlertsHierarchy;
