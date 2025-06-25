<template>
  <div class="log">
      <div class="search-table">
        <div class="search">
            <el-row :gutter="10" style="padding:10px">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">用户账号:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入用户账号"
                        v-model="search.operUserAccount">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">类型:</span>
                    <el-select clearable style="margin-top:10px" size="mini" v-model="search.type" placeholder="请选择">
                      <el-option
                        label="其他"
                        value="7">
                      </el-option>
                      <el-option
                        label="新增"
                        value="1">
                      </el-option>
                       <el-option
                        label="修改"
                        value="2">
                      </el-option>
                      <el-option
                        label="删除"
                        value="3">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">操作时间:</span>
                    <el-date-picker size="mini"
                      style="margin-top:10px"
                      v-model="time"
                      type="daterange"
                      range-separator="至"
                      format="yyyy-MM-dd" 
                      value-format="yyyy-MM-dd" 
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage">查询</el-button>
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <el-row style="padding-top:10px;margin-left:10px">
                <el-popconfirm
                  style="margin-left:5px"
                  confirm-button-text='确认'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确认要清空登陆日志？"
                  @confirm="clear"
                >
                  <el-button size="mini" slot="reference" icon="el-icon-delete" plain type="warning">清空</el-button>
                </el-popconfirm>
                <el-button style="margin-left:10px" type="danger" :disabled="remove.length <= 0 ?true:false" size="mini" icon="el-icon-delete" plain @click="deleteDateBtn">删除</el-button>
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
              prop="name"
              label="系统模块"
              width="180"
              >
            </el-table-column>
            <el-table-column
              prop="requestType"
              label="请求类型"
              width="100"
              >
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type == 7" size="mini" type="primary">&nbsp;&nbsp;其他&nbsp;&nbsp;</el-button>
                <el-button v-if="scope.row.type == 1" size="mini">&nbsp;&nbsp;新增&nbsp;&nbsp;</el-button>
                <el-button v-if="scope.row.type == 2" size="mini" type="warning">&nbsp;&nbsp;修改&nbsp;&nbsp;</el-button>
                <el-button v-if="scope.row.type == 3" size="mini" type="danger">&nbsp;&nbsp;删除&nbsp;&nbsp;</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="operUserName"
              label="操作人员"
              width="150"
              >
            </el-table-column>
            <el-table-column
              prop="operIp"
              label="操作IP"
              width="180"
              >
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.state == 0" size="mini" type="primary">&nbsp;&nbsp;正常&nbsp;&nbsp;</el-button>
                <el-button v-if="scope.row.state == 1" size="mini" type="danger">&nbsp;&nbsp;失败&nbsp;&nbsp;</el-button>
              </template>
            </el-table-column>
           <el-table-column
              prop="operTime"
              label="操作时间"
              >
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
    </div>
  </div>
</template>

<script>
  import {getOperLogPage,removeOperLog,clearOperLog} from '../../../api/api' 
  export default {
    data() {
      return{
        loading: true,
        remove: [],
        time: [],
        search: {
            operUserAccount: "",
            type: "",
            startTime: "",
            endTime: "",
            pageNumber: 1,
            pageSize:10
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
        if (this.time.length > 0) {
          this.search.startTime = this.time[0] + " 00:00:00"
          this.search.endTime = this.time[1] + " 23:59:59"
        }
        getOperLogPage(this.search).then(res => {
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
        this.search.operUserAccount = ""
        this.search.type = ""
        this.search.startTime = ""
        this.search.endTime = ""
        this.time = []
        this.query()
      },
      clear() {
        clearOperLog().then(res => {
            if(res.code == 1000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query()
            } else {
              this.$notify.error({
                title: '错误',
                message: res.message
              });
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
        this.remove = []
        for (let i = 0;i < val.length;i++) {
          var item = val[i]
          this.remove.push(item.id)
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
        removeOperLog({ids:ids}).then(res => {
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
    },
    created() {
     
    },
    mounted() {
      this.query()
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