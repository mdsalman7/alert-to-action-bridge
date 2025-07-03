
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="customers">Customer Management</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfrastructureManagement;
