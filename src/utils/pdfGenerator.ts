import { jsPDF } from 'jspdf';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dressType: string;
  dressCategory?: string;
  description: string;
  deliveryDate?: string;
  createdAt: string;
  status: string;
  measurements: {
    chest: string;
    waist: string;
    hip: string;
  };
  attachments: Array<{
    name: string;
    size: string;
    type: string;
  }>;
}

export const generateOrderPDF = (order: OrderData): jsPDF => {
  const doc = new jsPDF();
  const title = `Order: ${order.firstName} ${order.lastName}`;
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  
  // Customer info section
  doc.setFontSize(12);
  doc.text('Customer Information', 20, 35);
  doc.setFontSize(10);
  doc.text(`Name: ${order.firstName} ${order.lastName}`, 25, 45);
  doc.text(`Email: ${order.email}`, 25, 52);
  doc.text(`Phone: ${order.phone || 'N/A'}`, 25, 59);
  doc.text(`Created Date: ${new Date(order.createdAt).toLocaleDateString()}`, 25, 66);
  doc.text(`Status: ${order.status}`, 25, 73);
  
  // Order details
  doc.setFontSize(12);
  doc.text('Order Details', 20, 85);
  doc.setFontSize(10);
  doc.text(`Dress Type: ${order.dressType}`, 25, 95);
  doc.text(`Category: ${order.dressCategory || 'N/A'}`, 25, 102);
  doc.text(`Delivery Date: ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not specified'}`, 25, 109);
  
  // Description with text wrapping
  doc.setFontSize(12);
  doc.text('Description', 20, 125);
  doc.setFontSize(10);
  
  const splitDescription = doc.splitTextToSize(order.description, 160);
  doc.text(splitDescription, 25, 135);
  
  // Measurements
  let yPosition = 135 + splitDescription.length * 7 + 10;
  doc.setFontSize(12);
  doc.text('Measurements', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.text(`Chest: ${order.measurements.chest}"`, 25, yPosition);
  yPosition += 7;
  doc.text(`Waist: ${order.measurements.waist}"`, 25, yPosition);
  yPosition += 7;
  doc.text(`Hip: ${order.measurements.hip}"`, 25, yPosition);
  
  // Attachments
  if (order.attachments && order.attachments.length > 0) {
    yPosition += 15;
    doc.setFontSize(12);
    doc.text('Attachments', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    order.attachments.forEach((attachment, index) => {
      doc.text(`${index + 1}. ${attachment.name} (${attachment.size})`, 25, yPosition);
      yPosition += 7;
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.text('Fashion Order Management System', 20, 280);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 130, 280);
  
  return doc;
};

export default generateOrderPDF;
