
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Settings, ArrowLeft, Server, Database, Globe, Zap } from 'lucide-react';

interface CustomerProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  description?: string;
  resources: CustomerResource[];
  createdAt: string;
}

interface CustomerResource {
  id: string;
  name: string;
  type: 'ec2' | 'rds' | 'ecs' | 'eks' | 'lambda' | 'sqs' | 'sns' | 'apigateway';
  status: 'healthy' | 'warning' | 'critical';
  region: string;
  createdAt: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([
    {
      id: 'customer-1',
      companyName: 'TechCorp Solutions',
      contactPerson: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0123',
      description: 'E-commerce platform with high-traffic requirements',
      resources: [
        { id: 'res-1', name: 'Web Server', type: 'ec2', status: 'healthy', region: 'us-east-1', createdAt: new Date().toISOString() },
        { id: 'res-2', name: 'Main Database', type: 'rds', status: 'warning', region: 'us-east-1', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    description: ''
  });

  const [newResource, setNewResource] = useState({
    name: '',
    type: 'ec2' as const,
    region: 'us-east-1'
  });

  const handleCreateCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.contactPerson || !newCustomer.email) return;

    const customer: CustomerProfile = {
      id: `customer-${Date.now()}`,
      companyName: newCustomer.companyName,
      contactPerson: newCustomer.contactPerson,
      email: newCustomer.email,
      phone: newCustomer.phone,
      description: newCustomer.description,
      resources: [],
      createdAt: new Date().toISOString()
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ companyName: '', contactPerson: '', email: '', phone: '', description: '' });
    setShowCreateCustomer(false);
  };

  const handleAddResource = () => {
    if (!selectedCustomer || !newResource.name) return;

    const resource: CustomerResource = {
      id: `res-${Date.now()}`,
      name: newResource.name,
      type: newResource.type,
      status: 'healthy',
      region: newResource.region,
      createdAt: new Date().toISOString()
    };

    setCustomers(prev => prev.map(customer => 
      customer.id === selectedCustomer.id 
        ? { ...customer, resources: [...customer.resources, resource] }
        : customer
    ));

    setSelectedCustomer(prev => prev ? { ...prev, resources: [...prev.resources, resource] } : null);
    setNewResource({ name: '', type: 'ec2', region: 'us-east-1' });
    setShowAddResource(false);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ec2': return <Server className="h-4 w-4" />;
      case 'rds': return <Database className="h-4 w-4" />;
      case 'lambda': return <Zap className="h-4 w-4" />;
      case 'apigateway': return <Globe className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'secondary';
      case 'warning': return 'default';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        {/* Customer Detail Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCustomer(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedCustomer.companyName}</h2>
              <p className="text-gray-600">{selectedCustomer.resources.length} resources</p>
            </div>
          </div>
          <Button onClick={() => setShowAddResource(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="font-medium">{selectedCustomer.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
              {selectedCustomer.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
              )}
              {selectedCustomer.description && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="font-medium">{selectedCustomer.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Resource Form */}
        {showAddResource && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resource Name</label>
                  <Input
                    placeholder="e.g., Web Server"
                    value={newResource.name}
                    onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Resource Type</label>
                  <Select value={newResource.type} onValueChange={(value: any) => setNewResource(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ec2">EC2 Instance</SelectItem>
                      <SelectItem value="rds">RDS Database</SelectItem>
                      <SelectItem value="ecs">ECS Service</SelectItem>
                      <SelectItem value="eks">EKS Cluster</SelectItem>
                      <SelectItem value="lambda">Lambda Function</SelectItem>
                      <SelectItem value="sqs">SQS Queue</SelectItem>
                      <SelectItem value="sns">SNS Topic</SelectItem>
                      <SelectItem value="apigateway">API Gateway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Region</label>
                  <Select value={newResource.region} onValueChange={(value) => setNewResource(prev => ({ ...prev, region: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddResource}>Add Resource</Button>
                <Button variant="outline" onClick={() => setShowAddResource(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources List */}
        <Card>
          <CardHeader>
            <CardTitle>Resources ({selectedCustomer.resources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCustomer.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getResourceIcon(resource.type)}
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-gray-500">{resource.type.toUpperCase()} • {resource.region}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {selectedCustomer.resources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No resources added yet. Click "Add Resource" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Customer Management
            </CardTitle>
            <Button onClick={() => setShowCreateCustomer(!showCreateCustomer)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        
        {showCreateCustomer && (
          <CardContent>
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Company Name *</label>
                  <Input
                    placeholder="e.g., TechCorp Solutions"
                    value={newCustomer.companyName}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contact Person *</label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={newCustomer.contactPerson}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="contact@company.com"
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
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Brief description of the customer's business or requirements..."
                  value={newCustomer.description}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCustomer}>Create Customer</Button>
                <Button variant="outline" onClick={() => setShowCreateCustomer(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card 
            key={customer.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCustomer(customer)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{customer.companyName}</h3>
                  <p className="text-sm text-gray-600">{customer.contactPerson}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">Resources:</span>
                <Badge variant="outline">{customer.resources.length}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;
