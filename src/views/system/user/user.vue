<template>
  <div class="user-management">
    <div class="layout-container">
      <!-- 左侧部门树 -->
      <div class="dept-tree">
        <div class="tree-header">
          <i class="el-icon-office-building"></i>
          <span>部门组织</span>
        </div>
        <el-input
          class="tree-search"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入部门名称进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          class="tree-content"
          node-key="id"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i :class="data.children ? 'el-icon-folder-opened' : 'el-icon-folder'" style="color:#7B68EE"></i>
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 搜索区域 -->
        <div class="search-panel">
          <el-row :gutter="15">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <div class="search-item">
                <span class="search-label">
                  <i class="el-icon-user-solid" style="color:#7B68EE"></i> 用户名称:
                </span>
                <el-input
                  size="small"
                  v-model="search.userName"
                  placeholder="请输入用户名称"
                  clearable>
                </el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <div class="search-item">
                <span class="search-label">
                  <i class="el-icon-mobile-phone" style="color:#7B68EE"></i> 手机号码:
                </span>
                <el-input
                  size="small"
                  v-model="search.tel"
                  placeholder="请输入手机号码"
                  clearable>
                </el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <div class="search-item">
                <span class="search-label">
                  <i class="el-icon-circle-check" style="color:#7B68EE"></i> 状态:
                </span>
                <el-select
                  size="small"
                  v-model="search.status"
                  placeholder="请选择状态"
                  clearable>
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="停用" value="1"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <div class="search-actions">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-search"
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

        <!-- 表格区域 -->
        <div class="table-panel">
          <div class="table-actions">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addUser"
              class="action-btn add-btn">
              新增用户
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
              title="确定删除选中的用户吗？"
              @confirm="deleteDateBtn"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-warning"
              icon-color="#FF6B6B">
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
            @selection-change="handleSelectionChange"
            :header-cell-style="tableHeaderStyle"
            :row-style="tableRowStyle"
            stripe
            style="width: 100%"
            class="user-table">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="用户名称" width="180">
              <template #default="{row}">
                <div class="user-cell">
                  <el-avatar :size="35" :src="row.avatar || require('../../../assets/image/avator.png')" class="user-avatar"></el-avatar>
                  <div class="user-info">
                    <span class="user-name">{{row.userName}}</span>
                    <span class="user-account">{{row.loginAccount}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="deptName" label="部门" width="150">
              <template #default="{row}">
                <div class="dept-cell">
                  <i class="el-icon-office-building"></i>
                  <span>{{row.deptName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="tel" label="手机号" width="150">
              <template #default="{row}">
                <div class="tel-cell">
                  <i class="el-icon-mobile-phone"></i>
                  <span>{{row.tel}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{row}">
                <el-tag v-if="row.status == 0" type="success" size="small" class="status-tag">
                  <i class="el-icon-success"></i> 正常
                </el-tag>
                <el-tag v-if="row.status == 1" type="danger" size="small" class="status-tag">
                  <i class="el-icon-error"></i> 停用
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
              <template #default="{row}">
                <div class="time-cell">
                  <i class="el-icon-time"></i>
                  <span>{{row.createTime}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{row}">
                <div class="action-buttons">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="updateUser(row.id)"
                    class="action-btn edit-btn">
                    修改
                  </el-button>
                  <el-popconfirm
                    title="确定删除该用户吗？"
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
            class="table-pagination">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 对话框组件保持不变 -->
    <add-user @addUserFalse="addUserFalse" :data="data" :post="post" :role="role" :addUserVisible="addUserVisible"></add-user>
    <update-user @updateUserFalse="updateUserFalse" :updateId="updateId" :data="data" :post="post" :role="role" :updateUserVisible="updateUserVisible"></update-user>
    
    <el-dialog
      title="重置密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
      :before-close="handlePasswordClose"
      class="password-dialog">
      <div class="dialog-content">
        <div class="password-info">
          <i class="el-icon-key"></i>
          <span>请输入 <span class="highlight">{{userName}}</span> 的新密码：</span>
        </div>
        <el-input
          show-password
          v-model="newPassword"
          size="small"
          placeholder="请输入新密码">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePasswordClose" class="reset-btn">取 消</el-button>
        <el-button size="small" type="primary" @click="passwordSubmit" class="search-btn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getDeptList,getUserPage,removeUser,getPostList,getRoleList,resetPassword} from '../../../api/api' 
  import addUser from "../../../components/system/user/addUser"
  import updateUser from "../../../components/system/user/updateUser"
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addUserVisible: false,
        updateUserVisible: false,
        passwordDialogVisible: false,
        filterText: "",
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        search: {
            userName: "",
            tel: "",
            status: "",
            deptId: "",
            userType: 0,
            pageNumber: 1,
            pageSize:10
        },
        userName: "",
        userId: "",
        newPassword: "",
        total: 0,
        tableData: [],
        data: [],
        post: [],
        role: [],
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
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      getDept() {
        this.search.pageNumber = 1
        getDeptList().then(res => {
          if(res.code == 1000) {
            this.data = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      getPost() {
        getPostList().then(res => {
          if(res.code == 1000) {
            this.post = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      getRole() {
        getRoleList().then(res => {
          if(res.code == 1000) {
            this.role = res.data
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.deptName.indexOf(value) !== -1;
      },
      query() {
        getUserPage(this.search).then(res => {
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
        this.search.tel = ""
        this.search.status = ""
        this.search.deptId = ""
        this.query()
      },
      handleNodeClick(data) {
        this.search.deptId = data.id
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
        var data = command.split("#")
        if(data[1] == 'edit') {
          this.updateUser(data[0])
        } else if(data[1] == 'pass') {
          this.userName = data[2]
          this.openPassword(data[0])
        } else {
          this.$confirm('确定删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDate(data[0])
        }).catch(() => {
                 
        });
        }
      },
      deleteDateBtn() {
        this.$confirm('确定删除选中的'+ this.remove.length +'条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning',
          customClass: 'user-confirm'
        }).then(() => {
          this.deleteDate(this.remove.join(","))
        }).catch(() => {
                 
        });
      },
      deleteDate(ids) {
        removeUser({ids:ids}).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                customClass: 'user-message'
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
            customClass: 'user-message'
          });
          return;
        }
        resetPassword({id: this.userId,newPassword: this.newPassword}).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
                  title: '成功',
                  message: "重置成功"
                });
            this.handlePasswordClose()
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      }
    },
    mounted() {
      this.getDept()
      this.getPost()
      this.getRole()
      this.query()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
 }
</script>

<style scoped>
.user-management {
  height: 100%;
  padding: 20px;
  background-color: #F8F7FC;
}

.layout-container {
  display: flex;
  height: 100%;
}

.dept-tree {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
  margin-right: 20px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tree-header {
  padding: 10px 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #4A2B90;
  border-bottom: 1px solid #F0EEF7;
  display: flex;
  align-items: center;
}

.tree-header i {
  margin-right: 8px;
  color: #7B68EE;
  font-size: 18px;
}

.tree-search {
  margin-bottom: 10px;
}

.tree-content {
  flex: 1;
  overflow: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #5F4B8B;
}

.custom-tree-node i {
  margin-right: 8px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
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

.search-label {
  font-size: 14px;
  color: #4A2B90;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.search-label i {
  margin-right: 6px;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.table-panel {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
  display: flex;
  flex-direction: column;
}

.table-actions {
  padding: 10px 0 15px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0EEF7;
}

.user-cell {
  display: flex;
  align-items: center;
}

.user-avatar {
  border: 2px solid #ECE9F4;
}

.user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #4A2B90;
}

.user-account {
  font-size: 12px;
  color: #999;
}

.dept-cell,
.tel-cell,
.time-cell {
  display: flex;
  align-items: center;
}

.dept-cell i,
.tel-cell i,
.time-cell i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 16px;
}

.status-tag {
  display: flex;
  align-items: center;
}

.status-tag i {
  margin-right: 5px;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.table-pagination {
  margin-top: 15px;
  text-align: right;
}

.dialog-content {
  padding: 10px;
}

.password-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.password-info i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 18px;
}

.highlight {
  color: #7B68EE;
  font-weight: 500;
}
</style>

<style>
/* 全局样式 */
.user-management .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
}

.user-management .el-input__prefix {
  left: 5px;
  color: #7B68EE;
}

.user-management .el-select .el-input__inner {
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

.user-table {
  border-radius: 8px;
  border: 1px solid #ECE9F4;
}

.user-table .el-table__body tr:hover>td {
  background-color: #F5F2FF !important;
}

.table-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7B68EE;
  color: white;
  border-radius: 50%;
}

.password-dialog .el-dialog__header {
  background-color: #ECE9F4;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
}

.password-dialog .el-dialog__title {
  color: #4A2B90;
  font-weight: bold;
}

.password-dialog .el-dialog__body {
  color: #5F4B8B;
}

.user-confirm .el-message-box__header {
  background-color: #ECE9F4;
  padding: 15px 20px;
}

.user-confirm .el-message-box__title {
  color: #4A2B90;
}

.user-confirm .el-message-box__content {
  color: #5F4B8B;
}

.user-message {
  border-radius: 20px;
}

.el-tree-node__content {
  height: 40px;
}

.el-tree-node:focus>.el-tree-node__content {
  background-color: #F0EEF7 !important;
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #F0EEF7;
  color: #7B68EE;
  font-weight: bold;
}
</style>