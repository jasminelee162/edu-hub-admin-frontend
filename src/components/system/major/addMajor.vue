<template>
  <div>
    <el-dialog 
      title="新增专业" 
      width="45%" 
      :destroy-on-close="true" 
      :visible.sync="addVisible" 
      :before-close="handleClose"
      class="tech-dialog">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="form-item-container">
              <span class="tech-form-label">
                专业名称:
              </span>
              <el-form-item prop="name" class="tech-form-item">
                <el-input 
                  v-model="form.name" 
                  size="small" 
                  placeholder="请输入专业名称" 
                  autocomplete="off"
                  class="tech-input">
                  <i slot="prefix" class="el-icon-collection el-input__icon"></i>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="tech-dialog-footer">
        <el-button 
          size="small" 
          @click="handleClose"
          class="tech-cancel-btn">
          取 消
        </el-button>
        <el-button 
          size="small" 
          type="primary" 
          @click="submit"
          class="tech-confirm-btn">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {saveMajor} from '../../../api/api'
export default {
  data() {
    return{
      form: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
        ],
      },
    }
  },
  props: ['addVisible'],
  methods: {
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          saveMajor(this.form).then(res => {
            if(res.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: "保存成功",
                customClass: 'tech-notification'
              });
              this.handleClose();
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message,
                customClass: 'tech-notification'
              });
            }
          })
        }
      });
    },
    handleClose() {
      this.form = { name: "" };
      this.$emit("addFalse")
    },
  }
}
</script>

<style scoped>
.form-item-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.tech-form-label {
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #4A2B90;
  margin-bottom: 8px;
  font-weight: 500;
}

.tech-form-item {
  margin-bottom: 0;
}

.tech-dialog-footer {
  text-align: right;
  padding: 15px 20px 10px;
  border-top: 1px solid #F0EEF7;
}
</style>

<style>
/* 全局对话框样式 */
.tech-dialog {
  border-radius: 12px;
}

.tech-dialog .el-dialog__header {
  border-bottom: 1px solid #F0EEF7;
  padding: 15px 20px;
}

.tech-dialog .el-dialog__title {
  color: #4A2B90;
  font-weight: bold;
  font-size: 16px;
}

.tech-dialog .el-dialog__body {
  padding: 20px;
}

/* 输入框样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  transition: all 0.3s;
  padding-left: 35px;
}

.tech-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.2);
}

.tech-input .el-input__icon {
  color: #7B68EE;
}

/* 按钮样式 */
.tech-confirm-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 8px 20px;
  transition: all 0.3s;
}

.tech-confirm-btn:hover {
  background: linear-gradient(135deg, #6A5ACD, #7B68EE);
  box-shadow: 0 4px 8px rgba(123, 104, 238, 0.3);
  transform: translateY(-1px);
}

.tech-cancel-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  background: #F5F5FA;
  padding: 8px 20px;
  transition: all 0.3s;
}

.tech-cancel-btn:hover {
  color: #6A5ACD;
  border-color: #C7C7D5;
  background: #EDEDF7;
  transform: translateY(-1px);
}

/* 通知样式 */
.tech-notification {
  border-radius: 8px;
  border-left: 4px solid #7B68EE;
}
</style>