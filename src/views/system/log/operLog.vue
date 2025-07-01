<template>
  <div class="operlog-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 操作人员:
            </span>
            <el-input
              size="small"
              placeholder="请输入操作人员"
              v-model="search.operUserAccount"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-collection-tag"></i> 类型:
            </span>
            <el-select clearable size="small" v-model="search.type" placeholder="请选择" class="tech-select">
              <el-option label="其他" value="7"></el-option>
              <el-option label="新增" value="1"></el-option>
              <el-option label="修改" value="2"></el-option>
              <el-option label="删除" value="3"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-date"></i> 操作时间:
            </span>
            <el-date-picker 
              size="small"
              style="width:100%"
              v-model="time"
              type="daterange"
              range-separator="至"
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd" 
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="tech-date-picker">
            </el-date-picker>
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
        <el-popconfirm
          confirm-button-text='确认'
          cancel-button-text='取消'
          icon="el-icon-warning"
          icon-color="#7B68EE"
          title="确认要清空操作日志？"
          @confirm="clear">
          <el-button 
            size="small" 
            slot="reference" 
            icon="el-icon-delete" 
            type="warning"
            class="action-btn clear-btn">
            清空
          </el-button>
        </el-popconfirm>
        <el-button 
          style="margin-left:10px" 
          type="danger" 
          :disabled="remove.length <= 0" 
          size="small" 
          icon="el-icon-delete" 
          @click="deleteDateBtn"
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="系统模块" width="180">
          <template slot-scope="scope">
            <div class="module-cell">
              <i class="el-icon-folder-opened" style="color:#9370DB; margin-right:8px"></i>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="requestType" label="请求类型" width="120">
          <template slot-scope="scope">
            <div class="request-cell">
              <i class="el-icon-connection" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ scope.row.requestType }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 7" type="primary" effect="dark"><i class="el-icon-more" style="margin-right:4px"></i>其他</el-tag>
            <el-tag v-if="scope.row.type == 1" effect="dark"><i class="el-icon-circle-plus" style="margin-right:4px"></i>新增</el-tag>
            <el-tag v-if="scope.row.type == 2" type="warning" effect="dark"><i class="el-icon-edit" style="margin-right:4px"></i>修改</el-tag>
            <el-tag v-if="scope.row.type == 3" type="danger" effect="dark"><i class="el-icon-delete" style="margin-right:4px"></i>删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operUserAccount" label="操作人员" width="150">
          <template slot-scope="scope">
            <div class="user-cell">
              <i class="el-icon-user" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ scope.row.operUserAccount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operIp" label="操作IP" width="180">
          <template slot-scope="scope">
            <div class="ip-cell">
              <i class="el-icon-location-information" style="color:#409EFF; margin-right:8px"></i>
              <span>{{ scope.row.operIp }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 0" type="success" effect="dark"><i class="el-icon-success" style="margin-right:4px"></i>正常</el-tag>
            <el-tag v-if="scope.row.state == 1" type="danger" effect="dark"><i class="el-icon-error" style="margin-right:4px"></i>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operTime" label="操作时间">
          <template slot-scope="scope">
            <div class="time-cell">
              <i class="el-icon-time" style="color:#888897; margin-right:8px"></i>
              <span>{{ scope.row.operTime }}</span>
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
        class="tech-pagination" />
    </div>
  </div>
</template>

<script>
import { getOperLogPage, removeOperLog, clearOperLog } from '@/api/api'

export default {
  data() {
    return {
      loading: true,
      remove: [],
      time: [],
      search: {
        operUserAccount: '',
        type: '',
        startTime: '',
        endTime: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    }
  },
  methods: {
    searchPage() {
      this.search.pageNumber = 1
      this.query()
    },
    query() {
      this.loading = true
      const params = {
        operUserAccount: this.search.operUserAccount,
        type: this.search.type,
        pageNumber: this.search.pageNumber,
        pageSize: this.search.pageSize
      }
      if (this.time.length === 2) {
        params.startTime = this.time[0] + ' 00:00:00'
        params.endTime = this.time[1] + ' 23:59:59'
      }

      getOperLogPage(params).then(res => {
        if (res.code === 1000) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          })
        }
        this.loading = false
      })
    },
    refresh() {
      this.search.operUserAccount = ''
      this.search.type = ''
      this.time = []
      this.search.startTime = ''
      this.search.endTime = ''
      this.query()
    },
    clear() {
      clearOperLog().then(res => {
        if (res.code === 1000) {
          this.$message({ type: 'success', message: '删除成功!' })
          this.query()
        } else {
          this.$notify.error({ title: '错误', message: res.message })
        }
      })
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
      this.remove = val.map(item => item.id)
    },
    deleteDateBtn() {
      this.$confirm(`确定删除选中的 ${this.remove.length} 条数据？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDate(this.remove.join(','))
      }).catch(() => {})
    },
    deleteDate(ids) {
      removeOperLog({ ids }).then(res => {
        if (res.code === 1000) {
          this.$message({ type: 'success', message: '删除成功!' })
          this.search.pageNumber = 1
          this.query()
        } else {
          this.$notify.error({ title: '错误', message: res.message })
        }
      })
    },
    tableHeaderStyle() {
      return {
        color: '#4A2B90',
        backgroundColor: '#ECE9F4',
        fontWeight: 'bold',
        borderBottom: '1px solid #7B68EE'
      }
    },
    tableRowStyle() {
      return {
        color: '#5F4B8B',
        fontSize: '14px',
        borderBottom: '1px solid #F0EEF7'
      }
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style scoped>
.operlog-management {
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
}

.module-cell, .request-cell, .user-cell, .ip-cell, .time-cell {
  display: flex;
  align-items: center;
}

.el-tag {
  border-radius: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
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

.action-btn.clear-btn {
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
}

.tech-select .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
}

.tech-date-picker .el-range-input {
  background-color: #F9F8FD;
}

.tech-date-picker .el-range-separator {
  color: #5F4B8B;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
}

.reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
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