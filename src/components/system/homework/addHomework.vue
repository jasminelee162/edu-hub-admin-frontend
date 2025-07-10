<template>
  <div>
    <el-dialog title="新增作业" width="40%" :destroy-on-close="true" :visible.sync="addVisible" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="10">
          <!-- 题目 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">题目:</span>
            <el-form-item prop="title" style="margin-bottom:0">
              <el-input v-model="form.title" size="mini" placeholder="请输入题目" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

          <!-- 序号部分修改为 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">序号:</span>
            <el-form-item prop="sort" style="margin-bottom:0">
              <el-input-number
                  size="mini"
                  v-model="form.sort"
                  :min="1"
                  :controls="false"
                  label="序号"
              ></el-input-number>
            </el-form-item>
          </el-col>

          <!-- 类型 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span class="search-title">类型:</span>
            <el-form-item prop="type" style="margin-bottom:0">
              <el-select clearable style="margin-top:10px" size="mini" v-model="form.type" placeholder="请选择">
                <el-option label="单选" value="0"></el-option>
                <el-option label="多选" value="1"></el-option>
                <el-option label="填空" value="2"></el-option>
                <el-option label="判断" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 内容（单选/多选） -->
          <el-col v-if="form.type == 0 || form.type == 1" :xs="24">
            <span class="search-title">题目内容:</span>
            <el-form-item prop="content" style="margin-bottom:0">
              <div class="content-item" v-for="(item,index) in content" :key="index" style="display:flex;align-items:center;margin-bottom:5px">
                <div style="width:60px;margin-right:10px">
                  <el-input v-model="item.value" size="mini" placeholder="选项" readonly></el-input>
                </div>
                <el-input v-model="item.option" size="mini" placeholder="选项内容" style="flex:1" autocomplete="off"></el-input>
                <i class="el-icon-circle-plus-outline" v-if="index === content.length - 1" style="margin-left:10px;cursor:pointer" @click="addContent"></i>
                <i class="el-icon-remove-outline" v-if="index !== 0" style="margin-left:10px;cursor:pointer" @click="minusContent(index)"></i>
              </div>
            </el-form-item>
          </el-col>

          <!-- 答案选择区 -->
          <el-col :xs="24">
            <span class="search-title">答案:</span>
            <el-form-item prop="answer" style="margin-bottom:0">
              <!-- 单选 -->
              <el-radio-group v-if="form.type == 0" v-model="form.answer" size="mini">
                <el-radio v-for="(item, index) in content" :key="'radio-' + index" :label="item.value">
                  {{ item.value }}
                </el-radio>
              </el-radio-group>

              <!-- 多选 -->
              <el-checkbox-group v-else-if="form.type == 1" v-model="multipleAnswers" size="mini">
                <el-checkbox v-for="(item, index) in content" :key="'check-' + index" :label="item.value">
                  {{ item.value }}
                </el-checkbox>
              </el-checkbox-group>

              <!-- 判断题 -->
              <el-radio-group v-else-if="form.type == 3" v-model="form.answer" size="mini">
                <el-radio label="正确">正确</el-radio>
                <el-radio label="错误">错误</el-radio>
              </el-radio-group>

              <!-- 填空等其他 -->
              <el-input
                v-else
                type="textarea"
                v-model="form.answer"
                size="mini"
                placeholder="请输入答案"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <!-- 分数 -->
          <el-col :xs="24">
            <span class="search-title">分数:</span>
            <el-form-item prop="sort" style="margin-bottom:0">
              <el-input-number size="mini" v-model="form.score" :min="1" label="请输入分数"></el-input-number>
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col style="margin-top:20px" :xs="24">
            <span class="search-title">备注:</span>
            <el-form-item prop="remark" style="margin-bottom:0">
              <el-input type="textarea" v-model="form.remark" size="mini" placeholder="请输入备注" autocomplete="off"></el-input>
            </el-form-item>
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
import { saveHomework } from '../../../api/api'

export default {
  props: ['addVisible', 'chapterId'],
  data() {
    return {
      form: {
        chapterId: '',
        chapterName: '',
        title: '',
        sort: 1 ,
        answer: '',
        type: '0',
        content: '',
        score: '',
        remark: '',
      },
      content: [
        { value: 'A', option: '' }
      ],
      multipleAnswers: [],
      nextSort: 1, // 序号计数器
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur', type: 'number' }],
        score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        answer: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const type = this.form.type
              if (type === '1') {
                if (!this.multipleAnswers.length) {
                  return callback(new Error('请选择一个或多个正确答案'))
                }
              } else if (type === '0' || type === '3') {
                if (!value) {
                  return callback(new Error('请选择答案'))
                }
              } else {
                if (!value) {
                  return callback(new Error('请输入答案'))
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.form.chapterId = this.$route.query.id || this.chapterId
  },
  watch: {
    addVisible(newVal) {
      if (newVal) {
        // 确保赋值为数字类型
        this.form.sort = Number(this.nextSort)
      }
    }
  },
  methods: {
    addContent() {
      const nextChar = String.fromCharCode(65 + this.content.length)
      this.content.push({ value: nextChar, option: '' })
    },
    minusContent(index) {
      this.content.splice(index, 1)
      this.content.forEach((item, i) => {
        item.value = String.fromCharCode(65 + i)
      })
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return

        // 确保sort是数字类型
        this.form.sort = Number(this.form.sort)

        const type = this.form.type

        if (type === '0' || type === '1') {
          for (const item of this.content) {
            if (!item.value || !item.option) {
              this.$message.warning('请完善选项及内容')
              return
            }
          }
          this.form.content = JSON.stringify(this.content)

          if (type === '0') {
            if (!this.form.answer) {
              this.$message.warning('请选择一个正确答案')
              return
            }
          } else {
            if (!this.multipleAnswers.length) {
              this.$message.warning('请选择一个或多个正确答案')
              return
            }
            this.form.answer = this.multipleAnswers.join(',')
          }
        } else if (type === '3') {
          if (!this.form.answer) {
            this.$message.warning('请选择判断答案')
            return
          }
          this.form.content = ''
        } else {
          this.form.content = ''
        }

        // 保存请求
        saveHomework(this.form).then(res => {
          if (res.code === 1000) {
            this.$notify.success({ title: '成功', message: '保存成功' })
            this.nextSort++ // 递增序号
            this.handleClose()
          } else {
            this.$notify.error({ title: '错误', message: res.message })
          }
        })
      })
    },
    handleClose() {
      this.resetForm()
      this.$emit('addFalse')
    },
    resetForm() {
      this.form = {
        chapterId: this.form.chapterId,
        chapterName: '',
        title: '',
        sort: Number(this.nextSort), // 确保是数字类型
        answer: '',
        type: '0',
        content: '',
        score: '',
        remark: '',
      }
      this.content = [{ value: 'A', option: '' }]
      this.multipleAnswers = []
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