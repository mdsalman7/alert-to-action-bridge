
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfrastructureResource, Project } from '@/types/infrastructure';
import { User } from '@/types/auth';
import { Server, Plus, Cloud, Database, Settings, Activity, Bell, Folder, Users } from 'lucide-react';
import MonitorSetup from './MonitorSetup';
import MonitorGroupManager from './MonitorGroupManager';
import CustomerManagement from './CustomerManagement';

interface InfrastructureManagementProps {
  user: User;
}

const InfrastructureManagement: React.FC<InfrastructureManagementProps> = ({ user }) => {
  const [showMonitorSetup, setShowMonitorSetup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{id: string, name: string} | null>(null);
  const [monitors, setMonitors] = useState<any[]>([]);

  const handleSaveMonitor = (monitorData: any) => {
    const monitor = {
      id: `monitor-${Date.now()}`,
      ...monitorData,
      createdAt: new Date().toISOString()
    };
    setMonitors(prev => [...prev, monitor]);
    setShowMonitorSetup(false);
    setSelectedCustomer(null);
  };

  if (showMonitorSetup && selectedCustomer) {
    return (
      <MonitorSetup
        customerId={selectedCustomer.id}
        customerName={selectedCustomer.name}
        onClose={() => {
          setShowMonitorSetup(false);
          setSelectedCustomer(null);
        }}
        onSave={handleSaveMonitor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Customer Management</TabsTrigger>
          <TabsTrigger value="monitors">Monitors</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="monitors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Active Monitors ({monitors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monitors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No monitors configured yet.</p>
                  <p className="text-sm">Add monitors to your resources to start tracking their health.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monitors.map((monitor) => (
                    <div key={monitor.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{monitor.name}</h3>
                          <p className="text-sm text-gray-600">{monitor.type} • Check every {monitor.interval}min</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={monitor.status === 'active' ? 'default' : 'secondary'}>
                            {monitor.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <MonitorGroupManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfrastructureManagement;
