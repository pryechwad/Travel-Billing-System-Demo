import { useState } from 'react'
import { storage } from '../utils/storage'

const InvoiceForm = ({ invoice, setInvoice, onBack }) => {
  const [isSaving, setIsSaving] = useState(false)

  const saveInvoice = async () => {
    if (!invoice.customerName || !invoice.items[0]?.tourName) {
      alert('Please fill in customer name and at least one tour package')
      return
    }

    setIsSaving(true)
    try {
      const invoiceToSave = {
        ...invoice,
        id: invoice.id || Date.now().toString(),
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
      
      storage.saveInvoice(invoiceToSave)
      storage.saveCustomer({
        name: invoice.customerName,
        email: invoice.customerEmail,
        phone: invoice.customerPhone,
        address: invoice.customerAddress
      })
      
      alert('Invoice saved successfully!')
      onBack()
    } catch (error) {
      alert('Error saving invoice: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }
  const tourPackages = [
    'Dubai City Explorer - 3D/2N',
    'Abu Dhabi Grand Tour - 4D/3N',
    'Desert Safari Adventure - 2D/1N',
    'Burj Khalifa & Dubai Mall Experience - 1D',
    'Dubai Marina & JBR Beach - 2D/1N',
    'Al Ain Oasis & Jebel Hafeet - 2D/1N',
    'Sharjah Cultural Heritage - 1D',
    'Fujairah Mountains & Beaches - 3D/2N',
    'Ras Al Khaimah Adventure - 2D/1N',
    'Dubai Miracle Garden & Global Village - 1D',
    'Atlantis Aquaventure & Lost Chambers - 1D',
    'Dubai Creek & Old Souk Tour - 1D'
  ]

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { tourName: '', qty: 1, price: 0, duration: '', destination: '' }]
    }))
  }

  const updateItem = (index, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">TBP</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Travel Bill Pro</h1>
            </div>
            <p className="text-gray-600">Create New Invoice - #{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Customer Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
              <input
                type="text"
                placeholder="Enter customer name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={invoice.customerName}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="customer@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={invoice.customerEmail}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={invoice.customerPhone || ''}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                placeholder="Customer address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={invoice.customerAddress || ''}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={invoice.travelDate || ''}
                onChange={(e) => setInvoice(prev => ({ ...prev, travelDate: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Tour Packages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Tour Packages</h2>
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Package
            </button>
          </div>
          
          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tour Package</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={item.tourName}
                      onChange={(e) => updateItem(index, 'tourName', e.target.value)}
                    >
                      <option value="">Select tour package</option>
                      {tourPackages.map((pkg, i) => (
                        <option key={i} value={pkg}>{pkg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Person (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => removeItem(index)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      disabled={invoice.items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-lg font-semibold text-gray-800">
                    Total: ₹{(item.qty * item.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.taxRate}
              onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.discount}
              onChange={(e) => setInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount (₹)</label>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.advanceAmount || 0}
              onChange={(e) => setInvoice(prev => ({ ...prev, advanceAmount: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.dueDate || ''}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={invoice.paymentMode || 'cash'}
              onChange={(e) => setInvoice(prev => ({ ...prev, paymentMode: e.target.value }))}
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveInvoice}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceForm