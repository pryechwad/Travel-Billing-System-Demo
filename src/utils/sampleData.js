import { storage } from './storage'

export const createSampleInvoices = () => {
  const sampleInvoices = [
    {
      id: '1704067200000',
      invoiceNumber: 'TBP001234',
      date: '2024-01-15',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@email.com',
      customerPhone: '+91 98765 43210',
      customerAddress: 'MG Road, Mumbai, Maharashtra 400001',
      travelDate: '2024-02-15',
      items: [
        { tourName: 'Goa Beach Paradise - 3D/2N', qty: 2, price: 12500 }
      ],
      taxRate: 18,
      discount: 5,
      paymentMode: 'upi',
      status: 'Paid',
      advanceAmount: 20000,
      dueDate: '2024-02-14',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: '1703980800000',
      invoiceNumber: 'TBP001235',
      date: '2024-01-14',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@email.com',
      customerPhone: '+91 87654 32109',
      customerAddress: 'Connaught Place, Delhi 110001',
      travelDate: '2024-03-10',
      items: [
        { tourName: 'Kashmir Valley Tour - 5D/4N', qty: 4, price: 11250 }
      ],
      taxRate: 18,
      discount: 0,
      paymentMode: 'bank_transfer',
      status: 'Pending',
      advanceAmount: 15000,
      dueDate: '2024-03-09',
      createdAt: '2024-01-14T14:20:00.000Z'
    },
    {
      id: '1703894400000',
      invoiceNumber: 'TBP001236',
      date: '2024-01-13',
      customerName: 'Amit Singh',
      customerEmail: 'amit.singh@email.com',
      customerPhone: '+91 76543 21098',
      customerAddress: 'Brigade Road, Bangalore 560001',
      travelDate: '2024-02-28',
      items: [
        { tourName: 'Rajasthan Heritage - 7D/6N', qty: 2, price: 17500 }
      ],
      taxRate: 18,
      discount: 10,
      paymentMode: 'cash',
      status: 'Paid',
      advanceAmount: 25000,
      dueDate: '2024-02-27',
      createdAt: '2024-01-13T09:15:00.000Z'
    },
    {
      id: '1703808000000',
      invoiceNumber: 'TBP001237',
      date: '2024-01-12',
      customerName: 'Sneha Patel',
      customerEmail: 'sneha.patel@email.com',
      customerPhone: '+91 65432 10987',
      customerAddress: 'SG Highway, Ahmedabad 380001',
      travelDate: '2024-04-05',
      items: [
        { tourName: 'Kerala Backwaters - 4D/3N', qty: 3, price: 9333 }
      ],
      taxRate: 18,
      discount: 0,
      paymentMode: 'card',
      status: 'Pending',
      advanceAmount: 10000,
      dueDate: '2024-04-04',
      createdAt: '2024-01-12T16:45:00.000Z'
    },
    {
      id: '1703721600000',
      invoiceNumber: 'TBP001238',
      date: '2024-01-11',
      customerName: 'Vikram Reddy',
      customerEmail: 'vikram.reddy@email.com',
      customerPhone: '+91 54321 09876',
      customerAddress: 'Jubilee Hills, Hyderabad 500001',
      travelDate: '2024-03-20',
      items: [
        { tourName: 'Himachal Adventure - 6D/5N', qty: 2, price: 15000 }
      ],
      taxRate: 18,
      discount: 8,
      paymentMode: 'upi',
      status: 'Paid',
      advanceAmount: 18000,
      dueDate: '2024-03-19',
      createdAt: '2024-01-11T11:30:00.000Z'
    }
  ]

  // Save sample invoices to localStorage
  sampleInvoices.forEach(invoice => {
    storage.saveInvoice(invoice)
  })

  console.log('Sample invoices created successfully!')
}