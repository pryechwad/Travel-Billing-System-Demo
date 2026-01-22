import { downloadPDF } from '../utils/pdfGenerator'
import { useLogo } from '../contexts/LogoContext'

const InvoicePreview = ({ invoice }) => {
  const { currentLogo, companyName, companyDetails,  } = useLogo()
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  const discountAmount = (subtotal * invoice.discount) / 100
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * invoice.taxRate) / 100
  const total = taxableAmount + taxAmount

  const exportToPDF = () => {
    // Force reload company data from localStorage
    const savedCompanyName = localStorage.getItem('travel-bill-company-name') || 'Travel Bill Pro'
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const actualCompanyDetails = savedCompanyDetails ? JSON.parse(savedCompanyDetails) : companyDetails
    
    console.log('Force loading from localStorage:', {
      savedCompanyName,
      actualCompanyDetails,
      hasData: Object.keys(actualCompanyDetails).length > 0
    })
    
    const logoToUse = (invoice.showLogo !== false) ? currentLogo : null
    downloadPDF(invoice, logoToUse, savedCompanyName, actualCompanyDetails)
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
            <div className="flex items-center gap-4">
              {(invoice.showLogo !== false) && (
                <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                  <img 
                    src={currentLogo} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{companyName.toUpperCase()}</h1>
                <p className="text-blue-100">{companyDetails.tagline || 'Your Ultimate Solution for Professional Travel Billing'}</p>
                <div className="text-sm text-blue-100 mt-2 space-y-1">
                  <p>Email: {companyDetails.email || 'info@travelbillpro.com'}</p>
                  <p>Phone: {companyDetails.phone || '+91-9876543210'}</p>
                  <p>{companyDetails.address || 'Mumbai, Maharashtra 400001'}</p>
                </div>
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
                  <th className="text-left py-4 px-4 font-semibold text-gray-800">Particulars</th>
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

          {/* Billing Summary */}
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">BILLING SUMMARY</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Discount ({invoice.discount}%):</span>
                    <span>-Rs.{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>CGST ({(invoice.taxRate || 18)/2}%):</span>
                  <span>Rs.{Math.round(taxAmount/2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>SGST ({(invoice.taxRate || 18)/2}%):</span>
                  <span>Rs.{Math.round(taxAmount/2).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-3">
                  <div className="flex justify-between text-lg font-bold text-white bg-black px-3 py-2 rounded">
                    <span>TOTAL AMOUNT:</span>
                    <span>Rs.{Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Table */}
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 text-center">PAYMENT BREAKDOWN</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Description</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800">Amount (Rs.)</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-800">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.advanceAmount > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Advance Amount</td>
                      <td className="text-center py-3 px-4 text-gray-700">{invoice.advanceAmount.toLocaleString()}</td>
                      <td className="text-center py-3 px-4 text-gray-700">{new Date(invoice.date).toLocaleDateString('en-IN')}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Pending Amount</td>
                    <td className="text-center py-3 px-4 text-gray-700">{Math.round(total - (invoice.advanceAmount || 0)).toLocaleString()}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : '-'}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">Total Amount</td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-800">{Math.round(total).toLocaleString()}</td>
                    <td className="text-center py-3 px-4 font-semibold text-gray-800">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side - Thank you message */}
              <div className="text-gray-600">
                <p className="font-medium mb-2">Thank you for choosing {companyName}!</p>
                <p className="text-sm mb-4">We hope you have a wonderful and memorable journey!</p>
                <div className="text-sm">
                  <p className="font-medium mb-2">For Your Future Travel Plans, Contact Us:</p>
                  <p>Phone: {companyDetails.phone || '+91-9876543210'} | Email: {companyDetails.email || 'info@travelbillpro.com'}</p>
                  <p>Website: {companyDetails.website || 'www.travelbillpro.com'} | {companyDetails.address || 'Mumbai, Maharashtra'}</p>
                </div>
              </div>
              
              {/* Right side - Payment Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 text-center">PAYMENT DETAILS</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Bank: HDFC Bank</p>
                  <p>A/c: 50200095881711</p>
                  <p>IFSC: HDFC0001913</p>
                  <p>Holder: TRAVERSE GLOBE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview