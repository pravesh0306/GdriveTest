import React, { useState } from 'react';
import { Save, ArrowLeft, User, Package, Ruler, Calendar, DollarSign, FileText, MapPin, Phone, Mail, Palette, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import DragDropUpload from '../components/ui/DragDropUpload';
import AttachmentGrid from '../components/ui/AttachmentGrid';

interface MeasurementField {
  key: string;
  label: string;
  placeholder: string;
}

const GARMENT_MEASUREMENTS: Record<string, MeasurementField[]> = {
  'Suit': [
    { key: 'chest', label: 'Chest', placeholder: 'e.g., 40' },
    { key: 'waist', label: 'Waist', placeholder: 'e.g., 34' },
    { key: 'shoulder', label: 'Shoulder', placeholder: 'e.g., 18' },
    { key: 'length', label: 'Length', placeholder: 'e.g., 30' },
    { key: 'sleeve', label: 'Sleeve', placeholder: 'e.g., 24' },
    { key: 'neck', label: 'Neck', placeholder: 'e.g., 16' },
  ],
  'Dress': [
    { key: 'chest', label: 'Bust/Chest', placeholder: 'e.g., 34' },
    { key: 'waist', label: 'Waist', placeholder: 'e.g., 28' },
    { key: 'hips', label: 'Hips', placeholder: 'e.g., 36' },
    { key: 'length', label: 'Length', placeholder: 'e.g., 42' },
    { key: 'shoulder', label: 'Shoulder', placeholder: 'e.g., 14' },
  ],
  'Shirt': [
    { key: 'chest', label: 'Chest', placeholder: 'e.g., 42' },
    { key: 'shoulder', label: 'Shoulder', placeholder: 'e.g., 19' },
    { key: 'sleeve', label: 'Sleeve', placeholder: 'e.g., 25' },
    { key: 'neck', label: 'Neck', placeholder: 'e.g., 17' },
    { key: 'length', label: 'Length', placeholder: 'e.g., 28' },
  ],
  'Blouse': [
    { key: 'chest', label: 'Bust/Chest', placeholder: 'e.g., 36' },
    { key: 'waist', label: 'Waist', placeholder: 'e.g., 30' },
    { key: 'shoulder', label: 'Shoulder', placeholder: 'e.g., 15' },
    { key: 'sleeve', label: 'Sleeve', placeholder: 'e.g., 22' },
    { key: 'length', label: 'Length', placeholder: 'e.g., 24' },
  ],
  'Trousers': [
    { key: 'waist', label: 'Waist', placeholder: 'e.g., 32' },
    { key: 'hips', label: 'Hips', placeholder: 'e.g., 38' },
    { key: 'inseam', label: 'Inseam', placeholder: 'e.g., 30' },
    { key: 'outseam', label: 'Outseam', placeholder: 'e.g., 42' },
    { key: 'thigh', label: 'Thigh', placeholder: 'e.g., 24' },
  ],
  'Skirt': [
    { key: 'waist', label: 'Waist', placeholder: 'e.g., 28' },
    { key: 'hips', label: 'Hips', placeholder: 'e.g., 36' },
    { key: 'length', label: 'Length', placeholder: 'e.g., 24' },
  ],
};

const GARMENT_TYPES = Object.keys(GARMENT_MEASUREMENTS);

export default function NewOrder() {
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    phone: '',
    email: '',
    address: '',
    
    // Order Details
    garmentType: '',
    fabric: '',
    color: '',
    amount: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    
    // Measurements
    measurements: {} as Record<string, number>,
    
    // Additional Information
    notes: '',
    
    // Uploaded Files
    attachments: [] as Array<{
      name: string;
      size: string;
      type: string;
      file: File;
    }>,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: numValue
      }
    }));
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'application/octet-stream',
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.garmentType) newErrors.garmentType = 'Please select a garment type';
    if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (!formData.amount) newErrors.amount = 'Order amount is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Date validation
    if (formData.deliveryDate && formData.deliveryDate <= formData.orderDate) {
      newErrors.deliveryDate = 'Delivery date must be after order date';
    }

    // Amount validation
    if (formData.amount && (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0)) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Create order object
    const newOrder = {
      id: orderId,
      ...formData,
      amount: Number(formData.amount),
      status: 'pending' as const,
      attachments: formData.attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        driveUrl: (file as any).driveUrl || null,
        uploadedAt: new Date().toISOString()
      }))
    };

    // In a real app, this would save to a database
    console.log('New Order:', newOrder);
    
    // Save to localStorage for demo
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Show success message
    alert(`Order ${orderId} created successfully!`);
    
    // Redirect to orders page
    window.location.href = '/orders';
  };

  const measurementFields = formData.garmentType ? GARMENT_MEASUREMENTS[formData.garmentType] || [] : [];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Create New Order
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Add a new fashion order with customer details and measurements
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Customer Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Customer Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Customer Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  placeholder="Enter customer full name"
                />
              </div>
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  placeholder="+1-555-0123"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  placeholder="customer@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Enter customer address"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Order Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Garment Type *
              </label>
              <select
                value={formData.garmentType}
                onChange={(e) => handleInputChange('garmentType', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.garmentType ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                }`}
              >
                <option value="">Select garment type</option>
                {GARMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.garmentType && <p className="mt-1 text-sm text-red-600">{errors.garmentType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fabric
              </label>
              <input
                type="text"
                value={formData.fabric}
                onChange={(e) => handleInputChange('fabric', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Cotton, Silk, Wool"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Color
              </label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Navy Blue, Red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Order Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange('orderDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Delivery Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.deliveryDate ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                />
              </div>
              {errors.deliveryDate && <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Order Amount ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>
          </div>
        </div>

        {/* Measurements */}
        {measurementFields.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Ruler className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Measurements (inches)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurementFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.measurements[field.key] || ''}
                      onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Additional Information
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes & Special Instructions
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Add any special instructions, design preferences, or additional notes..."
            />
          </div>
        </div>

        {/* File Attachments */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Design References & Attachments
            </h2>
          </div>

          <div className="space-y-4">
            <DragDropUpload
              onUpload={handleFileUpload}
              maxSize={10}
              acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
            />

            {/* Display uploaded files */}
            <AttachmentGrid
              attachments={formData.attachments}
              onRemove={removeAttachment}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}
