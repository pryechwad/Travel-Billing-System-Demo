import { defaultLogo } from './defaultLogo'

export const storage = {
  // Company Settings
  getCompanySettings: () => {
    const settings = localStorage.getItem('company_settings')
    return settings ? JSON.parse(settings) : {
      name: 'Traverse Globe',
      tagline: 'Explore Beyond Boundaries',
      address: '123 Travel Street, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      email: 'info@traverseglobe.com',
      gst: 'GST123456789',
      logo: defaultLogo
    }
  },

  saveCompanySettings: (settings) => {
    localStorage.setItem('company_settings', JSON.stringify(settings))
  },

  // Invoices
  getInvoices: () => {
    const invoices = localStorage.getItem('traverse_invoices')
    return invoices ? JSON.parse(invoices) : []
  },

  saveInvoice: (invoice) => {
    const invoices = storage.getInvoices()
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id)
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() }
    } else {
      invoices.push({ ...invoice, createdAt: new Date().toISOString() })
    }
    
    localStorage.setItem('traverse_invoices', JSON.stringify(invoices))
    return invoice
  },

  deleteInvoice: (id) => {
    const invoices = storage.getInvoices()
    const filtered = invoices.filter(inv => inv.id !== id)
    localStorage.setItem('traverse_invoices', JSON.stringify(filtered))
  },

  // Customers
  getCustomers: () => {
    const customers = localStorage.getItem('traverse_customers')
    return customers ? JSON.parse(customers) : []
  },

  saveCustomer: (customer) => {
    const customers = storage.getCustomers()
    const existingIndex = customers.findIndex(c => c.phone === customer.phone)
    
    if (existingIndex >= 0) {
      customers[existingIndex] = { ...customer, updatedAt: new Date().toISOString() }
    } else {
      customers.push({ ...customer, createdAt: new Date().toISOString() })
    }
    
    localStorage.setItem('traverse_customers', JSON.stringify(customers))
  },

  // Tour Packages
  getTourPackages: () => {
    const packages = localStorage.getItem('tour_packages')
    return packages ? JSON.parse(packages) : [
      { id: 1, name: 'Goa Beach Paradise', duration: '3D/2N', basePrice: 15000 },
      { id: 2, name: 'Kashmir Valley Tour', duration: '5D/4N', basePrice: 25000 },
      { id: 3, name: 'Rajasthan Heritage', duration: '7D/6N', basePrice: 35000 },
      { id: 4, name: 'Kerala Backwaters', duration: '4D/3N', basePrice: 20000 },
      { id: 5, name: 'Himachal Adventure', duration: '6D/5N', basePrice: 28000 }
    ]
  },

  saveTourPackage: (package_) => {
    const packages = storage.getTourPackages()
    const existingIndex = packages.findIndex(p => p.id === package_.id)
    
    if (existingIndex >= 0) {
      packages[existingIndex] = package_
    } else {
      packages.push({ ...package_, id: Date.now() })
    }
    
    localStorage.setItem('tour_packages', JSON.stringify(packages))
  },

  // Dashboard Stats
  getDashboardStats: () => {
    const invoices = storage.getInvoices()
    const today = new Date().toDateString()
    
    return {
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
      pendingAmount: invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0),
      todayInvoices: invoices.filter(inv => new Date(inv.createdAt).toDateString() === today).length,
      paidInvoices: invoices.filter(inv => (inv.balance || 0) === 0).length
    }
  }
}