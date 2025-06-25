<template>
  <div class="user">
    <div class="search-table">
        <div class="search">
            <el-row :gutter="10" style="padding:10px">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">学生名称:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入用学生名称"
                        v-model="search.userName">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">学校:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.school" placeholder="请选择">
                      <el-option v-for="(item,index) in school" :key="index"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">专业:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.major" placeholder="请选择">
                      <el-option v-for="(item,index) in major" :key="index"
                        :label="item.name"
                        :value="item.name">
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
                <el-button type="primary" size="mini" icon="el-icon-plus" plain @click="addUser()">新增</el-button>
                <el-button type="success" :disabled="update.length != 1 ?true:false" size="mini" icon="el-icon-edit" plain @click="updateUserBtn">修改</el-button>
                <!-- <el-button type="warning" size="mini" icon="el-icon-download" plain>导出</el-button> -->
            </el-row>
            <el-table
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
              label="用户名称"
              >
              <template slot-scope="scope">
                <div style="display:flex;align-items: center">
                  <img style="width:35px;height:35px;border-radius:50%" :src="$store.state.configure.HOST + scope.row.avatar">
                  <div style="margin-left:10px">{{scope.row.userName}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="loginAccount"
              label="登陆账号"
              >
            </el-table-column>
            <el-table-column
              prop="country"
              label="国家"
              >
            </el-table-column>
            <el-table-column
              prop="school"
              label="学校"
              >
            </el-table-column>
            <el-table-column
              prop="major"
              label="专业"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              >
              <template slot-scope="scope">
                <el-dropdown trigger="hover" @command="handleCommand">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-edit" :command="scope.row.id + '#edit'">修改</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check" v-if="scope.row.loginAccount != 'admin'" :command="scope.row.id + '#pass#' + scope.row.userName">重置密码</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-remove" v-if="scope.row.loginAccount != 'admin'" :command="scope.row.id + '#remove'">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next"
            :page-sizes="[20, 30, 50, 100]"
            :page-size="search.pageSize"
            :current-page="search.pageNumber"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="total">
          </el-pagination>
          </div>
        </div>
      <add-user @addUserFalse="addUserFalse" :addUserVisible = "addUserVisible"></add-user>
      <update-user @updateUserFalse="updateUserFalse" :updateId = "updateId" :updateUserVisible = "updateUserVisible"></update-user>
      <el-dialog
        title="重置密码"
        :visible.sync="passwordDialogVisible"
        width="30%"
        :before-close="handlePasswordClose">
        <span>请输入{{userName}}的新密码：</span>
        <el-input style="margin-top:10px" show-password v-model="newPassword" size="mini" autocomplete="off"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handlePasswordClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="passwordSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getUserPage,removeUser,resetPassword,getApeSchoolList,getApeMajorList} from '../../../api/api' 
  import addUser from "../../../components/system/student/addStudent"
  import updateUser from "../../../components/system/student/updateStudent"
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
        search: {
            userName: "",
            tel: "",
            status: "",
            deptId: "",
            userType: 2,
            school: "",
            major: "",
            pageNumber: 1,
            pageSize:10
        },
        userName: "",
        userId: "",
        newPassword: "",
        total: 0,
        tableData: [],
        post: [],
        role: [],
        school: [],
        major: []
      }
    },
    components: {
      addUser,
      updateUser
    },
    methods: {
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
        this.search.school = ""
        this.search.major = ""
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
          type: 'warning'
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
            type: 'warning'
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
      this.getApeSchoolList()
      this.getApeMajorList()
      this.query()
    },
    watch: {
      
    },
 }
</script>

<style scoped>
  .user {
      width: 100%;
      display: flex;
  }
  .tree {
      width: 20%;
      background: #ffffff;
      height: 83vh;
      overflow: scroll;
      border-radius: 7px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
  }
  .tree::-webkit-scrollbar {
      width: 0px;
      height: 0px;
  }
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