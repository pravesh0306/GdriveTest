// Order type definitions for the Fashion Order Management system

export interface Order {
  id: string;
  customerName: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  address?: string;
  garmentType: string;
  dressType?: string;
  dressCategory?: string;
  description?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    shoulder?: number;
    length?: number;
    sleeve?: number;
    neck?: number;
    [key: string]: number | undefined;
  };
  orderDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
  priority?: 'low' | 'normal' | 'high';
  amount?: number;
  totalAmount?: number;
  notes?: string;
  fabric?: string;
  color?: string;
  attachments?: Array<{
    name: string;
    size: number | string;
    type: string;
    driveUrl?: string;
    uploadedAt?: string;
  }>;
}

// For export utilities compatibility - flattened structure
export interface OrderData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dressType: string;
  description: string;
  status: string;
  createdAt: string;
}

// Form data interface for new orders
export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dressType: string;
  dressCategory?: string;
  description: string;
  deliveryDate?: string;
  priority: 'low' | 'normal' | 'high';
  measurements?: {
    [key: string]: {
      size: string;
      type: string;
    };
  };
}
