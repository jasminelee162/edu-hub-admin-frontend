<template>
  <div class="notice-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-edit-outline"></i> 公告标题:
            </span>
            <el-input
              size="small"
              placeholder="请输入公告标题"
              v-model="search.title"
              class="notice-input">
              <i slot="prefix" class="el-icon-document"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 操作人员:
            </span>
            <el-input
              size="small"
              placeholder="请输入操作人员"
              v-model="search.updateBy"
              class="notice-input">
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-collection-tag"></i> 类型:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.type" 
              placeholder="请选择"
              class="notice-select">
              <el-option label="通知" value="0"></el-option>
              <el-option label="公告" value="1"></el-option>
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
          type="primary" 
          size="small" 
          icon="el-icon-plus" 
          @click="addNotice"
          class="action-btn add-btn">
          新增公告
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length !== 1"
          @click="updateAccountBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-popconfirm
          title="确定删除选中的公告吗？"
          @confirm="deleteDateBtn"
          confirm-button-text="确认"
          cancel-button-text="取消"
          icon="el-icon-warning"
          icon-color="#7B68EE">
          <el-button 
            slot="reference" 
            type="danger" 
            size="small" 
            icon="el-icon-delete" 
            :disabled="update.length <= 0"
            class="action-btn delete-btn">
            删除
          </el-button>
        </el-popconfirm>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="notice-table">
        <el-table-column 
          type="selection" 
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="公告标题"
          width="180">
          <template #default="{row}">
            <div class="title-cell">
              <i class="el-icon-document"></i>
              <span>{{row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="公告类型"
          width="180">
          <template #default="{row}">
            <el-tag 
              v-if="row.type == 0" 
              type="success"
              class="notice-tag">
              <i class="el-icon-bell"></i> 通知
            </el-tag>
            <el-tag 
              v-if="row.type == 1" 
              type="warning"
              class="notice-tag">
              <i class="el-icon-message-solid"></i> 公告
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="180">
          <template #default="{row}">
            <el-tag 
              v-if="row.state == 0" 
              type="success"
              class="status-tag">
              <i class="el-icon-circle-check"></i> 正常
            </el-tag>
            <el-tag 
              v-if="row.state == 1" 
              type="danger"
              class="status-tag">
              <i class="el-icon-circle-close"></i> 关闭
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="创建人"
          width="150">
          <template #default="{row}">
            <div class="creator-cell">
              <i class="el-icon-user"></i>
              <span>{{row.createBy}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
          <template #default="{row}">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{row.createTime}}</span>
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
                type="success" 
                icon="el-icon-edit"
                @click="updateAccount(row.id)"
                class="action-btn edit-btn">
                修改
              </el-button>
              <el-popconfirm
                title="确定删除该公告吗？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#FF6B6B">
                <el-button 
                  slot="reference" 
                  size="mini" 
                  type="danger" 
                  icon="el-icon-delete"
                  class="action-btn delete-btn">
                  删除
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
        class="notice-pagination">
      </el-pagination>
    </div>

    <add-notice @addNoticeFalse="addNoticeFalse" :addNoticeVisible="addNoticeVisible"></add-notice>
    <update-notice @updateNoticeFalse="updateNoticeFalse" :updateId="updateId" :updateNoticeVisible="updateNoticeVisible"></update-notice>
  </div>
</template>

<script>
import {getAccountPage,removeAccount} from '../../../api/api' 
import addNotice from '../../../components/system/notice/addNotice'
import updateNotice from '../../../components/system/notice/updateNotice'

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addNoticeVisible: false,
      updateNoticeVisible: false,
      search: {
        title: "",
        updateBy: "",
        state: "",
        type: "",
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
    }
  },
  components: {
    addNotice,
    updateNotice
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
      this.loading = true;
      getAccountPage(this.search).then(res => {
        if(res.code == 1000) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    refresh() {
      this.search = {
        title: "",
        updateBy: "",
        state: "",
        type: "",
        pageNumber: 1,
        pageSize: 10
      }
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
      val.forEach(item => {
        this.update.push(item.id)
        this.remove.push(item.id)
      })
    },
    addNotice() {
      this.addNoticeVisible = true
    },
    addNoticeFalse() {
      this.addNoticeVisible = false
      this.query()
    },
    updateNoticeFalse() {
      this.updateId = ""
      this.updateNoticeVisible = false
      this.query()
    },
    updateAccount(id) {
      this.updateId = id
      this.updateNoticeVisible = true
    },
    updateAccountBtn() {
      this.updateAccount(this.update[0])
    },
    deleteDateBtn() {
      this.$confirm(`确定删除选中的${this.remove.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning',
        customClass: 'notice-confirm'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeAccount({ids:ids}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            customClass: 'notice-message'
          });
          this.search.pageNumber = 1
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
.notice-management {
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

.title-cell,
.creator-cell,
.time-cell {
  display: flex;
  align-items: center;
}

.title-cell i,
.creator-cell i,
.time-cell i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 16px;
}

.notice-tag,
.status-tag {
  display: flex;
  align-items: center;
}

.notice-tag i,
.status-tag i {
  margin-right: 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
}
</style>

<style>
/* 全局样式 */
.notice-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
  padding-left: 30px;
}

.notice-input .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.notice-select .el-input__inner {
  border-radius: 20px;
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

.action-btn.add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-btn.edit-btn {
  background: linear-gradient(135deg, #67C23A, #5DA934);
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

.notice-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.notice-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.notice-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.notice-confirm .el-message-box__header {
  background-color: #ECE9F4;
  padding: 15px 20px;
}

.notice-confirm .el-message-box__title {
  color: #4A2B90;
}

.notice-confirm .el-message-box__content {
  color: #5F4B8B;
}

.notice-message {
  border-radius: 20px;
}
</style>