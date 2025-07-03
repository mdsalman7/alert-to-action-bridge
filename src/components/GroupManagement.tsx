
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

const GroupManagement: React.FC = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'group-1',
      name: 'Managed Services Team',
      description: 'Handles day-to-day operations and maintenance tasks',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'group-2',
      name: 'Infrastructure Team',
      description: 'Manages cloud infrastructure and deployments',
      members: ['Sarah Wilson', 'Tom Brown'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'group-3',
      name: 'Migration Team',
      description: 'Specializes in cloud migrations and data transfers',
      members: ['Alex Chen', 'Lisa Garcia'],
      createdAt: new Date().toISOString()
    }
  ]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  });

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive"
      });
      return;
    }

    const group: Group = {
      id: `group-${Date.now()}`,
      name: newGroup.name.trim(),
      description: newGroup.description.trim(),
      members: [],
      createdAt: new Date().toISOString()
    };

    setGroups(prev => [...prev, group]);
    setNewGroup({ name: '', description: '' });
    setShowCreateGroup(false);
    
    toast({
      title: "Success",
      description: `Group "${group.name}" created successfully`
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    if (!groupToDelete) return;

    setGroups(prev => prev.filter(group => group.id !== groupId));
    
    toast({
      title: "Success",
      description: `Group "${groupToDelete.name}" deleted successfully`
    });
  };

  const handleCancelCreate = () => {
    setNewGroup({ name: '', description: '' });
    setShowCreateGroup(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Groups
            </CardTitle>
            <Button onClick={() => setShowCreateGroup(!showCreateGroup)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </CardHeader>
        
        {showCreateGroup && (
          <CardContent>
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Group Name *</label>
                <Input
                  placeholder="e.g., DevOps Team"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe the group's purpose and responsibilities..."
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateGroup}>Create Group</Button>
                <Button variant="outline" onClick={handleCancelCreate}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" title="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete group"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Members:</span>
                  <Badge variant="outline">{group.members.length}</Badge>
                </div>
                
                <div className="space-y-1">
                  {group.members.slice(0, 3).map((member, idx) => (
                    <div key={idx} className="text-sm text-gray-600">• {member}</div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="text-sm text-gray-500">+{group.members.length - 3} more</div>
                  )}
                  {group.members.length === 0 && (
                    <div className="text-sm text-gray-400 italic">No members yet</div>
                  )}
                </div>
                
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Manage Members
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-4">Create your first team group to organize your members</p>
            <Button onClick={() => setShowCreateGroup(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupManagement;
