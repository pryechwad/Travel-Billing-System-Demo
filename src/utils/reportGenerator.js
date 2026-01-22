import jsPDF from 'jspdf'

export const generateReportPDF = (invoices, dateRange, companyName, companyDetails) => {
  const pdf = new jsPDF()
  
  // Header with company branding
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.3)
  pdf.rect(10, 10, 190, 277)
  
  // Company Header
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text(companyName || 'TRAVEL BILL PRO', 105, 25, { align: 'center' })
  
  pdf.setFontSize(12)
  pdf.text('BUSINESS REPORT', 105, 35, { align: 'center' })
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Report Period: ${dateRange}`, 105, 45, { align: 'center' })
  pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 105, 52, { align: 'center' })
  
  // Calculate comprehensive stats
  const stats = calculateReportStats(invoices)
  
  // Summary Section with professional table
  let yPos = 65
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EXECUTIVE SUMMARY', 15, yPos)
  
  yPos += 10
  // Summary table with borders
  pdf.setLineWidth(0.2)
  pdf.setFillColor(240, 240, 240)
  
  // Summary table headers
  pdf.rect(15, yPos, 85, 8, 'F')
  pdf.rect(100, yPos, 85, 8, 'F')
  pdf.rect(15, yPos, 85, 8)
  pdf.rect(100, yPos, 85, 8)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('METRIC', 17, yPos + 5)
  pdf.text('VALUE', 102, yPos + 5)
  
  // Summary data rows
  const summaryData = [
    ['Total Invoices', stats.totalInvoices.toString()],
    ['Total Revenue', `Rs.${stats.totalRevenue.toLocaleString('en-IN')}`],
    ['Paid Amount', `Rs.${stats.paidAmount.toLocaleString('en-IN')}`],
    ['Pending Amount', `Rs.${stats.pendingAmount.toLocaleString('en-IN')}`],
    ['Completed Tours', stats.completedTours.toString()],
    ['Pending Tours', stats.pendingTours.toString()]
  ]
  
  pdf.setFont('helvetica', 'normal')
  summaryData.forEach((row, index) => {
    yPos += 8
    if (index % 2 === 1) {
      pdf.setFillColor(248, 248, 248)
      pdf.rect(15, yPos, 170, 8, 'F')
    }
    pdf.rect(15, yPos, 85, 8)
    pdf.rect(100, yPos, 85, 8)
    pdf.text(row[0], 17, yPos + 5)
    pdf.text(row[1], 102, yPos + 5)
  })
  
  // Invoice Details Table
  yPos += 20
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DETAILED INVOICE REPORT', 15, yPos)
  
  yPos += 10
  // Table headers with professional styling
  pdf.setFillColor(220, 220, 220)
  pdf.rect(15, yPos, 25, 10, 'F')
  pdf.rect(40, yPos, 30, 10, 'F')
  pdf.rect(70, yPos, 45, 10, 'F')
  pdf.rect(115, yPos, 35, 10, 'F')
  pdf.rect(150, yPos, 25, 10, 'F')
  pdf.rect(175, yPos, 25, 10, 'F')
  
  pdf.setLineWidth(0.2)
  pdf.rect(15, yPos, 25, 10)
  pdf.rect(40, yPos, 30, 10)
  pdf.rect(70, yPos, 45, 10)
  pdf.rect(115, yPos, 35, 10)
  pdf.rect(150, yPos, 25, 10)
  pdf.rect(175, yPos, 25, 10)
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Invoice No', 17, yPos + 6)
  pdf.text('Date', 42, yPos + 6)
  pdf.text('Customer', 72, yPos + 6)
  pdf.text('Amount', 117, yPos + 6)
  pdf.text('Paid', 152, yPos + 6)
  pdf.text('Status', 177, yPos + 6)
  
  yPos += 10
  pdf.setFont('helvetica', 'normal')
  
  invoices.forEach((invoice, index) => {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    
    const amount = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
    const discount = (amount * (invoice.discount || 0)) / 100
    const taxableAmount = amount - discount
    const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
    const total = taxableAmount + tax
    const paidAmount = invoice.advanceAmount || 0
    
    // Alternating row colors
    if (index % 2 === 1) {
      pdf.setFillColor(248, 248, 248)
      pdf.rect(15, yPos, 185, 8, 'F')
    }
    
    // Table borders
    pdf.rect(15, yPos, 25, 8)
    pdf.rect(40, yPos, 30, 8)
    pdf.rect(70, yPos, 45, 8)
    pdf.rect(115, yPos, 35, 8)
    pdf.rect(150, yPos, 25, 8)
    pdf.rect(175, yPos, 25, 8)
    
    // Data
    pdf.setFontSize(7)
    pdf.text(invoice.invoiceNumber, 17, yPos + 5)
    pdf.text(new Date(invoice.date).toLocaleDateString('en-IN'), 42, yPos + 5)
    pdf.text(invoice.customerName.substring(0, 18), 72, yPos + 5)
    pdf.text(`Rs.${Math.round(total).toLocaleString('en-IN')}`, 117, yPos + 5)
    pdf.text(`Rs.${paidAmount.toLocaleString('en-IN')}`, 152, yPos + 5)
    pdf.text(invoice.status || 'Pending', 177, yPos + 5)
    
    yPos += 8
  })
  
  return pdf
}

const calculateReportStats = (invoices) => {
  let totalRevenue = 0
  let paidAmount = 0
  let pendingAmount = 0
  let completedTours = 0
  let pendingTours = 0
  
  invoices.forEach(invoice => {
    const amount = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
    const discount = (amount * (invoice.discount || 0)) / 100
    const taxableAmount = amount - discount
    const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
    const total = taxableAmount + tax
    const paid = invoice.advanceAmount || 0
    
    totalRevenue += total
    paidAmount += paid
    pendingAmount += (total - paid)
    
    if (invoice.status === 'Paid') {
      completedTours++
    } else {
      pendingTours++
    }
  })
  
  return {
    totalInvoices: invoices.length,
    totalRevenue,
    paidAmount,
    pendingAmount,
    completedTours,
    pendingTours
  }
}

export const generateReportExcel = (invoices, dateRange) => {
  // Calculate summary stats
  const stats = calculateReportStats(invoices)
  
  // Create summary data
  const summaryData = [
    ['BUSINESS REPORT SUMMARY', ''],
    ['Report Period', dateRange],
    ['Generated On', new Date().toLocaleDateString('en-IN') + ' at ' + new Date().toLocaleTimeString('en-IN')],
    ['', ''],
    ['EXECUTIVE SUMMARY', ''],
    ['Total Invoices', stats.totalInvoices],
    ['Total Revenue', `Rs.${stats.totalRevenue.toLocaleString('en-IN')}`],
    ['Paid Amount', `Rs.${stats.paidAmount.toLocaleString('en-IN')}`],
    ['Pending Amount', `Rs.${stats.pendingAmount.toLocaleString('en-IN')}`],
    ['Completed Tours', stats.completedTours],
    ['Pending Tours', stats.pendingTours],
    ['', ''],
    ['DETAILED INVOICE DATA', '']
  ]
  
  // Create detailed invoice data
  const invoiceData = invoices.map(invoice => {
    const amount = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
    const discount = (amount * (invoice.discount || 0)) / 100
    const taxableAmount = amount - discount
    const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
    const total = taxableAmount + tax
    
    return {
      'Invoice Number': invoice.invoiceNumber,
      'Date': new Date(invoice.date).toLocaleDateString('en-IN'),
      'Customer Name': invoice.customerName,
      'Customer Email': invoice.customerEmail || '',
      'Customer Phone': invoice.customerPhone || '',
      'Customer Address': invoice.customerAddress || '',
      'Tour Package': invoice.items[0]?.tourName || '',
      'Travelers': invoice.items.reduce((sum, item) => sum + item.qty, 0),
      'Subtotal': `Rs.${amount.toLocaleString('en-IN')}`,
      'Discount (%)': invoice.discount || 0,
      'Discount Amount': `Rs.${discount.toLocaleString('en-IN')}`,
      'Tax Rate (%)': invoice.taxRate || 0,
      'Tax Amount': `Rs.${tax.toLocaleString('en-IN')}`,
      'Total Amount': `Rs.${total.toLocaleString('en-IN')}`,
      'Advance Amount': `Rs.${(invoice.advanceAmount || 0).toLocaleString('en-IN')}`,
      'Pending Amount': `Rs.${(total - (invoice.advanceAmount || 0)).toLocaleString('en-IN')}`,
      'Status': invoice.status || 'Pending',
      'Payment Mode': invoice.paymentMode || '',
      'Travel Date': invoice.travelDate ? new Date(invoice.travelDate).toLocaleDateString('en-IN') : '',
      'Due Date': invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : ''
    }
  })
  
  // Combine summary and detailed data
  const allData = [...summaryData, ...invoiceData.map(row => Object.values(row))]
  
  // Create headers for detailed data
  const detailedHeaders = invoiceData.length > 0 ? Object.keys(invoiceData[0]) : []
  
  // Create CSV content
  let csvContent = ''
  
  // Add summary section
  summaryData.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
  })
  
  // Add detailed data headers and rows
  if (invoiceData.length > 0) {
    csvContent += detailedHeaders.map(header => `"${header}"`).join(',') + '\n'
    invoiceData.forEach(row => {
      const values = detailedHeaders.map(header => `"${row[header]}"`)
      csvContent += values.join(',') + '\n'
    })
  } else {
    csvContent += '"No invoice data available for the selected period"\n'
  }
  
  downloadCSV(csvContent, `Business_Report_${new Date().toISOString().split('T')[0]}.csv`)
}

const convertToCSV = (data) => {
  if (!data.length) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? `"${value}"` : value
    })
    csvRows.push(values.join(','))
  })
  
  return csvRows.join('\n')
}

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const downloadReportPDF = (invoices, dateRange, companyName, companyDetails) => {
  const pdf = generateReportPDF(invoices, dateRange, companyName, companyDetails)
  const timestamp = new Date().getTime()
  pdf.save(`Business_Report_${timestamp}.pdf`)
}