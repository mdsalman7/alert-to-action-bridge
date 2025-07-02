
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket, Customer, RequestedItem, TimeEntry } from '@/types/tickets';
import { User } from '@/types/auth';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  MessageSquare, 
  Plus, 
  Search, 
  Ticket as TicketIcon,
  User as UserIcon,
  Calendar,
  Flag,
  CheckCircle,
  Timer,
  FileText
} from 'lucide-react';

interface CustomerTicketSystemProps {
  user: User;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const CustomerTicketSystem: React.FC<CustomerTicketSystemProps> = ({ user, tickets, setTickets }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Group tickets by customer and create customer summary
    const customerMap = new Map<string, Customer>();
    
    tickets.forEach(ticket => {
      if (!customerMap.has(ticket.customerId)) {
        customerMap.set(ticket.customerId, {
          id: ticket.customerId,
          name: ticket.customerName,
          ticketCount: 0,
          openTickets: 0,
          overdueTickets: 0
        });
      }
      
      const customer = customerMap.get(ticket.customerId)!;
      customer.ticketCount++;
      
      if (ticket.status === 'open' || ticket.status === 'in-progress') {
        customer.openTickets++;
      }
      
      if (ticket.state === 'overdue') {
        customer.overdueTickets++;
      }
    });
    
    setCustomers(Array.from(customerMap.values()));
  }, [tickets]);

  const getCustomerTickets = (customerId: string) => {
    return tickets.filter(ticket => ticket.customerId === customerId);
  };

  const filteredCustomerTickets = selectedCustomer 
    ? getCustomerTickets(selectedCustomer.id).filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
    : [];

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

  const getStateColor = (state: string) => {
    switch (state) {
      case 'overdue': return 'destructive';
      case 'pending': return 'default';
      default: return 'secondary';
    }
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

  if (selectedTicket) {
    return (
      <div className="space-y-6">
        {/* Ticket Detail Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedTicket(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedTicket.id}</h2>
              <p className="text-gray-600">{selectedTicket.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStateColor(selectedTicket.state)} className="capitalize">
              {selectedTicket.state}
            </Badge>
            <Badge variant={getPriorityColor(selectedTicket.priority)} className="capitalize">
              {selectedTicket.priority}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="related">Related tickets</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedTicket.description}</p>
                  </CardContent>
                </Card>

                {selectedTicket.requestedItems && selectedTicket.requestedItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Requested items
                          <Badge variant="outline">{selectedTicket.requestedItems.length}</Badge>
                        </CardTitle>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-1" />
                          Add item
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedTicket.requestedItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 mb-4 last:mb-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className="capitalize">
                              Stage: {item.stage}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          {item.features && (
                            <div>
                              <p className="text-sm font-medium mb-1">Features:</p>
                              <ul className="text-sm text-gray-600">
                                {item.features.map((feature, idx) => (
                                  <li key={idx}>• {feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button size="sm" variant="outline">Forward</Button>
                        <Button size="sm" variant="outline">Add note</Button>
                      </div>
                      <Textarea 
                        placeholder="Type your message here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="related">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No related tickets found</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No tasks assigned</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assets">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No assets linked</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No recent activities</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Priority:</span>
                  <Badge variant={getPriorityColor(selectedTicket.priority)} className="capitalize">
                    {selectedTicket.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={getStatusColor(selectedTicket.status)} className="capitalize">
                    {selectedTicket.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Assigned to:</span>
                  <span className="text-sm">{selectedTicket.assignedTo || 'None'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Group:</span>
                  <span className="text-sm">{selectedTicket.group || 'None'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Company:</span>
                  <span className="text-sm">{selectedTicket.company || selectedTicket.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                </div>

                {selectedTicket.kekaId && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Keka ID:</span>
                    <span className="text-sm">{selectedTicket.kekaId}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Requester:</span>
                  <span className="text-sm">{selectedTicket.requester}</span>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Timer className="h-5 w-5" />
                    Time entries
                  </CardTitle>
                  <Button size="sm" variant="outline">Add time</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Total time tracked</span>
                    <span className="text-lg font-bold">01h 09m</span>
                  </div>
                  
                  {selectedTicket.timeTracking?.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-blue-200 pl-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{entry.duration}</span>
                        <Badge variant={entry.billable ? "default" : "outline"} className="text-xs">
                          {entry.billable ? "Billable" : "Non-billable"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{entry.userName}</p>
                      <p className="text-xs text-gray-500">
                        on {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 text-center py-4">No time entries yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        {/* Customer Tickets Header */}
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
              <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
              <p className="text-gray-600">{selectedCustomer.ticketCount} total tickets</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
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

        {/* Tickets Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned to</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomerTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-gray-500">{ticket.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.requester}</TableCell>
                    <TableCell>
                      <Badge variant={getStateColor(ticket.state)} className="capitalize">
                        {ticket.state}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)} className="capitalize">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(ticket.priority)} className="capitalize">
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedTo || 'None'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Customer List View
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <Card 
                key={customer.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <TicketIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Tickets:</span>
                      <span className="font-medium">{customer.ticketCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Open:</span>
                      <span className="font-medium text-orange-600">{customer.openTickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overdue:</span>
                      <span className="font-medium text-red-600">{customer.overdueTickets}</span>
                    </div>
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

export default CustomerTicketSystem;
