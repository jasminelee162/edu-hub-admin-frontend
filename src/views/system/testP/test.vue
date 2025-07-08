<template>
  <div class="test-management">
    <!-- 搜索区域 -->
    <div class="search-panel">
      <el-row :gutter="15">
        <!-- 考试名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">考试名称:</span>
            <el-input
              size="small"
              placeholder="请输入考试名称"
              v-model="search.name"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        
        <!-- 课程名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">课程名称:</span>
            <el-input
              size="small"
              placeholder="请输入课程名称"
              v-model="search.taskName"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        
        <!-- 状态选择 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">状态:</span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.state" 
              placeholder="请选择"
              class="tech-select">
              <el-option label="审核通过" value="0"></el-option>
              <el-option label="未通过" value="1"></el-option>
              <el-option label="待审核" value="2"></el-option>
            </el-select>
          </div>
        </el-col>
        
        <!-- 创建者搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">创建者:</span>
            <el-input
              size="small"
              placeholder="请输入创建者"
              v-model="search.createBy"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
      </el-row>
      
      <!-- 操作按钮 - 单独一行靠右 -->
      <el-row>
        <el-col :span="24" class="search-actions-col">
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

    <!-- 数据面板 -->
    <div class="data-panel">
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-plus" 
          @click="add"
          class="action-btn add-btn">
          新增考试
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length !== 1"
          @click="updateDataBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
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

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="tech-table">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="考试名称" width="180">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-document-checked" style="color:#6c5ce7; margin-right:8px"></i>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="课程名称" width="180">
          <template #default="{row}">
            <div class="course-cell">
              <i class="el-icon-notebook-2" style="color:#6c5ce7; margin-right:8px"></i>
              <span>{{ row.taskName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalScore" label="总分" width="100" align="center">
          <template #default="{row}">
            <el-tag type="info" effect="dark">{{ row.totalScore }}分</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalTime" label="考试时长" width="100" align="center">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-timer" style="color:#a5a4bf; margin-right:8px"></i>
              <span>{{ row.totalTime }}分钟</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="100" align="center">
          <template #default="{row}">
            <el-tag 
              :type="row.state == 0 ? 'success' : row.state == 1 ? 'warning' : 'info'"
              class="status-tag"
              effect="dark">
              {{ getStatusText(row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" width="100">
          <template #default="{row}">
            <div class="user-cell">
              <i class="el-icon-user" style="color:#a5a4bf; margin-right:8px"></i>
              <span>{{ row.createBy }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450" fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                v-if="row.state == 0" 
                @click="offShelf(row.id)"
                class="table-action-btn reject-btn">
                <i class="el-icon-close"></i> 审核拒绝
              </el-button>
              <el-button 
                size="mini" 
                v-if="row.state == 2 || row.state == 1" 
                @click="listing(row.id)"
                class="table-action-btn approve-btn">
                <i class="el-icon-check"></i> 审核通过
              </el-button>
              <el-button 
                size="mini" 
                @click="toTestStudent(row.id)"
                class="table-action-btn mark-btn">
                <i class="el-icon-edit-pen"></i> 阅卷
              </el-button>
              <el-button 
                size="mini" 
                @click="toTestItem(row.id)"
                class="table-action-btn question-btn">
                <i class="el-icon-collection-tag"></i> 题目
              </el-button>
              <el-button 
                size="mini" 
                @click="updateData(row.id)"
                class="table-action-btn edit-btn">
                <i class="el-icon-edit"></i> 修改
              </el-button>
              <el-popconfirm
                title="确认删除这条考试？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#6c5ce7">
                <el-button 
                  size="mini" 
                  slot="reference" 
                  class="table-action-btn delete-btn">
                  <i class="el-icon-delete"></i> 删除
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <add @addFalse="addFalse" flag="1" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" flag="1" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getTestPage,removeTest,editTest} from '../../../api/api'
import add from '../../../components/system/testP/addTest'
import update from '../../../components/system/testP/updateTest'
export default {
  data() {
    return{
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addVisible: false,
      updateVisible: false,
      search: {
          name: "",
          taskName: "",
          state: "",
          createBy: "",
          pageNumber: 1,
          pageSize:10,
          type: 0
      },
      total: 0,
      tableData: []
    }
  },
  components: {
    add,
    update
  },
  methods: {
    getStatusText(state) {
      const statusMap = {
        0: '通过',
        1: '未通过',
        2: '待审核'
      }
      return statusMap[state] || '未知'
    },
    tableHeaderStyle() {
      return {
        'color': '#1E2B45',
        'background-color': '#ECE9F4',
        'font-weight': 'bold',
        'font-size': '14px'
      }
    },
    tableRowStyle() {
      return {
        'color': '#6A5ACD',
        'font-size': '14px',
        'font-family':'Microsoft YaHei',
        'white-space': 'nowrap'
      }
    },
    toTestItem(id) {
      var param = {
          "name": "考试题目",
          "url": "/testItem?id=" + id
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/testItem?id=" + id)
      this.$store.commit('menu/setActiveMenu', "/testItem?id=" + id)
    },
    toTestStudent(id) {
      var param = {
          "name": "阅卷",
          "url": "/testStudent?id=" + id
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/testStudent?id=" + id)
      this.$store.commit('menu/setActiveMenu', "/testStudent?id=" + id)
    },
    listing(id) {
      var param = {
        id: id,
        state: 0
      }
      editTest(param).then(res => {
        if(res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "审核成功"
          });
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      })
    },
    offShelf(id) {
      var param = {
        id: id,
        state: 1
      }
      editTest(param).then(res => {
        if(res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "审核成功"
          });
          this.query();
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      })
    },
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      getTestPage(this.search).then(res => {
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
      this.search.name = ""
      this.search.taskName = ""
      this.search.state = ""
      this.search.createBy = ""
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
    add() {
      this.addVisible = true
    },
    addFalse() {
      this.addVisible = false
      this.query()
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
    updateDataBtn() {
      this.updateData(this.update[0])
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
      removeTest({ids:ids}).then(res => {
          if(res.code == 1000) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              customClass: 'tech-message'
            });
            this.pageNumber = 1
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
    this.query()
  }
}
</script>

<style scoped>
.test-management {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 48px);
}

.search-panel {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.search-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.search-title {
  font-size: 13px;
  color: #5a6487;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-actions-col {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.search-actions {
  display: flex;
  gap: 12px;
}
.data-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.action-bar {
  padding: 0 0 20px 0;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f0f2f7;
}

.name-cell, .course-cell, .user-cell, .time-cell {
  display: flex;
  align-items: center;
}

.status-tag {
  font-weight: 500;
  border: none;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.table-action-btn {
  border-radius: 16px;
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  height: 28px;
  line-height: 18px;
  display: inline-flex;
  align-items: center;
}

.table-action-btn i {
  margin-right: 4px;
  font-size: 14px;
}

.table-action-btn.approve-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.table-action-btn.reject-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
}

.table-action-btn.mark-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
}

.table-action-btn.question-btn {
  background: linear-gradient(135deg, #9C27B0, #8E24AA);
}

.table-action-btn.edit-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
}

.table-action-btn.delete-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
}

.table-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  opacity: 0.9;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
  transition: all 0.25s ease;
  font-size: 13px;
}

.tech-input .el-input__inner:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.15);
}

.tech-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
}

.search-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 9px 18px;
  height: 36px;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transition: all 0.25s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.reset-btn {
  border-radius: 8px;
  color: #6c5ce7;
  border: 1px solid #e0e3ed;
  padding: 9px 18px;
  height: 36px;
  background: #ffffff;
  transition: all 0.25s ease;
}

.reset-btn:hover {
  background-color: #f8f9ff;
  border-color: #d5d9e8;
}

.action-btn {
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  min-width: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.action-btn i {
  margin-right: 5px;
  font-size: 14px;
}

.add-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  color: white;
}

.edit-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
}

.delete-btn {
  background: linear-gradient(135deg, #ff7675, #e66767);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

.tech-table {
  border-radius: 12px;
  border: 1px solid #e6e8f0;
  overflow: hidden;
}

.tech-table .el-table__header th {
  font-weight: 600;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #f8f9ff !important;
}

.tech-table .el-table__body td {
  transition: background-color 0.2s ease;
}

.tech-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #6c5ce7;
  color: white;
  font-weight: 600;
}

.tech-pagination .el-pagination.is-background .el-pager li:hover {
  color: #6c5ce7;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #6c5ce7;
}

.tech-message-box .el-message-box__title {
  color: #3d4766;
  font-weight: 600;
}

.tech-message-box .el-message-box__content {
  color: #5a6487;
}

.tech-message {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.15);
  border: none;
}

.tech-message .el-message__content {
  color: #3d4766;
  font-weight: 500;
}

.el-popconfirm__action {
  text-align: center;
}

.el-popconfirm__action button {
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.el-popconfirm__action button:first-child {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  color: white;
}

.el-popconfirm__action button:last-child {
  color: #6c5ce7;
  border: 1px solid #e0ddf5;
  background: #f5f4ff;
}

/* 移除输入框图标 */
.tech-input .el-input__prefix {
  display: none;
}
.tech-input .el-input__inner {
  padding-left: 15px;
}

/* 禁用状态按钮样式 */
.el-button.is-disabled {
  opacity: 0.6;
}

/* 标签样式 */
.el-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border: none;
  font-weight: 500;
}

.el-tag--success {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.el-tag--warning {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
}

.el-tag--info {
  background: linear-gradient(135deg, #909399, #A6A9AD);
}

.el-tag--danger {
  background: linear-gradient(135deg, #F56C6C, #F78989);
}
</style>