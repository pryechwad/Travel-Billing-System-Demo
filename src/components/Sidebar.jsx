import { useState, useEffect } from 'react'
import { useLogo } from '../contexts/LogoContext'
import { storage } from '../utils/storage'
import ResponsiveLogo from './ResponsiveLogo'

const Sidebar = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const { companyName, logoSettings } = useLogo()
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [yesterdayRevenue, setYesterdayRevenue] = useState(0)
  
  useEffect(() => {
    const calculateRevenue = () => {
      const invoices = storage.getInvoices()
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      const todayTotal = invoices
        .filter(inv => new Date(inv.date).toDateString() === today)
        .reduce((sum, inv) => {
          const subtotal = inv.items.reduce((s, item) => s + (item.qty * item.price), 0)
          const discount = (subtotal * (inv.discount || 0)) / 100
          const taxableAmount = subtotal - discount
          const tax = (taxableAmount * (inv.taxRate || 18)) / 100
          return sum + (taxableAmount + tax)
        }, 0)
      
      const yesterdayTotal = invoices
        .filter(inv => new Date(inv.date).toDateString() === yesterday)
        .reduce((sum, inv) => {
          const subtotal = inv.items.reduce((s, item) => s + (item.qty * item.price), 0)
          const discount = (subtotal * (inv.discount || 0)) / 100
          const taxableAmount = subtotal - discount
          const tax = (taxableAmount * (inv.taxRate || 18)) / 100
          return sum + (taxableAmount + tax)
        }, 0)
      
      setTodayRevenue(todayTotal)
      setYesterdayRevenue(yesterdayTotal)
    }
    
    calculateRevenue()
    const interval = setInterval(calculateRevenue, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])
  
  const getPercentageChange = () => {
    if (yesterdayRevenue === 0) return todayRevenue > 0 ? '+100%' : '0%'
    const change = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
  }
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'create-invoice', label: 'New Invoice', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'invoices', label: 'All Invoices', icon: 'M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4z' },
    { id: 'customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'company-settings', label: 'Company Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-16 md:translate-x-0'
      }`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ResponsiveLogo 
            size={logoSettings.logoSize} 
            showFallback={true}
          />
          {isOpen && logoSettings.showCompanyNameInSidebar && (
            <div>
              <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{companyName}</h1>
              <p className="text-xs text-gray-500">Ultimate Billing Solution</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setCurrentView(item.id)
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    setIsOpen(false)
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-sm font-medium mb-1">Today's Revenue</div>
            <div className="text-2xl font-bold">₹{Math.round(todayRevenue).toLocaleString()}</div>
            <div className="text-xs opacity-80">{getPercentageChange()} from yesterday</div>
            <div className="text-xs mt-2 opacity-70">Powered by {companyName}</div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Sidebar