import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from '@/types/tickets';
import { User } from '@/types/auth';
import { TicketPlus, MessageSquare, CheckCircle } from 'lucide-react';

interface TicketSystemProps {
  user: User;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const TicketSystem: React.FC<TicketSystemProps> = ({ user, tickets, setTickets }) => {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'general' as const,
    assignedTo: user.id,
    customerId: '',
    customerName: '',
    requester: user.name
  });

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      category: newTicket.category,
      assignedTo: newTicket.assignedTo,
      assignedBy: user.id,
      customerId: newTicket.customerId || 'customer-general',
      customerName: newTicket.customerName || 'General',
      state: 'pending',
      requester: newTicket.requester,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      category: 'general', 
      assignedTo: user.id,
      customerId: '',
      customerName: '',
      requester: user.name
    });
    setShowCreateTicket(false);
  };

  const handleStatusUpdate = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : ticket.resolvedAt
          }
        : ticket
    ));
  };

  const filteredTickets = tickets.filter(ticket => {
    if (user.role === 'administrator') return true;
    if (user.role === 'super-user') return ticket.assignedTo === user.id || ticket.assignedBy === user.id;
    if (user.role === 'read-only') return ticket.assignedTo === user.id;
    return false;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Ticket */}
      {user.role !== 'read-only' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TicketPlus className="h-5 w-5" />
                Ticket Management
              </CardTitle>
              <Button onClick={() => setShowCreateTicket(!showCreateTicket)}>
                <TicketPlus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>
          </CardHeader>
          {showCreateTicket && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Ticket title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe the issue or task..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Customer Name</label>
                    <Input
                      placeholder="Customer/Company name"
                      value={newTicket.customerName}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, customerName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Requester</label>
                    <Input
                      placeholder="Requester name"
                      value={newTicket.requester}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, requester: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={newTicket.category} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alert-incident">Alert Incident</SelectItem>
                        <SelectItem value="maintenance-task">Maintenance Task</SelectItem>
                        <SelectItem value="change-request">Change Request</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTicket}>Create Ticket</Button>
                  <Button variant="outline" onClick={() => setShowCreateTicket(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>My Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tickets assigned to you.
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {ticket.category.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {ticket.alertId && (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Alert: {ticket.alertId}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Customer: {ticket.customerName}</span>
                        <span>Requester: {ticket.requester}</span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                        <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                        {ticket.resolvedAt && (
                          <span>Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {ticket.status !== 'resolved' && ticket.status !== 'closed' && user.role !== 'read-only' && (
                        <>
                          {ticket.status === 'open' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(ticket.id, 'in-progress')}
                            >
                              Start Work
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Resolved
                          </Button>
                        </>
                      )}
                      
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketSystem;
