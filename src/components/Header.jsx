import { downloadPDF } from '../utils/pdfGenerator'

const Header = ({ currentView, setCurrentView, invoice, resetInvoice, toggleSidebar }) => {
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'create-invoice': return 'Create Invoice'
      case 'preview-invoice': return 'Invoice Preview'
      case 'invoices': return 'All Invoices'
      case 'customers': return 'Customer Management'
      default: return 'Travel Billing'
    }
  }

  const showInvoiceActions = currentView === 'create-invoice' || currentView === 'preview-invoice'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {showInvoiceActions && (
            <>
              {currentView === 'create-invoice' && (
                <>
                  <button
                    onClick={() => setCurrentView('preview-invoice')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 md:gap-2 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={resetInvoice}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    <span className="hidden sm:inline">Reset</span>
                    <span className="sm:hidden">↻</span>
                  </button>
                </>
              )}
              
              {currentView === 'preview-invoice' && (
                <>
                  <button
                    onClick={() => downloadPDF(invoice)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 md:gap-2 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('create-invoice')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 md:gap-2 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </>
              )}
            </>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-gray-700">Travel Bill Pro</div>
              <div className="text-xs text-gray-500">Admin User</div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">TBP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Info Bar */}
      {showInvoiceActions && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6">
              <div>
                <span className="text-sm font-medium text-blue-800">Invoice #</span>
                <span className="ml-2 text-sm text-blue-600">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-800">Date:</span>
                <span className="ml-2 text-sm text-blue-600">{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
              </div>
              {invoice.customerName && (
                <div>
                  <span className="text-sm font-medium text-blue-800">Customer:</span>
                  <span className="ml-2 text-sm text-blue-600">{invoice.customerName}</span>
                </div>
              )}
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm font-medium text-blue-800">
                Total: ₹{invoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0).toLocaleString()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Powered by Travel Bill Pro
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header