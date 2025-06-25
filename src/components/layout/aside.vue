<template>
    <el-aside :width="isCollapse ? '64px' : '240px'">
        <div class="back-icon" :style="{width: isCollapse ? '63px' : '239px'}">
            <span class="logo-text" :class="isCollapse? 'xiaoshi':''">
                <span style="background:#FFFFFF;color:#000000">&nbsp;在线学习教育平台&nbsp;</span>
                <span> ADMIN</span>
            </span>
        </div>
        <el-menu
            @select="handleSelect"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="el-menu-vertical"
            :unique-opened="true"
            background-color="#222B40"
            :text-color="textColor"
            :default-active="this.$route.path + '@' + this.$route.name"
            active-text-color="#ffffff">
            <span v-for="(item,index) in displayMenus" :key="index">
                <el-menu-item v-if="item.menuType == 1" :index="item.routeUrl + '@' + item.menuName">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.menuName}}</span>
                </el-menu-item>
                <el-submenu v-if="item.menuType == 0" :index="index+''">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span v-if="!isCollapse">{{item.menuName}}</span>
                    </template>
                    <span v-for="(element,subscript) in item.child" :key="subscript">
                        <el-submenu v-if="element.menuType == 0" :index="index+'-'+subscript">
                            <template slot="title">
                                <i :class="element.icon"></i>
                                <span>{{element.menuName}}</span>
                            </template>
                            <el-menu-item v-for="(one,sub) in element.child" v-if="one.menuType == 1" :index="one.routeUrl + '@' + one.menuName">
                                <i :class="one.icon"></i>
                                <span slot="title">{{one.menuName}}</span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="element.menuType == 1" :index="element.routeUrl + '@' + element.menuName">
                            <i :class="element.icon"></i>
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
        // 监听collapse
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
    .el-aside {
        background-color: #222B40;
    }
    .back-icon {
        display: flex;
        height: 100px;
        background-color: #222B40;
        justify-content: center;
        align-items: center;
    }
    .logo {
        widows: 50px;
        height: 50px;
    }
    .logo-text {
        padding-left: 6px;
        /* Bold/19px */
        color: #fff;
        font-family: Mulish;
        font-size: 15px;
        font-weight: 700;
        line-height: 24;
        letter-spacing: 0.4000000059604645px;
    }
    .el-menu {
        height: calc(100vh - 100px);
        overflow-x: hidden;
        font-family: "黑体"!important;
        font-weight: 550 !important;
    }
    .el-menu::-webkit-scrollbar,.el-aside::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
    .el-submenu>>>.el-submenu__title:hover {
        color:#EAB040!important;
        background-color: #3E3F49!important;
    }
    .el-menu-vertical:deep(.el-menu-item:hover){
        color:#0863F2!important;
        background-color: #001528!important;
    }
    .el-menu-vertical:deep(.el-menu-item.is-active) {
        background-color: #001528!important;
        box-shadow:inset 5px 0 #DDE2FF;
    }
    .el-menu-item, .el-submenu__title {
        height: 47px !important;
        line-height: 47px !important;
    }
    .el-aside .el-menu {
        border-right: none !important;
    }
    .el-submenu .el-menu-item {
        background-color: #1B2233!important;
    }
    .el-submenu .el-submenu:deep(.el-submenu__title) {
        background-color: #1B2233!important;
    }
</style>
