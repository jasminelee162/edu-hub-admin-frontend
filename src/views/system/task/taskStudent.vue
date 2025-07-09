<template>
  <div class="student-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 学生姓名:
            </span>
            <el-input
              size="small"
              placeholder="请输入学生姓名"
              v-model="search.userName"
              class="tech-input">
              <!--7.9-->
              <!--<i slot="prefix" class="el-icon-user-solid"></i>-->
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-finished"></i> 报名状态:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.state" 
              placeholder="请选择"
              class="tech-select">
              <el-option
                label="通过"
                value="0">
                <i class="el-icon-success" style="color:#67C23A; margin-right:5px"></i>
                <span>通过</span>
              </el-option>
              <el-option
                label="未通过"
                value="1">
                <i class="el-icon-warning" style="color:#E6A23C; margin-right:5px"></i>
                <span>未通过</span>
              </el-option>
            </el-select>
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
          批量删除
        </el-button>
        <span class="total-count">
          <i class="el-icon-collection" style="color:#7B68EE"></i> 
          共 {{total}} 条记录
        </span>
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
          label="学生姓名"
          width="120">
          <template #default="{row}">
            <div class="user-cell">
              <i class="el-icon-user" style="color:#9370DB; margin-right:8px"></i>
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="教师姓名"
          width="120">
          <template #default="{row}">
            <div class="teacher-cell">
              <i class="el-icon-s-custom" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ row.teacherName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="课程名称"
          min-width="180">
          <template #default="{row}">
            <div class="course-cell">
              <i class="el-icon-notebook-2" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.taskName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="报名状态"
          width="120"
          align="center">
          <template #default="{row}">
            <el-tag 
              v-if="row.state == 0" 
              type="success"
              effect="dark"
              class="status-tag">
              <i class="el-icon-success" style="margin-right:4px"></i> 通过
            </el-tag>
            <el-tag 
              v-if="row.state == 1" 
              type="warning"
              effect="dark"
              class="status-tag">
              <i class="el-icon-warning" style="margin-right:4px"></i> 未通过
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                v-if="row.state == 0" 
                size="mini" 
                type="warning" 
                @click="updateData(row.id,1)"
                class="action-btn reject-btn">
                <i class="el-icon-close" style="margin-right:4px"></i> 不通过
              </el-button>
              <el-button 
                v-if="row.state == 1" 
                size="mini" 
                type="success" 
                @click="updateData(row.id,0)"
                class="action-btn approve-btn">
                <i class="el-icon-check" style="margin-right:4px"></i> 通过
              </el-button>
              <el-popconfirm
                title="确认删除此报名记录？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#7B68EE">
                <el-button 
                  slot="reference"
                  size="mini"
                  type="danger"
                  class="action-btn delete-btn">
                  <i class="el-icon-delete" style="margin-right:4px"></i> 删除
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
  </div>
</template>

<script>
import {getApeTaskStudentPage,removeTaskStudent,editTaskStudent} from '../../../api/api'
export default {
  data() {
    return{
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      search: {
          taskId: "",
          userName: "",
          state: "",
          pageNumber: 1,
          pageSize:10
      },
      total: 0,
      tableData: []
    }
  },
  methods: {
    tableHeaderStyle() {
      return {
        'color': '#4A2B90',
        'background-color': '#ECE9F4',
        'font-weight': 'bold',
        'border-bottom': '1px solid #7B68EE'
      }
    },
    tableRowStyle() {
      return {
        'color': '#5F4B8B',
        'font-size': '14px',
        'border-bottom': '1px solid #F0EEF7'
      }
    },
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      getApeTaskStudentPage(this.search).then(res => {
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
    updateData(id,state) {
        var param = {
            id: id,
            state: state
        }
        editTaskStudent(param).then(res => {
            if (res.code == 1000) {
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                  customClass: 'tech-message'
                });
                this.query()
            }
        })
    },
    refresh() {
      this.search.userName = ""
      this.search.state = ""
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
    deleteDataBtn() {
      this.$confirm('确定删除选中的'+ this.remove.length +'条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'tech-message-box'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeTaskStudent({ids:ids}).then(res => {
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
    this.search.taskId = this.$route.query.id
    this.query()
  }
}
</script>

<style scoped>
.student-management {
  padding: 20px;
  background-color: #F8F7FC;
}

.search-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.search-item {
  display: flex;
  flex-direction: column;
}

.search-title {
  font-size: 14px;
  color: #4A2B90;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.search-title i {
  margin-right: 6px;
  color: #7B68EE;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.data-panel {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.action-bar {
  padding: 10px 0 15px 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0EEF7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-count {
  font-size: 14px;
  color: #5F4B8B;
  display: flex;
  align-items: center;
}

.user-cell, .teacher-cell, .course-cell {
  display: flex;
  align-items: center;
}

.status-tag {
  border-radius: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  min-width: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn i {
  margin-right: 4px;
  font-size: 14px;
}

.action-btn.approve-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
  border: none;
}

.action-btn.reject-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB75B);
  color: white;
  border: none;
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #F56C6C, #F78989);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  padding-left: 30px;
}

.tech-input .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.tech-select .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
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
  border: 1px solid #D8D8E5;
  padding: 7px 15px;
}

.tech-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #7B68EE;
}

.tech-message-box .el-message-box__title {
  color: #4A2B90;
  font-weight: bold;
}

.tech-message {
  border-radius: 20px;
  background-color: #F5F2FF;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(123, 104, 238, 0.2);
}

.tech-message .el-message__content {
  color: #4A2B90;
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
  border: 1px solid #D8D8E5;
}
</style>