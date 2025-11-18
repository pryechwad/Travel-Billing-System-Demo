import jsPDF from 'jspdf'

export const generateInvoicePDF = (invoice) => {
  const pdf = new jsPDF()
  
  // Header
  pdf.setFillColor(41, 128, 185)
  pdf.rect(0, 0, 210, 35, 'F')
  
  // Company Logo
  pdf.setFillColor(255, 255, 255)
  pdf.circle(25, 18, 8, 'F')
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(41, 128, 185)
  pdf.text('TBP', 21, 20)
  
  // Company Name
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.text('TRAVEL BILL PRO', 40, 15)
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Your Ultimate Solution for Professional Travel Billing', 40, 22)
  pdf.text('Mumbai - 400001 | GSTIN: 27ABCDE1234F1Z5 | Ph: +91-9876543210', 40, 28)
  
  // Receipt Title
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('TRAVEL RECEIPT', 80, 45)
  
  // Main border
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(1)
  pdf.rect(10, 50, 190, 230)
  
  // Receipt Info Table
  let yPos = 60
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.rect(15, yPos, 180, 20)
  pdf.line(105, yPos, 105, yPos + 20)
  pdf.line(15, yPos + 10, 195, yPos + 10)
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Receipt No:', 20, yPos + 7)
  pdf.text('Date:', 20, yPos + 17)
  pdf.text('Travel Date:', 110, yPos + 7)
  pdf.text('Payment Mode:', 110, yPos + 17)
  
  pdf.setFont('helvetica', 'normal')
  pdf.text(invoice.invoiceNumber || 'TBP123456', 50, yPos + 7)
  pdf.text(new Date(invoice.date || new Date()).toLocaleDateString('en-IN'), 35, yPos + 17)
  pdf.text(new Date(invoice.travelDate || new Date()).toLocaleDateString('en-IN'), 145, yPos + 7)
  pdf.text((invoice.paymentMode || 'CASH').toUpperCase(), 150, yPos + 17)
  
  // Customer Details
  yPos = 85
  pdf.rect(15, yPos, 180, 25)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(15, yPos, 180, 6, 'F')
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('CUSTOMER DETAILS', 90, yPos + 4)
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Name: ${invoice.customerName || 'Customer Name'}`, 20, yPos + 12)
  pdf.text(`Phone: ${invoice.customerPhone || '+91-9876543210'}`, 20, yPos + 18)
  pdf.text(`Email: ${invoice.customerEmail || 'customer@email.com'}`, 110, yPos + 12)
  pdf.text(`Address: ${invoice.customerAddress || 'Customer Address'}`, 20, yPos + 24)
  // Services Table Header
  yPos = 115
  pdf.setFillColor(0, 0, 0)
  pdf.rect(15, yPos, 180, 8, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.text('S.No', 20, yPos + 5)
  pdf.text('Tour Package Details', 50, yPos + 5)
  pdf.text('No. of Travelers', 115, yPos + 5)
  pdf.text('Rate', 150, yPos + 5)
  pdf.text('Total', 175, yPos + 5)
  
  // Table column lines
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.line(15, yPos, 15, yPos + 8)
  pdf.line(35, yPos, 35, yPos + 8)
  pdf.line(125, yPos, 125, yPos + 8)
  pdf.line(145, yPos, 145, yPos + 8)
  pdf.line(170, yPos, 170, yPos + 8)
  pdf.line(195, yPos, 195, yPos + 8)
  
  // Items Data
  yPos += 8
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(0, 0, 0)
  let subtotal = 0
  
  invoice.items.forEach((item, index) => {
    const total = item.qty * item.price
    subtotal += total
    
    // Row
    pdf.rect(15, yPos, 180, 10)
    pdf.line(35, yPos, 35, yPos + 10)
    pdf.line(125, yPos, 125, yPos + 10)
    pdf.line(145, yPos, 145, yPos + 10)
    pdf.line(170, yPos, 170, yPos + 10)
    
    pdf.text((index + 1).toString(), 22, yPos + 6)
    pdf.text(item.tourName || 'Tour Package', 40, yPos + 6)
    pdf.text((item.qty || 1).toString(), 132, yPos + 6)
    pdf.text(`Rs.${(item.price || 0).toLocaleString()}`, 148, yPos + 6)
    pdf.text(`Rs.${total.toLocaleString()}`, 175, yPos + 6)
    yPos += 10
  })
  
  // Billing Summary
  yPos += 10
  const discount = (subtotal * (invoice.discount || 0)) / 100
  const taxableAmount = subtotal - discount
  const tax = (taxableAmount * (invoice.taxRate || 18)) / 100
  const total = taxableAmount + tax
  const advanceAmount = invoice.advanceAmount || 0
  const pendingAmount = total - advanceAmount
  
  pdf.rect(120, yPos, 75, 35)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(120, yPos, 75, 6, 'F')
  
  pdf.setFont('helvetica', 'bold')
  pdf.text('BILLING SUMMARY', 140, yPos + 4)
  
  yPos += 10
  pdf.setFont('helvetica', 'normal')
  pdf.text('Subtotal:', 125, yPos)
  pdf.text(`Rs.${subtotal.toLocaleString()}`, 170, yPos)
  
  if (invoice.discount > 0) {
    yPos += 5
    pdf.text(`Discount (${invoice.discount}%):`, 125, yPos)
    pdf.text(`-Rs.${discount.toLocaleString()}`, 170, yPos)
  }
  
  yPos += 5
  pdf.text(`CGST (${(invoice.taxRate || 18)/2}%):`, 125, yPos)
  pdf.text(`Rs.${Math.round(tax/2).toLocaleString()}`, 170, yPos)
  
  yPos += 5
  pdf.text(`SGST (${(invoice.taxRate || 18)/2}%):`, 125, yPos)
  pdf.text(`Rs.${Math.round(tax/2).toLocaleString()}`, 170, yPos)
  
  yPos += 8
  pdf.setFont('helvetica', 'bold')
  pdf.setFillColor(0, 0, 0)
  pdf.rect(120, yPos - 2, 75, 6, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.text('TOTAL AMOUNT:', 125, yPos + 2)
  pdf.text(`Rs.${Math.round(total).toLocaleString()}`, 170, yPos + 2)
  pdf.setTextColor(0, 0, 0)
  
  // Payment Breakdown Box
  yPos += 15
  pdf.setDrawColor(0, 0, 0)
  pdf.rect(20, yPos, 170, 30)
  
  // Header with lighter color
  pdf.setFillColor(220, 220, 220)
  pdf.rect(20, yPos, 170, 8, 'F')
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(0, 0, 0)
  pdf.text('PAYMENT BREAKDOWN', 90, yPos + 5)
  
  // Table header row
  yPos += 8
  pdf.setFillColor(200, 200, 200)
  pdf.rect(20, yPos, 170, 6, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Description', 25, yPos + 4)
  pdf.text('Amount (Rs.)', 90, yPos + 4)
  pdf.text('Date', 150, yPos + 4)
  
  // Column lines
  pdf.line(85, yPos, 85, yPos + 18)
  pdf.line(145, yPos, 145, yPos + 18)
  
  // Row 1: Advance Amount
  yPos += 6
  pdf.rect(20, yPos, 170, 6)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Advance Amount', 25, yPos + 4)
  pdf.text(`${advanceAmount.toLocaleString()}`, 90, yPos + 4)
  pdf.text(new Date(invoice.date).toLocaleDateString('en-IN'), 150, yPos + 4)
  
  // Row 2: Pending Amount
  yPos += 6
  pdf.rect(20, yPos, 170, 6)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Pending Amount', 25, yPos + 4)
  pdf.text(`${Math.round(pendingAmount).toLocaleString()}`, 90, yPos + 4)
  if (invoice.dueDate) {
    const dueDate = new Date(invoice.dueDate)
    const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
    pdf.text(formattedDueDate, 150, yPos + 4)
  } else {
    pdf.text('-', 155, yPos + 4)
  }
  
  // Row 3: Total Amount
  yPos += 6
  pdf.rect(20, yPos, 170, 6)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 170, 6, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.text('Total Amount', 25, yPos + 4)
  pdf.text(`${Math.round(total).toLocaleString()}`, 90, yPos + 4)
  pdf.text('-', 155, yPos + 4)
  
  // Amount in Words
  yPos += 15
  pdf.setFont('helvetica', 'bold')
  pdf.text('Amount in Words:', 20, yPos)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${convertToWords(Math.round(total))} Rupees Only`, 20, yPos + 6)
  
  // Thank You Message - Directly below amount in words
  yPos += 15
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('Thank You for Choosing Travel Bill Pro!', 20, yPos)
  
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'normal')
  pdf.text('We hope you have a wonderful and memorable journey!', 20, yPos + 6)
  
  // Signature Section - Smaller Box
  yPos += 15
  pdf.rect(140, yPos, 55, 15)
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text('Authorized Signatory', 145, yPos + 12)
  
  pdf.setFontSize(7)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Digitally Signed by Travel Bill Pro', 142, yPos + 4)
  pdf.text(new Date().toLocaleDateString('en-IN'), 150, yPos + 8)
  
  // Contact Details - Below thank you message
  yPos += 4
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.text('For Your Future Travel Plans, Contact Us:', 20, yPos)
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6)
  pdf.text('Phone: +91-9876543210 | Email: info@travelbillpro.com', 20, yPos + 4)
  pdf.text('Website: www.travelbillpro.com | Mumbai, Maharashtra', 20, yPos + 7)
  

  

  
  // Footer - Terms at bottom (Centered)
  pdf.setFontSize(6)
  pdf.setTextColor(100, 100, 100)
  const termsText = 'This is a computer generated receipt. Terms & Conditions apply.'
  const termsWidth = pdf.getTextWidth(termsText)
  pdf.text(termsText, (210 - termsWidth) / 2, 270)
  
  const poweredText = 'Powered by Travel Bill Pro'
  const poweredWidth = pdf.getTextWidth(poweredText)
  pdf.text(poweredText, (210 - poweredWidth) / 2, 275)
  
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

export const downloadPDF = (invoice) => {
  try {
    console.log('Generating PDF with new format...', invoice)
    const pdf = generateInvoicePDF(invoice)
    const timestamp = new Date().getTime()
    pdf.save(`TravelBillPro_Receipt_${invoice.invoiceNumber}_${timestamp}.pdf`)
    console.log('PDF generated successfully with new format')
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF: ' + error.message)
  }
}