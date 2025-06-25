import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken,removeToken } from '@/utils/token'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
    NProgress.start()
    if(getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else { 
            //这里就要开始构造动态路由和前端权限了
            //如果还没有获取菜单权限先请求获取
            if(store.getters['menu/getMenu'].length == 0 && !store.getters['menu/getFlag']) {
                store.dispatch('menu/generateRoutes').then(accessRoutes => {
                    // 根据roles权限生成可访问的路由表
                    router.addRoutes(accessRoutes) // 动态添加可访问路由表
                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                }).catch(err => {
                    store.dispatch('user/logout').then(() => {
                        store.commit("menu/setMenus",[])
                        store.commit("menu/setRoutes",[])
                        store.commit("menu/setDisplayMenus",[])
                        store.commit("menu/setBtnMenus",[])
                        store.commit('menu/setActiveMenuArrary', [])
                        store.commit('menu/setActiveMenu', "/index")
                        removeToken()
                        Message.error(err)
                        next({ path: '/login' })
                    })
                })
            } else {
                next()
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            // ?redirect=${to.fullPath}
            next(`/login`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})