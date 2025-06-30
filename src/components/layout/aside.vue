<template>
  <el-aside :width="isCollapse ? '72px' : '240px'" style="background-color: #0F1220; border-right: 1px solid #252A3A">
    <div class="back-icon" :style="{
      width: isCollapse ? '71px' : '239px',
      background: 'linear-gradient(90deg, #0F1220 0%, #1A1C3A 100%)',
      borderBottom: '1px solid rgba(124, 77, 255, 0.1)'
    }">
      <div class="logo-plain">
        <img 
          src="@/assets/image/systemlogo.png" 
          :style="{
            width: isCollapse ? '36px' : '180px',
            height: 'auto',
            transition: 'all 0.3s ease',
            maxHeight: '50px'
          }" 
          alt="系统Logo"
        />
      </div>
    </div>
    <el-menu
      @select="handleSelect"
      :collapse="isCollapse"
      :collapse-transition="false"
      class="el-menu-vertical"
      :unique-opened="true"
      background-color="#0F1220"
      :text-color="textColor"
      :default-active="this.$route.path + '@' + this.$route.name"
      active-text-color="#ffffff">
      <span v-for="(item,index) in displayMenus" :key="index">
        <el-menu-item v-if="item.menuType == 1" :index="item.routeUrl + '@' + item.menuName">
          <i :class="item.icon" style="color: #5C6BC0;"></i>
          <span slot="title">{{item.menuName}}</span>
        </el-menu-item>
        <el-submenu v-if="item.menuType == 0" :index="index+''">
          <template slot="title">
            <i :class="item.icon" style="color: #5C6BC0;"></i>
            <span v-if="!isCollapse">{{item.menuName}}</span>
          </template>
          <span v-for="(element,subscript) in item.child" :key="subscript">
            <el-submenu v-if="element.menuType == 0" :index="index+'-'+subscript">
              <template slot="title">
                <i :class="element.icon" style="color: #7986CB;"></i>
                <span>{{element.menuName}}</span>
              </template>
              <el-menu-item v-for="(one,sub) in element.child" v-if="one.menuType == 1" :index="one.routeUrl + '@' + one.menuName">
                <i :class="one.icon" style="color: #9FA8DA;"></i>
                <span slot="title">{{one.menuName}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="element.menuType == 1" :index="element.routeUrl + '@' + element.menuName">
              <i :class="element.icon" style="color: #9FA8DA;"></i>
              <span slot="title">{{element.menuName}}</span>
            </el-menu-item>
          </span>
        </el-submenu>
      </span>
    </el-menu>
  </el-aside>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "asside",
    data() {
      return{
        isCollapse: false,
        textColor: "#A4B7CC"
      }
    },
    computed: {
      ...mapState({
          activeMenuArrary: state => state.menu.activeMenuArrary,
          displayMenus: state => state.menu.displayMenus,
      })
    },
    methods: {
        handleSelect(key) {
            var menu = key.split("@")
            this.$router.push({
                path: menu[0],
            })
            this.$store.commit('menu/setActiveMenu', menu[0])
            for(let i = 0;i < this.activeMenuArrary.length;i++) {
                if(this.activeMenuArrary[i].url == menu[0]) {
                    return;
                }
            }
            var param = {
                "name": menu[1],
                "url": menu[0]
            }
            this.$store.commit('menu/addActiveMenu', param)
        }
    },
    created() {

    },
    mounted() {
        this.$bus.$on('collapse', res=>{
            this.isCollapse = res
        })
        this.$store.commit('menu/setActiveMenu', this.$route.path)
        for(let i = 0;i < this.activeMenuArrary.length;i++) {
            if(this.activeMenuArrary[i].url == this.$route.path) {
                return;
            }
        }
        var param = {
            "name": this.$route.name,
            "url": this.$route.path
        }
        this.$store.commit('menu/addActiveMenu', param)
    },
 }
</script>

<style scoped lang="scss">
    .logo-plain {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  
  img {
    object-fit: contain;
    display: block;
  }
}
    
    .back-icon {
        display: flex;
        height: 80px;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
        border-bottom: 1px solid rgba(124, 77, 255, 0.1);
        
        .logo-text {
            transition: all 0.3s;
            span {
                transition: all 0.3s;
                &:hover {
                    background: rgba(124, 77, 255, 0.3) !important;
                }
            }
        }
    }
    
    .el-menu {
        background: transparent !important;
        border-right: none !important;
        
        &:not(.el-menu--collapse) {
            width: 240px;
        }
        
        /* 菜单项基础样式 */
        &:deep(.el-menu-item),
        &:deep(.el-submenu__title) {
            color: #C5CAE9;
            height: 48px !important;
            line-height: 48px !important;
            margin: 4px 12px;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s;
            
            i {
                font-size: 18px;
                margin-right: 10px;
            }
            
            /* 悬停效果 */
            &:hover {
                background: rgba(94, 53, 177, 0.2) !important;
                color: #E1E1FF;
                
                i {
                    color: #B388FF;
                }
            }
        }
        
        /* 激活状态 - 保留原来的白色高亮条 */
        &:deep(.el-menu-item.is-active) {
             background: linear-gradient(90deg, rgba(124, 77, 255, 0.15), transparent) !important;
            color: #FFFFFF !important;
            font-weight: 500;
            position: relative;
            
            i {
                color: #7C4DFF !important;
            }
            
            &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 3px;
                    background: linear-gradient(to bottom, #7E57C2, #5C6BC0);
            } 
                           
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 3px;
                background: #ffffff;
                border-radius: 0 3px 3px 0;
            }
        }
        
        /* 子菜单样式 */
        &:deep(.el-submenu) {
            .el-submenu__title {
                color: #C5CAE9;
            }
            
            .el-menu {
                background: rgba(15, 18, 32, 0.8) !important;
                
                .el-menu-item {
                    padding-left: 54px !important;
                    color: #A4B7CC;
                    
                    i {
                        color: #7986CB;
                    }
                }
            }
        }
    }
    
    /* 折叠状态下的微调 */
    .el-menu--collapse {
        .el-submenu {
            & > .el-submenu__title {
                padding-left: 20px !important;
                
                .el-submenu__icon-arrow {
                    display: none;
                }
            }
        }
    }
    
    .xiaoshi {
        opacity: 0;
        width: 0;
        height: 0;
        overflow: hidden;
    }
</style>