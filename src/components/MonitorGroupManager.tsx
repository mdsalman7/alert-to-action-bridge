
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, Plus, Settings, Tag } from 'lucide-react';

interface MonitorGroup {
  id: string;
  name: string;  
  description: string;
  color: string;
  customerId: string;
  customerName: string;
  monitorCount: number;
  tags: string[];
}

interface MonitorGroupManagerProps {
  customerId?: string;
  onGroupSelect?: (groupId: string) => void;
}

const MonitorGroupManager: React.FC<MonitorGroupManagerProps> = ({ customerId, onGroupSelect }) => {
  const [groups, setGroups] = useState<MonitorGroup[]>([
    {
      id: 'group-1',
      name: 'Production Websites',
      description: 'Critical production web services',
      color: 'bg-red-100 text-red-800',
      customerId: 'customer-1',
      customerName: 'TechCorp Solutions',
      monitorCount: 5,
      tags: ['production', 'critical']
    },
    {
      id: 'group-2', 
      name: 'Internal Servers',
      description: 'Internal infrastructure monitoring',
      color: 'bg-blue-100 text-blue-800',
      customerId: 'customer-1',
      customerName: 'TechCorp Solutions',
      monitorCount: 8,
      tags: ['internal', 'servers']
    }
  ]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800',
    tags: [] as string[],
    newTag: ''
  });

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gray' }
  ];

  const handleCreateGroup = () => {
    if (!newGroup.name) return;

    const group: MonitorGroup = {
      id: `group-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      color: newGroup.color,
      customerId: customerId || 'default',
      customerName: 'Current Customer',
      monitorCount: 0,
      tags: newGroup.tags
    };

    setGroups(prev => [...prev, group]);
    setNewGroup({ name: '', description: '', color: 'bg-blue-100 text-blue-800', tags: [], newTag: '' });
    setShowCreateGroup(false);
  };

  const addTag = () => {
    if (newGroup.newTag && !newGroup.tags.includes(newGroup.newTag)) {
      setNewGroup(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewGroup(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredGroups = customerId 
    ? groups.filter(group => group.customerId === customerId)
    : groups;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Monitor Groups
            </CardTitle>
            <Button onClick={() => setShowCreateGroup(!showCreateGroup)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardHeader>
        
        {showCreateGroup && (
          <CardContent className="border-t">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Group Name</label>
                  <Input
                    placeholder="e.g., Production Websites"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color Theme</label>
                  <Select value={newGroup.color} onValueChange={(value) => setNewGroup(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  placeholder="Brief description of this group"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tag"
                    value={newGroup.newTag}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, newTag: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newGroup.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateGroup}>Create Group</Button>
                <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card 
            key={group.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onGroupSelect?.(group.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Folder className="h-4 w-4" />
                    <h3 className="font-semibold">{group.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                  <p className="text-xs text-gray-500">{group.customerName}</p>
                </div>
                <Badge className={group.color}>
                  {group.monitorCount}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-gray-600">Monitors: {group.monitorCount}</span>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonitorGroupManager;
