<template>
  <div class="article-management">
    <div class="search-area">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-label">
              <i class="el-icon-notebook-1"></i> 课程名称:
            </span>
            <el-input
              :disabled="type == 0"
              size="small"
              placeholder="请输入课程名称"
              v-model="search.taskName"
              class="tech-input">
            </el-input>
          </div>
        </el-col>  
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-label">
              <i class="el-icon-edit-outline"></i> 标题:
            </span>
            <el-input
              size="small"
              placeholder="请输入标题"
              v-model="search.title"
              class="tech-input">
            </el-input>
          </div>
        </el-col> 
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-label">
              <i class="el-icon-s-flag"></i> 状态:
            </span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.state" 
              placeholder="请选择"
              class="tech-select">
              <el-option label="审核通过" value="0"></el-option>
              <el-option label="未通过" value="1"></el-option>
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

    <div class="table-area">
      <div class="action-bar">
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-plus" 
          @click="add"
          class="action-btn add-btn">
          新增
        </el-button>
        <el-button 
          type="success" 
          size="small" 
          icon="el-icon-edit" 
          :disabled="update.length !== 1"
          @click="updateDataBtn"
          class="action-btn edit-btn">
          修改
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          icon="el-icon-delete" 
          :disabled="update.length <= 0"
          @click="deleteDataBtn"
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="taskName" label="课程名称" width="120">
          <template #default="{row}">
            <div class="course-name">
              <i class="el-icon-notebook-2"></i>
              <span>{{ row.taskName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="state" label="状态" width="100">
          <template #default="{row}">
            <el-tag 
              :type="row.state == 0 ? 'success' : row.state == 1 ? 'warning' : 'info'"
              class="status-tag">
              {{ getStatusText(row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
        <el-table-column label="操作" width="400">
          <template #default="{row}">
            <div class="action-buttons">
              <el-button 
                size="mini" 
                v-if="row.state == 0" 
                @click="offShelf(row.id)"
                class="action-btn reject-btn">
                <i class="el-icon-close"></i> 审核未通过
              </el-button>
              <el-button 
                size="mini" 
                v-if="row.state == 2 || row.state == 1" 
                @click="listing(row.id)"
                class="action-btn approve-btn">
                <i class="el-icon-check"></i> 审核通过
              </el-button>
              <el-button 
                size="mini" 
                @click="toArticleComment(row.id)"
                class="action-btn comment-btn">
                评论
              </el-button>
              <el-button 
                size="mini" 
                @click="updateData(row.id)"
                class="action-btn edit-btn">
                修改
              </el-button>
              <el-popconfirm
                title="确认删除选中的数据？"
                @confirm="deleteDate(row.id)">
                <el-button 
                  size="mini" 
                  slot="reference"
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
        class="tech-pagination">
      </el-pagination>
    </div>

    <add @addFalse="addFalse" flag="1" :taskId="taskId" :type="type" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" flag="1" :taskId="taskId" :type="type" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
  import {getApeArticlePage,removeApeArticle,editApeArticle} from '../../../api/api' 
  import add from '../../../components/system/article/addArticle'
  import update from '../../../components/system/article/updateArticle'
  export default {
    data() {
      return{
        loading: true,
        update: [],
        remove: [],
        updateId: "",
        addVisible: false,
        updateVisible: false,
        taskId: "",
        type: 1,
        search: {
            title: "",
            state: "",
            taskName: "",
            pageNumber: 1,
            pageSize:10,
            type: 0
        },
        total: 0,
        tableData: []
      }
    },
    components: {
      add,
      update
    },
    methods: {
      getStatusText(state) {
        const statusMap = {
          0: '审核通过',
          1: '未通过',
        }
        return statusMap[state] || '未知状态'
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
      toArticleComment(id) {
        var param = {
            "name": "章节作业",
            "url": "/articleComment?id=" + id
        }
        this.$store.commit('menu/addActiveMenu', param)
        this.$router.push("/articleComment?id=" + id)
        this.$store.commit('menu/setActiveMenu', "/articleComment?id=" + id)
      },
      listing(id) {
        var param = {
          id: id,
          state: 0
        }
        editApeArticle(param).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
              title: '成功',
              message: "审核成功"
            });
            this.query();
          } else {
            this.$notify.error({
              title: '错误',
              message: res.message
            });
          }
        })
      },
      offShelf(id) {
        var param = {
          id: id,
          state: 1
        }
        editApeArticle(param).then(res => {
          if(res.code == 1000) {
            this.$notify.success({
              title: '成功',
              message: "审核成功"
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
      searchPage() {
        this.search.pageNumber = 1
        this.query()
      },
      query() {
        getApeArticlePage(this.search).then(res => {
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
        this.search.title = ""
        this.search.state = ""
        this.search.taskName = ""
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
      add() {
        this.addVisible = true
      },
      addFalse() {
        this.addVisible = false
        this.query()
      },
      updateFalse() {
        this.updateId = ''
        this.updateVisible = false
        this.query()
      },
      updateData(id) {
        this.updateId = id
        this.updateVisible = true
      },
      updateDataBtn() {
        this.updateData(this.update[0])
      },
      deleteDataBtn() {
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
        removeApeArticle({ids:ids}).then(res => {
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
    mounted() {
      var name = this.$route.query.name
      var id = this.$route.query.id
      var type = this.$route.query.type
      if (name) {
        this.search.taskName = name
      }
      if (id) {
        this.taskId = id
      }
      if (type) {
        this.type = type
      }
      this.query()
    }
 }
</script>

<style scoped>
.article-management {
  padding: 20px;
  background-color: #F8F7FC;
}

.search-area {
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

.table-area {
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

.course-name {
  display: flex;
  align-items: center;
}

.course-name i {
  color: #7B68EE;
  margin-right: 6px;
}

.status-tag {
  font-weight: 500;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: none;
  color: white;
}

.action-btn i {
  margin-right: 4px;
  font-size: 14px;
}
</style>

<style>
/* 全局样式覆盖 */
.tech-input .el-input__inner {
  border-radius: 20px;
  border: 1px solid #D8D8E5;
  color: #5F4B8B;
  background-color: #F9F8FD;
}

.tech-select .el-input__inner {
  border-radius: 20px;
}

.search-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  border: none;
  border-radius: 20px;
  color: white;
}

.reset-btn {
  border-radius: 20px;
  color: #7B68EE;
  border: 1px solid #D8D8E5;
}

/* 批量操作按钮样式 */
.action-bar .add-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
  color: white;
  border: none;
}

.action-bar .edit-btn {
  background: linear-gradient(135deg, #67C23A, #5DA934);
  color: white;
  border: none;
}

.action-bar .delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
}

.action-bar .el-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 表格内操作按钮样式 */
.action-buttons .approve-btn {
  background: linear-gradient(135deg, #67C23A, #5DA934);
}

.action-buttons .reject-btn {
  background: linear-gradient(135deg, #E6A23C, #D5912D);
}

.action-buttons .comment-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
}

.action-buttons .edit-btn {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
}

.action-buttons .delete-btn {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
}

.action-buttons .el-button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
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

/* 按钮悬停效果 */
.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}
</style>