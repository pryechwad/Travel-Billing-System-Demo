import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { getDateRanges, filterInvoicesByDateRange, filterInvoicesByCustomRange } from '../utils/dateFilters'
import { downloadPDF } from '../utils/pdfGenerator'
import { downloadReportPDF, generateReportExcel } from '../utils/reportGenerator'
import { createSampleInvoices } from '../utils/sampleData'
import { useNotification } from './Notification'

const Dashboard = ({ onCreateInvoice }) => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportDateRange, setReportDateRange] = useState('all')
  const [reportCustomStart, setReportCustomStart] = useState('')
  const [reportCustomEnd, setReportCustomEnd] = useState('')
  const { showNotification, NotificationComponent } = useNotification()
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    completedTours: 0
  })

  useEffect(() => {
    const loadedInvoices = storage.getInvoices()
    setInvoices(loadedInvoices)
    setFilteredInvoices(loadedInvoices)
    calculateStats(loadedInvoices)
  }, [])

  useEffect(() => {
    applyFilter()
  }, [selectedFilter, customStartDate, customEndDate, invoices])

  const calculateStats = (invoiceList) => {
    const total = invoiceList.reduce((acc, inv) => {
      const amount = inv.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
      const discount = (amount * (inv.discount || 0)) / 100
      const taxableAmount = amount - discount
      const tax = (taxableAmount * (inv.taxRate || 0)) / 100
      return acc + taxableAmount + tax
    }, 0)

    const pending = invoiceList
      .filter(inv => inv.status === 'Pending')
      .reduce((acc, inv) => {
        const amount = inv.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
        const discount = (amount * (inv.discount || 0)) / 100
        const taxableAmount = amount - discount
        const tax = (taxableAmount * (inv.taxRate || 0)) / 100
        return acc + taxableAmount + tax
      }, 0)

    setStats({
      totalInvoices: invoiceList.length,
      totalRevenue: total,
      pendingPayments: pending,
      completedTours: invoiceList.filter(inv => inv.status === 'Paid').length
    })
  }

  const applyFilter = () => {
    let filtered = [...invoices]
    
    if (selectedFilter === 'custom' && customStartDate && customEndDate) {
      filtered = filterInvoicesByCustomRange(invoices, customStartDate, customEndDate)
    } else if (selectedFilter !== 'all') {
      const ranges = getDateRanges()
      filtered = filterInvoicesByDateRange(invoices, ranges[selectedFilter])
    }
    
    setFilteredInvoices(filtered)
    calculateStats(filtered)
  }

  const handleDownloadPDF = (invoice) => {
    // Load company details from localStorage
    const savedCompanyName = localStorage.getItem('travel-bill-company-name') || 'Travel Bill Pro'
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const actualCompanyDetails = savedCompanyDetails ? JSON.parse(savedCompanyDetails) : {}
    const currentLogo = localStorage.getItem('travel-bill-logo')
    
    downloadPDF(invoice, currentLogo, savedCompanyName, actualCompanyDetails)
  }

  const handlePendingInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice)
    const pendingAmount = calculatePendingAmount(invoice)
    setPaymentAmount(pendingAmount.toString())
    setShowPaymentModal(true)
  }

  const calculatePendingAmount = (invoice) => {
    const amount = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
    const discount = (amount * (invoice.discount || 0)) / 100
    const taxableAmount = amount - discount
    const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
    const total = taxableAmount + tax
    return total - (invoice.advanceAmount || 0)
  }

  const handlePaymentReceived = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      showNotification('Please enter a valid payment amount', 'error')
      return
    }

    const pendingAmount = calculatePendingAmount(selectedInvoice)
    const receivedAmount = parseFloat(paymentAmount)

    if (receivedAmount > pendingAmount) {
      showNotification('Payment amount cannot exceed pending amount', 'error')
      return
    }

    // Update invoice with received payment
    const updatedAdvance = (selectedInvoice.advanceAmount || 0) + receivedAmount
    const updatedInvoice = { ...selectedInvoice, advanceAmount: updatedAdvance }
    
    // Check if fully paid
    const newPendingAmount = pendingAmount - receivedAmount
    if (newPendingAmount <= 0) {
      updatedInvoice.status = 'Paid'
    }

    // Update storage and state
    storage.saveInvoice(updatedInvoice)
    const updatedInvoices = invoices.map(inv => 
      inv.id === selectedInvoice.id ? updatedInvoice : inv
    )
    setInvoices(updatedInvoices)
    setFilteredInvoices(updatedInvoices)
    
    showNotification(`Payment of ₹${receivedAmount.toLocaleString()} received successfully!`, 'success')
    setShowPaymentModal(false)
    setSelectedInvoice(null)
    setPaymentAmount('')
  }

  const handleDownloadReport = (format) => {
    let reportInvoices = [...invoices]
    let dateRangeText = 'All Time'
    
    if (reportDateRange === 'custom' && reportCustomStart && reportCustomEnd) {
      reportInvoices = filterInvoicesByCustomRange(invoices, reportCustomStart, reportCustomEnd)
      dateRangeText = `${reportCustomStart} to ${reportCustomEnd}`
    } else if (reportDateRange !== 'all') {
      const ranges = getDateRanges()
      reportInvoices = filterInvoicesByDateRange(invoices, ranges[reportDateRange])
      dateRangeText = reportDateRange.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    }
    
    const savedCompanyName = localStorage.getItem('travel-bill-company-name') || 'Travel Bill Pro'
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const actualCompanyDetails = savedCompanyDetails ? JSON.parse(savedCompanyDetails) : {}
    
    if (format === 'pdf') {
      downloadReportPDF(reportInvoices, dateRangeText, savedCompanyName, actualCompanyDetails)
    } else {
      generateReportExcel(reportInvoices, dateRangeText)
    }
    
    setShowReportModal(false)
  }

  const handleCreateSampleData = () => {
    createSampleInvoices()
    const loadedInvoices = storage.getInvoices()
    setInvoices(loadedInvoices)
    setFilteredInvoices(loadedInvoices)
    calculateStats(loadedInvoices)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TBP</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Billing Management Software</h1>
              <p className="text-sm text-gray-500">Your Ultimate Solution for Billing</p>
            </div>
          </div>
          <p className="text-gray-600">Manage your tour bookings and invoices</p>
        </div>
        <div className="flex gap-3">
          {invoices.length === 0 && (
            <button
              onClick={handleCreateSampleData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
            >
              Add Sample Data
            </button>
          )}
          <button
            onClick={onCreateInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Invoice
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last90Days">Last 90 Days</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {selectedFilter === 'custom' && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <span className="text-sm text-gray-600">
            Showing {filteredInvoices.length} invoice(s)
          </span>
          
          {filteredInvoices.length > 0 && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Reports
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-600">₹{stats.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tours</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completedTours}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Travel Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          {filteredInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No invoices found for the selected period.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const amount = invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
                  const discount = (amount * (invoice.discount || 0)) / 100
                  const taxableAmount = amount - discount
                  const tax = (taxableAmount * (invoice.taxRate || 0)) / 100
                  const total = taxableAmount + tax
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.items[0]?.tourName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            invoice.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                          onClick={() => invoice.status !== 'Paid' && handlePendingInvoiceClick(invoice)}
                          title={invoice.status !== 'Paid' ? 'Click to receive payment' : ''}
                        >
                          {invoice.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDownloadPDF(invoice)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Report Download Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Download Business Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date Range</label>
                <select
                  value={reportDateRange}
                  onChange={(e) => setReportDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="last7Days">Last 7 Days</option>
                  <option value="last30Days">Last 30 Days</option>
                  <option value="last90Days">Last 90 Days</option>
                  <option value="last6Months">Last 6 Months</option>
                  <option value="lastYear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {reportDateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={reportCustomStart}
                      onChange={(e) => setReportCustomStart(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={reportCustomEnd}
                      onChange={(e) => setReportCustomEnd(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF Report
                </button>
                <button
                  onClick={() => handleDownloadReport('excel')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a4 4 0 01-4-4V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Excel Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Receive Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</p>
                <p><strong>Customer:</strong> {selectedInvoice.customerName}</p>
                <p><strong>Pending Amount:</strong> ₹{calculatePendingAmount(selectedInvoice).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter payment amount"
                  max={calculatePendingAmount(selectedInvoice)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePaymentReceived}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Receive Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
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

export default Dashboard