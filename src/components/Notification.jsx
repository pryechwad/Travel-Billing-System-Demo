import { useState, useEffect } from 'react'

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className={`fixed top-4 right-4 ${getBgColor()} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in`}>
      <span className="text-lg">{getIcon()}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  )
}

export const useNotification = () => {
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
  }

  const hideNotification = () => {
    setNotification(null)
  }

  const NotificationComponent = notification ? (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={hideNotification}
    />
  ) : null

  return { showNotification, NotificationComponent }
}

export default Notification