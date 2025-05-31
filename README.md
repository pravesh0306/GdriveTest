# Fashion Order Management System

A modern, responsive web application for managing fashion orders and measurements. Built with React, TypeScript, and Tailwind CSS.

## Features

### 📋 Order Management
- View all orders with search and filtering capabilities
- Create new orders with detailed customer information
- Track order status (Pending, In Progress, Completed, Cancelled)
- Export orders to CSV, Excel, or PDF formats

### 👤 Customer Management
- Store customer details (name, contact information)
- Maintain measurement records
- Order history tracking

### 📊 Dashboard & Analytics
- Admin dashboard with key metrics
- Order statistics and trends
- Recent orders overview
- Performance indicators

### 📱 Modern UI/UX
- Responsive design that works on all devices
- Dark/Light mode toggle
- Clean, professional interface
- Intuitive navigation

### 💾 Data Management
- Local storage for demo purposes
- Export functionality for data backup
- Data persistence across sessions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Export Libraries**: 
  - jsPDF for PDF generation
  - xlsx for Excel exports
  - file-saver for downloads

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pravesh0306/GdriveTest.git
cd "Test 01"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardHeader.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Dashboard.tsx
│   │   └── SiteFooter.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── FloatingActionButton.tsx
│       └── StorageAlertBar.tsx
├── pages/
│   ├── Orders.tsx
│   ├── NewOrder.tsx
│   └── AdminDashboard.tsx
├── types/
│   └── order.ts
├── utils/
│   ├── exportUtils.ts
│   └── pdfGenerator.ts
├── App.tsx
└── main.tsx
```

## Deployment

This application is ready for deployment on various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. The `vercel.json` configuration is already included
3. Deploy with automatic CI/CD

### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

---

**Repository**: [GitHub](https://github.com/pravesh0306/GdriveTest)
# Force deployment trigger
Sat May 31 03:28:21 +04 2025: Force sync with latest code
