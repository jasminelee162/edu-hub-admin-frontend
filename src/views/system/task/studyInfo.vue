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
              prop="userName"
              label="学生姓名"
              >
            </el-table-column>
            <el-table-column
              prop="taskName"
              label="课程名称"
              >
            </el-table-column>
            <el-table-column
              prop="totalScore"
              label="考试总分"
              >
            </el-table-column>
            <el-table-column
              prop="testScore"
              label="考试得分"
              >
            </el-table-column>
            <el-table-column
              prop="videoCount"
              label="视频得分"
              >
            </el-table-column>
            <el-table-column
              prop="assignCount"
              label="作业得分"
              >
            </el-table-column>
            <el-table-column
              label="成绩"
              >
              <template slot-scope="scope">
                {{getScore(scope.row)}}
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
    </div>
  </div>
</template>

<script>
  import {getAdoptTaskStudent} from '../../../api/api' 
  export default {
    data() {
      return{
        loading: true,
        search: {
            taskId: "",
            userName: "",
            pageNumber: 1,
            pageSize:10
        },
        total: 0,
        tableData: []
      }
    },
    components: {
    },
    methods: {
      getScore(row) {
        var taskScore = (row.videoCount + row.assignCount)/(row.assign + row.videoNum) * row.proportion
        var testScore = (row.testScore)/(row.totalScore) * (100 - row.proportion)
        if (!testScore) {
          return (taskScore).toFixed(2)
        } else {
          return (taskScore + testScore).toFixed(2)
        }
      },
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      query() {
        getAdoptTaskStudent(this.search).then(res => {
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
        this.search.state = ""
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
      this.search.taskId = this.$route.query.id
      this.query()
    }
 }
</script>
<style scoped>
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