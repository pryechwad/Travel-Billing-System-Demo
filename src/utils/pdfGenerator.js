import jsPDF from 'jspdf'

export const generateInvoicePDF = (invoice, logo = null, companyName = 'Travel Bill Pro', companyDetails = {}) => {
  const pdf = new jsPDF()
  
  // Get company details with fallbacks
  const company = {
    name: companyName || 'TRAVEL BILL PRO',
    address: companyDetails.address || 'Mumbai, Maharashtra 400001',
    gstin: companyDetails.gstin || '27ABCDE1234F1Z5',
    email: companyDetails.email || 'info@travelbillpro.com',
    website: companyDetails.website || 'www.travelbillpro.com',
    phone: companyDetails.phone || '+91-9876543210',
    placeOfSupply: companyDetails.placeOfSupply || 'Maharashtra (27)',
    bankName: companyDetails.bankName || 'HDFC Bank',
    accountHolder: companyDetails.accountHolder || companyName || 'TRAVEL BILL PRO',
    accountNumber: companyDetails.accountNumber || '50200095881711',
    ifscCode: companyDetails.ifscCode || 'HDFC0001913',
    branch: companyDetails.branch, // No fallback - only show if user provided
    mmid: companyDetails.mmid, // No fallback - only show if user provided
    accountType: companyDetails.accountType // No fallback - only show if user provided
  }
  
  // Main border - thin line
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.3)
  pdf.rect(10, 10, 190, 277)
  
  // Logo on left side - 60x60 size, properly centered
  if (logo) {
    try {
      pdf.addImage(logo, 'JPEG', 15, 12, 60, 60)
    } catch (error) {
      console.log('Logo error:', error)
    }
  }
  
  // Company name - positioned next to logo with adjusted spacing
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(company.name, logo ? 80 : 15, 25)
  
  // Company details - positioned under company name with adjusted spacing
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  let detailsX = logo ? 80 : 15
  pdf.text(company.address, detailsX, 32)
  pdf.text(`GSTIN: ${company.gstin}`, detailsX, 38)
  pdf.text(`Email: ${company.email}`, detailsX, 44)
  pdf.text(`Phone: ${company.phone}`, detailsX, 50)
  
  // TAX INVOICE title - positioned on right
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('TAX INVOICE', 190, 35, { align: 'right' })
  
  // Invoice details table - thin borders
  let yPos = 60
  pdf.setLineWidth(0.2)
  
  // Create one big box for all invoice details
  pdf.rect(10, yPos, 95, 26)
  pdf.rect(105, yPos, 95, 26)
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  
  // Row 1: # and Place of Supply
  pdf.text('#', 12, yPos + 5)
  pdf.text(`: ${invoice.invoiceNumber || 'TG-INV/25-26/010'}`, 60, yPos + 5)
  pdf.text('Place Of Supply', 107, yPos + 5)
  pdf.text(`: ${company.placeOfSupply}`, 160, yPos + 5)
  
  // Row 2: Invoice Date (reduced spacing)
  yPos += 6
  pdf.text('Invoice Date', 12, yPos + 5)
  pdf.text(`: ${new Date(invoice.date).toLocaleDateString('en-GB')}`, 60, yPos + 5)
  
  // Row 3: Terms (reduced spacing)
  yPos += 6
  pdf.text('Terms', 12, yPos + 5)
  pdf.text(': Due on Receipt', 60, yPos + 5)
  
  // Row 4: Due Date (reduced spacing)
  yPos += 6
  pdf.text('Due Date', 12, yPos + 5)
  pdf.text(`: ${new Date(invoice.dueDate || invoice.date).toLocaleDateString('en-GB')}`, 60, yPos + 5)
  
  // Bill To and Ship To
  yPos += 12
  pdf.rect(10, yPos, 95, 8)
  pdf.rect(105, yPos, 95, 8)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bill To', 12, yPos + 5)
  pdf.text('Ship To', 107, yPos + 5)
  
  // Customer details - properly formatted
  yPos += 8
  pdf.rect(10, yPos, 95, 24)
  pdf.rect(105, yPos, 95, 24)
  pdf.setFont('helvetica', 'normal')
  
  // Format customer details for Bill To
  const customerName = invoice.customerName || 'Customer Name'
  const customerEmail = invoice.customerEmail || ''
  const customerPhone = invoice.customerPhone || ''
  const customerAddress = invoice.customerAddress || 'Address'
  
  // Bill To section
  let billToY = yPos + 6
  pdf.text(customerName, 12, billToY)
  billToY += 4
  
  if (customerEmail) {
    pdf.text(customerEmail, 12, billToY)
    billToY += 4
  }
  
  if (customerPhone) {
    pdf.text(customerPhone, 12, billToY)
    billToY += 4
  }
  
  // Handle multi-line address
  const addressLines = customerAddress.split('\n')
  addressLines.forEach(line => {
    if (line.trim() && billToY < yPos + 22) {
      pdf.text(line.trim(), 12, billToY)
      billToY += 4
    }
  })
  
  // Ship To section (same as Bill To)
  let shipToY = yPos + 6
  pdf.text(customerName, 107, shipToY)
  shipToY += 4
  
  if (customerEmail) {
    pdf.text(customerEmail, 107, shipToY)
    shipToY += 4
  }
  
  if (customerPhone) {
    pdf.text(customerPhone, 107, shipToY)
    shipToY += 4
  }
  
  // Handle multi-line address for Ship To
  addressLines.forEach(line => {
    if (line.trim() && shipToY < yPos + 22) {
      pdf.text(line.trim(), 107, shipToY)
      shipToY += 4
    }
  })
  
  // Items table - thin borders and alternating row colors
  yPos += 28
  
  // Table header with light gray background
  pdf.setFillColor(240, 240, 240)
  pdf.rect(10, yPos, 15, 12, 'F')
  pdf.rect(25, yPos, 60, 12, 'F')
  pdf.rect(85, yPos, 25, 12, 'F')
  pdf.rect(110, yPos, 15, 12, 'F')
  pdf.rect(125, yPos, 25, 12, 'F')
  pdf.rect(150, yPos, 25, 6, 'F')
  pdf.rect(175, yPos, 25, 12, 'F')
  pdf.rect(150, yPos + 6, 12, 6, 'F')
  pdf.rect(162, yPos + 6, 13, 6, 'F')
  
  // Table borders
  pdf.setLineWidth(0.2)
  pdf.rect(10, yPos, 15, 12)
  pdf.rect(25, yPos, 60, 12)
  pdf.rect(85, yPos, 25, 12)
  pdf.rect(110, yPos, 15, 12)
  pdf.rect(125, yPos, 25, 12)
  pdf.rect(150, yPos, 25, 6)
  pdf.rect(175, yPos, 25, 12)
  pdf.rect(150, yPos + 6, 12, 6)
  pdf.rect(162, yPos + 6, 13, 6)
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.text('#', 17, yPos + 6, { align: 'center' })
  pdf.text('Item & Description', 55, yPos + 6, { align: 'center' })
  pdf.text('HSN/SAC', 97, yPos + 6, { align: 'center' })
  pdf.text('Qty', 117, yPos + 6, { align: 'center' })
  pdf.text('Rate', 137, yPos + 6, { align: 'center' })
  pdf.text('IGST', 162, yPos + 3, { align: 'center' })
  pdf.text('%', 156, yPos + 9, { align: 'center' })
  pdf.text('Amt', 168, yPos + 9, { align: 'center' })
  pdf.text('Amount', 187, yPos + 6, { align: 'center' })
  
  // Items data with alternating row colors
  yPos += 12
  let subtotal = 0
  invoice.items.forEach((item, index) => {
    const total = item.qty * item.price
    subtotal += total
    
    // Alternating row background
    if (index % 2 === 1) {
      pdf.setFillColor(248, 248, 248)
      pdf.rect(10, yPos, 190, 12, 'F')
    }
    
    // Thin borders
    pdf.setLineWidth(0.2)
    pdf.rect(10, yPos, 15, 12)
    pdf.rect(25, yPos, 60, 12)
    pdf.rect(85, yPos, 25, 12)
    pdf.rect(110, yPos, 15, 12)
    pdf.rect(125, yPos, 25, 12)
    pdf.rect(150, yPos, 12, 12)
    pdf.rect(162, yPos, 13, 12)
    pdf.rect(175, yPos, 25, 12)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text((index + 1).toString(), 17, yPos + 7, { align: 'center' })
    pdf.text(item.tourName || 'Goa Beach Paradise - 3D/2N', 27, yPos + 7)
    pdf.text(item.hsnSac || '996311', 97, yPos + 7, { align: 'center' })
    pdf.text(item.qty.toString(), 117, yPos + 7, { align: 'center' })
    pdf.text(item.price.toLocaleString('en-IN'), 137, yPos + 7, { align: 'center' })
    pdf.text('5%', 156, yPos + 7, { align: 'center' })
    pdf.text((total * 0.05).toLocaleString('en-IN'), 168, yPos + 7, { align: 'center' })
    pdf.text(total.toLocaleString('en-IN'), 187, yPos + 7, { align: 'center' })
    
    yPos += 12
  })
  
  // Summary section with thin borders
  const discount = (subtotal * (invoice.discount || 5)) / 100
  const igst = subtotal * 0.05
  const totalAmount = subtotal + igst - discount
  const balanceDue = totalAmount - (invoice.advanceAmount || 0)
  
  // Sub Total
  pdf.setLineWidth(0.2)
  pdf.rect(150, yPos, 25, 8)
  pdf.rect(175, yPos, 25, 8)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Sub Total', 162, yPos + 5, { align: 'center' })
  pdf.text(subtotal.toLocaleString('en-IN'), 187, yPos + 5, { align: 'center' })
  
  // IGST5
  yPos += 8
  pdf.rect(150, yPos, 25, 8)
  pdf.rect(175, yPos, 25, 8)
  pdf.text('IGST5 (5%)', 162, yPos + 5, { align: 'center' })
  pdf.text(igst.toLocaleString('en-IN'), 187, yPos + 5, { align: 'center' })
  
  // Adjustment
  yPos += 8
  pdf.rect(150, yPos, 25, 8)
  pdf.rect(175, yPos, 25, 8)
  pdf.text('Adjustment', 162, yPos + 5, { align: 'center' })
  pdf.text(discount > 0 ? `Rs.${discount.toFixed(2)}` : 'Rs.0.00', 187, yPos + 5, { align: 'center' })
  
  // Total
  yPos += 8
  pdf.rect(150, yPos, 25, 8)
  pdf.rect(175, yPos, 25, 8)
  pdf.text('Total', 162, yPos + 5, { align: 'center' })
  pdf.text(`Rs.${totalAmount.toFixed(2)}`, 187, yPos + 5, { align: 'center' })
  
  // Balance Due with light gray background
  yPos += 8
  pdf.setFillColor(240, 240, 240)
  pdf.rect(150, yPos, 50, 8, 'F')
  pdf.rect(150, yPos, 50, 8)
  pdf.text('Balance Due', 162, yPos + 5, { align: 'center' })
  pdf.text(`Rs.${balanceDue.toFixed(2)}`, 187, yPos + 5, { align: 'center' })
  
  // Total In Words - positioned within border with proper spacing
  yPos += 12
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Total In Words:', 12, yPos)
  pdf.setFont('helvetica', 'italic')
  pdf.setFontSize(7)
  pdf.text(`${convertToWords(Math.round(totalAmount))} Rupees Only`, 12, yPos + 5)
  
  // Notes - positioned within border with proper spacing
  yPos += 12
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Notes', 12, yPos)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  pdf.text('Thanks for your business.', 12, yPos + 5)
  
  // Terms & Bank Details - using company settings
  yPos += 12
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Terms & Conditions', 12, yPos)
  pdf.text('Bank Details:', 12, yPos + 6)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6)
  pdf.text(`Bank Name: ${company.bankName}`, 12, yPos + 12)
  pdf.text(`Account Holder: ${company.accountHolder}`, 12, yPos + 16)
  pdf.text(`Account Number: ${company.accountNumber}`, 12, yPos + 20)
  pdf.text(`IFSC: ${company.ifscCode}`, 12, yPos + 24)
  let currentY = yPos + 28
  if (company.branch) {
    pdf.text(`Branch: ${company.branch}`, 12, currentY)
    currentY += 4
  }
  if (company.mmid) {
    pdf.text(`MMID: ${company.mmid}`, 12, currentY)
    currentY += 4
  }
  if (company.accountType) {
    pdf.text(`Account Type: ${company.accountType}`, 12, currentY)
    currentY += 4
  }
  
  // Authorized Signature box with thin border
  pdf.setLineWidth(0.2)
  pdf.rect(150, yPos + 20, 45, 25)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.text('Authorized Signature', 172, yPos + 28, { align: 'center' })
  
  // Digital signature text inside the box
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6)
  pdf.text(`Digitally Signed by`, 172, yPos + 36, { align: 'center' })
  pdf.text(`${companyName || company.name}`, 172, yPos + 40, { align: 'center' })
  
  return pdf
}

const convertToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  
  if (num === 0) return 'Zero'
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convertToWords(num % 100) : '')
  if (num < 100000) return convertToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convertToWords(num % 1000) : '')
  return 'Amount too large'
}

export const downloadPDF = (invoice, logo = null, companyName = 'Travel Bill Pro', companyDetails = {}) => {
  try {
    // Load company details from localStorage if not provided
    const savedCompanyName = localStorage.getItem('travel-bill-company-name') || companyName
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const actualCompanyDetails = savedCompanyDetails ? JSON.parse(savedCompanyDetails) : companyDetails
    
    const pdf = generateInvoicePDF(invoice, logo, savedCompanyName, actualCompanyDetails)
    const timestamp = new Date().getTime()
    pdf.save(`${savedCompanyName.replace(/\s+/g, '')}_TaxInvoice_${invoice.invoiceNumber}_${timestamp}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF: ' + error.message)
  }
}