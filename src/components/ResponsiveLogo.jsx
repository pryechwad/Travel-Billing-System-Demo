import { useLogo } from '../contexts/LogoContext'

const ResponsiveLogo = ({ 
  size = 'medium', 
  showFallback = true, 
  className = '', 
  containerClassName = '',
  alt = 'Logo'
}) => {
  const { currentLogo, logoSettings } = useLogo()

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-6 h-6'
      case 'large':
        return 'w-12 h-12'
      case 'xlarge':
        return 'w-16 h-16'
      case 'medium':
      default:
        return 'w-8 h-8'
    }
  }

  const getFallbackSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs'
      case 'large':
        return 'text-sm'
      case 'xlarge':
        return 'text-base'
      case 'medium':
      default:
        return 'text-xs'
    }
  }

  if (!logoSettings.showInSidebar && !showFallback) {
    return null
  }

  return (
    <div className={`${getSizeClasses()} flex items-center justify-center ${containerClassName}`}>
      {logoSettings.showInSidebar ? (
        <img 
          src={currentLogo} 
          alt={alt}
          className={`max-w-full max-h-full object-contain ${className}`}
        />
      ) : showFallback ? (
        <div className={`${getSizeClasses()} bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center`}>
          <span className={`text-white font-bold ${getFallbackSize()}`}>TBP</span>
        </div>
      ) : null}
    </div>
  )
}

export default ResponsiveLogo