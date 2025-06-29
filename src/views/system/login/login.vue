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
      
      <div class="footer">
        <p>—— 让科技赋能每一份教育热忱 ——</p>
        <p class="en-footer">Where Innovation Meets Education</p>
      </div>
    </div>
  </div>
</template>

<script>
import {login,getUser} from '../../../api/api'
import { setLock } from '@/utils/lock'
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  mounted() {
    this.initParticles()
  },
      created() {

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

    initParticles() {
      const canvas = document.getElementById('particle-canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // 深紫色系粒子配置 - 更专业的色调
      const particles = []
      const particleCount = 80
      const colors = ['#6A5ACD', '#483D8B', '#4B0082', '#663399']
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1, // 稍小的粒子
          speedX: Math.random() * 0.3 - 0.15, // 更慢的速度
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
            if (distance < 120) { // 更短的连接线
              ctx.beginPath()
              ctx.strokeStyle = `rgba(106, 90, 205, ${1 - distance/120})`
              ctx.lineWidth = 0.3 // 更细的连接线
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
</style>