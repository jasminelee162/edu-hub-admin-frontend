<template>
<div>
  <el-dialog title="新增作业" width="40%" :destroy-on-close="true" :visible.sync="updateVisible" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">题目:</span>
          <div style="width:100%">
            <el-form-item prop="title" style="margin-bottom:0">
              <el-input v-model="form.title" size="mini" placeholder="请输入题目" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">序号:</span>
          <div style="width:100%">
            <el-form-item prop="sort" style="margin-bottom:0">
              <el-input-number size="mini" v-model="form.sort" :min="1" label="请输入序号"></el-input-number>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">类型:</span>
          <div style="width:100%">
            <el-form-item prop="type" style="margin-bottom:0">
              <el-select clearable style="margin-top:10px" size="mini" v-model="form.type" placeholder="请选择">
                <el-option label="单选" value="0"></el-option>
                <el-option label="多选" value="1"></el-option>
                <el-option label="填空" value="2"></el-option>
                <el-option label="判断" value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <el-col v-if="form.type == 0 || form.type == 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">题目内容:</span>
          <div style="width:100%">
            <el-form-item prop="content" style="margin-bottom:0">
              <div class="content-item" v-for="(item,index) in content" :key="index">
                <div style="width:100px;margin-right:10px">
                  <el-input v-model="item.value" size="mini" placeholder="选项" autocomplete="off"></el-input>
                </div>
                <el-input v-model="item.option" size="mini" placeholder="选项内容" autocomplete="off"></el-input>
                <div v-if="index == (content.length - 1)" @click="addContent" style="margin-left:10px"><i class="el-icon-circle-plus-outline"></i></div>
                <div @click="minusContent(index)" style="margin-left:10px" v-if="index != 0"><i class="el-icon-remove-outline"></i></div>
              </div>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">答案:</span>
          <div style="width:100%">
            <el-form-item prop="answer" style="margin-bottom:0">
              <el-radio-group v-if="form.type == 0" v-model="form.answer" size="mini">
                <el-radio-button v-for="(item, index) in content" :key="index" :label="item.value">{{ item.value }}</el-radio-button>
              </el-radio-group>
              <el-checkbox-group v-else-if="form.type == 1" v-model="multiAnswer" size="mini">
                <el-checkbox-button v-for="(item, index) in content" :key="index" :label="item.value">{{ item.value }}</el-checkbox-button>
              </el-checkbox-group>
              <el-radio-group v-else-if="form.type == 3" v-model="form.answer" size="mini">
                <el-radio-button label="true">正确</el-radio-button>
                <el-radio-button label="false">错误</el-radio-button>
              </el-radio-group>
              <el-input v-else type="textarea" v-model="form.answer" size="mini" placeholder="请输入答案" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">分数:</span>
          <div style="width:100%">
            <el-form-item prop="score" style="margin-bottom:0">
              <el-input-number size="mini" v-model="form.score" :min="1" label="请输入分数"></el-input-number>
            </el-form-item>
          </div>
        </el-col>

        <el-col style="margin-top:20px" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <span class="search-title">备注:</span>
          <div style="width:100%">
            <el-form-item prop="remark" style="margin-bottom:0">
              <el-input type="textarea" v-model="form.remark" size="mini" placeholder="请输入备注" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { editHomework, getHomeworkById } from '../../../api/api'
export default {
  data() {
    return {
      formLabelWidth: '80px',
      form: {
        chapterId: '',
        chapterName: '',
        title: '',
        sort: '',
        answer: '',
        type: '0',
        content: '',
        score: '',
        remark: '',
      },
      content: [
        {
          value: '',
          option: ''
        }
      ],
      multiAnswer: [],
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
    }
  },
  props: ['updateVisible', 'updateId', 'chapterId'],
  methods: {
    addContent() {
      const charCode = 65 + this.content.length
      this.content.push({ value: String.fromCharCode(charCode), option: '' })
    },
    minusContent(index) {
      this.content.splice(index, 1)
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return

        if (this.form.type == 0 || this.form.type == 1) {
          for (let item of this.content) {
            if (!item.value || !item.option) {
              this.$message.warning('请完善选项及内容')
              return
            }
          }
          this.form.content = JSON.stringify(this.content)
        } else {
          this.form.content = ''
        }

        if (this.form.type == 1) {
          this.form.answer = this.multiAnswer.join(',')
        }

        editHomework(this.form).then(res => {
          if (res.code === 1000) {
            this.$notify.success({ title: '成功', message: '保存成功' })
            this.handleClose()
          } else {
            this.$notify.error({ title: '错误', message: res.message })
          }
        })
      })
    },
    handleClose() {
      this.content = [{ value: '', option: '' }]
      this.multiAnswer = []
      this.$emit('updateFalse')
    },
  },
  watch: {
    updateId(newVal) {
      if (newVal) {
        getHomeworkById({ id: newVal }).then(res => {
          if (res.code === 1000) {
            this.form = res.data
            this.form.type = String(res.data.type)
            this.content = this.form.content ? JSON.parse(this.form.content) : [{ value: '', option: '' }]
            if (this.form.type == 1) {
              this.multiAnswer = this.form.answer ? this.form.answer.split(',') : []
            }
          } else {
            this.$notify.error({ title: '错误', message: res.message })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .content-item {
      display: flex;
      align-items: center;
  }
  .el-col {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 12px
  }
  .search-title {
      font-family: '黑体';
      float: right;
      white-space: nowrap;
      font-size: 14px;
      width: 84px;
      text-align: right;
  }
  .el-tree {
      border: 1px solid #BDC1C9;
  }
</style>