import jsPDF from 'jspdf'

const InvoicePreview = ({ invoice }) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  const discountAmount = (subtotal * invoice.discount) / 100
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * invoice.taxRate) / 100
  const total = taxableAmount + taxAmount

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Company Header
    doc.setFontSize(24)
    doc.setTextColor(41, 128, 185)
    doc.text('Tours & TRAVELS', 20, 25)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Your Journey, Our Passion', 20, 32)
    doc.text('Email: info@travels.com | Phone: +91 98765 43210', 20, 38)
    doc.text('Address: 123 Travel Street, Mumbai, Maharashtra 400001', 20, 44)
    
    // Invoice Title
    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text('TRAVEL INVOICE', 20, 60)
    
    // Invoice Details
    doc.setFontSize(11)
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 75)
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('en-IN')}`, 20, 82)
    if (invoice.travelDate) {
      doc.text(`Travel Date: ${new Date(invoice.travelDate).toLocaleDateString('en-IN')}`, 20, 89)
    }
    
    // Customer Details
    doc.setFontSize(12)
    doc.text('BILL TO:', 20, 105)
    doc.setFontSize(11)
    doc.text(invoice.customerName || 'Customer Name', 20, 115)
    if (invoice.customerEmail) doc.text(invoice.customerEmail, 20, 122)
    if (invoice.customerPhone) doc.text(invoice.customerPhone, 20, 129)
    if (invoice.customerAddress) doc.text(invoice.customerAddress, 20, 136)
    
    // Payment Mode
    if (invoice.paymentMode) {
      doc.text(`Payment Mode: ${invoice.paymentMode.toUpperCase()}`, 120, 115)
    }
    
    // Table Header
    const startY = 155
    doc.setFillColor(240, 240, 240)
    doc.rect(20, startY, 170, 8, 'F')
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('Tour Package', 22, startY + 5)
    doc.text('Travelers', 120, startY + 5)
    doc.text('Price', 145, startY + 5)
    doc.text('Total', 170, startY + 5)
    
    // Items
    let yPos = startY + 15
    doc.setFontSize(9)
    invoice.items.forEach(item => {
      const tourName = item.tourName || 'Tour Package'
      if (tourName.length > 35) {
        const lines = doc.splitTextToSize(tourName, 90)
        doc.text(lines, 22, yPos)
        yPos += (lines.length - 1) * 4
      } else {
        doc.text(tourName, 22, yPos)
      }
      
      doc.text(item.qty.toString(), 125, yPos)
      doc.text(`₹${item.price.toLocaleString()}`, 145, yPos)
      doc.text(`₹${(item.qty * item.price).toLocaleString()}`, 170, yPos)
      yPos += 12
    })
    
    // Totals
    yPos += 10
    doc.line(120, yPos, 190, yPos)
    yPos += 8
    
    doc.setFontSize(10)
    doc.text(`Subtotal:`, 120, yPos)
    doc.text(`₹${subtotal.toLocaleString()}`, 170, yPos)
    
    if (invoice.discount > 0) {
      yPos += 7
      doc.text(`Discount (${invoice.discount}%):`, 120, yPos)
      doc.text(`-₹${discountAmount.toLocaleString()}`, 170, yPos)
    }
    
    yPos += 7
    doc.text(`Tax (${invoice.taxRate}%):`, 120, yPos)
    doc.text(`₹${taxAmount.toLocaleString()}`, 170, yPos)
    
    yPos += 10
    doc.line(120, yPos, 190, yPos)
    yPos += 8
    
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`TOTAL AMOUNT:`, 120, yPos)
    doc.text(`₹${total.toLocaleString()}`, 170, yPos)
    
    // Footer
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text('Thank you for choosing Wanderlust Travels!', 20, 270)
    doc.text('Terms: Payment due within 30 days. Cancellation charges apply as per policy.', 20, 277)
    
    doc.save(`travel-invoice-${invoice.invoiceNumber}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Invoice Preview</h2>
        <button
          onClick={exportToPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">TRAVEL BILL PRO</h1>
              <p className="text-blue-100">Your Ultimate Solution for Billing</p>
              <div className="text-sm text-blue-100 mt-2 space-y-1">
                <p>Email: info@travelbillpro.com</p>
                <p>Phone: +91-9876543210</p>
                <p>Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-blue-100">#{invoice.invoiceNumber}</p>
              <p className="text-blue-100">{new Date(invoice.date).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Customer & Travel Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">BILL TO:</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{invoice.customerName || 'Customer Name'}</p>
                {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
                {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
                {invoice.customerAddress && <p>{invoice.customerAddress}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">TRAVEL DETAILS:</h3>
              <div className="text-gray-700 space-y-1">
                {invoice.travelDate && (
                  <p><span className="font-medium">Travel Date:</span> {new Date(invoice.travelDate).toLocaleDateString('en-IN')}</p>
                )}
                {invoice.paymentMode && (
                  <p><span className="font-medium">Payment Mode:</span> {invoice.paymentMode.toUpperCase()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-800">Tour Package</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-800">Travelers</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-800">Price per Person</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-800">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{item.tourName || 'Tour Package'}</div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-700">{item.qty}</td>
                    <td className="text-right py-4 px-4 text-gray-700">₹{item.price.toLocaleString()}</td>
                    <td className="text-right py-4 px-4 font-medium text-gray-900">₹{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-80">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount ({invoice.discount}%):</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Amount:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600">
              <p className="font-medium mb-2">Thank you for choosing Wanderlust Travels!</p>
              <p className="text-sm">Terms: Payment due within 30 days. Cancellation charges apply as per policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview