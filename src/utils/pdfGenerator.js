import jsPDF from 'jspdf'
import { defaultLogo } from './defaultLogo'

export const generateInvoicePDF = (invoice, customLogo = null, companyName = 'Travel Bill Pro', companyDetails = {}) => {
  const pdf = new jsPDF()
  
  console.log('PDF Generator - Company Name:', companyName)
  console.log('PDF Generator - Company Details Keys:', Object.keys(companyDetails))
  console.log('PDF Generator - GSTIN:', companyDetails.gstin)
  console.log('PDF Generator - Phone:', companyDetails.phone)
  console.log('PDF Generator - Email:', companyDetails.email)
  
  // Header with proper border
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(1)
  pdf.rect(10, 5, 190, 50)
  
  // Company Logo - Large size (40x40)
  if (invoice.showLogo !== false) {
    const logoToUse = customLogo || defaultLogo
    console.log('Adding logo to PDF:', { logoToUse: logoToUse.substring(0, 50) })
    
    try {
      if (logoToUse.includes('data:image/svg')) {
        console.log('Skipping SVG logo due to jsPDF compatibility')
        pdf.setFillColor(41, 128, 185)
        pdf.circle(35, 30, 18, 'F')
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255)
        pdf.text('TBP', 28, 34)
      } else if (logoToUse.includes('data:image/png')) {
        pdf.addImage(logoToUse, 'PNG', 15, 10, 40, 40)
      } else if (logoToUse.includes('data:image/jpeg') || logoToUse.includes('data:image/jpg')) {
        pdf.addImage(logoToUse, 'JPEG', 15, 10, 40, 40)
      } else {
        pdf.setFillColor(41, 128, 185)
        pdf.circle(35, 30, 18, 'F')
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(255, 255, 255)
        pdf.text('TBP', 28, 34)
      }
    } catch (error) {
      console.warn('Could not add logo to PDF:', error)
      pdf.setFillColor(41, 128, 185)
      pdf.circle(35, 30, 18, 'F')
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text('TBP', 28, 34)
    }
  }
  
  // Company Details - Vertical layout as requested
  pdf.setTextColor(0, 0, 0)
  
  // Company Name
  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.text(companyName.toUpperCase(), 65, 15)
  
  // Tagline
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'italic')
  const tagline = companyDetails.tagline || 'Your Ultimate Solution for Professional Travel Billing'
  pdf.text(tagline, 65, 22)
  
  // Address
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  const address = companyDetails.address || 'Mumbai - 400001'
  pdf.text(`Address: ${address}`, 65, 28)
  
  // Contact details on one line
  const phone = companyDetails.phone || '+91-9876543210'
  const email = companyDetails.email || 'info@travelbillpro.com'
  pdf.text(`Ph: ${phone} | Email: ${email.substring(0, 25)}`, 65, 33)
  
  // GSTIN
  const gstin = companyDetails.gstin || '27ABCDE1234F1Z5'
  pdf.text(`GSTIN: ${gstin}`, 65, 38)
  
  // Receipt Title
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text('TRAVEL RECEIPT', 80, 60)
  
  // Main border
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(1)
  pdf.rect(10, 65, 190, 210)
  
  // Receipt Info Table
  let yPos = 75
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
  
  // Calculate totals
  const discount = (subtotal * (invoice.discount || 0)) / 100
  const taxableAmount = subtotal - discount
  const tax = (taxableAmount * (invoice.taxRate || 18)) / 100
  const totalAmount = taxableAmount + tax
  const advanceAmount = invoice.advanceAmount || 0
  const pendingAmount = totalAmount - advanceAmount
  
  // Billing Summary Section
  yPos += 10
  
  // Billing Summary Box
  pdf.rect(20, yPos, 90, 40)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 90, 6, 'F')
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('BILLING SUMMARY', 50, yPos + 4)
  
  let summaryYPos = yPos + 12
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.text('Subtotal:', 25, summaryYPos)
  pdf.text(`Rs.${subtotal.toLocaleString()}`, 80, summaryYPos)
  
  if (invoice.discount > 0) {
    summaryYPos += 5
    pdf.text(`Discount (${invoice.discount}%):`, 25, summaryYPos)
    pdf.text(`-Rs.${discount.toLocaleString()}`, 80, summaryYPos)
  }
  
  summaryYPos += 5
  pdf.text(`CGST (${(invoice.taxRate || 18)/2}%):`, 25, summaryYPos)
  pdf.text(`Rs.${Math.round(tax/2).toLocaleString()}`, 80, summaryYPos)
  
  summaryYPos += 5
  pdf.text(`SGST (${(invoice.taxRate || 18)/2}%):`, 25, summaryYPos)
  pdf.text(`Rs.${Math.round(tax/2).toLocaleString()}`, 80, summaryYPos)
  
  summaryYPos += 8
  pdf.setFont('helvetica', 'bold')
  pdf.setFillColor(0, 0, 0)
  pdf.rect(20, summaryYPos - 2, 90, 6, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.text('TOTAL AMOUNT:', 25, summaryYPos + 2)
  pdf.text(`Rs.${Math.round(totalAmount).toLocaleString()}`, 80, summaryYPos + 2)
  pdf.setTextColor(0, 0, 0)
  
  // Payment Breakdown Table (Full width)
  yPos += 50
  
  // Payment Breakdown Header
  pdf.rect(20, yPos, 155, 8)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 155, 8, 'F')
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('PAYMENT BREAKDOWN', 90, yPos + 5)
  
  // Table Header Row
  yPos += 8
  pdf.rect(20, yPos, 155, 8)
  pdf.setFillColor(220, 220, 220)
  pdf.rect(20, yPos, 155, 8, 'F')
  
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Description', 25, yPos + 5)
  pdf.text('Amount (Rs.)', 90, yPos + 5)
  pdf.text('Date', 140, yPos + 5)
  
  // Table lines
  pdf.line(20, yPos, 175, yPos)
  pdf.line(85, yPos, 85, yPos + 8)
  pdf.line(135, yPos, 135, yPos + 8)
  
  // Advance Amount Row (if exists)
  yPos += 8
  if (advanceAmount > 0) {
    pdf.rect(20, yPos, 155, 6)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Advance Amount', 25, yPos + 4)
    pdf.text(advanceAmount.toLocaleString(), 90, yPos + 4)
    pdf.text(new Date(invoice.date).toLocaleDateString('en-IN'), 140, yPos + 4)
    
    pdf.line(85, yPos, 85, yPos + 6)
    pdf.line(135, yPos, 135, yPos + 6)
    yPos += 6
  }
  
  // Pending Amount Row
  pdf.rect(20, yPos, 155, 6)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Pending Amount', 25, yPos + 4)
  pdf.text(Math.round(pendingAmount).toLocaleString(), 90, yPos + 4)
  pdf.text(invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : '-', 140, yPos + 4)
  
  pdf.line(85, yPos, 85, yPos + 6)
  pdf.line(135, yPos, 135, yPos + 6)
  yPos += 6
  
  // Total Amount Row
  pdf.rect(20, yPos, 155, 6)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(20, yPos, 155, 6, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.text('Total Amount', 25, yPos + 4)
  pdf.text(Math.round(totalAmount).toLocaleString(), 90, yPos + 4)
  pdf.text('-', 140, yPos + 4)
  
  pdf.line(85, yPos, 85, yPos + 6)
  pdf.line(135, yPos, 135, yPos + 6)
  
  // Payment Details Box (Right side of payment breakdown)
  yPos += 15
  pdf.rect(120, yPos, 75, 25)
  pdf.setFillColor(240, 240, 240)
  pdf.rect(120, yPos, 75, 6, 'F')
  
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.text('PAYMENT DETAILS', 140, yPos + 4)
  
  let paymentYPos = yPos + 10
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  
  // HDFC Bank Details
  pdf.text('Bank: HDFC Bank', 125, paymentYPos)
  paymentYPos += 3
  pdf.text('A/c: 50200095881711', 125, paymentYPos)
  paymentYPos += 3
  pdf.text('IFSC: HDFC0001913', 125, paymentYPos)
  paymentYPos += 3
  pdf.text('Holder: TRAVERSE GLOBE', 125, paymentYPos)
  
  pdf.setFontSize(9)
  
  // Amount in Words
  yPos += 50
  pdf.setFont('helvetica', 'bold')
  pdf.text('Amount in Words:', 20, yPos)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${convertToWords(Math.round(totalAmount))} Rupees Only`, 20, yPos + 6)
  
  // Thank You Message - Directly below amount in words
  yPos += 15
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(0, 0, 0)
  pdf.text(`Thank You for Choosing ${companyName}!`, 20, yPos)
  
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
  pdf.text(`Digitally Signed by ${companyName}`, 142, yPos + 4)
  pdf.text(new Date().toLocaleDateString('en-IN'), 150, yPos + 8)
  
  // Contact Details - Below thank you message
  yPos += 4
  pdf.setFontSize(7)
  pdf.setFont('helvetica', 'bold')
  pdf.text('For Your Future Travel Plans, Contact Us:', 20, yPos)
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6)
  
  const contactPhone = companyDetails.phone || '+91-9876543210'
  const contactEmail = companyDetails.email || 'info@travelbillpro.com'
  const contactAddress = companyDetails.address || 'Mumbai, Maharashtra'
  const contactWebsite = companyDetails.website || 'www.travelbillpro.com'
  
  pdf.text(`Phone: ${contactPhone} | Email: ${contactEmail}`, 20, yPos + 4)
  pdf.text(`Website: ${contactWebsite} | ${contactAddress}`, 20, yPos + 7)
  

  

  

  
  // Footer - Terms at bottom (Centered)
  pdf.setFontSize(6)
  pdf.setTextColor(100, 100, 100)
  const termsText = 'This is a computer generated receipt. Terms & Conditions apply.'
  const termsWidth = pdf.getTextWidth(termsText)
  pdf.text(termsText, (210 - termsWidth) / 2, 270)
  
  const poweredText = `Powered by ${companyName}`
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

export const downloadPDF = (invoice, customLogo = null, companyName = 'Travel Bill Pro', companyDetails = {}) => {
  try {
    console.log('Generating PDF with logo:', {
      hasCustomLogo: !!customLogo,
      showLogo: invoice.showLogo,
      logoType: customLogo ? customLogo.substring(0, 20) : 'none',
      companyName,
      companyDetails
    })
    const pdf = generateInvoicePDF(invoice, customLogo, companyName, companyDetails)
    const timestamp = new Date().getTime()
    pdf.save(`TravelBillPro_Receipt_${invoice.invoiceNumber}_${timestamp}.pdf`)
    console.log('PDF generated successfully with logo support')
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF: ' + error.message)
  }
}