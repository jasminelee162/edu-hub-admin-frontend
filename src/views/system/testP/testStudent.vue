<template>
  <div class="_student">
      <div class="search-table">
        <div class="search">
            <el-row :gutter="10" style="padding:10px">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <span class="search-title">学生姓名:</span>
                    <el-input
                        style="margin-top:10px"
                        size="mini"
                        placeholder="请输入学生姓名"
                        v-model="search.userName">
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-search" type="primary" @click="searchPage">查询</el-button>
                    <el-button style="margin-top:10px" size="mini" icon="el-icon-refresh" @click="refresh">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <el-row style="padding-top:10px;margin-left:10px">
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
            stripe
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="createBy"
              label="学生姓名"
              >
            </el-table-column>
            <el-table-column
              prop="testName"
              label="考试名称"
              >
            </el-table-column>
            <el-table-column
              prop="totalScore"
              label="总分"
              >
            </el-table-column>
            <el-table-column
              prop="totalGetScore"
              label="得分"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              >
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="yuejuan(scope.row.userId)">阅卷</el-button>
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
        <el-dialog
          title="阅卷"
          :visible.sync="dialogVisible"
          width="60%"
          :before-close="handleClose">
          <div class="testInfo-item" v-for="(item,index) in assign" :key="index">
              <div style="margin-top:10px;margin-left:10px">{{index + 1}}.{{item.title}} 
                  <span style="color:red">正确答案：{{item.answer}}</span>
                  <span style="color:green;margin-left:10px;width:50px">得分：<el-input style="width:100px" type="number" v-model="item.point" size="mini"></el-input></span>
              </div>
              <div style="margin-top:10px;margin-left:10px;margin-bottom:10px">
                  <el-radio-group disabled v-model="item.solution" v-if="item.type == 0">
                      <el-radio v-for="(e,s) in item.content" :key="s" :label="e.value">{{e.value}}.{{e.option}}</el-radio>
                  </el-radio-group>
                  <el-checkbox-group disabled v-model="item.solution" v-if="item.type == 1">
                      <el-checkbox v-for="(e,s) in item.content" :key="s" :label="e.value">{{e.value}}.{{e.option}}</el-checkbox>
                  </el-checkbox-group>
                  <el-input disabled v-model="item.solution" v-if="item.type == 2" size="mini" placeholder="请输入答案"></el-input>
                  <el-radio-group disabled v-model="item.solution" v-if="item.type == 3">
                      <el-radio label="正确">正确</el-radio>
                      <el-radio label="错误">错误</el-radio>
                  </el-radio-group>
                  <el-input type="textarea" disabled v-model="item.solution" v-if="item.type == 4" size="mini" placeholder="请输入答案"></el-input>
                  <el-input type="textarea" disabled v-model="item.solution" v-if="item.type == 5" size="mini" placeholder="请输入答案"></el-input>
              </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleClose">取 消</el-button>
            <el-button size="mini" type="primary" @click="submit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    
  </div>
</template>

<script>
  import {getTestStudent,getTestStudentItem,editApeTestStudent} from '../../../api/api' 
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addVisible: false,
        updateVisible: false,
        dialogVisible: false,
        search: {
            testId: "",
            userName: "",
            pageNumber: 1,
            pageSize:10
        },
        assign: [],
        total: 0,
        tableData: []
      }
    },
    components: {
    },
    methods: {
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      submit() {
        var param = {
          list: this.assign
        }
        editApeTestStudent(param).then(res => {
          if (res.code == 1000) {
            this.$notify.success({
              title: '成功',
              message: "阅卷成功"
            });
            this.handleClose()
            this.query()
          }
        })
      },
      query() {
        getTestStudent(this.search).then(res => {
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
      yuejuan(userId) {
        console.log("hahah")
        getTestStudentItem({testId: this.search.testId,userId: userId}).then(res => {
          if(res.code == 1000) {
            this.assign = res.data
            for(let i = 0;i<this.assign.length;i++) {
                var item = this.assign[i]
                if (item.type == "0" || item.type == "1") {
                  if (item.content) {
                      item.content = JSON.parse(item.content)
                  }
                  if(item.type == 1) {
                      if(item.solution) {
                        item.solution = item.solution.split(",")
                      } else {
                        item.solution = []
                      }
                  }
              }
            }
          }
        })
        this.dialogVisible = true
      },
      handleClose() {
        this.dialogVisible = false
        this.assign = []
      },
      refresh() {
        this.search.userName = ""
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
    },
    mounted() {
      this.search.testId = this.$route.query.id
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