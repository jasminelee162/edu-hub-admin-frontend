<template>
  <div class="_student">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="10" style="padding:10px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <span class="search-title">学生姓名:</span>
            <el-input
              style="margin-top:10px"
              size="mini"
              placeholder="请输入学生姓名"
              v-model="search.userName">
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage">查询</el-button>
            <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-row style="padding-top:10px;margin-left:10px">
          <el-button 
            size="mini" 
            type="success" 
            @click="batchAIGrading"
            :disabled="!selectedStudents.length"
            :loading="batchLoading">
            批量AI阅卷 ({{ selectedStudents.length }})
          </el-button>
        </el-row>
        <el-table
          ref="studentTable"
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            'color': '#4A2B90',
            'background-color': '#ECE9F4',
          }"
          :row-style="{
            'color': '#888897',
            'font-size': '15px',
            'font-family':'黑体',
            'white-space': 'nowrap'
          }"
          stripe
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="createBy"
            label="学生姓名">
          </el-table-column>
          <el-table-column
            prop="testName"
            label="考试名称">
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="总分">
          </el-table-column>
          <el-table-column
            prop="totalGetScore"
            label="得分">
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="yuejuan(scope.row.userId)">人工阅卷</el-button>
              <el-button 
                size="mini" 
                type="success" 
                @click="aiGrading(scope.row)"
                :loading="scope.row.aiLoading">
                AI阅卷
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="search.pageSize"
          :current-page="search.pageNumber"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 人工阅卷对话框 -->
    <el-dialog
      title="阅卷"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div class="testInfo-item" v-for="(item,index) in assign" :key="index">
        <div style="margin-top:10px;margin-left:10px">{{index + 1}}.{{item.title}} 
          <span style="color:red">正确答案：{{item.answer}}</span>
          <span style="color:green;margin-left:10px;width:50px">得分：
            <el-input
              style="width:100px"
              type="number"
              v-model="item.point"
              size="mini"
              :min="0"
              :max="item.score"
              @change="validateScore(item)">
            </el-input>
          </span>
        </div>
        <div style="margin-top:10px;margin-left:10px;margin-bottom:10px">
          <el-radio-group disabled v-model="item.solution" v-if="item.type == 0">
            <el-radio v-for="(e,s) in item.content" :key="s" :label="e.value">{{e.value}}.{{e.option}}</el-radio>
          </el-radio-group>
          <el-checkbox-group disabled v-model="item.solution" v-if="item.type == 1">
            <el-checkbox v-for="(e,s) in item.content" :key="s" :label="e.value">{{e.value}}.{{e.option}}</el-checkbox>
          </el-checkbox-group>
          <el-input disabled v-model="item.solution" v-if="item.type == 2" size="mini" placeholder="请输入答案"></el-input>
          <el-radio-group disabled v-model="item.solution" v-if="item.type == 3">
            <el-radio label="正确">正确</el-radio>
            <el-radio label="错误">错误</el-radio>
          </el-radio-group>
          <el-input type="textarea" disabled v-model="item.solution" v-if="item.type == 4" size="mini" placeholder="请输入答案"></el-input>
          <el-input type="textarea" disabled v-model="item.solution" v-if="item.type == 5" size="mini" placeholder="请输入答案"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量AI阅卷进度对话框 -->
    <el-dialog
      title="AI批量阅卷进度"
      :visible.sync="progress.visible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false">
      <div>
        <p>正在批改 {{progress.current}}/{{progress.total}} 份试卷</p>
        <el-progress :percentage="progress.percent"></el-progress>
        <div style="margin-top:10px;color:#999">
          <i class="el-icon-info"></i> 请勿关闭窗口，正在使用AI自动批改...
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTestStudent, getTestStudentItem, editTestStudent } from '../../../api/api'
import axios from 'axios'

export default {
  data() {
    return {
      loading: true,
      batchLoading: false,
      dialogVisible: false,
      search: {
        testId: "",
        userName: "",
        pageNumber: 1,
        pageSize: 10
      },
      assign: [],
      selectedStudents: [],
      total: 0,
      tableData: [],
      progress: {
        visible: false,
        percent: 0,
        total: 0,
        current: 0
      }
    }
  },
  methods: {
    validateScore(item) {
      if (item.point < 0) {
        item.point = 0;
        this.$message.warning('分数不能小于0');
      } else if (item.point > item.score) {
        item.point = item.score;
        this.$message.warning(`分数不能超过本题最高分:${item.score}分`);
      }
    },
    
    handleSelectionChange(val) {
      this.selectedStudents = val;
    },
    
    searchPage() {
      this.search.pageNumber = 1;
      this.query();
    },
    
    submit() {
      const param = { list: this.assign };
      editTestStudent(param).then(res => {
        if (res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "阅卷成功"
          });
          this.handleClose();
          this.query();
        }
      });
    },
    
    query() {
      this.loading = true;
      getTestStudent(this.search).then(res => {
        if (res.code == 1000) {
          this.tableData = res.data.records.map(item => ({
            ...item,
            aiLoading: false
          }));
          this.total = res.data.total;
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    
    yuejuan(userId) {
      getTestStudentItem({ testId: this.search.testId, userId: userId }).then(res => {
        if (res.code == 1000) {
          this.assign = res.data.map(item => {
            if (item.type == "0" || item.type == "1") {
              if (item.content) {
                item.content = JSON.parse(item.content);
              }
              if (item.type == 1 && item.solution) {
                item.solution = item.solution.split(",");
              }
            }
            return item;
          });
          this.dialogVisible = true;
        }
      });
    },

    // 单个学生AI阅卷
    async aiGrading(row) {
      try {
        this.$set(row, 'aiLoading', true);
        
        // 1. 获取学生答卷详情
        const res = await getTestStudentItem({
          testId: this.search.testId,
          userId: row.userId
        });
        //调试日志
        console.log('发送给AI的数据:', res.data);  // 检查原始数据
        
        if (res.code !== 1000) throw new Error(res.message || '获取答卷失败');

        // 2. 调用AI批改接口
        const aiRes = await axios.post('/ai/grades', res.data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // ✅ 打印 AI 返回的成绩列表
        console.log('AI返回的成绩:', aiRes.data);

        // 3. 处理响应数据
        const gradedData = res.data.map((item, index) => ({
          ...item,
          point: aiRes.data?.data?.[index] || 0
        }));

        // 4. 提交批改结果
        const finalRes = await editTestStudent({ list: gradedData });
        if (finalRes.code === 1000) {
          this.$notify.success({
            title: '成功',
            message: "AI阅卷完成"
          });
          this.query();
        }
      } catch (error) {
        let errorMsg = 'AI阅卷失败';
        if (error.response) {
          errorMsg += `: ${error.response.status} ${error.response.statusText}`;
          if (error.response.data?.message) {
            errorMsg += ` - ${error.response.data.message}`;
          }
        } else {
          errorMsg += `: ${error.message}`;
        }
        
        this.$notify.error({
          title: '错误',
          message: errorMsg
        });
        console.error('AI阅卷错误详情:', error);
      } finally {
        this.$set(row, 'aiLoading', false);
      }
    },

    // 批量AI阅卷
    async batchAIGrading() {
      if (this.selectedStudents.length === 0) {
        this.$message.warning('请至少选择一条记录');
        return;
      }
      
      try {
        this.batchLoading = true;
        this.progress = {
          visible: true,
          percent: 0,
          total: this.selectedStudents.length,
          current: 0
        };

        // 1. 获取所有选中学生的答卷
        const allPapers = [];
        for (const student of this.selectedStudents) {
          const res = await getTestStudentItem({
            testId: this.search.testId,
            userId: student.userId
          });
          if (res.code === 1000) {
            allPapers.push(...res.data);
          }
          this.progress.current++;
          this.progress.percent = Math.round(
            (this.progress.current / this.progress.total) * 50
          );
        }

        // 2. 分批发送到AI接口
        const batchSize = 5;
        const allGrades = [];
        
        for (let i = 0; i < allPapers.length; i += batchSize) {
          const batch = allPapers.slice(i, i + batchSize);
          try {
            const res = await axios.post('/ai/grades', batch, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (res.data?.data) {
              allGrades.push(...res.data.data);
            }
          } catch (error) {
            console.error('部分批改失败:', error);
            batch.forEach(() => allGrades.push(0));
          }
          
          this.progress.percent = Math.min(
            50 + Math.round((i / allPapers.length) * 50),
            100
          );
        }

        // 3. 提交所有批改结果
        let gradeIndex = 0;
        for (const student of this.selectedStudents) {
          const res = await getTestStudentItem({
            testId: this.search.testId,
            userId: student.userId
          });
          
          if (res.code === 1000) {
            const gradedData = res.data.map(item => ({
              ...item,
              point: allGrades[gradeIndex++] || 0
            }));
            
            await editTestStudent({ list: gradedData });
          }
          
          this.progress.current++;
          this.progress.percent = Math.round(
            (this.progress.current / this.progress.total) * 100
          );
        }

        this.$notify.success({
          title: '成功',
          message: `已完成${this.selectedStudents.length}份试卷的AI批改`
        });
        this.query();
      } catch (error) {
        let errorMsg = '批量AI阅卷失败';
        if (error.response) {
          errorMsg += `: ${error.response.status} ${error.response.statusText}`;
          if (error.response.data?.message) {
            errorMsg += ` - ${error.response.data.message}`;
          }
        } else {
          errorMsg += `: ${error.message}`;
        }
        
        this.$notify.error({
          title: '错误',
          message: errorMsg
        });
        console.error('批量阅卷错误详情:', error);
      } finally {
        this.batchLoading = false;
        this.progress.visible = false;
      }
    },
    
    handleClose() {
      this.dialogVisible = false;
      this.assign = [];
    },
    
    refresh() {
      this.search.userName = "";
      this.query();
    },
    
    handleCurrentChange(val) {
      this.search.pageNumber = val;
      this.query();
    },
    
    handleSizeChange(val) {
      this.search.pageSize = val;
      this.query();
    }
  },
  mounted() {
    this.search.testId = this.$route.query.id;
    this.query();
  }
}
</script>

<style scoped>
.search-table {
  width: 100%;
}
.search {
  background: #ffffff;
  border-radius: 7px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
}
.table {
  background: #ffffff;
  border-radius: 7px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  margin-top: 10px
}
.el-col {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search-title {
  font-family: '黑体';
  float: right;
  white-space: nowrap;
  font-size: 14px;
  margin-top:10px;
  width: 63px;
  text-align: right;
}
.el-table {
  padding: 10px;
}
.el-dialog__header {
  border-bottom: 1px solid #F4F8F9 !important;
}
.el-dialog {
  border-radius: 10px!important;
}
</style>