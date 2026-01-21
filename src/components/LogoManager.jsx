import { useState, useRef } from 'react'
import { useLogo } from '../contexts/LogoContext'

const LogoManager = () => {
  const { currentLogo, companyName, companyDetails, logoSettings, uploadLogo, resetToDefault, updateCompanyName, resetCompanyName, updateCompanyDetails, resetCompanyDetails, updateSettings } = useLogo()
  const [isUploading, setIsUploading] = useState(false)
  const [tempCompanyName, setTempCompanyName] = useState(companyName)
  const [tempCompanyDetails, setTempCompanyDetails] = useState(companyDetails)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    setIsUploading(true)
    try {
      await uploadLogo(file)
      alert('Logo uploaded successfully!')
    } catch (error) {
      alert('Error uploading logo: ' + error.message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleReset = () => {
    if (confirm('Reset to default logo? This action cannot be undone.')) {
      resetToDefault()
      alert('Logo reset to default!')
    }
  }

  const handleCompanyNameSave = () => {
    updateCompanyName(tempCompanyName)
    alert('Company name updated successfully!')
  }

  const handleCompanyNameReset = () => {
    if (confirm('Reset company name to default?')) {
      resetCompanyName()
      setTempCompanyName('Travel Bill Pro')
      alert('Company name reset to default!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Logo & Company Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Company Name Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Company Name</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current: {companyName}</label>
              <input
                type="text"
                value={tempCompanyName}
                onChange={(e) => setTempCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCompanyNameSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Save Company Name
              </button>
              <button
                onClick={handleCompanyNameReset}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Company Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Company Details</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN Number</label>
              <input
                type="text"
                value={tempCompanyDetails.gstin}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, gstin: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="27ABCDE1234F1Z5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={tempCompanyDetails.phone}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91-9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={tempCompanyDetails.email}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={tempCompanyDetails.address}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City - Pincode"
              />
            </div>
          </div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Bank Account Details</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={tempCompanyDetails.bankName}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, bankName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State Bank of India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={tempCompanyDetails.accountNumber}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, accountNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
              <input
                type="text"
                value={tempCompanyDetails.ifscCode}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, ifscCode: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SBIN0001234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
              <input
                type="text"
                value={tempCompanyDetails.accountHolder}
                onChange={(e) => setTempCompanyDetails({...tempCompanyDetails, accountHolder: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Name"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { updateCompanyDetails(tempCompanyDetails); alert('Company details updated!'); }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Save Company Details
            </button>
            <button
              onClick={() => { resetCompanyDetails(); setTempCompanyDetails(companyDetails); alert('Company details reset!'); }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* Current Logo Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Current Logo</h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <img 
                src={currentLogo} 
                alt="Current Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>This logo will appear in your invoices and application</p>
              <p>Recommended: SVG, PNG, or JPG format</p>
              <p>Maximum size: 2MB</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Upload New Logo</h3>
          <div className="flex gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Logo'}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reset Logo to Default
            </button>
          </div>
        </div>

        {/* Logo Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Display Settings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo Settings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Logo Display</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show logo in PDF invoices</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logoSettings.showInPDF}
                      onChange={(e) => updateSettings({ showInPDF: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show logo in sidebar</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logoSettings.showInSidebar}
                      onChange={(e) => updateSettings({ showInSidebar: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Logo size</label>
                  <select
                    value={logoSettings.logoSize}
                    onChange={(e) => updateSettings({ logoSize: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Name Settings */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Company Name Display</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show company name in PDF invoices</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logoSettings.showCompanyNameInPDF}
                      onChange={(e) => updateSettings({ showCompanyNameInPDF: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show company name in sidebar</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={logoSettings.showCompanyNameInSidebar}
                      onChange={(e) => updateSettings({ showCompanyNameInSidebar: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoManager