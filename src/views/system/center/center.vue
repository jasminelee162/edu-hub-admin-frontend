<template>
  <div class="profile-center">
    <el-card class="profile-card">
      <div class="profile-header">
        <h2 class="profile-title">
          <i class="el-icon-user-solid"></i>
          <span>个人中心</span>
        </h2>
      </div>
      
      <div class="profile-content">
        <div class="profile-form">
          <el-form :model="user" :rules="rules" ref="ruleForm">
            <!-- 登录账号 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-user"></i>
                <span>登录账号</span>
              </div>
              <el-form-item prop="loginAccount" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.loginAccount"
                  disabled>
                  <i slot="prefix" class="el-icon-user"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 用户名 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-edit"></i>
                <span>用户名</span>
              </div>
              <el-form-item prop="userName" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.userName">
                  <i slot="prefix" class="el-icon-edit"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 邮箱 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-message"></i>
                <span>邮箱</span>
              </div>
              <el-form-item prop="email" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.email"
                  placeholder="3203986849@qq.com">
                  <i slot="prefix" class="el-icon-message"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 联系电话 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-phone"></i>
                <span>联系电话</span>
              </div>
              <el-form-item prop="tel" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.tel"
                  placeholder="18711607090">
                  <i slot="prefix" class="el-icon-phone"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 性别 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-user-solid"></i>
                <span>性别</span>
              </div>
              <el-form-item prop="sex" class="form-value">
                <el-radio-group v-model="user.sex">
                  <el-radio label="0">
                    <i class="el-icon-male"></i> 男
                  </el-radio>
                  <el-radio label="1">
                    <i class="el-icon-female"></i> 女
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            
            <!-- 登录IP -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-link"></i>
                <span>登录IP</span>
              </div>
              <el-form-item prop="loginIp" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.loginIp"
                  placeholder="127.0.0.1"
                  disabled>
                  <i slot="prefix" class="el-icon-link"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 登录时间 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-time"></i>
                <span>登录时间</span>
              </div>
              <el-form-item prop="loginDate" class="form-value">
                <el-input 
                  size="small" 
                  v-model="user.loginDate"
                  disabled>
                  <i slot="prefix" class="el-icon-time"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 修改密码时间 -->
            <div class="form-row">
              <div class="form-label">
                <i class="el-icon-lock"></i>
                <span>修改密码时间</span>
              </div>
              <el-form-item prop="pwdUpdateDate" class="form-value">
                <el-input 
                  size="mini" 
                  v-model="user.pwdUpdateDate"
                  disabled>
                  <i slot="prefix" class="el-icon-lock"></i>
                </el-input>
              </el-form-item>
            </div>
            
            <!-- 提交按钮 -->
            <div class="form-action">
              <el-button 
                type="primary" 
                size="small" 
                @click="submit"
                class="profile-submit-btn">
                <i class="el-icon-check"></i> 
                <span>保存信息</span>
              </el-button>
            </div>
          </el-form>
        </div>
        
        <!-- 头像区域 -->
        <div class="profile-avatar">
          <div class="avatar-container">
            <el-image 
              class="avatar-image"
              :src="$store.state.configure.HOST + user.avatar" 
              :preview-src-list="avatar"
              fit="cover">
              <div slot="error" class="avatar-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <div class="avatar-actions">
            <el-upload
              ref="upload"
              :action="uploadAvatarUrl() + '/' + this.user.id"
              :show-file-list="false"
              :multiple="false"
              :before-upload="beforeAvatorUpload"
              :on-success="handleAvatorSuccess"
              accept="image/*">
              <el-button 
                size="small" 
                type="primary" 
                class="avatar-upload-btn">
                <i class="el-icon-upload"></i>
                <span>更换头像</span>
              </el-button>
            </el-upload>
            <el-button 
              size="small" 
              type="warning" 
              @click="changePassword"
              class="password-change-btn">
              <i class="el-icon-key"></i>
              <span>修改密码</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mixin} from "../../../minix";
import {getUser,setUserInfo,setUserAvatar} from '../../../api/api' 

export default {
  mixins: [mixin],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系电话'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的联系电话'));
        }
      }
    };
    
    return {
      user: {
        avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fb4a87154-18b6-4163-ac80-f4dc4bf58d09%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693364028&t=c518c6c4a6ee2009b961f712a57c211f"
      },
      avatar: ["https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fb4a87154-18b6-4163-ac80-f4dc4bf58d09%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693364028&t=c518c6c4a6ee2009b961f712a57c211f"],
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        tel: [
          { required: true, validator:checkPhone, message: '请输入正确的联系电话', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          setUserInfo(this.user).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '保存成功!',
                customClass: 'profile-message'
              });
              this.getUserInfo()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    getUserInfo() {
      getUser().then(res => {
        if(res.code == 1000) {
          this.user = res.data
          this.user.sex = res.data.sex + ""
          this.avatar[0] = this.$store.state.configure.HOST + this.user.avatar
          this.setUser()
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      })
    },
    setUser() {
      this.$store.commit('user/setUser', JSON.stringify(this.user))
    },
    changePassword() {
      this.$bus.$emit('password', true)
    },
    handleAvatorSuccess(res){
      let _this = this;
      if(res.code == 1000){
        _this.$message({
          type: 'success',
          message: '上传成功!',
          customClass: 'profile-message'
        });
        this.getUserInfo()
      }else{
        _this.$notify.error({
          title: '错误',
          message: res.message
        });
      }
    },
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>


<style scoped>
.profile-center {
  padding: 20px;
  background-color: #F8F7FC;
  min-height: 100vh;
}

.profile-card {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(123, 104, 238, 0.15);
  border: none;
}

.profile-header {
  padding: 20px;
  border-bottom: 1px solid #F0EEF7;
}

.profile-title {
  color: #4A2B90;
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
}

.profile-title i {
  margin-right: 10px;
  font-size: 20px;
  color: #7B68EE;
}

.profile-content {
  display: flex;
  padding: 20px;
  flex-wrap: wrap;
}

.profile-form {
  flex: 1;
  min-width: 400px;
  padding-right: 30px;
}

.form-row {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}

.form-label {
  width: 120px;
  display: flex;
  align-items: center;
  color: #4A2B90;
  font-weight: 500;
}

.form-label i {
  margin-right: 8px;
  color: #7B68EE;
}

.form-value {
  flex: 1;
}

.profile-avatar {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 30px;
}

.avatar-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ECE9F4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F8FD;
  position: relative;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
}

.avatar-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  color: #D8D8E5;
}

.avatar-actions {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.avatar-upload-btn,
.password-change-btn {
  width: 150px;
  margin: 8px 0;
  padding: 10px 15px;
}

.form-action {
  margin-top: 30px;
  text-align: center;
}
</style>

<style>
/* 全局样式 */
.profile-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  padding-left: 35px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.profile-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.profile-input .el-input__prefix {
  left: 10px;
  color: #7B68EE;
}

.profile-input.is-disabled .el-input__inner {
  background-color: #F0EEF7;
  color: #888897;
}

.profile-submit-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 10px 25px;
}

.profile-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
  background: linear-gradient(135deg, #9370DB, #7B68EE);
}

.avatar-upload-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
}

.avatar-upload-btn:hover {
  background: linear-gradient(135deg, #9370DB, #7B68EE);
}

.password-change-btn {
  background: linear-gradient(135deg, #FFA500, #FF8C00);
  border: none;
  border-radius: 20px;
  color: white;
}

.password-change-btn:hover {
  background: linear-gradient(135deg, #FF8C00, #FFA500);
}

.profile-message {
  border-radius: 20px;
}

.profile-card .el-card__body {
  padding: 0 !important;
}

.el-form-item {
  margin-bottom: 0;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #7B68EE;
  background: #7B68EE;
}

.el-radio__input.is-checked+.el-radio__label {
  color: #7B68EE;
}

.el-radio__label i {
  margin-right: 5px;
}
</style>