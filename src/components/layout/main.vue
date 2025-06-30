<template>
  <el-main class="el-main">
    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialogVisible"
      width="400px"
      :before-close="handlePasswordClose"
      custom-class="password-dialog"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="false"
      :modal="true"
      :lock-scroll="true"
      :transition="'el-fade-in-linear'">
      
      <div class="dialog-content">
        <div class="dialog-header">
          <i class="el-icon-lock" style="color: #7B68EE; font-size: 24px; margin-right: 10px;"></i>
          <span style="font-size: 18px; color: #4B0082;">修改 {{user.userName}} 的密码</span>
        </div>
        
        <div class="input-group">
          <div class="input-label">
            <span>旧密码</span>
            <el-tooltip content="请输入当前使用的密码" placement="top">
              <i class="el-icon-question" style="color: #9370DB; margin-left: 5px;"></i>
            </el-tooltip>
          </div>
          <el-input 
            show-password 
            v-model="oldPassword" 
            size="medium"
            autocomplete="off"
            placeholder="请输入当前密码"
            prefix-icon="el-icon-key"
            class="password-input"
            @input="clearError('oldPassword')">
          </el-input>
          <div v-if="errors.oldPassword" class="error-message">{{ errors.oldPassword }}</div>
        </div>
        
        <div class="input-group" style="margin-top: 20px;">
          <div class="input-label">
            <span>新密码</span>
            <el-tooltip content="8-16位，包含字母和数字" placement="top">
              <i class="el-icon-question" style="color: #9370DB; margin-left: 5px;"></i>
            </el-tooltip>
          </div>
          <el-input 
            show-password 
            v-model="newPassword" 
            size="medium"
            autocomplete="off"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            class="password-input"
            @input="clearError('newPassword')">
          </el-input>
          <div v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</div>
        </div>
        
        <div class="input-group" style="margin-top: 20px;">
          <div class="input-label">
            <span>确认新密码</span>
            <el-tooltip content="请再次输入新密码" placement="top">
              <i class="el-icon-question" style="color: #9370DB; margin-left: 5px;"></i>
            </el-tooltip>
          </div>
          <el-input 
            show-password 
            v-model="confirmPassword" 
            size="medium"
            autocomplete="off"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-lock"
            class="password-input"
            :class="{'input-error': confirmPassword && !isPasswordMatch}"
            @input="clearError('confirmPassword')">
          </el-input>
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          <div v-if="confirmPassword && !isPasswordMatch" class="error-message">两次输入的密码不一致</div>
        </div>
        
        <div class="password-strength" v-if="newPassword">
          <div 
            class="strength-bar" 
            :class="{
              'weak': passwordStrength === 'weak',
              'medium': passwordStrength === 'medium',
              'strong': passwordStrength === 'strong'
            }"></div>
          <span class="strength-text" :style="{color: strengthColor}">{{strengthText}}</span>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button 
          size="medium" 
          @click="handlePasswordClose"
          class="cancel-btn">
          取消
        </el-button>
        <el-button 
          size="medium" 
          type="primary" 
          @click="validateBeforeSubmit"
          :disabled="!isFormValid"
          class="confirm-btn">
          确认修改
        </el-button>
      </div>
    </el-dialog>
    
    <!--<div class="setting">
      <img style="width:40px;height:40px" src="../../assets/image/setting.gif">
    </div>-->
    <keep-alive max=10>
      <router-view :key="fullPath"></router-view>
    </keep-alive>
  </el-main>
</template>

<script>
import {changePassword} from "../../api/api"
import { mapState,mapGetters } from 'vuex'

export default {
  name: "main",
  data() {
    return {
      user: {},
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordDialogVisible: false,
      errors: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
    }
  },
  methods: {
    handlePasswordClose() {
      this.oldPassword = ""
      this.newPassword = ""
      this.confirmPassword = ""
      this.errors = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
      this.$bus.$emit('password', false)
    },
    
    clearError(field) {
      this.errors[field] = ""
    },
    
    validateBeforeSubmit() {
      let isValid = true
      
      if (!this.oldPassword) {
        this.errors.oldPassword = "请输入旧密码"
        isValid = false
      }
      
      if (!this.newPassword) {
        this.errors.newPassword = "请输入新密码"
        isValid = false
      } else if (this.newPassword.length < 6) {
        this.errors.newPassword = "密码长度不能少于6位"
        isValid = false
      }
      
      if (!this.confirmPassword) {
        this.errors.confirmPassword = "请确认新密码"
        isValid = false
      } else if (!this.isPasswordMatch) {
        this.errors.confirmPassword = "两次输入的密码不一致"
        isValid = false
      }
      
      if (isValid) {
        this.passwordSubmit()
      }
    },
    
    passwordSubmit() {
      var param = {
        id: this.user.id,
        password: this.oldPassword,
        newPassword: this.newPassword
      }
      
      this.$loading({
        lock: true,
        text: '正在修改密码...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      changePassword(param).then(res => {
        this.$loading().close();
        
        if(res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "密码修改成功，请重新登录",
            duration: 3000
          });
          
          this.handlePasswordClose();
          
          setTimeout(() => {
            this.$store.dispatch('user/logout').then(() => {
              this.$router.push({
                path: '/login',
                query: {
                  redirect: this.$route.fullPath,
                  passwordChanged: true
                }
              });
            });
          }, 1500);
          
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message,
            duration: 3000
          });
        }
      }).catch(error => {
        this.$loading().close();
        this.$notify.error({
          title: '错误',
          message: '修改密码失败，请稍后重试',
          duration: 3000
        });
      });
    },
    
    clearKeepAlive(fullUrl) {
      this.$children.forEach((item) => {
        item.$children.forEach((child) => {
          if (child.$vnode.data.key == fullUrl) {
            this._myDestory(child);
          }
        })
      });
    },
    
    _myDestory(keepAliveComponent) {
      if (
        keepAliveComponent.$vnode &&
        keepAliveComponent.$vnode.data.keepAlive
      ) {
        if (
          keepAliveComponent.$vnode.parent &&
          keepAliveComponent.$vnode.parent.componentInstance &&
          keepAliveComponent.$vnode.parent.componentInstance.cache
        ) {
          if (keepAliveComponent.$vnode.componentOptions) {
            var key =
              keepAliveComponent.$vnode.key == null
                ? keepAliveComponent.$vnode.componentOptions.Ctor.cid +
                  (keepAliveComponent.$vnode.componentOptions.tag
                    ? `::${keepAliveComponent.$vnode.componentOptions.tag}`
                    : "")
                : keepAliveComponent.$vnode.key;
            var cache = keepAliveComponent.$vnode.parent.componentInstance.cache;
            var keys = keepAliveComponent.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      keepAliveComponent.$destroy();
    },
  },
  computed: {
    fullPath() {
      return this.$route.fullPath;
    },
    ...mapGetters('user',['getUser']),
    
    passwordStrength() {
      if (!this.newPassword) return '';
      const hasLetter = /[a-zA-Z]/.test(this.newPassword);
      const hasNumber = /[0-9]/.test(this.newPassword);
      const hasSpecial = /[^a-zA-Z0-9]/.test(this.newPassword);
      
      if (this.newPassword.length < 6) return 'weak';
      if (this.newPassword.length >= 8 && hasLetter && hasNumber) {
        return hasSpecial ? 'strong' : 'medium';
      }
      return 'medium';
    },
    
    strengthText() {
      switch (this.passwordStrength) {
        case 'weak': return '密码强度: 弱';
        case 'medium': return '密码强度: 中';
        case 'strong': return '密码强度: 强';
        default: return '';
      }
    },
    
    strengthColor() {
      switch (this.passwordStrength) {
        case 'weak': return '#FF4D4F';
        case 'medium': return '#FAAD14';
        case 'strong': return '#52C41A';
        default: return '';
      }
    },
    
    isPasswordMatch() {
      return this.newPassword && this.newPassword === this.confirmPassword;
    },
    
    isFormValid() {
      return this.oldPassword && 
             this.newPassword && 
             this.confirmPassword &&
             this.isPasswordMatch &&
             this.newPassword.length >= 6;
    }
  },
  created() {
     
  },
  mounted() {
    this.$bus.$on("clearKeepAlive", this.clearKeepAlive);
    this.$bus.$on('password', (visible) => {
      this.passwordDialogVisible = visible
    })
    this.user = JSON.parse(this.getUser)
  }
}
</script>

<style scoped>
    .el-main {
        background-color: #F5F9FA;
        overflow-y: scroll;
        height: calc(100vh - 76px);
        position: relative;
    }
    .el-main.el-main::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
    .setting {
      width:40px;
      height: 40px;
      position: fixed;
      right: 0;
      top: 150px;
      z-index: 999;
      border: 1px solid #DEDEDE;
      border-radius: 10px;
      overflow: hidden;
    }
    .password-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(75, 0, 130, 0.2);
  animation: dialogFadeIn 0.4s ease-out;
}

@keyframes dialogFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-content {
  padding: 20px 25px;
}

.dialog-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F0F0F5;
}

.input-group {
  margin-bottom: 15px;
}

.input-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4B0082;
}

.password-input {
  transition: all 0.3s ease;
}

.password-input:hover {
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.password-input >>> .el-input__inner {
  border-radius: 8px;
  border: 1px solid #D8D8E5;
  transition: all 0.3s ease;
}

.password-input >>> .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.password-strength {
  margin-top: 10px;
  height: 20px;
  display: flex;
  align-items: center;
}

.strength-bar {
  height: 4px;
  width: 100px;
  margin-right: 10px;
  border-radius: 2px;
  background: #E0E0E0;
  position: relative;
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  transition: width 0.5s ease;
}

.strength-bar.weak::after {
  width: 30%;
  background: #FF4D4F;
}

.strength-bar.medium::after {
  width: 60%;
  background: #FAAD14;
}

.strength-bar.strong::after {
  width: 100%;
  background: #52C41A;
}

.strength-text {
  font-size: 12px;
  transition: color 0.3s ease;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 25px;
  border-top: 1px solid #F0F0F5;
}

.cancel-btn {
  border-radius: 8px;
  padding: 10px 20px;
  background: #F5F5FA;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #EDEDF7;
  color: #6A5ACD;
  border-color: #C7C7D5;
}

.confirm-btn {
  border-radius: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 12px rgba(123, 104, 238, 0.3);
}

.confirm-btn:disabled {
  background: #D8D8E5;
  cursor: not-allowed;
}
</style>