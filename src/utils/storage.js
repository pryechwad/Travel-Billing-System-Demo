export const storage = {
  getInvoices: () => {
    const invoices = localStorage.getItem('travel_invoices')
    return invoices ? JSON.parse(invoices) : []
  },

  saveInvoice: (invoice) => {
    const invoices = storage.getInvoices()
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id)
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice
    } else {
      invoices.push(invoice)
    }
    
    localStorage.setItem('travel_invoices', JSON.stringify(invoices))
    return invoice
  },

  deleteInvoice: (id) => {
    const invoices = storage.getInvoices()
    const filtered = invoices.filter(inv => inv.id !== id)
    localStorage.setItem('travel_invoices', JSON.stringify(filtered))
  },

  getCustomers: () => {
    const customers = localStorage.getItem('travel_customers')
    return customers ? JSON.parse(customers) : []
  },

  saveCustomer: (customer) => {
    const customers = storage.getCustomers()
    const existing = customers.find(c => c.phone === customer.phone)
    if (!existing) {
      customers.push(customer)
      localStorage.setItem('travel_customers', JSON.stringify(customers))
    }
  }
}