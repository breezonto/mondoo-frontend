// 环境检测工具函数
export const isProduction = import.meta.env.PROD
export const isDevelopment = import.meta.env.DEV

// 获取 WebSocket URL
export const getWebSocketUrl = (path = '') => {
  const baseUrl = import.meta.env.VITE_WS_BASE_URL
  
  if (isProduction) {
    // 生产环境使用相对路径或配置的完整 URL
    if (baseUrl && baseUrl.startsWith('wss://')) {
      return `${baseUrl}${path}`
    }
    // 如果没有配置，使用当前域名的 WSS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${path}`
  }
  
  // 开发环境
  return `${baseUrl}${path}`
}

// 获取 API URL
export const getApiUrl = (endpoint = '') => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  
  if (isProduction && !baseUrl.startsWith('http')) {
    // 生产环境使用相对路径
    return `${baseUrl}${endpoint}`
  }
  
  // 开发环境或完整 URL
  return `${baseUrl}${endpoint}`
}