<template>
  <div class="student-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 学生名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入学生名称"
              v-model="search.userName"
              class="tech-input">
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-school"></i> 学校:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.school" 
              placeholder="请选择"
              class="tech-select">
              <el-option 
                v-for="(item,index) in school" 
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-reading"></i> 专业:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.major" 
              placeholder="请选择"
              class="tech-select">
              <el-option 
                v-for="(item,index) in major" 
                :key="index"
                :label="item.name"
                :value="item.name">
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
          title="确定删除选中学生吗？"
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
        class="tech-table">
        <el-table-column 
          type="selection" 
          width="55"
          align="center">
        </el-table-column>
        <el-table-column 
          label="学生信息"
          width="180">
          <template #default="{row}">
            <div class="student-cell">
              <el-avatar :size="35" :src="$store.state.configure.HOST + row.avatar"></el-avatar>
              <div class="student-info">
                <span class="student-name">{{row.userName}}</span>
                <span class="student-account">{{row.loginAccount}}</span>
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
          label="操作" 
          width="180"  
          fixed="right">
          <template #default="{row}">
            <div class="action-buttons">
              <el-dropdown trigger="hover" @command="handleCommand">
                <el-button size="mini" class="action-btn more-btn">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="tech-dropdown">
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

    <add-user @addUserFalse="addUserFalse" :addUserVisible="addUserVisible"></add-user>
    <update-user @updateUserFalse="updateUserFalse" :updateId="updateId" :updateUserVisible="updateUserVisible"></update-user>
    
    <el-dialog
      title="重置密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
      :before-close="handlePasswordClose"
      class="tech-dialog">
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
          class="tech-input">
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
import {getUserPage,removeUser,resetPassword,getApeSchoolList,getApeMajorList} from '../../../api/api' 
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
    getApeSchoolList() {
      getApeSchoolList().then(res=> {
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
    getApeMajorList() {
      getApeMajorList().then(res => {
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
          customClass: 'tech-confirm'
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
        customClass: 'tech-confirm'
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
            customClass: 'tech-message'
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
          customClass: 'tech-message'
        });
        return;
      }
      resetPassword({id: this.userId, newPassword: this.newPassword}).then(res => {
        if(res.code == 1000) {
          this.$message({
            type: 'success',
            message: '重置成功',
            customClass: 'tech-message'
          });
          this.handlePasswordClose()
        } else {
          this.$message.error({
            message: res.message,
            customClass: 'tech-message'
          });
        }
      })
    }
  },
  mounted() {
    this.getApeSchoolList()
    this.getApeMajorList()
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

.student-account {
  font-size: 12px;
  color: #A5A4BF;
  margin-top: 2px;
}

.country-cell, 
.school-cell, 
.major-cell {
  display: flex;
  align-items: center;
}

.country-cell i,
.school-cell i,
.major-cell i {
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

.action-btn.more-btn {
  background: linear-gradient(135deg, #A5A4BF, #C4C3D9);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.tech-dropdown {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
  border: 1px solid #ECE9F4;
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

.tech-dialog .el-dialog__header {
  border-bottom: 1px solid #F0EEF7;
  padding: 15px 20px;
}

.tech-dialog .el-dialog__title {
  color: #4A2B90;
  font-weight: bold;
}

.confirm-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 7px 15px;
}

.cancel-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
  padding: 7px 15px;
}

.tech-confirm .el-message-box__header {
  background-color: #ECE9F4;
  padding: 15px 20px;
}

.tech-confirm .el-message-box__title {
  color: #4A2B90;
}

.tech-confirm .el-message-box__content {
  color: #5F4B8B;
}

.tech-message {
  border-radius: 20px;
}
</style>