
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types/auth';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@company.com',
      name: 'System Administrator',
      role: 'administrator',
      assignedResources: [],
      assignedProjects: [],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: '2',
      email: 'superuser@company.com',
      name: 'Super User',
      role: 'super-user',
      assignedResources: ['res-1', 'res-2'],
      assignedProjects: ['proj-1'],
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'read-only' as const,
    password: ''
  });

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email.trim(),
      name: newUser.name.trim(),
      role: newUser.role,
      assignedResources: [],
      assignedProjects: [],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ email: '', name: '', role: 'read-only', password: '' });
    setShowAddUser(false);
    
    toast({
      title: "Success",
      description: `User "${user.name}" added successfully`
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive"
      });
      return;
    }

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "Success",
      description: `User "${userToDelete.name}" deleted successfully`
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      name: user.name,
      role: user.role,
      password: ''
    });
    setShowAddUser(true);
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

    const emailExists = users.some(u => 
      u.id !== editingUser.id && 
      u.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (emailExists) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive"
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? { ...user, email: newUser.email.trim(), name: newUser.name.trim(), role: newUser.role }
        : user
    ));

    setEditingUser(null);
    setNewUser({ email: '', name: '', role: 'read-only', password: '' });
    setShowAddUser(false);
    
    toast({
      title: "Success",
      description: "User updated successfully"
    });
  };

  const handleCancelAddUser = () => {
    setEditingUser(null);
    setNewUser({ email: '', name: '', role: 'read-only', password: '' });
    setShowAddUser(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrator': return 'default';
      case 'super-user': return 'secondary';
      default: return 'outline';
    }
  };

  if (currentUser.role !== 'administrator') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <Button onClick={() => setShowAddUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Projects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'secondary' : 'outline'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.assignedProjects.length} projects</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser.id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        title={user.id === currentUser.id ? "Cannot delete your own account" : "Delete user"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddUser && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name *</label>
                <Input
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="super-user">Super User</SelectItem>
                    <SelectItem value="read-only">Read-Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Temporary Password</label>
                  <Input
                    type="password"
                    placeholder="Temporary password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
              <Button variant="outline" onClick={handleCancelAddUser}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {users.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Yet</h3>
            <p className="text-gray-600 mb-4">Add your first user to get started</p>
            <Button onClick={() => setShowAddUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add First User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
