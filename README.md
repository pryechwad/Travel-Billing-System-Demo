# Travel Bill Pro 🧾

**Your Ultimate Solution for Professional Travel Billing**

A comprehensive travel billing and invoice management system built with React and Vite. Generate professional invoices, manage customers, and track payments with ease.

## ✨ Features

### 📊 Dashboard
- Real-time statistics (Total Revenue, Pending Payments, Completed Tours)
- Time-based filtering (Today, 7 days, 30 days, 90 days, 6 months, 1 year)
- Custom date range selection
- Recent invoices overview

### 🧾 Invoice Management
- Create professional travel invoices
- Multiple tour packages support
- GST/Tax calculations (18% default)
- Discount management
- Advance payment tracking
- Pending amount calculations
- Due date management

### 📄 Professional PDF Generation
- Company branding with logo
- Professional invoice layout
- Payment breakdown table
- Digital signature
- Amount in words conversion
- Contact information for future bookings
- Terms & conditions

### 👥 Customer Management
- Customer database
- Contact information storage
- Invoice history tracking

### 💰 Payment Tracking
- Multiple payment modes (Cash, Card, UPI, Net Banking, Cheque, Bank Transfer)
- Advance amount management
- Pending balance calculations
- Payment due dates

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd travel-billing
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **Local Storage** - Data persistence

## 📱 Features Overview

### Invoice Creation
- Add multiple tour packages
- Set traveler count and pricing
- Apply discounts and taxes
- Set advance payments and due dates

### PDF Receipt
- Professional company header
- Customer details section
- Itemized tour packages table
- Payment breakdown with advance/pending amounts
- Digital signature section
- Thank you message and contact details

### Dashboard Analytics
- Filter invoices by date ranges
- View payment statistics
- Track pending payments
- Monitor business performance

## 💼 Business Features

- **Multi-currency support** (₹ INR)
- **GST compliance** (CGST/SGST breakdown)
- **Professional branding** (Travel Bill Pro)
- **Customer relationship management**
- **Payment tracking and reminders**
- **Business analytics and reporting**

## 🎨 UI/UX Features

- **Responsive design** - Works on all devices
- **Modern interface** - Clean and professional
- **Intuitive navigation** - Easy to use
- **Real-time updates** - Instant calculations
- **Professional theming** - Blue gradient design

## 📊 Sample Data

The application includes sample invoice data for testing:
- Pre-loaded customer information
- Sample tour packages
- Payment history examples
- Various invoice statuses

## 🔧 Configuration

### Company Branding
Update company details in:
- `src/utils/pdfGenerator.js` - PDF header information
- `src/components/Dashboard.jsx` - Company name and tagline
- `src/components/Sidebar.jsx` - Logo and branding

### Tour Packages
Customize tour packages in:
- `src/components/InvoiceForm.jsx` - Available tour options
- `src/utils/sampleData.js` - Sample tour data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


---

**Travel Bill Pro** - *Your Ultimate Solution for Professional Travel Billing* 🚀
