<template>
  <div class="role-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user-solid"></i> 角色名称:
            </span>
            <el-input
              size="small"
              placeholder="请输入角色名称"
              v-model="search.roleName"
              class="tech-input">
              <i slot="prefix" class="el-icon-edit-outline"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-key"></i> 权限字符:
            </span>
            <el-input
              size="small"
              placeholder="请输入权限字符"
              v-model="search.roleKey"
              class="tech-input">
              <i slot="prefix" class="el-icon-lock"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-circle-check"></i> 角色状态:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.status" 
              placeholder="请选择"
              class="tech-select">
              <el-option
                label="正常"
                value="0">
                <span class="status-option">
                  <i class="el-icon-success" style="color:#67C23A"></i> 正常
                </span>
              </el-option>
              <el-option
                label="停用"
                value="1">
                <span class="status-option">
                  <i class="el-icon-error" style="color:#F56C6C"></i> 停用
                </span>
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
          @click="addRole"
          class="action-btn add-btn">
          新增
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length != 1"
          @click="updateRoleBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="update.length <= 0"
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
        <el-table-column 
          type="selection" 
          width="55"
          align="center">
        </el-table-column>
        <el-table-column 
          prop="roleName" 
          label="角色名称"
          min-width="180">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-user"></i>
              <span>{{ row.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="roleKey" 
          label="权限标识"
          min-width="180">
          <template #default="{row}">
            <div class="key-cell">
              <i class="el-icon-key"></i>
              <span>{{ row.roleKey }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="status" 
          label="状态"
          width="120">
          <template #default="{row}">
            <div class="status-cell">
              <el-tag 
                v-if="row.status == 0" 
                type="success"
                effect="dark">
                <i class="el-icon-success"></i> 正常
              </el-tag>
              <el-tag 
                v-if="row.status == 1" 
                type="warning"
                effect="dark">
                <i class="el-icon-error"></i> 停用
              </el-tag>
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
              <span>{{ row.createTime }}</span>
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
                @click="updateRole(row.id)"
                class="action-btn edit-btn">
                <i class="el-icon-edit"></i> 修改
              </el-button>
              <el-popconfirm
                title="确认删除此角色？"
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
    
    <add-role @addRoleFalse="addRoleFalse" :menu = "menu" :addRoleVisible = "addRoleVisible"></add-role>
    <update-role @updateRoleFalse="updateRoleFalse" :updateId = "updateId" :menu = "menu" :updateRoleVisible = "updateRoleVisible"></update-role>
  </div>
</template>

<script>
  import {getRolePage,removeRole,getMenuList} from '../../../api/api' 
  import addRole from '../../../components/system/role/addRole'
  import updateRole from '../../../components/system/role/updateRole'
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addRoleVisible: false,
        updateRoleVisible: false,
        search: {
            roleName: "",
            roleKey: "",
            status: "",
            pageNumber: 1,
            pageSize:10
        },
        total: 0,
        tableData: [],
        menu: [],
      }
    },
    components: {
      addRole,
      updateRole
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
        getRolePage(this.search).then(res => {
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
        this.search.roleName = ""
        this.search.roleKey = ""
        this.search.status = ""
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
      addRole() {
        this.addRoleVisible = true
      },
      addRoleFalse() {
        this.addRoleVisible = false
        this.query()
      },
      updateRole(id) {
        this.updateId = id
        this.updateRoleVisible = true
      },
      updateRoleFalse() {
        this.updateRoleVisible = false
        this.updateId = ""
        this.query()
      },
      updateRoleBtn() {
        this.updateRole(this.update[0])
      },
      deleteDateBtn() {
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
        removeRole({ids:ids}).then(res => {
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
      getMenu() {
        getMenuList(this.search).then(res => {
          if(res.code == 1000) {
            this.menu = res.data
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
      this.query()
      this.getMenu()
    }
 }
</script>

<style scoped>
.role-management {
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

.name-cell, .key-cell, .status-cell, .time-cell {
  display: flex;
  align-items: center;
}

.name-cell i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 16px;
}

.key-cell i {
  color: #9370DB;
  margin-right: 8px;
}

.status-cell i {
  margin-right: 4px;
}

.time-cell i {
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

.status-option {
  display: flex;
  align-items: center;
}

.status-option i {
  margin-right: 5px;
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

.action-btn.add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-btn.edit-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
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

.el-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.el-tag i {
  margin-right: 4px;
}
</style>