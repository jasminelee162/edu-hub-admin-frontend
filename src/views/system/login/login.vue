<template>
<div class="login-container">
    <!-- 粒子背景画布 -->
    <canvas id="particle-canvas"></canvas>
    
    <!-- 左侧内容区域 - 增强版 -->
    <div class="left-content">
      <div class="logo-area" style="padding-top: 30px;">
        <img style="width:300px; padding-left:0px; margin-top:20px;" src="@/assets/image/systemlogo.png" />
        <div class="platform-role">教师 · 管理中枢</div>
      </div>
      
      <div class="feature-list">
        <div class="feature-item">
          <i class="el-icon-s-data"></i>
          <span>学情数据分析</span>
        </div>
        <div class="feature-item">
          <i class="el-icon-notebook-2"></i>
          <span>课程内容管理</span>
        </div>
        <div class="feature-item">
          <i class="el-icon-s-check"></i>
          <span>作业批改系统</span>
        </div>
        <div class="feature-item">
          <i class="el-icon-chat-line-round"></i>
          <span>师生互动平台</span>
        </div>
      </div>
      
      <div class="quote-area">
        <p class="quote-text">"教育不是灌输，而是点燃火焰"</p>
        <p class="quote-author">—— 苏格拉底 ——</p>
      </div>
    </div>
    
    <!-- 右侧登录卡片 -->
    <div class="login-card">
      <h2 class="slogan-en">TEACH WITH INTELLIGENCE</h2>
      <p class="slogan-cn">智能教育管理平台，赋能高效教学</p>
      
      <div class="divider"></div>
      
      <p class="sub-slogan">精准掌握每位学生的学习轨迹<br>用数据驱动个性化教学方案</p>
      
      <div class="login-form">
        <!-- 登录方式切换 -->
        <div class="login-type-switch">
          <span
            :class="['login-type-option', loginType === 'account' ? 'active' : '']"
            @click="loginType = 'account'"
          >
            账号密码登录
          </span>
          <span
            :class="['login-type-option', loginType === 'email' ? 'active' : '']"
            @click="loginType = 'email'"
          >
            邮箱验证码登录
          </span>
        </div>

        <!-- 账号密码登录表单 -->
        <div v-if="loginType === 'account'">
          <el-input
            v-model="username"
            placeholder="工号/用户名"
            prefix-icon="el-icon-user"
            class="custom-input"
          ></el-input>
          
          <el-input
            v-model="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
          ></el-input>
          
          <el-button 
            type="primary" 
            class="login-btn"
            @click="login"
          >
            登 录
          </el-button>
        </div>

        <!-- 邮箱验证码登录表单 -->
        <div v-else>
          <el-input
            v-model="emailInfo.email"
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
            class="custom-input"
          ></el-input>
          
          <div style="display: flex;">
            <el-input
              v-model="emailInfo.code"
              placeholder="请输入验证码"
              prefix-icon="el-icon-key"
              class="custom-input"
              style="flex: 1; margin-right: 10px;"
            ></el-input>
            <el-button 
              :disabled="isSending"
              @click="sendCode"
              style="width: 120px;"
            >
              {{ isSending ? countdown + 's 后重发' : '获取验证码' }}
            </el-button>
          </div>
          
          <el-button 
            type="primary" 
            class="login-btn"
            @click="emailLogin"
          >
            登 录
          </el-button>
        </div>
      </div>
      
      <div class="footer">
        <p>—— 让科技赋能每一份教育热忱 ——</p>
        <p class="en-footer">Where Innovation Meets Education</p>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getUser, sendEmailCode, loginWithEmail } from '../../../api/api'
import { setLock } from '@/utils/lock'

export default {
  data() {
    return {
      username: '',
      password: '',
      loginType: 'account', // 登录方式切换
      emailInfo: {
        email: '',
        code: ''
      },
      isSending: false,
      countdown: 60,
      timer: null,
      sentEmail: '' // 记录发送验证码时的邮箱
    }
  },
  mounted() {
    this.initParticles()
  },
  created() {
    if (this.$route.query.passwordChanged) {
      this.$notify.success({
        title: '提示',
        message: '密码修改成功，请使用新密码登录',
        duration: 5000
      });

      const query = { ...this.$route.query }
      delete query.passwordChanged
      this.$router.replace({ ...this.$route, query })
    }
  },
  methods: {
    sendCode() {
      if (!this.emailInfo.email) {
        this.$message({
          message: '请输入邮箱',
          type: 'warning'
        });
        return;
      }

      // 记录发送验证码的邮箱
      this.sentEmail = this.emailInfo.email;

      const loadingInstance = this.$loading({
        lock: true,
        text: '正在发送验证码...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      sendEmailCode(this.emailInfo.email).then(() => {
        loadingInstance.close();
        this.$message.success('验证码发送成功');
        this.isSending = true;
        this.countdown = 60;
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(this.timer);
            this.isSending = false;
          }
        }, 1000);
      }).catch(() => {
        loadingInstance.close();
        this.$message.error('验证码发送失败');
      });
    },

emailLogin() {
  if (!this.emailInfo.email) {
    this.$message.warning('请输入邮箱');
    return;
  }
  if (!this.emailInfo.code) {
    this.$message.warning('请输入验证码');
    return;
  }
  if (!this.sentEmail) {
    this.$message.warning('请先发送验证码');
    return;
  }
  if (this.emailInfo.email !== this.sentEmail) {
    this.$message.warning('邮箱与发送验证码的邮箱不一致，请重新发送验证码');
    return;
  }

  const loadingInstance = this.$loading({
    lock: true,
    text: '正在登录...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  console.log('请求登录参数:', {
    email: this.emailInfo.email,
    code: this.emailInfo.code
  });

  loginWithEmail(this.emailInfo.email, this.emailInfo.code)
    .then(res => {
      loadingInstance.close();
      console.log('登录接口返回:', res);
      if (res.code === 1000) {
        this.$message.success('登录成功');
        const token = res.data.token;
        localStorage.setItem('user_token', token);
        this.$store.commit('user/setToken', token);

        this.getUserInfo().then(() => {
          setLock(false);
          this.$router.push(this.$route.query.redirect || '/index');
        });
      } else {
        this.$message.error(res.message || '登录失败，请检查验证码');
      }
    })
    .catch(err => {
      loadingInstance.close();
      console.error('登录失败错误:', err);
      this.$message.error(err.response?.data?.message || '登录失败，请稍后重试');
    });
},


    login() {
      if (!this.username) {
        this.$message({
          message: '请输入用户名',
          type: 'warning'
        });
        return;
      }
      if (!this.password) {
        this.$message({
          message: '请输入密码',
          type: 'warning'
        });
        return;
      }

      var params = {
        username: this.username,
        password: this.password
      };

      const loadingInstance = this.$loading({
        lock: true,
        text: '正在登录...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      login(params).then(res => {
        loadingInstance.close();

        if (res.code == 1000) {
          this.$message({
            message: '登录成功',
            type: 'success'
          });

          var token = res.data.token;
          this.$store.commit('user/setToken', token);

          this.getUserInfo().then(() => {
            setLock(false);
            const redirect = this.$route.query.redirect || '/index';
            this.$router.push(redirect);
          });

        } else {
          this.$message.error(res.message);
        }
      }).catch(error => {
        loadingInstance.close();
        this.$message.error('登录失败，请稍后重试');
      });
    },

    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUser().then(res => {
          if (res.code == 1000) {
            this.$store.commit('user/setUser', JSON.stringify(res.data));
            resolve();
          } else {
            reject(res.message);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    initParticles() {
      const canvas = document.getElementById('particle-canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const particles = []
      const particleCount = 80
      const colors = ['#6A5ACD', '#483D8B', '#4B0082', '#663399']

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach(particle => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()

          particle.x += particle.speedX
          particle.y += particle.speedY

          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1
          }

          particles.forEach(other => {
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) +
              Math.pow(particle.y - other.y, 2)
            )
            if (distance < 120) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(106, 90, 205, ${1 - distance / 120})`
              ctx.lineWidth = 0.3
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          })
        })

        requestAnimationFrame(animate)
      }

      animate()
    }
  }
}

</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  font-family: 'Microsoft YaHei', sans-serif;
}

#particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 新增左侧内容区域样式 */
.left-content {
  width: 50%;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

.logo-area {
  margin-bottom: 80px;
}

.platform-name {
  font-size: 36px;
  font-weight: bold;
  color: #4B0082;
  letter-spacing: 2px;
  margin-bottom: 15px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.platform-role {
  font-size: 24px;
  color: #6A5ACD;
  font-weight: 600;
  letter-spacing: 1px;
}

.feature-list {
  margin: 60px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
  color: #4B0082;
  font-size: 22px;
  font-weight: 500;
}

.feature-item i {
  margin-right: 20px;
  font-size: 28px;
  color: #6A5ACD;
}

.quote-area {
  color: #555;
  font-style: italic;
  line-height: 1.8;
  margin-top: 60px;
}

.quote-text {
  font-size: 26px;
  line-height: 1.5;
  margin-bottom: 10px;
  color: #4B0082;
}

.quote-author {
  text-align: right;
  font-size: 18px;
  color: #9370DB;
  font-weight: 500;
}

/* 登录卡片样式调整 */
.login-card {
  position: relative;
  z-index: 2;
  width: 450px;
  min-height: 100vh;
  overflow: visible; /* 确保 footer 不被裁剪 */
  padding-bottom: 120px; /* 给 footer 留空间 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  padding: 100px 50px;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.slogan-en {
  color: #4B0082;
  font-size: 20px;
  line-height: 1.4;
  margin-bottom: 15px;
}

.slogan-cn {
  color: #6A5ACD;
  font-size: px;
  margin-bottom: 30px;
}

.divider {
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #6A5ACD, #483D8B);
  margin: 25px 0;
}

.sub-slogan {
  color: #666;
  line-height: 1.8;
  margin-bottom: 50px;
  font-size: 15px;
}

.login-form {
  margin-top: 40px;
}

.custom-input {
  margin-bottom: 25px;
}

.custom-input >>> .el-input__inner {
  height: 50px;
  border-radius: 25px;
  border: 1px solid #E6E6FA;
  padding-left: 45px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
}

.custom-input >>> .el-input__inner:focus {
  border-color: #6A5ACD;
  box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.2);
}

.custom-input >>> .el-input__prefix {
  color: #6A5ACD;
  left: 15px;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(to right, #6A5ACD, #483D8B);
  border: none;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: 10px;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(106, 90, 205, 0.4);
}

.footer {
  position: absolute;
  bottom: 40px;
  width: calc(100% - 100px);
  text-align: center;
  color: #6A5ACD;
  font-size: 14px;
}

.en-footer {
  margin-top: 10px;
  font-style: italic;
  color: #B0C4DE;
}

/* 登录方式切换样式 */
.login-type-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.login-type-option {
  padding: 8px 20px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 20px;
  color: #6A5ACD;
  font-size: 14px;
  transition: all 0.3s;
  border: 1px solid #6A5ACD;
  background-color: rgba(106, 90, 205, 0.1);
}

.login-type-option:hover {
  background-color: rgba(106, 90, 205, 0.2);
}

.login-type-option.active {
  background-color: #6A5ACD;
  color: white;
  font-weight: bold;
}
</style>