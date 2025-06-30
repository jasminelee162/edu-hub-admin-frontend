import { logout } from '@/api/api'
const state = {
  token: "",
  user: "",
}
const getters ={
  getToken(state) {
    if (state.token) {
      return state.token
    } else {
      return window.localStorage.getItem("token")
    }
  },
  getUser(state) {
    if (state.user) {
      return state.user
    } else {
      return window.localStorage.getItem("user")
    }
  }
}
  
const mutations = {
    setToken(state,token) {
      state.token = token
      window.localStorage.setItem("token",token)
    },
    setUser(state,user) {
      state.user = user
      window.localStorage.setItem("user",user)
    }
}

const actions = {
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // 调用后端登出接口
      logout().then(() => {
        commit('setToken', '')
        commit('setUser', '')
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("user")
        resolve()
      }).catch(error => {
        // 即使登出API失败也清除本地状态
        commit('setToken', '')
        commit('setUser', '')
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("user")
        resolve() // 仍然resolve以确保流程继续
      })
    })
  }
}
  
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
  