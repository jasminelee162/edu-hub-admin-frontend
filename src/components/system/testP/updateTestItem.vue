<template>
  <div>
    <el-dialog title="编辑考试题目" width="40%" :destroy-on-close="true" :visible.sync="updateVisible" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-row :gutter="10">
          <!-- 题目 -->
          <el-col :xs="24">
            <span class="search-title">题目:</span>
            <el-form-item prop="title" style="margin-bottom:0">
              <el-input v-model="form.title" size="mini" placeholder="请输入题目" autocomplete="off" />
            </el-form-item>
          </el-col>

          <!-- 序号 -->
          <el-col :xs="24">
            <span class="search-title">序号:</span>
            <el-form-item prop="sort" style="margin-bottom:0">
              <el-input type="number" v-model="form.sort" size="mini" placeholder="请输入序号" autocomplete="off" />
            </el-form-item>
          </el-col>

          <!-- 类型 -->
          <el-col :xs="24">
            <span class="search-title">类型:</span>
            <el-form-item prop="type" style="margin-bottom:0">
              <el-select clearable size="mini" v-model="form.type" placeholder="请选择">
                <el-option label="单选" value="0" />
                <el-option label="多选" value="1" />
                <el-option label="填空" value="2" />
                <el-option label="判断" value="3" />
                <el-option label="问答(需人工阅卷)" value="4" />
                <el-option label="计算(需人工阅卷)" value="5" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 分数 -->
          <el-col :xs="24">
            <span class="search-title">分数:</span>
            <el-form-item prop="score" style="margin-bottom:0">
              <el-input type="number" v-model="form.score" size="mini" placeholder="请输入分数" autocomplete="off" />
            </el-form-item>
          </el-col>

          <!-- 得分点 -->
          <el-col v-if="form.type == '4'" :xs="24">
            <span class="search-title">得分点:</span>
            <el-form-item prop="content" style="margin-bottom:0">
              <div class="content-item" v-for="(item,index) in keyword" :key="index" style="display:flex;margin-bottom:5px">
                <div style="width:100px;margin-right:10px">
                  <el-input v-model="item.value" size="mini" placeholder="分数" />
                </div>
                <el-input v-model="item.option" size="mini" placeholder="关键词" />
                <i class="el-icon-circle-plus-outline" v-if="index === keyword.length - 1" style="margin-left:10px;cursor:pointer" @click="addKeyword" />
                <i class="el-icon-remove-outline" v-if="index !== 0" style="margin-left:10px;cursor:pointer" @click="minusKeyword(index)" />
              </div>
            </el-form-item>
          </el-col>

          <!-- 答案 -->
          <el-col :xs="24">
            <span class="search-title">答案:</span>
            <el-form-item prop="answer" style="margin-bottom:0">
              <!-- 单选 -->
              <el-radio-group v-if="form.type == '0'" v-model="form.answer" size="mini">
                <el-radio v-for="(item, index) in content" :key="'radio-' + index" :label="item.value">{{ item.value }}</el-radio>
              </el-radio-group>

              <!-- 多选 -->
              <el-checkbox-group v-else-if="form.type == '1'" v-model="multipleAnswers" size="mini">
                <el-checkbox v-for="(item, index) in content" :key="'check-' + index" :label="item.value">{{ item.value }}</el-checkbox>
              </el-checkbox-group>

              <!-- 判断 -->
              <el-radio-group v-else-if="form.type == '3'" v-model="form.answer" size="mini">
                <el-radio label="正确">正确</el-radio>
                <el-radio label="错误">错误</el-radio>
              </el-radio-group>

              <!-- 其他 -->
              <el-input
                v-else
                type="textarea"
                v-model="form.answer"
                size="mini"
                placeholder="请输入答案"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>

          <!-- 题目内容 -->
          <el-col v-if="form.type == '0' || form.type == '1'" :xs="24">
            <span class="search-title">题目内容:</span>
            <el-form-item prop="content" style="margin-bottom:0">
              <div class="content-item" v-for="(item,index) in content" :key="index" style="display:flex;align-items:center;margin-bottom:5px">
                <div style="width:60px;margin-right:10px">
                  <el-input v-model="item.value" size="mini" placeholder="选项" readonly />
                </div>
                <el-input v-model="item.option" size="mini" placeholder="选项内容" style="flex:1" />
                <i class="el-icon-circle-plus-outline" v-if="index === content.length - 1" style="margin-left:10px;cursor:pointer" @click="addContent" />
                <i class="el-icon-remove-outline" v-if="index !== 0" style="margin-left:10px;cursor:pointer" @click="minusContent(index)" />
              </div>
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col style="margin-top:20px" :xs="24">
            <span class="search-title">备注:</span>
            <el-form-item prop="remark" style="margin-bottom:0">
              <el-input type="textarea" v-model="form.remark" size="mini" placeholder="请输入备注" />
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
import { editTestItem, getTestItemById } from '../../../api/api'

export default {
  props: ['updateVisible', 'updateId', 'testId'],
  data() {
    return {
      form: {
        testId: "",
        title: "",
        sort: "",
        type: "",
        score: "",
        keyword: "",
        answer: "",
        content: "",
        remark: "",
      },
      content: [
        { value: "A", option: "" }
      ],
      keyword: [
        { value: "", option: "" }
      ],
      multipleAnswers: [],
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      }
    }
  },
  methods: {
    addContent() {
      const nextChar = String.fromCharCode(65 + this.content.length); // A-Z
      this.content.push({ value: nextChar, option: '' });
    },
    minusContent(index) {
      this.content.splice(index, 1);
      this.content.forEach((item, i) => {
        item.value = String.fromCharCode(65 + i);
      });
    },
    addKeyword() {
      this.keyword.push({ value: "", option: "" });
    },
    minusKeyword(index) {
      this.keyword.splice(index, 1);
    },
    submit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) return;

        if (this.form.type === '0' || this.form.type === '1') {
          for (const item of this.content) {
            if (!item.option) {
              this.$message.warning('请完善选项内容');
              return;
            }
          }
          this.form.content = JSON.stringify(this.content);

          if (this.form.type === '0') {
            if (!this.form.answer) {
              this.$message.warning('请选择一个正确答案');
              return;
            }
          } else {
            if (!this.multipleAnswers.length) {
              this.$message.warning('请选择一个或多个正确答案');
              return;
            }
            this.form.answer = this.multipleAnswers.join(',');
          }
        } else if (this.form.type === '3') {
          if (!this.form.answer) {
            this.$message.warning('请选择判断题答案');
            return;
          }
          this.form.content = '';
        } else {
          this.form.content = '';
        }

        if (this.form.type === '4') {
          for (const item of this.keyword) {
            if (!item.value || !item.option) {
              this.$message.warning('请完善得分点');
              return;
            }
          }
          this.form.keyword = JSON.stringify(this.keyword);
        } else {
          this.form.keyword = '';
        }

        this.form.testId = this.testId;

        editTestItem(this.form).then(res => {
          if (res.code === 1000) {
            this.$notify.success({ title: '成功', message: "保存成功" });
            this.handleClose();
          } else {
            this.$notify.error({ title: '错误', message: res.message });
          }
        });
      });
    },
    handleClose() {
      this.form = {
        testId: this.testId,
        title: "",
        sort: "",
        type: "",
        score: "",
        keyword: "",
        answer: "",
        content: "",
        remark: "",
      };
      this.content = [{ value: "A", option: "" }];
      this.keyword = [{ value: "", option: "" }];
      this.multipleAnswers = [];
      this.$emit("updateFalse");
    }
  },
  watch: {
    updateId(newVal) {
      if (newVal) {
        getTestItemById({ id: newVal }).then(res => {
          if (res.code === 1000) {
            this.form = res.data;
            this.form.type = String(res.data.type);
            if (this.form.content) {
              this.content = JSON.parse(this.form.content);
            }
            if (this.form.keyword) {
              this.keyword = JSON.parse(this.form.keyword);
            }
            if (this.form.type === '1') {
              this.multipleAnswers = this.form.answer ? this.form.answer.split(',') : [];
            }
          } else {
            this.$notify.error({ title: '错误', message: res.message });
          }
        });
      }
    }
  }
}
</script>

<style   scoped>
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