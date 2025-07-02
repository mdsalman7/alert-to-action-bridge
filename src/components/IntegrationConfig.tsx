
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Cloud, Database, Shield, Bell } from 'lucide-react';

interface IntegrationConfigProps {
  autoTicketEnabled: boolean;
  onToggleAutoTicket: (enabled: boolean) => void;
}

const IntegrationConfig: React.FC<IntegrationConfigProps> = ({
  autoTicketEnabled,
  onToggleAutoTicket
}) => {
  const [awsConfig, setAwsConfig] = useState({
    accessKey: '',
    secretKey: '',
    region: 'us-east-1',
    connected: false
  });

  const [azureConfig, setAzureConfig] = useState({
    clientId: '',
    clientSecret: '',
    tenantId: '',
    connected: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    webhookUrl: ''
  });

  const integrations = [
    {
      name: 'Amazon Web Services',
      icon: Cloud,
      status: awsConfig.connected ? 'connected' : 'disconnected',
      description: 'Monitor EC2, RDS, Lambda, and other AWS services'
    },
    {
      name: 'Microsoft Azure',
      icon: Cloud,
      status: azureConfig.connected ? 'connected' : 'disconnected',
      description: 'Monitor VMs, SQL Database, and Azure services'
    },
    {
      name: 'Google Cloud Platform',
      icon: Cloud,
      status: 'disconnected',
      description: 'Monitor Compute Engine, Cloud SQL, and GCP services'
    },
    {
      name: 'On-Premises',
      icon: Database,
      status: 'disconnected',
      description: 'Monitor on-premises servers and infrastructure'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Ticket Creation</h3>
              <p className="text-sm text-gray-600">Auto-create tickets from critical alerts</p>
            </div>
            <Switch
              checked={autoTicketEnabled}
              onCheckedChange={onToggleAutoTicket}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Alert Assignment</h3>
              <p className="text-sm text-gray-600">Auto-assign alerts based on resource ownership</p>
            </div>
            <Switch checked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SLA Monitoring</h3>
              <p className="text-sm text-gray-600">Track and notify on SLA breaches</p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Cloud Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Provider Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <integration.icon className="h-8 w-8 text-gray-600" />
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.status === 'connected' ? 'secondary' : 'outline'}>
                    {integration.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AWS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AWS Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Access Key ID</label>
              <Input
                type="password"
                placeholder="Enter AWS Access Key"
                value={awsConfig.accessKey}
                onChange={(e) => setAwsConfig(prev => ({ ...prev, accessKey: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Secret Access Key</label>
              <Input
                type="password"
                placeholder="Enter AWS Secret Key"
                value={awsConfig.secretKey}
                onChange={(e) => setAwsConfig(prev => ({ ...prev, secretKey: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Default Region</label>
              <Input
                placeholder="us-east-1"
                value={awsConfig.region}
                onChange={(e) => setAwsConfig(prev => ({ ...prev, region: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={() => setAwsConfig(prev => ({ ...prev, connected: !prev.connected }))}>
            {awsConfig.connected ? 'Disconnect' : 'Test Connection'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive email alerts for critical issues</p>
            </div>
            <Switch
              checked={notificationSettings.emailAlerts}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-600">Receive SMS for critical alerts</p>
            </div>
            <Switch
              checked={notificationSettings.smsAlerts}
              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsAlerts: checked }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Webhook URL</label>
            <Input
              placeholder="https://your-webhook-url.com/alerts"
              value={notificationSettings.webhookUrl}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Session Timeout</h3>
              <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
            </div>
            <Switch checked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Audit Logging</h3>
              <p className="text-sm text-gray-600">Log all user actions for compliance</p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationConfig;
