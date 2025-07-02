
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Building, Settings, Activity, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  status: 'active' | 'inactive';
  totalResources: number;
  totalMonitors: number;
  serviceIntegrations: ServiceIntegration[];
  createdAt: string;
}

interface ServiceIntegration {
  id: string;
  name: string;
  type: string;
  status: 'enabled' | 'disabled';
  count: number;
  icon: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-1',
      name: 'Acme Corporation',
      email: 'admin@acme.com',
      phone: '+1-555-0123',
      industry: 'Technology',
      status: 'active',
      totalResources: 15,
      totalMonitors: 23,
      serviceIntegrations: [
        { id: '1', name: 'SQS Queue', type: 'messaging', status: 'enabled', count: 11, icon: '📨' },
        { id: '2', name: 'ECS Cluster Service', type: 'container', status: 'enabled', count: 8, icon: '🐳' },
        { id: '3', name: 'EBS Volume', type: 'storage', status: 'enabled', count: 1, icon: '💾' },
        { id: '4', name: 'OpenSearch', type: 'search', status: 'disabled', count: 1, icon: '🔍' },
        { id: '5', name: 'RDS Instance', type: 'database', status: 'disabled', count: 1, icon: '🗄️' },
        { id: '6', name: 'ECS Cluster', type: 'container', status: 'disabled', count: 1, icon: '🏗️' },
        { id: '7', name: 'EC2 Instance', type: 'compute', status: 'disabled', count: 1, icon: '🖥️' },
        { id: '8', name: 'OpenSearch Nodes', type: 'search', status: 'disabled', count: 0, icon: '🔍' }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'cust-2',
      name: 'TechStart Solutions',
      email: 'contact@techstart.com',
      phone: '+1-555-0456',
      industry: 'Software',
      status: 'active',
      totalResources: 8,
      totalMonitors: 12,
      serviceIntegrations: [
        { id: '1', name: 'SQS Queue', type: 'messaging', status: 'enabled', count: 5, icon: '📨' },
        { id: '2', name: 'ECS Cluster Service', type: 'container', status: 'enabled', count: 3, icon: '🐳' },
        { id: '3', name: 'EBS Volume', type: 'storage', status: 'disabled', count: 2, icon: '💾' },
        { id: '4', name: 'OpenSearch', type: 'search', status: 'disabled', count: 0, icon: '🔍' },
        { id: '5', name: 'RDS Instance', type: 'database', status: 'enabled', count: 1, icon: '🗄️' },
        { id: '6', name: 'ECS Cluster', type: 'container', status: 'disabled', count: 0, icon: '🏗️' },
        { id: '7', name: 'EC2 Instance', type: 'compute', status: 'enabled', count: 2, icon: '🖥️' },
        { id: '8', name: 'OpenSearch Nodes', type: 'search', status: 'disabled', count: 0, icon: '🔍' }
      ],
      createdAt: new Date().toISOString()
    }
  ]);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    industry: ''
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      industry: newCustomer.industry,
      status: 'active',
      totalResources: 0,
      totalMonitors: 0,
      serviceIntegrations: [
        { id: '1', name: 'SQS Queue', type: 'messaging', status: 'disabled', count: 0, icon: '📨' },
        { id: '2', name: 'ECS Cluster Service', type: 'container', status: 'disabled', count: 0, icon: '🐳' },
        { id: '3', name: 'EBS Volume', type: 'storage', status: 'disabled', count: 0, icon: '💾' },
        { id: '4', name: 'OpenSearch', type: 'search', status: 'disabled', count: 0, icon: '🔍' },
        { id: '5', name: 'RDS Instance', type: 'database', status: 'disabled', count: 0, icon: '🗄️' },
        { id: '6', name: 'ECS Cluster', type: 'container', status: 'disabled', count: 0, icon: '🏗️' },
        { id: '7', name: 'EC2 Instance', type: 'compute', status: 'disabled', count: 0, icon: '🖥️' },
        { id: '8', name: 'OpenSearch Nodes', type: 'search', status: 'disabled', count: 0, icon: '🔍' }
      ],
      createdAt: new Date().toISOString()
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: '', email: '', phone: '', industry: '' });
    setShowAddCustomer(false);
  };

  const toggleServiceIntegration = (customerId: string, serviceId: string) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          serviceIntegrations: customer.serviceIntegrations.map(service => {
            if (service.id === serviceId) {
              return {
                ...service,
                status: service.status === 'enabled' ? 'disabled' : 'enabled'
              };
            }
            return service;
          })
        };
      }
      return customer;
    }));
  };

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedCustomer(null)}
          >
            ← Back to Customers
          </Button>
          <span className="text-sm text-gray-500">•</span>
          <span className="font-medium">{selectedCustomer.name}</span>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Service Integrations</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Customer Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer Name</label>
                      <p className="text-lg font-semibold">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p>{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p>{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Industry</label>
                      <p>{selectedCustomer.industry}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalResources}</div>
                          <div className="text-sm text-gray-600">Total Resources</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{selectedCustomer.totalMonitors}</div>
                          <div className="text-sm text-gray-600">Active Monitors</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">
                        <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'}>
                          {selectedCustomer.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Service Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedCustomer.serviceIntegrations.map((service) => (
                    <Card key={service.id} className="text-center p-4">
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-medium text-sm mb-1">{service.name}</div>
                      <div className="text-lg font-bold mb-2">{service.count}</div>
                      <Button 
                        size="sm" 
                        variant={service.status === 'enabled' ? 'default' : 'outline'}
                        className="text-xs"
                        onClick={() => toggleServiceIntegration(selectedCustomer.id, service.id)}
                      >
                        {service.status === 'enabled' ? 'Disable Integration' : 'Enable Integration'}
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Customer Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No resources configured yet.</p>
                  <p className="text-sm">Resources will appear here once configured for this customer.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Customer Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Management
            </CardTitle>
            <Button onClick={() => setShowAddCustomer(!showAddCustomer)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        {showAddCustomer && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Customer Name *</label>
                  <Input
                    placeholder="e.g., Acme Corporation"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="admin@company.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input
                    placeholder="+1-555-0123"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={newCustomer.industry} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCustomer}>Add Customer</Button>
                <Button variant="outline" onClick={() => setShowAddCustomer(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>{customer.email}</span>
                        <span>{customer.phone}</span>
                        <span>{customer.industry}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-600 font-medium">{customer.totalResources} Resources</span>
                        <span className="text-green-600 font-medium">{customer.totalMonitors} Monitors</span>
                        <span className="text-purple-600 font-medium">
                          {customer.serviceIntegrations.filter(s => s.status === 'enabled').length} Integrations
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
