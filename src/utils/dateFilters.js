export const getDateRanges = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return {
    today: {
      start: today,
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
    },
    last7Days: {
      start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: today
    },
    last30Days: {
      start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: today
    },
    last90Days: {
      start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
      end: today
    },
    last6Months: {
      start: new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
      end: today
    },
    lastYear: {
      start: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      end: today
    }
  }
}

export const filterInvoicesByDateRange = (invoices, range) => {
  if (!range) return invoices
  
  return invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date)
    return invoiceDate >= range.start && invoiceDate <= range.end
  })
}

export const filterInvoicesByCustomRange = (invoices, startDate, endDate) => {
  if (!startDate || !endDate) return invoices
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999) // Include the entire end date
  
  return invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date)
    return invoiceDate >= start && invoiceDate <= end
  })
}