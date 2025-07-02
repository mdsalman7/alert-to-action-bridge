
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Mail, MessageSquare, Users, Calendar } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  configured: boolean;
  settings: Record<string, any>;
}

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'keka',
      name: 'Keka HR',
      description: 'Sync employee data and attendance information',
      icon: <Users className="h-5 w-5" />,
      enabled: false,
      configured: false,
      settings: {
        apiUrl: '',
        apiKey: '',
        syncInterval: '24'
      }
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Send email notifications and calendar updates',
      icon: <Mail className="h-5 w-5" />,
      enabled: true,
      configured: true,
      settings: {
        smtpServer: 'smtp.office365.com',
        port: '587',
        username: '',
        password: ''
      }
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Send notifications to Teams channels',
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: false,
      configured: false,
      settings: {
        webhookUrl: '',
        defaultChannel: ''
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send alerts and notifications to Slack channels',
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: true,
      configured: true,
      settings: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        defaultChannel: '#alerts'
      }
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  const handleUpdateSettings = (integrationId: string, newSettings: Record<string, any>) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, settings: newSettings, configured: true }
        : integration
    ));
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Configure integrations with external services to enhance your workflow.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {integration.icon}
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                      <div className="flex gap-1">
                        <Badge variant={integration.configured ? "secondary" : "destructive"}>
                          {integration.configured ? "Configured" : "Not Configured"}
                        </Badge>
                        <Badge variant={integration.enabled ? "default" : "outline"}>
                          {integration.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedIntegration(integration)}
                  >
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Modal/Panel */}
      {selectedIntegration && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedIntegration.icon}
                Configure {selectedIntegration.name}
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedIntegration(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(selectedIntegration.settings).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium mb-2 block capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Input
                    type={key.includes('password') || key.includes('key') ? 'password' : 'text'}
                    placeholder={`Enter ${key}`}
                    defaultValue={value}
                    onChange={(e) => {
                      const newSettings = {
                        ...selectedIntegration.settings,
                        [key]: e.target.value
                      };
                      setSelectedIntegration({
                        ...selectedIntegration,
                        settings: newSettings
                      });
                    }}
                  />
                </div>
              ))}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleUpdateSettings(selectedIntegration.id, selectedIntegration.settings)}
                >
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegrationSettings;
