<template>
  <div class="template-management">
    <!-- 搜索区域 -->
    <div class="search-panel">
      <el-row :gutter="15">
        <!-- 学校名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-school"></i> 学校名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入学校名称"
              v-model="search.name"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        
        <!-- 操作按钮 -->
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
          新增学校
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length != 1"
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
          批量删除
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
        <!-- 选择列 -->
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        
        <!-- 学校名称列 -->
        <el-table-column
          prop="name"
          label="学校名称"
          min-width="200">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-school"></i>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="180"
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                @click="updateData(row.id)"
                class="table-action-btn edit-btn">
                修改
              </el-button>
              <el-popconfirm
                title="确认删除此学校？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#6c5ce7">
                <el-button 
                  size="mini"
                  slot="reference"
                  class="table-action-btn delete-btn">
                  删除
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
    
    <add @addFalse="addFalse" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getSchoolPage,removeSchool} from '../../../api/api'
import add from '../../../components/system/school/addSchool'
import update from '../../../components/system/school/updateSchool'
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
          pageNumber: 1,
          pageSize:10
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
    // 表格头部样式
    tableHeaderStyle() {
      return {
        'color': '#1E2B45',
        'background-color': '#ECE9F4',
        'font-weight': 'bold',
        'font-size': '14px'
      }
    },
    
    // 表格行样式
    tableRowStyle() {
      return {
        'color': '#6A5ACD',
        'font-size': '14px',
        'font-family':'Microsoft YaHei',
        'white-space': 'nowrap'
      }
    },
    
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      getSchoolPage(this.search).then(res => {
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
      this.updateId = ""
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
      removeSchool({ids:ids}).then(res => {
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
.template-management {
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

.search-title i {
  margin-right: 8px;
  color: #6c5ce7;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
  justify-content: flex-end;
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

.name-cell {
  display: flex;
  align-items: center;
}

.name-cell i {
  color: #6c5ce7;
  margin-right: 10px;
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 8px;
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
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
}

.edit-btn {
  background: linear-gradient(135deg, #00b894, #00a884);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.2);
}

.delete-btn {
  background: linear-gradient(135deg, #ff7675, #e66767);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 118, 117, 0.2);
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
}

.table-action-btn.edit-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
}

.table-action-btn.edit-btn:hover {
  background: linear-gradient(135deg, #5a4bd6, #4d3db9);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
}

.table-action-btn.delete-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
}

.table-action-btn.delete-btn:hover {
  background: linear-gradient(135deg, #ff5252, #ff3d3d);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
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
</style>