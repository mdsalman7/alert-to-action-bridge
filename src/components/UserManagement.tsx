
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types/auth';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  currentUser?: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'administrator',
      assignedResources: ['resource-1', 'resource-2'],
      assignedProjects: ['project-1'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'super-user',
      assignedResources: ['resource-1'],
      assignedProjects: ['project-2'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'read-only',
      assignedResources: ['resource-3'],
      assignedProjects: [],
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: 'administrator' | 'super-user' | 'read-only';
    assignedResources: string[];
  }>({
    name: '',
    email: '',
    role: 'read-only',
    assignedResources: []
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      assignedResources: newUser.assignedResources,
      assignedProjects: [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: 'read-only', assignedResources: [] });
    setShowCreateUser(false);
    
    toast({
      title: "Success",
      description: `User "${user.name}" created successfully`
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      assignedResources: user.assignedResources
    });
    setShowCreateUser(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    const emailExists = users.some(user => 
      user.email === newUser.email && user.id !== editingUser.id
    );

    if (emailExists) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id
        ? {
            ...user,
            name: newUser.name.trim(),
            email: newUser.email.trim(),
            role: newUser.role,
            assignedResources: newUser.assignedResources
          }
        : user
    ));

    setNewUser({ name: '', email: '', role: 'read-only', assignedResources: [] });
    setEditingUser(null);
    setShowCreateUser(false);
    
    toast({
      title: "Success",
      description: `User "${newUser.name}" updated successfully`
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "Success",
      description: `User "${userToDelete.name}" deleted successfully`
    });
  };

  const handleCancelEdit = () => {
    setNewUser({ name: '', email: '', role: 'read-only', assignedResources: [] });
    setEditingUser(null);
    setShowCreateUser(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrator': return 'destructive';
      case 'super-user': return 'default';
      case 'read-only': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <Button onClick={() => setShowCreateUser(!showCreateUser)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit User Form */}
      {showCreateUser && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? 'Edit User' : 'Create New User'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <Input
                    placeholder="User full name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="user@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: 'administrator' | 'super-user' | 'read-only') => 
                    setNewUser(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="super-user">Super User</SelectItem>
                    <SelectItem value="read-only">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                    {user.role.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEditUser(user)}
                    title="Edit user"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>Resources: {user.assignedResources.length}</div>
                <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No users match your search criteria' : 'Create your first user to get started'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateUser(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First User
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
