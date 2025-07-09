import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import './utils/dict'

// UI组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// HTTP客户端
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueQuillEditor)

/**
 * 创建Axios实例
 */
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 15000,
  withCredentials: true
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    // 从localStorage直接获取token
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 自动设置Content-Type
    const method = config.method.toLowerCase()
    if (['post', 'put', 'patch'].includes(method)) {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 1000) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data || res
  },
  error => {
    return Promise.reject(error)
  }
)

// 全局挂载axios实例
Vue.prototype.$http = service

// 全局事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')