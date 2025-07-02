
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Server, Database, Cloud, Activity, Bell } from 'lucide-react';

interface Monitor {
  id: string;
  name: string;
  type: 'website' | 'server' | 'api' | 'cloud' | 'network';
  url?: string;
  interval: number;
  locations: string[];
  thresholds: {
    uptime: number;
    responseTime: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  services: MonitorService[];
  notifications: NotificationConfig;
  customerId: string;
  groupId?: string;
}

interface MonitorService {
  id: string;
  name: string;
  type: string;
  threshold: number;
  unit: string;
  enabled: boolean;
}

interface NotificationConfig {
  email: boolean;
  sms: boolean;
  slack: boolean;
  escalationMinutes: number;
  contactGroups: string[];
}

interface MonitorSetupProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
  onSave: (monitor: Omit<Monitor, 'id'>) => void;
}

const MonitorSetup: React.FC<MonitorSetupProps> = ({ customerId, customerName, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [monitorData, setMonitorData] = useState({
    name: '',
    type: '' as Monitor['type'],
    url: '',
    interval: 5,
    locations: [] as string[],
    thresholds: { uptime: 99, responseTime: 5000 },
    services: [] as MonitorService[],
    notifications: {
      email: true,
      sms: false,
      slack: false,
      escalationMinutes: 10,
      contactGroups: []
    } as NotificationConfig
  });

  const monitorTypes = [
    { value: 'website', label: 'Website Monitor', icon: Globe, description: 'HTTP/HTTPS monitoring' },
    { value: 'server', label: 'Server Monitor', icon: Server, description: 'Linux/Windows server monitoring' },
    { value: 'api', label: 'API Monitor', icon: Activity, description: 'REST API endpoint monitoring' },
    { value: 'cloud', label: 'Cloud Monitor', icon: Cloud, description: 'AWS/Azure/GCP resources' },
    { value: 'network', label: 'Network Monitor', icon: Database, description: 'Network devices via SNMP' }
  ];

  const locations = ['US East', 'US West', 'Europe', 'Asia Pacific', 'Australia'];

  const getServiceTemplates = (type: Monitor['type']): MonitorService[] => {
    switch (type) {
      case 'server':
        return [
          { id: 'cpu', name: 'CPU Usage', type: 'percentage', threshold: 80, unit: '%', enabled: true },
          { id: 'memory', name: 'Memory Usage', type: 'percentage', threshold: 85, unit: '%', enabled: true },
          { id: 'disk', name: 'Disk Usage', type: 'percentage', threshold: 90, unit: '%', enabled: true },
          { id: 'load', name: 'System Load', type: 'number', threshold: 5, unit: '', enabled: false }
        ];
      case 'website':
        return [
          { id: 'uptime', name: 'Uptime Check', type: 'percentage', threshold: 99, unit: '%', enabled: true },
          { id: 'response', name: 'Response Time', type: 'milliseconds', threshold: 3000, unit: 'ms', enabled: true },
          { id: 'ssl', name: 'SSL Certificate', type: 'days', threshold: 30, unit: 'days', enabled: false }
        ];
      case 'cloud':
        return [
          { id: 'ec2', name: 'EC2 Health', type: 'status', threshold: 1, unit: '', enabled: true },
          { id: 'billing', name: 'Billing Alert', type: 'currency', threshold: 1000, unit: '$', enabled: false },
          { id: 'storage', name: 'Storage Usage', type: 'percentage', threshold: 80, unit: '%', enabled: true }
        ];
      default:
        return [];
    }
  };

  const handleTypeChange = (type: Monitor['type']) => {
    setMonitorData(prev => ({
      ...prev,
      type,
      services: getServiceTemplates(type)
    }));
  };

  const handleLocationToggle = (location: string) => {
    setMonitorData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const updateService = (serviceId: string, updates: Partial<MonitorService>) => {
    setMonitorData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      )
    }));
  };

  const handleSave = () => {
    const monitor: Omit<Monitor, 'id'> = {
      name: monitorData.name,
      type: monitorData.type,
      url: monitorData.url,
      interval: monitorData.interval,
      locations: monitorData.locations,
      thresholds: monitorData.thresholds,
      status: 'active',
      services: monitorData.services,
      notifications: monitorData.notifications,
      customerId
    };
    onSave(monitor);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Monitor Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monitorTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  monitorData.type === type.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTypeChange(type.value as Monitor['type'])}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {monitorData.type && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Monitor Name</label>
            <Input
              placeholder="e.g., Production Website"
              value={monitorData.name}
              onChange={(e) => setMonitorData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          {(monitorData.type === 'website' || monitorData.type === 'api') && (
            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <Input
                placeholder="https://example.com"
                value={monitorData.url}
                onChange={(e) => setMonitorData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">Check Interval (minutes)</label>
            <Select value={monitorData.interval.toString()} onValueChange={(value) => setMonitorData(prev => ({ ...prev, interval: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Configure Services & Thresholds</h3>
      
      <div className="space-y-4">
        {monitorData.services.map((service) => (
          <div key={service.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={service.enabled}
                  onCheckedChange={(checked) => updateService(service.id, { enabled: !!checked })}
                />
                <span className="font-medium">{service.name}</span>
              </div>
              <Badge variant={service.enabled ? 'default' : 'secondary'}>
                {service.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            {service.enabled && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Alert Threshold</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={service.threshold}
                      onChange={(e) => updateService(service.id, { threshold: parseFloat(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">{service.unit}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Monitoring Locations</h4>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <Badge
              key={location}
              variant={monitorData.locations.includes(location) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleLocationToggle(location)}
            >
              {location}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Notification Settings</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Notification Channels</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={monitorData.notifications.email}
                onCheckedChange={(checked) => setMonitorData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: !!checked }
                }))}
              />
              <span>Email Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={monitorData.notifications.sms}
                onCheckedChange={(checked) => setMonitorData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms: !!checked }
                }))}
              />
              <span>SMS Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={monitorData.notifications.slack}
                onCheckedChange={(checked) => setMonitorData(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, slack: !!checked }
                }))}
              />
              <span>Slack Integration</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Escalation Time (minutes)</label>
          <Select 
            value={monitorData.notifications.escalationMinutes.toString()} 
            onValueChange={(value) => setMonitorData(prev => ({
              ...prev,
              notifications: { ...prev.notifications, escalationMinutes: parseInt(value) }
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return monitorData.type && monitorData.name;
      case 2:
        return monitorData.services.some(s => s.enabled);
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Add Monitor for {customerName}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && <div className={`w-16 h-0.5 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          <Button
            onClick={() => step < 3 ? setStep(step + 1) : handleSave()}
            disabled={!canProceed()}
          >
            {step < 3 ? 'Next' : 'Create Monitor'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitorSetup;
