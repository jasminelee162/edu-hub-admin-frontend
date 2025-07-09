<template>
  <div class="question-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 用户昵称:
            </span>
            <el-input
              size="small"
              placeholder="请输入用户昵称"
              v-model="search.userName"
              class="tech-input">
              <!--<i slot="prefix" class="el-icon-user-solid"></i>-->
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-chat-dot-round"></i> 提问内容:
            </span>
            <el-input
              size="small"
              placeholder="请输入提问内容"
              v-model="search.content"
              class="tech-input">
              <!--<i slot="prefix" class="el-icon-question"></i>-->
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-chat-line-round"></i> 回复:
            </span>
            <el-input
              size="small"
              placeholder="请输入回复"
              v-model="search.answer"
              class="tech-input">
              <!--<i slot="prefix" class="el-icon-chat-line-square"></i>-->
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-notebook-2"></i> 课程名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入课程名称"
              v-model="search.taskName"
              class="tech-input">
              <!--<i slot="prefix" class="el-icon-collection"></i>-->
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-actions">
            <el-button 
              size="small" 
              icon="el-icon-search" 
              type="primary" 
              @click="searchPage"
              class="search-btn">
              查询
            </el-button>
            <el-button 
              size="small" 
              icon="el-icon-refresh" 
              @click="refresh"
              class="reset-btn">
              重置
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="data-panel">
      <div class="action-bar">
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="update.length <= 0"
          @click="deleteDataBtn"
          class="action-btn delete-btn">
          删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="tech-table">
        <el-table-column 
          type="selection" 
          width="55"
          align="center">
        </el-table-column>
        <el-table-column 
          prop="userName" 
          label="用户昵称"
          min-width="150">
          <template #default="{row}">
            <div class="user-cell">
              <i class="el-icon-user-solid"></i>
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="content" 
          label="提问内容"
          min-width="200">
          <template #default="{row}">
            <div class="content-cell">
              <i class="el-icon-question"></i>
              <span>{{ row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="answer" 
          label="回复"
          min-width="200">
          <template #default="{row}">
            <div class="answer-cell">
              <i class="el-icon-chat-line-square"></i>
              <span>{{ row.answer || '--' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="taskName" 
          label="课程"
          min-width="150">
          <template #default="{row}">
            <div class="task-cell">
              <i class="el-icon-collection"></i>
              <span>{{ row.taskName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="200"
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                @click="updateData(row.id)"
                class="action-btn reply-btn">
                <i class="el-icon-edit"></i> 回复
              </el-button>
              <el-popconfirm
                title="确认删除这条问答记录？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#7B68EE">
                <el-button 
                  size="mini" 
                  slot="reference" 
                  class="action-btn delete-btn">
                  <i class="el-icon-delete"></i> 删除
                </el-button>
              </el-popconfirm>
            </div>
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
        :total="total"
        class="tech-pagination">
      </el-pagination>
    </div>

    <update @updateFalse="updateFalse" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
  import {getQuestionPage,removeQuestion} from '../../../api/api'
  import update from '../../../components/system/question/updateQuestion'
  export default {
    data() {
      return{
        user: {},
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        updateVisible: false,
        search: {
            userName: "",
            content: "",
            answer: "",
            teacherId: "",
            taskName: "",
            pageNumber: 1,
            pageSize:10
        },
        total: 0,
        tableData: []
      }
    },
    components: {
      update
    },
    methods: {
      tableHeaderStyle() {
        return {
          'color': '#6A5ACD',
          'background-color': '#F5F3FF',
          'font-weight': '500',
          'border-bottom': '1px solid #D8D0FF'
        }
      },
      tableRowStyle() {
        return {
          'color': '#555',
          'font-size': '14px',
          'border-bottom': '1px solid #F0F0F7'
        }
      },
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      query() {
        this.search.teacherId = this.user.id
        getQuestionPage(this.search).then(res => {
          if(res.code == 1000) {
            this.tableData = res.data.records
            this.total = res.data.total
            this.loading = false
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      refresh() {
        this.search.userName = ""
        this.search.content = ""
        this.search.answer = ""
        this.search.taskName = ""
        this.query()
      },
      handleCurrentChange(val) {
        this.search.pageNumber = val
        this.query()
      },
      handleSizeChange(val) {
        this.search.pageSize = val
        this.query()
      },
      handleSelectionChange(val) {
        this.update = []
        this.remove = []
        for (let i = 0;i < val.length;i++) {
          var item = val[i]
          this.update.push(item.id)
          this.remove.push(item.id)
        }
      },
      updateFalse() {
        this.updateId = ''
        this.updateVisible = false
        this.query()
      },
      updateData(id) {
        this.updateId = id
        this.updateVisible = true
      },
      deleteDataBtn() {
        this.$confirm('确定删除选中的'+ this.remove.length +'条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'tech-message-box'
        }).then(() => {
          this.deleteDate(this.remove.join(","))
        }).catch(() => {});
      },
      deleteDate(ids) {
        removeQuestion({ids:ids}).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                customClass: 'tech-message'
              });
              this.query()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
            }
          })
      },
    },
    mounted() {
      this.user = JSON.parse(window.localStorage.getItem("user"))
      this.query()
    }
 }
</script>

<style scoped>
.question-management {
  padding: 20px;
  background-color: #F9F8FD;
}

.search-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.08);
}

.search-item {
  display: flex;
  flex-direction: column;
}

.search-title {
  font-size: 14px;
  color: #6A5ACD;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.search-title i {
  margin-right: 6px;
  color: #9370DB;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
  float: right;
  margin-top: 20px;
}

.data-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.08);
}

.action-bar {
  padding: 10px 0 15px 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0F0F7;
}

.user-cell, .content-cell, .answer-cell, .task-cell {
  display: flex;
  align-items: center;
}

.user-cell i {
  color: #6A5ACD;
  margin-right: 8px;
  font-size: 16px;
}

.content-cell i {
  color: #7B68EE;
  margin-right: 8px;
}

.answer-cell i {
  color: #9370DB;
  margin-right: 8px;
}

.task-cell i {
  color: #A5A4BF;
  margin-right: 8px;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn i {
  margin-right: 4px;
  font-size: 14px;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #E0E0ED;
  color: #555;
  background-color: #FCFBFF;
  padding-left: 30px;
}

.tech-input .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 7px 15px;
}

.reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #E0E0ED;
  padding: 7px 15px;
}

.action-btn.reply-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tech-table {
  border-radius: 8px;
  border: 1px solid #F0F0F7;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #F8F5FF !important;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #D8D0FF;
}

.tech-message-box .el-message-box__title {
  color: #6A5ACD;
  font-weight: bold;
}

.tech-message {
  border-radius: 20px;
  background-color: #F8F5FF;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.1);
}

.tech-message .el-message__content {
  color: #6A5ACD;
}

.el-popconfirm__action {
  text-align: center;
}

.el-popconfirm__action button {
  border-radius: 15px;
  padding: 6px 12px;
}

.el-popconfirm__action button:first-child {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  color: white;
}

.el-popconfirm__action button:last-child {
  color: #7B68EE;
  border: 1px solid #E0E0ED;
}
</style>