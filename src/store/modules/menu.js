import { getMenuByUser } from '@/api/api'

const state = {
  activeMenuArrary: [],
  activeMenu: "/index",
  flag: false,
  menus: [],
  routes: [],
  displayMenus: [],
  btnMenus: []
}

const getters = {
  getMenu(state) {
    return state.menus
  },
  getFlag(state) {
    return state.flag
  },
  getRoutes(state) {
    return state.routes
  },
  getDisplayMenus(state) {
    return state.displayMenus
  },
  getBtnMenus(state) {
    return state.btnMenus
  }
}

const mutations = {
  setActiveMenu(state, menu) {
    state.activeMenu = menu
  },
  addActiveMenu(state, menu) {
    state.activeMenuArrary.push(menu)
  },
  setActiveMenuArrary(state, menu) {
    state.activeMenuArrary = menu
  },
  reduceActiveMenu(state, i) {
    state.activeMenuArrary.splice(i, 1)
  },
  setMenus(state, menus) {
    state.menus = menus
  },
  setFlag(state, flag) {
    state.flag = flag
  },
  setRoutes(state, routes) {
    state.routes = routes
  },
  setDisplayMenus(state, menus) {
    state.displayMenus = menus
  },
  setBtnMenus(state, btn) {
    state.btnMenus = btn
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      getMenuByUser().then(res => {
        if (res.code == 1000) {
          var data = res.data
          console.log("接口菜单原始数据:", data)  // 调试接口返回数据

          commit("setMenus", data)
          commit("setFlag", true)

          var routes = filterRoutes(data)
          commit("setRoutes", routes)

          var display = filterMenus(data)
          console.log("过滤后显示菜单:", display)  // 调试过滤后菜单

          if (display.length > 0) {
            for (let i = 0; i < display.length; i++) {
              var item = display[i]
              if (item.menuType == 1) {
                commit("setActiveMenu", item.routeUrl)
                commit("addActiveMenu", { name: item.menuName, url: item.routeUrl })
                break
              } else {
                if (item.child && item.child.length > 0) {
                  commit("setActiveMenu", item.child[0].routeUrl)
                  commit("addActiveMenu", { name: item.child[0].menuName, url: item.child[0].routeUrl })
                  break
                }
              }
            }
          }

          commit("setDisplayMenus", display)

          var btnMenus = filterBtnMenus(data)
          commit("setBtnMenus", btnMenus)

          resolve(routes)
        }
      })
    })
  }
}

// 过滤按钮权限菜单（menuType==2）
function filterBtnMenus(menus) {
  var menu = []
  menus.forEach(item => {
    if (item.menuType == 2) {
      menu.push(item)
    }
  })
  return menu
}

// 过滤一级菜单和目录，显示可见菜单
function filterMenus(menus) {
  var menu = []
  menus.forEach(item => {
    // 注意这里兼容 parentId 既有数字0也有字符串"0"
    if (item.menuType != 2 && item.visible == 0 && (item.parentId === "0" || item.parentId === 0)) {
      item.child = []
      if (item.menuType == 0) {
        filterChildMenus(item, menus)
      }
      menu.push(item)
    }
  })
  return menu
}

// 递归过滤子菜单，包含目录和菜单，且visible=0
function filterChildMenus(menu, menus) {
  menu.child = []
  menus.forEach(item => {
    if (menu.id == item.parentId) {
      if (item.menuType == 0 && item.visible == 0) {
        filterChildMenus(item, menus)
        menu.child.push(item)
      } else if (item.menuType == 1 && item.visible == 0) {
        menu.child.push(item)
      }
    }
  })
}

// 生成路由，只生成menuType=1，且target=1放children，target=0放顶层路由
function filterRoutes(menus) {
  var routes = []
  if (menus.length <= 0) {
    routes.push({ path: '/:pathMatch(.*)', redirect: '/403' })
    return routes
  }
  var root = {
    path: "",
    name: 'main',
    component: () => import(`@/views/layout/index`),
    redirect: '/index',
    children: []
  }
  var children = []
  menus.forEach(item => {
    if (item.menuType == 1) {
      var param = {
        path: item.routeUrl,
        name: item.menuName,
        component: loadView(item.componentUrl),
      }
      if (item.param) {
        param.props = JSON.parse(item.param)
      }
      if (item.target == 1) {
        children.push(param)
      }
      if (item.target == 0) {
        routes.push(param)
      }
    }
  });
  root.children = children
  routes.push(root)
  routes.push({ path: '/:pathMatch(.*)', redirect: '/404' })
  return routes
}

function loadView(view) {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views${view}`], resolve)
  } else {
    return () => import(`@/views${view}`)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
