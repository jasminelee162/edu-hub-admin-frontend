import axios from 'axios'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'

const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000
})

// 不需要登录验证的白名单路径
const WHITE_LIST = [
  '/email/sendCode',  // 添加验证码发送接口到白名单
  '/email/login'      // 添加邮箱登录接口到白名单
]

instance.interceptors.request.use(
    function (config) {
        // 白名单请求不添加token
        if (!WHITE_LIST.some(path => config.url.includes(path))) {
            config.headers.x_access_token = window.localStorage.getItem("token")
        }
        
        if (config.method === 'post') {
            // 只有非白名单的POST请求才添加 _t
            if (
              !WHITE_LIST.some(path => config.url.includes(path)) &&
              !Array.isArray(config.data) &&
              !(config.data instanceof FormData)
            ) {
                config.data = {
                    ...config.data,
                    _t: Date.parse(new Date()) / 1000
                }
            }
        } else if (config.method === 'get') {
            config.params = {
              random: Math.random(),
              ...config.params
            }
        }
        return config
    },
    function (err) {
        return Promise.reject(err)
    }
)

instance.interceptors.response.use(
    function (response) {
        const res = response
        
        // 白名单请求跳过特殊状态码检查
        if (WHITE_LIST.some(path => response.config.url.includes(path))) {
            return res.data
        }
        
        // 原有状态码处理
        if (res.data.code === 1011 || res.data.code == 1008 || res.data.code == 1006) {
            handleSessionExpired()
            return Promise.reject('error')
        } else if(res.data.code == 1009) {
            handleAccountLocked()
            return Promise.reject('error')
        } else if (res.status != 200) {
            handleSystemError()
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    function (err) {
        handleSystemError()
        return Promise.reject(err)
    }
)

// 提取公共处理方法
function handleSessionExpired() {
    MessageBox.alert('系统登录已过期，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error'
    }).then(() => {
        logoutAndReload()
    })
}

function handleAccountLocked() {
    MessageBox.alert('该账号已被锁定', '错误', {
        confirmButtonText: '确定',
        type: 'error'
    }).then(() => {
        logoutAndReload()
    })
}

function handleSystemError() {
    MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
        confirmButtonText: '确定',
        type: 'error'
    })
}

function logoutAndReload() {
    store.dispatch('user/logout').then(() => {
        store.commit("menu/setMenus",[])
        store.commit("menu/setRoutes",[])
        store.commit("menu/setDisplayMenus",[])
        store.commit("menu/setBtnMenus",[])
        location.reload()
    })
}

export function get(url, params) {
    return instance.get(url, {params})
}

export function post(url, data) {
    return instance.post(url, data)
}

export default instance
