<template>
  <div class="comment-container">
    <div class="search-panel">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-chat-line-round"></i> 内容:
            </span>
            <el-input
              size="small"
              placeholder="请输入内容"
              v-model="search.content"
              class="tech-input">
              <i slot="prefix" class="el-icon-edit"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">
              <i class="el-icon-user"></i> 创建者:
            </span>
            <el-input
              size="small"
              placeholder="请输入评论人"
              v-model="search.createBy"
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

      <div class="action-bar">
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="update.length <= 0"
          @click="deleteDataBtn"
          class="action-btn delete-btn">
          批量删除
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
          prop="content" 
          label="内容"
          min-width="300">
          <template #default="{row}">
            <div class="content-cell">
              <i class="el-icon-chat-dot-round"></i>
              <span>{{ row.content }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="createBy" 
          label="评论人"
          width="150">
          <template #default="{row}">
            <div class="user-cell">
              <i class="el-icon-user"></i>
              <span>{{ row.createBy }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="createTime" 
          label="评论时间"
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
          width="120"
          fixed="right">
          <template #default="{row}">
<el-popconfirm
            title="确认删除这条评论？"
            @confirm="deleteDate(row.id)"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-warning"
            icon-color="#7B68EE">
            <el-button 
              size="mini" 
              slot="reference" 
              class="action-btn delete-btn">
              删除
            </el-button>
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
        :total="total"
        class="tech-pagination">
      </el-pagination>
    </div>
</template>

<script>
  import {getApeArticleCommentPage,removeApeArticleComment} from '../../../api/api' 
  export default {
    data() {
      return{
        articleId: "",
        loading: true,
        update: [],
        remove: [],
        updateId: "", 
        addVisible: false,
        updateVisible: false,
        search: {
            taskId: "",
            content: "",
            createBy: "",
            pageNumber: 1,
            pageSize:10
        },
        total: 0,
        tableData: []
      }
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
        getApeArticleCommentPage(this.search).then(res => {
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
        this.search.taskId = ""
        this.search.content = ""
        this.search.createBy = ""
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
      deleteDataBtn() {
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
        removeApeArticleComment({ids:ids}).then(res => {
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
    },
    mounted() {
      var articleId = this.$route.query.id
      if (articleId) {
          this.search.taskId = articleId
      }
      this.query()
    }
 }
</script>

<style scoped>
.comment-container {
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

.content-cell, .user-cell, .time-cell {
  display: flex;
  align-items: center;
}

.content-cell i {
  color: #7B68EE;
  margin-right: 8px;
  font-size: 16px;
}

.user-cell i {
  color: #9370DB;
  margin-right: 8px;
}

.time-cell i {
  color: #A5A4BF;
  margin-right: 8px;
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

.action-btn.delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
}

.action-btn.delete-btn:hover {
  background: linear-gradient(135deg, #FF5252, #FF6B6B);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
  transform: translateY(-1px);
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
</style>