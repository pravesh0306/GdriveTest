import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  monthlyRevenue: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  garmentType: string;
  amount: number;
  status: string;
  orderDate: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Sample data - in real app, this would come from an API
  useEffect(() => {
    // Mock dashboard statistics
    const mockStats: DashboardStats = {
      totalOrders: 156,
      totalRevenue: 78420,
      totalCustomers: 89,
      pendingOrders: 12,
      completedOrders: 134,
      inProgressOrders: 10,
      monthlyRevenue: 15680,
      averageOrderValue: 503,
    };

    const mockRecentOrders: RecentOrder[] = [
      {
        id: 'ORD-001',
        customerName: 'John Smith',
        garmentType: 'Suit',
        amount: 850,
        status: 'in-progress',
        orderDate: '2024-01-15'
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        garmentType: 'Dress',
        amount: 450,
        status: 'pending',
        orderDate: '2024-01-20'
      },
      {
        id: 'ORD-003',
        customerName: 'Michael Brown',
        garmentType: 'Shirt',
        amount: 120,
        status: 'completed',
        orderDate: '2024-01-10'
      },
      {
        id: 'ORD-004',
        customerName: 'Emily Davis',
        garmentType: 'Blouse',
        amount: 280,
        status: 'in-progress',
        orderDate: '2024-01-18'
      },
      {
        id: 'ORD-005',
        customerName: 'David Wilson',
        garmentType: 'Trousers',
        amount: 220,
        status: 'completed',
        orderDate: '2024-01-12'
      }
    ];

    setStats(mockStats);
    setRecentOrders(mockRecentOrders);
  }, [selectedPeriod]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'delivered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color 
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down';
    trendValue?: string;
    color: string;
  }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {typeof value === 'number' && title.includes('Revenue') 
              ? `$${value.toLocaleString()}` 
              : value.toLocaleString()
            }
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{trendValue}</span>
              <span className="text-sm text-slate-500">vs last {selectedPeriod}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Overview of your fashion business performance and metrics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          trend="up"
          trendValue="+12%"
          color="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
        />
        
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          trend="up"
          trendValue="+8%"
          color="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
        />
        
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend="up"
          trendValue="+15%"
          color="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
        />
        
        <StatCard
          title="Average Order Value"
          value={`$${stats.averageOrderValue}`}
          icon={BarChart3}
          trend="up"
          trendValue="+3%"
          color="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Pending Orders
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.pendingOrders}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Awaiting confirmation
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              In Progress
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.inProgressOrders}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Currently being worked on
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Completed Orders
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.completedOrders}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Successfully delivered
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Recent Orders
            </h2>
            <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Order ID</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Customer</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Garment</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Amount</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                      {order.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {order.customerName}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-900 dark:text-white">
                      {order.garmentType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${order.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900 dark:text-white">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="p-4 bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg border border-indigo-200 dark:border-indigo-700 transition-colors group">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200">
              View All Orders
            </span>
          </div>
        </button>

        <button className="p-4 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg border border-green-200 dark:border-green-700 transition-colors group">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200">
              Customer List
            </span>
          </div>
        </button>

        <button className="p-4 bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg border border-purple-200 dark:border-purple-700 transition-colors group">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200">
              Analytics
            </span>
          </div>
        </button>

        <button className="p-4 bg-orange-50 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-800 rounded-lg border border-orange-200 dark:border-orange-700 transition-colors group">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-orange-700 dark:text-orange-300 group-hover:text-orange-800 dark:group-hover:text-orange-200">
              Revenue Report
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
