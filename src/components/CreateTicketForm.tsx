
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ticket, Customer } from '@/types/tickets';
import { User } from '@/types/auth';
import { X, Upload, FileText } from 'lucide-react';

interface CreateTicketFormProps {
  customer: Customer;
  user: User;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ customer, user, onSubmit, onCancel }) => {
  const [ticketType, setTicketType] = useState<'general-request' | 'service-request' | 'incident-request' | ''>('');
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    priority: 'medium' as const,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const ticketTypeOptions = [
    { value: 'general-request', label: 'General Request', color: 'bg-blue-100 text-blue-800' },
    { value: 'service-request', label: 'Service Request', color: 'bg-green-100 text-green-800' },
    { value: 'incident-request', label: 'Incident Request', color: 'bg-red-100 text-red-800' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!ticketType || !formData.title || !formData.shortDescription) {
      return;
    }

    const ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: `${formData.shortDescription}\n\n${formData.longDescription}`,
      status: 'open',
      priority: formData.priority,
      category: ticketType === 'general-request' ? 'general' : 
               ticketType === 'service-request' ? 'change-request' : 'alert-incident',
      assignedTo: user.id,
      assignedBy: user.id,
      customerId: customer.id,
      customerName: customer.name,
      state: 'pending',
      requester: user.name,
      comments: [],
      resolvedAt: undefined,
      dueDate: undefined,
    };

    onSubmit(ticketData);
  };

  const selectedTicketType = ticketTypeOptions.find(option => option.value === ticketType);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Create Ticket for {customer.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Ticket Type *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ticketTypeOptions.map((option) => (
              <div
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  ticketType === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTicketType(option.value as any)}
              >
                <div className="text-center">
                  <Badge className={option.color}>
                    {option.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {ticketType && (
          <>
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Enter ticket title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description *</label>
              <Textarea
                placeholder="Brief summary of the issue or request"
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Detailed Description</label>
              <Textarea
                placeholder="Provide detailed information about the issue or request"
                value={formData.longDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                className="min-h-[120px]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-blue-600 hover:text-blue-500">
                      Click to upload files
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={!ticketType || !formData.title || !formData.shortDescription}
                className="flex-1"
              >
                Create {selectedTicketType?.label}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateTicketForm;
