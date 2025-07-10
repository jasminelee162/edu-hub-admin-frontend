<template>
  <div class="student-management">
    <!-- 搜索区域 -->
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 学生名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入学生名称"
              v-model="search.userName"
              class="stu-input">
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-mobile-phone"></i> 手机号码:
            </span>
            <el-input
              size="small"
              placeholder="请输入手机号码"
              v-model="search.tel"
              class="stu-input">
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-school"></i> 学校:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.school" 
              placeholder="请选择"
              class="stu-select">
              <el-option 
                v-for="(item,index) in school" 
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-reading"></i> 专业:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.major" 
              placeholder="请选择"
              class="stu-select">
              <el-option 
                v-for="(item,index) in major" 
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
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
          @click="addUser"
          class="action-btn add-btn">
          新增学生
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length !== 1"
          @click="updateUserBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-popconfirm
          title="确定删除选中的学生吗？"
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

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        stripe
        class="stu-table">
        <el-table-column 
          type="selection" 
          width="55"
          align="center">
        </el-table-column>
        <el-table-column 
          label="学生名称"
          width="180">
          <template #default="{row}">
            <div class="student-cell">
              <el-avatar :size="35" :src="$store.state.configure.HOST + row.avatar"></el-avatar>
              <div class="student-info">
                <span class="student-name">{{row.userName}}</span>
                <span class="student-id">ID: {{row.loginAccount}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="country" 
          label="国家"
          width="120">
          <template #default="{row}">
            <div class="country-cell">
              <i class="el-icon-location-outline"></i>
              <span>{{row.country || '--'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="school" 
          label="学校"
          width="180">
          <template #default="{row}">
            <div class="school-cell">
              <i class="el-icon-school"></i>
              <span>{{row.school || '--'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="major" 
          label="专业"
          width="180">
          <template #default="{row}">
            <div class="major-cell">
              <i class="el-icon-reading"></i>
              <span>{{row.major || '--'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="tel" 
          label="手机号"
          width="140">
          <template #default="{row}">
            <div class="tel-cell">
              <i class="el-icon-mobile-phone"></i>
              <span>{{row.tel || '--'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="email" 
          label="邮箱"
          width="200">
          <template #default="{row}">
            <div class="email-cell">
              <i class="el-icon-message"></i>
              <span>{{row.email || '--'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="状态"
          width="100">
          <template #default="{row}">
            <el-tag 
              size="small"
              :type="row.status === 1 ? 'success' : 'danger'">
              {{row.status === 1 ? '活跃' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="180"  
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-dropdown trigger="hover" @command="handleCommand">
                <el-button size="mini" class="action-btn more-btn">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="stu-dropdown">
                  <el-dropdown-item 
                    icon="el-icon-edit" 
                    :command="row.id + '#edit'"
                    class="dropdown-item">
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item 
                    icon="el-icon-key" 
                    v-if="row.loginAccount != 'admin'" 
                    :command="row.id + '#pass#' + row.userName"
                    class="dropdown-item">
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item 
                    icon="el-icon-delete" 
                    v-if="row.loginAccount != 'admin'" 
                    :command="row.id + '#remove'"
                    class="dropdown-item delete-item">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
        class="stu-pagination">
      </el-pagination>
    </div>

    <!-- 弹窗组件 -->
    <add-user @addUserFalse="addUserFalse" :addUserVisible="addUserVisible"></add-user>
    <update-user @updateUserFalse="updateUserFalse" :updateId="updateId" :updateUserVisible="updateUserVisible"></update-user>
    
    <!-- 重置密码对话框 -->
    <el-dialog
      title="重置密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
      :before-close="handlePasswordClose"
      class="stu-dialog">
      <div class="dialog-content">
        <div class="password-info">
          <i class="el-icon-key" style="color:#7B68EE;font-size:20px"></i>
          <span>请输入 <span class="highlight">{{userName}}</span> 的新密码：</span>
        </div>
        <el-input 
          style="margin-top:15px" 
          show-password 
          v-model="newPassword" 
          size="small" 
          placeholder="请输入新密码"
          class="stu-input">
          <i slot="prefix" class="el-icon-lock"></i>
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePasswordClose" class="cancel-btn">取 消</el-button>
        <el-button size="small" type="primary" @click="passwordSubmit" class="confirm-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getUserPage,removeUser,resetPassword,getSchoolList,getMajorList} from '../../../api/api'
import addUser from "../../../components/system/student/addStudent"
import updateUser from "../../../components/system/student/updateStudent"

export default {
  data() {
    return {
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addUserVisible: false,
      updateUserVisible: false,
      passwordDialogVisible: false,
      search: {
        userName: "",
        tel: "",
        status: "",
        deptId: "",
        userType: 2,
        school: "",
        major: "",
        pageNumber: 1,
        pageSize: 10
      },
      userName: "",
      userId: "",
      newPassword: "",
      total: 0,
      tableData: [],
      school: [],
      major: []
    }
  },
  components: {
    addUser,
    updateUser
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
    getSchoolList() {
      getSchoolList().then(res=> {
        if(res.code == 1000) {
          this.school = res.data
        } else {
          this.$notify.error({
            title: '错误',
            message: res.message
          });
        }
      })
    },
    getMajorList() {
      getMajorList().then(res => {
        if(res.code == 1000) {
          this.major = res.data
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
      this.loading = true;
      getUserPage(this.search).then(res => {
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
        userName: "",
        tel: "",
        status: "",
        deptId: "",
        userType: 2,
        school: "",
        major: "",
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
    addUser() {
      this.addUserVisible = true
    },
    addUserFalse() {
      this.addUserVisible = false
      this.query()
    },
    updateUser(id) {
      this.updateId = id
      this.updateUserVisible = true
    },
    updateUserFalse() {
      this.updateUserVisible = false
      this.updateId = ""
      this.query()
    },
    updateUserBtn() {
      this.updateUser(this.update[0])
    },
    handleCommand(command) {
      const [id, action, name] = command.split("#")
      if(action === 'edit') {
        this.updateUser(id)
      } else if(action === 'pass') {
        this.userName = name
        this.openPassword(id)
      } else {
        this.$confirm('确定删除该学生?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning',
          customClass: 'stu-confirm'
        }).then(() => {
          this.deleteDate(id)
        }).catch(() => {});
      }
    },
    deleteDateBtn() {
      this.$confirm(`确定删除选中的${this.remove.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning',
        customClass: 'stu-confirm'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeUser({ids:ids}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            customClass: 'stu-message'
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
    openPassword(id) {
      this.userId = id
      this.passwordDialogVisible = true
    },
    handlePasswordClose() {
      this.userName = ""
      this.userId = ""
      this.newPassword = ""
      this.passwordDialogVisible = false
    },
    passwordSubmit() {
      if(!this.newPassword.trim()) {
        this.$message({
          message: '请输入新密码',
          type: 'warning',
          customClass: 'stu-message'
        });
        return;
      }
      resetPassword({id: this.userId, newPassword: this.newPassword}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '重置成功',
            customClass: 'stu-message'
          });
          this.handlePasswordClose()
        } else {
          this.$message.error({
            message: res.message,
            customClass: 'stu-message'
          });
        }
      })
    }
  },
  mounted() {
    this.getSchoolList()
    this.getMajorList()
    this.query()
  }
}
</script>

<style scoped>
.student-management {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 48px);
}

.search-panel {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(123, 104, 238, 0.08);
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
  margin-right: 6px;
  color: #7B68EE;
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
  box-shadow: 0 6px 18px rgba(123, 104, 238, 0.08);
  border: 1px solid #e6e8f0;
}

.action-bar {
  padding: 0 0 20px 0;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f0f2f7;
}

.student-cell {
  display: flex;
  align-items: center;
}

.student-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
  color: #4A2B90;
}

.student-id {
  font-size: 12px;
  color: #A5A4BF;
  margin-top: 2px;
}

.country-cell, 
.school-cell, 
.major-cell, 
.tel-cell, 
.email-cell {
  display: flex;
  align-items: center;
}

.country-cell i,
.school-cell i,
.major-cell i,
.tel-cell i,
.email-cell i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.dialog-content {
  padding: 10px;
}

.password-info {
  display: flex;
  align-items: center;
  color: #5F4B8B;
}

.password-info i {
  margin-right: 8px;
}

.highlight {
  color: #7B68EE;
  font-weight: 500;
}
</style>

<style>
/* 全局样式 */
.stu-input .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
  transition: all 0.25s ease;
  font-size: 13px;
}

.stu-input .el-input__inner:focus {
  border-color: #7B68EE;
  box-shadow: 0 0 0 2px rgba(123, 104, 238, 0.15);
}

.stu-input .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.stu-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 9px 18px;
  height: 36px;
  box-shadow: 0 4px 12px rgba(123, 104, 238, 0.2);
  transition: all 0.25s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(123, 104, 238, 0.3);
}

.reset-btn {
  border-radius: 8px;
  color: #7B68EE;
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
  background: linear-gradient(135deg, #7B68EE, #9370DB);
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

.more-btn {
  background: linear-gradient(135deg, #A5A4BF, #C4C3D9);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

.stu-table {
  border-radius: 12px;
  border: 1px solid #e6e8f0;
  overflow: hidden;
}

.stu-table .el-table__header th {
  font-weight: 600;
}

.stu-table .el-table__body tr:hover>td {
  background-color: #f8f9ff !important;
}

.stu-table .el-table__body td {
  transition: background-color 0.2s ease;
}

.stu-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.stu-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  font-weight: 600;
}

.stu-pagination .el-pagination.is-background .el-pager li:hover {
  color: #7B68EE;
}

.stu-dropdown {
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(123, 104, 238, 0.1);
  border: 1px solid #e6e8f0;
}

.dropdown-item {
  color: #5F4B8B;
  font-size: 13px;
  padding: 8px 15px;
}

.dropdown-item i {
  color: #7B68EE;
}

.delete-item i {
  color: #FF6B6B;
}

.stu-dialog .el-dialog__header {
  border-bottom: 1px solid #f0f2f7;
  padding: 15px 20px;
}

.stu-dialog .el-dialog__title {
  color: #4A2B90;
  font-weight: bold;
}

.confirm-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 9px 18px;
}

.cancel-btn {
  border-radius: 8px;
  color: #7B68EE;
  border: 1px solid #e0e3ed;
  padding: 9px 18px;
}

.stu-confirm .el-message-box__header {
  background-color: #ECE9F4;
  padding: 15px 20px;
}

.stu-confirm .el-message-box__title {
  color: #4A2B90;
}

.stu-confirm .el-message-box__content {
  color: #5F4B8B;
}

.stu-message {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(123, 104, 238, 0.15);
  border: none;
}

.stu-message .el-message__content {
  color: #3d4766;
  font-weight: 500;
}
</style>