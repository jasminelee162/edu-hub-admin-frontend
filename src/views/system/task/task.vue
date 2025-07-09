<template>
  <div class="course-management">
    <!-- 搜索区域 -->
    <div class="search-panel">
      <el-row :gutter="15">
        <!-- 课程名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">课程名称:</span>
            <el-input
              size="small"
              placeholder="请输入课程名称"
              v-model="search.name"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        
        <!-- 教师名称搜索 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">教师名称:</span>
            <el-input
              size="small"
              placeholder="请输入教师名称"
              v-model="search.teacherName"
              class="tech-input">
            </el-input>
          </div>
        </el-col>
        
        <!-- 状态选择 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">状态:</span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.state" 
              placeholder="请选择"
              class="tech-select">
              <el-option
                label="上架"
                value="0">
                <span class="status-option">
                  <i class="el-icon-success" style="color:#67C23A"></i> 上架
                </span>
              </el-option>
              <el-option
                label="下架"
                value="1">
                <span class="status-option">
                  <i class="el-icon-error" style="color:#F56C6C"></i> 下架
                </span>
              </el-option>
              <el-option
                label="待审核"
                value="2">
                <span class="status-option">
                  <i class="el-icon-warning" style="color:#E6A23C"></i> 待审核
                </span>
              </el-option>
            </el-select>
          </div>
        </el-col>
        
        <!-- 所属专业选择 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">所属专业:</span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.major" 
              placeholder="请选择"
              class="tech-select">
              <el-option 
                v-for="(item,index) in major" 
                :key="index"
                :label="item.name"
                :value="item.name">
                <span class="status-option">
                  <i class="el-icon-office-building"></i> {{ item.name }}
                </span>
              </el-option>
            </el-select>
          </div>
        </el-col>
        
        <!-- 所属分类选择 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="search-item">
            <span class="search-title">所属分类:</span>
            <el-select 
              clearable 
              size="small" 
              v-model="search.classification" 
              placeholder="请选择"
              class="tech-select">
              <el-option 
                v-for="(item,index) in classification" 
                :key="index"
                :label="item.name"
                :value="item.name">
                <span class="status-option">
                  <i class="el-icon-folder-opened"></i> {{ item.name }}
                </span>
              </el-option>
            </el-select>
          </div>
        </el-col>
        
        <!-- 操作按钮 -->
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

    <!-- 数据面板 -->
    <div class="data-panel">
      <!-- 操作栏 -->
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
          :disabled="update.length != 1"
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

      <!-- 数据表格 -->
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
          prop="name"
          label="课程名称"
          width="120">
          <template #default="{row}">
            <div class="name-cell">
              <i class="el-icon-notebook-2" style="color:#7B68EE; margin-right:8px"></i>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="major"
          label="所属专业"
          width="120">
          <template #default="{row}">
            <div class="major-cell">
              <i class="el-icon-office-building" style="color:#9370DB; margin-right:8px"></i>
              <span>{{ row.major }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="classification"
          label="所属分类"
          width="100">
          <template #default="{row}">
            <div class="class-cell">
              <i class="el-icon-folder-opened" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.classification }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="教师名称"
          width="100">
          <template #default="{row}">
            <div class="teacher-cell">
              <i class="el-icon-user" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.teacherName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="100">
          <template #default="{row}">
            <div class="status-cell">
              <el-tag v-if="row.state == 0" type="success" effect="dark">
                <i class="el-icon-success"></i> 已上架
              </el-tag>
              <el-tag v-if="row.state == 1" type="warning" effect="dark">
                <i class="el-icon-error"></i> 已下架
              </el-tag>
              <el-tag v-if="row.state == 2" type="info" effect="dark">
                <i class="el-icon-warning"></i> 待审核
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="学生数量"
          width="100">
          <template #default="{row}">
            <div class="student-cell">
              <i class="el-icon-user-solid" style="color:#A5A4BF; margin-right:8px"></i>
              <span>{{ row.num }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="500">
          <template #default="{row}">
            <div class="action-buttons">
              <el-tooltip content="评论管理" placement="top">
                <el-button 
                  size="mini" 
                  type="warning" 
                  @click="toTaskComment(row.id)"
                  class="table-action-btn comment-btn">
                  <i class="el-icon-chat-dot-round"></i> 评论
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="学生管理" placement="top">
                <el-button 
                  size="mini" 
                  type="success" 
                  @click="toTaskStudent(row.id)"
                  class="table-action-btn student-btn">
                  <i class="el-icon-user"></i> 学生
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="学习情况" placement="top">
                <el-button 
                  size="mini" 
                  type="primary" 
                  @click="toTaskStudy(row.id)"
                  class="table-action-btn study-btn">
                  <i class="el-icon-data-line"></i> 学习
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="章节管理" placement="top">
                <el-button 
                  size="mini" 
                  type="info" 
                  @click="toChapter(row.id, row.name)"
                  class="table-action-btn chapter-btn">
                  <i class="el-icon-tickets"></i> 章节
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="笔记管理" placement="top">
                <el-button 
                  size="mini" 
                  type="warning" 
                  @click="toArticle(row.id, row.name)"
                  class="table-action-btn note-btn">
                  <i class="el-icon-edit-outline"></i> 笔记
                </el-button>
              </el-tooltip>
              
              <el-tooltip :content="row.state == 0 ? '下架课程' : '上架课程'" placement="top">
                <el-button 
                  size="mini" 
                  :type="row.state == 0 ? 'danger' : 'primary'" 
                  @click="row.state == 0 ? offShelf(row.id) : listing(row.id)"
                  class="table-action-btn shelf-btn">
                  <i :class="row.state == 0 ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i> 
                  {{ row.state == 0 ? '下架' : '上架' }}
                </el-button>
              </el-tooltip>
              
              <el-popconfirm
                title="确认删除此课程？"
                @confirm="deleteDate(row.id)"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-warning"
                icon-color="#7B68EE">
                <el-tooltip content="删除课程" placement="top">
                  <el-button 
                    size="mini"
                    type="danger"
                    class="table-action-btn delete-btn">
                    <i class="el-icon-delete"></i> 删除
                  </el-button>
                </el-tooltip>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    
    <add @addFalse="addFalse" flag="1" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" flag="1" :updateId="updateId" :updateVisible="updateVisible"></update>
  </div>
</template>

<script>
import {getTaskPage,removeTask,getClassificationList,getMajorList,editTask} from '../../../api/api'
import add from '../../../components/system/task/addTask'
import update from '../../../components/system/task/updateTask'
export default {
  data() {
    return{
      loading: true,
      update: [],
      remove: [],
      updateId: "",
      addVisible: false,
      updateVisible: false,
      search: {
          name: "",
          taskDescribe: "",
          teacherName: "",
          state: "",
          major: "",
          classification: "",
          pageNumber: 1,
          pageSize:10,
          type: 0
      },
      total: 0,
      tableData: [],
      major: [],
      classification: []
    }
  },
  components: {
    add,
    update
  },
  methods: {
    tableHeaderStyle() {
      return {
        'color': '#1E2B45',
        'background-color': '#ECE9F4',
        'font-weight': 'bold',
        'font-size': '14px'
      }
    },
    tableRowStyle() {
      return {
        'color': '#6A5ACD',
        'font-size': '14px',
        'font-family':'Microsoft YaHei',
        'white-space': 'nowrap'
      }
    },
    toTaskStudy(id) {
      var param = {
          "name": "学习情况",
          "url": "/studyInfo?id=" + id
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/studyInfo?id=" + id)
      this.$store.commit('menu/setActiveMenu', "/studyInfo?id=" + id)
    },
    toTaskComment(id) {
      var param = {
          "name": "评论列表",
          "url": "/taskComment?id=" + id
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/taskComment?id=" + id)
      this.$store.commit('menu/setActiveMenu', "/taskComment?id=" + id)
    },
    toTaskStudent(id) {
      var param = {
          "name": "学生列表",
          "url": "/taskStudent?id=" + id
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/taskStudent?id=" + id)
      this.$store.commit('menu/setActiveMenu', "/taskStudent?id=" + id)
    },
    toArticle(id,name) {
      var param = {
          "name": "笔记管理",
          "url": "/article?id=" + id + "&name=" + name + "&type=0"
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/article?id=" + id + "&name=" + name + "&type=0")
      this.$store.commit('menu/setActiveMenu', "/article?id=" + id + "&name=" + name + "&type=0")
    },
    toChapter(id,name) {
      var param = {
          "name": "章节管理",
          "url": "/chapter?id=" + id + "&name=" + name + "&type=0"
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/chapter?id=" + id + "&name=" + name + "&type=0")
      this.$store.commit('menu/setActiveMenu', "/chapter?id=" + id + "&name=" + name + "&type=0")
    },
    listing(id) {
      var param = {
        id: id,
        state: 0
      }
      editTask(param).then(res => {
        if(res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "上架成功"
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
      editTask(param).then(res => {
        if(res.code == 1000) {
          this.$notify.success({
            title: '成功',
            message: "下架成功"
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
    getMajorList() {
      getMajorList().then(res => {
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
    getClassificationList() {
      getClassificationList().then(res => {
        if(res.code == 1000) {
          this.classification = res.data
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
      getTaskPage(this.search).then(res => {
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
      this.search.name = ""
      this.search.taskDescribe = ""
      this.search.teacherName = ""
      this.search.state = ""
      this.search.major = ""
      this.search.classification = ""
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
      this.updateId = ""
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
        type: 'warning',
        customClass: 'tech-message-box'
      }).then(() => {
        this.deleteDate(this.remove.join(","))
      }).catch(() => {});
    },
    deleteDate(ids) {
      removeTask({ids:ids}).then(res => {
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
    this.getMajorList()
    this.getClassificationList()
    this.query()
  }
}
</script>

<style scoped>

.course-management {
  padding: 24px;
  background-color: #f8f9fc;
  min-height: calc(100vh - 48px);
}

.search-panel {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.search-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.search-title {
  font-size: 13px;
  color: #5a6487;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-actions {
  display: flex;
  align-items: flex-end;
  height: 100%;
  justify-content: flex-end;
}

.data-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.08);
  border: 1px solid #e6e8f0;
}

.action-bar {
  padding: 0 0 20px 0;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f0f2f7;
}

.name-cell, .major-cell, .class-cell, 
.teacher-cell, .status-cell, .student-cell {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.table-action-btn {
  border-radius: 16px;
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  height: 28px;
  line-height: 18px;
}

.table-action-btn.comment-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
}

.table-action-btn.student-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.table-action-btn.study-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
}

.table-action-btn.chapter-btn {
  background: linear-gradient(135deg, #909399, #A6A9AD);
}

.table-action-btn.note-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
}

.table-action-btn.shelf-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
}

.table-action-btn.delete-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
}

.table-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  opacity: 0.9;
}
</style>

<style>
/* 全局样式 */
.tech-input .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
  transition: all 0.25s ease;
  font-size: 13px;
}

.tech-input .el-input__inner:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.15);
}

.tech-select .el-input__inner {
  border-radius: 8px;
  border: 1px solid #e0e3ed;
  color: #3d4766;
  background-color: #fcfcff;
  height: 36px;
  line-height: 36px;
}

.search-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 9px 18px;
  height: 36px;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transition: all 0.25s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.reset-btn {
  border-radius: 8px;
  color: #6c5ce7;
  border: 1px solid #e0e3ed;
  padding: 9px 18px;
  height: 36px;
  background: #ffffff;
  transition: all 0.25s ease;
}

.reset-btn:hover {
  background-color: #f8f9ff;
  border-color: #d5d9e8;
}

.action-btn {
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 12px;
  min-width: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.action-btn i {
  margin-right: 5px;
  font-size: 14px;
}

.add-btn {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  color: white;
}

.edit-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
}

.delete-btn {
  background: linear-gradient(135deg, #ff7675, #e66767);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

.tech-table {
  border-radius: 12px;
  border: 1px solid #e6e8f0;
  overflow: hidden;
}

.tech-table .el-table__header th {
  font-weight: 600;
}

.tech-table .el-table__body tr:hover>td {
  background-color: #f8f9ff !important;
}

.tech-table .el-table__body td {
  transition: background-color 0.2s ease;
}

.tech-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.tech-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #6c5ce7;
  color: white;
  font-weight: 600;
}

.tech-pagination .el-pagination.is-background .el-pager li:hover {
  color: #6c5ce7;
}

.tech-message-box {
  border-radius: 12px;
  border: 1px solid #6c5ce7;
}

.tech-message-box .el-message-box__title {
  color: #3d4766;
  font-weight: 600;
}

.tech-message-box .el-message-box__content {
  color: #5a6487;
}

.tech-message {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(100, 87, 255, 0.15);
  border: none;
}

.tech-message .el-message__content {
  color: #3d4766;
  font-weight: 500;
}

.el-popconfirm__action {
  text-align: center;
}

.el-popconfirm__action button {
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.el-popconfirm__action button:first-child {
  background: linear-gradient(135deg, #6c5ce7, #5a4bd6);
  border: none;
  color: white;
}

.el-popconfirm__action button:last-child {
  color: #6c5ce7;
  border: 1px solid #e0ddf5;
  background: #f5f4ff;
}

/* 移除输入框图标 */
.tech-input .el-input__prefix {
  display: none;
}
.tech-input .el-input__inner {
  padding-left: 15px;
}

/* 禁用状态按钮样式 */
.el-button.is-disabled {
  opacity: 0.6;
}

/* 标签样式 */
.el-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border: none;
  font-weight: 500;
}

.el-tag i {
  margin-right: 4px;
}

.el-tag--success {
  background: linear-gradient(135deg, #67C23A, #85CE61);
}

.el-tag--warning {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
}

.el-tag--info {
  background: linear-gradient(135deg, #909399, #A6A9AD);
}

.el-tag--danger {
  background: linear-gradient(135deg, #F56C6C, #F78989);
}
</style>