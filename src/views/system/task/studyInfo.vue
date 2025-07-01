<template>
  <div class="score-management">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 学生姓名:
            </span>
            <el-input
              size="small"
              placeholder="请输入学生姓名"
              v-model="search.userName"
              @keyup.enter.native="searchPage"   
              class="tech-input">
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
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
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        :row-style="tableRowStyle"
        stripe
        class="tech-table">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="学生姓名"
          width="120">
          <template #default="{row}">
            <div class="user-cell">
              <i class="el-icon-user" style="color:#9370DB; margin-right:8px"></i>
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="课程名称"
          min-width="180">
          <template #default="{row}">
            <div class="course-cell">
              <i class="el-icon-notebook-2" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.taskName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalScore"
          label="考试总分"
          width="100"
          align="center">
          <template #default="{row}">
            <el-tag type="info" effect="plain">{{ row.totalScore }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="testScore"
          label="考试得分"
          width="100"
          align="center">
          <template #default="{row}">
            <el-tag :type="getScoreType(row.testScore/row.totalScore)" effect="plain">
              {{ row.testScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="videoCount"
          label="视频得分"
          width="100"
          align="center">
          <template #default="{row}">
            <el-tag type="primary" effect="plain">
              <i class="el-icon-video-camera" style="margin-right:4px"></i>
              {{ row.videoCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="assignCount"
          label="作业得分"
          width="100"
          align="center">
          <template #default="{row}">
            <el-tag type="primary" effect="plain">
              <i class="el-icon-document" style="margin-right:4px"></i>
              {{ row.assignCount }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="综合成绩"
          width="120"
          align="center">
          <template #default="{row}">
            <el-tag :type="getScoreType(getScore(row)/100)" effect="dark">
              {{ getScore(row) }}
            </el-tag>
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
  methods: {
    getScoreType(percent) {
      if (percent >= 0.85) return 'success'
      if (percent >= 0.6) return 'warning'
      return 'danger'
    },
    getScore(row) {
      var taskScore = (row.videoCount + row.assignCount)/(row.assign + row.videoNum) * row.proportion
      var testScore = (row.testScore)/(row.totalScore) * (100 - row.proportion)
      if (!testScore) {
        return (taskScore).toFixed(2)
      } else {
        return (taskScore + testScore).toFixed(2)
      }
    },
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

      this.search.pageNumber = 1; // 重置页码
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
.score-management {
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

.user-cell, .course-cell {
  display: flex;
  align-items: center;
}

.el-tag {
  border-radius: 12px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
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
</style>