import axios from 'axios';


const whiteListPaths = ['/login'];
let   isRedirecting  = false;


const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许跨域携带 cookie
});


/**
 * @TODO 将localStorage改为sessionStorage
 */
request.interceptors.request.use(
  (config) => {
    // 添加认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const redirectToLogin = (showAlert: boolean = false) => {
  // 如果当前页面已经在白名单中，不再跳转
  const currentPath = window.location.pathname;
  if (whiteListPaths.includes(currentPath)) {
    console.log('当前页面在白名单内，不跳转登录');
    return;
  }
  if (isRedirecting) return;
  isRedirecting = true;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  if (showAlert) {
    alert('登录已过期，请重新登录');
  }
  
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};


// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 处理SSL证书错误（开发环境）
      if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.warn('SSL证书验证失败，请检查证书配置');
      }
      
      switch (error.response.status) {
        case 401:
          redirectToLogin(true);
          break;
        case 403:
          redirectToLogin(true);
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        case 502:
        case 503:
        case 504:
          console.error('服务器暂时不可用，请稍后重试');
          break;
        default:
          console.error(`请求失败: ${error.response.status}`);
      }
    } else if (error.request) {
      // 网络连接错误
      if (error.message.includes('Network Error')) {
        console.error('网络连接失败，请检查网络设置');
      }
    } else {
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;