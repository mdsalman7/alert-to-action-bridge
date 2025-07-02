
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, User, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { ServiceTicket, Alert } from './UnifiedDashboard';

interface TicketingPanelProps {
  tickets: ServiceTicket[];
  alerts: Alert[];
}

const TicketingPanel: React.FC<TicketingPanelProps> = ({ tickets, alerts }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
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

  const getSlaColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'breached': return 'destructive';
      case 'at-risk': return 'default';
      case 'on-track': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    slaBreaches: tickets.filter(t => t.slaStatus === 'breached').length
  };

  const getLinkedAlert = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket?.alertId) {
      return alerts.find(a => a.id === ticket.alertId);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Ticket Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Freshservice ITSM Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{ticketStats.total}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{ticketStats.open}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ticketStats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{ticketStats.slaBreaches}</div>
              <div className="text-sm text-gray-600">SLA Breaches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Tickets</label>
              <Input
                placeholder="Search by title, description, or assignee..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
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

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const linkedAlert = getLinkedAlert(ticket.id);
              
              return (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <Badge variant={getStatusColor(ticket.status)}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant={getPriorityColor(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                          <Badge variant={getSlaColor(ticket.slaStatus)}>
                            SLA: {ticket.slaStatus.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{ticket.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {ticket.assignee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Created: {new Date(ticket.createdAt).toLocaleString()}
                          </span>
                          <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                        </div>

                        {/* Linked Alert Information */}
                        {linkedAlert && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Linked Site24x7 Alert
                              </span>
                              <Badge 
                                variant={linkedAlert.status === 'down' ? 'destructive' : linkedAlert.status === 'trouble' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {linkedAlert.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-700">
                              Monitor: {linkedAlert.monitorName} | Location: {linkedAlert.location}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Last Alert: {new Date(linkedAlert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {linkedAlert && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Monitor
                        </Button>
                      )}
                      
                      <Button size="sm" variant="default">
                        Update Ticket
                      </Button>
                      
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { TicketingPanel };
