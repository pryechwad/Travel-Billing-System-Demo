import { useState } from 'react'
import Dashboard from './components/Dashboard'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import InvoiceList from './components/InvoiceList'
import CustomerList from './components/CustomerList'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

const createInitialInvoice = () => ({
  invoiceNumber: `TBP${Date.now().toString().slice(-6)}`,
  date: new Date().toISOString().split('T')[0],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  travelDate: '',
  items: [{ tourName: '', qty: 1, price: 0 }],
  taxRate: 18,
  discount: 0,
  paymentMode: 'cash',
  advanceAmount: 0,
  dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
})

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentInvoice, setCurrentInvoice] = useState(createInitialInvoice)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const resetInvoice = () => {
    setCurrentInvoice(createInitialInvoice())
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onCreateInvoice={() => setCurrentView('create-invoice')} />
      case 'create-invoice':
        return (
          <InvoiceForm 
            invoice={currentInvoice}
            setInvoice={setCurrentInvoice}
            onBack={() => setCurrentView('dashboard')}
          />
        )
      case 'preview-invoice':
        return <InvoicePreview invoice={currentInvoice} />
      case 'invoices':
        return <InvoiceList />
      case 'customers':
        return <CustomerList />
      default:
        return <Dashboard onCreateInvoice={() => setCurrentView('create-invoice')} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
        <Header 
          currentView={currentView}
          setCurrentView={setCurrentView}
          invoice={currentInvoice}
          resetInvoice={resetInvoice}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="p-6 min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App