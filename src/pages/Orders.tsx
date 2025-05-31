import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, FileText, Calendar, User, Package, MapPin, DollarSign, Paperclip, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import AttachmentModal from '../components/ui/AttachmentModal';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { Order } from '../types/order';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedOrderForAttachments, setSelectedOrderForAttachments] = useState<Order | null>(null);

  // Load orders from localStorage and merge with sample data
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Smith',
        phone: '+1-555-0123',
        email: 'john.smith@email.com',
        address: '123 Main St, New York, NY 10001',
        garmentType: 'Suit',
        measurements: {
          chest: 40,
          waist: 34,
          shoulder: 18,
          length: 30,
          sleeve: 24,
          neck: 16
        },
        orderDate: '2024-01-15',
        deliveryDate: '2024-02-15',
        status: 'in-progress',
        amount: 850,
        notes: 'Navy blue, slim fit',
        fabric: 'Wool blend',
        color: 'Navy Blue'
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        phone: '+1-555-0124',
        email: 'sarah.johnson@email.com',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        garmentType: 'Dress',
        measurements: {
          chest: 34,
          waist: 28,
          length: 42
        },
        orderDate: '2024-01-20',
        deliveryDate: '2024-02-20',
        status: 'pending',
        amount: 450,
        notes: 'Red evening dress',
        fabric: 'Silk',
        color: 'Red'
      },
      {
        id: 'ORD-003',
        customerName: 'Michael Brown',
        phone: '+1-555-0125',
        email: 'michael.brown@email.com',
        address: '789 Pine St, Chicago, IL 60601',
        garmentType: 'Shirt',
        measurements: {
          chest: 42,
          shoulder: 19,
          sleeve: 25,
          neck: 17
        },
        orderDate: '2024-01-10',
        deliveryDate: '2024-01-25',
        status: 'completed',
        amount: 120,
        fabric: 'Cotton',
        color: 'White'
      }
    ];
    
    // Merge stored orders with sample orders, prioritizing stored orders
    const mergedOrders = [...storedOrders, ...sampleOrders.filter(sample => 
      !storedOrders.some((stored: Order) => stored.id === sample.id)
    )];
    
    setOrders(mergedOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.garmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'delivered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;

    switch (format) {
      case 'csv':
        exportToCSV(ordersToExport, 'orders');
        break;
      case 'excel':
        exportToExcel(ordersToExport, 'orders');
        break;
      case 'pdf':
        exportToPDF(ordersToExport, 'Orders Report');
        break;
    }
    setShowExportMenu(false);
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(order => order.id)
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Order Management
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage your fashion orders, track progress, and maintain customer records
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, customers, or order IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-3">
            {selectedOrders.length > 0 && (
              <span className="flex items-center px-3 py-2 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium">
                {selectedOrders.length} selected
              </span>
            )}
            
            <div className="relative">
              <Button
                onClick={() => setShowExportMenu(!showExportMenu)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-300"
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={selectAllOrders}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Order ID</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Garment</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Attachments</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Order Date</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Delivery Date</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Amount</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                        {order.id}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {order.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">{order.garmentType}</span>
                    </div>
                    {order.color && (
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {order.color}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {order.attachments && order.attachments.length > 0 ? (
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 p-2 rounded-lg transition-colors"
                        onClick={() => setSelectedOrderForAttachments(order)}
                        title="Click to view all attachments"
                      >
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-white">
                          {order.attachments.length} file{order.attachments.length > 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-1">
                          {order.attachments.slice(0, 3).map((attachment, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (attachment.driveUrl) {
                                  window.open(attachment.driveUrl, '_blank');
                                }
                              }}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-500 rounded text-blue-600 dark:text-blue-400"
                              title={`View ${attachment.name}`}
                              disabled={!attachment.driveUrl}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ))}
                          {order.attachments.length > 3 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                              +{order.attachments.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        No attachments
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${order.amount ? order.amount.toLocaleString() : '0'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating your first order'}
            </p>
            <Button 
              onClick={() => window.location.href = '/new-order'}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Order
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => window.location.href = '/new-order'}
        icon={<Plus className="h-6 w-6" />}
      />

      {/* Attachment Modal */}
      {selectedOrderForAttachments && (
        <AttachmentModal
          isOpen={true}
          onClose={() => setSelectedOrderForAttachments(null)}
          attachments={selectedOrderForAttachments.attachments || []}
          orderInfo={{
            id: selectedOrderForAttachments.id,
            customerName: selectedOrderForAttachments.customerName
          }}
        />
      )}
    </div>
  );
}
