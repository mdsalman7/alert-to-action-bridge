
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfrastructureResource, Project } from '@/types/infrastructure';
import { User } from '@/types/auth';
import { Server, Plus, Cloud, Database, Settings } from 'lucide-react';

interface InfrastructureManagementProps {
  user: User;
}

const InfrastructureManagement: React.FC<InfrastructureManagementProps> = ({ user }) => {
  const [resources, setResources] = useState<InfrastructureResource[]>([
    {
      id: 'res-1',
      name: 'Production Web Server',
      type: 'aws-ec2',
      provider: 'aws',
      status: 'warning',
      projectId: 'proj-1',
      assignedUsers: [user.id],
      region: 'us-east-1',
      metadata: { instanceType: 't3.large', os: 'Ubuntu 20.04' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'Production Environment',
      description: 'Main production infrastructure',
      assignedUsers: [user.id],
      resources: ['res-1'],
      createdAt: new Date().toISOString()
    }
  ]);

  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'aws-ec2' as const,
    provider: 'aws' as const,
    projectId: '',
    region: ''
  });

  const handleAddResource = () => {
    if (!newResource.name || !newResource.projectId) return;

    const resource: InfrastructureResource = {
      id: `res-${Date.now()}`,
      name: newResource.name,
      type: newResource.type,
      provider: newResource.provider,
      status: 'healthy',
      projectId: newResource.projectId,
      assignedUsers: [user.id],
      region: newResource.region,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setResources(prev => [...prev, resource]);
    setNewResource({ name: '', type: 'aws-ec2', provider: 'aws', projectId: '', region: '' });
    setShowAddResource(false);
  };

  const filteredResources = resources.filter(resource => {
    if (user.role === 'administrator') return true;
    return resource.assignedUsers.includes(user.id);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'secondary';
      case 'warning': return 'default';
      case 'critical': return 'destructive';
      default: return 'outline';
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

  const getResourceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'aws-ec2': 'EC2 Instance',
      'aws-rds': 'RDS Database',
      'aws-lambda': 'Lambda Function',
      'aws-ecs': 'ECS Service',
      'azure-vm': 'Virtual Machine',
      'gcp-compute': 'Compute Engine',
      'on-premise': 'On-Premise Server'
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Add Resource */}
      {user.role === 'administrator' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Infrastructure Resources
              </CardTitle>
              <Button onClick={() => setShowAddResource(!showAddResource)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </CardHeader>
          {showAddResource && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Resource Name</label>
                    <Input
                      placeholder="e.g., Production Web Server"
                      value={newResource.name}
                      onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Provider</label>
                    <Select value={newResource.provider} onValueChange={(value: any) => setNewResource(prev => ({ ...prev, provider: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon Web Services</SelectItem>
                        <SelectItem value="azure">Microsoft Azure</SelectItem>
                        <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                        <SelectItem value="on-premise">On-Premise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Resource Type</label>
                    <Select value={newResource.type} onValueChange={(value: any) => setNewResource(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws-ec2">AWS EC2 Instance</SelectItem>
                        <SelectItem value="aws-rds">AWS RDS Database</SelectItem>
                        <SelectItem value="aws-lambda">AWS Lambda Function</SelectItem>
                        <SelectItem value="aws-ecs">AWS ECS Service</SelectItem>
                        <SelectItem value="azure-vm">Azure Virtual Machine</SelectItem>
                        <SelectItem value="gcp-compute">GCP Compute Engine</SelectItem>
                        <SelectItem value="on-premise">On-Premise Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project</label>
                    <Select value={newResource.projectId} onValueChange={(value) => setNewResource(prev => ({ ...prev, projectId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Region (Optional)</label>
                  <Input
                    placeholder="e.g., us-east-1, eastus, us-central1"
                    value={newResource.region}
                    onChange={(e) => setNewResource(prev => ({ ...prev, region: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddResource}>Add Resource</Button>
                  <Button variant="outline" onClick={() => setShowAddResource(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>My Resources ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No resources assigned to you.
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getProviderIcon(resource.provider)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{resource.name}</h3>
                          <Badge variant={getStatusColor(resource.status)}>
                            {resource.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {getResourceTypeLabel(resource.type)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>Provider: {resource.provider.toUpperCase()}</span>
                          {resource.region && <span>Region: {resource.region}</span>}
                          <span>Project: {projects.find(p => p.id === resource.projectId)?.name || 'Unknown'}</span>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Created: {new Date(resource.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="border-2">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{project.resources.length} resources</span>
                    <span className="text-gray-500">{project.assignedUsers.length} users</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureManagement;
