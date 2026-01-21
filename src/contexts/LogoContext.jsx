import { createContext, useContext, useState, useEffect } from 'react'
import { defaultLogo } from '../utils/defaultLogo'

const LogoContext = createContext()

export const useLogo = () => {
  const context = useContext(LogoContext)
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider')
  }
  return context
}

export const LogoProvider = ({ children }) => {
  const [currentLogo, setCurrentLogo] = useState(defaultLogo)
  const [companyName, setCompanyName] = useState('Travel Bill Pro')
  const [companyDetails, setCompanyDetails] = useState({
    gstin: '27ABCDE1234F1Z5',
    phone: '+91-9876543210',
    email: 'info@travelbillpro.com',
    address: 'Mumbai - 400001',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    accountHolder: 'Travel Bill Pro'
  })
  const [logoSettings, setLogoSettings] = useState({
    showInPDF: true,
    showInSidebar: true,
    logoSize: 'medium',
    showCompanyNameInPDF: true,
    showCompanyNameInSidebar: true
  })

  useEffect(() => {
    const savedLogo = localStorage.getItem('travel-bill-logo')
    const savedCompanyName = localStorage.getItem('travel-bill-company-name')
    const savedCompanyDetails = localStorage.getItem('travel-bill-company-details')
    const savedSettings = localStorage.getItem('travel-bill-logo-settings')
    
    if (savedLogo) {
      setCurrentLogo(savedLogo)
    }
    if (savedCompanyName) {
      setCompanyName(savedCompanyName)
    }
    if (savedCompanyDetails) {
      setCompanyDetails(JSON.parse(savedCompanyDetails))
    }
    if (savedSettings) {
      setLogoSettings(JSON.parse(savedSettings))
    }
  }, [])

  const uploadLogo = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoData = e.target.result
        setCurrentLogo(logoData)
        localStorage.setItem('travel-bill-logo', logoData)
        resolve(logoData)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const resetToDefault = () => {
    setCurrentLogo(defaultLogo)
    localStorage.setItem('travel-bill-logo', defaultLogo)
  }

  const updateCompanyName = (name) => {
    setCompanyName(name)
    localStorage.setItem('travel-bill-company-name', name)
  }

  const resetCompanyName = () => {
    setCompanyName('Travel Bill Pro')
    localStorage.setItem('travel-bill-company-name', 'Travel Bill Pro')
  }

  const updateCompanyDetails = (details) => {
    const updatedDetails = { ...companyDetails, ...details }
    setCompanyDetails(updatedDetails)
    localStorage.setItem('travel-bill-company-details', JSON.stringify(updatedDetails))
  }

  const resetCompanyDetails = () => {
    const defaultDetails = {
      gstin: '27ABCDE1234F1Z5',
      phone: '+91-9876543210',
      email: 'info@travelbillpro.com',
      address: 'Mumbai - 400001',
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      accountHolder: 'Travel Bill Pro'
    }
    setCompanyDetails(defaultDetails)
    localStorage.setItem('travel-bill-company-details', JSON.stringify(defaultDetails))
  }

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...logoSettings, ...newSettings }
    setLogoSettings(updatedSettings)
    localStorage.setItem('travel-bill-logo-settings', JSON.stringify(updatedSettings))
  }

  return (
    <LogoContext.Provider value={{
      currentLogo,
      companyName,
      companyDetails,
      logoSettings,
      uploadLogo,
      resetToDefault,
      updateCompanyName,
      resetCompanyName,
      updateCompanyDetails,
      resetCompanyDetails,
      updateSettings
    }}>
      {children}
    </LogoContext.Provider>
  )
}