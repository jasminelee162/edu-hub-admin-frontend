<template>
  <el-header class="header-container">
    <div class="header-left">
      <div class="collapse-btn" @click="toggleCollapse">
        <i class="icon" :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="header-right">
      <div class="search-bar">
        <el-input
          v-model="search"
          size="small"
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          class="search-input"
        ></el-input>
      </div>
      
      <div class="action-items">
        <el-tooltip content="全屏" placement="bottom">
          <div class="action-item" @click="toggleFullScreen">
            <i class="icon el-icon-full-screen"></i>
          </div>
        </el-tooltip>
        
        <el-tooltip content="消息通知" placement="bottom">
          <div class="action-item">
            <el-badge :value="3" class="badge">
              <i class="icon el-icon-bell"></i>
            </el-badge>
          </div>
        </el-tooltip>
        
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-profile">
            <img 
              class="user-avatar" 
              :src="$store.state.configure.HOST + user.avatar" 
              alt="用户头像"
            />
            <span class="user-name">{{ user.userName }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          
          <el-dropdown-menu slot="dropdown" class="dropdown-menu">
            <el-dropdown-item command="password">
              <i class="el-icon-ship"></i>修改密码
            </el-dropdown-item>
            <el-dropdown-item command="lock">
              <i class="el-icon-lock"></i>锁屏
            </el-dropdown-item>
            <el-dropdown-item divided command="logout" class="logout-item">
              <i class="el-icon-switch-button"></i>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script>
import { removeToken } from '@/utils/token'
import { logout } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: "TopHeader",
  data() {
    return {
      user: {
        avatar: "/img/avatar.jpg",
        userName: "未登录"
      },
      search: "",
      collapse: false,
      breadcrumbList: []
    }
  },
  computed: {
    ...mapGetters('user', ['getUser'])
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    toggleCollapse() {
      this.collapse = !this.collapse
      this.$bus.$emit('collapse', this.collapse)
    },
    toggleFullScreen() {
      const de = document.documentElement
      if (!document.fullscreenElement) {
        if (de.requestFullscreen) {
          de.requestFullscreen()
        } else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen()
        } else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    },
    handleCommand(command) {
      if (command === "password") {
        this.$bus.$emit('password', true)
      } else if (command === "lock") {
        this.$bus.$emit('lock', 1)
      } else if (command === "logout") {
        this.handleLogout()
      }
    },
    handleLogout() {
      logout().then(res => {
        if (res.code === 1000) {
          this.$store.commit('user/setToken', "")
          this.$store.commit('user/setUser', "")
          this.$store.commit('menu/setMenus', [])
          this.$store.commit('menu/setRoutes', [])
          this.$store.commit('menu/setDisplayMenus', [])
          this.$store.commit('menu/setBtnMenus', [])
          this.$store.commit("menu/setFlag", false)
          this.$store.commit('menu/setActiveMenuArrary', [])
          this.$store.commit('menu/setActiveMenu', "/index")
          removeToken()
          this.$router.push("/login")
          this.$message.success("退出登录成功")
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    getBreadcrumb() {
      const matched = this.$route.matched.filter(item => item.name)
      this.breadcrumbList = matched.map(item => item.meta.title || item.name)
    }
  },
  mounted() {
    this.user = JSON.parse(this.getUser)
    this.getBreadcrumb()
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  height: 60px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(90deg, #0F1220 0%, #1A1C3A 100%);
  border-bottom: 1px solid rgba(124, 77, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #E1E1FF;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;
      color: #B388FF;
      transition: all 0.3s;
      
      &:hover {
        color: #7C4DFF;
        transform: scale(1.1);
      }
    }
    
    .breadcrumb {
      ::v-deep .el-breadcrumb__inner {
        color: #A4B7CC;
        font-weight: 400;
        
        &.is-link {
          color: #C5CAE9;
        }
      }
      
      ::v-deep .el-breadcrumb__separator {
        color: #7986CB;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .search-bar {
      margin-right: 20px;
      
      .search-input {
        width: 200px;
        
        ::v-deep .el-input__inner {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(124, 77, 255, 0.2);
          color: #E1E1FF;
          transition: all 0.3s;
          
          &:focus {
            border-color: rgba(124, 77, 255, 0.5);
            box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.1);
          }
          
          &::placeholder {
            color: #7986CB;
          }
        }
        
        ::v-deep .el-input__prefix {
          color: #7986CB;
        }
      }
    }
    
    .action-items {
      display: flex;
      align-items: center;
      
      .action-item {
        margin: 0 10px;
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s;
        position: relative;
        
        &:hover {
          background: rgba(94, 53, 177, 0.2);
          
          .icon {
            color: #B388FF;
          }
        }
        
        .icon {
          font-size: 18px;
          color: #C5CAE9;
          transition: all 0.3s;
        }
        
        .badge {
          ::v-deep .el-badge__content {
            background: #FF5252;
            border: none;
          }
        }
      }
      
      .user-profile {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 20px;
        transition: all 0.3s;
        margin-left: 10px;
        
        &:hover {
          background: rgba(94, 53, 177, 0.2);
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
          border: 2px solid rgba(124, 77, 255, 0.3);
        }
        
        .user-name {
          font-size: 14px;
          margin-right: 5px;
          color: #E1E1FF;
        }
        
        .el-icon-arrow-down {
          font-size: 12px;
          color: #7986CB;
        }
      }
    }
  }
}

.dropdown-menu {
  background: #1A1C3A;
  border: 1px solid rgba(124, 77, 255, 0.2);
  
  ::v-deep .el-dropdown-menu__item {
    color: #C5CAE9;
    font-size: 13px;
    
    &:hover {
      background: rgba(124, 77, 255, 0.1);
      color: #E1E1FF;
    }
    
    i {
      margin-right: 8px;
      color: #7986CB;
    }
  }
  
  .logout-item {
    color: #FF5252 !important;
    
    &:hover {
      background: rgba(255, 82, 82, 0.1) !important;
    }
    
    i {
      color: #FF5252 !important;
    }
  }
}
</style>