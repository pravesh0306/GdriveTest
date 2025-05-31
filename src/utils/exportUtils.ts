import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Order } from '../types/order';

// Convert Order to flattened format for export
const convertOrderForExport = (order: Order) => ({
  id: order.id,
  firstName: order.customerName?.split(' ')[0] || order.firstName || '',
  lastName: order.customerName?.split(' ').slice(1).join(' ') || order.lastName || '',
  email: order.email,
  phone: order.phone,
  dressType: order.garmentType || order.dressType || '',
  description: order.notes || order.description || '',
  status: order.status,
  createdAt: order.orderDate || order.createdAt || new Date().toISOString().split('T')[0]
});

// Export to CSV
export const exportToCSV = (data: Order[], filename: string) => {
  const exportData = data.map(convertOrderForExport);
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, `${filename}.csv`);
};

// Export to Excel
export const exportToExcel = (data: Order[], filename: string) => {
  const exportData = data.map(convertOrderForExport);
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Export to PDF
export const exportToPDF = (data: Order[], title: string = 'Orders Report') => {
  const exportData = data.map(convertOrderForExport);
  const doc = new jsPDF();
  
  // Define the table columns
  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Dress Type', dataKey: 'dressType' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Created', dataKey: 'created' },
  ];
  
  // Format the data for the table
  const tableData = exportData.map(order => ({
    name: `${order.firstName} ${order.lastName}`,
    email: order.email,
    dressType: order.dressType,
    status: order.status,
    created: new Date(order.createdAt).toLocaleDateString()
  }));

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);
  
  // @ts-ignore - TypeScript doesn't recognize the autotable plugin
  doc.autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: tableData.map(item => [
      item.name,
      item.email,
      item.dressType,
      item.status,
      item.created
    ]),
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text('Fashion Order Management System', 14, (doc as any).internal.pageSize.height - 10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      (doc as any).internal.pageSize.width - 30,
      (doc as any).internal.pageSize.height - 10
    );
  }
  
  doc.save('orders-report.pdf');
};
