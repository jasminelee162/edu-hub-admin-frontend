<template>
  <div class="login-page">
    <div class="login">

    </div>
    <div class="content">
        <img style="border-radius:50%;width:249px;height:249px" src="../../../assets/image/logo.png">
    </div>
    <div class="login-card">
        <div class="login-title">
            <span>在线学习教育平台</span>
        </div>
        <div class="login-input">
            <div class="input-item">
                <el-input prefix-icon="el-icon-user" v-model="username" placeholder="请输入用户名"></el-input>
            </div>
            <div class="input-item">
                <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="password" show-password></el-input>
            </div>
        </div>
        <el-button class="login-btn" type="primary" @click="login()">登陆</el-button>
        <!-- <span class="forget">Forgot your password?</span> -->
    </div>
  </div>
</template>

<script>
  import {login,getUser} from '../../../api/api'
  import { setLock } from '@/utils/lock'
  export default {
    data() {
      return{
        username: '',
        password: ''
      }
    },
    methods: {
        login() {
            if(!this.username) {
                this.$message({
                    message: '请输入用户名',
                    type: 'warning'
                });
                return;
            }
            if(!this.password) {
                this.$message({
                    message: '请输入密码',
                    type: 'warning'
                });
                return;
            }
            var params = {
                username: this.username,
                password: this.password
            }
            login(params).then(res => {
                if(res.code == 1000) {
                    this.$message({
                        message: '登陆成功',
                        type: 'success'
                    });
                    var that = this
                    var token = res.data.token
                    this.$store.commit('user/setToken', token)
                    this.getUserInfo()
                    setLock(false)
                    setTimeout(function() {
                        that.$router.push("/index")
                    },500)
                } else {
                    this.$message.error(res.message);
                }
            })
        },
        getUserInfo() {
            getUser().then(res => {
                if(res.code == 1000) {
                    this.$store.commit('user/setUser', JSON.stringify(res.data))
                }
            })
        },
    },
    created() {

    },
    mounted() {

    }
 }
</script>

<style   scoped>
  .login-page {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
  }
  .login {
    position: absolute;
    height: 2000px;
    width: 2000px;
    top:10%;
    right: 48%;
    transform: translateY(-50%);
    background-image: linear-gradient(-45deg,#009966 0,#33CC33 100%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
  }
  .content {
      position: absolute;
      top: 25%;
      left: 15%;
      text-align: center;
      color:#000000;font-size:25px;font-weight:bold
  }
  .title {
      height: 10%;
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #fff;
      font-weight: bold;
  }
  .login-card {
      margin-right: 10%;
      width: 35%;
      height: 60%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  .login-title {
      height:20%;
      color:#000000;
      font-weight:bold;
      font-size:30px;
      display:flex;
      align-items: center
  }
  .login-input {
      width:70%;
      height:40%
  }
  .forget {
      margin-top: 6%;
      color:#C4C3CA;font-weight:bold;font-size:15px;
  }
  .forget:hover {
      color: #FDE9A6;
  }
  .login-btn {
      margin-top: 3%;
      border-radius: 50px;
      width:120px;
      height: 46px;
      font-weight: bold;
      font-family: '黑体';
      font-size: 17px;
  }
  .login-btn:hover {
      background-color: #102770;
      color: #FDE9A6;
      font-weight: bold;
      font-family: '黑体';
      font-size: 17px;
      border: none;
  }
  .el-input ::v-deep .el-input__inner {
    border-radius: 50px;
    font-weight: bold;
    background-color: #F0F0F0;
    height: 50px;
  }
  .input-item {
      display: flex;
      margin-top:20px;
      align-items: center;
  }
</style>
