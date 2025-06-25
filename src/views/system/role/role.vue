<template>
  <div class="role">
      <div class="search-table">
        <div class="search">
            <el-row :gutter="10" style="padding:10px">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">角色名称:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入角色名称"
                        v-model="search.roleName">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">权限字符:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入权限字符"
                        v-model="search.roleKey">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">角色状态:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.status" placeholder="请选择">
                      <el-option
                        label="正常"
                        value="0">
                      </el-option>
                      <el-option
                        label="停用"
                        value="1">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage">查询</el-button>
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <el-row style="padding-top:10px;margin-left:10px">
                <el-button type="primary" size="mini" icon="el-icon-plus" plain @click="addRole">新增</el-button>
                <el-button type="success" :disabled="update.length != 1 ?true:false" size="mini" icon="el-icon-edit" plain @click="updateRoleBtn">修改</el-button>
                <el-button type="danger" :disabled="update.length <= 0 ?true:false" size="mini" icon="el-icon-delete" plain @click="deleteDateBtn">删除</el-button>
                <!-- <el-button type="warning" size="mini" icon="el-icon-download" plain>导出</el-button> -->
            </el-row>
            <el-table
            v-loading="loading"
            :data="tableData"
            :header-cell-style="{
              'color': '#4A2B90',
              'background-color': '#ECE9F4',
            }"
            :row-style="{
              'color': '#888897',
              'font-size': '15px',
              'font-family':'黑体',
              'white-space': 'nowrap'
            }"
            @selection-change="handleSelectionChange"
            stripe
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色名称"
              width="180"
              >
            </el-table-column>
            <el-table-column
              prop="roleKey"
              label="权限标识"
              width="180"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="180">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status == 0">正常</el-tag>
                <el-tag v-if="scope.row.status == 1" type="warning">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              >
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="updateRole(scope.row.id)">修改</el-button>
                <el-popconfirm
                  style="margin-left:5px"
                  confirm-button-text='确认'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确认删除选中的数据？"
                  @confirm="deleteDate(scope.row.id)"
                >
                  <el-button size="mini" slot="reference" type="danger">删除</el-button>
                </el-popconfirm>
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
            :total="total">
          </el-pagination>
          </div>
        </div>
      <add-role @addRoleFalse="addRoleFalse" :menu = "menu" :addRoleVisible = "addRoleVisible"></add-role>
      <update-role @updateRoleFalse="updateRoleFalse" :updateId = "updateId" :menu = "menu" :updateRoleVisible = "updateRoleVisible"></update-role>
    </div>
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
          type: 'warning'
        }).then(() => {
          this.deleteDate(this.remove.join(","))
        }).catch(() => {
                 
        });
      },
      deleteDate(ids) {
        removeRole({ids:ids}).then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
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

<style   scoped>
  .search-table {
      width: 100%;
  }
  .search {
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
  }
  .table {
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin-top: 10px
  }
  .el-col {
      display: flex;
      flex-direction: row;
      align-items: center;
  }
  .search-title {
      font-family: '黑体';
      float: right;
      white-space: nowrap;
      font-size: 14px;
      margin-top:10px;
      width: 63px;
      text-align: right;
  }
  .el-table {
      padding: 10px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #F4F8F9 !important;
  }
  .el-dialog {
    border-radius: 10px!important;
  }
</style>