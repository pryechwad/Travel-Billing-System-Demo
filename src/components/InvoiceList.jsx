import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { downloadPDF } from '../utils/pdfGenerator'
import { useNotification } from './Notification'

const InvoiceList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const { showNotification, NotificationComponent } = useNotification()
  const [editFormData, setEditFormData] = useState(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearInvoice, setClearInvoice] = useState(null)

  useEffect(() => {
    const loadedInvoices = storage.getInvoices()
    setInvoices(loadedInvoices)
  }, [])

  const handleDownloadPDF = (invoice) => {
    // Load company details from localStorage
    const savedCompanyName = localStorage.getItem('travel-bill-company-name') || 'Travel Bill Pro'
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const actualCompanyDetails = savedCompanyDetails ? JSON.parse(savedCompanyDetails) : {}
    const currentLogo = localStorage.getItem('travel-bill-logo')
    
    downloadPDF(invoice, currentLogo, savedCompanyName, actualCompanyDetails)
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowViewModal(true)
  }

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setEditFormData({ ...invoice })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editFormData.customerName) {
      showNotification('Customer name is required', 'error')
      return
    }
    
    // Update invoice in storage
    storage.saveInvoice(editFormData)
    
    // Update local state
    const updatedInvoices = invoices.map(inv => 
      inv.id === editFormData.id ? editFormData : inv
    )
    setInvoices(updatedInvoices)
    
    showNotification(`Invoice ${editFormData.invoiceNumber} updated successfully!`, 'success')
    setShowEditModal(false)
    setEditFormData(null)
  }

  const handleDeleteInvoice = (invoice) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`)) {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id)
      setInvoices(updatedInvoices)
      storage.deleteInvoice(invoice.id)
      showNotification(`Invoice ${invoice.invoiceNumber} has been deleted successfully!`, 'success')
    }
  }

  const handleClearPendingPayment = (invoice) => {
    setClearInvoice(invoice)
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === clearInvoice.id ? { ...inv, status: 'Paid', paidDate: new Date().toISOString() } : inv
    )
    setInvoices(updatedInvoices)
    storage.updateInvoiceStatus(clearInvoice.id, 'Paid')
    // Also save the paid date
    const updatedInvoice = { ...clearInvoice, status: 'Paid', paidDate: new Date().toISOString() }
    storage.saveInvoice(updatedInvoice)
    
    showNotification(`Invoice ${clearInvoice.invoiceNumber} has been marked as paid!`, 'success')
    setShowClearModal(false)
    setClearInvoice(null)
  }

  const filteredInvoices = invoices.filter(invoice => {
    const tourPackage = invoice.items?.[0]?.tourName || 'N/A'
    const matchesSearch = invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourPackage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const status = invoice.status?.toLowerCase() || 'pending'
    const matchesFilter = filterStatus === 'all' || status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateAmount = (invoice) => {
    const subtotal = invoice.items?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0
    const discount = (subtotal * (invoice.discount || 0)) / 100
    const taxableAmount = subtotal - discount
    const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
    return taxableAmount + tax
  }

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + calculateAmount(invoice), 0)
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'Paid').reduce((sum, invoice) => sum + calculateAmount(invoice), 0)
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'Pending').reduce((sum, invoice) => sum + calculateAmount(invoice), 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'paid', 'pending', 'overdue'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Invoice</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Tour Package</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => {
                const amount = calculateAmount(invoice)
                const tourPackage = invoice.items?.[0]?.tourName || 'N/A'
                const status = invoice.status || 'Pending'
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('en-IN')}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.customerPhone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{tourPackage}</div>
                      <div className="text-xs text-gray-500">{invoice.paymentMode}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">₹{amount.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status.toLowerCase())}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          title="View Invoice"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          title="Edit Invoice"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteInvoice(invoice)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          title="Delete Invoice"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(invoice)}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          title="Download PDF"
                        >
                          PDF
                        </button>
                        {status.toLowerCase() === 'pending' && (
                          <button 
                            onClick={() => handleClearPendingPayment(invoice)}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                            title="Mark as Paid"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>No invoices found</p>
            </div>
          )}
        </div>
      </div>

      {/* View Invoice Modal - Complete Invoice Preview */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Invoice Preview - {selectedInvoice.invoiceNumber}</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Invoice Content */}
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Invoice Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">TAX INVOICE</h1>
                      <p className="text-blue-100">Invoice #{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-100">Date: {new Date(selectedInvoice.date).toLocaleDateString('en-IN')}</p>
                      {selectedInvoice.travelDate && (
                        <p className="text-blue-100">Travel: {new Date(selectedInvoice.travelDate).toLocaleDateString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Customer Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">CUSTOMER DETAILS:</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="grid grid-cols-2 gap-4">
                        <div><strong>Name:</strong> {selectedInvoice.customerName}</div>
                        <div><strong>Email:</strong> {selectedInvoice.customerEmail || 'N/A'}</div>
                        <div><strong>Phone:</strong> {selectedInvoice.customerPhone || 'N/A'}</div>
                        <div><strong>Address:</strong> {selectedInvoice.customerAddress || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-200 px-4 py-2 text-left">S.No</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Particulars</th>
                          <th className="border border-gray-200 px-4 py-2 text-center">Qty</th>
                          <th className="border border-gray-200 px-4 py-2 text-right">Rate</th>
                          <th className="border border-gray-200 px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-200 px-4 py-2">{item.tourName}</td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{item.qty}</td>
                            <td className="border border-gray-200 px-4 py-2 text-right">₹{item.price.toLocaleString()}</td>
                            <td className="border border-gray-200 px-4 py-2 text-right">₹{(item.qty * item.price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Billing Summary */}
                  <div className="flex justify-end mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-80">
                      <h3 className="font-semibold text-gray-800 mb-3 text-center">BILLING SUMMARY</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{calculateAmount(selectedInvoice).toLocaleString()}</span>
                        </div>
                        {selectedInvoice.discount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount ({selectedInvoice.discount}%):</span>
                            <span>-₹{((calculateAmount(selectedInvoice) * selectedInvoice.discount) / 100).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>CGST ({(selectedInvoice.taxRate || 18)/2}%):</span>
                          <span>₹{(calculateAmount(selectedInvoice) * (selectedInvoice.taxRate || 18) / 200).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST ({(selectedInvoice.taxRate || 18)/2}%):</span>
                          <span>₹{(calculateAmount(selectedInvoice) * (selectedInvoice.taxRate || 18) / 200).toFixed(0)}</span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between font-bold text-lg bg-black text-white px-3 py-2 rounded">
                            <span>TOTAL AMOUNT:</span>
                            <span>₹{calculateAmount(selectedInvoice).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-800 text-center">PAYMENT BREAKDOWN</h3>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-200 px-4 py-2 text-center">Amount (₹)</th>
                            <th className="border border-gray-200 px-4 py-2 text-center">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.advanceAmount > 0 && (
                            <tr>
                              <td className="border border-gray-200 px-4 py-2">Advance Amount</td>
                              <td className="border border-gray-200 px-4 py-2 text-center">{selectedInvoice.advanceAmount.toLocaleString()}</td>
                              <td className="border border-gray-200 px-4 py-2 text-center">{new Date(selectedInvoice.date).toLocaleDateString('en-IN')}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="border border-gray-200 px-4 py-2 font-semibold">Pending Amount</td>
                            <td className="border border-gray-200 px-4 py-2 text-center font-semibold">{Math.max(0, calculateAmount(selectedInvoice) - (selectedInvoice.advanceAmount || 0)).toLocaleString()}</td>
                            <td className="border border-gray-200 px-4 py-2 text-center">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN') : '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                      selectedInvoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Status: {selectedInvoice.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit Invoice - {editFormData.invoiceNumber}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Details */}
              <div>
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={editFormData.customerName || ''}
                      onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.customerEmail || ''}
                      onChange={(e) => setEditFormData({...editFormData, customerEmail: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.customerPhone || ''}
                      onChange={(e) => setEditFormData({...editFormData, customerPhone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
                    <input
                      type="date"
                      value={editFormData.travelDate || ''}
                      onChange={(e) => setEditFormData({...editFormData, travelDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editFormData.customerAddress || ''}
                    onChange={(e) => setEditFormData({...editFormData, customerAddress: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items</h4>
                {editFormData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Particulars</label>
                        <input
                          type="text"
                          value={item.tourName || ''}
                          onChange={(e) => {
                            const updatedItems = [...editFormData.items]
                            updatedItems[index].tourName = e.target.value
                            setEditFormData({...editFormData, items: updatedItems})
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.qty || 1}
                          onChange={(e) => {
                            const updatedItems = [...editFormData.items]
                            updatedItems[index].qty = parseInt(e.target.value) || 1
                            setEditFormData({...editFormData, items: updatedItems})
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={item.price || 0}
                          onChange={(e) => {
                            const updatedItems = [...editFormData.items]
                            updatedItems[index].price = parseFloat(e.target.value) || 0
                            setEditFormData({...editFormData, items: updatedItems})
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="font-semibold mb-3">Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      value={editFormData.discount || 0}
                      onChange={(e) => setEditFormData({...editFormData, discount: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={editFormData.taxRate || 18}
                      onChange={(e) => setEditFormData({...editFormData, taxRate: parseFloat(e.target.value) || 18})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                    <input
                      type="number"
                      value={editFormData.advanceAmount || 0}
                      onChange={(e) => setEditFormData({...editFormData, advanceAmount: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Clear Payment Modal */}
      {showClearModal && clearInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Clear Pending Payment</h3>
              <button onClick={() => setShowClearModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-800 font-medium">Confirm Payment Clearance</span>
                </div>
              </div>
              
              <div>
                <p><strong>Invoice:</strong> {clearInvoice.invoiceNumber}</p>
                <p><strong>Customer:</strong> {clearInvoice.customerName}</p>
                <p><strong>Total Amount:</strong> ₹{calculateAmount(clearInvoice).toLocaleString()}</p>
                <p><strong>Pending Amount:</strong> ₹{Math.max(0, calculateAmount(clearInvoice) - (clearInvoice.advanceAmount || 0)).toLocaleString()}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Confirmation:</strong> Has the customer paid the pending amount?
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  This will mark the invoice as "Paid" and update the PDF accordingly.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmClear}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Yes, Payment Received
                </button>
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {NotificationComponent}
    </div>
  )
}

export default InvoiceList