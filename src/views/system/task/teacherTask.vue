<template>
  <div class="course-management">
    <div class="search-table">
      <div class="search">
        <el-row :gutter="15" style="padding:15px">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="search-title">
                <i class="el-icon-notebook-2"></i> 课程名称:
              </span>
              <el-input
                size="small"
                placeholder="请输入课程名称"
                v-model="search.name"
                class="tech-input">
                <i slot="prefix" class="el-icon-edit-outline"></i>
              </el-input>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="search-title">
                <i class="el-icon-office-building"></i> 所属专业:
              </span>
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
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="search-item">
              <span class="search-title">
                <i class="el-icon-folder-opened"></i> 所属分类:
              </span>
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
                    <i class="el-icon-folder"></i> {{ item.name }}
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
      
      <div class="table">
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
            width="600">
            <template #default="{row}">
              <div class="action-buttons">
                <el-button 
                  size="mini" 
                  type="warning" 
                  @click="toTaskComment(row.id)"
                  class="action-btn comment-btn">
                  <i class="el-icon-chat-dot-round"></i> 评论
                </el-button>
                
                <el-button 
                  size="mini" 
                  type="success" 
                  @click="toTaskStudent(row.id)"
                  class="action-btn student-btn">
                  <i class="el-icon-user"></i> 学生
                </el-button>
                
                <el-button 
                  size="mini" 
                  type="primary" 
                  @click="toTaskStudy(row.id)"
                  class="action-btn study-btn">
                  <i class="el-icon-data-line"></i> 学习
                </el-button>
                
                <el-button 
                  size="mini" 
                  type="info" 
                  @click="toChapter(row.id, row.name)"
                  class="action-btn chapter-btn">
                  <i class="el-icon-tickets"></i> 章节
                </el-button>
                
                <el-button 
                  size="mini" 
                  type="warning" 
                  @click="toArticle(row.id, row.name)"
                  class="action-btn note-btn">
                  <i class="el-icon-edit-outline"></i> 笔记
                </el-button>
                
                <el-button 
                  size="mini" 
                  type="success" 
                  @click="updateData(row.id)"
                  class="action-btn edit-btn">
                  <i class="el-icon-edit"></i> 修改
                </el-button>
                
                <el-popconfirm
                  title="确认删除此课程？"
                  @confirm="deleteDate(row.id)"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  icon="el-icon-warning"
                  icon-color="#7B68EE">
                  <el-button 
                    size="mini"
                    type="danger"
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
    </div>
    
    <add @addFalse="addFalse" flag="2" :addVisible="addVisible"></add>
    <update @updateFalse="updateFalse" flag="2" :updateId="updateId" :updateVisible="updateVisible"></update>
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
          type: 1
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
          "name": "学生笔记管理",
          "url": "/teacherArticle?id=" + id + "&name=" + name + "&type=0"
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/teacherArticle?id=" + id + "&name=" + name + "&type=0")
      this.$store.commit('menu/setActiveMenu', "/teacherArticle?id=" + id + "&name=" + name + "&type=0")
    },
    toChapter(id,name) {
      var param = {
          "name": "教师章节管理",
          "url": "/teacherChapter?id=" + id + "&name=" + name + "&type=0"
      }
      this.$store.commit('menu/addActiveMenu', param)
      this.$router.push("/teacherChapter?id=" + id + "&name=" + name + "&type=0")
      this.$store.commit('menu/setActiveMenu', "/teacherChapter?id=" + id + "&name=" + name + "&type=0")
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
  padding: 20px;
  background-color: #F8F7FC;
}

.search-table {
  width: 100%;
}

.search {
  background: #ffffff;
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

.table {
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(123, 104, 238, 0.1);
}

.action-bar {
  padding: 10px 0 15px 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #F0EEF7;
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

.action-btn {
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 12px;
  min-width: 60px;
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

.action-btn.comment-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
  color: white;
  border: none;
}

.action-btn.student-btn {
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
  border: none;
}

.action-btn.study-btn {
  background: linear-gradient(135deg, #409EFF, #3A8BDF);
  color: white;
  border: none;
}

.action-btn.chapter-btn {
  background: linear-gradient(135deg, #909399, #A6A9AD);
  color: white;
  border: none;
}

.action-btn.note-btn {
  background: linear-gradient(135deg, #E6A23C, #EEB955);
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